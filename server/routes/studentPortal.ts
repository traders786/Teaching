import { Router, Response } from 'express';
import multer from 'multer';
import { db } from '../db/schema.js';
import { verifyToken, requireRole, AuthenticatedRequest } from '../middleware/auth.js';
import { uploadBufferToCloudinary } from '../services/cloudinary.js';
import { activateEnrollment } from '../services/enrollmentService.js';

export const studentPortalRouter = Router();

// Configure Multer memory storage (Max 10MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowedMimes = [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain',
      'audio/mpeg',
      'audio/mp4',
      'audio/x-m4a',
      'audio/wav',
      'audio/webm',
    ];

    if (allowedMimes.includes(file.mimetype) || file.originalname.match(/\.(pdf|png|jpg|jpeg|webp|docx|doc|txt|mp3|m4a|wav|webm)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('Only safe speech recordings, documents & images (.mp3, .m4a, .pdf, .png, .jpg, .docx) up to 10MB are supported.'));
    }
  },
});

// Middleware: require STUDENT, PARENT, or ADMIN role
studentPortalRouter.use(verifyToken);
studentPortalRouter.use(requireRole(['STUDENT', 'PARENT', 'ADMIN', 'SUPER_ADMIN']));

// Secure Helper: strictly resolves authenticated student ID without unsafe mock fallbacks
function resolveStudentId(req: AuthenticatedRequest): string | null {
  if (req.user?.role === 'ADMIN' || req.user?.role === 'SUPER_ADMIN') {
    if (req.query.student_id) {
      return String(req.query.student_id);
    }
    if (req.user.student_id) {
      return req.user.student_id;
    }
  }

  if (req.user?.student_id) {
    return req.user.student_id;
  }

  // Look up user in database if token had no student_id
  if (req.user?.id) {
    const user = db.prepare('SELECT student_id FROM users WHERE id = ?').get(req.user.id) as any;
    if (user?.student_id) {
      return user.student_id;
    }
  }

  return null;
}

// GET /api/student/dashboard
studentPortalRouter.get('/dashboard', (req: AuthenticatedRequest, res: Response) => {
  try {
    const studentId = resolveStudentId(req);
    if (!studentId) {
      return res.status(403).json({ error: 'No student profile linked to your authenticated account.' });
    }

    const student = db.prepare(`
      SELECT s.*, 
        b.id as batch_id, b.batch_name, b.code as batch_code, b.schedule_days, b.schedule_time, b.meeting_link, b.status as batch_status,
        c.id as course_id, c.name as course_name, c.total_classes,
        t.name as teacher_name, t.photo_url as teacher_photo, t.expertise as teacher_expertise,
        e.id as enrollment_id, e.status as enrollment_status, e.start_date, e.end_date
      FROM students s
      LEFT JOIN batch_memberships bm ON bm.student_id = s.id AND bm.status = 'ACTIVE'
      LEFT JOIN batches b ON b.id = bm.batch_id
      LEFT JOIN enrollments e ON e.student_id = s.id AND e.status = 'ACTIVE'
      LEFT JOIN courses c ON c.id = COALESCE(b.course_id, e.course_id)
      LEFT JOIN teachers t ON t.id = b.teacher_id
      WHERE s.id = ?
    `).get(studentId) as any;

    if (!student) {
      return res.status(404).json({ error: 'Student record not found.' });
    }

    // 1. Next Upcoming Class
    let nextClass: any = null;
    if (student.batch_id) {
      nextClass = db.prepare(`
        SELECT cs.*, b.batch_name,
          COALESCE(NULLIF(cs.meeting_link, ''), NULLIF(b.meeting_link, '')) as meeting_link,
          t.name as teacher_name, t.photo_url as teacher_photo
        FROM class_sessions cs
        JOIN batches b ON b.id = cs.batch_id
        LEFT JOIN teachers t ON t.id = cs.teacher_id
        WHERE cs.batch_id = ? AND cs.status = 'UPCOMING'
        ORDER BY cs.date ASC, cs.start_time ASC
        LIMIT 1
      `).get(student.batch_id) as any;
    }

    // 2. Pending Homework (batch-level or specifically targeted to this student)
    let pendingHomework: any[] = [];
    if (student.batch_id) {
      pendingHomework = db.prepare(`
        SELECT h.*, hs.status as submission_status, hs.submitted_at, hs.score_rating, hs.mentor_feedback
        FROM homework h
        LEFT JOIN homework_submissions hs ON hs.homework_id = h.id AND hs.student_id = ?
        WHERE h.batch_id = ?
          AND (h.target_student_id IS NULL OR h.target_student_id = ?)
          AND h.status = 'ACTIVE'
          AND (hs.status IS NULL OR hs.status = 'RESUBMIT')
        ORDER BY h.due_date ASC
        LIMIT 5
      `).all(studentId, student.batch_id, studentId);
    }

    // 3. Recent Class Recordings for Student's Batch
    let recentRecordings: any[] = [];
    if (student.batch_id) {
      recentRecordings = db.prepare(`
        SELECT r.*, t.name as teacher_name
        FROM recordings r
        LEFT JOIN teachers t ON r.teacher_id = t.id
        WHERE r.batch_id = ? AND r.status = 'AVAILABLE'
        ORDER BY r.recorded_date DESC
        LIMIT 3
      `).all(student.batch_id);
    }

    // 4. Progress Metrics
    const totalClasses = student.total_classes || 36;
    let completedClasses = 0;
    let attendedClasses = 0;

    if (student.batch_id) {
      completedClasses = (db.prepare(`
        SELECT COUNT(*) as count FROM class_sessions WHERE batch_id = ? AND status = 'COMPLETED'
      `).get(student.batch_id) as any)?.count || 0;

      attendedClasses = (db.prepare(`
        SELECT COUNT(*) as count FROM attendance
        WHERE student_id = ? AND batch_id = ? AND status IN ('PRESENT', 'LATE')
      `).get(studentId, student.batch_id) as any)?.count || 0;
    }

    const totalHomeworkSubmitted = (db.prepare(`
      SELECT COUNT(*) as count FROM homework_submissions
      WHERE student_id = ? AND status IN ('SUBMITTED', 'REVIEWED')
    `).get(studentId) as any)?.count || 0;

    const progressPercentage = totalClasses > 0 ? Math.round((completedClasses / totalClasses) * 100) : 0;
    const attendancePercentage = completedClasses > 0 ? Math.round((attendedClasses / completedClasses) * 100) : 100;

    // 5. Upcoming Demo (for newly booked / non-enrolled students)
    const upcomingDemo = db.prepare(`
      SELECT ds.*, t.name as teacher_name, t.photo_url as teacher_photo,
        COALESCE(NULLIF(ds.meeting_link, ''), NULLIF(t.google_meet_link, '')) as effective_meeting_link,
        da.attendance_status, da.outcome
      FROM demo_sessions ds
      JOIN demo_attendees da ON da.demo_id = ds.id
      LEFT JOIN teachers t ON t.id = ds.teacher_id
      WHERE (da.lead_id = ? OR da.student_name = ? OR da.parent_phone = ?)
        AND ds.status IN ('NEW', 'ASSIGNED', 'SCHEDULED', 'IN_PROGRESS')
      ORDER BY ds.date ASC, ds.start_time ASC
      LIMIT 1
    `).get(student.lead_id || '', student.name || '', student.parent_phone || '') as any;

    // 6. Available Courses Catalog
    const coursesRaw = db.prepare(`
      SELECT c.*,
        (SELECT COUNT(*) FROM batches b WHERE b.course_id = c.id AND b.status IN ('OPEN', 'ACTIVE')) as active_batches_count
      FROM courses c
      WHERE c.status = 'ACTIVE'
      ORDER BY c.is_flagship DESC, c.price_inr ASC
    `).all() as any[];

    const availableCourses = coursesRaw.map((c) => {
      let gradeRange = 'Class 4 - 12';
      if (c.grade_groups_json) {
        try {
          const parsed = JSON.parse(c.grade_groups_json);
          if (Array.isArray(parsed) && parsed.length > 0) {
            gradeRange = parsed.join(', ');
          }
        } catch (e) {}
      }
      return {
        ...c,
        grade_range: gradeRange,
      };
    });

    // 7. Branding Contact Info (Admissions WhatsApp & Phone)
    const settings = db.prepare("SELECT value_json FROM settings WHERE key = 'branding'").get() as any;
    let branding = {
      contactPhone: '+91 7004132088',
      supportWhatsapp: '+91 7004132088',
      contactEmail: 'upspeaqofficial@gmail.com',
      brandName: 'upspeaq',
    };
    if (settings && settings.value_json) {
      try {
        branding = { ...branding, ...JSON.parse(settings.value_json) };
      } catch (e) {}
    }

    return res.json({
      student,
      nextClass,
      upcomingDemo,
      availableCourses,
      branding,
      pendingHomework,
      recentRecordings,
      progress: {
        totalClasses,
        completedClasses,
        attendedClasses,
        totalHomeworkSubmitted,
        progressPercentage,
        attendancePercentage,
      },
    });
  } catch (error: any) {
    console.error('Fetch student dashboard error:', error);
    return res.status(500).json({ error: 'Failed to retrieve student dashboard.' });
  }
});

// POST /api/student/enroll-request (Student sends interest to Admin for direct enrollment)
studentPortalRouter.post('/enroll-request', (req: AuthenticatedRequest, res: Response) => {
  try {
    const studentId = resolveStudentId(req);
    const { courseId, notes, studentName, courseName, parentPhone } = req.body;

    const notifId = 'notif_' + Date.now();
    try {
      db.prepare(`
        INSERT INTO in_app_notifications (id, role, title, message, link, type)
        VALUES (?, 'ADMIN', ?, ?, '/admin/leads', 'ENROLLMENT_REQUEST')
      `).run(
        notifId,
        `New Enrollment Request: ${studentName || 'Student'}`,
        `Student "${studentName || studentId}" requested enrollment in "${courseName || courseId}". Parent Phone: ${parentPhone || 'N/A'}. Notes: ${notes || 'Direct request from dashboard'}`
      );
    } catch (e) {}

    return res.json({ success: true, message: 'Your enrollment inquiry was sent to our Admissions Director. You can also connect on WhatsApp directly!' });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to record enrollment request.' });
  }
});

// POST /api/student/direct-enroll (Instant direct enrollment activation)
studentPortalRouter.post('/direct-enroll', (req: AuthenticatedRequest, res: Response) => {
  try {
    const studentId = resolveStudentId(req);
    if (!studentId) {
      return res.status(403).json({ error: 'Student account not found.' });
    }
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ error: 'Course ID is required.' });
    }

    const student = db.prepare('SELECT * FROM students WHERE id = ?').get(studentId) as any;
    if (!student) {
      return res.status(404).json({ error: 'Student not found in database.' });
    }

    const result = activateEnrollment({
      studentId: student.id,
      leadId: student.lead_id || undefined,
      courseId,
      paymentMethod: 'DIRECT_ADMIN_CONFIRMED',
      isManualAdmin: true,
      actorName: 'Student Dashboard Direct Activation',
    });

    return res.json({
      success: true,
      message: 'Enrollment confirmed! Your cohort and speech schedule are now active.',
      result,
    });
  } catch (error: any) {
    console.error('Direct enrollment error:', error);
    return res.status(500).json({ error: error.message || 'Failed to activate direct enrollment.' });
  }
});

// GET /api/student/classes (Upcoming & Past Sessions for Student's Batch)
studentPortalRouter.get('/classes', (req: AuthenticatedRequest, res: Response) => {
  try {
    const studentId = resolveStudentId(req);
    if (!studentId) {
      return res.status(403).json({ error: 'No student profile linked.' });
    }

    const membership = db.prepare(`
      SELECT bm.batch_id, b.batch_name, b.schedule_days, b.schedule_time, b.meeting_link as batch_meet_link
      FROM batch_memberships bm
      JOIN batches b ON bm.batch_id = b.id
      WHERE bm.student_id = ? AND bm.status = 'ACTIVE'
    `).get(studentId) as any;

    if (!membership) {
      return res.json({ upcomingClasses: [], pastClasses: [], batch: null });
    }

    const upcomingClasses = db.prepare(`
      SELECT cs.*, b.batch_name,
        COALESCE(NULLIF(cs.meeting_link, ''), NULLIF(b.meeting_link, '')) as meeting_link,
        t.name as teacher_name, t.photo_url as teacher_photo
      FROM class_sessions cs
      JOIN batches b ON b.id = cs.batch_id
      LEFT JOIN teachers t ON t.id = cs.teacher_id
      WHERE cs.batch_id = ? AND cs.status IN ('UPCOMING', 'LIVE')
      ORDER BY cs.date ASC, cs.start_time ASC
    `).all(membership.batch_id);

    const pastClasses = db.prepare(`
      SELECT cs.*, b.batch_name, t.name as teacher_name,
        a.status as my_attendance, a.notes as attendance_notes,
        r.recording_url, r.title as recording_title
      FROM class_sessions cs
      JOIN batches b ON b.id = cs.batch_id
      LEFT JOIN teachers t ON t.id = cs.teacher_id
      LEFT JOIN attendance a ON a.session_id = cs.id AND a.student_id = ?
      LEFT JOIN recordings r ON r.session_id = cs.id
      WHERE cs.batch_id = ? AND (cs.status = 'COMPLETED' OR cs.date < DATE('now'))
      ORDER BY cs.date DESC, cs.start_time DESC
    `).all(studentId, membership.batch_id);

    return res.json({
      batch: membership,
      upcomingClasses,
      pastClasses,
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to retrieve class schedule.' });
  }
});

// GET /api/student/homework (List all homework for student's batch/individual)
studentPortalRouter.get('/homework', (req: AuthenticatedRequest, res: Response) => {
  try {
    const studentId = resolveStudentId(req);
    if (!studentId) {
      return res.status(403).json({ error: 'No student profile linked.' });
    }

    const membership = db.prepare(`
      SELECT batch_id FROM batch_memberships WHERE student_id = ? AND status = 'ACTIVE'
    `).get(studentId) as any;

    if (!membership) {
      return res.json({ pending: [], submitted: [], reviewed: [] });
    }

    const allHomework = db.prepare(`
      SELECT h.*, cs.topic as session_topic, cs.date as session_date, t.name as teacher_name,
        hs.id as submission_id, hs.submission_type as student_submission_type,
        hs.content_text, hs.media_url, hs.file_name, hs.submitted_at,
        hs.status as submission_status, hs.score_rating, hs.mentor_feedback, hs.reviewed_at
      FROM homework h
      JOIN batches b ON h.batch_id = b.id
      LEFT JOIN class_sessions cs ON h.session_id = cs.id
      LEFT JOIN teachers t ON h.teacher_id = t.id
      LEFT JOIN homework_submissions hs ON hs.homework_id = h.id AND hs.student_id = ?
      WHERE h.batch_id = ?
        AND (h.target_student_id IS NULL OR h.target_student_id = ?)
      ORDER BY h.due_date DESC
    `).all(studentId, membership.batch_id, studentId) as any[];

    const pending = allHomework.filter((h) => !h.submission_status || h.submission_status === 'RESUBMIT');
    const submitted = allHomework.filter((h) => h.submission_status === 'SUBMITTED');
    const reviewed = allHomework.filter((h) => h.submission_status === 'REVIEWED');

    return res.json({ pending, submitted, reviewed });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to retrieve homework assignments.' });
  }
});

// POST /api/student/homework/:id/submit
studentPortalRouter.post('/homework/:id/submit', upload.single('mediaFile'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const studentId = resolveStudentId(req);
    if (!studentId) {
      return res.status(403).json({ error: 'No student profile linked.' });
    }

    const homeworkId = req.params.id;
    const { submissionType = 'AUDIO', contentText, mediaUrl: directMediaUrl } = req.body;

    const hw = db.prepare('SELECT * FROM homework WHERE id = ?').get(homeworkId) as any;
    if (!hw) {
      return res.status(404).json({ error: 'Homework assignment not found.' });
    }

    let finalMediaUrl = directMediaUrl || null;
    let fileName = null;

    if (req.file) {
      fileName = req.file.originalname;
      try {
        const uploadResult = await uploadBufferToCloudinary(
          req.file.buffer,
          `upspeaq_submissions/${studentId}`,
          'auto'
        );
        finalMediaUrl = uploadResult.secure_url;
      } catch (uploadErr) {
        // Fallback to inline data URI if Cloudinary is not configured
        finalMediaUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      }
    }

    const subId = 'sub_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);

    db.prepare(`
      INSERT INTO homework_submissions (
        id, homework_id, student_id, submission_type, content_text, media_url, file_name, submitted_at, status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, 'SUBMITTED')
      ON CONFLICT(homework_id, student_id) DO UPDATE SET
        submission_type = excluded.submission_type,
        content_text = excluded.content_text,
        media_url = excluded.media_url,
        file_name = excluded.file_name,
        submitted_at = CURRENT_TIMESTAMP,
        status = 'SUBMITTED',
        score_rating = NULL,
        mentor_feedback = NULL,
        reviewed_at = NULL
    `).run(subId, homeworkId, studentId, submissionType, contentText || null, finalMediaUrl, fileName);

    // Notify teacher
    if (hw.teacher_id) {
      const teacherUser = db.prepare('SELECT id FROM users WHERE teacher_id = ?').get(hw.teacher_id) as any;
      const student = db.prepare('SELECT name FROM students WHERE id = ?').get(studentId) as any;
      if (teacherUser) {
        db.prepare(`
          INSERT INTO notifications (id, user_id, user_role, title, message, type, link_url)
          VALUES (?, ?, 'TEACHER', 'New Homework Submission', ?, 'HOMEWORK_ASSIGNED', '/teacher/homework')
        `).run(
          'notif_' + Date.now().toString(36),
          teacherUser.id,
          `${student?.name || 'A student'} submitted homework for "${hw.title}".`
        );
      }
    }

    return res.json({
      success: true,
      message: 'Homework submitted successfully!',
      mediaUrl: finalMediaUrl,
    });
  } catch (error: any) {
    console.error('Submit homework error:', error);
    return res.status(500).json({ error: error.message || 'Failed to submit homework.' });
  }
});

// GET /api/student/recordings (Recordings for student's active batch only)
studentPortalRouter.get('/recordings', (req: AuthenticatedRequest, res: Response) => {
  try {
    const studentId = resolveStudentId(req);
    if (!studentId) {
      return res.status(403).json({ error: 'No student profile linked.' });
    }

    const membership = db.prepare(`
      SELECT batch_id FROM batch_memberships WHERE student_id = ? AND status = 'ACTIVE'
    `).get(studentId) as any;

    if (!membership) {
      return res.json({ recordings: [] });
    }

    const recordings = db.prepare(`
      SELECT r.*, t.name as teacher_name, cs.session_number, cs.topic as session_topic
      FROM recordings r
      JOIN batches b ON r.batch_id = b.id
      LEFT JOIN teachers t ON r.teacher_id = t.id
      LEFT JOIN class_sessions cs ON r.session_id = cs.id
      WHERE r.batch_id = ? AND r.status = 'AVAILABLE'
      ORDER BY r.recorded_date DESC
    `).all(membership.batch_id);

    return res.json({ recordings });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to retrieve recordings.' });
  }
});
