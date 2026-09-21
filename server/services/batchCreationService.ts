import { db } from '../db/schema.js';
import { findEligibleTeacher } from './teacherAssignmentService.js';
import { generateBatchSessions, getNextValidScheduleDate } from './sessionGenerationService.js';

export interface CreateDemandBatchParams {
  courseId: string;
  gradeGroup?: string;
  studentName?: string;
  preferredDays?: string;
  preferredTime?: string;
  timezone?: string;
  startDate?: string;
}

export interface CreatedBatchResult {
  batch: any;
  teacherAssigned: boolean;
  teacherName?: string;
  generatedSessionsCount: number;
}

/**
 * Systematically demand-creates a new batch for a course when existing batches are full.
 * Calculates stable sequential numbering (e.g. Batch 001, Batch 002), schedule,
 * attempts automatic teacher assignment, and generates curriculum-mapped class sessions.
 */
export function createDemandBatch(params: CreateDemandBatchParams): CreatedBatchResult {
  const {
    courseId,
    gradeGroup = 'Class 4-7',
    studentName,
    preferredDays,
    preferredTime,
    timezone = 'Asia/Kolkata',
    startDate: customStartDate,
  } = params;

  const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(courseId) as any;
  if (!course) {
    throw new Error(`Course ${courseId} not found.`);
  }

  const isOneOnOne = course.target_batch_size === 1 || course.id.includes('1on1') || course.slug.includes('1on1');
  const targetCapacity = isOneOnOne ? 1 : (course.target_batch_size || 8);
  const maxCapacity = isOneOnOne ? 1 : (course.max_batch_size || 8);

  // 1. Determine Sequential Batch Name & Code
  const countRow = db.prepare(`
    SELECT COUNT(*) as count FROM batches
    WHERE course_id = ? AND grade_group = ?
  `).get(courseId, gradeGroup) as any;
  const nextSeq = (countRow?.count || 0) + 1;
  const seqPadded = String(nextSeq).padStart(3, '0');

  let gradeLabel = 'Junior Communication';
  let prefix = 'JC';
  if (gradeGroup.toLowerCase().includes('8') || gradeGroup.toLowerCase().includes('senior') || gradeGroup.toLowerCase().includes('9')) {
    gradeLabel = 'Senior Orators';
    prefix = 'SO';
  } else if (isOneOnOne) {
    gradeLabel = '1-on-1 Speech';
    prefix = 'PVT';
  }

  const batchName = isOneOnOne && studentName
    ? `${gradeLabel} (${studentName}) — Batch ${seqPadded}`
    : `${gradeLabel} — Batch ${seqPadded}`;
  const batchCode = `${prefix}-${seqPadded}`;
  const batchId = `batch_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;

  // 2. Determine Schedule
  let finalDays = preferredDays;
  if (!finalDays) {
    if (course.allowed_days_json) {
      try {
        const allowed = JSON.parse(course.allowed_days_json);
        finalDays = Array.isArray(allowed) && allowed.length > 0 ? allowed[0] : 'Monday, Wednesday, Friday';
      } catch (e) {
        finalDays = 'Monday, Wednesday, Friday';
      }
    } else {
      finalDays = 'Monday, Wednesday, Friday';
    }
  }

  let finalTime = preferredTime;
  if (!finalTime) {
    if (course.allowed_time_slots_json) {
      try {
        const allowed = JSON.parse(course.allowed_time_slots_json);
        finalTime = Array.isArray(allowed) && allowed.length > 0 ? allowed[0] : '5:00 PM - 6:00 PM IST';
      } catch (e) {
        finalTime = '5:00 PM - 6:00 PM IST';
      }
    } else {
      finalTime = '5:00 PM - 6:00 PM IST';
    }
  }

  // 3. Determine Start Date (Next valid schedule occurrence, avoiding past dates)
  const baseDate = customStartDate || new Date().toISOString().slice(0, 10);
  const startDate = getNextValidScheduleDate(baseDate, finalDays);
  const durationMonths = course.duration_months || 3;
  const endDate = new Date(new Date(startDate + 'T00:00:00').getTime() + durationMonths * 30 * 86400000)
    .toISOString()
    .slice(0, 10);

  // 4. Attempt Automatic Teacher Assignment
  const teacherMatch = findEligibleTeacher(courseId, gradeGroup, finalDays, finalTime);
  const teacherId = teacherMatch.teacherId;
  const status = teacherId ? 'OPEN' : 'NEEDS_TEACHER';

  // 5. Generate formatted Meet link and Insert Batch
  const randomSuffix = Math.random().toString(36).substring(2, 6) + '-' + Math.random().toString(36).substring(2, 5);
  const meetingLink = `https://meet.google.com/ups-${randomSuffix}`;

  db.prepare(`
    INSERT INTO batches (
      id, batch_name, code, course_id, teacher_id, grade_group, start_date, end_date,
      schedule_days, schedule_time, timezone, meeting_link, target_capacity, max_capacity, status, notes
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    batchId,
    batchName,
    batchCode,
    courseId,
    teacherId,
    gradeGroup,
    startDate,
    endDate,
    finalDays,
    finalTime,
    timezone,
    meetingLink,
    targetCapacity,
    maxCapacity,
    status,
    `Demand-generated batch for ${course.name}. Teacher matching note: ${teacherMatch.reason}`
  );

  // 6. Generate Class Sessions
  const sessionResult = generateBatchSessions(batchId);

  const createdBatch = db.prepare('SELECT * FROM batches WHERE id = ?').get(batchId);

  return {
    batch: createdBatch,
    teacherAssigned: Boolean(teacherId),
    teacherName: teacherMatch.teacherName,
    generatedSessionsCount: sessionResult.generatedCount,
  };
}
