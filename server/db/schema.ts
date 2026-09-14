import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';

const dataDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'speakindia.db');
export const db = new DatabaseSync(dbPath);

// Enable WAL mode & foreign keys
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'ADMIN', -- 'SUPER_ADMIN' | 'ADMIN' | 'TEACHER'
      status TEXT NOT NULL DEFAULT 'ACTIVE',
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
      biography TEXT,
      expertise TEXT,
      achievements TEXT,
      availability TEXT,
      status TEXT NOT NULL DEFAULT 'ACTIVE',
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
      max_batch_size INTEGER NOT NULL DEFAULT 9,
      status TEXT NOT NULL DEFAULT 'ACTIVE',
      is_flagship INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS batches (
      id TEXT PRIMARY KEY,
      batch_name TEXT NOT NULL,
      course_id TEXT NOT NULL,
      teacher_id TEXT,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      schedule_days TEXT NOT NULL, -- e.g. "Mon, Wed, Fri"
      schedule_time TEXT NOT NULL, -- e.g. "5:00 PM - 6:00 PM IST"
      meeting_link TEXT,
      target_capacity INTEGER NOT NULL DEFAULT 8,
      max_capacity INTEGER NOT NULL DEFAULT 9,
      status TEXT NOT NULL DEFAULT 'ACTIVE', -- 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
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
      status TEXT NOT NULL DEFAULT 'SCHEDULED', -- 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
      notes TEXT,
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

    CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY,
      lead_id TEXT,
      name TEXT NOT NULL,
      class_grade TEXT NOT NULL,
      age INTEGER,
      parent_name TEXT NOT NULL,
      parent_phone TEXT NOT NULL,
      parent_email TEXT,
      city TEXT,
      status TEXT NOT NULL DEFAULT 'ACTIVE', -- 'ACTIVE' | 'PENDING' | 'COMPLETED' | 'EXPIRED' | 'CANCELLED'
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
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

    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      lead_id TEXT,
      student_id TEXT,
      course_id TEXT NOT NULL,
      amount_inr INTEGER NOT NULL,
      currency TEXT NOT NULL DEFAULT 'INR',
      gateway TEXT NOT NULL DEFAULT 'RAZORPAY', -- 'RAZORPAY' | 'CASHFREE' | 'UPI' | 'MANUAL'
      gateway_order_id TEXT,
      gateway_payment_id TEXT,
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
      status TEXT NOT NULL DEFAULT 'ACTIVE', -- 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
      payment_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
      FOREIGN KEY (course_id) REFERENCES courses(id),
      FOREIGN KEY (batch_id) REFERENCES batches(id),
      FOREIGN KEY (payment_id) REFERENCES payments(id)
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
    CREATE INDEX IF NOT EXISTS idx_enrollments_student ON enrollments(student_id);
    CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
  `);
}
