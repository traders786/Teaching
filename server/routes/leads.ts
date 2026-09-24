import { Router, Request, Response } from 'express';
import { db } from '../db/schema.js';
import { verifyToken, signToken, AuthenticatedRequest } from '../middleware/auth.js';
import { createGoogleMeetSession } from '../services/googleMeet.js';
import { sendOtpEmail, sendDemoReceivedEmail, sendTeacherAssignedEmail } from '../services/emailService.js';

export const leadsRouter = Router();

// In-Memory OTP store with TTL
interface OtpEntry {
  code: string;
  email: string;
  mobile: string;
  expiresAt: number;
}
const otpMap = new Map<string, OtpEntry>();

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

/**
 * Automatically creates a Google Meet demo session, places it into the open teacher claim pool,
 * and sends real-time in-app notifications to all active teachers on a first-come-first-serve basis.
 */
export async function autoScheduleLeadDemo(leadId: string) {
  const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(leadId) as any;
  if (!lead) return null;

  // Check if a demo attendee record already exists for this lead
  const existingAttendee = db.prepare('SELECT id FROM demo_attendees WHERE lead_id = ?').get(leadId);
  if (existingAttendee) return null;

  // Default date: tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  let targetDate = tomorrow.toISOString().slice(0, 10);
  let startTime = '17:00';
  let endTime = '17:45';

  const pref = (lead.preferred_time || '').toLowerCase();
  if (pref.includes('7:00 pm') || pref.includes('8:30 pm')) {
    startTime = '19:00';
    endTime = '19:45';
  } else if (pref.includes('saturday') || pref.includes('sunday') || pref.includes('morning') || pref.includes('10:30')) {
    startTime = '10:30';
    endTime = '11:15';
    const d = new Date();
    const day = d.getDay(); // 0 = Sun, 6 = Sat
    if (pref.includes('sunday')) {
      const daysUntilSun = (7 - day) % 7 || 7;
      d.setDate(d.getDate() + daysUntilSun);
      targetDate = d.toISOString().slice(0, 10);
    } else if (pref.includes('saturday')) {
      const daysUntilSat = (6 - day + 7) % 7 || 7;
      d.setDate(d.getDate() + daysUntilSat);
      targetDate = d.toISOString().slice(0, 10);
    }
  }

  const topic = `upspeaq Demo: ${lead.student_name} (${lead.student_class})`;
  const startDateTime = new Date(`${targetDate}T${startTime}:00`);

  const meetSession = await createGoogleMeetSession({
    topic,
    startTime: isNaN(startDateTime.getTime()) ? undefined : startDateTime.toISOString(),
    durationMinutes: 45,
  });

  const demoId = 'demo_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);

  db.prepare(`
    INSERT INTO demo_sessions (
      id, title, date, start_time, end_time, teacher_id, meeting_link,
      capacity, status, notes
    )
    VALUES (?, ?, ?, ?, ?, NULL, ?, 2, 'SCHEDULED', ?)
  `).run(
    demoId,
    topic,
    targetDate,
    startTime,
    endTime,
    meetSession.joinUrl,
    lead.notes || `Evaluation trial for ${lead.student_name} (${lead.student_class})`
  );

  const attendeeId = 'da_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
  db.prepare(`
    INSERT INTO demo_attendees (id, demo_id, lead_id, student_name, parent_phone, attendance_status)
    VALUES (?, ?, ?, ?, ?, 'REGISTERED')
  `).run(attendeeId, demoId, lead.id, lead.student_name, lead.mobile_number);

  db.prepare("UPDATE leads SET status = 'DEMO_SCHEDULED', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(lead.id);

  db.prepare(`
    INSERT INTO lead_activities (id, lead_id, action_type, description, actor_name, metadata_json)
    VALUES (?, ?, 'DEMO_SCHEDULED', ?, 'System Auto-Scheduler', ?)
  `).run(
    'act_' + Date.now().toString(36),
    lead.id,
    `Demo automatically scheduled for ${targetDate} at ${startTime}. Placed in open teacher claim pool. Google Meet: ${meetSession.joinUrl}`,
    JSON.stringify({
      demoId,
      meetingCode: meetSession.meetingCode,
      meetingLink: meetSession.joinUrl,
      provider: 'GOOGLE_MEET',
      teacherId: null,
    })
  );

  // Broadcast to all active teachers
  const activeTeacherUsers = db.prepare(`
    SELECT u.id FROM users u
    JOIN teachers t ON u.teacher_id = t.id
    WHERE t.status = 'ACTIVE' AND u.role = 'TEACHER'
  `).all() as any[];

  for (const u of activeTeacherUsers) {
    db.prepare(`
      INSERT INTO notifications (id, user_id, user_role, title, message, type, link_url)
      VALUES (?, ?, 'TEACHER', '🎯 New Demo Available — Claim It!', ?, 'SCHEDULE_CHANGE', '/teacher/demos')
    `).run(
      'notif_' + Date.now().toString(36) + '_' + u.id,
      u.id,
      `A new demo session for ${lead.student_name} (${lead.student_class}) is available on ${targetDate} at ${startTime}. First teacher to accept it gets assigned!`
    );
  }

  return { demoId, meetSession, targetDate, startTime };
}

/**
 * Auto-schedules any pending unallocated leads so they immediately enter the claim pool
 */
export async function autoSchedulePendingLeads() {
  try {
    const unattachedLeads = db.prepare(`
      SELECT l.* FROM leads l
      WHERE l.status = 'NEW'
        AND NOT EXISTS (SELECT 1 FROM demo_attendees da WHERE da.lead_id = l.id)
    `).all() as any[];

    for (const lead of unattachedLeads) {
      await autoScheduleLeadDemo(lead.id);
    }
  } catch (err) {
    console.error('Auto-schedule pending leads error:', err);
  }
}

// Automatically sync pending leads on startup
setTimeout(() => {
  autoSchedulePendingLeads();
}, 1000);

// ==========================================
// 🚀 BHANZU-STYLE LIVE BOOKING FUNNEL ROUTES
// ==========================================

// POST /api/leads/send-otp (Dispatches 4-digit code via Resend)
leadsRouter.post('/send-otp', async (req: Request, res: Response) => {
  try {
    const { email, mobileNumber, studentName } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email address is required to receive verification code.' });
    }

    // Generate random 4-digit OTP (e.g. 4829)
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const cleanMobile = mobileNumber ? normalizePhone(mobileNumber) : '';

    // Store in OTP map with 10-minute validity
    const expiresAt = Date.now() + 10 * 60 * 1000;
    otpMap.set(email.toLowerCase().trim(), { code: otp, email: email.toLowerCase().trim(), mobile: cleanMobile, expiresAt });
    if (cleanMobile) {
      otpMap.set(cleanMobile, { code: otp, email: email.toLowerCase().trim(), mobile: cleanMobile, expiresAt });
    }

    // Dispatch live email via Gmail SMTP / Resend
    await sendOtpEmail({
      to: email.trim(),
      otp,
      studentName: studentName || 'Student',
    });

    return res.json({
      success: true,
      message: `Verification code sent to ${email}`,
    });
  } catch (error: any) {
    console.error('Send OTP error:', error);
    return res.status(500).json({ error: 'Failed to dispatch verification code.' });
  }
});

// POST /api/leads/verify-otp
leadsRouter.post('/verify-otp', async (req: Request, res: Response) => {
  try {
    const { email, mobileNumber, otp } = req.body;

    if (!otp || otp.toString().length !== 4) {
      return res.status(400).json({ error: 'Please enter a valid 4-digit verification code.' });
    }

    const emailKey = email ? email.toLowerCase().trim() : '';
    const mobileKey = mobileNumber ? normalizePhone(mobileNumber) : '';

    const entry = (emailKey && otpMap.get(emailKey)) || (mobileKey && otpMap.get(mobileKey));

    if (!entry) {
      return res.status(400).json({ error: 'Verification code expired or not found. Please request a new code.' });
    }

    if (Date.now() > entry.expiresAt) {
      otpMap.delete(emailKey);
      if (mobileKey) otpMap.delete(mobileKey);
      return res.status(400).json({ error: 'Verification code has expired. Please request a new code.' });
    }

    if (entry.code !== otp.toString().trim()) {
      return res.status(400).json({ error: 'Invalid verification code. Please check and try again.' });
    }

    // Verified successfully
    return res.json({
      success: true,
      verified: true,
      message: 'Mobile and email verified successfully!',
    });
  } catch (error: any) {
    console.error('Verify OTP error:', error);
    return res.status(500).json({ error: 'Verification check failed.' });
  }
});

// GET /api/leads/my-demo (Lookup existing demo booking for an unenrolled student)
leadsRouter.get('/my-demo', (req: Request, res: Response) => {
  try {
    const { email, phone, leadId } = req.query;
    if (!email && !phone && !leadId) {
      return res.status(400).json({ error: 'Please provide email, phone or leadId to lookup demo.' });
    }

    let query = `
      SELECT l.id as lead_id, l.student_name, l.student_class, l.parent_name, l.email, l.mobile_number, l.created_at,
             da.id as attendee_id, da.demo_id,
             ds.date as demo_date, ds.start_time as demo_start_time, ds.end_time as demo_end_time,
             ds.meeting_link, ds.teacher_id, ds.status as demo_status,
             t.name as teacher_name, t.photo_url as teacher_photo, t.biography as teacher_bio, t.qualification as teacher_qualification, t.experience as teacher_experience
      FROM leads l
      JOIN demo_attendees da ON da.lead_id = l.id
      JOIN demo_sessions ds ON ds.id = da.demo_id
      LEFT JOIN teachers t ON t.id = ds.teacher_id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (leadId) {
      query += ` AND l.id = ?`;
      params.push(String(leadId));
    } else if (email && phone) {
      query += ` AND (lower(l.email) = ? OR l.mobile_number = ?)`;
      params.push(String(email).trim().toLowerCase(), normalizePhone(String(phone).trim()));
    } else if (email) {
      query += ` AND lower(l.email) = ?`;
      params.push(String(email).trim().toLowerCase());
    } else if (phone) {
      query += ` AND l.mobile_number = ?`;
      params.push(normalizePhone(String(phone).trim()));
    }

    query += ` ORDER BY ds.date DESC, ds.start_time DESC LIMIT 1`;

    const demo = db.prepare(query).get(...params) as any;
    if (!demo) {
      return res.status(404).json({ error: 'No active demo session found for this student.' });
    }

    return res.json({
      success: true,
      demo: {
        leadId: demo.lead_id,
        studentName: demo.student_name,
        studentClass: demo.student_class,
        parentName: demo.parent_name,
        email: demo.email,
        mobileNumber: demo.mobile_number,
        demoId: demo.demo_id,
        date: demo.demo_date,
        timeSlot: demo.demo_start_time,
        status: demo.demo_status,
        meetingLink: demo.teacher_id ? demo.meeting_link : null,
        teacher: demo.teacher_id ? {
          name: demo.teacher_name,
          photoUrl: demo.teacher_photo,
          bio: demo.teacher_bio,
          qualification: demo.teacher_qualification,
          experience: demo.teacher_experience,
        } : null,
      },
    });
  } catch (error: any) {
    console.error('My demo lookup error:', error);
    return res.status(500).json({ error: 'Failed to lookup demo session.' });
  }
});

// POST /api/leads/book-slot (Completes interactive slot booking + Google Meet + Resend Confirmation)
leadsRouter.post('/book-slot', async (req: Request, res: Response) => {
  try {
    const {
      studentName,
      studentClass,
      parentName,
      mobileNumber,
      email,
      hasLaptop,
      understandsEnglish,
      whatsappUpdates = true,
      date,
      timeSlot,
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      utmTerm,
      gclid,
      fbclid,
    } = req.body;

    if (!studentName || !studentName.trim()) {
      return res.status(400).json({ error: "Child's name is required." });
    }
    if (!mobileNumber || !mobileNumber.trim()) {
      return res.status(400).json({ error: "Mobile number is required." });
    }
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: "Valid email address is required." });
    }
    if (!date || !timeSlot) {
      return res.status(400).json({ error: "Please choose your preferred date and time slot." });
    }

    const normalizedMobile = normalizePhone(mobileNumber.trim());
    const normalizedEmail = email.trim().toLowerCase();

    // 🛑 DE-DUPLICATION CHECK: If user already has an active upcoming demo scheduled, prevent duplicate record
    const existingBooking = db.prepare(`
      SELECT l.id as lead_id, l.student_name, l.student_class, l.parent_name, l.email, l.mobile_number,
             da.id as attendee_id, da.demo_id,
             ds.date as demo_date, ds.start_time as demo_start_time, ds.end_time as demo_end_time,
             ds.meeting_link, ds.teacher_id, ds.status as demo_status,
             t.name as teacher_name, t.photo_url as teacher_photo, t.biography as teacher_bio, t.qualification as teacher_qualification, t.experience as teacher_experience
      FROM leads l
      JOIN demo_attendees da ON da.lead_id = l.id
      JOIN demo_sessions ds ON ds.id = da.demo_id
      LEFT JOIN teachers t ON t.id = ds.teacher_id
      WHERE (lower(l.email) = ? OR l.mobile_number = ?)
        AND ds.status IN ('SCHEDULED', 'ASSIGNED', 'NEW')
      ORDER BY ds.date DESC, ds.start_time DESC
      LIMIT 1
    `).get(normalizedEmail, normalizedMobile) as any;

    if (existingBooking) {
      const existingDateFormatted = new Date(existingBooking.demo_date).toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });

      return res.json({
        success: true,
        alreadyBooked: true,
        leadId: existingBooking.lead_id,
        demoId: existingBooking.demo_id,
        studentName: existingBooking.student_name,
        studentClass: existingBooking.student_class,
        parentName: existingBooking.parent_name,
        email: existingBooking.email,
        mobileNumber: existingBooking.mobile_number,
        date: existingBooking.demo_date,
        timeSlot: existingBooking.demo_start_time,
        dateFormatted: existingDateFormatted || existingBooking.demo_date,
        meetingLink: existingBooking.teacher_id ? existingBooking.meeting_link : null,
        teacher: existingBooking.teacher_id ? {
          name: existingBooking.teacher_name,
          photoUrl: existingBooking.teacher_photo,
          bio: existingBooking.teacher_bio,
          qualification: existingBooking.teacher_qualification,
          experience: existingBooking.teacher_experience,
        } : null,
        message: `Welcome back! You already have a confirmed demo slot for ${existingBooking.student_name} on ${existingDateFormatted || existingBooking.demo_date} (${existingBooking.demo_start_time}).`,
      });
    }

    const leadId = 'lead_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);

    // Parse start and end times from slot (e.g. "11:00 AM" or "6:00 PM")
    let startTime = '11:00';
    let endTime = '11:45';

    const slotUpper = timeSlot.toUpperCase();
    if (slotUpper.includes('PM')) {
      const match = slotUpper.match(/(\d+):?(\d*)/);
      if (match) {
        let hour = parseInt(match[1], 10);
        if (hour !== 12) hour += 12;
        const min = match[2] ? match[2].padStart(2, '0') : '00';
        startTime = `${hour.toString().padStart(2, '0')}:${min}`;
        const endHour = hour;
        const endMin = (parseInt(min, 10) + 45) % 60;
        const calcEndHour = parseInt(min, 10) + 45 >= 60 ? endHour + 1 : endHour;
        endTime = `${calcEndHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`;
      }
    } else if (slotUpper.includes('AM')) {
      const match = slotUpper.match(/(\d+):?(\d*)/);
      if (match) {
        let hour = parseInt(match[1], 10);
        if (hour === 12) hour = 0;
        const min = match[2] ? match[2].padStart(2, '0') : '00';
        startTime = `${hour.toString().padStart(2, '0')}:${min}`;
        const endHour = hour;
        const endMin = (parseInt(min, 10) + 45) % 60;
        const calcEndHour = parseInt(min, 10) + 45 >= 60 ? endHour + 1 : endHour;
        endTime = `${calcEndHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`;
      }
    }

    // Determine lead source from UTM
    let leadSource = 'DIRECT';
    if (fbclid || (utmSource && utmSource.toLowerCase().includes('meta')) || (utmSource && utmSource.toLowerCase().includes('facebook')) || (utmSource && utmSource.toLowerCase().includes('instagram'))) {
      leadSource = 'META_ADS';
    } else if (gclid || (utmSource && utmSource.toLowerCase().includes('google'))) {
      leadSource = 'GOOGLE';
    }

    const qualificationNotes = [
      `Device Ownership: ${hasLaptop ? 'Yes (Laptop/PC/Tab)' : 'No'}`,
      `Understands English: ${understandsEnglish ? 'Yes' : 'No'}`,
      `WhatsApp Updates: ${whatsappUpdates ? 'Opted-In' : 'Opted-Out'}`,
      `Slot Selected: ${date} at ${timeSlot}`,
      gclid ? `Google Ad Click ID (gclid): ${gclid}` : null,
      fbclid ? `Meta Ad Click ID (fbclid): ${fbclid}` : null,
    ].filter(Boolean).join(' | ');

    // 1. Insert lead
    db.prepare(`
      INSERT INTO leads (
        id, student_name, student_class, student_age, parent_name,
        mobile_number, email, city, interest_area, preferred_time,
        notes, lead_source, utm_source, utm_medium, utm_campaign,
        utm_content, utm_term, status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, 'India', 'Spoken English & Confidence', ?, ?, ?, ?, ?, ?, ?, ?, 'DEMO_SCHEDULED')
    `).run(
      leadId,
      studentName.trim(),
      studentClass || 'Grade 4',
      9,
      parentName || `Parent of ${studentName.trim()}`,
      normalizedMobile,
      email.trim(),
      `${date} ${timeSlot}`,
      qualificationNotes,
      leadSource,
      utmSource || null,
      utmMedium || null,
      utmCampaign || null,
      utmContent || null,
      utmTerm || null
    );

    // 2. Create Google Meet session
    const startDateTime = new Date(`${date}T${startTime}:00`);
    const topic = `upspeaq Demo: ${studentName.trim()} (${studentClass || 'Grade 4'})`;
    const meetSession = await createGoogleMeetSession({
      topic,
      startTime: isNaN(startDateTime.getTime()) ? undefined : startDateTime.toISOString(),
      durationMinutes: 45,
    });

    const demoId = 'demo_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);

    // 3. Create demo_sessions record
    db.prepare(`
      INSERT INTO demo_sessions (
        id, title, date, start_time, end_time, teacher_id, meeting_link,
        capacity, status, notes
      )
      VALUES (?, ?, ?, ?, ?, NULL, ?, 2, 'SCHEDULED', ?)
    `).run(
      demoId,
      topic,
      date,
      startTime,
      endTime,
      meetSession.joinUrl,
      qualificationNotes
    );

    // 4. Create demo_attendees record
    const attendeeId = 'da_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    db.prepare(`
      INSERT INTO demo_attendees (id, demo_id, lead_id, student_name, parent_phone, attendance_status)
      VALUES (?, ?, ?, ?, ?, 'REGISTERED')
    `).run(attendeeId, demoId, leadId, studentName.trim(), normalizedMobile);

    // 5. Activity log
    db.prepare(`
      INSERT INTO lead_activities (id, lead_id, action_type, description, actor_name, metadata_json)
      VALUES (?, ?, 'DEMO_SCHEDULED', ?, 'Live Booking Funnel', ?)
    `).run(
      'act_' + Date.now().toString(36),
      leadId,
      `Parent booked demo slot for ${date} at ${timeSlot} (Google Meet)`,
      JSON.stringify({ demoId, meetingLink: meetSession.joinUrl, date, timeSlot })
    );

    // 6. Dispatch live Demo Request Received Email (without meeting link)
    const dateFormatted = new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    sendDemoReceivedEmail({
      to: email.trim(),
      studentName: studentName.trim(),
      parentName: parentName || `Parent of ${studentName.trim()}`,
      studentClass: studentClass || 'Grade 4',
      dateStr: dateFormatted || date,
      timeStr: timeSlot,
    }).catch((err) => console.error('Demo received email trigger error:', err));

    return res.json({
      success: true,
      leadId,
      demoId,
      meetingLink: meetSession.joinUrl,
      date,
      timeSlot,
      dateFormatted,
    });
  } catch (error: any) {
    console.error('Book slot error:', error);
    return res.status(500).json({ error: 'Failed to complete demo slot booking.' });
  }
});

// POST /api/leads/survey-response (Experience Customization Survey without School Board)
leadsRouter.post('/survey-response', async (req: Request, res: Response) => {
  try {
    const { leadId, goals, parentName } = req.body;

    if (!leadId) {
      return res.status(400).json({ error: 'Lead ID is required.' });
    }

    const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(leadId) as any;
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found.' });
    }

    const goalList = Array.isArray(goals) ? goals.join(', ') : goals || 'Not specified';
    const updatedNotes = `${lead.notes || ''} | Student Goals: [${goalList}]`;

    db.prepare(`
      UPDATE leads 
      SET parent_name = COALESCE(?, parent_name),
          notes = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(parentName || lead.parent_name, updatedNotes, leadId);

    db.prepare(`
      INSERT INTO lead_activities (id, lead_id, action_type, description, actor_name, metadata_json)
      VALUES (?, ?, 'NOTE_ADDED', ?, 'Parent Experience Survey', ?)
    `).run(
      'act_' + Date.now().toString(36),
      leadId,
      `Parent completed customization survey: Goals: ${goalList}`,
      JSON.stringify({ goals, parentName })
    );

    return res.json({ success: true, message: 'Survey preferences saved!' });
  } catch (error: any) {
    console.error('Survey response error:', error);
    return res.status(500).json({ error: 'Failed to record survey response.' });
  }
});

// POST /api/leads/book-demo (Public & Student Booking Endpoint)
leadsRouter.post('/book-demo', async (req: Request, res: Response) => {
  try {
    const studentName = req.body.studentName || req.body.student_name;
    const studentClass = req.body.studentClass || req.body.student_class;
    const studentAge = req.body.studentAge || req.body.student_age;
    const parentName = req.body.parentName || req.body.parent_name;
    const mobileNumber = req.body.mobileNumber || req.body.mobile_number;
    const email = req.body.email;
    const city = req.body.city;
    const interestArea = req.body.interestArea || req.body.interest_area;
    const preferredTime = req.body.preferredTime || req.body.preferred_time;
    const notes = req.body.notes;
    const leadSource = req.body.leadSource || req.body.lead_source || 'DIRECT';
    const utmSource = req.body.utmSource || req.body.utm_source;
    const utmMedium = req.body.utmMedium || req.body.utm_medium;
    const utmCampaign = req.body.utmCampaign || req.body.utm_campaign;
    const utmContent = req.body.utmContent || req.body.utm_content;
    const utmTerm = req.body.utmTerm || req.body.utm_term;
    const referralCode = req.body.referralCode || req.body.referral_code;
    const consent = req.body.consent !== undefined ? req.body.consent : true;

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
        message: 'A demo booking request for this mobile number was recently received. Teachers are already being allocated!',
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

    // Automatically create demo session, link attendee, and broadcast to teachers
    const scheduled = await autoScheduleLeadDemo(leadId);

    // Auto-create / link student record
    let student = db.prepare('SELECT * FROM students WHERE parent_phone = ? OR (lead_id = ? AND lead_id IS NOT NULL)').get(normalizedMobile, leadId) as any;
    if (!student) {
      const studentId = 'std_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
      db.prepare(`
        INSERT INTO students (id, lead_id, name, class_grade, parent_name, parent_phone, parent_email, city, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'DEMO')
      `).run(
        studentId,
        leadId,
        studentName.trim(),
        studentClass.trim(),
        parentName.trim(),
        normalizedMobile,
        email ? email.trim().toLowerCase() : null,
        city ? city.trim() : null
      );
      student = db.prepare('SELECT * FROM students WHERE id = ?').get(studentId) as any;
    }

    // Auto-create / link user record for instant zero-password authentication
    const userEmail = email ? email.trim().toLowerCase() : `student_${normalizedMobile.replace(/\D/g, '')}@upspeaq.com`;
    let user = db.prepare('SELECT * FROM users WHERE email = ? OR student_id = ?').get(userEmail, student.id) as any;
    if (!user) {
      const userId = 'usr_std_' + Date.now().toString(36);
      db.prepare(`
        INSERT INTO users (id, email, password_hash, name, role, student_id)
        VALUES (?, ?, ?, ?, 'STUDENT', ?)
      `).run(userId, userEmail, 'DEMO_LOGIN_HASH', studentName.trim(), student.id);
      user = db.prepare('SELECT id, email, name, role, student_id FROM users WHERE id = ?').get(userId) as any;
    }

    // Sign instant access JWT token
    const token = signToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: 'STUDENT',
      student_id: student.id,
    });

    return res.status(201).json({
      success: true,
      message: 'Demo session booked and scheduled automatically! Teachers have been notified on a first-come-first-serve basis.',
      bookingReference: leadId,
      studentName: studentName.trim(),
      demoDetails: scheduled,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: 'STUDENT',
        student_id: student.id,
      },
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
