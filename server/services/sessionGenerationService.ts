import { db } from '../db/schema.js';

const DAY_MAP: Record<string, number> = {
  sunday: 0,
  sun: 0,
  monday: 1,
  mon: 1,
  tuesday: 2,
  tue: 2,
  wednesday: 3,
  wed: 3,
  thursday: 4,
  thu: 4,
  friday: 5,
  fri: 5,
  saturday: 6,
  sat: 6,
};

/**
 * Parses schedule days string into an array of JS day numbers (0-6).
 */
export function getScheduleDayNumbers(scheduleDays: string): number[] {
  const parts = scheduleDays.toLowerCase().split(',').map((p) => p.trim().replace(/\./g, ''));
  const dayNumbers: number[] = [];
  for (const part of parts) {
    for (const [key, num] of Object.entries(DAY_MAP)) {
      if (part === key || part.startsWith(key)) {
        if (!dayNumbers.includes(num)) {
          dayNumbers.push(num);
        }
        break;
      }
    }
  }
  return dayNumbers.length > 0 ? dayNumbers : [1, 3, 5]; // Default Mon/Wed/Fri
}

/**
 * Calculates the next valid schedule date starting on or after a given base date string (YYYY-MM-DD).
 */
export function getNextValidScheduleDate(baseDateStr: string, scheduleDays: string): string {
  const allowedDays = getScheduleDayNumbers(scheduleDays);
  const date = new Date(baseDateStr + 'T00:00:00');
  for (let i = 0; i < 14; i++) {
    const currentDay = date.getDay();
    if (allowedDays.includes(currentDay)) {
      return date.toISOString().slice(0, 10);
    }
    date.setDate(date.getDate() + 1);
  }
  return baseDateStr;
}

/**
 * Generates N session dates based on start date and allowed schedule day numbers.
 */
export function generateScheduleDates(startDateStr: string, scheduleDays: string, totalSessions: number): string[] {
  const allowedDays = getScheduleDayNumbers(scheduleDays);
  const dates: string[] = [];
  const cursor = new Date(startDateStr + 'T00:00:00');

  // Prevent scheduling in the past for brand new sessions
  const todayStr = new Date().toISOString().slice(0, 10);
  if (cursor < new Date(todayStr + 'T00:00:00')) {
    cursor.setTime(new Date(todayStr + 'T00:00:00').getTime());
  }

  while (dates.length < totalSessions) {
    if (allowedDays.includes(cursor.getDay())) {
      dates.push(cursor.toISOString().slice(0, 10));
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
}

/**
 * Parses start and end time from a time string like "5:00 PM - 6:00 PM IST".
 */
export function parseTimeWindow(timeStr: string): { startTime: string; endTime: string } {
  if (!timeStr) return { startTime: '5:00 PM', endTime: '6:00 PM' };
  const cleaned = timeStr.replace(/\s*IST\s*/i, '').trim();
  const parts = cleaned.split('-');
  if (parts.length >= 2) {
    return {
      startTime: parts[0].trim(),
      endTime: parts[1].trim(),
    };
  }
  return { startTime: '5:00 PM', endTime: '6:00 PM' };
}

/**
 * Generates all class sessions for a batch mapped to the course master curriculum.
 * Ensures strict idempotency: will not recreate or duplicate sessions if already generated.
 */
export function generateBatchSessions(batchId: string): { generatedCount: number; sessions: any[] } {
  const batch = db.prepare(`
    SELECT b.*, c.total_classes, c.id as course_id
    FROM batches b
    JOIN courses c ON b.course_id = c.id
    WHERE b.id = ?
  `).get(batchId) as any;

  if (!batch) {
    throw new Error(`Batch ${batchId} not found.`);
  }

  const existingCount = (db.prepare('SELECT COUNT(*) as count FROM class_sessions WHERE batch_id = ?').get(batchId) as any)?.count || 0;
  if (existingCount > 0) {
    // Already generated
    const existing = db.prepare('SELECT * FROM class_sessions WHERE batch_id = ? ORDER BY session_number ASC').all(batchId);
    return { generatedCount: 0, sessions: existing };
  }

  const totalSessions = batch.total_classes || 36;
  const sessionDates = generateScheduleDates(batch.start_date, batch.schedule_days, totalSessions);
  const { startTime, endTime } = parseTimeWindow(batch.schedule_time);

  // Fetch curriculum sessions for the course and grade group
  const gradeGroup = batch.grade_group || 'Class 4-7';
  let curriculumSessions = db.prepare(`
    SELECT cs.*, cm.title as module_title
    FROM curriculum_sessions cs
    JOIN curriculum_modules cm ON cs.module_id = cm.id
    WHERE cs.course_id = ? AND cs.grade_group = ?
    ORDER BY cs.session_number ASC
  `).all(batch.course_id, gradeGroup) as any[];

  if (curriculumSessions.length === 0) {
    // Fallback to any curriculum for this course
    curriculumSessions = db.prepare(`
      SELECT cs.*, cm.title as module_title
      FROM curriculum_sessions cs
      JOIN curriculum_modules cm ON cs.module_id = cm.id
      WHERE cs.course_id = ?
      ORDER BY cs.session_number ASC
    `).all(batch.course_id) as any[];
  }

  const insertStmt = db.prepare(`
    INSERT INTO class_sessions (
      id, batch_id, teacher_id, session_number, date, start_time, end_time, topic, module_id, curriculum_session_id, meeting_link, status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'UPCOMING')
  `);

  const createdSessions: any[] = [];

  for (let i = 0; i < sessionDates.length; i++) {
    const sessionNum = i + 1;
    const sessionDate = sessionDates[i];
    const curr = curriculumSessions.length > 0 ? curriculumSessions[i % curriculumSessions.length] : null;

    const topic = curr ? curr.topic : `Communication Masterclass — Session ${sessionNum}`;
    const moduleId = curr ? curr.module_id : null;
    const currId = curr ? curr.id : null;
    const sessionId = `cs_${batch.id}_${sessionNum}`;

    insertStmt.run(
      sessionId,
      batch.id,
      batch.teacher_id || null,
      sessionNum,
      sessionDate,
      startTime,
      endTime,
      topic,
      moduleId,
      currId,
      batch.meeting_link || null
    );

    createdSessions.push({
      id: sessionId,
      batch_id: batch.id,
      session_number: sessionNum,
      date: sessionDate,
      start_time: startTime,
      end_time: endTime,
      topic,
    });
  }

  return { generatedCount: createdSessions.length, sessions: createdSessions };
}
