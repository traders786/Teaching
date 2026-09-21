import { Router, Request, Response } from 'express';
import { db } from '../db/schema.js';
import { verifyToken, signToken, AuthenticatedRequest } from '../middleware/auth.js';
import { createGoogleMeetSession } from '../services/googleMeet.js';

export const leadsRouter = Router();

function normalizePhone(phone: string): string {
  let cleaned = phone.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+91')) {
    return cleaned;
  }
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    return '+' + cleaned;
  }
  if (cleaned.length === 10) {
    return '+91' + cleaned;
  }
  return cleaned;
}

/**
 * Automatically creates a Google Meet demo session, places it into the open teacher claim pool,
 * and sends real-time in-app notifications to all active teachers on a first-come-first-serve basis.
 */
export async function autoScheduleLeadDemo(leadId: string) {
  const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(leadId) as any;
  if (!lead) return null;

  // Check if a demo attendee record already exists for this lead
  const existingAttendee = db.prepare('SELECT id FROM demo_attendees WHERE lead_id = ?').get(leadId);
  if (existingAttendee) return null;

  // Default date: tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  let targetDate = tomorrow.toISOString().slice(0, 10);
  let startTime = '17:00';
  let endTime = '17:45';

  const pref = (lead.preferred_time || '').toLowerCase();
  if (pref.includes('7:00 pm') || pref.includes('8:30 pm')) {
    startTime = '19:00';
    endTime = '19:45';
  } else if (pref.includes('saturday') || pref.includes('sunday') || pref.includes('morning') || pref.includes('10:30')) {
    startTime = '10:30';
    endTime = '11:15';
    const d = new Date();
    const day = d.getDay(); // 0 = Sun, 6 = Sat
    if (pref.includes('sunday')) {
      const daysUntilSun = (7 - day) % 7 || 7;
      d.setDate(d.getDate() + daysUntilSun);
      targetDate = d.toISOString().slice(0, 10);
    } else if (pref.includes('saturday')) {
      const daysUntilSat = (6 - day + 7) % 7 || 7;
      d.setDate(d.getDate() + daysUntilSat);
      targetDate = d.toISOString().slice(0, 10);
    }
  }

  const topic = `upspeaq Demo: ${lead.student_name} (${lead.student_class})`;
  const startDateTime = new Date(`${targetDate}T${startTime}:00`);

  const meetSession = await createGoogleMeetSession({
    topic,
    startTime: isNaN(startDateTime.getTime()) ? undefined : startDateTime.toISOString(),
    durationMinutes: 45,
  });

  const demoId = 'demo_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);

  db.prepare(`
    INSERT INTO demo_sessions (
      id, title, date, start_time, end_time, teacher_id, meeting_link,
      capacity, status, notes
    )
    VALUES (?, ?, ?, ?, ?, NULL, ?, 2, 'SCHEDULED', ?)
  `).run(
    demoId,
    topic,
    targetDate,
    startTime,
    endTime,
    meetSession.joinUrl,
    lead.notes || `Evaluation trial for ${lead.student_name} (${lead.student_class})`
  );

  const attendeeId = 'da_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
  db.prepare(`
    INSERT INTO demo_attendees (id, demo_id, lead_id, student_name, parent_phone, attendance_status)
    VALUES (?, ?, ?, ?, ?, 'REGISTERED')
  `).run(attendeeId, demoId, lead.id, lead.student_name, lead.mobile_number);

  db.prepare("UPDATE leads SET status = 'DEMO_SCHEDULED', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(lead.id);

  db.prepare(`
    INSERT INTO lead_activities (id, lead_id, action_type, description, actor_name, metadata_json)
    VALUES (?, ?, 'DEMO_SCHEDULED', ?, 'System Auto-Scheduler', ?)
  `).run(
    'act_' + Date.now().toString(36),
    lead.id,
    `Demo automatically scheduled for ${targetDate} at ${startTime}. Placed in open teacher claim pool. Google Meet: ${meetSession.joinUrl}`,
    JSON.stringify({
      demoId,
      meetingCode: meetSession.meetingCode,
      meetingLink: meetSession.joinUrl,
      provider: 'GOOGLE_MEET',
      teacherId: null,
    })
  );

  // Broadcast to all active teachers
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
      `A new demo session for ${lead.student_name} (${lead.student_class}) is available on ${targetDate} at ${startTime}. First teacher to accept it gets assigned!`
    );
  }

  return { demoId, meetSession, targetDate, startTime };
}

/**
 * Auto-schedules any pending unallocated leads so they immediately enter the claim pool
 */
export async function autoSchedulePendingLeads() {
  try {
    const unattachedLeads = db.prepare(`
      SELECT l.* FROM leads l
      WHERE l.status = 'NEW'
        AND NOT EXISTS (SELECT 1 FROM demo_attendees da WHERE da.lead_id = l.id)
    `).all() as any[];

    for (const lead of unattachedLeads) {
      await autoScheduleLeadDemo(lead.id);
    }
  } catch (err) {
    console.error('Auto-schedule pending leads error:', err);
  }
}

// Automatically sync pending leads on startup
setTimeout(() => {
  autoSchedulePendingLeads();
}, 1000);

// POST /api/leads/book-demo (Public & Student Booking Endpoint)
leadsRouter.post('/book-demo', async (req: Request, res: Response) => {
  try {
    const studentName = req.body.studentName || req.body.student_name;
    const studentClass = req.body.studentClass || req.body.student_class;
    const studentAge = req.body.studentAge || req.body.student_age;
    const parentName = req.body.parentName || req.body.parent_name;
    const mobileNumber = req.body.mobileNumber || req.body.mobile_number;
    const email = req.body.email;
    const city = req.body.city;
    const interestArea = req.body.interestArea || req.body.interest_area;
    const preferredTime = req.body.preferredTime || req.body.preferred_time;
    const notes = req.body.notes;
    const leadSource = req.body.leadSource || req.body.lead_source || 'DIRECT';
    const utmSource = req.body.utmSource || req.body.utm_source;
    const utmMedium = req.body.utmMedium || req.body.utm_medium;
    const utmCampaign = req.body.utmCampaign || req.body.utm_campaign;
    const utmContent = req.body.utmContent || req.body.utm_content;
    const utmTerm = req.body.utmTerm || req.body.utm_term;
    const referralCode = req.body.referralCode || req.body.referral_code;
    const consent = req.body.consent !== undefined ? req.body.consent : true;

    if (!studentName || !studentName.trim()) {
      return res.status(400).json({ error: "Student's name is required." });
    }
    if (!studentClass) {
      return res.status(400).json({ error: "Please select your child's class/grade." });
    }
    if (!parentName || !parentName.trim()) {
      return res.status(400).json({ error: "Parent or guardian's name is required." });
    }
    if (!mobileNumber || !mobileNumber.trim()) {
      return res.status(400).json({ error: "Mobile number is required for demo scheduling." });
    }
    if (!consent) {
      return res.status(400).json({ error: "Please agree to be contacted for scheduling the free demo." });
    }

    const normalizedMobile = normalizePhone(mobileNumber.trim());

    // Duplicate check in past 3 hours to prevent spam/double-click
    const duplicate = db.prepare(`
      SELECT id, created_at FROM leads 
      WHERE mobile_number = ? AND created_at > datetime('now', '-3 hours')
    `).get(normalizedMobile) as any;

    if (duplicate) {
      return res.status(409).json({
        message: 'A demo booking request for this mobile number was recently received. Teachers are already being allocated!',
        bookingReference: duplicate.id,
      });
    }

    const leadId = 'lead_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    const parsedAge = studentAge ? parseInt(studentAge, 10) : null;

    db.prepare(`
      INSERT INTO leads (
        id, student_name, student_class, student_age, parent_name, mobile_number, email, city,
        interest_area, preferred_time, notes, lead_source, utm_source, utm_medium, utm_campaign,
        utm_content, utm_term, referral_code, status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'NEW')
    `).run(
      leadId,
      studentName.trim(),
      studentClass.trim(),
      parsedAge,
      parentName.trim(),
      normalizedMobile,
      email ? email.trim().toLowerCase() : null,
      city ? city.trim() : null,
      interestArea || 'Communication Skills',
      preferredTime || 'Evening Slots (5:00 PM - 7:00 PM)',
      notes ? notes.trim() : null,
      leadSource,
      utmSource || null,
      utmMedium || null,
      utmCampaign || null,
      utmContent || null,
      utmTerm || null,
      referralCode ? referralCode.trim() : null
    );

    // Record initial activity
    const activityId = 'act_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    db.prepare(`
      INSERT INTO lead_activities (id, lead_id, action_type, description, actor_name, metadata_json)
      VALUES (?, ?, 'CREATED', ?, 'Parent Website Submission', ?)
    `).run(
      activityId,
      leadId,
      `New demo request booked for student ${studentName.trim()} (${studentClass.trim()}) by parent ${parentName.trim()}.`,
      JSON.stringify({
        leadSource,
        preferredTime: preferredTime || null,
        interestArea: interestArea || null,
      })
    );

    // Automatically create demo session, link attendee, and broadcast to teachers
    const scheduled = await autoScheduleLeadDemo(leadId);

    // Auto-create / link student record
    let student = db.prepare('SELECT * FROM students WHERE parent_phone = ? OR (lead_id = ? AND lead_id IS NOT NULL)').get(normalizedMobile, leadId) as any;
    if (!student) {
      const studentId = 'std_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
      db.prepare(`
        INSERT INTO students (id, lead_id, name, class_grade, parent_name, parent_phone, parent_email, city, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'DEMO')
      `).run(
        studentId,
        leadId,
        studentName.trim(),
        studentClass.trim(),
        parentName.trim(),
        normalizedMobile,
        email ? email.trim().toLowerCase() : null,
        city ? city.trim() : null
      );
      student = db.prepare('SELECT * FROM students WHERE id = ?').get(studentId) as any;
    }

    // Auto-create / link user record for instant zero-password authentication
    const userEmail = email ? email.trim().toLowerCase() : `student_${normalizedMobile.replace(/\D/g, '')}@upspeaq.com`;
    let user = db.prepare('SELECT * FROM users WHERE email = ? OR student_id = ?').get(userEmail, student.id) as any;
    if (!user) {
      const userId = 'usr_std_' + Date.now().toString(36);
      db.prepare(`
        INSERT INTO users (id, email, password_hash, name, role, student_id)
        VALUES (?, ?, ?, ?, 'STUDENT', ?)
      `).run(userId, userEmail, 'DEMO_LOGIN_HASH', studentName.trim(), student.id);
      user = db.prepare('SELECT id, email, name, role, student_id FROM users WHERE id = ?').get(userId) as any;
    }

    // Sign instant access JWT token
    const token = signToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: 'STUDENT',
      student_id: student.id,
    });

    return res.status(201).json({
      success: true,
      message: 'Demo session booked and scheduled automatically! Teachers have been notified on a first-come-first-serve basis.',
      bookingReference: leadId,
      studentName: studentName.trim(),
      demoDetails: scheduled,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: 'STUDENT',
        student_id: student.id,
      },
    });
  } catch (error: any) {
    console.error('Lead booking error:', error);
    return res.status(500).json({ error: 'Failed to process demo booking. Please check the details and try again.' });
  }
});

// GET /api/leads (Admin - Paginated & Filtered)
leadsRouter.get('/', verifyToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, source, search, sort = 'created_at_desc', page = '1', limit = '20' } = req.query;

    let query = 'SELECT * FROM leads WHERE 1=1';
    const params: any[] = [];

    if (status && status !== 'ALL') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (source && source !== 'ALL') {
      query += ' AND lead_source = ?';
      params.push(source);
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      const term = `%${search.trim()}%`;
      query += ' AND (student_name LIKE ? OR parent_name LIKE ? OR mobile_number LIKE ? OR city LIKE ? OR id LIKE ?)';
      params.push(term, term, term, term, term);
    }

    // Sort order
    if (sort === 'created_at_asc') {
      query += ' ORDER BY created_at ASC';
    } else if (sort === 'name_asc') {
      query += ' ORDER BY student_name ASC';
    } else {
      query += ' ORDER BY created_at DESC';
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 20));
    const offset = (pageNum - 1) * limitNum;

    // Total count query
    let countQuery = 'SELECT COUNT(*) as total FROM leads WHERE 1=1';
    const countParams: any[] = [];

    if (status && status !== 'ALL') {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }
    if (source && source !== 'ALL') {
      countQuery += ' AND lead_source = ?';
      countParams.push(source);
    }
    if (search && typeof search === 'string' && search.trim() !== '') {
      const term = `%${search.trim()}%`;
      countQuery += ' AND (student_name LIKE ? OR parent_name LIKE ? OR mobile_number LIKE ? OR city LIKE ? OR id LIKE ?)';
      countParams.push(term, term, term, term, term);
    }

    const countResult = db.prepare(countQuery).get(...countParams) as any;
    const total = countResult ? countResult.total : 0;

    query += ' LIMIT ? OFFSET ?';
    params.push(limitNum, offset);

    const leads = db.prepare(query).all(...params);

    return res.json({
      leads,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    console.error('Fetch leads error:', error);
    return res.status(500).json({ error: 'Failed to retrieve leads.' });
  }
});

// GET /api/leads/:id (Admin - Detailed Dossier)
leadsRouter.get('/:id', verifyToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(req.params.id) as any;
    if (!lead) {
      return res.status(404).json({ error: 'Lead record not found.' });
    }

    const activities = db.prepare(`
      SELECT * FROM lead_activities 
      WHERE lead_id = ? 
      ORDER BY created_at DESC
    `).all(req.params.id);

    const demos = db.prepare(`
      SELECT da.*, ds.title as session_title, ds.date, ds.start_time, ds.meeting_link, ds.status as session_status
      FROM demo_attendees da
      JOIN demo_sessions ds ON da.demo_id = ds.id
      WHERE da.lead_id = ?
      ORDER BY ds.date DESC
    `).all(req.params.id);

    const payments = db.prepare(`
      SELECT * FROM payments WHERE lead_id = ? ORDER BY created_at DESC
    `).all(req.params.id);

    const student = db.prepare(`
      SELECT * FROM students WHERE lead_id = ?
    `).get(req.params.id);

    return res.json({
      lead,
      activities,
      demos,
      payments,
      student: student || null,
    });
  } catch (error: any) {
    console.error('Fetch lead detail error:', error);
    return res.status(500).json({ error: 'Failed to retrieve lead details.' });
  }
});

// PATCH /api/leads/:id (Admin - Update Lead Details/Status)
leadsRouter.patch('/:id', verifyToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, notes, assignedTo, interestArea, preferredTime } = req.body;
    const actorName = req.user?.name || 'Administrator';
    const actorId = req.user?.id;

    const currentLead = db.prepare('SELECT * FROM leads WHERE id = ?').get(req.params.id) as any;
    if (!currentLead) {
      return res.status(404).json({ error: 'Lead not found.' });
    }

    const updates: string[] = [];
    const params: any[] = [];

    if (status && status !== currentLead.status) {
      updates.push('status = ?');
      params.push(status);

      // Log status change activity
      const activityId = 'act_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
      db.prepare(`
        INSERT INTO lead_activities (id, lead_id, action_type, description, actor_name, actor_id, metadata_json)
        VALUES (?, ?, 'STATUS_CHANGE', ?, ?, ?, ?)
      `).run(
        activityId,
        req.params.id,
        `Status updated from ${currentLead.status} to ${status}`,
        actorName,
        actorId,
        JSON.stringify({ previousStatus: currentLead.status, newStatus: status })
      );
    }

    if (notes !== undefined) {
      updates.push('notes = ?');
      params.push(notes);
    }
    if (assignedTo !== undefined) {
      updates.push('assigned_to = ?');
      params.push(assignedTo);
    }
    if (interestArea !== undefined) {
      updates.push('interest_area = ?');
      params.push(interestArea);
    }
    if (preferredTime !== undefined) {
      updates.push('preferred_time = ?');
      params.push(preferredTime);
    }

    if (updates.length > 0) {
      updates.push("updated_at = CURRENT_TIMESTAMP");
      params.push(req.params.id);
      db.prepare(`UPDATE leads SET ${updates.join(', ')} WHERE id = ?`).run(...params);
    }

    const updatedLead = db.prepare('SELECT * FROM leads WHERE id = ?').get(req.params.id);
    return res.json({ lead: updatedLead, message: 'Lead updated successfully.' });
  } catch (error: any) {
    console.error('Update lead error:', error);
    return res.status(500).json({ error: 'Failed to update lead.' });
  }
});

// POST /api/leads/:id/activities (Admin - Add Communication / Follow-up Note)
leadsRouter.post('/:id/activities', verifyToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { actionType = 'NOTE_ADDED', description } = req.body;
    if (!description || !description.trim()) {
      return res.status(400).json({ error: 'Description or note content is required.' });
    }

    const actorName = req.user?.name || 'Administrator';
    const actorId = req.user?.id;
    const activityId = 'act_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);

    db.prepare(`
      INSERT INTO lead_activities (id, lead_id, action_type, description, actor_name, actor_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      activityId,
      req.params.id,
      actionType,
      description.trim(),
      actorName,
      actorId
    );

    // Update lead updated_at
    db.prepare("UPDATE leads SET updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(req.params.id);

    const newActivity = db.prepare('SELECT * FROM lead_activities WHERE id = ?').get(activityId);
    return res.status(201).json({ activity: newActivity, message: 'Activity recorded.' });
  } catch (error: any) {
    console.error('Add activity error:', error);
    return res.status(500).json({ error: 'Failed to add activity record.' });
  }
});

// POST /api/leads/:id/convert (Admin - Convert Lead to Enrolled Student)
leadsRouter.post('/:id/convert', verifyToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(req.params.id) as any;
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found.' });
    }

    // Check if already converted
    const existingStudent = db.prepare('SELECT * FROM students WHERE lead_id = ?').get(req.params.id) as any;
    if (existingStudent) {
      return res.status(400).json({ error: 'This lead has already been converted to an enrolled student.', student: existingStudent });
    }

    const studentId = 'std_' + Math.random().toString(36).substring(2, 8) + Date.now().toString(36);
    const { batchId, courseId = 'crs_flagship_1' } = req.body;

    db.prepare(`
      INSERT INTO students (id, lead_id, name, class_grade, age, parent_name, parent_phone, parent_email, city, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE')
    `).run(
      studentId,
      lead.id,
      lead.student_name,
      lead.student_class,
      lead.student_age,
      lead.parent_name,
      lead.mobile_number,
      lead.email,
      lead.city
    );

    // Update lead status
    db.prepare("UPDATE leads SET status = 'CONVERTED', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(lead.id);

    // If batch provided, assign student
    if (batchId) {
      db.prepare(`
        INSERT OR IGNORE INTO batch_students (id, batch_id, student_id, status)
        VALUES (?, ?, ?, 'ACTIVE')
      `).run('bs_' + Date.now(), batchId, studentId);

      // Create enrollment record
      const startDate = new Date().toISOString().split('T')[0];
      const endDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      db.prepare(`
        INSERT INTO enrollments (id, student_id, course_id, batch_id, start_date, end_date, status)
        VALUES (?, ?, ?, ?, ?, ?, 'ACTIVE')
      `).run('enr_' + Date.now(), studentId, courseId, batchId, startDate, endDate);
    }

    // Log activity
    const activityId = 'act_' + Date.now();
    db.prepare(`
      INSERT INTO lead_activities (id, lead_id, action_type, description, actor_name, actor_id)
      VALUES (?, ?, 'STUDENT_CONVERTED', ?, ?, ?)
    `).run(
      activityId,
      lead.id,
      `Lead successfully converted into Student ID: ${studentId}.`,
      req.user?.name || 'Administrator',
      req.user?.id
    );

    const createdStudent = db.prepare('SELECT * FROM students WHERE id = ?').get(studentId);
    return res.status(201).json({
      success: true,
      message: 'Lead converted into student successfully.',
      student: createdStudent,
    });
  } catch (error: any) {
    console.error('Convert lead error:', error);
    return res.status(500).json({ error: 'Failed to convert lead into student.' });
  }
});
