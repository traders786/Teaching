import { Router, Response } from 'express';
import { db } from '../db/schema.js';
import { verifyToken, AuthenticatedRequest } from '../middleware/auth.js';
import { createGoogleMeetSession, getGoogleMeetSettings } from '../services/googleMeet.js';
import { sendTeacherAssignedEmail } from '../services/emailService.js';

export const demosRouter = Router();

// GET /api/demos/meet-status (Check Google Meet configuration)
demosRouter.get(['/meet-status', '/zoom-status'], verifyToken, (req: AuthenticatedRequest, res: Response) => {
  const settings = getGoogleMeetSettings();
  return res.json({
    isConfigured: true,
    provider: 'GOOGLE_MEET',
    workspaceDomain: settings.workspaceDomain,
    defaultRoomPrefix: settings.defaultRoomPrefix,
  });
});

// GET /api/demos (List all demo sessions with attendees and teacher details)
demosRouter.get('/', verifyToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status } = req.query;
    let query = `
      SELECT ds.*, t.name as teacher_name, t.email as teacher_email,
        (SELECT COUNT(*) FROM demo_attendees da WHERE da.demo_id = ds.id) as attendee_count,
        (SELECT l.student_name FROM demo_attendees da JOIN leads l ON da.lead_id = l.id WHERE da.demo_id = ds.id LIMIT 1) as student_name,
        (SELECT l.student_class FROM demo_attendees da JOIN leads l ON da.lead_id = l.id WHERE da.demo_id = ds.id LIMIT 1) as student_class,
        (SELECT l.parent_name FROM demo_attendees da JOIN leads l ON da.lead_id = l.id WHERE da.demo_id = ds.id LIMIT 1) as parent_name,
        (SELECT l.mobile_number FROM demo_attendees da JOIN leads l ON da.lead_id = l.id WHERE da.demo_id = ds.id LIMIT 1) as parent_phone
      FROM demo_sessions ds
      LEFT JOIN teachers t ON ds.teacher_id = t.id
    `;
    const params: any[] = [];

    if (status && status !== 'ALL') {
      query += ' WHERE ds.status = ?';
      params.push(status);
    }

    query += ' ORDER BY ds.date DESC, ds.start_time DESC';

    const demos = db.prepare(query).all(...params);

    return res.json({ demos });
  } catch (error: any) {
    console.error('Fetch demos error:', error);
    return res.status(500).json({ error: 'Failed to retrieve demo sessions.' });
  }
});

// POST /api/demos/create-meet (Dedicated 1-Click Google Meet Demo Session Creation)
demosRouter.post(['/create-meet', '/create-zoom'], verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const leadId = req.body.lead_id || req.body.leadId;
    let lead: any = null;
    if (leadId) {
      lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(leadId);
    }

    const scheduledAt = req.body.scheduled_at || req.body.scheduledAt;
    const date = req.body.date || (scheduledAt ? scheduledAt.slice(0, 10) : new Date().toISOString().slice(0, 10));
    const startTime = req.body.startTime || req.body.start_time || (scheduledAt && scheduledAt.length > 11 ? scheduledAt.slice(11, 16) : '17:00');
    const endTime = req.body.endTime || req.body.end_time || '17:45';
    const teacherId = req.body.teacherId || req.body.teacher_id || null;
    const notes = req.body.notes || (lead ? `Evaluation trial for ${lead.student_name} (${lead.student_class})` : 'upspeaq Trial Session');

    const studentTitleName = lead ? `${lead.student_name} (${lead.student_class})` : 'Student Evaluation';
    const topic = req.body.topic || req.body.title || `upspeaq Demo: ${studentTitleName}`;

    // Combine date + startTime for ISO
    const startDateTime = new Date(`${date}T${startTime}:00`);

    // Create Google Meet room session
    const customLink = req.body.meetingLink || req.body.meeting_link;
    let customCode: string | undefined = undefined;
    if (customLink && customLink.includes('meet.google.com/')) {
      customCode = customLink.split('meet.google.com/')[1].split('?')[0];
    }

    const meetSession = await createGoogleMeetSession({
      topic,
      startTime: isNaN(startDateTime.getTime()) ? undefined : startDateTime.toISOString(),
      durationMinutes: 45,
      customMeetingLink: customLink,
    });

    const demoId = 'demo_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);

    db.prepare(`
      INSERT INTO demo_sessions (
        id, title, date, start_time, end_time, teacher_id, meeting_link,
        capacity, status, notes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, 2, 'SCHEDULED', ?)
    `).run(
      demoId,
      topic,
      date,
      startTime,
      endTime,
      teacherId || null,
      meetSession.joinUrl,
      notes || null
    );

    // If attached to a lead, register attendee, update lead status to DEMO_SCHEDULED, and log activity
    if (lead) {
      const attendeeId = 'da_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
      db.prepare(`
        INSERT INTO demo_attendees (id, demo_id, lead_id, student_name, parent_phone, attendance_status)
        VALUES (?, ?, ?, ?, ?, 'REGISTERED')
      `).run(attendeeId, demoId, lead.id, lead.student_name, lead.mobile_number);

      db.prepare("UPDATE leads SET status = 'DEMO_SCHEDULED', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(lead.id);

      // Fetch teacher name if assigned
      let teacherName = 'Assigned Coach';
      if (teacherId) {
        const teacherRow = db.prepare('SELECT name FROM teachers WHERE id = ?').get(teacherId) as any;
        if (teacherRow?.name) teacherName = teacherRow.name;
      }

      db.prepare(`
        INSERT INTO lead_activities (id, lead_id, action_type, description, actor_name, actor_id, metadata_json)
        VALUES (?, ?, 'DEMO_SCHEDULED', ?, ?, ?, ?)
      `).run(
        'act_' + Date.now().toString(36),
        lead.id,
        `Google Meet Demo Session created for ${date} at ${startTime} (Educator: ${teacherName}). Google Meet: ${meetSession.joinUrl}`,
        req.user?.name || 'Academic Coordinator',
        req.user?.id,
        JSON.stringify({
          demoId,
          meetingCode: meetSession.meetingCode,
          meetingLink: meetSession.joinUrl,
          provider: 'GOOGLE_MEET',
          teacherId,
        })
      );
    }

    const created = db.prepare(`
      SELECT ds.*, t.name as teacher_name, t.email as teacher_email
      FROM demo_sessions ds
      LEFT JOIN teachers t ON ds.teacher_id = t.id
      WHERE ds.id = ?
    `).get(demoId);

    // If no teacher assigned, broadcast to ALL active teachers — first to claim wins
    if (!teacherId) {
      const studentLabel = lead ? `${lead.student_name} (${lead.student_class})` : 'a new student';
      const activeTeacherUsers = db.prepare(`
        SELECT u.id FROM users u
        JOIN teachers t ON u.teacher_id = t.id
        WHERE t.status = 'ACTIVE' AND u.role = 'TEACHER'
      `).all() as any[];

      for (const u of activeTeacherUsers) {
        db.prepare(`
          INSERT INTO notifications (id, user_id, user_role, title, message, type, link_url)
          VALUES (?, ?, 'TEACHER', '🎯 New Demo Available — Claim It!', ?, 'SCHEDULE_CHANGE', '/teacher/demos')
        `).run(
          'notif_' + Date.now().toString(36) + '_' + u.id,
          u.id,
          `A new demo session for ${studentLabel} is available on ${date} at ${startTime}. First teacher to accept it gets assigned!`
        );
      }
    }

    return res.status(201).json({
      success: true,
      demo: created,
      meet: meetSession,
      zoom: meetSession, // backward-compat object
      message: 'Google Meet Demo Session created successfully!',
    });
  } catch (error: any) {
    console.error('Create Google Meet demo error:', error);
    return res.status(500).json({ error: error.message || 'Failed to create Google Meet demo session.' });
  }
});

// POST /api/demos (Create new demo session - standard)
demosRouter.post('/', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const leadId = req.body.lead_id || req.body.leadId;
    let lead: any = null;
    if (leadId) {
      lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(leadId);
    }

    const scheduledAt = req.body.scheduled_at || req.body.scheduledAt;
    const date = req.body.date || (scheduledAt ? scheduledAt.slice(0, 10) : new Date().toISOString().slice(0, 10));
    const startTime = req.body.startTime || req.body.start_time || (scheduledAt && scheduledAt.length > 11 ? scheduledAt.slice(11, 16) : '17:00');
    const endTime = req.body.endTime || req.body.end_time || '17:45';
    const teacherId = req.body.teacherId || req.body.teacher_id || null;
    const capacity = req.body.capacity || 2;
    const notes = req.body.notes || (lead ? `Class ${lead.student_class} evaluation` : null);
    const title = req.body.title || (lead ? `Evaluation: ${lead.student_name}` : 'Live Trial Session');

    let meetingLink = req.body.meetingLink || req.body.meeting_link;

    // If meeting link is not provided, generate Google Meet session
    if (!meetingLink) {
      const meetSession = await createGoogleMeetSession({
        topic: title,
        durationMinutes: 45,
      });
      meetingLink = meetSession.joinUrl;
    }

    const demoId = 'demo_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);

    db.prepare(`
      INSERT INTO demo_sessions (
        id, title, date, start_time, end_time, teacher_id, meeting_link,
        capacity, status, notes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'SCHEDULED', ?)
    `).run(
      demoId,
      title.trim(),
      date,
      startTime.trim(),
      endTime.trim(),
      teacherId || null,
      meetingLink,
      capacity,
      notes || null
    );

    if (lead) {
      const attendeeId = 'da_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
      db.prepare(`
        INSERT INTO demo_attendees (id, demo_id, lead_id, student_name, parent_phone, attendance_status)
        VALUES (?, ?, ?, ?, ?, 'REGISTERED')
      `).run(attendeeId, demoId, lead.id, lead.student_name, lead.mobile_number);

      db.prepare("UPDATE leads SET status = 'DEMO_SCHEDULED', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(lead.id);

      db.prepare(`
        INSERT INTO lead_activities (id, lead_id, action_type, description, actor_name, actor_id)
        VALUES (?, ?, 'DEMO_SCHEDULED', ?, ?, ?)
      `).run(
        'act_' + Date.now(),
        lead.id,
        `Demo session booked for ${date} at ${startTime}. Google Meet: ${meetingLink}`,
        req.user?.name || 'Administrator',
        req.user?.id
      );
    }

    const created = db.prepare('SELECT * FROM demo_sessions WHERE id = ?').get(demoId);

    // If no teacher assigned, broadcast to ALL active teachers — first to claim wins
    if (!teacherId) {
      const studentLabel = lead ? `${lead.student_name} (${lead.student_class})` : 'a new student';
      const activeTeacherUsers = db.prepare(`
        SELECT u.id FROM users u
        JOIN teachers t ON u.teacher_id = t.id
        WHERE t.status = 'ACTIVE' AND u.role = 'TEACHER'
      `).all() as any[];

      for (const u of activeTeacherUsers) {
        db.prepare(`
          INSERT INTO notifications (id, user_id, user_role, title, message, type, link_url)
          VALUES (?, ?, 'TEACHER', '🎯 New Demo Available — Claim It!', ?, 'SCHEDULE_CHANGE', '/teacher/demos')
        `).run(
          'notif_' + Date.now().toString(36) + '_' + u.id,
          u.id,
          `A new demo session for ${studentLabel} is available on ${date} at ${startTime}. First teacher to accept it gets assigned!`
        );
      }
    }

    return res.status(201).json({ demo: created, message: 'Google Meet demo session scheduled successfully.' });
  } catch (error: any) {
    console.error('Create demo error:', error);
    return res.status(500).json({ error: 'Failed to create demo session.' });
  }
});

// GET /api/demos/:id (Demo details + attendee roster)
demosRouter.get('/:id', verifyToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const demo = db.prepare(`
      SELECT ds.*, t.name as teacher_name, t.email as teacher_email
      FROM demo_sessions ds
      LEFT JOIN teachers t ON ds.teacher_id = t.id
      WHERE ds.id = ?
    `).get(req.params.id) as any;

    if (!demo) {
      return res.status(404).json({ error: 'Demo session not found.' });
    }

    const attendees = db.prepare(`
      SELECT da.*, l.student_class, l.city, l.interest_area, l.status as lead_status
      FROM demo_attendees da
      JOIN leads l ON da.lead_id = l.id
      WHERE da.demo_id = ?
      ORDER BY da.created_at ASC
    `).all(req.params.id);

    return res.json({ demo, attendees });
  } catch (error: any) {
    console.error('Fetch demo detail error:', error);
    return res.status(500).json({ error: 'Failed to retrieve demo session details.' });
  }
});

// PATCH /api/demos/:id (Update demo session)
demosRouter.patch('/:id', verifyToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, date, startTime, endTime, teacherId, meetingLink, capacity, status, notes } = req.body;
    const current = db.prepare('SELECT * FROM demo_sessions WHERE id = ?').get(req.params.id);
    if (!current) {
      return res.status(404).json({ error: 'Demo session not found.' });
    }

    const updates: string[] = [];
    const params: any[] = [];

    if (title !== undefined) { updates.push('title = ?'); params.push(title); }
    if (date !== undefined) { updates.push('date = ?'); params.push(date); }
    if (startTime !== undefined) { updates.push('start_time = ?'); params.push(startTime); }
    if (endTime !== undefined) { updates.push('end_time = ?'); params.push(endTime); }
    if (teacherId !== undefined) { updates.push('teacher_id = ?'); params.push(teacherId); }
    if (meetingLink !== undefined) { updates.push('meeting_link = ?'); params.push(meetingLink); }
    if (capacity !== undefined) { updates.push('capacity = ?'); params.push(capacity); }
    if (status !== undefined) { updates.push('status = ?'); params.push(status); }
    if (notes !== undefined) { updates.push('notes = ?'); params.push(notes); }

    if (updates.length > 0) {
      updates.push("updated_at = CURRENT_TIMESTAMP");
      params.push(req.params.id);
      db.prepare(`UPDATE demo_sessions SET ${updates.join(', ')} WHERE id = ?`).run(...params);
    }

    const updated = db.prepare('SELECT * FROM demo_sessions WHERE id = ?').get(req.params.id) as any;

    // If a teacher was just assigned or changed, notify attendees via email
    if (teacherId && teacherId !== (current as any).teacher_id) {
      const teacher = db.prepare('SELECT name, email, biography, expertise, google_meet_link FROM teachers WHERE id = ?').get(teacherId) as any;
      const teacherName = teacher?.name || 'Teacher';
      const effectiveMeetingLink = (teacher?.google_meet_link && teacher.google_meet_link.trim()) || updated.meeting_link || 'https://meet.google.com';

      const attendees = db.prepare(`
        SELECT da.*, l.email, l.student_name, l.parent_name, l.student_class
        FROM demo_attendees da
        LEFT JOIN leads l ON da.lead_id = l.id
        WHERE da.demo_id = ?
      `).all(req.params.id) as any[];

      const dateFormatted = new Date(updated.date).toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });

      for (const att of attendees) {
        if (att.email && att.email.includes('@')) {
          sendTeacherAssignedEmail({
            to: att.email.trim(),
            studentName: att.student_name || 'Student',
            parentName: att.parent_name || `Parent of ${att.student_name || 'Student'}`,
            dateStr: dateFormatted || updated.date,
            timeStr: updated.start_time,
            teacherName: teacherName,
            teacherBio: teacher?.biography,
            teacherExpertise: teacher?.expertise,
            meetingLink: effectiveMeetingLink,
          }).catch((err) => console.error('Error emailing parent after teacher assignment:', err));
        }
      }
    }

    return res.json({ demo: updated, message: 'Demo session updated.' });
  } catch (error: any) {
    console.error('Update demo error:', error);
    return res.status(500).json({ error: 'Failed to update demo session.' });
  }
});

// POST /api/demos/:id/attendees (Add a lead as attendee)
demosRouter.post('/:id/attendees', verifyToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { leadId } = req.body;
    if (!leadId) {
      return res.status(400).json({ error: 'leadId is required.' });
    }

    const demo = db.prepare('SELECT * FROM demo_sessions WHERE id = ?').get(req.params.id) as any;
    if (!demo) {
      return res.status(404).json({ error: 'Demo session not found.' });
    }

    const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(leadId) as any;
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found.' });
    }

    // Check existing attendee
    const existing = db.prepare('SELECT id FROM demo_attendees WHERE demo_id = ? AND lead_id = ?').get(demo.id, lead.id);
    if (existing) {
      return res.status(400).json({ error: 'This student is already added to this demo session.' });
    }

    const attendeeId = 'att_' + Date.now().toString(36);
    db.prepare(`
      INSERT INTO demo_attendees (id, demo_id, lead_id, student_name, parent_phone, attendance_status, conversion_potential)
      VALUES (?, ?, ?, ?, ?, 'REGISTERED', 'MEDIUM')
    `).run(
      attendeeId,
      demo.id,
      lead.id,
      lead.student_name,
      lead.mobile_number
    );

    // Update lead status to DEMO_SCHEDULED
    db.prepare("UPDATE leads SET status = 'DEMO_SCHEDULED', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(lead.id);

    // Add activity log
    db.prepare(`
      INSERT INTO lead_activities (id, lead_id, action_type, description, actor_name, actor_id)
      VALUES (?, ?, 'DEMO_SCHEDULED', ?, ?, ?)
    `).run(
      'act_' + Date.now(),
      lead.id,
      `Scheduled for demo session "${demo.title}" on ${demo.date} at ${demo.start_time}. Google Meet: ${demo.meeting_link}`,
      req.user?.name || 'Administrator',
      req.user?.id
    );

    return res.status(201).json({ message: 'Student added to demo session successfully.' });
  } catch (error: any) {
    console.error('Add attendee error:', error);
    return res.status(500).json({ error: 'Failed to add attendee to demo session.' });
  }
});

// PATCH /api/demos/:id/attendees/:attendeeId (Mark attendance & feedback outcome)
demosRouter.patch('/:id/attendees/:attendeeId', verifyToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { attendanceStatus, outcome, feedback, conversionPotential } = req.body;

    const updates: string[] = [];
    const params: any[] = [];

    if (attendanceStatus !== undefined) { updates.push('attendance_status = ?'); params.push(attendanceStatus); }
    if (outcome !== undefined) { updates.push('outcome = ?'); params.push(outcome); }
    if (feedback !== undefined) { updates.push('feedback = ?'); params.push(feedback); }
    if (conversionPotential !== undefined) { updates.push('conversion_potential = ?'); params.push(conversionPotential); }

    if (updates.length > 0) {
      updates.push("updated_at = CURRENT_TIMESTAMP");
      params.push(req.params.attendeeId);
      db.prepare(`UPDATE demo_attendees SET ${updates.join(', ')} WHERE id = ?`).run(...params);
    }

    const attendee = db.prepare('SELECT * FROM demo_attendees WHERE id = ?').get(req.params.attendeeId) as any;
    if (attendee) {
      // If attended, update lead status to DEMO_COMPLETED or FOLLOW_UP
      const leadStatus = attendanceStatus === 'ATTENDED' ? 'DEMO_COMPLETED' : (attendanceStatus === 'ABSENT' ? 'FOLLOW_UP' : undefined);
      if (leadStatus) {
        db.prepare("UPDATE leads SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(leadStatus, attendee.lead_id);
      }

      // Log activity
      db.prepare(`
        INSERT INTO lead_activities (id, lead_id, action_type, description, actor_name, actor_id)
        VALUES (?, ?, 'DEMO_COMPLETED', ?, ?, ?)
      `).run(
        'act_' + Date.now(),
        attendee.lead_id,
        `Demo evaluation marked: Attendance: ${attendanceStatus}, Outcome: ${outcome || 'Evaluated'}, Potential: ${conversionPotential || 'N/A'}. Feedback: "${feedback || 'No comments'}"`,
        req.user?.name || 'Administrator',
        req.user?.id
      );
    }

    return res.json({ message: 'Attendance & outcome updated successfully.' });
  } catch (error: any) {
    console.error('Update attendee error:', error);
    return res.status(500).json({ error: 'Failed to update attendee record.' });
  }
});
