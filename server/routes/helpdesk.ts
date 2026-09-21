import { Router, Response } from 'express';
import { db } from '../db/schema.js';
import { verifyToken, AuthenticatedRequest } from '../middleware/auth.js';

export const helpdeskRouter = Router();

helpdeskRouter.use(verifyToken);

// GET /api/helpdesk/tickets
helpdeskRouter.get('/tickets', (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    let tickets: any[] = [];

    if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') {
      tickets = db.prepare(`
        SELECT t.*,
          (SELECT COUNT(*) FROM ticket_messages tm WHERE tm.ticket_id = t.id) as message_count,
          (SELECT tm.created_at FROM ticket_messages tm WHERE tm.ticket_id = t.id ORDER BY tm.created_at DESC LIMIT 1) as last_message_at
        FROM helpdesk_tickets t
        ORDER BY t.updated_at DESC
      `).all();
    } else {
      tickets = db.prepare(`
        SELECT t.*,
          (SELECT COUNT(*) FROM ticket_messages tm WHERE tm.ticket_id = t.id) as message_count,
          (SELECT tm.created_at FROM ticket_messages tm WHERE tm.ticket_id = t.id ORDER BY tm.created_at DESC LIMIT 1) as last_message_at
        FROM helpdesk_tickets t
        WHERE t.user_id = ?
        ORDER BY t.updated_at DESC
      `).all(user.id);
    }

    return res.json({ tickets });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve helpdesk tickets.' });
  }
});

// POST /api/helpdesk/tickets
helpdeskRouter.post('/tickets', (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const { subject, category, priority, description, attachment_url } = req.body;

    if (!subject || !category || !description) {
      return res.status(400).json({ error: 'Subject, Category, and Description are required.' });
    }

    const ticketId = 'tkt_' + Date.now().toString(36);
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const ticketNumber = `UPS-${randomNum}`;

    db.prepare(`
      INSERT INTO helpdesk_tickets (id, ticket_number, user_id, user_name, user_role, subject, category, priority, status, attachment_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'OPEN', ?)
    `).run(
      ticketId,
      ticketNumber,
      user.id,
      user.name,
      user.role,
      subject.trim(),
      category,
      priority || 'NORMAL',
      attachment_url || null
    );

    // Initial message
    db.prepare(`
      INSERT INTO ticket_messages (id, ticket_id, sender_id, sender_name, sender_role, message, attachment_url)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      'msg_' + Date.now().toString(36),
      ticketId,
      user.id,
      user.name,
      user.role,
      description.trim(),
      attachment_url || null
    );

    // If student/teacher created, notify admin
    if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
      const admin = db.prepare("SELECT id FROM users WHERE role = 'SUPER_ADMIN' LIMIT 1").get() as any;
      if (admin) {
        db.prepare(`
          INSERT INTO notifications (id, user_id, user_role, title, message, type, link_url)
          VALUES (?, ?, 'SUPER_ADMIN', ?, ?, 'TICKET_RESPONSE', '/admin/helpdesk')
        `).run(
          'notif_' + Date.now(),
          admin.id,
          `New Support Ticket ${ticketNumber}`,
          `${user.name} (${user.role}) opened ticket: "${subject}".`
        );
      }
    }

    return res.status(201).json({
      message: 'Helpdesk ticket raised successfully.',
      ticket: { id: ticketId, ticket_number: ticketNumber },
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create ticket.' });
  }
});

// GET /api/helpdesk/tickets/:id
helpdeskRouter.get('/tickets/:id', (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const ticket = db.prepare('SELECT * FROM helpdesk_tickets WHERE id = ?').get(req.params.id) as any;

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found.' });
    }

    // Authorization check
    if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN' && ticket.user_id !== user.id) {
      return res.status(403).json({ error: 'Unauthorized to view this ticket.' });
    }

    const messages = db.prepare(`
      SELECT * FROM ticket_messages WHERE ticket_id = ? ORDER BY created_at ASC
    `).all(req.params.id);

    return res.json({ ticket, messages });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve ticket thread.' });
  }
});

// POST /api/helpdesk/tickets/:id/messages
helpdeskRouter.post('/tickets/:id/messages', (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const { message, attachment_url } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    const ticket = db.prepare('SELECT * FROM helpdesk_tickets WHERE id = ?').get(req.params.id) as any;
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found.' });
    }

    // Authorization check
    if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN' && ticket.user_id !== user.id) {
      return res.status(403).json({ error: 'Unauthorized to post to this ticket.' });
    }

    const msgId = 'msg_' + Date.now().toString(36);
    db.prepare(`
      INSERT INTO ticket_messages (id, ticket_id, sender_id, sender_name, sender_role, message, attachment_url)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(msgId, req.params.id, user.id, user.name, user.role, message.trim(), attachment_url || null);

    // Update ticket updated_at and status if admin replied
    let newStatus = ticket.status;
    if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') {
      newStatus = 'WAITING_FOR_USER';
      // Notify creator
      db.prepare(`
        INSERT INTO notifications (id, user_id, user_role, title, message, type, link_url)
        VALUES (?, ?, ?, ?, ?, 'TICKET_RESPONSE', '/helpdesk')
      `).run(
        'notif_' + Date.now(),
        ticket.user_id,
        ticket.user_role,
        `Update on Ticket ${ticket.ticket_number}`,
        `Support agent ${user.name} responded to your ticket.`
      );
    } else {
      newStatus = 'IN_PROGRESS';
    }

    db.prepare(`UPDATE helpdesk_tickets SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(newStatus, req.params.id);

    return res.status(201).json({ message: 'Reply sent successfully.', messageId: msgId });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to post message.' });
  }
});

// PATCH /api/helpdesk/tickets/:id/status
helpdeskRouter.patch('/tickets/:id/status', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required.' });
    }

    db.prepare(`UPDATE helpdesk_tickets SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(status, req.params.id);
    return res.json({ message: 'Ticket status updated.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update ticket status.' });
  }
});
