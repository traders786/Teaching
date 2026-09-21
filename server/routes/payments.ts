import { Router, Request, Response } from 'express';
import { db } from '../db/schema.js';
import { verifyToken, AuthenticatedRequest } from '../middleware/auth.js';
import { activateEnrollment } from '../services/enrollmentService.js';

export const paymentsRouter = Router();

// GET /api/payments (Admin - List payments)
paymentsRouter.get('/', verifyToken, (_req: AuthenticatedRequest, res: Response) => {
  try {
    const payments = db.prepare(`
      SELECT p.*, c.name as course_name,
        COALESCE(l.student_name, s.name) as student_name,
        COALESCE(l.parent_name, s.parent_name) as parent_name,
        COALESCE(l.mobile_number, s.parent_phone) as parent_phone
      FROM payments p
      JOIN courses c ON p.course_id = c.id
      LEFT JOIN leads l ON p.lead_id = l.id
      LEFT JOIN students s ON p.student_id = s.id
      ORDER BY p.created_at DESC
    `).all();

    return res.json({ payments });
  } catch (error: any) {
    console.error('Fetch payments error:', error);
    return res.status(500).json({ error: 'Failed to retrieve payments.' });
  }
});

// POST /api/payments/create-request (Admin - Create a Payment Request / Link)
paymentsRouter.post('/create-request', verifyToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { leadId, studentId, courseId = 'crs_flagship_1', amountInr, notes } = req.body;

    if (!leadId && !studentId) {
      return res.status(400).json({ error: 'Either leadId or studentId is required.' });
    }

    const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(courseId) as any;
    if (!course) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    const finalAmount = amountInr ? parseInt(amountInr, 10) : course.price_inr;
    const paymentId = 'pay_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    const orderId = 'order_' + Math.random().toString(36).substring(2, 10);
    const paymentLink = `/pay/${paymentId}`;

    db.prepare(`
      INSERT INTO payments (
        id, lead_id, student_id, course_id, amount_inr, currency, gateway, gateway_order_id, status, payment_link, notes
      )
      VALUES (?, ?, ?, ?, ?, 'INR', 'RAZORPAY', ?, 'PENDING', ?, ?)
    `).run(
      paymentId,
      leadId || null,
      studentId || null,
      courseId,
      finalAmount,
      orderId,
      paymentLink,
      notes || `Enrollment fee for ${course.name}`
    );

    if (leadId) {
      db.prepare("UPDATE leads SET status = 'PAYMENT_PENDING', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(leadId);

      db.prepare(`
        INSERT INTO lead_activities (id, lead_id, action_type, description, actor_name, actor_id)
        VALUES (?, ?, 'PAYMENT_REQUESTED', ?, ?, ?)
      `).run(
        'act_' + Date.now().toString(36),
        leadId,
        `Payment link generated for ₹${finalAmount.toLocaleString('en-IN')} (Course: ${course.name}).`,
        req.user?.name || 'Administrator',
        req.user?.id
      );
    }

    const createdPayment = db.prepare('SELECT * FROM payments WHERE id = ?').get(paymentId);
    return res.status(201).json({
      success: true,
      payment: createdPayment,
      paymentLink,
      message: 'Payment request created successfully.',
    });
  } catch (error: any) {
    console.error('Create payment request error:', error);
    return res.status(500).json({ error: 'Failed to create payment request.' });
  }
});

// GET /api/payments/:id (Public / Parent Portal - View Payment Link Details)
paymentsRouter.get('/:id', (req: Request, res: Response) => {
  try {
    const payment = db.prepare(`
      SELECT p.*, c.name as course_name, c.duration_months, c.classes_per_week,
        COALESCE(l.student_name, s.name) as student_name,
        COALESCE(l.student_class, s.class_grade) as student_class,
        COALESCE(l.parent_name, s.parent_name) as parent_name,
        COALESCE(l.mobile_number, s.parent_phone) as parent_phone,
        COALESCE(l.email, s.parent_email) as parent_email
      FROM payments p
      JOIN courses c ON p.course_id = c.id
      LEFT JOIN leads l ON p.lead_id = l.id
      LEFT JOIN students s ON p.student_id = s.id
      WHERE p.id = ?
    `).get(req.params.id) as any;

    if (!payment) {
      return res.status(404).json({ error: 'Payment request not found or link has expired.' });
    }

    return res.json({ payment });
  } catch (error: any) {
    console.error('Fetch payment details error:', error);
    return res.status(500).json({ error: 'Failed to retrieve payment details.' });
  }
});

// POST /api/payments/:id/process-public (Parent completes payment -> Automated Enrollment & Batch Placement)
paymentsRouter.post('/:id/process-public', (req: Request, res: Response) => {
  try {
    const { paymentMethod = 'UPI', transactionRef, preferredDays, preferredTime } = req.body;

    const payment = db.prepare('SELECT * FROM payments WHERE id = ?').get(req.params.id) as any;
    if (!payment) {
      return res.status(404).json({ error: 'Payment record not found.' });
    }

    // Call enrollment service (handles idempotency, conversion, batch placement, notifications)
    const result = activateEnrollment({
      paymentId: payment.id,
      leadId: payment.lead_id,
      studentId: payment.student_id,
      courseId: payment.course_id,
      amountInr: payment.amount_inr,
      paymentMethod,
      transactionRef,
      preferredDays,
      preferredTime,
      actorName: 'Parent Payment Portal',
    });

    const updatedPayment = db.prepare('SELECT * FROM payments WHERE id = ?').get(payment.id);

    return res.status(200).json({
      success: true,
      message: 'Payment verified and automatic batch placement completed successfully!',
      payment: updatedPayment,
      enrollmentId: result.enrollmentId,
      studentId: result.studentId,
      placement: result.placement,
    });
  } catch (error: any) {
    console.error('Process payment error:', error);
    return res.status(500).json({ error: error.message || 'Payment processing encountered an error.' });
  }
});

// PATCH /api/payments/:id/status (Admin manually updates payment status or confirms payment)
paymentsRouter.patch('/:id/status', verifyToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, paymentMethod = 'MANUAL', transactionRef } = req.body;
    const payment = db.prepare('SELECT * FROM payments WHERE id = ?').get(req.params.id) as any;
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found.' });
    }

    if (status === 'PAID') {
      const result = activateEnrollment({
        paymentId: payment.id,
        leadId: payment.lead_id,
        studentId: payment.student_id,
        courseId: payment.course_id,
        amountInr: payment.amount_inr,
        paymentMethod,
        transactionRef,
        isManualAdmin: true,
        actorId: req.user?.id,
        actorName: req.user?.name || 'Administrator',
      });

      const updated = db.prepare('SELECT * FROM payments WHERE id = ?').get(req.params.id);
      return res.json({ payment: updated, placement: result.placement, message: 'Payment marked as PAID and student placed in batch.' });
    }

    db.prepare("UPDATE payments SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(status, req.params.id);
    const updated = db.prepare('SELECT * FROM payments WHERE id = ?').get(req.params.id);
    return res.json({ payment: updated, message: `Payment marked as ${status}` });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to update payment status' });
  }
});

// POST /api/payments/webhook (Standard Webhook Endpoint for Payment Gateways)
paymentsRouter.post('/webhook', (req: Request, res: Response) => {
  try {
    const event = req.body;
    // Extract payment ID and transaction details
    const paymentId = event?.payload?.payment?.entity?.notes?.payment_id || event?.payment_id || event?.id;
    if (paymentId) {
      const payment = db.prepare('SELECT * FROM payments WHERE id = ?').get(paymentId) as any;
      if (payment && payment.status !== 'PAID') {
        activateEnrollment({
          paymentId: payment.id,
          leadId: payment.lead_id,
          studentId: payment.student_id,
          courseId: payment.course_id,
          amountInr: payment.amount_inr,
          transactionRef: event?.payload?.payment?.entity?.id || 'webhook_' + Date.now(),
          actorName: 'Gateway Webhook Event',
        });
      }
    }
    return res.status(200).json({ status: 'ok', received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Webhook processing error.' });
  }
});
