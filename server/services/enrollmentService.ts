import { db } from '../db/schema.js';
import bcrypt from 'bcryptjs';
import { placeStudentInBatch, PlacementResult } from './batchPlacementService.js';

export interface ProcessEnrollmentParams {
  paymentId?: string;
  leadId?: string;
  studentId?: string;
  courseId: string;
  amountInr?: number;
  paymentMethod?: string;
  transactionRef?: string;
  preferredDays?: string;
  preferredTime?: string;
  gradeGroup?: string;
  isManualAdmin?: boolean;
  actorId?: string;
  actorName?: string;
}

export interface EnrollmentActivationResult {
  success: boolean;
  enrollmentId: string;
  studentId: string;
  paymentId?: string;
  placement: PlacementResult;
  message: string;
}

/**
 * Idempotently activates an enrollment following payment success or manual admin activation,
 * ensures student and user records exist, and triggers automatic batch placement.
 */
export function activateEnrollment(params: ProcessEnrollmentParams): EnrollmentActivationResult {
  const {
    paymentId,
    leadId,
    courseId,
    amountInr,
    paymentMethod = 'UPI',
    transactionRef,
    preferredDays,
    preferredTime,
    gradeGroup,
    isManualAdmin = false,
    actorId = 'system',
    actorName = 'Payment Gateway',
  } = params;

  // 1. If paymentId is provided, check if already completed (Idempotency)
  let existingPayment: any = null;
  if (paymentId) {
    existingPayment = db.prepare('SELECT * FROM payments WHERE id = ?').get(paymentId) as any;
    if (existingPayment && existingPayment.status === 'PAID') {
      // Find existing enrollment for this payment
      const existingEnr = db.prepare('SELECT id, student_id FROM enrollments WHERE payment_id = ?').get(paymentId) as any;
      if (existingEnr) {
        const placement = placeStudentInBatch(existingEnr.id);
        return {
          success: true,
          enrollmentId: existingEnr.id,
          studentId: existingEnr.student_id,
          paymentId,
          placement,
          message: 'Payment and enrollment already processed (Idempotent).',
        };
      }
    }
  }

  // 2. Resolve Student
  let studentId = params.studentId || existingPayment?.student_id;
  const effectiveLeadId = leadId || existingPayment?.lead_id;

  if (!studentId && effectiveLeadId) {
    // Check if lead already has a student record
    const existingStudent = db.prepare('SELECT * FROM students WHERE lead_id = ?').get(effectiveLeadId) as any;
    if (existingStudent) {
      studentId = existingStudent.id;
    } else {
      const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(effectiveLeadId) as any;
      if (lead) {
        studentId = 'std_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
        const userId = 'usr_' + Date.now().toString(36);

        // Create student record
        db.prepare(`
          INSERT INTO students (
            id, user_id, lead_id, name, class_grade, age, parent_name, parent_phone, parent_email,
            city, preferred_days, preferred_time, timezone, status
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Asia/Kolkata', 'ACTIVE')
        `).run(
          studentId,
          userId,
          lead.id,
          lead.student_name,
          lead.student_class,
          lead.student_age || 10,
          lead.parent_name,
          lead.mobile_number,
          lead.email || null,
          lead.city || 'India',
          preferredDays || lead.preferred_days || null,
          preferredTime || lead.preferred_time || null
        );

        // Create user account for student/parent login
        if (lead.email || lead.mobile_number) {
          const userEmail = lead.email ? lead.email.toLowerCase().trim() : `student_${studentId}@upspeaq.com`;
          const defaultPassHash = bcrypt.hashSync('StudentPassword123!', 10);
          db.prepare(`
            INSERT OR IGNORE INTO users (id, email, phone, password_hash, name, role, student_id, status)
            VALUES (?, ?, ?, ?, ?, 'STUDENT', ?, 'ACTIVE')
          `).run(userId, userEmail, lead.mobile_number, defaultPassHash, lead.student_name, studentId);
        }

        // Update lead status to CONVERTED
        db.prepare("UPDATE leads SET status = 'CONVERTED', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(lead.id);

        db.prepare(`
          INSERT INTO lead_activities (id, lead_id, action_type, description, actor_name, actor_id)
          VALUES (?, ?, 'STUDENT_CONVERTED', ?, ?, ?)
        `).run(
          'act_' + Date.now().toString(36),
          lead.id,
          `Lead converted to Student (${lead.student_name}) upon enrollment activation.`,
          actorName,
          actorId
        );
      }
    }
  }

  if (!studentId) {
    throw new Error('Cannot activate enrollment: Student record or Lead record could not be resolved.');
  }

  // 3. Mark or create Payment record
  let finalPaymentId = paymentId;
  const verifiedTxnId = transactionRef || 'pay_txn_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);

  if (existingPayment) {
    db.prepare(`
      UPDATE payments
      SET status = 'PAID', student_id = ?, gateway_payment_id = ?, paid_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(studentId, verifiedTxnId, existingPayment.id);
  } else if (!isManualAdmin) {
    finalPaymentId = 'pay_' + Date.now().toString(36);
    const course = db.prepare('SELECT price_inr FROM courses WHERE id = ?').get(courseId) as any;
    db.prepare(`
      INSERT INTO payments (id, student_id, course_id, amount_inr, gateway, gateway_payment_id, status, paid_at)
      VALUES (?, ?, ?, ?, 'UPI', ?, 'PAID', CURRENT_TIMESTAMP)
    `).run(finalPaymentId, studentId, courseId, amountInr || course?.price_inr || 4999, verifiedTxnId);
  }

  // 4. Create or activate Enrollment record
  const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(courseId) as any;
  const durationMonths = course?.duration_months || 3;
  const startDate = new Date().toISOString().slice(0, 10);
  const endDate = new Date(Date.now() + durationMonths * 30 * 86400000).toISOString().slice(0, 10);

  const enrollmentId = 'enr_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
  db.prepare(`
    INSERT INTO enrollments (
      id, student_id, course_id, start_date, end_date, status, preferred_days, preferred_time, grade_group, payment_id
    )
    VALUES (?, ?, ?, ?, ?, 'ACTIVE', ?, ?, ?, ?)
  `).run(
    enrollmentId,
    studentId,
    courseId,
    startDate,
    endDate,
    preferredDays || null,
    preferredTime || null,
    gradeGroup || null,
    finalPaymentId || null
  );

  // 5. Trigger Automatic Batch Placement
  const placement = placeStudentInBatch(enrollmentId);

  // 6. Log Audit Record
  db.prepare(`
    INSERT INTO audit_logs (id, actor_id, actor_name, actor_role, action, entity_type, entity_id, details_json)
    VALUES (?, ?, ?, ?, 'ENROLLMENT_ACTIVATED', 'ENROLLMENT', ?, ?)
  `).run(
    'log_' + Date.now().toString(36),
    actorId,
    actorName,
    isManualAdmin ? 'ADMIN' : 'SYSTEM',
    enrollmentId,
    JSON.stringify({
      studentId,
      courseId,
      paymentId: finalPaymentId,
      isManualAdmin,
      batchId: placement.batchId,
      batchName: placement.batchName,
      teacherId: placement.teacherId,
    })
  );

  return {
    success: true,
    enrollmentId,
    studentId,
    paymentId: finalPaymentId,
    placement,
    message: 'Enrollment activated and student automatically placed in batch!',
  };
}
