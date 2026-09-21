import { Router, Response } from 'express';
import { db } from '../db/schema.js';
import { verifyToken, AuthenticatedRequest } from '../middleware/auth.js';

export const statsRouter = Router();

// GET /api/stats/dashboard (Operations Control Center & Exception Metrics)
statsRouter.get(['/', '/dashboard'], verifyToken, (_req: AuthenticatedRequest, res: Response) => {
  try {
    const totalLeads = (db.prepare('SELECT COUNT(*) as count FROM leads').get() as any).count;
    const newLeads = (db.prepare("SELECT COUNT(*) as count FROM leads WHERE status = 'NEW'").get() as any).count;
    const demoScheduled = (db.prepare("SELECT COUNT(*) as count FROM leads WHERE status = 'DEMO_SCHEDULED'").get() as any).count;
    const demoCompleted = (db.prepare("SELECT COUNT(*) as count FROM leads WHERE status IN ('DEMO_COMPLETED', 'FOLLOW_UP')").get() as any).count;
    const convertedStudents = (db.prepare("SELECT COUNT(*) as count FROM leads WHERE status = 'CONVERTED'").get() as any).count;
    const activeStudents = (db.prepare("SELECT COUNT(*) as count FROM students WHERE status = 'ACTIVE'").get() as any).count;
    const pendingPaymentsCount = (db.prepare("SELECT COUNT(*) as count FROM payments WHERE status = 'PENDING'").get() as any).count;

    const revenueResult = db.prepare("SELECT SUM(amount_inr) as sum FROM payments WHERE status = 'PAID'").get() as any;
    const totalRevenue = revenueResult?.sum || 0;

    // Batches metrics
    const totalBatches = (db.prepare('SELECT COUNT(*) as count FROM batches').get() as any)?.count || 0;
    const activeBatches = (db.prepare("SELECT COUNT(*) as count FROM batches WHERE status IN ('OPEN', 'UPCOMING', 'ACTIVE', 'FULL')").get() as any)?.count || 0;
    const fullBatches = (db.prepare("SELECT COUNT(*) as count FROM batches WHERE status = 'FULL'").get() as any)?.count || 0;
    const classesToday = (db.prepare("SELECT COUNT(*) as count FROM class_sessions WHERE date = DATE('now')").get() as any)?.count || 0;

    // Exception Center metrics
    const batchesNeedsTeacher = db.prepare(`
      SELECT b.*, c.name as course_name,
        (SELECT COUNT(*) FROM batch_memberships bm WHERE bm.batch_id = b.id AND bm.status = 'ACTIVE') as enrolled_count
      FROM batches b
      JOIN courses c ON b.course_id = c.id
      WHERE b.status = 'NEEDS_TEACHER' OR b.teacher_id IS NULL
    `).all();

    const batchesMissingMeet = db.prepare(`
      SELECT b.*, c.name as course_name, t.name as teacher_name
      FROM batches b
      JOIN courses c ON b.course_id = c.id
      LEFT JOIN teachers t ON b.teacher_id = t.id
      WHERE (b.meeting_link IS NULL OR b.meeting_link = '') AND b.status IN ('OPEN', 'UPCOMING', 'ACTIVE', 'FULL')
    `).all();

    const studentsWaitingPlacement = db.prepare(`
      SELECT e.*, s.name as student_name, s.class_grade, s.parent_phone, c.name as course_name
      FROM enrollments e
      JOIN students s ON e.student_id = s.id
      JOIN courses c ON e.course_id = c.id
      WHERE e.status IN ('WAITING_FOR_BATCH', 'WAITING_FOR_TEACHER')
    `).all();

    const pendingHwReviewsCount = (db.prepare("SELECT COUNT(*) as count FROM homework_submissions WHERE status = 'SUBMITTED'").get() as any)?.count || 0;

    // Source breakdown
    const sourceBreakdown = db.prepare(`
      SELECT lead_source, COUNT(*) as count 
      FROM leads 
      GROUP BY lead_source 
      ORDER BY count DESC
    `).all();

    // Recent automated placement activities
    const recentPlacements = db.prepare(`
      SELECT pl.*, s.name as student_name, c.name as course_name, b.batch_name, t.name as teacher_name
      FROM placement_logs pl
      JOIN students s ON pl.student_id = s.id
      JOIN courses c ON pl.course_id = c.id
      LEFT JOIN batches b ON pl.batch_id = b.id
      LEFT JOIN teachers t ON pl.teacher_id = t.id
      ORDER BY pl.created_at DESC
      LIMIT 10
    `).all();

    // Recent system audit logs
    const recentAuditLogs = db.prepare(`
      SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 15
    `).all();

    const metricsData = {
      totalLeads,
      newLeads,
      demoScheduled,
      demoCompleted,
      convertedStudents,
      activeStudents,
      pendingPaymentsCount,
      totalRevenue,
      totalBatches,
      activeBatches,
      fullBatches,
      classesToday,
      pendingHwReviewsCount,
      // Exception items count
      needsAttentionCount: batchesNeedsTeacher.length + batchesMissingMeet.length + studentsWaitingPlacement.length + pendingPaymentsCount,
      // Snake case aliases for frontend
      total_leads: totalLeads,
      new_leads: newLeads,
      demos_scheduled: demoScheduled,
      demos_attended: demoCompleted,
      paid_conversions: convertedStudents,
      active_students: activeStudents,
      pending_payments_count: pendingPaymentsCount,
      total_revenue_inr: totalRevenue,
      batches_count: activeBatches,
      classes_today: classesToday,
    };

    return res.json({
      metrics: metricsData,
      stats: metricsData,
      exceptions: {
        batchesNeedsTeacher,
        batchesMissingMeet,
        studentsWaitingPlacement,
        pendingPaymentsCount,
        pendingHwReviewsCount,
      },
      sourceBreakdown,
      recentPlacements,
      recentAuditLogs,
    });
  } catch (error) {
    console.error('Fetch dashboard stats error:', error);
    return res.status(500).json({ error: 'Failed to retrieve dashboard metrics.' });
  }
});
