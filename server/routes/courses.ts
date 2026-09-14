import { Router, Response } from 'express';
import { db } from '../db/schema.js';
import { verifyToken, AuthenticatedRequest } from '../middleware/auth.js';

export const coursesRouter = Router();

// GET /api/courses (Public & Admin - Get courses)
coursesRouter.get('/', (req, res) => {
  try {
    const courses = db.prepare('SELECT * FROM courses ORDER BY is_flagship DESC, created_at ASC').all();
    return res.json({ courses });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve courses.' });
  }
});

// POST /api/courses (Admin - Create new course)
coursesRouter.post('/', verifyToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      name,
      description,
      duration_months = 3,
      classes_per_week = 3,
      total_classes = 36,
      price_inr = 4999,
      target_batch_size = 8,
      max_batch_size = 9,
      is_flagship = 0,
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Course name is required.' });
    }

    const id = 'crs_' + Date.now().toString(36);
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    db.prepare(`
      INSERT INTO courses (id, name, slug, description, duration_months, classes_per_week, total_classes, price_inr, target_batch_size, max_batch_size, is_flagship, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE')
    `).run(
      id,
      name,
      slug,
      description || '',
      duration_months,
      classes_per_week,
      total_classes,
      price_inr,
      target_batch_size,
      max_batch_size,
      is_flagship ? 1 : 0
    );

    const created = db.prepare('SELECT * FROM courses WHERE id = ?').get(id);
    return res.status(201).json({ course: created, message: 'Course created successfully.' });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to create course.' });
  }
});
coursesRouter.patch('/:id', verifyToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, description, durationMonths, classesPerWeek, priceInr, targetBatchSize, maxBatchSize, status } = req.body;

    const updates: string[] = [];
    const params: any[] = [];

    if (name !== undefined) { updates.push('name = ?'); params.push(name.trim()); }
    if (description !== undefined) { updates.push('description = ?'); params.push(description.trim()); }
    if (durationMonths !== undefined) { updates.push('duration_months = ?'); params.push(parseInt(durationMonths, 10)); }
    if (classesPerWeek !== undefined) { updates.push('classes_per_week = ?'); params.push(parseInt(classesPerWeek, 10)); }
    if (priceInr !== undefined) { updates.push('price_inr = ?'); params.push(parseInt(priceInr, 10)); }
    if (targetBatchSize !== undefined) { updates.push('target_batch_size = ?'); params.push(parseInt(targetBatchSize, 10)); }
    if (maxBatchSize !== undefined) { updates.push('max_batch_size = ?'); params.push(parseInt(maxBatchSize, 10)); }
    if (status !== undefined) { updates.push('status = ?'); params.push(status); }

    if (updates.length > 0) {
      updates.push("updated_at = CURRENT_TIMESTAMP");
      params.push(req.params.id);
      db.prepare(`UPDATE courses SET ${updates.join(', ')} WHERE id = ?`).run(...params);
    }

    const updated = db.prepare('SELECT * FROM courses WHERE id = ?').get(req.params.id);
    return res.json({ course: updated, message: 'Course configuration updated.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update course.' });
  }
});
