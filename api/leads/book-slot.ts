import { sendDemoReceivedEmail } from '../../server/services/emailService';

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

    // Send demo received email with Grade PDF worksheets
    try {
      await sendDemoReceivedEmail({
        to: email.trim(),
        studentName,
        parentName,
        studentClass: studentClass || 'Grade 5',
        dateStr: dateFormatted,
        timeStr: slot,
      });
    } catch (e) {
      console.error('Failed to send confirmation email on Vercel:', e);
    }

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
      message: 'Demo session request received! Preparation materials sent to your email.',
    });
  } catch (error: any) {
    console.error('Book slot error on Vercel:', error);
    return res.status(500).json({ error: 'Failed to complete demo booking.' });
  }
}
