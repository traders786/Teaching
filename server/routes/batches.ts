import { Router, Response } from 'express';
import { db } from '../db/schema.js';
import { verifyToken, AuthenticatedRequest } from '../middleware/auth.js';

export const batchesRouter = Router();

// GET /api/batches (List all batches with capacity metrics)
batchesRouter.get('/', verifyToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const batches = db.prepare(`
      SELECT b.*, c.name as course_name, t.name as teacher_name,
        (SELECT COUNT(*) FROM batch_students bs WHERE bs.batch_id = b.id AND bs.status = 'ACTIVE') as enrolled_count
      FROM batches b
      JOIN courses c ON b.course_id = c.id
      LEFT JOIN teachers t ON b.teacher_id = t.id
      ORDER BY b.start_date ASC
    `).all();

    return res.json({ batches });
  } catch (error: any) {
    console.error('Fetch batches error:', error);
    return res.status(500).json({ error: 'Failed to retrieve batches.' });
  }
});

// POST /api/batches (Create a batch)
batchesRouter.post('/', verifyToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const finalBatchName = req.body.batch_name || req.body.batchName || req.body.name;
    const finalCourseId = req.body.course_id || req.body.courseId || 'crs_flagship_1';
    const finalTeacherId = req.body.teacher_id || req.body.teacherId || null;
    const finalStartDate = req.body.start_date || req.body.startDate || new Date().toISOString().slice(0, 10);
    const finalEndDate = req.body.end_date || req.body.endDate || new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10);
    const finalScheduleDays = req.body.schedule_days || req.body.scheduleDays || 'Mon, Wed, Fri';
    const finalScheduleTime = req.body.schedule_time || req.body.scheduleTime || '5:00 PM - 6:00 PM IST';
    const finalMeetingLink = req.body.meeting_link || req.body.meetingLink || req.body.meeting_url || req.body.meetingUrl || null;
    const finalTarget = req.body.target_capacity || req.body.targetCapacity || req.body.target_size || 8;
    const finalMax = req.body.max_capacity || req.body.maxCapacity || req.body.max_size || 9;
    const finalNotes = req.body.notes || req.body.class_range || null;

    if (!finalBatchName) {
      return res.status(400).json({ error: 'Batch Name is required.' });
    }

    const batchId = 'batch_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);

    db.prepare(`
      INSERT INTO batches (
        id, batch_name, course_id, teacher_id, start_date, end_date, schedule_days, schedule_time,
        meeting_link, target_capacity, max_capacity, status, notes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'UPCOMING', ?)
    `).run(
      batchId,
      finalBatchName.trim(),
      finalCourseId,
      finalTeacherId,
      finalStartDate,
      finalEndDate,
      finalScheduleDays,
      finalScheduleTime,
      finalMeetingLink,
      finalTarget,
      finalMax,
      finalNotes
    );

    const created = db.prepare('SELECT * FROM batches WHERE id = ?').get(batchId);
    return res.status(201).json({ batch: created, message: 'Batch created successfully.' });
  } catch (error: any) {
    console.error('Create batch error:', error);
    return res.status(500).json({ error: 'Failed to create batch.' });
  }
});

// GET /api/batches/:id (Batch detail & roster)
batchesRouter.get('/:id', verifyToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const batch = db.prepare(`
      SELECT b.*, c.name as course_name, c.price_inr, t.name as teacher_name, t.phone as teacher_phone
      FROM batches b
      JOIN courses c ON b.course_id = c.id
      LEFT JOIN teachers t ON b.teacher_id = t.id
      WHERE b.id = ?
    `).get(req.params.id) as any;

    if (!batch) {
      return res.status(404).json({ error: 'Batch not found.' });
    }

    const students = db.prepare(`
      SELECT s.*, bs.enrolled_at, bs.status as batch_student_status
      FROM batch_students bs
      JOIN students s ON bs.student_id = s.id
      WHERE bs.batch_id = ?
      ORDER BY bs.enrolled_at ASC
    `).all(req.params.id);

    return res.json({
      batch: {
        ...batch,
        enrolled_count: students.length,
      },
      students,
    });
  } catch (error: any) {
    console.error('Fetch batch detail error:', error);
    return res.status(500).json({ error: 'Failed to retrieve batch details.' });
  }
});

// PATCH /api/batches/:id (Update batch details)
batchesRouter.patch('/:id', verifyToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      batchName,
      teacherId,
      startDate,
      endDate,
      scheduleDays,
      scheduleTime,
      meetingLink,
      targetCapacity,
      maxCapacity,
      status,
      notes,
    } = req.body;

    const updates: string[] = [];
    const params: any[] = [];

    if (batchName !== undefined) { updates.push('batch_name = ?'); params.push(batchName.trim()); }
    if (teacherId !== undefined) { updates.push('teacher_id = ?'); params.push(teacherId || null); }
    if (startDate !== undefined) { updates.push('start_date = ?'); params.push(startDate); }
    if (endDate !== undefined) { updates.push('end_date = ?'); params.push(endDate); }
    if (scheduleDays !== undefined) { updates.push('schedule_days = ?'); params.push(scheduleDays); }
    if (scheduleTime !== undefined) { updates.push('schedule_time = ?'); params.push(scheduleTime); }
    if (meetingLink !== undefined) { updates.push('meeting_link = ?'); params.push(meetingLink); }
    if (targetCapacity !== undefined) { updates.push('target_capacity = ?'); params.push(targetCapacity); }
    if (maxCapacity !== undefined) { updates.push('max_capacity = ?'); params.push(maxCapacity); }
    if (status !== undefined) { updates.push('status = ?'); params.push(status); }
    if (notes !== undefined) { updates.push('notes = ?'); params.push(notes); }

    if (updates.length > 0) {
      updates.push("updated_at = CURRENT_TIMESTAMP");
      params.push(req.params.id);
      db.prepare(`UPDATE batches SET ${updates.join(', ')} WHERE id = ?`).run(...params);
    }

    const updated = db.prepare('SELECT * FROM batches WHERE id = ?').get(req.params.id);
    return res.json({ batch: updated, message: 'Batch updated successfully.' });
  } catch (error: any) {
    console.error('Update batch error:', error);
    return res.status(500).json({ error: 'Failed to update batch.' });
  }
});

// POST /api/batches/:id/students (Assign student with capacity validation)
batchesRouter.post('/:id/students', verifyToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { studentId } = req.body;
    if (!studentId) {
      return res.status(400).json({ error: 'studentId is required.' });
    }

    const batch = db.prepare('SELECT * FROM batches WHERE id = ?').get(req.params.id) as any;
    if (!batch) {
      return res.status(404).json({ error: 'Batch not found.' });
    }

    const currentCountResult = db.prepare(`
      SELECT COUNT(*) as count FROM batch_students WHERE batch_id = ? AND status = 'ACTIVE'
    `).get(batch.id) as any;
    const currentCount = currentCountResult.count;

    if (currentCount >= batch.max_capacity) {
      return res.status(400).json({
        error: `Cannot assign student: Batch has reached hard limit maximum capacity of ${batch.max_capacity} students.`,
      });
    }

    let warning: string | undefined;
    if (currentCount >= batch.target_capacity) {
      warning = `Note: Batch target capacity (${batch.target_capacity}) has been exceeded. Currently enrolled: ${currentCount + 1}/${batch.max_capacity}.`;
    }

    // Insert or update batch student
    db.prepare(`
      INSERT INTO batch_students (id, batch_id, student_id, status)
      VALUES (?, ?, ?, 'ACTIVE')
      ON CONFLICT(batch_id, student_id) DO UPDATE SET status = 'ACTIVE'
    `).run('bs_' + Date.now(), batch.id, studentId);

    // Update student's active enrollment batch
    db.prepare(`
      UPDATE enrollments SET batch_id = ? WHERE student_id = ? AND status = 'ACTIVE'
    `).run(batch.id, studentId);

    return res.json({
      success: true,
      message: 'Student assigned to batch successfully.',
      warning,
      enrolledCount: currentCount + 1,
    });
  } catch (error: any) {
    console.error('Assign student error:', error);
    return res.status(500).json({ error: 'Failed to assign student to batch.' });
  }
});

// DELETE /api/batches/:id/students/:studentId (Remove student from batch)
batchesRouter.delete('/:id/students/:studentId', verifyToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    db.prepare('DELETE FROM batch_students WHERE batch_id = ? AND student_id = ?').run(req.params.id, req.params.studentId);
    return res.json({ message: 'Student removed from batch.' });
  } catch (error: any) {
    console.error('Remove student error:', error);
    return res.status(500).json({ error: 'Failed to remove student from batch.' });
  }
});
