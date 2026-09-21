import { Router, Response } from 'express';
import { db } from '../db/schema.js';
import { verifyToken, AuthenticatedRequest } from '../middleware/auth.js';

export const teachersRouter = Router();

// GET /api/teachers (List all teachers with demo counts, payout earnings @ ₹150/demo, batches & students)
teachersRouter.get('/', (req, res) => {
  try {
    const teachers = db.prepare(`
      SELECT t.*,
        (SELECT COUNT(*) FROM demo_sessions ds WHERE ds.teacher_id = t.id) as total_demos,
        (SELECT COUNT(*) FROM demo_sessions ds WHERE ds.teacher_id = t.id AND (ds.status = 'COMPLETED' OR EXISTS (SELECT 1 FROM demo_evaluations de WHERE de.demo_id = ds.id))) as completed_demos,
        (SELECT COUNT(*) FROM demo_sessions ds WHERE ds.teacher_id = t.id AND ds.status IN ('SCHEDULED', 'ASSIGNED', 'IN_PROGRESS')) as pending_demos,
        (SELECT COUNT(*) FROM batches b WHERE b.teacher_id = t.id AND b.status = 'ACTIVE') as assigned_batches_count,
        (SELECT COUNT(DISTINCT bs.student_id) FROM batch_students bs JOIN batches b ON bs.batch_id = b.id WHERE b.teacher_id = t.id AND bs.status = 'ACTIVE') as active_students_count
      FROM teachers t
      ORDER BY t.created_at ASC
    `).all() as any[];

    const enriched = teachers.map((t) => {
      const payoutRate = t.payout_per_demo || 150;
      const completed = t.completed_demos || 0;
      return {
        ...t,
        payout_per_demo: payoutRate,
        total_earnings: completed * payoutRate,
      };
    });

    return res.json({ teachers: enriched });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve teachers.' });
  }
});

// GET /api/teachers/:id/demos (Admin — Full demo history, evaluation outcomes, and payout breakdown for a teacher)
teachersRouter.get('/:id/demos', verifyToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const demos = db.prepare(`
      SELECT ds.*,
        COALESCE(
          (SELECT l.student_name FROM demo_attendees da JOIN leads l ON da.lead_id = l.id WHERE da.demo_id = ds.id LIMIT 1),
          ds.title
        ) as student_name,
        (SELECT l.student_class FROM demo_attendees da JOIN leads l ON da.lead_id = l.id WHERE da.demo_id = ds.id LIMIT 1) as student_class,
        (SELECT l.parent_name FROM demo_attendees da JOIN leads l ON da.lead_id = l.id WHERE da.demo_id = ds.id LIMIT 1) as parent_name,
        (SELECT l.mobile_number FROM demo_attendees da JOIN leads l ON da.lead_id = l.id WHERE da.demo_id = ds.id LIMIT 1) as parent_phone,
        de.id as evaluation_id,
        de.outcome as evaluation_outcome,
        de.recommended_program,
        de.evaluated_at
      FROM demo_sessions ds
      LEFT JOIN demo_evaluations de ON de.demo_id = ds.id
      WHERE ds.teacher_id = ?
      ORDER BY ds.date DESC, ds.start_time DESC
    `).all(req.params.id) as any[];

    const teacher = db.prepare('SELECT * FROM teachers WHERE id = ?').get(req.params.id) as any;
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found.' });
    }

    const payoutRate = teacher.payout_per_demo || 150;

    const enriched = demos.map((d) => {
      const isCompleted = d.status === 'COMPLETED' || !!d.evaluation_id;
      return {
        ...d,
        is_completed: isCompleted,
        payout_amount: isCompleted ? payoutRate : 0,
        payout_status: isCompleted ? 'EARNED' : 'PENDING_COMPLETION',
      };
    });

    const totalEarned = enriched.reduce((sum, d) => sum + d.payout_amount, 0);

    return res.json({
      teacher,
      demos: enriched,
      payoutRate,
      totalEarned,
      completedCount: enriched.filter((d) => d.is_completed).length,
      pendingCount: enriched.filter((d) => !d.is_completed).length,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve teacher demos.' });
  }
});

// POST /api/teachers
teachersRouter.post('/', verifyToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      name, email, phone, photoUrl, biography, expertise,
      achievements, availability, google_meet_link, googleMeetLink, payout_per_demo
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Teacher Name and Email are required.' });
    }

    const meetLink = google_meet_link || googleMeetLink || null;
    const teacherId = 'tch_' + Date.now().toString(36);
    db.prepare(`
      INSERT INTO teachers (
        id, name, email, phone, photo_url, biography, expertise,
        achievements, availability, google_meet_link, payout_per_demo, status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE')
    `).run(
      teacherId,
      name.trim(),
      email.trim().toLowerCase(),
      phone || null,
      photoUrl || null,
      biography || null,
      expertise || null,
      achievements || null,
      availability || null,
      meetLink ? meetLink.trim() : null,
      payout_per_demo ? parseInt(payout_per_demo, 10) : 150
    );

    const created = db.prepare('SELECT * FROM teachers WHERE id = ?').get(teacherId);
    return res.status(201).json({ teacher: created, message: 'Teacher added successfully.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to add teacher.' });
  }
});

// PATCH /api/teachers/:id
teachersRouter.patch('/:id', verifyToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      name, email, phone, photoUrl, biography, expertise,
      achievements, availability, google_meet_link, googleMeetLink, payout_per_demo, status
    } = req.body;

    const meetLink = google_meet_link !== undefined ? google_meet_link : googleMeetLink;
    const updates: string[] = [];
    const params: any[] = [];

    if (name !== undefined) { updates.push('name = ?'); params.push(name.trim()); }
    if (email !== undefined) { updates.push('email = ?'); params.push(email.trim().toLowerCase()); }
    if (phone !== undefined) { updates.push('phone = ?'); params.push(phone ? phone.trim() : null); }
    if (photoUrl !== undefined) { updates.push('photo_url = ?'); params.push(photoUrl); }
    if (biography !== undefined) { updates.push('biography = ?'); params.push(biography ? biography.trim() : null); }
    if (expertise !== undefined) { updates.push('expertise = ?'); params.push(expertise ? expertise.trim() : null); }
    if (achievements !== undefined) { updates.push('achievements = ?'); params.push(achievements ? achievements.trim() : null); }
    if (availability !== undefined) { updates.push('availability = ?'); params.push(availability ? availability.trim() : null); }
    if (meetLink !== undefined) { updates.push('google_meet_link = ?'); params.push(meetLink ? meetLink.trim() : null); }
    if (payout_per_demo !== undefined) { updates.push('payout_per_demo = ?'); params.push(parseInt(payout_per_demo, 10) || 150); }
    if (status !== undefined) { updates.push('status = ?'); params.push(status); }

    if (updates.length > 0) {
      updates.push("updated_at = CURRENT_TIMESTAMP");
      params.push(req.params.id);
      db.prepare(`UPDATE teachers SET ${updates.join(', ')} WHERE id = ?`).run(...params);
    }

    const updated = db.prepare('SELECT * FROM teachers WHERE id = ?').get(req.params.id);
    return res.json({ teacher: updated, message: 'Teacher profile updated.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update teacher.' });
  }
});
