import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';

const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAMBDA_TASK_ROOT);
const dataDir = isServerless ? path.resolve('/tmp', 'data') : path.resolve(process.cwd(), 'data');

try {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
} catch (e) {}

const dbPath = path.join(dataDir, 'speakindia.db');
export const db = new DatabaseSync(dbPath);

// Enable foreign keys & journal mode
try {
  if (!isServerless) {
    db.exec('PRAGMA journal_mode = WAL;');
  }
  db.exec('PRAGMA foreign_keys = ON;');
} catch (e) {}

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'ADMIN', -- 'SUPER_ADMIN' | 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT'
      teacher_id TEXT,
      student_id TEXT,
      status TEXT NOT NULL DEFAULT 'ACTIVE',
      avatar_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS teachers (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      photo_url TEXT,
      qualification TEXT,
      experience TEXT,
      biography TEXT,
      expertise TEXT,
      achievements TEXT,
      availability TEXT,
      max_concurrent_batches INTEGER NOT NULL DEFAULT 4,
      max_weekly_hours INTEGER NOT NULL DEFAULT 20,
      grade_groups_json TEXT, -- e.g. ["Class 4-7", "Class 8-12"]
      course_ids_json TEXT,   -- e.g. ["crs_flagship_1", "crs_1on1_1"]
      schedule_slots_json TEXT, -- e.g. [{"days": "Mon, Wed, Fri", "time": "5:00 PM - 6:00 PM IST"}]
      status TEXT NOT NULL DEFAULT 'ACTIVE', -- 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE'
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS courses (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      duration_months INTEGER NOT NULL DEFAULT 3,
      classes_per_week INTEGER NOT NULL DEFAULT 3,
      total_classes INTEGER NOT NULL DEFAULT 36,
      price_inr INTEGER NOT NULL DEFAULT 4999,
      currency TEXT NOT NULL DEFAULT 'INR',
      target_batch_size INTEGER NOT NULL DEFAULT 8,
      max_batch_size INTEGER NOT NULL DEFAULT 8,
      max_catchup_sessions INTEGER NOT NULL DEFAULT 2,
      allowed_days_json TEXT, -- e.g. ["Mon, Wed, Fri", "Tue, Thu, Sat"]
      allowed_time_slots_json TEXT, -- e.g. ["4:00 PM - 5:00 PM IST", "5:00 PM - 6:00 PM IST", "6:00 PM - 7:00 PM IST"]
      grade_groups_json TEXT, -- e.g. ["Class 4-7", "Class 8-12"]
      status TEXT NOT NULL DEFAULT 'ACTIVE',
      is_flagship INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS batches (
      id TEXT PRIMARY KEY,
      batch_name TEXT NOT NULL,
      code TEXT, -- e.g. "CC-001"
      course_id TEXT NOT NULL,
      teacher_id TEXT,
      grade_group TEXT DEFAULT 'Class 4-7', -- 'Class 4-7' | 'Class 8-12' | '1-on-1 Custom'
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      schedule_days TEXT NOT NULL, -- e.g. "Mon, Wed, Fri"
      schedule_time TEXT NOT NULL, -- e.g. "5:00 PM - 6:00 PM IST"
      timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
      meeting_link TEXT,
      target_capacity INTEGER NOT NULL DEFAULT 8,
      max_capacity INTEGER NOT NULL DEFAULT 8,
      status TEXT NOT NULL DEFAULT 'OPEN', -- 'OPEN' | 'UPCOMING' | 'ACTIVE' | 'FULL' | 'NEEDS_TEACHER' | 'COMPLETED' | 'CANCELLED'
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES courses(id),
      FOREIGN KEY (teacher_id) REFERENCES teachers(id)
    );

    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      student_name TEXT NOT NULL,
      student_class TEXT NOT NULL,
      student_age INTEGER,
      parent_name TEXT NOT NULL,
      mobile_number TEXT NOT NULL,
      email TEXT,
      city TEXT,
      interest_area TEXT DEFAULT 'Communication Skills',
      preferred_time TEXT,
      preferred_days TEXT,
      notes TEXT,
      lead_source TEXT NOT NULL DEFAULT 'DIRECT', -- 'META_ADS' | 'INSTAGRAM' | 'GOOGLE' | 'REFERRAL' | 'EDUCATION_PARTNER' | 'ORGANIC' | 'DIRECT' | 'OTHER'
      utm_source TEXT,
      utm_medium TEXT,
      utm_campaign TEXT,
      utm_content TEXT,
      utm_term TEXT,
      referral_code TEXT,
      status TEXT NOT NULL DEFAULT 'NEW', -- 'NEW' | 'CONTACTED' | 'DEMO_SCHEDULED' | 'DEMO_COMPLETED' | 'FOLLOW_UP' | 'PAYMENT_PENDING' | 'CONVERTED' | 'LOST'
      assigned_to TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS lead_activities (
      id TEXT PRIMARY KEY,
      lead_id TEXT NOT NULL,
      action_type TEXT NOT NULL, -- 'CREATED' | 'STATUS_CHANGE' | 'NOTE_ADDED' | 'DEMO_SCHEDULED' | 'DEMO_COMPLETED' | 'PAYMENT_REQUESTED' | 'PAYMENT_COMPLETED' | 'STUDENT_CONVERTED'
      description TEXT NOT NULL,
      actor_name TEXT NOT NULL DEFAULT 'System',
      actor_id TEXT,
      metadata_json TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS demo_sessions (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      teacher_id TEXT,
      meeting_link TEXT,
      capacity INTEGER NOT NULL DEFAULT 2,
      status TEXT NOT NULL DEFAULT 'SCHEDULED', -- 'NEW' | 'ASSIGNED' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'NO_SHOW' | 'RESCHEDULED' | 'CANCELLED'
      notes TEXT,
      zoom_meeting_id TEXT,
      zoom_password TEXT,
      zoom_join_url TEXT,
      zoom_start_url TEXT,
      zoom_is_live_api INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (teacher_id) REFERENCES teachers(id)
    );

    CREATE TABLE IF NOT EXISTS demo_attendees (
      id TEXT PRIMARY KEY,
      demo_id TEXT NOT NULL,
      lead_id TEXT NOT NULL,
      student_name TEXT NOT NULL,
      parent_phone TEXT NOT NULL,
      attendance_status TEXT NOT NULL DEFAULT 'REGISTERED', -- 'REGISTERED' | 'ATTENDED' | 'ABSENT'
      outcome TEXT, -- 'HIGH_POTENTIAL' | 'NEEDS_FOLLOW_UP' | 'NOT_INTERESTED' | 'READY_TO_ENROLL'
      feedback TEXT,
      conversion_potential TEXT, -- 'HIGH' | 'MEDIUM' | 'LOW'
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (demo_id) REFERENCES demo_sessions(id) ON DELETE CASCADE,
      FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS demo_evaluations (
      id TEXT PRIMARY KEY,
      demo_id TEXT NOT NULL,
      lead_id TEXT NOT NULL,
      teacher_id TEXT NOT NULL,
      spoken_english TEXT DEFAULT 'Good',
      pronunciation TEXT DEFAULT 'Good',
      fluency TEXT DEFAULT 'Developing',
      confidence TEXT DEFAULT 'Developing',
      public_speaking TEXT DEFAULT 'Developing',
      vocabulary TEXT DEFAULT 'Good',
      sentence_formation TEXT DEFAULT 'Good',
      listening TEXT DEFAULT 'Strong',
      debate_reasoning TEXT DEFAULT 'Developing',
      strengths TEXT,
      areas_to_improve TEXT,
      recommended_program TEXT,
      recommended_batch_id TEXT,
      additional_notes TEXT,
      outcome TEXT NOT NULL DEFAULT 'Recommended',
      evaluated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (demo_id) REFERENCES demo_sessions(id) ON DELETE CASCADE,
      FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE,
      FOREIGN KEY (teacher_id) REFERENCES teachers(id)
    );

    CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      lead_id TEXT,
      name TEXT NOT NULL,
      class_grade TEXT NOT NULL,
      age INTEGER,
      school TEXT,
      parent_name TEXT NOT NULL,
      parent_phone TEXT NOT NULL,
      parent_email TEXT,
      city TEXT,
      preferred_days TEXT,
      preferred_time TEXT,
      timezone TEXT DEFAULT 'Asia/Kolkata',
      status TEXT NOT NULL DEFAULT 'ACTIVE', -- 'LEAD' | 'DEMO' | 'ENROLLED' | 'ACTIVE' | 'COMPLETED' | 'INACTIVE' | 'PAUSED'
      photo_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
      FOREIGN KEY (lead_id) REFERENCES leads(id)
    );

    CREATE TABLE IF NOT EXISTS batch_students (
      id TEXT PRIMARY KEY,
      batch_id TEXT NOT NULL,
      student_id TEXT NOT NULL,
      enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT NOT NULL DEFAULT 'ACTIVE',
      FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
      UNIQUE(batch_id, student_id)
    );

    CREATE TABLE IF NOT EXISTS batch_memberships (
      id TEXT PRIMARY KEY,
      batch_id TEXT NOT NULL,
      student_id TEXT NOT NULL,
      enrollment_id TEXT,
      joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      left_at DATETIME,
      status TEXT NOT NULL DEFAULT 'ACTIVE', -- 'ACTIVE' | 'TRANSFERRED' | 'COMPLETED' | 'DROPPED'
      reason TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
      FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS class_sessions (
      id TEXT PRIMARY KEY,
      batch_id TEXT NOT NULL,
      teacher_id TEXT,
      session_number INTEGER,
      date TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      topic TEXT NOT NULL,
      module_id TEXT,
      curriculum_session_id TEXT,
      meeting_link TEXT,
      recording_url TEXT,
      status TEXT NOT NULL DEFAULT 'UPCOMING', -- 'UPCOMING' | 'LIVE' | 'COMPLETED' | 'CANCELLED'
      teacher_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE,
      FOREIGN KEY (teacher_id) REFERENCES teachers(id),
      FOREIGN KEY (curriculum_session_id) REFERENCES curriculum_sessions(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS attendance (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      student_id TEXT NOT NULL,
      batch_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'PRESENT', -- 'PRESENT' | 'ABSENT' | 'LATE'
      notes TEXT,
      marked_by TEXT,
      marked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (session_id) REFERENCES class_sessions(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
      FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE,
      UNIQUE(session_id, student_id)
    );

    CREATE TABLE IF NOT EXISTS curriculum_modules (
      id TEXT PRIMARY KEY,
      course_id TEXT NOT NULL,
      grade_group TEXT NOT NULL, -- 'Class 4-7' | 'Class 8-12'
      module_number INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      strand TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS curriculum_sessions (
      id TEXT PRIMARY KEY,
      module_id TEXT NOT NULL,
      course_id TEXT NOT NULL,
      grade_group TEXT NOT NULL,
      week_number INTEGER NOT NULL,
      session_number INTEGER NOT NULL,
      topic TEXT NOT NULL,
      learning_objective TEXT NOT NULL,
      activity TEXT,
      speaking_exercise TEXT,
      homework_suggestion TEXT,
      required_materials TEXT,
      worksheet_ref TEXT,
      is_completed INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (module_id) REFERENCES curriculum_modules(id) ON DELETE CASCADE,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS homework (
      id TEXT PRIMARY KEY,
      batch_id TEXT NOT NULL,
      session_id TEXT,
      teacher_id TEXT NOT NULL,
      target_student_id TEXT, -- NULL for entire batch, or specific student_id
      title TEXT NOT NULL,
      description TEXT,
      instructions TEXT,
      due_date TEXT NOT NULL,
      submission_type TEXT NOT NULL DEFAULT 'AUDIO', -- 'TEXT' | 'FILE' | 'AUDIO' | 'VIDEO' | 'LINK'
      attachment_url TEXT,
      status TEXT NOT NULL DEFAULT 'ACTIVE', -- 'ACTIVE' | 'CLOSED'
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE,
      FOREIGN KEY (teacher_id) REFERENCES teachers(id),
      FOREIGN KEY (target_student_id) REFERENCES students(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS student_curriculum_progress (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      session_id TEXT NOT NULL,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
      FOREIGN KEY (session_id) REFERENCES curriculum_sessions(id) ON DELETE CASCADE,
      UNIQUE(student_id, session_id)
    );

    CREATE TABLE IF NOT EXISTS homework_submissions (
      id TEXT PRIMARY KEY,
      homework_id TEXT NOT NULL,
      student_id TEXT NOT NULL,
      submission_type TEXT NOT NULL DEFAULT 'AUDIO',
      content_text TEXT,
      media_url TEXT,
      file_name TEXT,
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT NOT NULL DEFAULT 'SUBMITTED', -- 'SUBMITTED' | 'REVIEWED' | 'RESUBMIT'
      score_rating TEXT, -- 'Needs Practice' | 'Developing' | 'Good' | 'Strong'
      mentor_feedback TEXT,
      reviewed_at DATETIME,
      reviewed_by TEXT,
      FOREIGN KEY (homework_id) REFERENCES homework(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
      UNIQUE(homework_id, student_id)
    );

    CREATE TABLE IF NOT EXISTS recordings (
      id TEXT PRIMARY KEY,
      session_id TEXT,
      batch_id TEXT NOT NULL,
      teacher_id TEXT,
      title TEXT NOT NULL,
      topic TEXT NOT NULL,
      duration_minutes INTEGER DEFAULT 45,
      recording_url TEXT NOT NULL,
      provider TEXT NOT NULL DEFAULT 'GOOGLE_MEET', -- 'GOOGLE_MEET' | 'ZOOM' | 'SECURE_STORAGE' | 'OTHER'
      status TEXT NOT NULL DEFAULT 'AVAILABLE', -- 'AVAILABLE' | 'PROCESSING' | 'RESTRICTED'
      recorded_date TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE,
      FOREIGN KEY (teacher_id) REFERENCES teachers(id)
    );

    CREATE TABLE IF NOT EXISTS helpdesk_tickets (
      id TEXT PRIMARY KEY,
      ticket_number TEXT UNIQUE NOT NULL, -- e.g. "UPS-10482"
      user_id TEXT NOT NULL,
      user_name TEXT NOT NULL,
      user_role TEXT NOT NULL,
      subject TEXT NOT NULL,
      category TEXT NOT NULL,
      priority TEXT NOT NULL DEFAULT 'NORMAL',
      status TEXT NOT NULL DEFAULT 'OPEN',
      attachment_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ticket_messages (
      id TEXT PRIMARY KEY,
      ticket_id TEXT NOT NULL,
      sender_id TEXT NOT NULL,
      sender_name TEXT NOT NULL,
      sender_role TEXT NOT NULL,
      message TEXT NOT NULL,
      attachment_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (ticket_id) REFERENCES helpdesk_tickets(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      user_role TEXT,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT NOT NULL,
      link_url TEXT,
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      lead_id TEXT,
      student_id TEXT,
      course_id TEXT NOT NULL,
      amount_inr INTEGER NOT NULL,
      currency TEXT NOT NULL DEFAULT 'INR',
      gateway TEXT NOT NULL DEFAULT 'RAZORPAY',
      gateway_order_id TEXT,
      gateway_payment_id TEXT UNIQUE,
      status TEXT NOT NULL DEFAULT 'PENDING', -- 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
      payment_link TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      paid_at DATETIME,
      FOREIGN KEY (lead_id) REFERENCES leads(id),
      FOREIGN KEY (student_id) REFERENCES students(id),
      FOREIGN KEY (course_id) REFERENCES courses(id)
    );

    CREATE TABLE IF NOT EXISTS enrollments (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      course_id TEXT NOT NULL,
      batch_id TEXT,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'ACTIVE', -- 'ACTIVE' | 'WAITING_FOR_BATCH' | 'WAITING_FOR_TEACHER' | 'COMPLETED' | 'CANCELLED'
      preferred_days TEXT,
      preferred_time TEXT,
      grade_group TEXT,
      payment_id TEXT UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
      FOREIGN KEY (course_id) REFERENCES courses(id),
      FOREIGN KEY (batch_id) REFERENCES batches(id),
      FOREIGN KEY (payment_id) REFERENCES payments(id)
    );

    CREATE TABLE IF NOT EXISTS placement_logs (
      id TEXT PRIMARY KEY,
      enrollment_id TEXT NOT NULL,
      student_id TEXT NOT NULL,
      course_id TEXT NOT NULL,
      batch_id TEXT,
      teacher_id TEXT,
      status TEXT NOT NULL, -- 'SUCCESS' | 'FAILED' | 'WAITING_FOR_TEACHER' | 'WAITING_FOR_BATCH'
      reason TEXT,
      rules_evaluated_json TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      actor_id TEXT,
      actor_name TEXT NOT NULL,
      actor_role TEXT NOT NULL,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT,
      details_json TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value_json TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
    CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(lead_source);
    CREATE INDEX IF NOT EXISTS idx_lead_activities_lead ON lead_activities(lead_id);
    CREATE INDEX IF NOT EXISTS idx_batches_course ON batches(course_id);
    CREATE INDEX IF NOT EXISTS idx_batches_status ON batches(status);
    CREATE INDEX IF NOT EXISTS idx_batch_memberships_batch ON batch_memberships(batch_id);
    CREATE INDEX IF NOT EXISTS idx_batch_memberships_student ON batch_memberships(student_id);
    CREATE INDEX IF NOT EXISTS idx_enrollments_student ON enrollments(student_id);
    CREATE INDEX IF NOT EXISTS idx_enrollments_status ON enrollments(status);
    CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
    CREATE INDEX IF NOT EXISTS idx_class_sessions_batch ON class_sessions(batch_id);
    CREATE INDEX IF NOT EXISTS idx_class_sessions_teacher ON class_sessions(teacher_id);
    CREATE INDEX IF NOT EXISTS idx_attendance_session ON attendance(session_id);
    CREATE INDEX IF NOT EXISTS idx_homework_batch ON homework(batch_id);
    CREATE INDEX IF NOT EXISTS idx_homework_submissions_hw ON homework_submissions(homework_id);
    CREATE INDEX IF NOT EXISTS idx_demo_evaluations_demo ON demo_evaluations(demo_id);
    CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
    CREATE INDEX IF NOT EXISTS idx_placement_logs_enr ON placement_logs(enrollment_id);
  `);

  // Safe migration helper for SQLite
  const safeAddColumn = (table: string, columnDef: string) => {
    try {
      db.exec(`ALTER TABLE ${table} ADD COLUMN ${columnDef};`);
    } catch (e) {
      // Column likely already exists
    }
  };

  // Safe migrations for users table
  safeAddColumn('users', 'phone TEXT');
  safeAddColumn('users', 'teacher_id TEXT');
  safeAddColumn('users', 'student_id TEXT');
  safeAddColumn('users', 'avatar_url TEXT');
  safeAddColumn('users', 'status TEXT NOT NULL DEFAULT "ACTIVE"');

  // Safe migrations for teachers table
  safeAddColumn('teachers', 'user_id TEXT');
  safeAddColumn('teachers', 'photo_url TEXT');
  safeAddColumn('teachers', 'qualification TEXT');
  safeAddColumn('teachers', 'experience TEXT');
  safeAddColumn('teachers', 'biography TEXT');
  safeAddColumn('teachers', 'expertise TEXT');
  safeAddColumn('teachers', 'achievements TEXT');
  safeAddColumn('teachers', 'availability TEXT');
  safeAddColumn('teachers', 'google_meet_link TEXT');
  safeAddColumn('teachers', 'payout_per_demo INTEGER NOT NULL DEFAULT 150');
  safeAddColumn('teachers', 'max_concurrent_batches INTEGER NOT NULL DEFAULT 4');
  safeAddColumn('teachers', 'max_weekly_hours INTEGER NOT NULL DEFAULT 20');
  safeAddColumn('teachers', 'grade_groups_json TEXT');
  safeAddColumn('teachers', 'course_ids_json TEXT');
  safeAddColumn('teachers', 'schedule_slots_json TEXT');
  safeAddColumn('teachers', 'status TEXT NOT NULL DEFAULT "ACTIVE"');

  // Safe migrations for courses table
  safeAddColumn('courses', 'target_batch_size INTEGER NOT NULL DEFAULT 8');
  safeAddColumn('courses', 'max_batch_size INTEGER NOT NULL DEFAULT 8');
  safeAddColumn('courses', 'max_catchup_sessions INTEGER NOT NULL DEFAULT 2');
  safeAddColumn('courses', 'allowed_days_json TEXT');
  safeAddColumn('courses', 'allowed_time_slots_json TEXT');
  safeAddColumn('courses', 'grade_groups_json TEXT');

  // Safe migrations for batches table
  safeAddColumn('batches', 'code TEXT');
  safeAddColumn('batches', 'teacher_id TEXT');
  safeAddColumn('batches', 'grade_group TEXT');
  safeAddColumn('batches', 'schedule_days TEXT');
  safeAddColumn('batches', 'schedule_time TEXT');
  safeAddColumn('batches', 'timezone TEXT DEFAULT "Asia/Kolkata"');
  safeAddColumn('batches', 'meeting_link TEXT');
  safeAddColumn('batches', 'target_capacity INTEGER DEFAULT 8');
  safeAddColumn('batches', 'max_capacity INTEGER DEFAULT 8');
  safeAddColumn('batches', 'status TEXT NOT NULL DEFAULT "OPEN"');
  safeAddColumn('batches', 'notes TEXT');

  // Safe migrations for students table
  safeAddColumn('students', 'user_id TEXT');
  safeAddColumn('students', 'lead_id TEXT');
  safeAddColumn('students', 'age INTEGER');
  safeAddColumn('students', 'school TEXT');
  safeAddColumn('students', 'parent_email TEXT');
  safeAddColumn('students', 'preferred_days TEXT');
  safeAddColumn('students', 'preferred_time TEXT');
  safeAddColumn('students', 'timezone TEXT DEFAULT "Asia/Kolkata"');
  safeAddColumn('students', 'status TEXT NOT NULL DEFAULT "ACTIVE"');
  safeAddColumn('students', 'photo_url TEXT');

  // Safe migrations for enrollments table
  safeAddColumn('enrollments', 'preferred_days TEXT');
  safeAddColumn('enrollments', 'preferred_time TEXT');
  safeAddColumn('enrollments', 'grade_group TEXT');
  safeAddColumn('enrollments', 'payment_id TEXT');

  // Safe migrations for class_sessions table
  safeAddColumn('class_sessions', 'session_number INTEGER');
  safeAddColumn('class_sessions', 'curriculum_session_id TEXT');
  safeAddColumn('class_sessions', 'meeting_link TEXT');
  safeAddColumn('class_sessions', 'recording_url TEXT');

  // Safe migrations for leads table
  safeAddColumn('leads', 'interest_area TEXT');
  safeAddColumn('leads', 'preferred_time TEXT');
  safeAddColumn('leads', 'preferred_days TEXT');
  safeAddColumn('leads', 'notes TEXT');
  safeAddColumn('leads', 'lead_source TEXT DEFAULT "DIRECT"');
  safeAddColumn('leads', 'utm_source TEXT');

  // Safe migrations for homework
  safeAddColumn('homework', 'target_student_id TEXT');

  // Populate batch_memberships from existing batch_students if empty
  try {
    const memCount = (db.prepare('SELECT COUNT(*) as count FROM batch_memberships').get() as any)?.count || 0;
    if (memCount === 0) {
      const existingBatchStudents = db.prepare('SELECT * FROM batch_students').all() as any[];
      for (const bs of existingBatchStudents) {
        const memId = 'mem_' + bs.id;
        db.prepare(`
          INSERT OR IGNORE INTO batch_memberships (id, batch_id, student_id, joined_at, status)
          VALUES (?, ?, ?, ?, ?)
        `).run(memId, bs.batch_id, bs.student_id, bs.enrolled_at || new Date().toISOString(), bs.status || 'ACTIVE');
      }
    }
  } catch (e) {}
}

// Auto-run schema initialization and migrations on import
initDatabase();
