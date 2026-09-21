import { db } from '../db/schema.js';

export interface TeacherMatchResult {
  teacherId: string | null;
  teacherName?: string;
  reason: string;
  evaluatedTeachersCount: number;
}

/**
 * Parses days string into an array of lowercase day names.
 * e.g. "Monday, Wednesday, Friday" -> ["monday", "wednesday", "friday"]
 */
export function parseDays(daysStr?: string | null): string[] {
  if (!daysStr) return [];
  return daysStr
    .toLowerCase()
    .split(',')
    .map((d) => d.trim().replace(/\./g, ''))
    .filter(Boolean);
}

/**
 * Checks if two schedule time strings overlap.
 * Simple normalized string equality or day overlap check.
 */
export function hasScheduleConflict(
  existingDaysStr: string,
  existingTimeStr: string,
  newDaysStr: string,
  newTimeStr: string
): boolean {
  const existingDays = parseDays(existingDaysStr);
  const newDays = parseDays(newDaysStr);
  const dayOverlap = existingDays.some((d) => newDays.includes(d));
  if (!dayOverlap) return false;

  const normalizeTime = (t: string) => t.toLowerCase().replace(/\s+/g, '').replace('ist', '');
  return normalizeTime(existingTimeStr) === normalizeTime(newTimeStr);
}

/**
 * Automatically finds the best eligible teacher for a batch based on:
 * 1. Active status (exclude INACTIVE / ON_LEAVE)
 * 2. Qualification for the course
 * 3. Suitability for the grade group
 * 4. Schedule availability (no overlapping active batches)
 * 5. Workload capacity (< max_concurrent_batches)
 * 6. Workload balancing: picks the eligible teacher with the fewest active batches
 */
export function findEligibleTeacher(
  courseId: string,
  gradeGroup: string,
  scheduleDays: string,
  scheduleTime: string
): TeacherMatchResult {
  const teachers = db.prepare(`
    SELECT t.*,
      (SELECT COUNT(*) FROM batches b WHERE b.teacher_id = t.id AND b.status IN ('OPEN', 'UPCOMING', 'ACTIVE', 'FULL')) as active_batch_count
    FROM teachers t
    WHERE t.status = 'ACTIVE'
  `).all() as any[];

  if (teachers.length === 0) {
    return {
      teacherId: null,
      reason: 'NO_ACTIVE_TEACHERS_IN_SYSTEM',
      evaluatedTeachersCount: 0,
    };
  }

  const eligibleTeachers: Array<{ teacher: any; activeBatchCount: number; score: number }> = [];

  for (const t of teachers) {
    // 1. Check max concurrent batches workload
    const maxBatches = t.max_concurrent_batches || 4;
    const currentBatches = t.active_batch_count || 0;
    if (currentBatches >= maxBatches) {
      continue; // Teacher at max workload capacity
    }

    // 2. Check course qualification
    let courseMatch = true;
    if (t.course_ids_json) {
      try {
        const allowedCourses = JSON.parse(t.course_ids_json);
        if (Array.isArray(allowedCourses) && allowedCourses.length > 0) {
          courseMatch = allowedCourses.includes(courseId);
        }
      } catch (e) {
        courseMatch = true;
      }
    }
    if (!courseMatch) continue;

    // 3. Check grade group match
    let gradeMatch = true;
    if (t.grade_groups_json) {
      try {
        const allowedGrades = JSON.parse(t.grade_groups_json);
        if (Array.isArray(allowedGrades) && allowedGrades.length > 0) {
          gradeMatch = allowedGrades.some((g: string) =>
            gradeGroup.toLowerCase().includes(g.toLowerCase()) || g.toLowerCase().includes(gradeGroup.toLowerCase())
          );
        }
      } catch (e) {
        gradeMatch = true;
      }
    }
    if (!gradeMatch) continue;

    // 4. Check schedule conflicts with teacher's other active batches
    const teacherActiveBatches = db.prepare(`
      SELECT id, schedule_days, schedule_time FROM batches
      WHERE teacher_id = ? AND status IN ('OPEN', 'UPCOMING', 'ACTIVE', 'FULL')
    `).all(t.id) as any[];

    let conflict = false;
    for (const b of teacherActiveBatches) {
      if (hasScheduleConflict(b.schedule_days, b.schedule_time, scheduleDays, scheduleTime)) {
        conflict = true;
        break;
      }
    }
    if (conflict) continue;

    // Teacher is fully eligible. Balance workload by prioritizing lowest active batches count.
    eligibleTeachers.push({
      teacher: t,
      activeBatchCount: currentBatches,
      score: 100 - currentBatches * 10,
    });
  }

  if (eligibleTeachers.length === 0) {
    return {
      teacherId: null,
      reason: 'NO_ELIGIBLE_TEACHER_FOR_SCHEDULE_OR_CAPACITY',
      evaluatedTeachersCount: teachers.length,
    };
  }

  // Sort by lowest active batch count (workload balancing)
  eligibleTeachers.sort((a, b) => a.activeBatchCount - b.activeBatchCount);
  const selected = eligibleTeachers[0].teacher;

  return {
    teacherId: selected.id,
    teacherName: selected.name,
    reason: `Teacher ${selected.name} matched (Active batches: ${selected.active_batch_count || 0}/${selected.max_concurrent_batches || 4})`,
    evaluatedTeachersCount: teachers.length,
  };
}
