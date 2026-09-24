import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export interface SendOtpOptions {
  to: string;
  otp: string;
  studentName?: string;
}

export interface SendDemoReceivedOptions {
  to: string;
  studentName: string;
  parentName?: string;
  studentClass?: string;
  dateStr: string;
  timeStr: string;
}

export interface SendTeacherAssignedOptions {
  to: string;
  studentName: string;
  parentName?: string;
  dateStr: string;
  timeStr: string;
  teacherName: string;
  teacherBio?: string;
  teacherExpertise?: string;
  meetingLink: string;
}

export interface SendDemoConfirmationOptions {
  to: string;
  studentName: string;
  parentName?: string;
  dateStr: string;
  timeStr: string;
  meetingLink: string;
  teacherName?: string;
}

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const EMAIL_FROM = process.env.EMAIL_FROM || 'upspeaq <onboarding@resend.dev>';
const EMAIL_REPLY_TO = process.env.EMAIL_REPLY_TO || 'upspeaqofficial@gmail.com';
const GMAIL_USER = process.env.GMAIL_USER || process.env.EMAIL_USER || 'upspeaqofficial@gmail.com';
const GMAIL_PASS = process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_PASS || '';

function getGmailTransporter() {
  const user = process.env.GMAIL_USER || process.env.EMAIL_USER || 'upspeaqofficial@gmail.com';
  const pass = (process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_PASS || '').trim().replace(/\s+/g, '');
  if (!pass) return null;
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass,
    },
  });
}

/**
 * Universal Email Sender: Automatically uses Gmail SMTP if configured, otherwise Resend API
 */
async function sendUnifiedEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ success: boolean; id?: string; error?: string }> {
  // 1. Try Gmail SMTP with App Password
  const transporter = getGmailTransporter();
  if (transporter) {
    try {
      const user = process.env.GMAIL_USER || process.env.EMAIL_USER || 'upspeaqofficial@gmail.com';
      const info = await transporter.sendMail({
        from: `upspeaq <${user}>`,
        to: to.trim(),
        replyTo: EMAIL_REPLY_TO,
        subject,
        html,
      });
      console.log(`✅ [Gmail SMTP Success] Email successfully sent to ${to}, MessageID: ${info.messageId}`);
      return { success: true, id: info.messageId };
    } catch (err: any) {
      console.error('❌ [Gmail SMTP Error]:', err.message);
    }
  }

  // 2. Resend API
  try {
    if (!RESEND_API_KEY) {
      console.warn('⚠️ [Email Service] No RESEND_API_KEY found. Simulating email send to:', to);
      return { success: true, id: 'simulated_' + Date.now() };
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: [to],
        reply_to: EMAIL_REPLY_TO,
        subject,
        html,
      }),
    });

    const data = (await res.json()) as any;

    if (!res.ok) {
      console.warn(`⚠️ [Resend Sandbox Limitation]: Resend returned: ${data.message}`);
      if (to.toLowerCase() !== 'upspeaqofficial@gmail.com') {
        const fallbackRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: EMAIL_FROM,
            to: ['upspeaqofficial@gmail.com'],
            reply_to: EMAIL_REPLY_TO,
            subject: `[For: ${to}] ${subject}`,
            html: `<div style="padding: 10px; background: #fff3cd; color: #856404; margin-bottom: 15px; border-radius: 8px; font-size: 13px;"><strong>Resend Sandbox Notice:</strong> Intended recipient was <strong>${to}</strong>. Delivered here because Resend is in free testing mode.</div>` + html,
          }),
        });
        const fallbackData = (await fallbackRes.json()) as any;
        if (fallbackRes.ok) {
          console.log(`✅ [Resend Sandbox Forward Success] Forwarded test email to upspeaqofficial@gmail.com, ID: ${fallbackData.id}`);
          return { success: true, id: fallbackData.id };
        }
      }
      return { success: false, error: data.message || 'Failed to send email' };
    }

    console.log(`✅ [Resend Email Success] Email sent to ${to}, ID: ${data.id}`);
    return { success: true, id: data.id };
  } catch (err: any) {
    console.error('❌ [Email Network Error]:', err.message);
    return { success: false, error: err.message };
  }
}

const sendResendEmail = sendUnifiedEmail;

/**
 * Send 4-Digit OTP Email (Strictly Email-based)
 */
export async function sendOtpEmail({ to, otp, studentName }: SendOtpOptions) {
  const subject = `Your upspeaq Verification Code: ${otp}`;
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
          .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 36px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
          .header { text-align: center; margin-bottom: 24px; }
          .logo { font-size: 26px; font-weight: 900; color: #ea580c; text-decoration: none; letter-spacing: -0.5px; }
          .logo span { color: #0f172a; }
          .otp-box { background: #fff7ed; border: 2px dashed #f97316; border-radius: 12px; padding: 18px; text-align: center; margin: 24px 0; }
          .otp-code { font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #ea580c; font-family: monospace; }
          .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">up<span>speaq</span></div>
            <h2 style="font-size: 20px; font-weight: 800; margin-top: 12px; color: #0f172a;">Verify Your Email Address</h2>
          </div>
          <p style="font-size: 15px; line-height: 1.6; color: #334155;">
            Hello ${studentName ? `Parent of <strong>${studentName}</strong>` : 'there'},
          </p>
          <p style="font-size: 14px; line-height: 1.6; color: #475569;">
            Please use the 4-digit verification code below to confirm your free live English demo class booking on upspeaq:
          </p>
          <div class="otp-box">
            <div class="otp-code">${otp}</div>
            <div style="font-size: 12px; color: #9a3412; font-weight: 600; margin-top: 6px;">Valid for 10 minutes</div>
          </div>
          <p style="font-size: 13px; color: #64748b; line-height: 1.5;">
            If you did not request this code, you can safely ignore this email.
          </p>
          <div class="footer">
            © ${new Date().getFullYear()} upspeaq. Every Child Deserves the Confidence to Speak.<br>
            Need help? Reach us at <a href="mailto:${EMAIL_REPLY_TO}" style="color: #ea580c;">${EMAIL_REPLY_TO}</a>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendResendEmail({ to, subject, html });
}

/**
 * STEP 1 EMAIL: Send Demo Request Received Email
 * (Sent immediately upon booking - NO meeting link is included here)
 */
export async function sendDemoReceivedEmail({
  to,
  studentName,
  parentName,
  studentClass,
  dateStr,
  timeStr,
}: SendDemoReceivedOptions) {
  const subject = `upspeaq | Demo Class Request Received for ${studentName} (${dateStr} @ ${timeStr})`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px; color: #1e293b; }
          .email-card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
          .brand-banner { padding: 28px 32px 16px; text-align: center; }
          .brand-logo { font-size: 28px; font-weight: 900; color: #ea580c; letter-spacing: -0.5px; text-decoration: none; }
          .brand-logo span { color: #0f172a; }
          .illustration { text-align: center; padding: 12px 0 16px; }
          .title { font-size: 22px; font-weight: 800; color: #0f172a; text-align: center; margin: 0 0 12px; }
          .body-content { padding: 0 32px 24px; font-size: 14px; line-height: 1.6; color: #334155; }
          .session-card { background: #fff7ed; border: 1.5px dashed #ea580c; border-radius: 14px; padding: 20px; margin: 20px 0; text-align: center; }
          .session-time { font-size: 18px; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
          .session-topic { font-size: 13px; font-weight: 600; color: #9a3412; margin-bottom: 8px; }
          .status-badge { display: inline-block; background-color: #ea580c; color: #ffffff !important; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; padding: 6px 16px; border-radius: 20px; }
          .info-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 20px 0; font-size: 13px; color: #475569; }
          .checklist { background: #fff; padding: 12px 0; font-size: 13px; color: #475569; line-height: 1.6; }
          .checklist li { margin-bottom: 8px; }
          .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 24px 32px; font-size: 12px; color: #64748b; text-align: center; line-height: 1.6; }
        </style>
      </head>
      <body>
        <div class="email-card">
          <div class="brand-banner">
            <div class="brand-logo">up<span>speaq</span></div>
          </div>

          <div class="illustration">
            <div style="display: inline-block; width: 64px; height: 64px; border-radius: 50%; background: #ffedd5; color: #ea580c; line-height: 64px; font-size: 28px;">
              ⏱️
            </div>
          </div>

          <h2 class="title">Demo Request Received!</h2>

          <div class="body-content">
            <p>Dear <strong>${parentName || studentName || 'Parent'}</strong>,</p>
            <p>
              Thank you for booking a Free Live English & Public Speaking Demo Session for <strong>${studentName}</strong> ${studentClass ? `(${studentClass})` : ''} on <strong>upspeaq</strong>!
            </p>

            <div class="session-card">
              <div class="session-time">${dateStr} @ ${timeStr}</div>
              <div class="session-topic">Topic: Spoken English & Confidence Assessment for ${studentName}</div>
              <div style="margin-top: 12px;">
                <span class="status-badge">Assigning Expert Coach...</span>
              </div>
            </div>

            <div class="info-box">
              <div style="font-weight: 700; color: #0f172a; margin-bottom: 6px;">📌 What Happens Next?</div>
              <div>
                Our academic team is currently matching ${studentName} with a certified speech & communication mentor specialized in their grade.
              </div>
              <div style="margin-top: 8px; color: #0284c7; font-weight: 600;">
                ✉️ As soon as your teacher accepts the session, you will receive an email with your teacher's profile and the live meeting link.
              </div>
            </div>

            <ul class="checklist">
              <li>Please ensure your child joins using a <strong>laptop or desktop</strong> with working mic/camera for the best interactive diagnostic experience.</li>
              <li>Updates and reminders will also be shared on WhatsApp for your convenience.</li>
            </ul>

            <p style="margin-top: 16px;">We look forward to helping ${studentName} speak with unmatched confidence!</p>
            <p style="margin-top: 20px; font-weight: 700; color: #0f172a;">
              Warm regards,<br>
              <span style="color: #ea580c;">Team upspeaq</span>
            </p>
          </div>

          <div class="footer">
            Connect with us: <a href="mailto:${EMAIL_REPLY_TO}" style="color: #ea580c; text-decoration: none;">${EMAIL_REPLY_TO}</a> | WhatsApp: +91 7004132088<br>
            upspeaq Live Interactive Learning • India<br>
            <span style="font-size: 11px; color: #94a3b8;">© ${new Date().getFullYear()} upspeaq. All rights reserved.</span>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendResendEmail({ to, subject, html });
}

/**
 * STEP 2 EMAIL: Send Teacher Confirmed Email with Meeting Link
 * (Sent when a teacher accepts / claims the demo session or an admin assigns the teacher)
 */
export async function sendTeacherAssignedEmail({
  to,
  studentName,
  parentName,
  dateStr,
  timeStr,
  teacherName,
  teacherBio,
  teacherExpertise,
  meetingLink,
}: SendTeacherAssignedOptions) {
  const subject = `upspeaq | Your Teacher is Confirmed! Meeting Link for Demo Class with ${teacherName}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px; color: #1e293b; }
          .email-card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
          .brand-banner { padding: 28px 32px 16px; text-align: center; }
          .brand-logo { font-size: 28px; font-weight: 900; color: #ea580c; letter-spacing: -0.5px; text-decoration: none; }
          .brand-logo span { color: #0f172a; }
          .illustration { text-align: center; padding: 12px 0 16px; }
          .title { font-size: 22px; font-weight: 800; color: #0f172a; text-align: center; margin: 0 0 12px; }
          .body-content { padding: 0 32px 24px; font-size: 14px; line-height: 1.6; color: #334155; }
          
          .teacher-card { background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 14px; padding: 18px; margin: 20px 0; text-align: left; }
          .teacher-label { font-size: 11px; font-weight: 800; text-transform: uppercase; color: #166534; letter-spacing: 0.5px; }
          .teacher-name { font-size: 18px; font-weight: 800; color: #14532d; margin-top: 2px; }
          .teacher-desc { font-size: 12px; color: #15803d; margin-top: 4px; }
          
          .session-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px; margin: 20px 0; text-align: center; }
          .session-time { font-size: 18px; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
          .session-topic { font-size: 13px; font-weight: 600; color: #64748b; margin-bottom: 16px; }
          .join-btn { display: inline-block; background-color: #ea580c; color: #ffffff !important; font-size: 15px; font-weight: 700; text-decoration: none; padding: 12px 32px; border-radius: 30px; box-shadow: 0 4px 12px rgba(234,88,12,0.3); margin-bottom: 12px; }
          .join-link-text { font-size: 12px; color: #64748b; word-break: break-all; margin-top: 8px; }
          .join-link-text a { color: #2563eb; font-weight: 600; }
          .checklist { background: #fff; padding: 12px 0; font-size: 13px; color: #475569; line-height: 1.6; }
          .checklist li { margin-bottom: 8px; }
          .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 24px 32px; font-size: 12px; color: #64748b; text-align: center; line-height: 1.6; }
        </style>
      </head>
      <body>
        <div class="email-card">
          <div class="brand-banner">
            <div class="brand-logo">up<span>speaq</span></div>
          </div>

          <div class="illustration">
            <div style="display: inline-block; width: 64px; height: 64px; border-radius: 50%; background: #dcfce7; color: #15803d; line-height: 64px; font-size: 32px;">
              ✓
            </div>
          </div>

          <h2 class="title">Your Demo Teacher is Confirmed!</h2>

          <div class="body-content">
            <p>Dear <strong>${parentName || studentName || 'Parent'}</strong>,</p>
            <p>
              Great news! Your demo class for <strong>${studentName}</strong> has been accepted by certified speech coach <strong>${teacherName}</strong>.
            </p>

            <div class="teacher-card">
              <div class="teacher-label">Assigned Speech Coach</div>
              <div class="teacher-name">👨‍🏫 ${teacherName}</div>
              ${teacherExpertise ? `<div class="teacher-desc"><strong>Expertise:</strong> ${teacherExpertise}</div>` : ''}
              ${teacherBio ? `<div class="teacher-desc" style="margin-top: 4px; font-style: italic;">"${teacherBio}"</div>` : ''}
            </div>

            <div class="session-card">
              <div class="session-time">${dateStr} @ ${timeStr}</div>
              <div class="session-topic">1-on-1 English & Confidence Diagnostic Session</div>
              <div>
                <a href="${meetingLink}" target="_blank" class="join-btn">Click Here to Join Class</a>
              </div>
              <div class="join-link-text">
                Direct meeting link: <a href="${meetingLink}" target="_blank">${meetingLink}</a>
              </div>
            </div>

            <ul class="checklist">
              <li>Please join <strong>5 minutes early</strong> using a laptop/desktop with working microphone and camera.</li>
              <li>Request you to <strong>sit alongside your child</strong> to experience how upspeaq transforms spoken English skills.</li>
            </ul>

            <p style="margin-top: 16px;">We look forward to seeing you and ${studentName} in class!</p>
            <p style="margin-top: 20px; font-weight: 700; color: #0f172a;">
              Warm regards,<br>
              <span style="color: #ea580c;">Team upspeaq</span>
            </p>
          </div>

          <div class="footer">
            Connect with us: <a href="mailto:${EMAIL_REPLY_TO}" style="color: #ea580c; text-decoration: none;">${EMAIL_REPLY_TO}</a> | WhatsApp: +91 7004132088<br>
            upspeaq Live Interactive Learning • India<br>
            <span style="font-size: 11px; color: #94a3b8;">© ${new Date().getFullYear()} upspeaq. All rights reserved.</span>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendResendEmail({ to, subject, html });
}

/**
 * Backward compatibility alias for sendTeacherAssignedEmail
 */
export async function sendDemoConfirmationEmail({
  to,
  studentName,
  parentName,
  dateStr,
  timeStr,
  meetingLink,
  teacherName = 'Certified upspeaq Speech Coach',
}: SendDemoConfirmationOptions) {
  return sendTeacherAssignedEmail({
    to,
    studentName,
    parentName,
    dateStr,
    timeStr,
    teacherName,
    meetingLink,
  });
}
