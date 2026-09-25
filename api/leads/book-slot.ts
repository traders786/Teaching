import nodemailer from 'nodemailer';

const GMAIL_USER = process.env.GMAIL_USER || 'upspeaqofficial@gmail.com';
const GMAIL_PASS = (process.env.GMAIL_APP_PASSWORD || 'twhqjpehtuhqpvfs').trim().replace(/\s+/g, '');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
});

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      studentName,
      studentClass,
      parentName,
      mobileNumber,
      email,
      date,
      timeSlot,
    } = req.body || {};

    if (!studentName || !mobileNumber || !email) {
      return res.status(400).json({ error: 'Student name, mobile, and email are required.' });
    }

    const leadId = 'lead_' + Date.now().toString(36);
    const demoId = 'demo_' + Date.now().toString(36);
    const targetDate = date || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const slot = timeSlot || '05:00 PM';
    const dateFormatted = new Date(targetDate).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });

    const html = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #fed7aa; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
        <div style="text-align: center; margin-bottom: 28px;">
          <span style="font-size: 28px; font-weight: 800; color: #EA580C; letter-spacing: -0.5px;">upspeaq</span>
          <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Public Speaking & Debate Classes for Young Leaders</p>
        </div>
        <div style="background-color: #fff7ed; border-radius: 12px; padding: 24px; margin-bottom: 24px; border: 1px solid #ffedd5;">
          <h2 style="color: #9a3412; font-size: 20px; margin: 0 0 12px 0;">🎉 Demo Request Received!</h2>
          <p style="font-size: 15px; color: #334155; margin: 0 0 16px 0;">
            Dear ${parentName || 'Parent'}, we have successfully received ${studentName}'s (${studentClass || 'Grade 5'}) request for a live demo class.
          </p>
          <div style="background: white; border-radius: 8px; padding: 16px; border: 1px solid #fed7aa;">
            <p style="margin: 4px 0; color: #475569; font-size: 14px;"><strong>📅 Scheduled Date:</strong> ${dateFormatted}</p>
            <p style="margin: 4px 0; color: #475569; font-size: 14px;"><strong>⏰ Time Slot:</strong> ${slot}</p>
            <p style="margin: 4px 0; color: #475569; font-size: 14px;"><strong>👥 Batch Size:</strong> Max 1:4 Small Group</p>
          </div>
        </div>
        <div style="text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 16px;">
          © ${new Date().getFullYear()} upspeaq. Live 1:4 Interactive Public Speaking Cohorts.
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"upspeaq" <${GMAIL_USER}>`,
      to: email.trim(),
      subject: `🎉 Demo Request Received for ${studentName} — ${dateFormatted} at ${slot}`,
      html,
    });

    return res.status(200).json({
      success: true,
      leadId,
      demoId,
      studentName,
      studentClass: studentClass || 'Grade 5',
      parentName,
      email,
      mobileNumber,
      date: targetDate,
      timeSlot: slot,
      dateFormatted,
      message: 'Demo session request received! Confirmation sent to your email.',
    });
  } catch (error: any) {
    console.error('Book slot error on Vercel:', error);
    return res.status(500).json({ error: 'Failed to complete demo booking.' });
  }
}
