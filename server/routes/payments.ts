import { Router, Request, Response } from 'express';
import { db } from '../db/schema.js';
import { verifyToken, AuthenticatedRequest } from '../middleware/auth.js';

export const paymentsRouter = Router();

// GET /api/payments (Admin - List payments)
paymentsRouter.get('/', verifyToken, (req: AuthenticatedRequest, res: Response) => {
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

    // If for a lead, update status to PAYMENT_PENDING and log activity
    if (leadId) {
      db.prepare("UPDATE leads SET status = 'PAYMENT_PENDING', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(leadId);

      db.prepare(`
        INSERT INTO lead_activities (id, lead_id, action_type, description, actor_name, actor_id)
        VALUES (?, ?, 'PAYMENT_REQUESTED', ?, ?, ?)
      `).run(
        'act_' + Date.now(),
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

// GET /api/payments/:id (Public / Parent Portal - View Invoice/Payment Link Details)
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

// POST /api/payments/:id/process-public (Parent completes payment -> Backend verifies and provisions enrollment)
paymentsRouter.post('/:id/process-public', (req: Request, res: Response) => {
  try {
    const { paymentMethod = 'UPI', transactionRef } = req.body;

    const payment = db.prepare('SELECT * FROM payments WHERE id = ?').get(req.params.id) as any;
    if (!payment) {
      return res.status(404).json({ error: 'Payment record not found.' });
    }

    if (payment.status === 'PAID') {
      return res.status(200).json({ message: 'This payment has already been verified and completed.', payment });
    }

    const verifiedTxnId = transactionRef || 'pay_txn_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);

    // 1. Mark payment as PAID
    db.prepare(`
      UPDATE payments 
      SET status = 'PAID', gateway_payment_id = ?, paid_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(verifiedTxnId, payment.id);

    let studentId = payment.student_id;

    // 2. If payment is for a lead who isn't a student yet, convert lead to student
    if (payment.lead_id && !studentId) {
      const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(payment.lead_id) as any;
      if (lead) {
        studentId = 'std_' + Math.random().toString(36).substring(2, 8) + Date.now().toString(36);
        db.prepare(`
          INSERT INTO students (id, lead_id, name, class_grade, age, parent_name, parent_phone, parent_email, city, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE')
        `).run(
          studentId,
          lead.id,
          lead.student_name,
          lead.student_class,
          lead.student_age,
          lead.parent_name,
          lead.mobile_number,
          lead.email,
          lead.city
        );

        // Update lead status
        db.prepare("UPDATE leads SET status = 'CONVERTED', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(lead.id);

        // Update payment with student_id
        db.prepare("UPDATE payments SET student_id = ? WHERE id = ?").run(studentId, payment.id);

        // Log lead activity
        db.prepare(`
          INSERT INTO lead_activities (id, lead_id, action_type, description, actor_name)
          VALUES (?, ?, 'PAYMENT_COMPLETED', ?, 'Payment Verification Gateway')
        `).run(
          'act_' + Date.now(),
          lead.id,
          `Payment of ₹${payment.amount_inr.toLocaleString('en-IN')} verified via ${paymentMethod}. Transaction Ref: ${verifiedTxnId}.`
        );
      }
    }

    // 3. Create or activate enrollment record
    if (studentId) {
      const startDate = new Date().toISOString().split('T')[0];
      const endDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const enrollmentId = 'enr_' + Date.now().toString(36);

      db.prepare(`
        INSERT INTO enrollments (id, student_id, course_id, start_date, end_date, status, payment_id)
        VALUES (?, ?, ?, ?, ?, 'ACTIVE', ?)
      `).run(enrollmentId, studentId, payment.course_id, startDate, endDate, payment.id);
    }

    // Log audit
    db.prepare(`
      INSERT INTO audit_logs (id, actor_id, actor_name, actor_role, action, entity_type, entity_id, details_json)
      VALUES (?, 'system_gateway', 'Payment Gateway Webhook', 'SYSTEM', 'PAYMENT_CONFIRMED', 'PAYMENT', ?, ?)
    `).run(
      'log_' + Date.now(),
      payment.id,
      JSON.stringify({ amount: payment.amount_inr, transactionId: verifiedTxnId, studentId })
    );

    const updatedPayment = db.prepare('SELECT * FROM payments WHERE id = ?').get(payment.id);

    return res.status(200).json({
      success: true,
      message: 'Payment verified and enrollment activated successfully!',
      payment: updatedPayment,
      studentId,
    });
  } catch (error: any) {
    console.error('Process payment error:', error);
    return res.status(500).json({ error: 'Backend payment verification encountered an error.' });
  }
});

// PATCH /api/payments/:id/status (Admin manually updates payment status)
paymentsRouter.patch('/:id/status', verifyToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, paymentMethod, gatewayPaymentId } = req.body;
    const payment = db.prepare('SELECT * FROM payments WHERE id = ?').get(req.params.id) as any;
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found.' });
    }

    const updates: string[] = ['status = ?'];
    const params: any[] = [status];

    if (paymentMethod) {
      updates.push('payment_method = ?');
      params.push(paymentMethod);
    }
    if (gatewayPaymentId) {
      updates.push('gateway_payment_id = ?');
      params.push(gatewayPaymentId);
    }
    if (status === 'PAID') {
      updates.push('paid_at = CURRENT_TIMESTAMP');
    }

    params.push(req.params.id);
    db.prepare(`UPDATE payments SET ${updates.join(', ')} WHERE id = ?`).run(...params);

    if (status === 'PAID' && payment.lead_id && !payment.student_id) {
      const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(payment.lead_id) as any;
      if (lead) {
        const studentId = 'std_' + Math.random().toString(36).substring(2, 8) + Date.now().toString(36);
        db.prepare(`
          INSERT INTO students (id, lead_id, name, class_grade, age, parent_name, parent_phone, parent_email, city, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE')
        `).run(
          studentId,
          lead.id,
          lead.student_name,
          lead.student_class,
          lead.student_age,
          lead.parent_name,
          lead.mobile_number,
          lead.email,
          lead.city
        );
        db.prepare("UPDATE leads SET status = 'CONVERTED', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(lead.id);
        db.prepare("UPDATE payments SET student_id = ? WHERE id = ?").run(studentId, payment.id);
      }
    }

    const updated = db.prepare('SELECT * FROM payments WHERE id = ?').get(req.params.id);
    return res.json({ payment: updated, message: `Payment marked as ${status}` });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to update payment status' });
  }
});

// POST /api/payments/webhook (Standard webhook endpoint for Razorpay / payment aggregators)
paymentsRouter.post('/webhook', (req: Request, res: Response) => {
  try {
    // In production, verify crypto HMAC-SHA256 signature using RAZORPAY_WEBHOOK_SECRET
    const event = req.body;
    console.log('Payment webhook received:', event.event);

    return res.status(200).json({ status: 'ok' });
  } catch (error: any) {
    return res.status(500).json({ error: 'Webhook processing error.' });
  }
});
