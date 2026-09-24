import { Router, Response } from 'express';
import multer from 'multer';
import { db } from '../db/schema.js';
import { verifyToken, requireRole, AuthenticatedRequest } from '../middleware/auth.js';
import { uploadBufferToCloudinary } from '../services/cloudinary.js';
import { sendTeacherAssignedEmail } from '../services/emailService.js';

export const teacherPortalRouter = Router();

// Middleware: all routes require TEACHER or ADMIN/SUPER_ADMIN role
teacherPortalRouter.use(verifyToken);
teacherPortalRouter.use(requireRole(['TEACHER', 'ADMIN', 'SUPER_ADMIN']));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowedMime = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif'];
    if (allowedMime.includes(file.mimetype.toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (.jpg, .jpeg, .png, .webp) are allowed.'));
    }
  },
});

// Helper: resolves authenticated teacher ID, supporting direct teacher logins, email matching, and admin preview mode
function resolveTeacherId(req: AuthenticatedRequest): string | null {
  if (req.query.teacher_id) {
    return String(req.query.teacher_id);
  }

  if (req.user?.teacher_id) {
    return req.user.teacher_id;
  }

  if (req.user?.id) {
    const user = db.prepare('SELECT teacher_id, email FROM users WHERE id = ?').get(req.user.id) as any;
    if (user?.teacher_id) {
      return user.teacher_id;
    }
    if (user?.email) {
      const matchByEmail = db.prepare('SELECT id FROM teachers WHERE email = ?').get(user.email) as any;
      if (matchByEmail?.id) return matchByEmail.id;
    }
  }

  if (req.user?.email) {
    const matchByEmail = db.prepare('SELECT id FROM teachers WHERE email = ?').get(req.user.email) as any;
    if (matchByEmail?.id) return matchByEmail.id;
  }

  // Fallback for Admin role-switch preview mode: default to the first active teacher
  const firstTeacher = db.prepare("SELECT id FROM teachers WHERE status = 'ACTIVE' ORDER BY created_at ASC LIMIT 1").get() as any;
  if (firstTeacher?.id) return firstTeacher.id;

  return null;
}

// GET /api/teacher/dashboard
teacherPortalRouter.get('/dashboard', (req: AuthenticatedRequest, res: Response) => {
  try {
    const teacherId = resolveTeacherId(req);
    if (!teacherId) {
      return res.status(403).json({ error: 'No teacher profile linked to your authenticated account.' });
    }

    const teacher = db.prepare('SELECT * FROM teachers WHERE id = ?').get(teacherId) as any;
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher profile not found.' });
    }

    // 1. Today's Classes for this teacher
    const todayClasses = db.prepare(`
      SELECT cs.*, b.batch_name, b.code as batch_code,
        COALESCE(NULLIF(cs.meeting_link, ''), NULLIF(b.meeting_link, '')) as meeting_link,
        (SELECT COUNT(*) FROM batch_memberships bm WHERE bm.batch_id = cs.batch_id AND bm.status = 'ACTIVE') as student_count
      FROM class_sessions cs
      JOIN batches b ON b.id = cs.batch_id
      WHERE cs.teacher_id = ? AND cs.date = DATE('now')
      ORDER BY cs.start_time ASC
    `).all(teacherId);

    // 2. Active Batches Count & Student Total
    const activeBatches = db.prepare(`
      SELECT b.*, c.name as course_name,
        (SELECT COUNT(*) FROM batch_memberships bm WHERE bm.batch_id = b.id AND bm.status = 'ACTIVE') as enrolled_count
      FROM batches b
      JOIN courses c ON b.course_id = c.id
      WHERE b.teacher_id = ? AND b.status IN ('OPEN', 'UPCOMING', 'ACTIVE', 'FULL')
      ORDER BY b.start_date ASC
    `).all(teacherId);

    // 3. Pending Homework Submissions to review
    const pendingHomeworkReviews = db.prepare(`
      SELECT hs.*, h.title as homework_title, h.due_date, s.name as student_name, b.batch_name
      FROM homework_submissions hs
      JOIN homework h ON hs.homework_id = h.id
      JOIN students s ON hs.student_id = s.id
      JOIN batches b ON h.batch_id = b.id
      WHERE h.teacher_id = ? AND hs.status = 'SUBMITTED'
      ORDER BY hs.submitted_at ASC
    `).all(teacherId);

    // 4. Upcoming Demo Sessions
    const upcomingDemos = db.prepare(`
      SELECT ds.*,
        (SELECT COUNT(*) FROM demo_attendees da WHERE da.demo_id = ds.id) as attendee_count
      FROM demo_sessions ds
      WHERE ds.teacher_id = ? AND ds.status = 'SCHEDULED' AND ds.date >= DATE('now')
      ORDER BY ds.date ASC, ds.start_time ASC
    `).all(teacherId);

    return res.json({
      teacher,
      todayClasses,
      activeBatches,
      pendingHomeworkReviews,
      upcomingDemos,
    });
  } catch (error: any) {
    console.error('Teacher dashboard error:', error);
    return res.status(500).json({ error: 'Failed to retrieve teacher dashboard.' });
  }
});

// GET /api/teacher/profile (Profile details, batches, Google Meet link & earnings @ ₹150/demo)
teacherPortalRouter.get('/profile', (req: AuthenticatedRequest, res: Response) => {
  try {
    const teacherId = resolveTeacherId(req);
    if (!teacherId) {
      return res.status(403).json({ error: 'No teacher profile linked to your authenticated account.' });
    }

    const teacher = db.prepare('SELECT * FROM teachers WHERE id = ?').get(teacherId) as any;
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher profile not found.' });
    }

    const assignedBatches = db.prepare(`
      SELECT b.*, c.name as course_name
      FROM batches b
      JOIN courses c ON b.course_id = c.id
      WHERE b.teacher_id = ? AND b.status = 'ACTIVE'
    `).all(teacherId);

    // Earnings & Demo statistics
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total_demos,
        SUM(CASE WHEN ds.status = 'COMPLETED' OR EXISTS (SELECT 1 FROM demo_evaluations de WHERE de.demo_id = ds.id) THEN 1 ELSE 0 END) as completed_demos,
        SUM(CASE WHEN ds.status IN ('SCHEDULED', 'ASSIGNED', 'IN_PROGRESS') THEN 1 ELSE 0 END) as pending_demos
      FROM demo_sessions ds
      WHERE ds.teacher_id = ?
    `).get(teacherId) as any;

    const completedDemos = stats?.completed_demos || 0;
    const payoutPerDemo = teacher.payout_per_demo || 150;
    const totalEarnings = completedDemos * payoutPerDemo;

    return res.json({
      teacher: {
        ...teacher,
        total_demos: stats?.total_demos || 0,
        completed_demos: completedDemos,
        pending_demos: stats?.pending_demos || 0,
        total_earnings: totalEarnings,
        payout_per_demo: payoutPerDemo,
      },
      assignedBatches,
    });
  } catch (error: any) {
    console.error('Teacher profile fetch error:', error);
    return res.status(500).json({ error: 'Failed to retrieve teacher profile.' });
  }
});

// PATCH /api/teacher/profile (Update phone, bio, expertise, availability, and Google Meet permanent link)
teacherPortalRouter.patch('/profile', (req: AuthenticatedRequest, res: Response) => {
  try {
    const teacherId = resolveTeacherId(req);
    if (!teacherId) {
      return res.status(403).json({ error: 'No teacher profile linked.' });
    }

    const {
      phone, biography, expertise, achievements, availability,
      google_meet_link, googleMeetLink
    } = req.body;
    const meetLink = google_meet_link !== undefined ? google_meet_link : googleMeetLink;

    const updates: string[] = [];
    const params: any[] = [];

    if (phone !== undefined) { updates.push('phone = ?'); params.push(phone ? phone.trim() : null); }
    if (biography !== undefined) { updates.push('biography = ?'); params.push(biography ? biography.trim() : null); }
    if (expertise !== undefined) { updates.push('expertise = ?'); params.push(expertise ? expertise.trim() : null); }
    if (achievements !== undefined) { updates.push('achievements = ?'); params.push(achievements ? achievements.trim() : null); }
    if (availability !== undefined) { updates.push('availability = ?'); params.push(availability ? availability.trim() : null); }
    if (meetLink !== undefined) { updates.push('google_meet_link = ?'); params.push(meetLink ? meetLink.trim() : null); }

    if (updates.length > 0) {
      updates.push('updated_at = CURRENT_TIMESTAMP');
      params.push(teacherId);
      db.prepare(`UPDATE teachers SET ${updates.join(', ')} WHERE id = ?`).run(...params);
    }

    const updated = db.prepare('SELECT * FROM teachers WHERE id = ?').get(teacherId) as any;
    return res.json({ teacher: updated, message: 'Teacher profile updated successfully.' });
  } catch (error: any) {
    console.error('Teacher profile update error:', error);
    return res.status(500).json({ error: 'Failed to update teacher profile.' });
  }
});

// GET /api/teacher/batches (Batches assigned to this teacher)
teacherPortalRouter.get('/batches', (req: AuthenticatedRequest, res: Response) => {
  try {
    const teacherId = resolveTeacherId(req);
    if (!teacherId) {
      return res.status(403).json({ error: 'No teacher profile linked.' });
    }

    const batches = db.prepare(`
      SELECT b.*, c.name as course_name, c.total_classes,
        (SELECT COUNT(*) FROM batch_memberships bm WHERE bm.batch_id = b.id AND bm.status = 'ACTIVE') as enrolled_count
      FROM batches b
      JOIN courses c ON b.course_id = c.id
      WHERE b.teacher_id = ?
      ORDER BY b.start_date DESC
    `).all(teacherId) as any[];

    return res.json({ batches });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to retrieve teacher batches.' });
  }
});

// GET /api/teacher/batches/:id (Batch detail, roster, and scheduled sessions)
teacherPortalRouter.get('/batches/:id', (req: AuthenticatedRequest, res: Response) => {
  try {
    const teacherId = resolveTeacherId(req);
    if (!teacherId) {
      return res.status(403).json({ error: 'No teacher profile linked.' });
    }

    const batch = db.prepare(`
      SELECT b.*, c.name as course_name, c.total_classes, c.duration_months
      FROM batches b
      JOIN courses c ON b.course_id = c.id
      WHERE b.id = ? AND (b.teacher_id = ? OR ? = 'ADMIN' OR ? = 'SUPER_ADMIN')
    `).get(req.params.id, teacherId, req.user?.role, req.user?.role) as any;

    if (!batch) {
      return res.status(404).json({ error: 'Batch not found or not assigned to you.' });
    }

    const students = db.prepare(`
      SELECT s.*, bm.joined_at, bm.status as membership_status
      FROM batch_memberships bm
      JOIN students s ON bm.student_id = s.id
      WHERE bm.batch_id = ? AND bm.status = 'ACTIVE'
      ORDER BY s.name ASC
    `).all(req.params.id);

    const sessions = db.prepare(`
      SELECT cs.*,
        (SELECT COUNT(*) FROM attendance a WHERE a.session_id = cs.id AND a.status = 'PRESENT') as present_count,
        (SELECT COUNT(*) FROM attendance a WHERE a.session_id = cs.id) as marked_count
      FROM class_sessions cs
      WHERE cs.batch_id = ?
      ORDER BY cs.session_number ASC, cs.date ASC
    `).all(req.params.id);

    return res.json({ batch, students, sessions });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to retrieve batch detail.' });
  }
});

// GET /api/teacher/classes/:sessionId/attendance (Load Session Roster for Taking Attendance)
teacherPortalRouter.get('/classes/:sessionId/attendance', (req: AuthenticatedRequest, res: Response) => {
  try {
    const teacherId = resolveTeacherId(req);
    if (!teacherId) {
      return res.status(403).json({ error: 'No teacher profile linked.' });
    }

    const session = db.prepare(`
      SELECT cs.*, b.batch_name, b.code as batch_code
      FROM class_sessions cs
      JOIN batches b ON cs.batch_id = b.id
      WHERE cs.id = ? AND (cs.teacher_id = ? OR ? = 'ADMIN' OR ? = 'SUPER_ADMIN')
    `).get(req.params.sessionId, teacherId, req.user?.role, req.user?.role) as any;

    if (!session) {
      return res.status(404).json({ error: 'Class session not found or not assigned to you.' });
    }

    // Load all active batch members with their attendance status for this session
    const roster = db.prepare(`
      SELECT s.id as student_id, s.name as student_name, s.class_grade, s.photo_url,
        COALESCE(a.status, 'PRESENT') as status, a.notes, a.marked_at
      FROM batch_memberships bm
      JOIN students s ON bm.student_id = s.id
      LEFT JOIN attendance a ON a.session_id = ? AND a.student_id = s.id
      WHERE bm.batch_id = ? AND bm.status = 'ACTIVE'
      ORDER BY s.name ASC
    `).all(session.id, session.batch_id);

    return res.json({ session, roster });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to load attendance roster.' });
  }
});

// POST /api/teacher/classes/:sessionId/attendance (Save Batch Attendance Atomically)
teacherPortalRouter.post('/classes/:sessionId/attendance', (req: AuthenticatedRequest, res: Response) => {
  try {
    const teacherId = resolveTeacherId(req);
    if (!teacherId) {
      return res.status(403).json({ error: 'No teacher profile linked.' });
    }

    const { attendanceRecords } = req.body; // Array of { student_id, status: 'PRESENT' | 'ABSENT' | 'LATE', notes }
    if (!Array.isArray(attendanceRecords)) {
      return res.status(400).json({ error: 'attendanceRecords array is required.' });
    }

    const session = db.prepare(`
      SELECT * FROM class_sessions WHERE id = ? AND (teacher_id = ? OR ? = 'ADMIN' OR ? = 'SUPER_ADMIN')
    `).get(req.params.sessionId, teacherId, req.user?.role, req.user?.role) as any;

    if (!session) {
      return res.status(404).json({ error: 'Class session not found or unauthorized.' });
    }

    const upsertStmt = db.prepare(`
      INSERT INTO attendance (id, session_id, student_id, batch_id, status, notes, marked_by, marked_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(session_id, student_id) DO UPDATE SET
        status = excluded.status,
        notes = excluded.notes,
        marked_by = excluded.marked_by,
        marked_at = CURRENT_TIMESTAMP
    `);

    for (const record of attendanceRecords) {
      const attId = `att_${session.id}_${record.student_id}`;
      upsertStmt.run(
        attId,
        session.id,
        record.student_id,
        session.batch_id,
        record.status || 'PRESENT',
        record.notes || null,
        req.user?.name || 'Teacher'
      );
    }

    return res.json({ success: true, message: 'Attendance recorded successfully for batch roster.' });
  } catch (error: any) {
    console.error('Save attendance error:', error);
    return res.status(500).json({ error: 'Failed to record attendance.' });
  }
});

// PATCH /api/teacher/classes/:sessionId (Update Session Notes, Recording URL, or Status)
teacherPortalRouter.patch('/classes/:sessionId', (req: AuthenticatedRequest, res: Response) => {
  try {
    const teacherId = resolveTeacherId(req);
    if (!teacherId) {
      return res.status(403).json({ error: 'No teacher profile linked.' });
    }

    const { teacherNotes, recordingUrl, status, meetingLink } = req.body;
    const session = db.prepare(`
      SELECT * FROM class_sessions WHERE id = ? AND (teacher_id = ? OR ? = 'ADMIN' OR ? = 'SUPER_ADMIN')
    `).get(req.params.sessionId, teacherId, req.user?.role, req.user?.role) as any;

    if (!session) {
      return res.status(404).json({ error: 'Session not found or unauthorized.' });
    }

    const updates: string[] = [];
    const params: any[] = [];

    if (teacherNotes !== undefined) {
      updates.push('teacher_notes = ?');
      params.push(teacherNotes);
    }
    if (recordingUrl !== undefined) {
      updates.push('recording_url = ?');
      params.push(recordingUrl);

      // If recording URL is provided, also insert or update into recordings table
      if (recordingUrl && recordingUrl.trim() !== '') {
        const recId = 'rec_' + session.id;
        db.prepare(`
          INSERT INTO recordings (id, session_id, batch_id, teacher_id, title, topic, recording_url, recorded_date)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET recording_url = excluded.recording_url
        `).run(
          recId,
          session.id,
          session.batch_id,
          session.teacher_id,
          `Session ${session.session_number || ''}: ${session.topic}`,
          session.topic,
          recordingUrl.trim(),
          session.date
        );
      }
    }
    if (status !== undefined) {
      updates.push('status = ?');
      params.push(status);
    }
    if (meetingLink !== undefined) {
      updates.push('meeting_link = ?');
      params.push(meetingLink);
    }

    if (updates.length > 0) {
      updates.push('updated_at = CURRENT_TIMESTAMP');
      params.push(req.params.sessionId);
      db.prepare(`UPDATE class_sessions SET ${updates.join(', ')} WHERE id = ?`).run(...params);
    }

    const updated = db.prepare('SELECT * FROM class_sessions WHERE id = ?').get(req.params.sessionId);
    return res.json({ session: updated, message: 'Class session updated successfully.' });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to update session.' });
  }
});

// POST /api/teacher/homework (Create Homework for Batch or Individual Student)
teacherPortalRouter.post('/homework', (req: AuthenticatedRequest, res: Response) => {
  try {
    const teacherId = resolveTeacherId(req);
    if (!teacherId) {
      return res.status(403).json({ error: 'No teacher profile linked.' });
    }

    const { batchId, sessionId, targetStudentId, title, description, instructions, dueDate, submissionType = 'AUDIO' } = req.body;

    if (!batchId || !title || !dueDate) {
      return res.status(400).json({ error: 'Batch ID, title, and due date are required.' });
    }

    const hwId = 'hw_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);

    db.prepare(`
      INSERT INTO homework (
        id, batch_id, session_id, teacher_id, target_student_id, title, description, instructions, due_date, submission_type, status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE')
    `).run(
      hwId,
      batchId,
      sessionId || null,
      teacherId,
      targetStudentId || null,
      title.trim(),
      description || null,
      instructions || null,
      dueDate,
      submissionType
    );

    // Notify students
    let targetUserIds: any[] = [];
    if (targetStudentId) {
      targetUserIds = db.prepare('SELECT id FROM users WHERE student_id = ?').all(targetStudentId);
    } else {
      targetUserIds = db.prepare(`
        SELECT u.id FROM batch_memberships bm
        JOIN users u ON u.student_id = bm.student_id
        WHERE bm.batch_id = ? AND bm.status = 'ACTIVE'
      `).all(batchId);
    }

    for (const u of targetUserIds) {
      db.prepare(`
        INSERT INTO notifications (id, user_id, user_role, title, message, type, link_url)
        VALUES (?, ?, 'STUDENT', 'New Homework Assigned', ?, 'HOMEWORK_ASSIGNED', '/student/homework')
      `).run(
        'notif_' + Date.now().toString(36) + '_' + u.id,
        u.id,
        `New speech homework "${title}" has been assigned. Due by ${dueDate}.`
      );
    }

    const created = db.prepare('SELECT * FROM homework WHERE id = ?').get(hwId);
    return res.status(201).json({ homework: created, message: 'Homework assigned successfully.' });
  } catch (error: any) {
    console.error('Create homework error:', error);
    return res.status(500).json({ error: 'Failed to assign homework.' });
  }
});

// ============================================================
// DEMO ROUTES
// ============================================================

// GET /api/teacher/demos/available — All unassigned demos any teacher can claim
// IMPORTANT: must be defined BEFORE /:id route to avoid "available" matching as an ID
teacherPortalRouter.get('/demos/available', (req: AuthenticatedRequest, res: Response) => {
  try {
    const availableDemos = db.prepare(`
      SELECT ds.*,
        COALESCE(
          (SELECT l.student_name FROM demo_attendees da JOIN leads l ON da.lead_id = l.id WHERE da.demo_id = ds.id LIMIT 1),
          ds.title
        ) as student_name,
        (SELECT l.student_class FROM demo_attendees da JOIN leads l ON da.lead_id = l.id WHERE da.demo_id = ds.id LIMIT 1) as student_class,
        (SELECT l.parent_name FROM demo_attendees da JOIN leads l ON da.lead_id = l.id WHERE da.demo_id = ds.id LIMIT 1) as parent_name,
        (SELECT l.mobile_number FROM demo_attendees da JOIN leads l ON da.lead_id = l.id WHERE da.demo_id = ds.id LIMIT 1) as parent_phone,
        (SELECT l.city FROM demo_attendees da JOIN leads l ON da.lead_id = l.id WHERE da.demo_id = ds.id LIMIT 1) as city,
        (SELECT l.interest_area FROM demo_attendees da JOIN leads l ON da.lead_id = l.id WHERE da.demo_id = ds.id LIMIT 1) as interest_area,
        (SELECT l.id FROM demo_attendees da JOIN leads l ON da.lead_id = l.id WHERE da.demo_id = ds.id LIMIT 1) as lead_id,
        (SELECT COUNT(*) FROM demo_attendees da WHERE da.demo_id = ds.id) as attendee_count
      FROM demo_sessions ds
      WHERE ds.teacher_id IS NULL
        AND ds.status IN ('SCHEDULED', 'OPEN', 'ASSIGNED')
        AND ds.date >= DATE('now', '-1 day')
      ORDER BY ds.date ASC, ds.start_time ASC
    `).all();

    return res.json({ demos: availableDemos });
  } catch (error: any) {
    console.error('Fetch available demos error:', error);
    return res.status(500).json({ error: 'Failed to retrieve available demos.' });
  }
});

// POST /api/teacher/demos/:id/claim — First-come-first-serve atomic claim
teacherPortalRouter.post('/demos/:id/claim', (req: AuthenticatedRequest, res: Response) => {
  try {
    const teacherId = resolveTeacherId(req);
    if (!teacherId) {
      return res.status(403).json({ error: 'No teacher profile linked to your authenticated account.' });
    }

    // Verify demo exists and is still unclaimed
    const demo = db.prepare('SELECT * FROM demo_sessions WHERE id = ?').get(req.params.id) as any;
    if (!demo) {
      return res.status(404).json({ error: 'Demo session not found.' });
    }
    if (demo.teacher_id) {
      return res.status(409).json({ error: 'Sorry, another teacher has already claimed this demo!' });
    }

    // Atomic update: only succeeds if teacher_id is still NULL at the moment of write
    const result = db.prepare(`
      UPDATE demo_sessions
      SET teacher_id = ?, status = 'ASSIGNED', updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND teacher_id IS NULL
    `).run(teacherId, req.params.id);

    if (result.changes === 0) {
      // Race condition: another teacher claimed it between our SELECT and UPDATE
      return res.status(409).json({ error: 'Sorry, another teacher just claimed this demo a moment ago!' });
    }

    // Update any upcoming sessions for this demo with teacher
    db.prepare(`
      UPDATE class_sessions SET teacher_id = ? WHERE id = ? AND teacher_id IS NULL
    `).run(teacherId, req.params.id);

    const teacher = db.prepare('SELECT name, email, biography, expertise, google_meet_link FROM teachers WHERE id = ?').get(teacherId) as any;
    const teacherName = teacher?.name || 'Teacher';

    // If teacher has configured a permanent Google Meet link, attach it to the demo meeting link
    let effectiveMeetingLink = demo.meeting_link || 'https://meet.google.com';
    if (teacher?.google_meet_link && teacher.google_meet_link.trim()) {
      effectiveMeetingLink = teacher.google_meet_link.trim();
      db.prepare('UPDATE demo_sessions SET meeting_link = ? WHERE id = ?').run(effectiveMeetingLink, req.params.id);
    }

    // Dispatch email to all registered attendees with Teacher Details + Meeting Link
    const attendees = db.prepare(`
      SELECT da.*, l.email, l.student_name, l.parent_name, l.student_class
      FROM demo_attendees da
      LEFT JOIN leads l ON da.lead_id = l.id
      WHERE da.demo_id = ?
    `).all(req.params.id) as any[];

    const dateFormatted = new Date(demo.date).toLocaleDateString('en-US', {
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
          dateStr: dateFormatted || demo.date,
          timeStr: demo.start_time,
          teacherName: teacherName,
          teacherBio: teacher?.biography,
          teacherExpertise: teacher?.expertise,
          meetingLink: effectiveMeetingLink,
        }).catch((err) => console.error('Error emailing parent after teacher claim:', err));

        if (att.lead_id) {
          db.prepare(`
            INSERT INTO lead_activities (id, lead_id, action_type, description, actor_name, actor_id)
            VALUES (?, ?, 'TEACHER_ASSIGNED', ?, ?, ?)
          `).run(
            'act_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
            att.lead_id,
            `Demo accepted by Teacher ${teacherName}. Live meeting link (${effectiveMeetingLink}) emailed to ${att.email}.`,
            teacherName,
            req.user?.id
          );
        }
      }
    }

    // Notify the claiming teacher
    const teacherUser = db.prepare('SELECT id FROM users WHERE teacher_id = ?').get(teacherId) as any;
    if (teacherUser) {
      db.prepare(`
        INSERT INTO notifications (id, user_id, user_role, title, message, type, link_url)
        VALUES (?, ?, 'TEACHER', 'Demo Session Claimed!', ?, 'SCHEDULE_CHANGE', '/teacher/demos')
      `).run(
        'notif_' + Date.now().toString(36) + '_claimed',
        teacherUser.id,
        `You have successfully claimed the demo session "${demo.title}" on ${demo.date} at ${demo.start_time}. Good luck!`
      );
    }

    // Notify all other teachers that this demo is no longer available
    const otherTeacherUsers = db.prepare(`
      SELECT u.id FROM users u
      JOIN teachers t ON u.teacher_id = t.id
      WHERE t.status = 'ACTIVE' AND t.id != ? AND u.role = 'TEACHER'
    `).all(teacherId) as any[];

    for (const u of otherTeacherUsers) {
      db.prepare(`
        INSERT INTO notifications (id, user_id, user_role, title, message, type, link_url)
        VALUES (?, ?, 'TEACHER', 'Demo Taken', ?, 'SYSTEM_ALERT', '/teacher/demos')
      `).run(
        'notif_' + Date.now().toString(36) + '_' + u.id,
        u.id,
        `The demo "${demo.title}" on ${demo.date} at ${demo.start_time} has been claimed by ${teacherName}.`
      );
    }

    // Audit log
    db.prepare(`
      INSERT INTO audit_logs (id, actor_id, actor_name, actor_role, action, entity_type, entity_id, details_json)
      VALUES (?, ?, ?, 'TEACHER', 'DEMO_CLAIMED', 'DEMO_SESSION', ?, ?)
    `).run(
      'log_' + Date.now().toString(36),
      req.user?.id,
      teacherName,
      req.params.id,
      JSON.stringify({ teacherId, demoTitle: demo.title, demoDate: demo.date })
    );

    const updatedDemo = db.prepare('SELECT * FROM demo_sessions WHERE id = ?').get(req.params.id);
    return res.json({
      success: true,
      demo: updatedDemo,
      message: `Demo session "${demo.title}" claimed successfully! It now appears in your assigned demos.`,
    });
  } catch (error: any) {
    console.error('Claim demo error:', error);
    return res.status(500).json({ error: 'Failed to claim demo session.' });
  }
});

// GET /api/teacher/demos — Demos already assigned to this teacher
teacherPortalRouter.get('/demos', (req: AuthenticatedRequest, res: Response) => {
  try {
    const teacherId = resolveTeacherId(req);
    if (!teacherId) {
      return res.status(403).json({ error: 'No teacher profile linked to your authenticated account.' });
    }

    const demos = db.prepare(`
      SELECT ds.*,
        COALESCE(
          (SELECT l.student_name FROM demo_attendees da JOIN leads l ON da.lead_id = l.id WHERE da.demo_id = ds.id LIMIT 1),
          ds.title
        ) as student_name,
        (SELECT l.student_class FROM demo_attendees da JOIN leads l ON da.lead_id = l.id WHERE da.demo_id = ds.id LIMIT 1) as student_class,
        (SELECT l.parent_name FROM demo_attendees da JOIN leads l ON da.lead_id = l.id WHERE da.demo_id = ds.id LIMIT 1) as parent_name,
        (SELECT l.mobile_number FROM demo_attendees da JOIN leads l ON da.lead_id = l.id WHERE da.demo_id = ds.id LIMIT 1) as parent_phone,
        (SELECT l.city FROM demo_attendees da JOIN leads l ON da.lead_id = l.id WHERE da.demo_id = ds.id LIMIT 1) as city,
        (SELECT l.id FROM demo_attendees da JOIN leads l ON da.lead_id = l.id WHERE da.demo_id = ds.id LIMIT 1) as lead_id,
        (SELECT de.outcome FROM demo_evaluations de WHERE de.demo_id = ds.id AND de.teacher_id = ? LIMIT 1) as evaluation_outcome,
        (SELECT de.id FROM demo_evaluations de WHERE de.demo_id = ds.id AND de.teacher_id = ? LIMIT 1) as evaluation_id
      FROM demo_sessions ds
      WHERE ds.teacher_id = ?
      ORDER BY ds.date DESC, ds.start_time DESC
    `).all(teacherId, teacherId, teacherId);

    return res.json({ demos });
  } catch (error: any) {
    console.error('Fetch teacher demos error:', error);
    return res.status(500).json({ error: 'Failed to retrieve demo sessions.' });
  }
});

// GET /api/teacher/demos/:id — Demo detail with evaluation data
teacherPortalRouter.get('/demos/:id', (req: AuthenticatedRequest, res: Response) => {
  try {
    const teacherId = resolveTeacherId(req);
    if (!teacherId) {
      return res.status(403).json({ error: 'No teacher profile linked.' });
    }

    const demo = db.prepare('SELECT * FROM demo_sessions WHERE id = ?').get(req.params.id) as any;
    if (!demo) {
      return res.status(404).json({ error: 'Demo not found.' });
    }

    const attendees = db.prepare(`
      SELECT da.*, l.student_class, l.city, l.interest_area
      FROM demo_attendees da
      JOIN leads l ON da.lead_id = l.id
      WHERE da.demo_id = ?
    `).all(req.params.id);

    const evaluation = db.prepare(`
      SELECT * FROM demo_evaluations WHERE demo_id = ? AND teacher_id = ? LIMIT 1
    `).get(req.params.id, teacherId);

    return res.json({ demo, attendees, evaluation: evaluation || null });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to retrieve demo details.' });
  }
});

// POST /api/teacher/demos/:id/evaluation — Submit demo evaluation
teacherPortalRouter.post('/demos/:id/evaluation', (req: AuthenticatedRequest, res: Response) => {
  try {
    const teacherId = resolveTeacherId(req);
    if (!teacherId) {
      return res.status(403).json({ error: 'No teacher profile linked.' });
    }

    const {
      lead_id,
      spoken_english, pronunciation, fluency, confidence, public_speaking,
      vocabulary, sentence_formation, listening, debate_reasoning,
      strengths, areas_to_improve, recommended_program, additional_notes, outcome,
    } = req.body;

    if (!lead_id) {
      return res.status(400).json({ error: 'lead_id is required for evaluation.' });
    }

    const evalId = 'eval_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5);

    // Check if evaluation already exists for this demo + teacher
    const existingEval = db.prepare(`
      SELECT id FROM demo_evaluations WHERE demo_id = ? AND teacher_id = ? LIMIT 1
    `).get(req.params.id, teacherId) as any;

    if (existingEval) {
      // Update existing evaluation
      db.prepare(`
        UPDATE demo_evaluations SET
          spoken_english = ?, pronunciation = ?, fluency = ?, confidence = ?,
          public_speaking = ?, vocabulary = ?, sentence_formation = ?, listening = ?,
          debate_reasoning = ?, strengths = ?, areas_to_improve = ?, recommended_program = ?,
          additional_notes = ?, outcome = ?
        WHERE id = ?
      `).run(
        spoken_english || 'Good', pronunciation || 'Good', fluency || 'Developing',
        confidence || 'Developing', public_speaking || 'Developing', vocabulary || 'Good',
        sentence_formation || 'Good', listening || 'Strong', debate_reasoning || 'Developing',
        strengths || null, areas_to_improve || null, recommended_program || null,
        additional_notes || null, outcome || 'Recommended',
        existingEval.id
      );
    } else {
      // Insert new evaluation
      db.prepare(`
        INSERT INTO demo_evaluations (
          id, demo_id, lead_id, teacher_id,
          spoken_english, pronunciation, fluency, confidence, public_speaking,
          vocabulary, sentence_formation, listening, debate_reasoning,
          strengths, areas_to_improve, recommended_program, additional_notes, outcome
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        evalId, req.params.id, lead_id, teacherId,
        spoken_english || 'Good', pronunciation || 'Good', fluency || 'Developing',
        confidence || 'Developing', public_speaking || 'Developing', vocabulary || 'Good',
        sentence_formation || 'Good', listening || 'Strong', debate_reasoning || 'Developing',
        strengths || null, areas_to_improve || null, recommended_program || null,
        additional_notes || null, outcome || 'Recommended'
      );
    }

    // Mark demo as COMPLETED
    db.prepare(`
      UPDATE demo_sessions SET status = 'COMPLETED', updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `).run(req.params.id);

    return res.json({ success: true, message: 'Demo evaluation saved successfully.', evaluationId: evalId });
  } catch (error: any) {
    console.error('Submit evaluation error:', error);
    return res.status(500).json({ error: 'Failed to save demo evaluation.' });
  }
});

// PATCH /api/teacher/homework/submissions/:id/review (Teacher Reviews Submission & Adds Feedback)
teacherPortalRouter.patch('/homework/submissions/:id/review', (req: AuthenticatedRequest, res: Response) => {
  try {
    const teacherId = resolveTeacherId(req);
    if (!teacherId) {
      return res.status(403).json({ error: 'No teacher profile linked.' });
    }

    const { scoreRating, mentorFeedback } = req.body;
    const sub = db.prepare(`
      SELECT hs.*, h.title as homework_title, h.teacher_id, s.name as student_name, s.user_id
      FROM homework_submissions hs
      JOIN homework h ON hs.homework_id = h.id
      JOIN students s ON hs.student_id = s.id
      WHERE hs.id = ?
    `).get(req.params.id) as any;

    if (!sub) {
      return res.status(404).json({ error: 'Submission not found.' });
    }

    db.prepare(`
      UPDATE homework_submissions
      SET status = 'REVIEWED', score_rating = ?, mentor_feedback = ?, reviewed_at = CURRENT_TIMESTAMP, reviewed_by = ?
      WHERE id = ?
    `).run(scoreRating || 'Good', mentorFeedback || null, req.user?.name || 'Teacher', req.params.id);

    // Notify student
    if (sub.user_id) {
      db.prepare(`
        INSERT INTO notifications (id, user_id, user_role, title, message, type, link_url)
        VALUES (?, ?, 'STUDENT', 'Mentor Feedback Available', ?, 'HOMEWORK_REVIEWED', '/student/homework')
      `).run(
        'notif_' + Date.now().toString(36),
        sub.user_id,
        `Your teacher reviewed your submission for "${sub.homework_title}" (${scoreRating || 'Good'}). Check feedback!`
      );
    }

    const updated = db.prepare('SELECT * FROM homework_submissions WHERE id = ?').get(req.params.id);
    return res.json({ submission: updated, message: 'Feedback submitted successfully.' });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to submit review feedback.' });
  }
});
