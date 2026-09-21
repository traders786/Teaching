import bcrypt from 'bcryptjs';
import { db, initDatabase } from './schema.js';

export function seedDatabase() {
  initDatabase();

  const salt = bcrypt.genSaltSync(10);
  const adminPasswordHash = bcrypt.hashSync('AdminPassword123!', salt);
  const teacherPasswordHash = bcrypt.hashSync('TeacherPassword123!', salt);
  const studentPasswordHash = bcrypt.hashSync('StudentPassword123!', salt);

  // 1. Seed Users (Super Admin, Admin/Counselor, Teacher, Student)
  const usersToSeed = [
    {
      id: 'usr_admin_1',
      email: 'admin@speakindia.in',
      phone: '+91 98765 43210',
      password_hash: adminPasswordHash,
      name: 'Head Administrator',
      role: 'SUPER_ADMIN',
      teacher_id: null,
      student_id: null,
    },
    {
      id: 'usr_counselor_1',
      email: 'counselor@speakindia.in',
      phone: '+91 98765 43211',
      password_hash: adminPasswordHash,
      name: 'Admissions Coordinator',
      role: 'ADMIN',
      teacher_id: null,
      student_id: null,
    },
    {
      id: 'usr_teacher_1',
      email: 'ananya.sharma@speakindia.in',
      phone: '+91 98111 22334',
      password_hash: teacherPasswordHash,
      name: 'Ananya Sharma',
      role: 'TEACHER',
      teacher_id: 'tch_1',
      student_id: null,
    },
    {
      id: 'usr_teacher_2',
      email: 'parweenafshan0@gmail.com',
      phone: '+91 96089 93562',
      password_hash: teacherPasswordHash,
      name: 'Afshan Parween',
      role: 'TEACHER',
      teacher_id: 'tch_2',
      student_id: null,
    },
    {
      id: 'usr_student_1',
      email: 'kabir.verma@student.upspeaq.com',
      phone: '+91 99100 88776',
      password_hash: studentPasswordHash,
      name: 'Kabir Verma',
      role: 'STUDENT',
      teacher_id: null,
      student_id: 'std_1',
    },
    {
      id: 'usr_student_2',
      email: 'diya.patel@student.upspeaq.com',
      phone: '+91 98450 12345',
      password_hash: studentPasswordHash,
      name: 'Diya Patel',
      role: 'STUDENT',
      teacher_id: null,
      student_id: 'std_2',
    },
  ];

  for (const u of usersToSeed) {
    db.prepare(`
      INSERT OR REPLACE INTO users (id, email, phone, password_hash, name, role, teacher_id, student_id, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE')
    `).run(u.id, u.email, u.phone, u.password_hash, u.name, u.role, u.teacher_id, u.student_id);
  }

  // 2. Default Branding & System Settings
  const defaultBranding = {
    brandName: 'upspeaq',
    tagline: 'Every Child Deserves the Confidence to Speak',
    contactEmail: 'upspeaqofficial@gmail.com',
    contactPhone: '+91 7004132088',
    supportWhatsapp: '+91 7004132088',
    primaryColor: '#10182C',
    accentColor: '#F27C00',
    flagshipPrice: 4999,
    currency: 'INR',
    demoDurationMinutes: 45,
    classBatchTargetSize: 8,
    classBatchMaxSize: 8,
    maxCatchupSessions: 2,
    autoPlacementEnabled: true,
    autoTeacherAssignment: true,
    timezone: 'Asia/Kolkata',
  };

  const existingSettings = db.prepare('SELECT key FROM settings WHERE key = ?').get('branding');
  if (!existingSettings) {
    db.prepare(`
      INSERT INTO settings (key, value_json)
      VALUES (?, ?)
    `).run('branding', JSON.stringify(defaultBranding));
  }

  // 3. Teachers
  const teachersToSeed = [
    {
      id: 'tch_1',
      user_id: 'usr_teacher_1',
      name: 'Ananya Sharma',
      email: 'ananya.sharma@speakindia.in',
      phone: '+91 98111 22334',
      photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      qualification: 'M.A. English Literature (Delhi University), Certified Speech & Debate Coach',
      experience: '8+ Years in School Debate Mentorship & Public Speaking',
      biography: 'Senior Communication & Debate Educator with 8+ years of experience mentoring school students for national parliamentary debate circuits. Passionate about helping introverted kids articulate bold thoughts.',
      expertise: 'Public Speaking, Extempore, Debate Structuring, Accent Neutrality, Thought Organization',
      achievements: 'Trained 450+ school speakers; Mentored 14 National Inter-School Debate finalists',
      availability: 'Monday, Wednesday, Friday 4:00 PM - 8:00 PM IST',
      max_concurrent_batches: 4,
      max_weekly_hours: 20,
      grade_groups_json: JSON.stringify(['Class 4-7', 'Class 8-12']),
      course_ids_json: JSON.stringify(['crs_flagship_1', 'crs_starter_monthly', 'crs_individual_1on1']),
      schedule_slots_json: JSON.stringify([
        { days: 'Monday, Wednesday, Friday', time: '4:00 PM - 5:00 PM IST' },
        { days: 'Monday, Wednesday, Friday', time: '5:00 PM - 6:00 PM IST' },
        { days: 'Monday, Wednesday, Friday', time: '6:00 PM - 7:00 PM IST' },
      ]),
      status: 'ACTIVE',
    },
    {
      id: 'tch_2',
      user_id: 'usr_teacher_2',
      name: 'Afshan Parween',
      email: 'parweenafshan0@gmail.com',
      phone: '+91 96089 93562',
      photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      qualification: 'B.A. (Hons) Economics, B.Ed (Practical Training Completed)',
      experience: 'Experienced Live Spoken English, Communication & Personality Trainer',
      biography: 'National-Level Elocution Bronze Medallist and experienced communication trainer with a B.A. (Honours) in Economics and B.Ed practical training. Specializes in transforming school students (UKG to Grade 10) into confident speakers through interactive speech drills, storytelling, and extempore practice.',
      expertise: 'Spoken English Fluency, Elocution & Speech Clarity, Overcoming Hesitation, Storytelling, Critical Thinking',
      achievements: 'Bronze Medalist at National-Level Elocution Contest (competed against 83 universities); Trained 300+ students in live speech & personality development',
      availability: 'Tuesday, Thursday, Saturday 4:00 PM - 8:00 PM IST',
      max_concurrent_batches: 4,
      max_weekly_hours: 20,
      grade_groups_json: JSON.stringify(['UKG - Class 4', 'Class 5 - 10']),
      course_ids_json: JSON.stringify(['crs_flagship_1', 'crs_starter_monthly', 'crs_individual_1on1']),
      schedule_slots_json: JSON.stringify([
        { days: 'Tuesday, Thursday, Saturday', time: '4:00 PM - 5:00 PM IST' },
        { days: 'Tuesday, Thursday, Saturday', time: '5:00 PM - 6:00 PM IST' },
        { days: 'Tuesday, Thursday, Saturday', time: '6:00 PM - 7:00 PM IST' },
      ]),
      status: 'ACTIVE',
    },
  ];

  for (const t of teachersToSeed) {
    db.prepare(`
      INSERT OR REPLACE INTO teachers (
        id, user_id, name, email, phone, photo_url, qualification, experience, biography, expertise, achievements, availability, max_concurrent_batches, max_weekly_hours, grade_groups_json, course_ids_json, schedule_slots_json, status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      t.id, t.user_id, t.name, t.email, t.phone, t.photo_url, t.qualification, t.experience, t.biography, t.expertise, t.achievements, t.availability,
      t.max_concurrent_batches, t.max_weekly_hours, t.grade_groups_json, t.course_ids_json, t.schedule_slots_json, t.status
    );
  }

  // 4. Courses Catalog
  const coursesToSeed = [
    {
      id: 'crs_starter_monthly',
      name: '1-Month Communication & Fluency Starter',
      slug: '1-month-starter',
      description: '1-Month intensive starter cohort for Class 4-12 students. Build fundamental English speaking fluency, eliminate stage shyness, and practice live weekly speech assignments in intimate small-group batches.',
      duration_months: 1,
      classes_per_week: 3,
      total_classes: 12,
      price_inr: 1999,
      target_batch_size: 8,
      max_batch_size: 8,
      max_catchup_sessions: 2,
      allowed_days_json: JSON.stringify(['Monday, Wednesday, Friday', 'Tuesday, Thursday, Saturday']),
      allowed_time_slots_json: JSON.stringify(['4:00 PM - 5:00 PM IST', '5:00 PM - 6:00 PM IST', '6:00 PM - 7:00 PM IST']),
      grade_groups_json: JSON.stringify(['Class 4-7', 'Class 8-12']),
      is_flagship: 0,
    },
    {
      id: 'crs_flagship_1',
      name: '3-Month Flagship Communication & Confidence Cohort',
      slug: 'live-communication-confidence',
      description: 'Comprehensive 3-month interactive masterclass for Class 4-12 students. Master spoken English fluency, articulation, debate reasoning, and unshakeable stage confidence in live, intimate small-group batches.',
      duration_months: 3,
      classes_per_week: 3,
      total_classes: 36,
      price_inr: 4999,
      target_batch_size: 8,
      max_batch_size: 8,
      max_catchup_sessions: 2,
      allowed_days_json: JSON.stringify(['Monday, Wednesday, Friday', 'Tuesday, Thursday, Saturday']),
      allowed_time_slots_json: JSON.stringify(['4:00 PM - 5:00 PM IST', '5:00 PM - 6:00 PM IST', '6:00 PM - 7:00 PM IST']),
      grade_groups_json: JSON.stringify(['Class 4-7', 'Class 8-12']),
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
      max_catchup_sessions: 0,
      allowed_days_json: JSON.stringify(['Monday, Wednesday, Friday', 'Tuesday, Thursday, Saturday']),
      allowed_time_slots_json: JSON.stringify(['4:00 PM - 5:00 PM IST', '5:00 PM - 6:00 PM IST', '6:00 PM - 7:00 PM IST']),
      grade_groups_json: JSON.stringify(['Class 4-7', 'Class 8-12']),
      is_flagship: 0,
    },
  ];

  for (const c of coursesToSeed) {
    db.prepare(`
      INSERT OR REPLACE INTO courses (
        id, name, slug, description, duration_months, classes_per_week, total_classes, price_inr, target_batch_size, max_batch_size, max_catchup_sessions, allowed_days_json, allowed_time_slots_json, grade_groups_json, status, is_flagship
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE', ?)
    `).run(
      c.id, c.name, c.slug, c.description, c.duration_months, c.classes_per_week, c.total_classes, c.price_inr,
      c.target_batch_size, c.max_batch_size, c.max_catchup_sessions, c.allowed_days_json, c.allowed_time_slots_json, c.grade_groups_json, c.is_flagship
    );
  }

  // 5. Master Curriculum Modules & Sessions
  const existingModules = db.prepare('SELECT id FROM curriculum_modules').all();
  if (existingModules.length === 0) {
    const moduleInsert = db.prepare(`
      INSERT INTO curriculum_modules (id, course_id, grade_group, module_number, title, description)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const sessionInsert = db.prepare(`
      INSERT INTO curriculum_sessions (id, module_id, course_id, grade_group, week_number, session_number, topic, learning_objective, activity, speaking_exercise, homework_suggestion, required_materials, is_completed)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Junior Modules (Class 4-7)
    moduleInsert.run('mod_j1', 'crs_flagship_1', 'Class 4-7', 1, 'Foundation: Voice, Clarity & Hesitation-Free Speaking', 'Breaking baseline shyness and mastering daily conversational fluency.');
    moduleInsert.run('mod_j2', 'crs_flagship_1', 'Class 4-7', 2, 'Structure: The 3-Part Speech & Storytelling', 'Organizing thoughts cleanly into Hook, Body, and Strong Conclusion.');
    moduleInsert.run('mod_j3', 'crs_flagship_1', 'Class 4-7', 3, 'Expression: Voice Modulation & Body Language', 'Using pause, pitch, tone, and eye contact to captivate classmates.');
    moduleInsert.run('mod_j4', 'crs_flagship_1', 'Class 4-7', 4, 'Debate & Impromptu Confidence', 'Thinking on one’s feet in 60-second JAM rounds and friendly debates.');

    // Junior Sessions
    sessionInsert.run('sess_j1', 'mod_j1', 'crs_flagship_1', 'Class 4-7', 1, 1, 'Speaking Without Hesitation', 'Introduce yourself clearly and confidently without filler sounds.', 'The 60-Second Superpower Introduction', 'Introduce your best quality to the batch in 60 seconds.', 'Record a 60-second video introducing your favorite hobby.', 'Upspeaq Speaking Notebook', 1);
    sessionInsert.run('sess_j2', 'mod_j1', 'crs_flagship_1', 'Class 4-7', 1, 2, 'Pronunciation & Word Clarity', 'Eliminate mumbling and articulate vowels and consonants crisply.', 'Tongue Twister Relay & Vowel Articulation', 'Recite 3 tricky tongue twisters with clear pauses.', 'Practice reading 1 page of a storybook aloud for 2 minutes.', 'Reading Prompt Sheet', 1);
    sessionInsert.run('sess_j3', 'mod_j1', 'crs_flagship_1', 'Class 4-7', 1, 3, 'Eliminating Filler Words (Umm, Uh, Like)', 'Learn the power of the 2-second silent pause instead of saying umm.', 'The Red Flag Pause Game', 'Deliver a 1-minute speech about school with zero fillers.', 'Audio record a 90-second description of your pet or dream pet.', 'Pause Counter Timer', 1);
    
    sessionInsert.run('sess_j4', 'mod_j2', 'crs_flagship_1', 'Class 4-7', 2, 4, 'The 3-Step Speech Formula: Hook, Body, Wrap-up', 'Structure any impromptu thought into a clear beginning, middle, and end.', 'The Sandwich Story Building Exercise', 'Speak on "If I had a Time Machine" using the 3-Step Formula.', 'Write 3 bullet points on "My Dream Vacation" and record a 2-min speech.', 'Speech Structure Template', 0);
    sessionInsert.run('sess_j5', 'mod_j2', 'crs_flagship_1', 'Class 4-7', 2, 5, 'Descriptive Vocabulary & Sensory Words', 'Replace dull words (good, nice) with vivid sensory descriptors.', 'The Mystery Box Description Challenge', 'Describe an imaginary creature using 5 new sensory adjectives.', 'Record a 90-second book or movie recommendation.', 'Adjective Power Chart', 0);
    sessionInsert.run('sess_j6', 'mod_j2', 'crs_flagship_1', 'Class 4-7', 2, 6, 'Storytelling: Building Suspense & Emotion', 'Narrate personal real-life stories with pacing and emotion.', 'The Cliffhanger Story Chain', 'Tell a 2-minute story about the funniest thing that happened this week.', 'Record a 2-minute personal storytelling video.', 'Story Arc Diagram', 0);

    // Senior Modules (Class 8-12)
    moduleInsert.run('mod_s1', 'crs_flagship_1', 'Class 8-12', 1, 'Rhetoric & Impromptu Articulation (JAM & Extempore)', 'Developing rapid critical thinking and delivering compelling extempore remarks.');
    moduleInsert.run('mod_s2', 'crs_flagship_1', 'Class 8-12', 2, 'Parliamentary Debate & Argument Construction (AREL Method)', 'Assertion, Reasoning, Evidence, Linkage in competitive debates.');
    
    sessionInsert.run('sess_s1', 'mod_s1', 'crs_flagship_1', 'Class 8-12', 1, 1, 'The 30-Second Prep Extempore Technique', 'Master the PREP formula (Point, Reason, Example, Point) under pressure.', 'Rapid-fire 60-Second Topic Challenge', 'Pick a blind current affairs topic and speak with structure for 90 seconds.', 'Record a 2-minute video analyzing AI in classrooms.', 'PREP Framework Sheet', 1);
    sessionInsert.run('sess_s2', 'mod_s2', 'crs_flagship_1', 'Class 8-12', 2, 2, 'Constructing Unshakeable Rebuttals', 'Deconstruct opposing claims and pinpoint logical fallacies.', 'Cross-Examination Sparring Round', 'Deliver a 2-minute rebuttal against mandatory school uniforms.', 'Submit written 3-point rebuttal against an assigned debate motion.', 'Debate Score Sheet', 0);
  }

  // 6. Batches
  const existingBatches = db.prepare('SELECT id FROM batches').all();
  if (existingBatches.length === 0) {
    db.prepare(`
      INSERT INTO batches (id, batch_name, code, course_id, teacher_id, grade_group, start_date, end_date, schedule_days, schedule_time, timezone, meeting_link, target_capacity, max_capacity, status, notes)
      VALUES 
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'batch_1',
      'Junior Orators — Batch 001',
      'CC-001',
      'crs_flagship_1',
      'tch_1',
      'Class 4-7',
      '2026-09-01',
      '2026-11-30',
      'Monday, Wednesday, Friday',
      '5:00 PM - 6:00 PM IST',
      'Asia/Kolkata',
      'https://meet.google.com/upspeaq-batch-j01',
      8,
      8,
      'ACTIVE',
      'Active junior cohort focusing on public speaking foundation and hesitation-free speaking.',

      'batch_2',
      'Senior Debaters — Batch 001',
      'CC-002',
      'crs_flagship_1',
      'tch_2',
      'Class 8-12',
      '2026-09-02',
      '2026-12-02',
      'Tuesday, Thursday, Saturday',
      '6:00 PM - 7:00 PM IST',
      'Asia/Kolkata',
      'https://meet.google.com/upspeaq-batch-s01',
      8,
      8,
      'ACTIVE',
      'Senior debate and extempore masterclass with intensive rebuttals.'
    );
  }

  // 7. Students & Batch Enrollments
  const stdInsert = db.prepare(`
    INSERT OR REPLACE INTO students (id, user_id, lead_id, name, class_grade, age, school, parent_name, parent_phone, parent_email, city, preferred_days, preferred_time, timezone, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Asia/Kolkata', 'ACTIVE')
  `);

  stdInsert.run('std_1', 'usr_student_1', null, 'Kabir Verma', 'Class 5', 10, 'Delhi Public School, R.K. Puram', 'Sunita Verma', '+91 99100 88776', 'sunita.verma@example.com', 'Delhi NCR', 'Monday, Wednesday, Friday', '5:00 PM - 6:00 PM IST');
  stdInsert.run('std_2', 'usr_student_2', null, 'Diya Patel', 'Class 6', 11, 'National Public School, Indiranagar', 'Bhavna Patel', '+91 98450 12345', 'bhavna.patel@example.com', 'Bengaluru', 'Monday, Wednesday, Friday', '5:00 PM - 6:00 PM IST');
  stdInsert.run('std_3', null, null, 'Aarav Sharma', 'Class 6', 11, 'The Heritage School', 'Rajesh Sharma', '+91 98201 55442', 'rajesh.sharma@example.com', 'Mumbai', 'Monday, Wednesday, Friday', '5:00 PM - 6:00 PM IST');
  stdInsert.run('std_4', null, null, 'Meera Nair', 'Class 5', 10, 'Vidya Mandir', 'Ramesh Nair', '+91 98400 99887', 'ramesh.nair@example.com', 'Chennai', 'Monday, Wednesday, Friday', '5:00 PM - 6:00 PM IST');
  stdInsert.run('std_5', null, null, 'Rohan Gupta', 'Class 7', 12, 'St. Xavier\'s High School', 'Anil Gupta', '+91 97111 22334', 'anil.gupta@example.com', 'Kolkata', 'Monday, Wednesday, Friday', '5:00 PM - 6:00 PM IST');

  // Enrollments
  db.prepare(`
    INSERT OR REPLACE INTO enrollments (id, student_id, course_id, batch_id, start_date, end_date, preferred_days, preferred_time, grade_group, status)
    VALUES 
    ('enr_1', 'std_1', 'crs_flagship_1', 'batch_1', '2026-09-01', '2026-11-30', 'Monday, Wednesday, Friday', '5:00 PM - 6:00 PM IST', 'Class 4-7', 'ACTIVE'),
    ('enr_2', 'std_2', 'crs_flagship_1', 'batch_1', '2026-09-01', '2026-11-30', 'Monday, Wednesday, Friday', '5:00 PM - 6:00 PM IST', 'Class 4-7', 'ACTIVE'),
    ('enr_3', 'std_3', 'crs_flagship_1', 'batch_1', '2026-09-01', '2026-11-30', 'Monday, Wednesday, Friday', '5:00 PM - 6:00 PM IST', 'Class 4-7', 'ACTIVE'),
    ('enr_4', 'std_4', 'crs_flagship_1', 'batch_1', '2026-09-01', '2026-11-30', 'Monday, Wednesday, Friday', '5:00 PM - 6:00 PM IST', 'Class 4-7', 'ACTIVE'),
    ('enr_5', 'std_5', 'crs_flagship_1', 'batch_1', '2026-09-01', '2026-11-30', 'Monday, Wednesday, Friday', '5:00 PM - 6:00 PM IST', 'Class 4-7', 'ACTIVE')
  `).run();

  // Batch Memberships & legacy batch_students
  const bsInsert = db.prepare(`INSERT OR REPLACE INTO batch_students (id, batch_id, student_id, status) VALUES (?, ?, ?, 'ACTIVE')`);
  const memInsert = db.prepare(`INSERT OR REPLACE INTO batch_memberships (id, batch_id, student_id, enrollment_id, joined_at, status) VALUES (?, ?, ?, ?, '2026-09-01', 'ACTIVE')`);

  const initialStudents = ['std_1', 'std_2', 'std_3', 'std_4', 'std_5'];
  initialStudents.forEach((stdId, idx) => {
    bsInsert.run(`bs_${idx + 1}`, 'batch_1', stdId);
    memInsert.run(`mem_${idx + 1}`, 'batch_1', stdId, `enr_${idx + 1}`);
  });

  // 8. Class Sessions & Scheduled Classes
  const existingSessions = db.prepare('SELECT id FROM class_sessions').all();
  if (existingSessions.length === 0) {
    const csInsert = db.prepare(`
      INSERT INTO class_sessions (id, batch_id, teacher_id, session_number, date, start_time, end_time, topic, module_id, curriculum_session_id, meeting_link, recording_url, status, teacher_notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Past session 1
    csInsert.run(
      'cs_1',
      'batch_1',
      'tch_1',
      1,
      '2026-09-15',
      '5:00 PM',
      '6:00 PM',
      'Speaking Without Hesitation: The 60-Second Superpower Intro',
      'mod_j1',
      'sess_j1',
      'https://meet.google.com/upspeaq-batch-j01',
      'https://drive.google.com/file/d/upspeaq-rec-session-1/view',
      'COMPLETED',
      'Great engagement today! Kabir and Diya introduced themselves with great eye contact. Rohan needs slightly more breath control before speaking.'
    );

    // Past session 2
    csInsert.run(
      'cs_2',
      'batch_1',
      'tch_1',
      2,
      '2026-09-17',
      '5:00 PM',
      '6:00 PM',
      'Pronunciation & Eliminating Filler Words (Umm, Like)',
      'mod_j1',
      'sess_j2',
      'https://meet.google.com/upspeaq-batch-j01',
      'https://drive.google.com/file/d/upspeaq-rec-session-2/view',
      'COMPLETED',
      'Practiced the 2-second silent pause technique. All students showed 50% fewer umms.'
    );

    // Today's session
    csInsert.run(
      'cs_3',
      'batch_1',
      'tch_1',
      3,
      '2026-09-18',
      '5:00 PM',
      '6:00 PM',
      'Speaking With Structure: The Hook, Story Body & Strong Wrap-up',
      'mod_j2',
      'sess_j4',
      'https://meet.google.com/upspeaq-batch-j01',
      null,
      'UPCOMING',
      'Focus today will be live impromptu speeches using the 3-step Sandwich Formula.'
    );

    // Upcoming session
    csInsert.run(
      'cs_4',
      'batch_1',
      'tch_1',
      4,
      '2026-09-20',
      '5:00 PM',
      '6:00 PM',
      'Descriptive Vocabulary & Expressive Storytelling',
      'mod_j2',
      'sess_j5',
      'https://meet.google.com/upspeaq-batch-j01',
      null,
      'UPCOMING',
      'Students will bring 1 favorite book to describe.'
    );

    // Attendance records for Session 1 & 2
    const attInsert = db.prepare(`INSERT OR REPLACE INTO attendance (id, session_id, student_id, batch_id, status, notes, marked_by) VALUES (?, ?, ?, ?, ?, ?, ?)`);
    attInsert.run('att_s1_1', 'cs_1', 'std_1', 'batch_1', 'PRESENT', 'Very energetic and punctual.', 'Ananya Sharma');
    attInsert.run('att_s1_2', 'cs_1', 'std_2', 'batch_1', 'PRESENT', 'Spoke clearly with good pitch.', 'Ananya Sharma');
    attInsert.run('att_s1_3', 'cs_1', 'std_3', 'batch_1', 'PRESENT', 'Good attempt, overcame initial hesitation.', 'Ananya Sharma');
    attInsert.run('att_s1_4', 'cs_1', 'std_4', 'batch_1', 'LATE', 'Joined 5 mins late due to school bus.', 'Ananya Sharma');
    attInsert.run('att_s1_5', 'cs_1', 'std_5', 'batch_1', 'PRESENT', 'Active in group exercise.', 'Ananya Sharma');

    attInsert.run('att_s2_1', 'cs_2', 'std_1', 'batch_1', 'PRESENT', 'Zero filler words in second attempt!', 'Ananya Sharma');
    attInsert.run('att_s2_2', 'cs_2', 'std_2', 'batch_1', 'PRESENT', 'Excellent articulation.', 'Ananya Sharma');
    attInsert.run('att_s2_3', 'cs_2', 'std_3', 'batch_1', 'PRESENT', 'Very attentive.', 'Ananya Sharma');
    attInsert.run('att_s2_4', 'cs_2', 'std_4', 'batch_1', 'ABSENT', 'Informed beforehand (fever).', 'Ananya Sharma');
    attInsert.run('att_s2_5', 'cs_2', 'std_5', 'batch_1', 'PRESENT', 'Practiced pause technique.', 'Ananya Sharma');
  }

  // 9. Homework Assignments & Student Submissions
  const existingHw = db.prepare('SELECT id FROM homework').all();
  if (existingHw.length === 0) {
    const hwInsert = db.prepare(`
      INSERT INTO homework (id, batch_id, session_id, teacher_id, title, description, instructions, due_date, submission_type, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const subInsert = db.prepare(`
      INSERT INTO homework_submissions (id, homework_id, student_id, submission_type, content_text, media_url, file_name, submitted_at, status, score_rating, mentor_feedback, reviewed_at, reviewed_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // HW 1: Reviewed
    hwInsert.run(
      'hw_1',
      'batch_1',
      'cs_1',
      'tch_1',
      '2-Minute Hobby Speech (Audio / Video)',
      'Record a 2-minute speech about your favorite hobby or sport.',
      '1. Stand straight and look directly at the camera.\n2. State your name, your hobby, why you love it, and one funny memory.\n3. Keep pauses natural.',
      '2026-09-17',
      'AUDIO',
      'ACTIVE'
    );

    subInsert.run(
      'sub_1',
      'hw_1',
      'std_1',
      'AUDIO',
      'My speech on why I love Astronomy and building scale model rockets.',
      'https://cdn.upspeaq.com/submissions/kabir_hobby_speech_audio.mp3',
      'kabir_hobby_speech.mp3',
      '2026-09-16 19:30:00',
      'REVIEWED',
      'Strong',
      'Wonderful energy, Kabir! Your explanation of telescope lenses was captivating. Remember to pause for 1 second when changing points.',
      '2026-09-17 10:15:00',
      'Ananya Sharma'
    );

    // HW 2: Today's Pending Homework for Kabir
    hwInsert.run(
      'hw_2',
      'batch_1',
      'cs_2',
      'tch_1',
      'The 3-Step Story Hook & Descriptive Speech',
      'Record a 90-second video sharing an exciting real-life experience using the Hook-Story-Wrapup structure.',
      '1. Start with an intriguing opening question or sound effect.\n2. Describe the climax using 3 vivid adjectives.\n3. End with what you learned.',
      '2026-09-19',
      'VIDEO',
      'ACTIVE'
    );
  }

  // 10. Demo Sessions & Attendees & Evaluations
  const existingDemos = db.prepare('SELECT id FROM demo_sessions').all();
  if (existingDemos.length === 0) {
    db.prepare(`
      INSERT INTO demo_sessions (id, title, date, start_time, end_time, teacher_id, meeting_link, capacity, status, notes)
      VALUES 
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'demo_session_1',
      'Interactive Speech & Confidence Demo Slot A',
      '2026-09-18',
      '5:30 PM',
      '6:15 PM',
      'tch_1',
      'https://meet.google.com/upspeaq-demo-slot-a',
      2,
      'SCHEDULED',
      '2-student interactive session to evaluate speech clarity, vocabulary richness, and hesitation.',

      'demo_session_2',
      'Weekend Morning Spoken English Assessment Slot B',
      '2026-09-19',
      '11:00 AM',
      '11:45 AM',
      'tch_1',
      'https://meet.google.com/upspeaq-demo-slot-b',
      2,
      'SCHEDULED',
      'Middle school applicants from Delhi NCR.'
    );
  }

  // 11. Recordings
  const existingRecordings = db.prepare('SELECT id FROM recordings').all();
  if (existingRecordings.length === 0) {
    db.prepare(`
      INSERT INTO recordings (id, session_id, batch_id, teacher_id, title, topic, duration_minutes, recording_url, provider, status, recorded_date)
      VALUES 
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'rec_1',
      'cs_1',
      'batch_1',
      'tch_1',
      'Session 1: Speaking Without Hesitation',
      'The 60-Second Superpower Introduction & Eye Contact',
      45,
      'https://www.youtube.com/watch?v=i5mYphUoOCs',
      'YOUTUBE_UNLISTED',
      'AVAILABLE',
      '2026-09-15',

      'rec_2',
      'cs_2',
      'batch_1',
      'tch_1',
      'Session 2: Pronunciation & The 2-Second Silent Pause',
      'Eliminating Umm, Like, You Know in Daily Conversations',
      45,
      'https://www.youtube.com/watch?v=tShavGuo0_E',
      'YOUTUBE_UNLISTED',
      'AVAILABLE',
      '2026-09-17'
    );
  }

  // 12. Helpdesk Tickets & Messages
  const existingTickets = db.prepare('SELECT id FROM helpdesk_tickets').all();
  if (existingTickets.length === 0) {
    db.prepare(`
      INSERT INTO helpdesk_tickets (id, ticket_number, user_id, user_name, user_role, subject, category, priority, status)
      VALUES 
      (?, ?, ?, ?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'tkt_1',
      'UPS-10482',
      'usr_student_1',
      'Kabir Verma',
      'STUDENT',
      'Audio recording upload question for Session 2 homework',
      'Homework',
      'NORMAL',
      'RESOLVED',

      'tkt_2',
      'UPS-10483',
      'usr_teacher_1',
      'Ananya Sharma',
      'TEACHER',
      'Request for supplementary debate topic prompts for Class 6',
      'Curriculum',
      'NORMAL',
      'OPEN'
    );

    db.prepare(`
      INSERT INTO ticket_messages (id, ticket_id, sender_id, sender_name, sender_role, message)
      VALUES 
      (?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?)
    `).run(
      'msg_1',
      'tkt_1',
      'usr_student_1',
      'Kabir Verma',
      'STUDENT',
      'Hello teacher, can I record my audio on phone voice recorder and attach the .m4a file or should it be MP3 only?',

      'msg_2',
      'tkt_1',
      'usr_admin_1',
      'Head Administrator',
      'ADMIN',
      'Hi Kabir! Yes, .m4a, .mp3, .wav or web audio are all supported. You can upload directly through the student portal!'
    );
  }

  // 13. In-App Notifications
  const existingNotifs = db.prepare('SELECT id FROM notifications').all();
  if (existingNotifs.length === 0) {
    db.prepare(`
      INSERT INTO notifications (id, user_id, user_role, title, message, type, link_url, is_read)
      VALUES 
      (?, ?, ?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'notif_1',
      'usr_teacher_1',
      'TEACHER',
      'New Demo Student Assigned',
      'Aarav Mehta (Class 6) has been assigned to you for Demo Slot A on 18 Sept 5:30 PM.',
      'DEMO_ASSIGNED',
      '/teacher/demos',
      0,

      'notif_2',
      'usr_student_1',
      'STUDENT',
      'Mentor Feedback Available',
      'Teacher Ananya reviewed your "2-Minute Hobby Speech" submission and gave a Strong rating!',
      'HOMEWORK_REVIEWED',
      '/student/homework',
      0,

      'notif_3',
      'usr_student_1',
      'STUDENT',
      'Next Live Class Today at 5:00 PM',
      'Junior Orators Batch 001 — Speaking With Structure (Hook, Body & Wrap-up).',
      'CLASS_REMINDER',
      '/student/classes',
      0
    );
  }

  console.log('Database initialization and seeding completed successfully for all 3 roles (Admin, Teacher, Student).');
}
