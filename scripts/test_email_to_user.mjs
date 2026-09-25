import nodemailer from 'nodemailer';

async function main() {
  const user = 'upspeaqofficial@gmail.com';
  const pass = 'twhqjpehtuhqpvfs';
  const targetEmail = 'codestock185@gmail.com';
  const studentName = 'YuktiAsingh';
  const otp = '8492';

  console.log(`Connecting to Gmail SMTP from ${user} to send to ${targetEmail}...`);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #fed7aa; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-size: 26px; font-weight: 800; color: #EA580C; letter-spacing: -0.5px;">upspeaq</span>
        <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Public Speaking & Debate Classes for Young Leaders</p>
      </div>
      <div style="background-color: #fff7ed; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px; border: 1px dashed #fdba74;">
        <p style="font-size: 15px; color: #334155; margin: 0 0 12px 0;">Hello <strong>${studentName}</strong>,</p>
        <p style="font-size: 14px; color: #64748b; margin: 0 0 16px 0;">Use the following 4-digit verification code to complete your demo class registration:</p>
        <div style="font-size: 38px; font-weight: 800; letter-spacing: 8px; color: #EA580C; background: #ffffff; padding: 12px 28px; border-radius: 8px; display: inline-block; border: 2px solid #ea580c; font-family: monospace;">
          ${otp}
        </div>
        <p style="font-size: 12px; color: #94a3b8; margin: 16px 0 0 0;">Valid for 10 minutes. Please do not share this code.</p>
      </div>
      <div style="text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 16px;">
        © ${new Date().getFullYear()} upspeaq. Live 1:4 Interactive Public Speaking Cohorts.
      </div>
    </div>
  `;

  const info = await transporter.sendMail({
    from: `"upspeaq" <${user}>`,
    to: targetEmail,
    subject: `[upspeaq] Your 4-Digit Verification Code: ${otp}`,
    html,
  });

  console.log(`✅ SUCCESS! Email sent to ${targetEmail}`);
  console.log(`Message ID: ${info.messageId}`);
  console.log(`Response: ${info.response}`);
}

main().catch(err => console.error('❌ Error sending email:', err));
