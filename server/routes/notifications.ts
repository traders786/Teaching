import { Router, Response } from 'express';
import { db } from '../db/schema.js';
import { verifyToken, AuthenticatedRequest } from '../middleware/auth.js';

export const notificationsRouter = Router();

notificationsRouter.use(verifyToken);

// GET /api/notifications
notificationsRouter.get('/', (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const notifications = db.prepare(`
      SELECT * FROM notifications
      WHERE user_id = ? OR user_role = ?
      ORDER BY created_at DESC
      LIMIT 20
    `).all(user.id, user.role);

    const unreadCount = db.prepare(`
      SELECT COUNT(*) as count FROM notifications
      WHERE (user_id = ? OR user_role = ?) AND is_read = 0
    `).get(user.id, user.role) as any;

    return res.json({ notifications, unreadCount: unreadCount?.count || 0 });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve notifications.' });
  }
});

// PATCH /api/notifications/:id/read
notificationsRouter.patch('/:id/read', (req: AuthenticatedRequest, res: Response) => {
  try {
    db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ?').run(req.params.id);
    return res.json({ message: 'Notification marked as read.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update notification.' });
  }
});

// POST /api/notifications/read-all
notificationsRouter.post('/read-all', (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    db.prepare('UPDATE notifications SET is_read = 1 WHERE user_id = ? OR user_role = ?').run(user.id, user.role);
    return res.json({ message: 'All notifications marked as read.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to mark notifications read.' });
  }
});
