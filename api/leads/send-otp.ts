import { sendOtpEmail } from '../../server/services/emailService';

// In-memory OTP cache with 10-minute expiry for serverless runtime
const globalOtpMap = (global as any).__upspeaq_otpMap || new Map<string, any>();
(global as any).__upspeaq_otpMap = globalOtpMap;

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
    const { email, mobileNumber, studentName } = req.body || {};

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email address is required to receive verification code.' });
    }

    // Generate 4-digit OTP (e.g. 5821)
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const emailKey = email.toLowerCase().trim();
    const cleanMobile = mobileNumber ? String(mobileNumber).replace(/\D/g, '') : '';
    const expiresAt = Date.now() + 10 * 60 * 1000;

    globalOtpMap.set(emailKey, { code: otp, email: emailKey, mobile: cleanMobile, expiresAt });
    if (cleanMobile) {
      globalOtpMap.set(cleanMobile, { code: otp, email: emailKey, mobile: cleanMobile, expiresAt });
    }

    // Dispatch email via live Gmail SMTP
    await sendOtpEmail({
      to: email.trim(),
      otp,
      studentName: studentName || 'Student',
    });

    return res.status(200).json({
      success: true,
      message: `Verification code sent to ${email}`,
    });
  } catch (error: any) {
    console.error('Send OTP error on Vercel:', error);
    return res.status(500).json({ error: 'Failed to dispatch verification code.' });
  }
}
