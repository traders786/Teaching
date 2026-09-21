import { Router, Response } from 'express';
import { db } from '../db/schema.js';
import { verifyToken, requireRole, AuthenticatedRequest } from '../middleware/auth.js';
import { activateEnrollment } from '../services/enrollmentService.js';

export const studentsRouter = Router();

// GET /api/students (List students with full academic & operational metrics)
studentsRouter.get('/', verifyToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, search } = req.query;

    let query = `
      SELECT s.*, 
        b.id as batch_id, b.batch_name, b.code as batch_code, b.schedule_days, b.schedule_time, b.status as batch_status,
        t.name as teacher_name,
        e.id as enrollment_id, e.start_date, e.end_date, e.status as enrollment_status,
        c.name as course_name, c.total_classes,
        (SELECT COUNT(*) FROM attendance a WHERE a.student_id = s.id AND a.status = 'PRESENT') as attended_classes_count,
        (SELECT COUNT(*) FROM homework_submissions hs WHERE hs.student_id = s.id AND hs.status = 'REVIEWED') as reviewed_homework_count,
        (SELECT status FROM payments p WHERE p.student_id = s.id ORDER BY p.created_at DESC LIMIT 1) as payment_status
      FROM students s
      LEFT JOIN batch_memberships bm ON bm.student_id = s.id AND bm.status = 'ACTIVE'
      LEFT JOIN batches b ON bm.batch_id = b.id
      LEFT JOIN teachers t ON b.teacher_id = t.id
      LEFT JOIN enrollments e ON e.student_id = s.id AND e.status IN ('ACTIVE', 'WAITING_FOR_TEACHER', 'WAITING_FOR_BATCH')
      LEFT JOIN courses c ON e.course_id = c.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status && status !== 'ALL') {
      query += ' AND s.status = ?';
      params.push(status);
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      const term = `%${search.trim()}%`;
      query += ' AND (s.name LIKE ? OR s.parent_name LIKE ? OR s.parent_phone LIKE ? OR s.city LIKE ? OR b.batch_name LIKE ?)';
      params.push(term, term, term, term, term);
    }

    query += ' ORDER BY s.created_at DESC';

    const students = db.prepare(query).all(...params);
    return res.json({ students });
  } catch (error: any) {
    console.error('Fetch students error:', error);
    return res.status(500).json({ error: 'Failed to retrieve students.' });
  }
});

// GET /api/students/:id (Detailed 360-degree Student Profile)
studentsRouter.get('/:id', verifyToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const student = db.prepare('SELECT * FROM students WHERE id = ?').get(req.params.id) as any;
    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    // All historical and active enrollments
    const enrollments = db.prepare(`
      SELECT e.*, c.name as course_name, b.batch_name, b.code as batch_code, p.amount_inr, p.status as payment_status
      FROM enrollments e
      LEFT JOIN courses c ON e.course_id = c.id
      LEFT JOIN batches b ON e.batch_id = b.id
      LEFT JOIN payments p ON e.payment_id = p.id
      WHERE e.student_id = ?
      ORDER BY e.created_at DESC
    `).all(req.params.id);

    // Active batch membership
    const activeBatch = db.prepare(`
      SELECT b.*, t.name as teacher_name, t.phone as teacher_phone, t.email as teacher_email,
        bm.joined_at, bm.status as membership_status
      FROM batch_memberships bm
      JOIN batches b ON bm.batch_id = b.id
      LEFT JOIN teachers t ON b.teacher_id = t.id
      WHERE bm.student_id = ? AND bm.status = 'ACTIVE'
    `).get(req.params.id);

    // Batch membership history (including transfers)
    const membershipHistory = db.prepare(`
      SELECT bm.*, b.batch_name, b.code as batch_code, t.name as teacher_name
      FROM batch_memberships bm
      JOIN batches b ON bm.batch_id = b.id
      LEFT JOIN teachers t ON b.teacher_id = t.id
      WHERE bm.student_id = ?
      ORDER BY bm.joined_at DESC
    `).all(req.params.id);

    // Attendance records
    const attendanceRecords = db.prepare(`
      SELECT a.*, cs.topic, cs.date, cs.session_number
      FROM attendance a
      JOIN class_sessions cs ON a.session_id = cs.id
      WHERE a.student_id = ?
      ORDER BY cs.date DESC
    `).all(req.params.id);

    // Homework submissions
    const homeworkSubmissions = db.prepare(`
      SELECT hs.*, h.title as homework_title, h.due_date, t.name as teacher_name
      FROM homework_submissions hs
      JOIN homework h ON hs.homework_id = h.id
      LEFT JOIN teachers t ON h.teacher_id = t.id
      WHERE hs.student_id = ?
      ORDER BY hs.submitted_at DESC
    `).all(req.params.id);

    return res.json({
      student,
      enrollments,
      activeBatch,
      membershipHistory,
      attendanceRecords,
      homeworkSubmissions,
    });
  } catch (error: any) {
    console.error('Fetch student detail error:', error);
    return res.status(500).json({ error: 'Failed to retrieve student details.' });
  }
});

// POST /api/students/manual-enroll (Admin Manual / Complimentary Enrollment Activation)
studentsRouter.post('/manual-enroll', verifyToken, requireRole(['ADMIN', 'SUPER_ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  try {
    const { studentId, courseId = 'crs_flagship_1', preferredDays, preferredTime, gradeGroup, reason } = req.body;
    if (!studentId) {
      return res.status(400).json({ error: 'studentId is required.' });
    }

    const result = activateEnrollment({
      studentId,
      courseId,
      preferredDays,
      preferredTime,
      gradeGroup,
      isManualAdmin: true,
      actorId: req.user?.id,
      actorName: req.user?.name || 'Administrator',
    });

    return res.status(201).json({
      success: true,
      message: `Manual enrollment activated for student. Auto-placement: ${result.placement.reason}`,
      result,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to activate manual enrollment.' });
  }
});

// PATCH /api/students/:id (Update student information)
studentsRouter.patch('/:id', verifyToken, requireRole(['ADMIN', 'SUPER_ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, classGrade, age, parentName, parentPhone, parentEmail, city, preferredDays, preferredTime, status } = req.body;

    const updates: string[] = [];
    const params: any[] = [];

    if (name !== undefined) { updates.push('name = ?'); params.push(name.trim()); }
    if (classGrade !== undefined) { updates.push('class_grade = ?'); params.push(classGrade.trim()); }
    if (age !== undefined) { updates.push('age = ?'); params.push(parseInt(age, 10)); }
    if (parentName !== undefined) { updates.push('parent_name = ?'); params.push(parentName.trim()); }
    if (parentPhone !== undefined) { updates.push('parent_phone = ?'); params.push(parentPhone.trim()); }
    if (parentEmail !== undefined) { updates.push('parent_email = ?'); params.push(parentEmail.trim().toLowerCase()); }
    if (city !== undefined) { updates.push('city = ?'); params.push(city.trim()); }
    if (preferredDays !== undefined) { updates.push('preferred_days = ?'); params.push(preferredDays); }
    if (preferredTime !== undefined) { updates.push('preferred_time = ?'); params.push(preferredTime); }
    if (status !== undefined) { updates.push('status = ?'); params.push(status); }

    if (updates.length > 0) {
      updates.push('updated_at = CURRENT_TIMESTAMP');
      params.push(req.params.id);
      db.prepare(`UPDATE students SET ${updates.join(', ')} WHERE id = ?`).run(...params);
    }

    const updated = db.prepare('SELECT * FROM students WHERE id = ?').get(req.params.id);
    return res.json({ student: updated, message: 'Student information updated successfully.' });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to update student.' });
  }
});
