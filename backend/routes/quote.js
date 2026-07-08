const express = require('express');
const router = express.Router();
const { validateQuote } = require('../middleware/validate');
const { quoteLimiter } = require('../middleware/rateLimiter');
const { sendQuoteEmail } = require('../lib/email');
const { saveSubmission } = require('../lib/db');

// POST /api/quote
router.post('/', quoteLimiter, async (req, res) => {
  try {
    // 1. Honeypot check — bots fill hidden fields, humans don't
    if (req.body._website && req.body._website.trim() !== '') {
      // Silently accept (don't tell the bot it was caught)
      return res.json({ success: true, message: 'Thank you for your inquiry.' });
    }

    // 2. Server-side validation
    const { valid, errors, data } = validateQuote(req.body);
    if (!valid) {
      return res.status(422).json({ success: false, errors });
    }

    // 2.5 Capture language, UTM, and referrer
    data.language = (req.body.language || '').trim().slice(0, 10) || 'en';
    data.utm_source = (req.body.utm_source || '').trim().slice(0, 200);
    data.utm_medium = (req.body.utm_medium || '').trim().slice(0, 200);
    data.utm_campaign = (req.body.utm_campaign || '').trim().slice(0, 200);
    data.utm_term = (req.body.utm_term || '').trim().slice(0, 200);
    data.utm_content = (req.body.utm_content || '').trim().slice(0, 200);
    data.referrer = (req.body.referrer || req.headers.referer || '').trim().slice(0, 500);

    // 3. Save to database
    let submissionId;
    try {
      submissionId = saveSubmission(data, req.ip);
    } catch (dbErr) {
      console.error('[DB] Failed to save submission:', dbErr.message);
      // Continue — DB failure shouldn't block the user
    }

    // 4. Send notification email (fire-and-forget — don't block the user)
    sendQuoteEmail(data).then(function(info) {
      if (info) console.log('[Email] Quote sent: ' + info.messageId);
    }).catch(function(err) { console.error('[Email] Quote failed:', err.message); });

    // 5. Respond immediately — DB is already saved, email is in background
    return res.json({
      success: true,
      message: 'Thank you for your inquiry. Our team will review your project details and respond within one business day.',
      id: submissionId,
    });

  } catch (err) {
    console.error('[Quote] Unexpected error:', err.stack || err.message);
    return res.status(500).json({
      success: false,
      errors: [{ field: 'general', message: 'An unexpected error occurred. Please try again or contact us directly by email.' }],
    });
  }
});

module.exports = router;
