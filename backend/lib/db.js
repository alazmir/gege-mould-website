const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

let db;

/**
 * Initialize the SQLite database and create tables if they don't exist.
 */
function initDb() {
  const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'submissions.db');

  // Ensure data directory exists
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      company TEXT DEFAULT '',
      email TEXT NOT NULL,
      phone TEXT DEFAULT '',
      inquiry_type TEXT DEFAULT '',
      message TEXT NOT NULL,
      ip_address TEXT DEFAULT '',
      language TEXT DEFAULT 'en',
      utm_source TEXT DEFAULT '',
      utm_medium TEXT DEFAULT '',
      utm_campaign TEXT DEFAULT '',
      utm_term TEXT DEFAULT '',
      utm_content TEXT DEFAULT '',
      referrer TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now')),
      email_sent INTEGER DEFAULT 0
    );
    CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at);
    CREATE INDEX IF NOT EXISTS idx_submissions_email ON submissions(email);
    CREATE INDEX IF NOT EXISTS idx_submissions_language ON submissions(language);
    CREATE INDEX IF NOT EXISTS idx_submissions_utm_campaign ON submissions(utm_campaign);
  `);

  // Widget interaction tracking table
  db.exec(`
    CREATE TABLE IF NOT EXISTS widget_interactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL DEFAULT '',
      detail TEXT DEFAULT '',
      language TEXT DEFAULT 'en',
      utm_source TEXT DEFAULT '',
      utm_medium TEXT DEFAULT '',
      utm_campaign TEXT DEFAULT '',
      referrer TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_widget_created_at ON widget_interactions(created_at);
    CREATE INDEX IF NOT EXISTS idx_widget_action ON widget_interactions(action);
  `);

  console.log(`[DB] SQLite initialized at ${dbPath}`);
}

/**
 * Save a widget interaction to the database.
 */
function saveWidgetInteraction(data) {
  const stmt = db.prepare(`
    INSERT INTO widget_interactions (action, detail, language, utm_source, utm_medium, utm_campaign, referrer)
    VALUES (@action, @detail, @language, @utmSource, @utmMedium, @utmCampaign, @referrer)
  `);
  const result = stmt.run({
    action: data.action || '',
    detail: data.detail || '',
    language: data.language || 'en',
    utmSource: data.utm_source || '',
    utmMedium: data.utm_medium || '',
    utmCampaign: data.utm_campaign || '',
    referrer: data.referrer || '',
  });
  return result.lastInsertRowid;
}

/**
 * Save a quote submission to the database.
 * Returns the new row ID.
 */
function saveSubmission(data, ipAddress = '') {
  const stmt = db.prepare(`
    INSERT INTO submissions (name, company, email, phone, inquiry_type, message, ip_address, language, utm_source, utm_medium, utm_campaign, utm_term, utm_content, referrer)
    VALUES (@name, @company, @email, @phone, @inquiryType, @message, @ipAddress, @language, @utmSource, @utmMedium, @utmCampaign, @utmTerm, @utmContent, @referrer)
  `);

  const result = stmt.run({
    name: data.name,
    company: data.company || '',
    email: data.email,
    phone: data.phone || '',
    inquiryType: data.inquiry || '',
    message: data.message,
    ipAddress,
    language: data.language || 'en',
    utmSource: data.utm_source || '',
    utmMedium: data.utm_medium || '',
    utmCampaign: data.utm_campaign || '',
    utmTerm: data.utm_term || '',
    utmContent: data.utm_content || '',
    referrer: data.referrer || '',
  });

  console.log(`[DB] Submission saved (ID: ${result.lastInsertRowid}, lang: ${data.language || 'en'})`);
  return result.lastInsertRowid;
}

module.exports = { initDb, saveSubmission, saveWidgetInteraction };
