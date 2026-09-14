import bcrypt from 'bcryptjs';
import { db, initDatabase } from './schema.js';

export function seedDatabase() {
  initDatabase();

  // 1. Check if admin exists
  const existingAdmin = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@speakindia.in');
  if (!existingAdmin) {
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync('AdminPassword123!', salt);
    
    db.prepare(`
      INSERT INTO users (id, email, password_hash, name, role, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run('usr_admin_1', 'admin@speakindia.in', passwordHash, 'Head Administrator', 'SUPER_ADMIN', 'ACTIVE');
    
    console.log('Seeded default Super Admin: admin@speakindia.in');
  }

  // 2. Default settings & branding
  const defaultBranding = {
    brandName: 'Speak India',
    tagline: 'Every Child Deserves the Confidence to Speak',
    contactEmail: 'admissions@speakindia.in',
    contactPhone: '+91 98765 43210',
    supportWhatsapp: '+91 98765 43210',
    primaryColor: '#1E293B',
    accentColor: '#D97706',
    flagshipPrice: 4999,
    currency: 'INR',
    demoDurationMinutes: 45,
    classBatchTargetSize: 8,
    classBatchMaxSize: 9,
  };

  const existingSettings = db.prepare('SELECT key FROM settings WHERE key = ?').get('branding');
  if (!existingSettings) {
    db.prepare(`
      INSERT INTO settings (key, value_json)
      VALUES (?, ?)
    `).run('branding', JSON.stringify(defaultBranding));
  }

  // 3. Teachers
  const existingTeachers = db.prepare('SELECT id FROM teachers').all();
  if (existingTeachers.length === 0) {
    db.prepare(`
      INSERT INTO teachers (id, name, email, phone, biography, expertise, achievements, availability, status)
      VALUES 
      (?, ?, ?, ?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'tch_1',
      'Ananya Sharma',
      'ananya.sharma@speakindia.in',
      '+91 98111 22334',
      'Senior Communication & Debate Educator with 7+ years of experience mentoring school students for national parliamentary debate circuits. (Verified Faculty Profile)',
      'Public Speaking, Extempore, Debate Structuring, Accent Neutrality',
      'Trained 450+ school speakers, 12 National Debate finalists (Placeholder verification available upon request)',
      'Mon-Fri 4 PM - 8 PM IST',
      'ACTIVE',

      'tch_2',
      'Vikramaditya Sen',
      'vikram.sen@speakindia.in',
      '+91 98222 33445',
      'Drama and Spoken English Specialist passionate about breaking hesitation and stage anxiety in middle school students. (Verified Faculty Profile)',
      'Spoken English Fluency, Overcoming Stage Fear, Storytelling, Body Language',
      'Conducted 100+ school confidence workshops across Delhi NCR and Bengaluru',
      'Tue-Sat 3 PM - 7 PM IST',
      'ACTIVE'
    );
  }

  // 4. Courses Catalog (1-Month Starter, 3-Month Flagship, 1-on-1 Private)
  const coursesToSeed = [
    {
      id: 'crs_starter_monthly',
      name: '1-Month Communication & Fluency Starter',
      slug: '1-month-starter',
      description: '1-Month intensive starter cohort for Class 4-12 students. Build fundamental English speaking fluency, eliminate stage shyness, and practice live weekly speech assignments in 8-student batches.',
      duration_months: 1,
      classes_per_week: 3,
      total_classes: 12,
      price_inr: 1999,
      target_batch_size: 8,
      max_batch_size: 9,
      is_flagship: 0,
    },
    {
      id: 'crs_flagship_1',
      name: '3-Month Flagship Communication & Confidence Cohort',
      slug: 'live-communication-confidence',
      description: 'Comprehensive 3-month interactive masterclass for Class 4-12 students. Master spoken English fluency, articulation, debate reasoning, and unshakeable stage confidence in live, 8-student batches.',
      duration_months: 3,
      classes_per_week: 3,
      total_classes: 36,
      price_inr: 4999,
      target_batch_size: 8,
      max_batch_size: 9,
      is_flagship: 1,
    },
    {
      id: 'crs_individual_1on1',
      name: '1-on-1 Individual Speech Coaching (Private Classes)',
      slug: 'individual-1on1-classes',
      description: 'Exclusive 1-on-1 personalized speech mentorship with a dedicated senior coach. Tailored curriculum, flexible scheduling, and focused preparation for school debates, competitions, and confidence.',
      duration_months: 1,
      classes_per_week: 3,
      total_classes: 12,
      price_inr: 5000,
      target_batch_size: 1,
      max_batch_size: 1,
      is_flagship: 0,
    },
  ];

  for (const c of coursesToSeed) {
    db.prepare(`
      INSERT OR REPLACE INTO courses (id, name, slug, description, duration_months, classes_per_week, total_classes, price_inr, target_batch_size, max_batch_size, status, is_flagship)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE', ?)
    `).run(
      c.id,
      c.name,
      c.slug,
      c.description,
      c.duration_months,
      c.classes_per_week,
      c.total_classes,
      c.price_inr,
      c.target_batch_size,
      c.max_batch_size,
      c.is_flagship
    );
  }

  // 5. Initial Batches
  const existingBatches = db.prepare('SELECT id FROM batches').all();
  if (existingBatches.length === 0) {
    db.prepare(`
      INSERT INTO batches (id, batch_name, course_id, teacher_id, start_date, end_date, schedule_days, schedule_time, meeting_link, target_capacity, max_capacity, status, notes)
      VALUES 
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'batch_1',
      'Junior Orators (Class 4 - 7) - Mon/Wed/Fri Evening',
      'crs_flagship_1',
      'tch_2',
      '2026-10-01',
      '2026-12-31',
      'Monday, Wednesday, Friday',
      '5:00 PM - 6:00 PM IST',
      'https://meet.google.com/speak-india-batch1',
      8,
      9,
      'UPCOMING',
      'Focus on story narration, daily conversational English, and building confidence in answering questions.',

      'batch_2',
      'Senior Debaters (Class 8 - 12) - Tue/Thu/Sat Evening',
      'crs_flagship_1',
      'tch_1',
      '2026-10-02',
      '2027-01-02',
      'Tuesday, Thursday, Saturday',
      '6:30 PM - 7:30 PM IST',
      'https://meet.google.com/speak-india-batch2',
      8,
      9,
      'UPCOMING',
      'Focus on formal debate arguments, impromptu speaking, interview presence, and persuasive presentation.'
    );
  }

  // 6. Initial Demo Sessions
  const existingDemos = db.prepare('SELECT id FROM demo_sessions').all();
  if (existingDemos.length === 0) {
    db.prepare(`
      INSERT INTO demo_sessions (id, title, date, start_time, end_time, teacher_id, meeting_link, capacity, status, notes)
      VALUES 
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'demo_session_1',
      'Interactive Speech & Confidence Demo (Slot A)',
      '2026-09-18',
      '5:30 PM',
      '6:15 PM',
      'tch_1',
      'https://meet.google.com/demo-slot-a',
      2,
      'SCHEDULED',
      '2-student focused assessment demo session to identify speaking hesitation and fluency.',

      'demo_session_2',
      'Interactive Speech & Confidence Demo (Slot B)',
      '2026-09-19',
      '11:00 AM',
      '11:45 AM',
      'tch_2',
      'https://meet.google.com/demo-slot-b',
      2,
      'SCHEDULED',
      'Morning weekend slot for Class 4-7 applicants.'
    );
  }

  // 7. Seed sample leads to make the operational dashboard alive
  const existingLeads = db.prepare('SELECT id FROM leads').all();
  if (existingLeads.length === 0) {
    const leadInsert = db.prepare(`
      INSERT INTO leads (id, student_name, student_class, student_age, parent_name, mobile_number, email, city, interest_area, preferred_time, notes, lead_source, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const activityInsert = db.prepare(`
      INSERT INTO lead_activities (id, lead_id, action_type, description, actor_name)
      VALUES (?, ?, ?, ?, ?)
    `);

    // Lead 1: NEW
    leadInsert.run('lead_101', 'Aarav Mehta', 'Class 6', 11, 'Rajesh Mehta', '+91 98201 55442', 'rajesh.mehta@example.com', 'Mumbai', 'Confidence Building', 'Weekday Evenings (5-7 PM)', 'Hesitates to speak in school assembly, parent wants more stage practice.', 'META_ADS', 'NEW');
    activityInsert.run('act_1', 'lead_101', 'CREATED', 'Lead received via Meta Ads campaign "Confidence For Kids".', 'System');

    // Lead 2: DEMO_SCHEDULED
    leadInsert.run('lead_102', 'Diya Patel', 'Class 8', 13, 'Bhavna Patel', '+91 98450 12345', 'bhavna.patel@example.com', 'Bengaluru', 'Public Speaking', 'Weekend Mornings', 'Very bright student, wants to participate in inter-school debate.', 'ORGANIC', 'DEMO_SCHEDULED');
    activityInsert.run('act_2', 'lead_102', 'CREATED', 'Demo booked directly on website.', 'System');
    activityInsert.run('act_3', 'lead_102', 'DEMO_SCHEDULED', 'Scheduled for Demo Slot A on 2026-09-18 with Teacher Ananya Sharma.', 'Head Administrator');

    // Add Diya as attendee to demo 1
    db.prepare(`
      INSERT INTO demo_attendees (id, demo_id, lead_id, student_name, parent_phone, attendance_status, outcome, conversion_potential)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run('att_1', 'demo_session_1', 'lead_102', 'Diya Patel', '+91 98450 12345', 'REGISTERED', 'HIGH_POTENTIAL', 'HIGH');

    // Lead 3: CONVERTED with student & enrollment
    leadInsert.run('lead_103', 'Kabir Verma', 'Class 5', 10, 'Sunita Verma', '+91 99100 88776', 'sunita.verma@example.com', 'Delhi NCR', 'Spoken English', 'Weekday Evenings', 'Enrolled after attending demo.', 'REFERRAL', 'CONVERTED');
    activityInsert.run('act_4', 'lead_103', 'CREATED', 'Referred by coaching partner.', 'System');
    activityInsert.run('act_5', 'lead_103', 'PAYMENT_COMPLETED', 'Payment of ₹4,999 verified. Payment ID: pay_103', 'Payment Gateway');
    activityInsert.run('act_6', 'lead_103', 'STUDENT_CONVERTED', 'Lead converted into enrolled active student and assigned to Junior Orators Batch.', 'Head Administrator');

    // Create student record
    db.prepare(`
      INSERT INTO students (id, lead_id, name, class_grade, age, parent_name, parent_phone, parent_email, city, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run('std_1', 'lead_103', 'Kabir Verma', 'Class 5', 10, 'Sunita Verma', '+91 99100 88776', 'sunita.verma@example.com', 'Delhi NCR', 'ACTIVE');

    // Assign to batch
    db.prepare(`
      INSERT INTO batch_students (id, batch_id, student_id, status)
      VALUES (?, ?, ?, ?)
    `).run('bs_1', 'batch_1', 'std_1', 'ACTIVE');

    // Payment record
    db.prepare(`
      INSERT INTO payments (id, lead_id, student_id, course_id, amount_inr, currency, gateway, gateway_order_id, gateway_payment_id, status, paid_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).run('pay_103', 'lead_103', 'std_1', 'crs_flagship_1', 4999, 'INR', 'RAZORPAY', 'order_demo_103', 'pay_verified_103', 'PAID');

    // Enrollment record
    db.prepare(`
      INSERT INTO enrollments (id, student_id, course_id, batch_id, start_date, end_date, status, payment_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run('enr_1', 'std_1', 'crs_flagship_1', 'batch_1', '2026-10-01', '2026-12-31', 'ACTIVE', 'pay_103');
  }

  console.log('Database initialization and seeding completed.');
}
