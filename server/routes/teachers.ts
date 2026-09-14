import { Router, Response } from 'express';
import { db } from '../db/schema.js';
import { verifyToken, AuthenticatedRequest } from '../middleware/auth.js';

export const teachersRouter = Router();

// GET /api/teachers
teachersRouter.get('/', (req, res) => {
  try {
    const teachers = db.prepare('SELECT * FROM teachers ORDER BY created_at ASC').all();
    return res.json({ teachers });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve teachers.' });
  }
});

// POST /api/teachers
teachersRouter.post('/', verifyToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, email, phone, photoUrl, biography, expertise, achievements, availability } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Teacher Name and Email are required.' });
    }

    const teacherId = 'tch_' + Date.now().toString(36);
    db.prepare(`
      INSERT INTO teachers (id, name, email, phone, photo_url, biography, expertise, achievements, availability, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE')
    `).run(
      teacherId,
      name.trim(),
      email.trim().toLowerCase(),
      phone || null,
      photoUrl || null,
      biography || null,
      expertise || null,
      achievements || null,
      availability || null
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
    const { name, email, phone, photoUrl, biography, expertise, achievements, availability, status } = req.body;

    const updates: string[] = [];
    const params: any[] = [];

    if (name !== undefined) { updates.push('name = ?'); params.push(name.trim()); }
    if (email !== undefined) { updates.push('email = ?'); params.push(email.trim().toLowerCase()); }
    if (phone !== undefined) { updates.push('phone = ?'); params.push(phone.trim()); }
    if (photoUrl !== undefined) { updates.push('photo_url = ?'); params.push(photoUrl); }
    if (biography !== undefined) { updates.push('biography = ?'); params.push(biography.trim()); }
    if (expertise !== undefined) { updates.push('expertise = ?'); params.push(expertise.trim()); }
    if (achievements !== undefined) { updates.push('achievements = ?'); params.push(achievements.trim()); }
    if (availability !== undefined) { updates.push('availability = ?'); params.push(availability.trim()); }
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
