const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { validateRfq } = require('../middleware/validate');
const { rfqLimiter } = require('../middleware/rateLimiter');
const { sendRfqEmail } = require('../lib/email');
const { saveSubmission } = require('../lib/db');

// ── Magic bytes for accepted file types ──
const MAGIC_BYTES = {
  '.step': [['STEP', 0], ['ISO-10303', 0]],
  '.stp': [['STEP', 0], ['ISO-10303', 0]],
  '.igs': [['IGES', 72], ['S      1', 0], ['                                                                        S      1', 0]],
  '.iges': [['IGES', 72], ['S      1', 0]],
  '.pdf': [['%PDF', 0]],
  '.zip': [['PK', 0]],
  '.dwg': [], // DWG has complex binary header — fall back to extension check
  '.dxf': [['DXF', 0], ['  0', 0], [' 0', 0]],
};

function validateFileMagic(filepath, ext) {
  const patterns = MAGIC_BYTES[ext];
  if (!patterns || patterns.length === 0) return true; // No magic-byte check defined — extension-only
  try {
    const fd = fs.openSync(filepath, 'r');
    const buf = Buffer.alloc(512);
    fs.readSync(fd, buf, 0, 512, 0);
    fs.closeSync(fd);
    return patterns.some(([magic, offset]) => {
      const slice = buf.slice(offset, offset + magic.length).toString('ascii');
      return slice === magic;
    });
  } catch (_) {
    return false;
  }
}

const router = express.Router();

// ── Multer config ──
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB
const MAX_FILES = 5;
const ALLOWED_MIMETYPES = [
  'application/octet-stream',         // .step .stp .igs
  'model/step', 'model/step+xml',
  'application/pdf',
  'image/vnd.dwg', 'application/dwg',
  'application/dxf',
  'application/zip', 'application/x-zip-compressed',
  'application/x-iges', 'model/iges',
];

const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', 'uploads'),
  filename: (_req, file, cb) => {
    const unique = crypto.randomBytes(10).toString('hex');
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${unique}-${safeName}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE, files: MAX_FILES },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExts = ['.step','.stp','.igs','.iges','.pdf','.dwg','.dxf','.zip'];
    if (!allowedExts.includes(ext)) {
      return cb(new Error(`File type "${ext}" is not accepted.`), false);
    }
    cb(null, true);
  },
});

// POST /api/rfq
router.post('/', rfqLimiter, upload.array('files', MAX_FILES), async (req, res) => {
  try {
    // Honeypot check
    if (req.body._website && req.body._website.trim() !== '') {
      return res.json({ success: true, message: 'Thank you for your inquiry.', reference: '—' });
    }

    // Magic-byte validation for uploaded files
    const rejectedFiles = [];
    for (const f of (req.files || [])) {
      const ext = path.extname(f.originalname).toLowerCase();
      if (ext !== '.dwg' && !validateFileMagic(f.path, ext)) {
        rejectedFiles.push(f.originalname);
        try { fs.unlinkSync(f.path); } catch (_) { /* best-effort cleanup */ }
      }
    }
    if (rejectedFiles.length > 0) {
      return res.status(422).json({
        success: false,
        errors: [{
          field: 'files',
          message: `File type could not be verified: ${rejectedFiles.join(', ')}. Please upload only STEP, IGES, PDF, DWG, DXF, or ZIP files.`,
        }],
      });
    }

    // Validate
    const { valid, errors, data } = validateRfq(req.body);
    if (!valid) {
      return res.status(422).json({ success: false, errors });
    }

    // Capture language, UTM, and referrer
    data.language = (req.body.language || '').trim().slice(0, 10) || 'en';
    data.utm_source = (req.body.utm_source || '').trim().slice(0, 200);
    data.utm_medium = (req.body.utm_medium || '').trim().slice(0, 200);
    data.utm_campaign = (req.body.utm_campaign || '').trim().slice(0, 200);
    data.utm_term = (req.body.utm_term || '').trim().slice(0, 200);
    data.utm_content = (req.body.utm_content || '').trim().slice(0, 200);
    data.referrer = (req.body.referrer || req.headers.referer || '').trim().slice(0, 500);

    // Collect file info
    const fileInfo = (req.files || []).map(f => ({ name: f.originalname, size: f.size, stored: f.filename }));

    // Save to DB
    let submissionId;
    try {
      submissionId = saveSubmission({ ...data, message: `${data.message || ''}\n\n[Files attached: ${fileInfo.map(f => f.name).join(', ')}]` }, req.ip);
    } catch (dbErr) {
      console.error('[DB] RFQ save failed:', dbErr.message);
    }

    // Send email (fire-and-forget — don't block on failure)
    sendRfqEmail({ ...data, message: `${data.message || ''}\n\n--- Attached Files ---\n${fileInfo.map(f => `${f.name} (${(f.size/1024/1024).toFixed(1)} MB)`).join('\n')}` }).catch(function(err) { console.error("[Email] RFQ failed:", err.message); });
    const ref = submissionId ? `GM-${String(submissionId).padStart(5, '0')}` : 'GM-00000';

    return res.json({
      success: true,
      message: 'RFQ submitted successfully. Our engineering team will review your project and respond within 48 hours.',
      reference: ref,
    });

  } catch (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ success: false, errors: [{ field: 'files', message: 'One or more files exceed the 25 MB size limit.' }] });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(413).json({ success: false, errors: [{ field: 'files', message: 'Maximum 5 files allowed.' }] });
    }
    console.error('[RFQ] Unexpected error:', err.stack || err.message);
    return res.status(500).json({ success: false, errors: [{ field: 'general', message: 'An unexpected error occurred.' }] });
  }
});

module.exports = router;
