import nodemailer, { type Transporter } from 'nodemailer';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import { settingsRepo } from '../db/settings.repository';
import type { Submission } from '../db/submissions.repository';

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (transporter) return transporter;
  if (!env.GMAIL_USER || !env.GMAIL_APP_PASSWORD) {
    logger.warn('[mailer] GMAIL_USER / GMAIL_APP_PASSWORD not set — emails disabled.');
    return null;
  }
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: env.GMAIL_USER, pass: env.GMAIL_APP_PASSWORD },
  });
  return transporter;
}

function escapeHtml(str = ''): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildHtml(sub: Submission): string {
  const ts = new Date(`${sub.created_at}Z`).toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' });
  const replySubject = encodeURIComponent('בנוגע לפנייתך לישראלה ישראלי');
  return `
  <div dir="rtl" style="font-family:Arial,sans-serif;color:#3b2a20;max-width:560px;margin:0 auto;border:1px solid #e7ddd0;border-radius:12px;overflow:hidden;">
    <div style="background:#6B4226;color:#FAF6F0;padding:18px 24px;"><h2 style="margin:0;font-size:18px;">פנייה חדשה מהאתר</h2></div>
    <div style="padding:24px;">
      <table style="width:100%;border-collapse:collapse;font-size:15px;">
        <tr><td style="padding:8px 0;font-weight:bold;width:120px;">שם מלא</td><td>${escapeHtml(sub.name)}</td></tr>
        <tr><td style="padding:8px 0;font-weight:bold;">טלפון</td><td><a href="tel:${escapeHtml(sub.phone)}">${escapeHtml(sub.phone)}</a></td></tr>
        <tr><td style="padding:8px 0;font-weight:bold;">אימייל</td><td><a href="mailto:${escapeHtml(sub.email)}">${escapeHtml(sub.email)}</a></td></tr>
        <tr><td style="padding:8px 0;font-weight:bold;">נושא</td><td>${escapeHtml(sub.topic)}</td></tr>
        <tr><td style="padding:8px 0;font-weight:bold;vertical-align:top;">הודעה</td><td style="white-space:pre-wrap;">${escapeHtml(sub.message)}</td></tr>
        <tr><td style="padding:8px 0;font-weight:bold;">התקבל בתאריך</td><td>${escapeHtml(ts)}</td></tr>
      </table>
      <div style="margin-top:24px;text-align:center;">
        <a href="mailto:${escapeHtml(sub.email)}?subject=${replySubject}" style="display:inline-block;background:#C17A50;color:#fff;text-decoration:none;padding:12px 28px;border-radius:999px;font-weight:bold;">השב/י ל${escapeHtml(sub.name)}</a>
      </div>
    </div>
  </div>`;
}

/** Send a notification about a new submission. Never throws to the caller. */
export async function sendSubmissionEmail(sub: Submission): Promise<{ sent: boolean }> {
  try {
    if (settingsRepo.get('email_notifications_enabled') !== 'true') return { sent: false };
    const tx = getTransporter();
    if (!tx) return { sent: false };

    const to = settingsRepo.get('notification_email') || env.ADMIN_NOTIFICATION_EMAIL || env.GMAIL_USER;
    await tx.sendMail({
      from: `"אתר ישראלה ישראלי" <${env.GMAIL_USER}>`,
      to,
      replyTo: sub.email,
      subject: `פנייה חדשה: ${sub.name} — ${sub.topic}`,
      html: buildHtml(sub),
    });
    return { sent: true };
  } catch (err) {
    logger.error({ err }, '[mailer] failed to send submission email');
    return { sent: false };
  }
}
