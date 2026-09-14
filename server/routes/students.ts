import { Router, Response } from 'express';
import { db } from '../db/schema.js';
import { verifyToken, AuthenticatedRequest } from '../middleware/auth.js';

export const studentsRouter = Router();

// GET /api/students (List students with enrollment and batch info)
studentsRouter.get('/', verifyToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, search } = req.query;

    let query = `
      SELECT s.*, 
        b.id as batch_id, b.batch_name, b.schedule_days, b.schedule_time,
        e.start_date, e.end_date, e.status as enrollment_status,
        c.name as course_name
      FROM students s
      LEFT JOIN batch_students bs ON bs.student_id = s.id AND bs.status = 'ACTIVE'
      LEFT JOIN batches b ON bs.batch_id = b.id
      LEFT JOIN enrollments e ON e.student_id = s.id AND e.status = 'ACTIVE'
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
      query += ' AND (s.name LIKE ? OR s.parent_name LIKE ? OR s.parent_phone LIKE ? OR s.city LIKE ?)';
      params.push(term, term, term, term);
    }

    query += ' ORDER BY s.created_at DESC';

    const students = db.prepare(query).all(...params);
    return res.json({ students });
  } catch (error: any) {
    console.error('Fetch students error:', error);
    return res.status(500).json({ error: 'Failed to retrieve students.' });
  }
});

// GET /api/students/:id (Detailed student record)
studentsRouter.get('/:id', verifyToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const student = db.prepare('SELECT * FROM students WHERE id = ?').get(req.params.id) as any;
    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    const enrollments = db.prepare(`
      SELECT e.*, c.name as course_name, b.batch_name, p.amount_inr, p.status as payment_status
      FROM enrollments e
      LEFT JOIN courses c ON e.course_id = c.id
      LEFT JOIN batches b ON e.batch_id = b.id
      LEFT JOIN payments p ON e.payment_id = p.id
      WHERE e.student_id = ?
      ORDER BY e.created_at DESC
    `).all(req.params.id);

    const activeBatch = db.prepare(`
      SELECT b.*, t.name as teacher_name
      FROM batch_students bs
      JOIN batches b ON bs.batch_id = b.id
      LEFT JOIN teachers t ON b.teacher_id = t.id
      WHERE bs.student_id = ? AND bs.status = 'ACTIVE'
    `).get(req.params.id);

    return res.json({ student, enrollments, activeBatch });
  } catch (error: any) {
    console.error('Fetch student detail error:', error);
    return res.status(500).json({ error: 'Failed to retrieve student details.' });
  }
});

// PATCH /api/students/:id (Update student information)
studentsRouter.patch('/:id', verifyToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, classGrade, age, parentName, parentPhone, parentEmail, city, status } = req.body;

    const updates: string[] = [];
    const params: any[] = [];

    if (name !== undefined) { updates.push('name = ?'); params.push(name.trim()); }
    if (classGrade !== undefined) { updates.push('class_grade = ?'); params.push(classGrade.trim()); }
    if (age !== undefined) { updates.push('age = ?'); params.push(parseInt(age, 10)); }
    if (parentName !== undefined) { updates.push('parent_name = ?'); params.push(parentName.trim()); }
    if (parentPhone !== undefined) { updates.push('parent_phone = ?'); params.push(parentPhone.trim()); }
    if (parentEmail !== undefined) { updates.push('parent_email = ?'); params.push(parentEmail.trim().toLowerCase()); }
    if (city !== undefined) { updates.push('city = ?'); params.push(city.trim()); }
    if (status !== undefined) { updates.push('status = ?'); params.push(status); }

    if (updates.length > 0) {
      updates.push("updated_at = CURRENT_TIMESTAMP");
      params.push(req.params.id);
      db.prepare(`UPDATE students SET ${updates.join(', ')} WHERE id = ?`).run(...params);
    }

    const updated = db.prepare('SELECT * FROM students WHERE id = ?').get(req.params.id);
    return res.json({ student: updated, message: 'Student updated successfully.' });
  } catch (error: any) {
    console.error('Update student error:', error);
    return res.status(500).json({ error: 'Failed to update student.' });
  }
});
