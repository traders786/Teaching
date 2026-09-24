import dotenv from 'dotenv';
dotenv.config();

import { sendOtpEmail } from '../server/services/emailService.js';

async function testEmail() {
  console.log('Testing Gmail SMTP directly with credentials:');
  console.log('GMAIL_USER:', process.env.GMAIL_USER);
  console.log('Password set:', Boolean(process.env.GMAIL_APP_PASSWORD));

  try {
    const info = await sendOtpEmail({
      to: 'upspeaqofficial@gmail.com',
      otp: '7860',
      studentName: 'Verification Test',
    });
    console.log('✅ Email sent successfully!', info);
  } catch (err) {
    console.error('❌ Email sending failed:', err);
  }
}

testEmail();
