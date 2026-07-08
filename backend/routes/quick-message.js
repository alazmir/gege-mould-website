/**
 * POST /api/quick-message
 * Lightweight lead-capture — name, email, short message.
 * Tagged as 'quick_message' to distinguish from full RFQ submissions.
 */
const express = require('express');
const router = express.Router();
const { saveSubmission } = require('../lib/db');
const { sendQuickMessageEmail } = require('../lib/email');
const { quickMsgLimiter } = require('../middleware/rateLimiter');

router.post('/', quickMsgLimiter, async (req, res) => {
  try {
    const { name, email, message, language } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        errors: [
          { field: !name ? 'name' : 'email', message: 'Required field missing' },
        ],
      });
    }

    const data = {
      inquiry: 'quick_message',
      name: (name || '').substring(0, 120),
      company: '',
      email: (email || '').substring(0, 200),
      phone: '',
      message: (message || '').substring(0, 1000),
      language: (language || 'en').substring(0, 10),
    };

    // 1. Save to database
    const submissionId = saveSubmission(data, req.ip);
    console.log('[QuickMsg] Saved (ID: ' + submissionId + ', name: ' + data.name.substring(0, 30) + ')');

    // 2. Send notification email (fire-and-forget — don't block the user)
    sendQuickMessageEmail(data).then(function(info) {
      if (info) console.log('[Email] QuickMsg sent: ' + info.messageId);
    }).catch(function(err) { console.error('[Email] QuickMsg failed:', err.message); });

    return res.json({ success: true, id: submissionId });
  } catch (err) {
    console.error('[QuickMsg] Error:', err.message);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;
