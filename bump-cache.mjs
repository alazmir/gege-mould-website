/**
 * Auto-bump cache version strings in all HTML files.
 * Run after ANY edit to css/*.css or js/*.js.
 * Uses the latest file modification time as the version number,
 * so cached browsers always fetch fresh assets.
 *
 * Usage: node bump-cache.mjs
 */

import { readFileSync, writeFileSync, statSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Files whose mtimes determine the cache version
const WATCH_FILES = [
  'css/style.css',
  'css/rtl.css',
  'js/i18n.js',
  'js/main.js',
  'js/quick-message.js',
];

// Get the latest modification timestamp across all watched files
let latestMtime = 0;
for (const f of WATCH_FILES) {
  try {
    const mtime = statSync(join(__dirname, f)).mtimeMs;
    if (mtime > latestMtime) latestMtime = mtime;
    console.log(`  ${f}: ${new Date(mtime).toISOString()}`);
  } catch (e) {
    console.log(`  ${f}: NOT FOUND (skipped)`);
  }
}

// Generate version string from timestamp (seconds since epoch)
const version = String(Math.floor(latestMtime / 1000));
console.log(`\nLatest mtime → cache version: ?v=${version}`);

// Update all HTML files
const htmlFiles = readdirSync(__dirname).filter(f => f.endsWith('.html'));
let updated = 0;

for (const file of htmlFiles) {
  const filePath = join(__dirname, file);
  let content = readFileSync(filePath, 'utf8');
  const original = content;

  // Replace any existing ?v=NUMBER with the new version
  content = content.replace(/\?v=\d+/g, `?v=${version}`);

  if (content !== original) {
    writeFileSync(filePath, content, 'utf8');
    console.log(`  UPDATED: ${file}`);
    updated++;
  }
}

console.log(`\nDone: ${updated} files updated to ?v=${version}`);
console.log('Restart the dev server if running (Ctrl+C then node server.js).');
