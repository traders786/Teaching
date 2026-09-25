import nodemailer from 'nodemailer';

async function main() {
  const user = 'upspeaqofficial@gmail.com';
  const pass = 'twhqjpehtuhqpvfs';
  const targetEmail = 'codestock185@gmail.com';
  const studentName = 'YuktiAsingh';
  const studentClass = 'Grade 5';
  const dateFormatted = 'Saturday, Sep 26';
  const slot = '05:00 PM';

  console.log(`Connecting to Gmail SMTP from ${user} to send Demo Confirmation to ${targetEmail}...`);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
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
          Dear Parent, we have successfully received <strong>${studentName}</strong>'s (${studentClass}) request for a live demo class.
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

  const info = await transporter.sendMail({
    from: `"upspeaq" <${user}>`,
    to: targetEmail,
    subject: `🎉 Demo Request Received for ${studentName} — ${dateFormatted} at ${slot}`,
    html,
  });

  console.log(`✅ SUCCESS! Demo Confirmation sent to ${targetEmail}`);
  console.log(`Message ID: ${info.messageId}`);
}

main().catch(err => console.error('❌ Error:', err));
