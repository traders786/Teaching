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
    const { email, studentName } = req.body || {};

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email address is required to receive verification code.' });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const cleanEmail = email.toLowerCase().trim();

    const html = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #fed7aa; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="font-size: 26px; font-weight: 800; color: #EA580C; letter-spacing: -0.5px;">upspeaq</span>
          <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Public Speaking & Debate Classes for Young Leaders</p>
        </div>
        <div style="background-color: #fff7ed; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px; border: 1px dashed #fdba74;">
          <p style="font-size: 15px; color: #334155; margin: 0 0 12px 0;">Hello ${studentName || 'Parent'},</p>
          <p style="font-size: 14px; color: #64748b; margin: 0 0 16px 0;">Use the following 4-digit code to verify your demo class booking:</p>
          <div style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #EA580C; background: #ffffff; padding: 12px 24px; border-radius: 8px; display: inline-block; border: 2px solid #ea580c; font-family: monospace;">
            ${otp}
          </div>
          <p style="font-size: 12px; color: #94a3b8; margin: 16px 0 0 0;">Valid for 10 minutes. Please do not share this code.</p>
        </div>
        <div style="text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 16px;">
          © ${new Date().getFullYear()} upspeaq. Live 1:4 Interactive Public Speaking Cohorts.
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"upspeaq" <${GMAIL_USER}>`,
      to: cleanEmail,
      subject: `[upspeaq] Your 4-Digit Verification Code: ${otp}`,
      html,
    });

    return res.status(200).json({
      success: true,
      message: `Verification code sent to ${email}`,
    });
  } catch (error: any) {
    console.error('Send OTP error on Vercel:', error);
    return res.status(500).json({ error: 'Failed to dispatch verification code: ' + (error.message || error) });
  }
}
