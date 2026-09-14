import { Router, Response } from 'express';
import { db } from '../db/schema.js';
import { verifyToken, AuthenticatedRequest } from '../middleware/auth.js';

export const statsRouter = Router();

// GET /api/stats/dashboard (Operational Dashboard Metrics)
statsRouter.get(['/', '/dashboard'], verifyToken, (req: AuthenticatedRequest, res: Response) => {
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

    // Source breakdown
    const sourceBreakdown = db.prepare(`
      SELECT lead_source, COUNT(*) as count 
      FROM leads 
      GROUP BY lead_source 
      ORDER BY count DESC
    `).all();

    // Status breakdown
    const statusBreakdown = db.prepare(`
      SELECT status, COUNT(*) as count 
      FROM leads 
      GROUP BY status
    `).all();

    // Recent activities
    const recentActivities = db.prepare(`
      SELECT la.*, l.student_name, l.parent_name
      FROM lead_activities la
      JOIN leads l ON la.lead_id = l.id
      ORDER BY la.created_at DESC
      LIMIT 10
    `).all();

    // Upcoming Demos
    const upcomingDemos = db.prepare(`
      SELECT ds.*, t.name as teacher_name,
        (SELECT COUNT(*) FROM demo_attendees da WHERE da.demo_id = ds.id) as attendee_count
      FROM demo_sessions ds
      LEFT JOIN teachers t ON ds.teacher_id = t.id
      WHERE ds.status = 'SCHEDULED'
      ORDER BY ds.date ASC, ds.start_time ASC
      LIMIT 5
    `).all();

    // Recent Leads
    const recentLeads = db.prepare(`
      SELECT * FROM leads ORDER BY created_at DESC LIMIT 5
    `).all();

    const batchesCount = (db.prepare("SELECT COUNT(*) as count FROM batches WHERE status = 'ACTIVE'").get() as any)?.count || 0;

    const metricsData = {
      totalLeads,
      newLeads,
      demoScheduled,
      demoCompleted,
      convertedStudents,
      activeStudents,
      pendingPaymentsCount,
      totalRevenue,
      batchesCount,
      // Snake case aliases for frontend views
      total_leads: totalLeads,
      new_leads: newLeads,
      demos_scheduled: demoScheduled,
      demos_attended: demoCompleted,
      paid_conversions: convertedStudents,
      active_students: activeStudents,
      pending_payments_count: pendingPaymentsCount,
      total_revenue_inr: totalRevenue,
      batches_count: batchesCount,
    };

    return res.json({
      metrics: metricsData,
      stats: metricsData,
      sourceBreakdown,
      statusBreakdown,
      recentActivities,
      upcomingDemos,
      recentLeads,
    });
  } catch (error) {
    console.error('Fetch dashboard stats error:', error);
    return res.status(500).json({ error: 'Failed to retrieve dashboard metrics.' });
  }
});
