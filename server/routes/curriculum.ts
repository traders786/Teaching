import { Router, Response } from 'express';
import { db } from '../db/schema.js';
import { verifyToken, requireRole, AuthenticatedRequest } from '../middleware/auth.js';

export const curriculumRouter = Router();

// GET /api/curriculum/all (Public / Auth read)
curriculumRouter.get('/all', (req, res) => {
  try {
    const modules = db.prepare(`
      SELECT cm.*, c.name as course_name
      FROM curriculum_modules cm
      JOIN courses c ON c.id = cm.course_id
      ORDER BY cm.grade_group ASC, cm.module_number ASC
    `).all();

    const sessions = db.prepare(`
      SELECT cs.*
      FROM curriculum_sessions cs
      ORDER BY cs.week_number ASC, cs.session_number ASC
    `).all();

    return res.json({ modules, sessions });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve curriculum catalog.' });
  }
});

// Admin management routes
curriculumRouter.use(verifyToken);
curriculumRouter.use(requireRole(['SUPER_ADMIN', 'ADMIN']));

// POST /api/curriculum/modules
curriculumRouter.post('/modules', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { course_id, grade_group, module_number, title, description } = req.body;

    if (!course_id || !grade_group || !title) {
      return res.status(400).json({ error: 'Course, Grade Group, and Title are required.' });
    }

    const modId = 'mod_' + Date.now().toString(36);
    db.prepare(`
      INSERT INTO curriculum_modules (id, course_id, grade_group, module_number, title, description)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(modId, course_id, grade_group, module_number || 1, title.trim(), description || null);

    return res.status(201).json({ message: 'Curriculum module created.', moduleId: modId });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create module.' });
  }
});

// POST /api/curriculum/sessions
curriculumRouter.post('/sessions', (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      module_id,
      course_id,
      grade_group,
      week_number,
      session_number,
      topic,
      learning_objective,
      activity,
      speaking_exercise,
      homework_suggestion,
      required_materials,
    } = req.body;

    if (!module_id || !topic || !learning_objective) {
      return res.status(400).json({ error: 'Module, Topic, and Learning Objective are required.' });
    }

    const sessId = 'sess_' + Date.now().toString(36);
    db.prepare(`
      INSERT INTO curriculum_sessions (
        id, module_id, course_id, grade_group, week_number, session_number, topic,
        learning_objective, activity, speaking_exercise, homework_suggestion, required_materials
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      sessId,
      module_id,
      course_id || 'crs_flagship_1',
      grade_group || 'Class 4-7',
      week_number || 1,
      session_number || 1,
      topic.trim(),
      learning_objective.trim(),
      activity || null,
      speaking_exercise || null,
      homework_suggestion || null,
      required_materials || null
    );

    return res.status(201).json({ message: 'Curriculum session added.', sessionId: sessId });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create session.' });
  }
});

// PATCH /api/curriculum/sessions/:id
curriculumRouter.patch('/sessions/:id', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { topic, learning_objective, activity, speaking_exercise, homework_suggestion, required_materials, is_completed } = req.body;
    const updates: string[] = [];
    const params: any[] = [];

    if (topic !== undefined) { updates.push('topic = ?'); params.push(topic.trim()); }
    if (learning_objective !== undefined) { updates.push('learning_objective = ?'); params.push(learning_objective.trim()); }
    if (activity !== undefined) { updates.push('activity = ?'); params.push(activity); }
    if (speaking_exercise !== undefined) { updates.push('speaking_exercise = ?'); params.push(speaking_exercise); }
    if (homework_suggestion !== undefined) { updates.push('homework_suggestion = ?'); params.push(homework_suggestion); }
    if (required_materials !== undefined) { updates.push('required_materials = ?'); params.push(required_materials); }
    if (is_completed !== undefined) { updates.push('is_completed = ?'); params.push(is_completed ? 1 : 0); }

    if (updates.length > 0) {
      params.push(req.params.id);
      db.prepare(`UPDATE curriculum_sessions SET ${updates.join(', ')} WHERE id = ?`).run(...params);
    }

    return res.json({ message: 'Curriculum session updated.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update curriculum session.' });
  }
});
