import { Router, Request, Response } from 'express';
import { db } from '../db/schema.js';
import { verifyToken, AuthenticatedRequest } from '../middleware/auth.js';

export const leadsRouter = Router();

function normalizePhone(phone: string): string {
  let cleaned = phone.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+91')) {
    return cleaned;
  }
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    return '+' + cleaned;
  }
  if (cleaned.length === 10) {
    return '+91' + cleaned;
  }
  return cleaned;
}

// POST /api/leads/book-demo (Public Endpoint)
leadsRouter.post('/book-demo', (req: Request, res: Response) => {
  try {
    const {
      studentName,
      studentClass,
      studentAge,
      parentName,
      mobileNumber,
      email,
      city,
      interestArea,
      preferredTime,
      notes,
      leadSource = 'DIRECT',
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      utmTerm,
      referralCode,
      consent,
    } = req.body;

    if (!studentName || !studentName.trim()) {
      return res.status(400).json({ error: "Student's name is required." });
    }
    if (!studentClass) {
      return res.status(400).json({ error: "Please select your child's class/grade." });
    }
    if (!parentName || !parentName.trim()) {
      return res.status(400).json({ error: "Parent or guardian's name is required." });
    }
    if (!mobileNumber || !mobileNumber.trim()) {
      return res.status(400).json({ error: "Mobile number is required for demo scheduling." });
    }
    if (!consent) {
      return res.status(400).json({ error: "Please agree to be contacted for scheduling the free demo." });
    }

    const normalizedMobile = normalizePhone(mobileNumber.trim());

    // Duplicate check in past 3 hours to prevent spam/double-click
    const duplicate = db.prepare(`
      SELECT id, created_at FROM leads 
      WHERE mobile_number = ? AND created_at > datetime('now', '-3 hours')
    `).get(normalizedMobile) as any;

    if (duplicate) {
      return res.status(409).json({
        message: 'A demo booking request for this mobile number was recently received. Our admissions counsellor will call you shortly!',
        bookingReference: duplicate.id,
      });
    }

    const leadId = 'lead_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    const parsedAge = studentAge ? parseInt(studentAge, 10) : null;

    db.prepare(`
      INSERT INTO leads (
        id, student_name, student_class, student_age, parent_name, mobile_number, email, city,
        interest_area, preferred_time, notes, lead_source, utm_source, utm_medium, utm_campaign,
        utm_content, utm_term, referral_code, status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'NEW')
    `).run(
      leadId,
      studentName.trim(),
      studentClass.trim(),
      parsedAge,
      parentName.trim(),
      normalizedMobile,
      email ? email.trim().toLowerCase() : null,
      city ? city.trim() : null,
      interestArea || 'Communication Skills',
      preferredTime || 'Evening Slots (5:00 PM - 7:00 PM)',
      notes ? notes.trim() : null,
      leadSource,
      utmSource || null,
      utmMedium || null,
      utmCampaign || null,
      utmContent || null,
      utmTerm || null,
      referralCode ? referralCode.trim() : null
    );

    // Record initial activity
    const activityId = 'act_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    db.prepare(`
      INSERT INTO lead_activities (id, lead_id, action_type, description, actor_name, metadata_json)
      VALUES (?, ?, 'CREATED', ?, 'Parent Website Submission', ?)
    `).run(
      activityId,
      leadId,
      `New demo request booked for student ${studentName.trim()} (${studentClass.trim()}) by parent ${parentName.trim()}.`,
      JSON.stringify({
        leadSource,
        preferredTime: preferredTime || null,
        interestArea: interestArea || null,
      })
    );

    return res.status(201).json({
      success: true,
      message: 'Demo request registered successfully! Our academic coordinator will contact you via WhatsApp/Phone to confirm your preferred slot.',
      bookingReference: leadId,
      studentName: studentName.trim(),
    });
  } catch (error: any) {
    console.error('Lead booking error:', error);
    return res.status(500).json({ error: 'Failed to process demo booking. Please check the details and try again.' });
  }
});

// GET /api/leads (Admin - Paginated & Filtered)
leadsRouter.get('/', verifyToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, source, search, sort = 'created_at_desc', page = '1', limit = '20' } = req.query;

    let query = 'SELECT * FROM leads WHERE 1=1';
    const params: any[] = [];

    if (status && status !== 'ALL') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (source && source !== 'ALL') {
      query += ' AND lead_source = ?';
      params.push(source);
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      const term = `%${search.trim()}%`;
      query += ' AND (student_name LIKE ? OR parent_name LIKE ? OR mobile_number LIKE ? OR city LIKE ? OR id LIKE ?)';
      params.push(term, term, term, term, term);
    }

    // Sort order
    if (sort === 'created_at_asc') {
      query += ' ORDER BY created_at ASC';
    } else if (sort === 'name_asc') {
      query += ' ORDER BY student_name ASC';
    } else {
      query += ' ORDER BY created_at DESC';
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 20));
    const offset = (pageNum - 1) * limitNum;

    // Total count query
    let countQuery = 'SELECT COUNT(*) as total FROM leads WHERE 1=1';
    const countParams: any[] = [];

    if (status && status !== 'ALL') {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }
    if (source && source !== 'ALL') {
      countQuery += ' AND lead_source = ?';
      countParams.push(source);
    }
    if (search && typeof search === 'string' && search.trim() !== '') {
      const term = `%${search.trim()}%`;
      countQuery += ' AND (student_name LIKE ? OR parent_name LIKE ? OR mobile_number LIKE ? OR city LIKE ? OR id LIKE ?)';
      countParams.push(term, term, term, term, term);
    }

    const countResult = db.prepare(countQuery).get(...countParams) as any;
    const total = countResult ? countResult.total : 0;

    query += ' LIMIT ? OFFSET ?';
    params.push(limitNum, offset);

    const leads = db.prepare(query).all(...params);

    return res.json({
      leads,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    console.error('Fetch leads error:', error);
    return res.status(500).json({ error: 'Failed to retrieve leads.' });
  }
});

// GET /api/leads/:id (Admin - Detailed Dossier)
leadsRouter.get('/:id', verifyToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(req.params.id) as any;
    if (!lead) {
      return res.status(404).json({ error: 'Lead record not found.' });
    }

    const activities = db.prepare(`
      SELECT * FROM lead_activities 
      WHERE lead_id = ? 
      ORDER BY created_at DESC
    `).all(req.params.id);

    const demos = db.prepare(`
      SELECT da.*, ds.title as session_title, ds.date, ds.start_time, ds.meeting_link, ds.status as session_status
      FROM demo_attendees da
      JOIN demo_sessions ds ON da.demo_id = ds.id
      WHERE da.lead_id = ?
      ORDER BY ds.date DESC
    `).all(req.params.id);

    const payments = db.prepare(`
      SELECT * FROM payments WHERE lead_id = ? ORDER BY created_at DESC
    `).all(req.params.id);

    const student = db.prepare(`
      SELECT * FROM students WHERE lead_id = ?
    `).get(req.params.id);

    return res.json({
      lead,
      activities,
      demos,
      payments,
      student: student || null,
    });
  } catch (error: any) {
    console.error('Fetch lead detail error:', error);
    return res.status(500).json({ error: 'Failed to retrieve lead details.' });
  }
});

// PATCH /api/leads/:id (Admin - Update Lead Details/Status)
leadsRouter.patch('/:id', verifyToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, notes, assignedTo, interestArea, preferredTime } = req.body;
    const actorName = req.user?.name || 'Administrator';
    const actorId = req.user?.id;

    const currentLead = db.prepare('SELECT * FROM leads WHERE id = ?').get(req.params.id) as any;
    if (!currentLead) {
      return res.status(404).json({ error: 'Lead not found.' });
    }

    const updates: string[] = [];
    const params: any[] = [];

    if (status && status !== currentLead.status) {
      updates.push('status = ?');
      params.push(status);

      // Log status change activity
      const activityId = 'act_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
      db.prepare(`
        INSERT INTO lead_activities (id, lead_id, action_type, description, actor_name, actor_id, metadata_json)
        VALUES (?, ?, 'STATUS_CHANGE', ?, ?, ?, ?)
      `).run(
        activityId,
        req.params.id,
        `Status updated from ${currentLead.status} to ${status}`,
        actorName,
        actorId,
        JSON.stringify({ previousStatus: currentLead.status, newStatus: status })
      );
    }

    if (notes !== undefined) {
      updates.push('notes = ?');
      params.push(notes);
    }
    if (assignedTo !== undefined) {
      updates.push('assigned_to = ?');
      params.push(assignedTo);
    }
    if (interestArea !== undefined) {
      updates.push('interest_area = ?');
      params.push(interestArea);
    }
    if (preferredTime !== undefined) {
      updates.push('preferred_time = ?');
      params.push(preferredTime);
    }

    if (updates.length > 0) {
      updates.push("updated_at = CURRENT_TIMESTAMP");
      params.push(req.params.id);
      db.prepare(`UPDATE leads SET ${updates.join(', ')} WHERE id = ?`).run(...params);
    }

    const updatedLead = db.prepare('SELECT * FROM leads WHERE id = ?').get(req.params.id);
    return res.json({ lead: updatedLead, message: 'Lead updated successfully.' });
  } catch (error: any) {
    console.error('Update lead error:', error);
    return res.status(500).json({ error: 'Failed to update lead.' });
  }
});

// POST /api/leads/:id/activities (Admin - Add Communication / Follow-up Note)
leadsRouter.post('/:id/activities', verifyToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { actionType = 'NOTE_ADDED', description } = req.body;
    if (!description || !description.trim()) {
      return res.status(400).json({ error: 'Description or note content is required.' });
    }

    const actorName = req.user?.name || 'Administrator';
    const actorId = req.user?.id;
    const activityId = 'act_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);

    db.prepare(`
      INSERT INTO lead_activities (id, lead_id, action_type, description, actor_name, actor_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      activityId,
      req.params.id,
      actionType,
      description.trim(),
      actorName,
      actorId
    );

    // Update lead updated_at
    db.prepare("UPDATE leads SET updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(req.params.id);

    const newActivity = db.prepare('SELECT * FROM lead_activities WHERE id = ?').get(activityId);
    return res.status(201).json({ activity: newActivity, message: 'Activity recorded.' });
  } catch (error: any) {
    console.error('Add activity error:', error);
    return res.status(500).json({ error: 'Failed to add activity record.' });
  }
});

// POST /api/leads/:id/convert (Admin - Convert Lead to Enrolled Student)
leadsRouter.post('/:id/convert', verifyToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(req.params.id) as any;
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found.' });
    }

    // Check if already converted
    const existingStudent = db.prepare('SELECT * FROM students WHERE lead_id = ?').get(req.params.id) as any;
    if (existingStudent) {
      return res.status(400).json({ error: 'This lead has already been converted to an enrolled student.', student: existingStudent });
    }

    const studentId = 'std_' + Math.random().toString(36).substring(2, 8) + Date.now().toString(36);
    const { batchId, courseId = 'crs_flagship_1' } = req.body;

    db.prepare(`
      INSERT INTO students (id, lead_id, name, class_grade, age, parent_name, parent_phone, parent_email, city, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE')
    `).run(
      studentId,
      lead.id,
      lead.student_name,
      lead.student_class,
      lead.student_age,
      lead.parent_name,
      lead.mobile_number,
      lead.email,
      lead.city
    );

    // Update lead status
    db.prepare("UPDATE leads SET status = 'CONVERTED', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(lead.id);

    // If batch provided, assign student
    if (batchId) {
      db.prepare(`
        INSERT OR IGNORE INTO batch_students (id, batch_id, student_id, status)
        VALUES (?, ?, ?, 'ACTIVE')
      `).run('bs_' + Date.now(), batchId, studentId);

      // Create enrollment record
      const startDate = new Date().toISOString().split('T')[0];
      const endDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      db.prepare(`
        INSERT INTO enrollments (id, student_id, course_id, batch_id, start_date, end_date, status)
        VALUES (?, ?, ?, ?, ?, ?, 'ACTIVE')
      `).run('enr_' + Date.now(), studentId, courseId, batchId, startDate, endDate);
    }

    // Log activity
    const activityId = 'act_' + Date.now();
    db.prepare(`
      INSERT INTO lead_activities (id, lead_id, action_type, description, actor_name, actor_id)
      VALUES (?, ?, 'STUDENT_CONVERTED', ?, ?, ?)
    `).run(
      activityId,
      lead.id,
      `Lead successfully converted into Student ID: ${studentId}.`,
      req.user?.name || 'Administrator',
      req.user?.id
    );

    const createdStudent = db.prepare('SELECT * FROM students WHERE id = ?').get(studentId);
    return res.status(201).json({
      success: true,
      message: 'Lead converted into student successfully.',
      student: createdStudent,
    });
  } catch (error: any) {
    console.error('Convert lead error:', error);
    return res.status(500).json({ error: 'Failed to convert lead into student.' });
  }
});
