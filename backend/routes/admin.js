/**
 * Admin Panel API Routes
 * Password-protected admin dashboard for viewing form submissions and CSV export.
 *
 * Auth: cookie-based — POST /api/admin/login sets a signed httpOnly cookie.
 * All other routes require valid cookie.
 */

const express = require('express');
const crypto = require('crypto');
const { initDb } = require('../lib/db');

const router = express.Router();

// ── Token management ──
const TOKEN_SECRET = crypto.randomBytes(32).toString('hex'); // regenerated on every restart
const TOKEN_TTL = 12 * 60 * 60 * 1000; // 12 hours
const activeTokens = new Map(); // token → { createdAt }

function generateToken() {
  const token = crypto.randomBytes(32).toString('hex');
  const signature = crypto
    .createHmac('sha256', TOKEN_SECRET)
    .update(token)
    .digest('hex');
  const signed = `${token}.${signature}`;
  activeTokens.set(signed, { createdAt: Date.now() });
  return signed;
}

function validateToken(signed) {
  if (!signed || !signed.includes('.')) return false;
  const [token, signature] = signed.split('.');
  const expectedSig = crypto
    .createHmac('sha256', TOKEN_SECRET)
    .update(token)
    .digest('hex');
  if (signature !== expectedSig) return false;
  const entry = activeTokens.get(signed);
  if (!entry) return false;
  if (Date.now() - entry.createdAt > TOKEN_TTL) {
    activeTokens.delete(signed);
    return false;
  }
  return true;
}

// ── Auth middleware ──
function requireAdmin(req, res, next) {
  const token =
    req.cookies?.admin_token ||
    (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token || !validateToken(token)) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }
  next();
}

// ── Routes ──

// POST /api/admin/login
router.post('/login', (req, res) => {
  const { password } = req.body || {};
  const correctPassword = process.env.ADMIN_PASSWORD;

  if (!correctPassword) {
    console.error('[ADMIN] ADMIN_PASSWORD not set in .env — login is disabled');
    return res.status(500).json({
      success: false,
      message: 'Admin panel not configured. Set ADMIN_PASSWORD in .env on the server.'
    });
  }

  if (!password || password !== correctPassword) {
    return res.status(401).json({ success: false, message: 'Incorrect password' });
  }

  const token = generateToken();
  res.cookie('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: TOKEN_TTL,
    path: '/',
  });
  console.log('[ADMIN] Login successful');
  res.json({ success: true, token });
});

// GET /api/admin/check — verify auth status
router.get('/check', requireAdmin, (_req, res) => {
  res.json({ success: true });
});

// POST /api/admin/logout
router.post('/logout', (_req, res) => {
  res.clearCookie('admin_token', { path: '/' });
  res.json({ success: true });
});

// GET /api/admin/submissions — list all form submissions
router.get('/submissions', requireAdmin, (req, res) => {
  try {
    const db = require('../lib/db');
    // We need a getDb() export. Let's access the db directly via a new function.
    // For now, we'll use the existing saveSubmission pattern and read from SQLite.
    const Database = require('better-sqlite3');
    const path = require('path');
    const fs = require('fs');
    const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'submissions.db');

    if (!fs.existsSync(dbPath)) {
      return res.json({ success: true, submissions: [], total: 0 });
    }

    const dbConn = new Database(dbPath, { readonly: true });
    dbConn.pragma('journal_mode = WAL');

    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    let whereClause = '';
    const params = {};
    if (search) {
      whereClause = `WHERE name LIKE @search OR email LIKE @search OR company LIKE @search OR message LIKE @search`;
      params.search = `%${search}%`;
    }

    const countRow = dbConn.prepare(
      `SELECT COUNT(*) as total FROM submissions ${whereClause}`
    ).get(params);
    const total = countRow ? countRow.total : 0;

    const rows = dbConn.prepare(
      `SELECT * FROM submissions ${whereClause} ORDER BY created_at DESC LIMIT @limit OFFSET @offset`
    ).all({ ...params, limit, offset });

    dbConn.close();

    res.json({
      success: true,
      submissions: rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error('[ADMIN] Error fetching submissions:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch submissions' });
  }
});

// GET /api/admin/submissions/csv — export all submissions as CSV
router.get('/submissions/csv', requireAdmin, (req, res) => {
  try {
    const Database = require('better-sqlite3');
    const path = require('path');
    const fs = require('fs');
    const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'submissions.db');

    if (!fs.existsSync(dbPath)) {
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="submissions_empty.csv"');
      return res.send(
        'id,name,company,email,phone,inquiry_type,message,ip_address,language,utm_source,utm_medium,utm_campaign,utm_term,utm_content,referrer,email_sent,created_at\n'
      );
    }

    const dbConn = new Database(dbPath, { readonly: true });
    dbConn.pragma('journal_mode = WAL');

    const rows = dbConn.prepare(
      `SELECT id, name, company, email, phone, inquiry_type, message, ip_address, language, utm_source, utm_medium, utm_campaign, utm_term, utm_content, referrer, email_sent, created_at FROM submissions ORDER BY created_at DESC`
    ).all();

    dbConn.close();

    // Build CSV
    const headers = [
      'id', 'name', 'company', 'email', 'phone', 'inquiry_type', 'message',
      'ip_address', 'language', 'utm_source', 'utm_medium', 'utm_campaign',
      'utm_term', 'utm_content', 'referrer', 'email_sent', 'created_at'
    ];

    const csvRows = [headers.join(',')];
    rows.forEach(row => {
      const escaped = headers.map(h => {
        const val = row[h] != null ? String(row[h]) : '';
        // Escape CSV special chars
        if (val.includes(',') || val.includes('"') || val.includes('\n')) {
          return '"' + val.replace(/"/g, '""') + '"';
        }
        return val;
      });
      csvRows.push(escaped.join(','));
    });

    const csvContent = csvRows.join('\n');
    const filename = `gege-mould-submissions-${new Date().toISOString().slice(0, 10)}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', Buffer.byteLength(csvContent, 'utf-8'));
    res.send(csvContent);
  } catch (err) {
    console.error('[ADMIN] Error exporting CSV:', err.message);
    res.status(500).json({ success: false, message: 'Failed to export CSV' });
  }
});

module.exports = router;
