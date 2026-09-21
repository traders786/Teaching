import { db } from '../db/schema.js';
import { createDemandBatch } from './batchCreationService.js';

export interface PlacementResult {
  success: boolean;
  enrollmentId: string;
  studentId: string;
  batchId: string | null;
  batchName?: string;
  batchCode?: string;
  teacherId?: string | null;
  teacherName?: string;
  status: 'SUCCESS' | 'WAITING_FOR_TEACHER' | 'FAILED';
  reason: string;
  isNewBatchCreated: boolean;
  batchStudentCount: number;
}

/**
 * Normalizes grade group from class string (e.g. "Class 5" -> "Class 4-7").
 */
export function normalizeGradeGroup(classGrade?: string | null): string {
  if (!classGrade) return 'Class 4-7';
  const gradeStr = classGrade.toLowerCase();
  const numMatch = gradeStr.match(/\d+/);
  const num = numMatch ? parseInt(numMatch[0], 10) : null;

  if (num !== null) {
    if (num >= 8) return 'Class 8-12';
    return 'Class 4-7';
  }

  if (gradeStr.includes('8') || gradeStr.includes('9') || gradeStr.includes('10') || gradeStr.includes('11') || gradeStr.includes('12') || gradeStr.includes('senior')) {
    return 'Class 8-12';
  }
  return 'Class 4-7';
}

/**
 * Automated Placement Engine: Places an enrolled student into the best eligible batch.
 * Enforces hard capacity (default 8, 1 for 1-on-1), catch-up session limits (default 2),
 * teacher availability, demand batch creation, and complete idempotency.
 */
export function placeStudentInBatch(enrollmentId: string): PlacementResult {
  const enrollment = db.prepare(`
    SELECT e.*, s.name as student_name, s.class_grade, s.age, s.city, s.preferred_days as student_pref_days,
      s.preferred_time as student_pref_time, s.timezone as student_timezone,
      c.name as course_name, c.target_batch_size, c.max_batch_size, c.max_catchup_sessions
    FROM enrollments e
    JOIN students s ON e.student_id = s.id
    JOIN courses c ON e.course_id = c.id
    WHERE e.id = ?
  `).get(enrollmentId) as any;

  if (!enrollment) {
    throw new Error(`Enrollment ${enrollmentId} not found.`);
  }

  // 1. Idempotency Check: Is student already placed in an active batch for this enrollment?
  const existingMembership = db.prepare(`
    SELECT bm.*, b.batch_name, b.code as batch_code, b.teacher_id, t.name as teacher_name
    FROM batch_memberships bm
    JOIN batches b ON bm.batch_id = b.id
    LEFT JOIN teachers t ON b.teacher_id = t.id
    WHERE bm.enrollment_id = ? AND bm.status = 'ACTIVE'
  `).get(enrollmentId) as any;

  if (existingMembership) {
    const studentCount = (db.prepare(`
      SELECT COUNT(*) as count FROM batch_memberships WHERE batch_id = ? AND status = 'ACTIVE'
    `).get(existingMembership.batch_id) as any)?.count || 1;

    return {
      success: true,
      enrollmentId,
      studentId: enrollment.student_id,
      batchId: existingMembership.batch_id,
      batchName: existingMembership.batch_name,
      batchCode: existingMembership.batch_code,
      teacherId: existingMembership.teacher_id,
      teacherName: existingMembership.teacher_name,
      status: existingMembership.teacher_id ? 'SUCCESS' : 'WAITING_FOR_TEACHER',
      reason: 'Student already placed in batch (Idempotent call).',
      isNewBatchCreated: false,
      batchStudentCount: studentCount,
    };
  }

  const isOneOnOne = enrollment.target_batch_size === 1 || enrollment.course_id.includes('1on1');
  const maxCatchup = enrollment.max_catchup_sessions !== undefined ? enrollment.max_catchup_sessions : 2;
  const gradeGroup = enrollment.grade_group || normalizeGradeGroup(enrollment.class_grade);
  const prefDays = enrollment.preferred_days || enrollment.student_pref_days;
  const prefTime = enrollment.preferred_time || enrollment.student_pref_time;
  const timezone = enrollment.student_timezone || 'Asia/Kolkata';

  let selectedBatch: any = null;
  let isNewBatchCreated = false;

  // 2. If NOT 1-on-1, search existing eligible batches
  if (!isOneOnOne) {
    const candidateBatches = db.prepare(`
      SELECT b.*, t.name as teacher_name,
        (SELECT COUNT(*) FROM batch_memberships bm WHERE bm.batch_id = b.id AND bm.status = 'ACTIVE') as active_students_count,
        (SELECT COUNT(*) FROM class_sessions cs WHERE cs.batch_id = b.id AND (cs.status = 'COMPLETED' OR cs.date < DATE('now'))) as past_sessions_count
      FROM batches b
      LEFT JOIN teachers t ON b.teacher_id = t.id
      WHERE b.course_id = ?
        AND b.grade_group = ?
        AND b.status IN ('OPEN', 'UPCOMING', 'ACTIVE')
      ORDER BY b.start_date ASC, b.created_at ASC
    `).all(enrollment.course_id, gradeGroup) as any[];

    for (const b of candidateBatches) {
      const maxCapacity = b.max_capacity || 8;
      const currentCount = b.active_students_count || 0;

      // Filter: must have capacity (< 8)
      if (currentCount >= maxCapacity) {
        // If batch reached capacity, ensure status is marked FULL
        if (b.status !== 'FULL') {
          db.prepare("UPDATE batches SET status = 'FULL', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(b.id);
        }
        continue;
      }

      // Filter: Catch-Up Policy
      const pastSessions = b.past_sessions_count || 0;
      if (pastSessions > maxCatchup) {
        continue; // Batch too far advanced
      }

      // Filter: Schedule compatibility if specified
      if (prefDays && b.schedule_days) {
        const prefParts = prefDays.toLowerCase().split(',').map((p: string) => p.trim());
        const batchParts = b.schedule_days.toLowerCase().split(',').map((p: string) => p.trim());
        const hasOverlap = prefParts.some((p: string) => batchParts.includes(p));
        if (!hasOverlap) {
          continue; // Incompatible days
        }
      }

      selectedBatch = b;
      break;
    }
  }

  // 3. If no suitable batch found, demand-create a new batch
  if (!selectedBatch) {
    const created = createDemandBatch({
      courseId: enrollment.course_id,
      gradeGroup,
      studentName: enrollment.student_name,
      preferredDays: prefDays,
      preferredTime: prefTime,
      timezone,
    });
    selectedBatch = created.batch;
    isNewBatchCreated = true;
  }

  // 4. Assign student to selectedBatch
  const membershipId = `mem_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
  const legacyBsId = `bs_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;

  // Insert membership record
  db.prepare(`
    INSERT INTO batch_memberships (id, batch_id, student_id, enrollment_id, joined_at, status)
    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, 'ACTIVE')
  `).run(membershipId, selectedBatch.id, enrollment.student_id, enrollment.id);

  // Insert legacy batch_students record for backward compatibility
  db.prepare(`
    INSERT OR REPLACE INTO batch_students (id, batch_id, student_id, enrolled_at, status)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP, 'ACTIVE')
  `).run(legacyBsId, selectedBatch.id, enrollment.student_id);

  // Recalculate active student count
  const updatedCount = (db.prepare(`
    SELECT COUNT(*) as count FROM batch_memberships WHERE batch_id = ? AND status = 'ACTIVE'
  `).get(selectedBatch.id) as any)?.count || 1;

  const maxCap = selectedBatch.max_capacity || 8;
  const isNowFull = updatedCount >= maxCap;

  // Update batch status if full
  if (isNowFull) {
    db.prepare("UPDATE batches SET status = 'FULL', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(selectedBatch.id);
  }

  // Update enrollment status
  const finalEnrollmentStatus = selectedBatch.teacher_id ? 'ACTIVE' : 'WAITING_FOR_TEACHER';
  db.prepare(`
    UPDATE enrollments
    SET batch_id = ?, status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(selectedBatch.id, finalEnrollmentStatus, enrollment.id);

  // Update student status to ACTIVE
  db.prepare("UPDATE students SET status = 'ACTIVE', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(enrollment.student_id);

  // 5. Log Placement Attempt
  const placementStatus: 'SUCCESS' | 'WAITING_FOR_TEACHER' = selectedBatch.teacher_id ? 'SUCCESS' : 'WAITING_FOR_TEACHER';
  const placementReason = selectedBatch.teacher_id
    ? `Student ${enrollment.student_name} placed in ${selectedBatch.batch_name} (${updatedCount}/${maxCap} students). ${isNewBatchCreated ? 'New batch created automatically.' : 'Existing batch selected.'}`
    : `Batch ${selectedBatch.batch_name} created but requires teacher assignment.`;

  db.prepare(`
    INSERT INTO placement_logs (id, enrollment_id, student_id, course_id, batch_id, teacher_id, status, reason, rules_evaluated_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'plc_' + Date.now().toString(36),
    enrollment.id,
    enrollment.student_id,
    enrollment.course_id,
    selectedBatch.id,
    selectedBatch.teacher_id || null,
    placementStatus,
    placementReason,
    JSON.stringify({
      isNewBatchCreated,
      gradeGroup,
      capacity: `${updatedCount}/${maxCap}`,
      isNowFull,
      scheduleDays: selectedBatch.schedule_days,
      scheduleTime: selectedBatch.schedule_time,
    })
  );

  // 6. Notifications
  const studentUser = db.prepare('SELECT id FROM users WHERE student_id = ?').get(enrollment.student_id) as any;
  if (studentUser) {
    db.prepare(`
      INSERT INTO notifications (id, user_id, user_role, title, message, type, link_url)
      VALUES (?, ?, 'STUDENT', ?, ?, 'SCHEDULE_CHANGE', '/student/classes')
    `).run(
      'notif_' + Date.now().toString(36) + '1',
      studentUser.id,
      `Welcome to ${selectedBatch.batch_name}!`,
      selectedBatch.teacher_id
        ? `You have been assigned to ${selectedBatch.batch_name} (${selectedBatch.schedule_days} at ${selectedBatch.schedule_time}). View your class schedule!`
        : `You are placed in ${selectedBatch.batch_name}. Your teacher is being assigned by the academy team.`
    );
  }

  if (selectedBatch.teacher_id) {
    const teacherUser = db.prepare('SELECT id FROM users WHERE teacher_id = ?').get(selectedBatch.teacher_id) as any;
    if (teacherUser) {
      db.prepare(`
        INSERT INTO notifications (id, user_id, user_role, title, message, type, link_url)
        VALUES (?, ?, 'TEACHER', ?, ?, 'SCHEDULE_CHANGE', '/teacher/classes')
      `).run(
        'notif_' + Date.now().toString(36) + '2',
        teacherUser.id,
        `New Student Enrolled in ${selectedBatch.batch_name}`,
        `${enrollment.student_name} (${enrollment.class_grade || gradeGroup}) has joined your batch. Total students: ${updatedCount}/${maxCap}.`
      );
    }
  } else {
    // Alert Admins that batch needs teacher
    const adminUsers = db.prepare("SELECT id FROM users WHERE role IN ('ADMIN', 'SUPER_ADMIN')").all() as any[];
    for (const adm of adminUsers) {
      db.prepare(`
        INSERT INTO notifications (id, user_id, user_role, title, message, type, link_url)
        VALUES (?, ?, 'ADMIN', ?, ?, 'SYSTEM_ALERT', '/admin/batches')
      `).run(
        'notif_' + Date.now().toString(36) + '_' + adm.id,
        adm.id,
        'Action Required: Batch Needs Teacher',
        `New batch ${selectedBatch.batch_name} was created for student ${enrollment.student_name} but has no available teacher.`
      );
    }
  }

  // Teacher details for return
  const teacher = selectedBatch.teacher_id
    ? (db.prepare('SELECT name FROM teachers WHERE id = ?').get(selectedBatch.teacher_id) as any)
    : null;

  return {
    success: true,
    enrollmentId,
    studentId: enrollment.student_id,
    batchId: selectedBatch.id,
    batchName: selectedBatch.batch_name,
    batchCode: selectedBatch.code,
    teacherId: selectedBatch.teacher_id || null,
    teacherName: teacher?.name,
    status: placementStatus,
    reason: placementReason,
    isNewBatchCreated,
    batchStudentCount: updatedCount,
  };
}
