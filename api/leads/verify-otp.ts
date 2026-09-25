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
    const { email, mobileNumber, otp } = req.body || {};

    if (!otp || otp.toString().length !== 4) {
      return res.status(400).json({ error: 'Please enter a valid 4-digit verification code.' });
    }

    const emailKey = email ? email.toLowerCase().trim() : '';
    const cleanMobile = mobileNumber ? String(mobileNumber).replace(/\D/g, '') : '';

    const entry = (emailKey && globalOtpMap.get(emailKey)) || (cleanMobile && globalOtpMap.get(cleanMobile));

    if (!entry) {
      return res.status(400).json({ error: 'Verification code expired or not found. Please request a new code.' });
    }

    if (Date.now() > entry.expiresAt) {
      if (emailKey) globalOtpMap.delete(emailKey);
      if (cleanMobile) globalOtpMap.delete(cleanMobile);
      return res.status(400).json({ error: 'Verification code has expired. Please request a new code.' });
    }

    if (entry.code !== otp.toString().trim()) {
      return res.status(400).json({ error: 'Invalid verification code. Please check and try again.' });
    }

    return res.status(200).json({
      success: true,
      verified: true,
      message: 'Mobile and email verified successfully!',
    });
  } catch (error: any) {
    console.error('Verify OTP error on Vercel:', error);
    return res.status(500).json({ error: 'Failed to verify verification code.' });
  }
}
