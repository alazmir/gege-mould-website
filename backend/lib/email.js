const nodemailer = require('nodemailer');

// ── Lazy-initialized transporter (created once, reused across requests) ──
let _transporter = null;

function getTransporter() {
  if (_transporter) return _transporter;

  _transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.qiye.aliyun.com',
    port: parseInt(process.env.SMTP_PORT, 10) || 465,
    secure: process.env.SMTP_SECURE !== 'false', // default true (SSL/TLS on 465)
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    // Fail fast: don't block the HTTP response waiting on a slow SMTP server
    connectionTimeout: 10000,  // 10 s
    greetingTimeout: 8000,     // 8 s
    socketTimeout: 12000,      // 12 s
    pool: true,
    maxConnections: 2,
    maxMessages: 20,
  });

  return _transporter;
}

// ── Helpers ──

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const LANG_LABELS = {
  en: 'EN', pt: 'PT', es: 'ES', ar: 'AR', id: 'ID',
};

function langTag(lang) {
  const code = (lang || 'en').slice(0, 2).toLowerCase();
  return LANG_LABELS[code] || code.toUpperCase();
}

function buildRecipient() {
  return process.env.QUOTE_RECIPIENT || process.env.SMTP_USER || 'sales@automotivemouldfactory.com';
}

function buildFrom() {
  return process.env.SMTP_FROM || `"Gege Mould Website" <${process.env.SMTP_USER}>`;
}

// ── Shared HTML shell ──
function emailShell(title, bodyHtml, footerHtml) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:'Segoe UI',Arial,sans-serif;color:#2c3e50;max-width:600px;margin:0 auto;padding:20px;">
  <div style="background:#1a2d3d;padding:20px;border-radius:8px 8px 0 0;">
    <img src="https://gegemould.com/assets/logos/logo-primary.png" alt="Gege Mould" style="max-width:160px;height:auto;margin-bottom:8px;"><br>
    <h2 style="color:#c7821a;margin:0;font-size:20px;">${escapeHtml(title)}</h2>
  </div>
  <div style="border:1px solid #dde2e8;border-top:none;padding:20px;border-radius:0 0 8px 8px;">
    ${bodyHtml}
    ${footerHtml}
  </div>
</body>
</html>`;
}

// ── Hard timeout wrapper — prevents DNS/SMTP hangs from blocking HTTP responses ──
const EMAIL_SEND_TIMEOUT_MS = parseInt(process.env.SMTP_SEND_TIMEOUT_MS, 10) || 15000;

async function sendWithTimeout(sendFn, label) {
  try {
    return await Promise.race([
      sendFn(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`SMTP send timed out after ${EMAIL_SEND_TIMEOUT_MS}ms`)), EMAIL_SEND_TIMEOUT_MS)
      ),
    ]);
  } catch (err) {
    console.error(`[Email] ${label} failed:`, err.message);
    return null;
  }
}

// ── Public: send notification per form type ──

/**
 * Contact / Quote form — full project inquiry.
 */
async function sendQuoteEmail(data) {
  const transporter = getTransporter();
  const recipient = buildRecipient();
  const lang = langTag(data.language);

  const htmlBody = `
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:8px 0;font-weight:600;color:#1a2d3d;">Name:</td><td>${escapeHtml(data.name)}</td></tr>
      <tr><td style="padding:8px 0;font-weight:600;color:#1a2d3d;">Company:</td><td>${escapeHtml(data.company) || '—'}</td></tr>
      <tr><td style="padding:8px 0;font-weight:600;color:#1a2d3d;">Email:</td><td><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td></tr>
      <tr><td style="padding:8px 0;font-weight:600;color:#1a2d3d;">Phone:</td><td>${escapeHtml(data.phone) || '—'}</td></tr>
      <tr><td style="padding:8px 0;font-weight:600;color:#1a2d3d;">Inquiry Type:</td><td>${escapeHtml(data.inquiry) || '—'}</td></tr>
      <tr><td style="padding:8px 0;font-weight:600;color:#1a2d3d;">Language:</td><td>${lang}</td></tr>
    </table>
    <hr style="border:none;border-top:1px solid #dde2e8;margin:16px 0;">
    <h3 style="color:#1a2d3d;font-size:15px;">Project Details:</h3>
    <p style="white-space:pre-wrap;line-height:1.6;background:#f9f8f6;padding:12px;border-radius:4px;">${escapeHtml(data.message)}</p>
    <hr style="border:none;border-top:1px solid #dde2e8;margin:16px 0;">
    <p style="font-size:0.8rem;color:#8a97a5;">Submitted from Gege Mould website contact form. Reply directly to this email to respond to the customer.</p>`;

  const info = await sendWithTimeout(
    () => transporter.sendMail({
      from: buildFrom(),
      to: recipient,
      replyTo: data.email,
      subject: `[${lang}] New Quote Request from ${data.name}${data.company ? ` — ${data.company}` : ''}`,
      text: `NEW QUOTE REQUEST [${lang}]\n=================\nName: ${data.name}\nCompany: ${data.company || '—'}\nEmail: ${data.email}\nPhone: ${data.phone || '—'}\nInquiry Type: ${data.inquiry || '—'}\nLanguage: ${lang}\n\nProject Details:\n${data.message}\n\n---\nSubmitted from Gege Mould website. Reply to: ${data.email}`,
      html: emailShell('New Quote Request', htmlBody, ''),
    }),
    'Quote email',
  );

  if (info) {
    console.log(`[Email] Quote notification sent to ${recipient} (Message-ID: ${info.messageId})`);
  }
  return info;
}

/**
 * RFQ form — file attachments, engineering-focused.
 */
async function sendRfqEmail(data) {
  const transporter = getTransporter();
  const recipient = buildRecipient();
  const lang = langTag(data.language);

  const htmlBody = `
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:8px 0;font-weight:600;color:#1a2d3d;">Name:</td><td>${escapeHtml(data.name)}</td></tr>
      <tr><td style="padding:8px 0;font-weight:600;color:#1a2d3d;">Company:</td><td>${escapeHtml(data.company) || '—'}</td></tr>
      <tr><td style="padding:8px 0;font-weight:600;color:#1a2d3d;">Email:</td><td><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td></tr>
      <tr><td style="padding:8px 0;font-weight:600;color:#1a2d3d;">Phone:</td><td>${escapeHtml(data.phone) || '—'}</td></tr>
      <tr><td style="padding:8px 0;font-weight:600;color:#1a2d3d;">Inquiry Type:</td><td>${escapeHtml(data.inquiry) || '—'}</td></tr>
      <tr><td style="padding:8px 0;font-weight:600;color:#1a2d3d;">Language:</td><td>${lang}</td></tr>
    </table>
    <hr style="border:none;border-top:1px solid #dde2e8;margin:16px 0;">
    <h3 style="color:#1a2d3d;font-size:15px;">RFQ Details:</h3>
    <p style="white-space:pre-wrap;line-height:1.6;background:#f9f8f6;padding:12px;border-radius:4px;">${escapeHtml(data.message)}</p>
    <hr style="border:none;border-top:1px solid #dde2e8;margin:16px 0;">
    <p style="font-size:0.8rem;color:#8a97a5;background:#fef9e7;padding:8px 12px;border-radius:4px;"><strong>⚠ Files attached to this RFQ are stored on the server.</strong><br>Log into the server to download them, or set up file-attachment forwarding in the email module.</p>
    <p style="font-size:0.8rem;color:#8a97a5;">Submitted from Gege Mould RFQ form. Reply directly to this email to respond to the customer.</p>`;

  const info = await sendWithTimeout(
    () => transporter.sendMail({
      from: buildFrom(),
      to: recipient,
      replyTo: data.email,
      subject: `[${lang}] New RFQ Submission from ${data.name}${data.company ? ` — ${data.company}` : ''}`,
      text: `NEW RFQ SUBMISSION [${lang}]\n=================\nName: ${data.name}\nCompany: ${data.company || '—'}\nEmail: ${data.email}\nPhone: ${data.phone || '—'}\nInquiry Type: ${data.inquiry || '—'}\nLanguage: ${lang}\n\nRFQ Details:\n${data.message}\n\n---\nSubmitted from Gege Mould RFQ form. Reply to: ${data.email}`,
      html: emailShell('New RFQ Submission', htmlBody, ''),
    }),
    'RFQ email',
  );

  if (info) {
    console.log(`[Email] RFQ notification sent to ${recipient} (Message-ID: ${info.messageId})`);
  }
  return info;
}

/**
 * Quick Message — lightweight lead capture.
 */
async function sendQuickMessageEmail(data) {
  const transporter = getTransporter();
  const recipient = buildRecipient();
  const lang = langTag(data.language);

  const htmlBody = `
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:8px 0;font-weight:600;color:#1a2d3d;">Name:</td><td>${escapeHtml(data.name)}</td></tr>
      <tr><td style="padding:8px 0;font-weight:600;color:#1a2d3d;">Email:</td><td><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td></tr>
      <tr><td style="padding:8px 0;font-weight:600;color:#1a2d3d;">Language:</td><td>${lang}</td></tr>
    </table>
    <hr style="border:none;border-top:1px solid #dde2e8;margin:16px 0;">
    <h3 style="color:#1a2d3d;font-size:15px;">Message:</h3>
    <p style="white-space:pre-wrap;line-height:1.6;background:#f9f8f6;padding:12px;border-radius:4px;">${escapeHtml(data.message)}</p>
    <hr style="border:none;border-top:1px solid #dde2e8;margin:16px 0;">
    <p style="font-size:0.8rem;color:#8a97a5;">Submitted from Gege Mould Quick Message widget. Reply directly to this email to respond to the customer.</p>`;

  const info = await sendWithTimeout(
    () => transporter.sendMail({
      from: buildFrom(),
      to: recipient,
      replyTo: data.email,
      subject: `[${lang}] New Quick Message from ${data.name}`,
      text: `NEW QUICK MESSAGE [${lang}]\n=================\nName: ${data.name}\nEmail: ${data.email}\nLanguage: ${lang}\n\nMessage:\n${data.message}\n\n---\nSubmitted from Gege Mould Quick Message widget. Reply to: ${data.email}`,
      html: emailShell('New Quick Message', htmlBody, ''),
    }),
    'Quick Message email',
  );

  if (info) {
    console.log(`[Email] Quick Message notification sent to ${recipient} (Message-ID: ${info.messageId})`);
  }
  return info;
}

module.exports = { sendQuoteEmail, sendRfqEmail, sendQuickMessageEmail };
