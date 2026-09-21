import { db } from '../db/schema.js';

export interface TransferStudentParams {
  studentId: string;
  fromBatchId: string;
  toBatchId: string;
  reason?: string;
  actorId?: string;
  actorName?: string;
}

export interface TransferResult {
  success: boolean;
  studentId: string;
  fromBatchId: string;
  toBatchId: string;
  fromBatchName: string;
  toBatchName: string;
  message: string;
}

/**
 * Transfers a student between batches cleanly, preserving historical membership,
 * attendance, and homework records without deleting past data.
 */
export function transferStudent(params: TransferStudentParams): TransferResult {
  const {
    studentId,
    fromBatchId,
    toBatchId,
    reason = 'Batch transfer requested by administrator',
    actorId = 'admin',
    actorName = 'Administrator',
  } = params;

  if (fromBatchId === toBatchId) {
    throw new Error('Destination batch must be different from the source batch.');
  }

  const student = db.prepare('SELECT * FROM students WHERE id = ?').get(studentId) as any;
  if (!student) {
    throw new Error(`Student ${studentId} not found.`);
  }

  const fromBatch = db.prepare('SELECT * FROM batches WHERE id = ?').get(fromBatchId) as any;
  if (!fromBatch) {
    throw new Error(`Source batch ${fromBatchId} not found.`);
  }

  const toBatch = db.prepare('SELECT * FROM batches WHERE id = ?').get(toBatchId) as any;
  if (!toBatch) {
    throw new Error(`Destination batch ${toBatchId} not found.`);
  }

  // Check capacity of destination batch
  const toCount = (db.prepare(`
    SELECT COUNT(*) as count FROM batch_memberships WHERE batch_id = ? AND status = 'ACTIVE'
  `).get(toBatchId) as any)?.count || 0;
  const toMax = toBatch.max_capacity || 8;

  if (toCount >= toMax) {
    throw new Error(`Destination batch ${toBatch.batch_name} is currently FULL (${toCount}/${toMax} students).`);
  }

  // 1. Close old active batch membership
  db.prepare(`
    UPDATE batch_memberships
    SET status = 'TRANSFERRED', left_at = CURRENT_TIMESTAMP, reason = ?, updated_at = CURRENT_TIMESTAMP
    WHERE student_id = ? AND batch_id = ? AND status = 'ACTIVE'
  `).run(reason, studentId, fromBatchId);

  // Update legacy batch_students
  db.prepare(`
    UPDATE batch_students
    SET status = 'TRANSFERRED'
    WHERE student_id = ? AND batch_id = ?
  `).run(studentId, fromBatchId);

  // 2. Find active enrollment
  const activeEnr = db.prepare(`
    SELECT id FROM enrollments WHERE student_id = ? AND status = 'ACTIVE'
  `).get(studentId) as any;

  // 3. Create new batch membership
  const newMemId = 'mem_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
  db.prepare(`
    INSERT INTO batch_memberships (id, batch_id, student_id, enrollment_id, joined_at, status)
    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, 'ACTIVE')
  `).run(newMemId, toBatchId, studentId, activeEnr?.id || null);

  // Legacy batch_students insert or replace
  const legacyBsId = 'bs_' + Date.now().toString(36);
  db.prepare(`
    INSERT OR REPLACE INTO batch_students (id, batch_id, student_id, enrolled_at, status)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP, 'ACTIVE')
  `).run(legacyBsId, toBatchId, studentId);

  // 4. Update enrollment pointer
  if (activeEnr) {
    db.prepare('UPDATE enrollments SET batch_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(toBatchId, activeEnr.id);
  }

  // 5. Update capacity statuses of both batches
  const newToCount = toCount + 1;
  if (newToCount >= toMax) {
    db.prepare("UPDATE batches SET status = 'FULL', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(toBatchId);
  }

  const fromCount = (db.prepare(`
    SELECT COUNT(*) as count FROM batch_memberships WHERE batch_id = ? AND status = 'ACTIVE'
  `).get(fromBatchId) as any)?.count || 0;
  const fromMax = fromBatch.max_capacity || 8;
  if (fromCount < fromMax && fromBatch.status === 'FULL') {
    db.prepare("UPDATE batches SET status = 'OPEN', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(fromBatchId);
  }

  // 6. Audit Log
  db.prepare(`
    INSERT INTO audit_logs (id, actor_id, actor_name, actor_role, action, entity_type, entity_id, details_json)
    VALUES (?, ?, ?, 'ADMIN', 'STUDENT_TRANSFERRED', 'STUDENT', ?, ?)
  `).run(
    'log_' + Date.now().toString(36),
    actorId,
    actorName,
    studentId,
    JSON.stringify({
      fromBatchId,
      fromBatchName: fromBatch.batch_name,
      toBatchId,
      toBatchName: toBatch.batch_name,
      reason,
    })
  );

  // 7. In-App Notifications
  const studentUser = db.prepare('SELECT id FROM users WHERE student_id = ?').get(studentId) as any;
  if (studentUser) {
    db.prepare(`
      INSERT INTO notifications (id, user_id, user_role, title, message, type, link_url)
      VALUES (?, ?, 'STUDENT', 'Batch Transfer Notice', ?, 'SCHEDULE_CHANGE', '/student/classes')
    `).run(
      'notif_' + Date.now().toString(36) + '1',
      studentUser.id,
      `You have been transferred from ${fromBatch.batch_name} to ${toBatch.batch_name} (${toBatch.schedule_days} at ${toBatch.schedule_time}).`
    );
  }

  return {
    success: true,
    studentId,
    fromBatchId,
    toBatchId,
    fromBatchName: fromBatch.batch_name,
    toBatchName: toBatch.batch_name,
    message: `Student ${student.name} successfully transferred from ${fromBatch.batch_name} to ${toBatch.batch_name}.`,
  };
}
