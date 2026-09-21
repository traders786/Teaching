import { Router, Response } from 'express';
import { db } from '../db/schema.js';
import { verifyToken, requireRole, AuthenticatedRequest } from '../middleware/auth.js';
import { generateBatchSessions } from '../services/sessionGenerationService.js';
import { transferStudent } from '../services/transferService.js';
import { placeStudentInBatch } from '../services/batchPlacementService.js';

export const batchesRouter = Router();

// GET /api/batches (List all batches with live capacity metrics)
batchesRouter.get('/', verifyToken, (_req: AuthenticatedRequest, res: Response) => {
  try {
    const batches = db.prepare(`
      SELECT b.*, c.name as course_name, t.name as teacher_name, t.email as teacher_email,
        (SELECT COUNT(*) FROM batch_memberships bm WHERE bm.batch_id = b.id AND bm.status = 'ACTIVE') as enrolled_count,
        (SELECT COUNT(*) FROM class_sessions cs WHERE cs.batch_id = b.id) as total_sessions_count,
        (SELECT COUNT(*) FROM class_sessions cs WHERE cs.batch_id = b.id AND cs.status = 'COMPLETED') as completed_sessions_count
      FROM batches b
      JOIN courses c ON b.course_id = c.id
      LEFT JOIN teachers t ON b.teacher_id = t.id
      ORDER BY b.start_date DESC, b.created_at DESC
    `).all();

    return res.json({ batches });
  } catch (error: any) {
    console.error('Fetch batches error:', error);
    return res.status(500).json({ error: 'Failed to retrieve batches.' });
  }
});

// POST /api/batches (Create a batch manually for administrative / exceptional needs)
batchesRouter.post('/', verifyToken, requireRole(['ADMIN', 'SUPER_ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      batch_name,
      course_id = 'crs_flagship_1',
      teacher_id,
      grade_group = 'Class 4-7',
      start_date,
      end_date,
      schedule_days,
      schedule_time,
      meeting_link,
      target_capacity = 8,
      max_capacity = 8,
      notes,
    } = req.body;

    if (!batch_name || !start_date || !schedule_days || !schedule_time) {
      return res.status(400).json({ error: 'Batch Name, Start Date, Schedule Days, and Schedule Time are required.' });
    }

    const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(course_id) as any;
    if (!course) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    const durationMonths = course.duration_months || 3;
    const finalEndDate = end_date || new Date(new Date(start_date + 'T00:00:00').getTime() + durationMonths * 30 * 86400000).toISOString().slice(0, 10);
    const batchId = 'batch_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    const code = 'MAN-' + Date.now().toString(36).toUpperCase().slice(-4);
    const status = teacher_id ? 'OPEN' : 'NEEDS_TEACHER';

    db.prepare(`
      INSERT INTO batches (
        id, batch_name, code, course_id, teacher_id, grade_group, start_date, end_date,
        schedule_days, schedule_time, meeting_link, target_capacity, max_capacity, status, notes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      batchId,
      batch_name.trim(),
      code,
      course_id,
      teacher_id || null,
      grade_group,
      start_date,
      finalEndDate,
      schedule_days,
      schedule_time,
      meeting_link || null,
      target_capacity,
      max_capacity,
      status,
      notes || 'Manually created batch by Administrator'
    );

    // Generate class sessions
    generateBatchSessions(batchId);

    // Audit Log
    db.prepare(`
      INSERT INTO audit_logs (id, actor_id, actor_name, actor_role, action, entity_type, entity_id, details_json)
      VALUES (?, ?, ?, 'ADMIN', 'BATCH_CREATED_MANUAL', 'BATCH', ?, ?)
    `).run(
      'log_' + Date.now().toString(36),
      req.user?.id,
      req.user?.name || 'Administrator',
      batchId,
      JSON.stringify({ batch_name, course_id, teacher_id, schedule_days, schedule_time })
    );

    const created = db.prepare('SELECT * FROM batches WHERE id = ?').get(batchId);
    return res.status(201).json({ batch: created, message: 'Batch created successfully with schedule sessions.' });
  } catch (error: any) {
    console.error('Create batch error:', error);
    return res.status(500).json({ error: 'Failed to create batch.' });
  }
});

// GET /api/batches/:id (Full Batch Detail, Roster, Sessions, Attendance & Homework)
batchesRouter.get('/:id', verifyToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const batch = db.prepare(`
      SELECT b.*, c.name as course_name, c.price_inr, c.total_classes, t.name as teacher_name, t.phone as teacher_phone, t.email as teacher_email,
        (SELECT COUNT(*) FROM batch_memberships bm WHERE bm.batch_id = b.id AND bm.status = 'ACTIVE') as enrolled_count
      FROM batches b
      JOIN courses c ON b.course_id = c.id
      LEFT JOIN teachers t ON b.teacher_id = t.id
      WHERE b.id = ?
    `).get(req.params.id) as any;

    if (!batch) {
      return res.status(404).json({ error: 'Batch not found.' });
    }

    // Active Students Roster
    const students = db.prepare(`
      SELECT s.*, bm.joined_at, bm.status as membership_status, bm.reason as transfer_reason
      FROM batch_memberships bm
      JOIN students s ON bm.student_id = s.id
      WHERE bm.batch_id = ?
      ORDER BY bm.joined_at ASC
    `).all(req.params.id);

    // Scheduled Sessions with Attendance count
    const sessions = db.prepare(`
      SELECT cs.*,
        (SELECT COUNT(*) FROM attendance a WHERE a.session_id = cs.id AND a.status = 'PRESENT') as present_count,
        (SELECT COUNT(*) FROM attendance a WHERE a.session_id = cs.id) as marked_count
      FROM class_sessions cs
      WHERE cs.batch_id = ?
      ORDER BY cs.session_number ASC, cs.date ASC
    `).all(req.params.id);

    // Homework assigned to batch
    const homework = db.prepare(`
      SELECT h.*,
        (SELECT COUNT(*) FROM homework_submissions hs WHERE hs.homework_id = h.id) as submission_count
      FROM homework h
      WHERE h.batch_id = ?
      ORDER BY h.due_date DESC
    `).all(req.params.id);

    return res.json({
      batch: {
        ...batch,
        students,
        sessions,
        homework,
      },
    });
  } catch (error: any) {
    console.error('Fetch batch detail error:', error);
    return res.status(500).json({ error: 'Failed to retrieve batch detail.' });
  }
});

// PATCH /api/batches/:id/teacher (Assign or change Teacher for Batch)
batchesRouter.patch('/:id/teacher', verifyToken, requireRole(['ADMIN', 'SUPER_ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  try {
    const { teacher_id } = req.body;
    const batch = db.prepare('SELECT * FROM batches WHERE id = ?').get(req.params.id) as any;
    if (!batch) {
      return res.status(404).json({ error: 'Batch not found.' });
    }

    const teacher = db.prepare('SELECT * FROM teachers WHERE id = ?').get(teacher_id) as any;
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found.' });
    }

    const newStatus = batch.status === 'NEEDS_TEACHER' ? 'OPEN' : batch.status;

    db.prepare(`
      UPDATE batches
      SET teacher_id = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(teacher_id, newStatus, batch.id);

    // Update upcoming sessions with new teacher
    db.prepare(`
      UPDATE class_sessions
      SET teacher_id = ?
      WHERE batch_id = ? AND status = 'UPCOMING'
    `).run(teacher_id, batch.id);

    // If batch was waiting for teacher, update enrollments to ACTIVE
    db.prepare(`
      UPDATE enrollments
      SET status = 'ACTIVE', updated_at = CURRENT_TIMESTAMP
      WHERE batch_id = ? AND status = 'WAITING_FOR_TEACHER'
    `).run(batch.id);

    // Notify Teacher
    const teacherUser = db.prepare('SELECT id FROM users WHERE teacher_id = ?').get(teacher_id) as any;
    if (teacherUser) {
      db.prepare(`
        INSERT INTO notifications (id, user_id, user_role, title, message, type, link_url)
        VALUES (?, ?, 'TEACHER', 'Batch Assigned to You', ?, 'SCHEDULE_CHANGE', '/teacher/classes')
      `).run(
        'notif_' + Date.now().toString(36),
        teacherUser.id,
        `You have been assigned as lead teacher for batch ${batch.batch_name} (${batch.schedule_days} at ${batch.schedule_time}).`
      );
    }

    // Audit Log
    db.prepare(`
      INSERT INTO audit_logs (id, actor_id, actor_name, actor_role, action, entity_type, entity_id, details_json)
      VALUES (?, ?, ?, 'ADMIN', 'BATCH_TEACHER_ASSIGNED', 'BATCH', ?, ?)
    `).run(
      'log_' + Date.now().toString(36),
      req.user?.id,
      req.user?.name || 'Administrator',
      batch.id,
      JSON.stringify({ previousTeacherId: batch.teacher_id, newTeacherId: teacher_id, teacherName: teacher.name })
    );

    const updated = db.prepare('SELECT * FROM batches WHERE id = ?').get(batch.id);
    return res.json({ batch: updated, message: `Teacher ${teacher.name} assigned to ${batch.batch_name}.` });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to assign teacher.' });
  }
});

// PATCH /api/batches/:id/meeting-link (Publish or update Google Meet URL)
batchesRouter.patch('/:id/meeting-link', verifyToken, requireRole(['ADMIN', 'SUPER_ADMIN', 'TEACHER']), (req: AuthenticatedRequest, res: Response) => {
  try {
    const { meeting_link } = req.body;
    const batch = db.prepare('SELECT * FROM batches WHERE id = ?').get(req.params.id) as any;
    if (!batch) {
      return res.status(404).json({ error: 'Batch not found.' });
    }

    const finalLink = meeting_link ? meeting_link.trim() : null;

    db.prepare(`
      UPDATE batches
      SET meeting_link = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(finalLink, batch.id);

    // Update upcoming class sessions if they don't have individual overrides
    db.prepare(`
      UPDATE class_sessions
      SET meeting_link = ?
      WHERE batch_id = ? AND status = 'UPCOMING'
    `).run(finalLink, batch.id);

    // Notify batch members if link was published
    if (finalLink) {
      const studentUsers = db.prepare(`
        SELECT u.id FROM batch_memberships bm
        JOIN users u ON u.student_id = bm.student_id
        WHERE bm.batch_id = ? AND bm.status = 'ACTIVE'
      `).all(batch.id) as any[];

      for (const u of studentUsers) {
        db.prepare(`
          INSERT INTO notifications (id, user_id, user_role, title, message, type, link_url)
          VALUES (?, ?, 'STUDENT', 'Google Meet Link Published', ?, 'SCHEDULE_CHANGE', '/student/classes')
        `).run(
          'notif_' + Date.now().toString(36) + '_' + u.id,
          u.id,
          `Classroom Google Meet link is now available for ${batch.batch_name}.`
        );
      }
    }

    const updated = db.prepare('SELECT * FROM batches WHERE id = ?').get(batch.id);
    return res.json({ batch: updated, message: 'Google Meet link updated successfully.' });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to update meeting link.' });
  }
});

// POST /api/batches/transfer (Transfer student to another batch)
batchesRouter.post('/transfer', verifyToken, requireRole(['ADMIN', 'SUPER_ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  try {
    const { studentId, fromBatchId, toBatchId, reason } = req.body;
    if (!studentId || !fromBatchId || !toBatchId) {
      return res.status(400).json({ error: 'studentId, fromBatchId, and toBatchId are required.' });
    }

    const result = transferStudent({
      studentId,
      fromBatchId,
      toBatchId,
      reason,
      actorId: req.user?.id,
      actorName: req.user?.name || 'Administrator',
    });

    return res.json(result);
  } catch (error: any) {
    return res.status(400).json({ error: error.message || 'Failed to transfer student.' });
  }
});

// POST /api/batches/auto-place/:enrollmentId (Manually trigger or retry automated placement)
batchesRouter.post('/auto-place/:enrollmentId', verifyToken, requireRole(['ADMIN', 'SUPER_ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = placeStudentInBatch(req.params.enrollmentId);
    return res.json({ success: true, placement: result });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Auto-placement failed.' });
  }
});
