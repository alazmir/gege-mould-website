/**
 * POST /api/widget-interaction
 * Tracks WhatsApp chat widget interactions (open, quick_reply selection).
 * Lightweight — no email sent, just DB logging for lead-gen analytics.
 */
const express = require('express');
const router = express.Router();
const { saveWidgetInteraction } = require('../lib/db');

router.post('/', (req, res) => {
  try {
    const { action, detail, language, utm_source, utm_medium, utm_campaign, referrer } = req.body;

    if (!action) {
      return res.status(400).json({ success: false, error: 'Missing required field: action' });
    }

    const validActions = ['open', 'quick_reply'];
    if (!validActions.includes(action)) {
      return res.status(400).json({ success: false, error: `Invalid action. Must be one of: ${validActions.join(', ')}` });
    }

    const id = saveWidgetInteraction({
      action,
      detail: (detail || '').substring(0, 100),
      language: (language || 'en').substring(0, 10),
      utm_source: (utm_source || '').substring(0, 200),
      utm_medium: (utm_medium || '').substring(0, 200),
      utm_campaign: (utm_campaign || '').substring(0, 200),
      referrer: (referrer || '').substring(0, 500),
    });

    console.log(`[Widget] Interaction saved (ID: ${id}, action: ${action}, detail: ${detail || ''})`);
    return res.json({ success: true, id });
  } catch (err) {
    console.error('[Widget] Error saving interaction:', err.message);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;
