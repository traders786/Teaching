import { db } from '../db/schema.js';
import { activateEnrollment } from '../services/enrollmentService.js';
import { transferStudent } from '../services/transferService.js';
import { placeStudentInBatch } from '../services/batchPlacementService.js';

interface TestResult {
  name: string;
  passed: boolean;
  details?: string;
  error?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, name: string, details?: string) {
  if (condition) {
    results.push({ name, passed: true, details });
    console.log(`  \x1b[32m✔ PASS\x1b[0m: ${name}${details ? ` (${details})` : ''}`);
  } else {
    results.push({ name, passed: false, error: 'Assertion failed' });
    console.error(`  \x1b[31m✖ FAIL\x1b[0m: ${name}`);
    throw new Error(`Assertion failed: ${name}`);
  }
}

async function runAutomationTests() {
  console.log('\n======================================================');
  console.log('🚀 UPSPEAQ AUTOMATION ENGINE - INTEGRATION TEST SUITE');
  console.log('======================================================\n');

  const timestamp = Date.now();
  const testCourseId = `crs_test_${timestamp}`;
  const testCourseName = `Test Automation Course ${timestamp}`;

  try {
    // ----------------------------------------------------------------
    // SETUP: Create Test Course with 8-Student Capacity & 36 Sessions
    // ----------------------------------------------------------------
    console.log('📦 Step 1: Setting up Test Course & Qualified Teachers...');
    db.prepare(`
      INSERT INTO courses (
        id, name, slug, description, duration_months, classes_per_week, total_classes,
        price_inr, status, target_batch_size, max_batch_size, max_catchup_sessions,
        allowed_days_json, allowed_time_slots_json, grade_groups_json
      ) VALUES (
        ?, ?, ?, 'Test automated placement course', 3, 3, 36,
        14999, 'ACTIVE', 8, 8, 2,
        '["Mon, Wed, Fri", "Tue, Thu, Sat"]', '["5:00 PM - 6:00 PM IST", "6:00 PM - 7:00 PM IST"]', '["Class 4-7", "Class 8-12"]'
      )
    `).run(testCourseId, testCourseName, `test-course-${timestamp}`);

    // Create 2 Test Teachers with matching qualification for testCourseId
    const teacherAId = `tch_a_${timestamp}`;
    const teacherBId = `tch_b_${timestamp}`;
    const userTAId = `usr_ta_${timestamp}`;
    const userTBId = `usr_tb_${timestamp}`;

    db.prepare(`
      INSERT INTO users (id, email, phone, password_hash, name, role, status)
      VALUES (?, ?, '+919999111111', 'hash', 'Teacher Alpha', 'TEACHER', 'ACTIVE'),
             (?, ?, '+919999222222', 'hash', 'Teacher Beta', 'TEACHER', 'ACTIVE')
    `).run(userTAId, `teacher.alpha.${timestamp}@upspeaq.com`, userTBId, `teacher.beta.${timestamp}@upspeaq.com`);

    db.prepare(`
      INSERT INTO teachers (
        id, user_id, name, email, biography, course_ids_json, grade_groups_json,
        max_concurrent_batches, max_weekly_hours, status
      ) VALUES (
        ?, ?, 'Teacher Alpha', ?, 'Experienced ESL Trainer', ?, '["Class 4-7", "Class 8-12"]',
        2, 20, 'ACTIVE'
      ), (
        ?, ?, 'Teacher Beta', ?, 'Speech Coach', ?, '["Class 4-7"]',
        2, 20, 'ACTIVE'
      )
    `).run(
      teacherAId, userTAId, `teacher.alpha.${timestamp}@upspeaq.com`, JSON.stringify([testCourseId, 'Spoken English']),
      teacherBId, userTBId, `teacher.beta.${timestamp}@upspeaq.com`, JSON.stringify([testCourseId, 'Spoken English'])
    );

    assert(true, 'Test Course and 2 Teachers initialized successfully');

    // ----------------------------------------------------------------
    // TEST 1: Sequential 17-Student Enrollment & Automatic Batch Spillover (8 -> 8 -> 1)
    // ----------------------------------------------------------------
    console.log('\n👥 Step 2: Enrolling 17 Students Sequentially (8-Cap Validation)...');
    const studentIds: string[] = [];

    for (let i = 1; i <= 17; i++) {
      const leadId = `lead_test_${timestamp}_${i}`;
      const leadName = `Student ${i}`;
      const leadEmail = `student${i}.${timestamp}@upspeaq.com`;
      const leadPhone = `+9198765${String(i).padStart(5, '0')}`;
      const paymentRef = `PAY_AUTO_${timestamp}_${i}`;

      // Insert Lead
      db.prepare(`
        INSERT INTO leads (
          id, student_name, parent_name, mobile_number, email, student_class, student_age,
          interest_area, preferred_days, preferred_time, status
        ) VALUES (
          ?, ?, 'Parent Test', ?, ?, 'Class 5', 10,
          ?, 'Mon, Wed, Fri', '5:00 PM - 6:00 PM IST', 'PAID'
        )
      `).run(leadId, leadName, leadPhone, leadEmail, testCourseName);

      const activation = activateEnrollment({
        leadId,
        courseId: testCourseId,
        amountInr: 14999,
        paymentMethod: 'UPI',
        transactionRef: paymentRef,
        preferredDays: 'Mon, Wed, Fri',
        preferredTime: '5:00 PM - 6:00 PM IST',
        gradeGroup: 'Class 4-7',
      });

      assert(activation.success, `Enrollment #${i} succeeded`, `Student: ${leadName} -> Batch: ${activation.placement.batchName} (${activation.placement.batchCode})`);
      if (activation.studentId) studentIds.push(activation.studentId);
    }

    // Verify Batches created for testCourseId
    const batchesForCourse = db.prepare(`
      SELECT b.id, b.batch_name, b.code, b.status, b.teacher_id,
             (SELECT COUNT(*) FROM batch_memberships bm WHERE bm.batch_id = b.id AND bm.status = 'ACTIVE') as live_active_count
      FROM batches b
      WHERE b.course_id = ?
      ORDER BY b.created_at ASC
    `).all(testCourseId) as any[];

    console.log('\n📊 Batch Distribution Results:');
    batchesForCourse.forEach((b, idx) => {
      console.log(`   Batch #${idx + 1}: ${b.batch_name} (${b.code}) | Teacher: ${b.teacher_id} | Status: ${b.status} | Active Students: ${b.live_active_count}/8`);
    });

    assert(batchesForCourse.length === 3, 'Exactly 3 batches created for 17 students', `Created ${batchesForCourse.length} batches`);
    assert(batchesForCourse[0].live_active_count === 8, 'Batch 1 is fully filled to hard cap (8/8)');
    assert(batchesForCourse[1].live_active_count === 8, 'Batch 2 is fully filled to hard cap (8/8)');
    assert(batchesForCourse[2].live_active_count === 1, 'Batch 3 contains the 17th student overflow (1/8)');

    // ----------------------------------------------------------------
    // TEST 2: Automated Schedule & Session Generation (36 Sessions)
    // ----------------------------------------------------------------
    console.log('\n📅 Step 3: Verifying Automated 36-Session Curriculum Generation...');
    const batch1Sessions = db.prepare(`
      SELECT id, session_number, topic, date, start_time, status, meeting_link
      FROM class_sessions
      WHERE batch_id = ?
      ORDER BY session_number ASC
    `).all(batchesForCourse[0].id) as any[];

    assert(batch1Sessions.length === 36, 'Batch 1 has exactly 36 generated sessions', `Found ${batch1Sessions.length} sessions`);
    assert(batch1Sessions[0].session_number === 1, 'First session is Session 1');
    assert(batch1Sessions[35].session_number === 36, 'Last session is Session 36');
    assert(batch1Sessions[0].meeting_link !== null && batch1Sessions[0].meeting_link.length > 5, 'Session 1 has valid meeting link assigned');

    // ----------------------------------------------------------------
    // TEST 3: Teacher Assignment Workload & Conflict Rules
    // ----------------------------------------------------------------
    console.log('\n👨‍🏫 Step 4: Verifying Teacher Workload Distribution...');
    assert(batchesForCourse[0].teacher_id !== null, 'Batch 1 assigned a qualified teacher');
    assert(batchesForCourse[1].teacher_id !== null, 'Batch 2 assigned a qualified teacher');

    // ----------------------------------------------------------------
    // TEST 4: Payment & Placement Idempotency
    // ----------------------------------------------------------------
    console.log('\n🔒 Step 5: Testing Payment & Placement Idempotency (Duplicate Webhook)...');
    const existingPayment = db.prepare('SELECT id FROM payments WHERE gateway_payment_id = ?').get(`PAY_AUTO_${timestamp}_1`) as any;
    
    const duplicateActivation = activateEnrollment({
      paymentId: existingPayment.id,
      courseId: testCourseId,
      amountInr: 14999,
      paymentMethod: 'UPI',
      transactionRef: `PAY_AUTO_${timestamp}_1`,
    });

    assert(duplicateActivation.success, 'Duplicate payment returns existing enrollment (Idempotent)');
    assert(duplicateActivation.placement.batchId === batchesForCourse[0].id, 'Student remained in the same original batch');

    const totalMembershipsForStudent1 = db.prepare(`
      SELECT COUNT(*) as cnt FROM batch_memberships
      WHERE student_id = ? AND status = 'ACTIVE'
    `).get(studentIds[0]) as any;
    assert(totalMembershipsForStudent1.cnt === 1, 'Student 1 has exactly 1 active membership (no duplicate created)');

    // ----------------------------------------------------------------
    // TEST 5: Student Batch Transfer with Historical Membership Preservation
    // ----------------------------------------------------------------
    console.log('\n🔄 Step 6: Testing Student Transfer with History Preservation...');
    const student17Id = studentIds[16];
    const sourceBatchId = batchesForCourse[2].id; // Batch 3 (has 1 student)
    
    // Create an open batch 4 for transferring to
    const leadExtraId = `lead_extra_${timestamp}`;
    db.prepare(`
      INSERT INTO leads (
        id, student_name, parent_name, mobile_number, email, student_class,
        interest_area, preferred_days, preferred_time, status
      ) VALUES (
        ?, 'Extra Student', 'Parent Extra', '+919888877777', ?, 'Class 5',
        ?, 'Tue, Thu, Sat', '6:00 PM - 7:00 PM IST', 'PAID'
      )
    `).run(leadExtraId, `extra.${timestamp}@upspeaq.com`, testCourseName);

    const extraActivation = activateEnrollment({
      leadId: leadExtraId,
      courseId: testCourseId,
      preferredDays: 'Tue, Thu, Sat',
      preferredTime: '6:00 PM - 7:00 PM IST',
    });

    const destBatchId = extraActivation.placement.batchId!;
    const transferResult = transferStudent({
      studentId: student17Id,
      fromBatchId: sourceBatchId,
      toBatchId: destBatchId,
      reason: 'Schedule conflict with school exam',
      actorName: 'Admin Kashif',
      actorId: 'usr_admin',
    });

    assert(transferResult.success, 'Student transfer completed successfully');

    // Check old membership status
    const oldMembership = db.prepare(`
      SELECT status, reason FROM batch_memberships
      WHERE student_id = ? AND batch_id = ?
    `).get(student17Id, sourceBatchId) as any;
    assert(oldMembership?.status === 'TRANSFERRED', 'Source batch membership marked as TRANSFERRED (Historical record preserved)');

    // Check new membership status
    const newMembership = db.prepare(`
      SELECT status FROM batch_memberships
      WHERE student_id = ? AND batch_id = ?
    `).get(student17Id, destBatchId) as any;
    assert(newMembership?.status === 'ACTIVE', 'Destination batch membership marked as ACTIVE');

    // ----------------------------------------------------------------
    // TEST 6: Catch-Up Threshold Policy
    // ----------------------------------------------------------------
    console.log('\n⏳ Step 7: Testing Catch-Up Session Limit Policy (>2 Completed Sessions)...');
    // Mark first 3 sessions in Batch 1 as COMPLETED
    db.prepare(`
      UPDATE class_sessions
      SET status = 'COMPLETED'
      WHERE batch_id = ? AND session_number <= 3
    `).run(batchesForCourse[0].id);

    const leadCatchupId = `lead_catchup_${timestamp}`;
    db.prepare(`
      INSERT INTO leads (
        id, student_name, parent_name, mobile_number, email, student_class,
        interest_area, preferred_days, preferred_time, status
      ) VALUES (
        ?, 'Catchup Student', 'Parent Catchup', '+919999988888', ?, 'Class 5',
        ?, 'Mon, Wed, Fri', '5:00 PM - 6:00 PM IST', 'PAID'
      )
    `).run(leadCatchupId, `catchup.${timestamp}@upspeaq.com`, testCourseName);

    const catchupActivation = activateEnrollment({
      leadId: leadCatchupId,
      courseId: testCourseId,
      preferredDays: 'Mon, Wed, Fri',
      preferredTime: '5:00 PM - 6:00 PM IST',
    });

    assert(catchupActivation.placement.batchId !== batchesForCourse[0].id, 'Student not placed in batch with > 2 completed sessions');
    console.log(`   Placed in fresh/compliant batch: ${catchupActivation.placement.batchName} (${catchupActivation.placement.batchCode})`);

    // ----------------------------------------------------------------
    // TEST 7: Security & Strict Data Isolation
    // ----------------------------------------------------------------
    console.log('\n🛡️ Step 8: Testing Strict Student & Teacher Portal Isolation...');
    const enrolledStudent1 = studentIds[0];
    const enrolledStudent17 = studentIds[16];

    // Student 1 should only see Batch 1 sessions
    const student1Batches = db.prepare(`
      SELECT DISTINCT b.id, b.batch_name FROM batches b
      JOIN batch_memberships bm ON bm.batch_id = b.id
      WHERE bm.student_id = ? AND bm.status = 'ACTIVE'
    `).all(enrolledStudent1) as any[];

    assert(student1Batches.length === 1, 'Student 1 only has access to their assigned batch');
    assert(student1Batches[0].id === batchesForCourse[0].id, 'Student 1 assigned batch matches Batch 1');

    // Student 17 (transferred) should only see destination Batch, not source Batch
    const student17Batches = db.prepare(`
      SELECT DISTINCT b.id, b.batch_name FROM batches b
      JOIN batch_memberships bm ON bm.batch_id = b.id
      WHERE bm.student_id = ? AND bm.status = 'ACTIVE'
    `).all(enrolledStudent17) as any[];

    assert(student17Batches.length === 1, 'Transferred Student 17 only has access to active target batch');
    assert(student17Batches[0].id === destBatchId, 'Student 17 assigned batch matches destination batch');

    // Teacher Alpha should only see batches assigned to Teacher Alpha (within workload limit)
    const teacherABatches = db.prepare(`
      SELECT id, batch_name FROM batches WHERE teacher_id = ?
    `).all(teacherAId) as any[];
    assert(teacherABatches.length <= 2, 'Teacher Alpha concurrent batches within workload limit (<= 2)');
    assert(teacherABatches.some((b) => b.id === batchesForCourse[0].id), 'Teacher Alpha assigned to Batch 1');

    // ----------------------------------------------------------------
    // SUMMARY
    // ----------------------------------------------------------------
    console.log('\n======================================================');
    console.log(`✨ ALL ${results.length} INTEGRATION TESTS PASSED!`);
    console.log('======================================================\n');
  } catch (err: any) {
    console.error('\n❌ Test Suite Failed with Error:', err);
    process.exit(1);
  }
}

runAutomationTests().then(() => {
  process.exit(0);
});

