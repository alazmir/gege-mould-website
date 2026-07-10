/**
 * build.js — Pre-render static frontend for Hostinger / any static hosting.
 *
 * The Express server normally injects header, footer, WhatsApp widget, and
 * script tags at request time via Server-Side Includes (<!--#include ... -->).
 * Hostinger Premium (shared hosting) can't run Node.js, so this script
 * pre-renders every page with partials baked in.
 *
 * Usage:
 *   1. node build.js                 # generate dist/ folder
 *   2. Upload everything inside dist/ to Hostinger public_html/
 *
 * Output: dist/ folder contains a complete, self-contained static website.
 */

const fs = require('fs');
const path = require('path');

// ── Paths ──
const ROOT = __dirname;
const PARTIALS_DIR = path.join(ROOT, 'partials');
const DIST = path.join(ROOT, 'dist');

// ── Load partials ──
const partials = new Map();
const files = fs.readdirSync(PARTIALS_DIR).filter(f => f.endsWith('.html'));
files.forEach(f => {
  partials.set(f.replace('.html', ''), fs.readFileSync(path.join(PARTIALS_DIR, f), 'utf-8'));
});
console.log(`[build] Loaded ${partials.size} partials: ${[...partials.keys()].join(', ')}`);

// ── Load page config ──
const pageConfig = JSON.parse(fs.readFileSync(path.join(PARTIALS_DIR, 'page-config.json'), 'utf-8'));
console.log(`[build] Loaded page config: ${Object.keys(pageConfig).length} pages`);

// ── Dropdown HTML generators (mirrors server.js) ──
function servicesDropdown(variant) {
  if (variant === 'full') {
    return `<a href="capabilities.html#design" class="nav__link" data-i18n="nav.mold_design">Mold Design &amp; Engineering</a>
            <a href="capabilities.html#tooling" class="nav__link" data-i18n="nav.tooling">Precision Tooling &amp; Mold Making</a>
            <a href="capabilities.html#molding" class="nav__link" data-i18n="nav.injection_molding">Injection Molding Production</a>
            <a href="capability-table.html" class="nav__link" data-i18n="nav.equipment_specs">Equipment Specs</a>
            <a href="rfq.html" class="nav__link" data-i18n="nav.request_quote">Request a Quote</a>`;
  }
  return `<a href="capabilities.html#design" class="nav__link" data-i18n="nav.mold_design">Mold Design &amp; Engineering</a>
            <a href="capabilities.html#tooling" class="nav__link" data-i18n="nav.tooling">Precision Tooling &amp; Mold Making</a>
            <a href="capabilities.html#molding" class="nav__link" data-i18n="nav.injection_molding">Injection Molding Production</a>
            <a href="capabilities.html#materials" class="nav__link" data-i18n="nav.materials">Materials &amp; Process Consulting</a>
            <a href="capabilities.html#industries" class="nav__link" data-i18n="nav.industries">Industries We Serve</a>`;
}

function resourcesDropdown(variant) {
  if (variant === 'full') {
    return `<a href="news.html" class="nav__link" data-i18n="nav.blog_news">Blog &amp; News</a>
            <a href="case-studies.html" class="nav__link" data-i18n="nav.case_studies">Case Studies</a>
            <a href="capability-table.html" class="nav__link" data-i18n="nav.equipment_specs">Capability Specs</a>
            <a href="industries.html" class="nav__link" data-i18n="nav.industries">Industries</a>
            <a href="faqs.html" class="nav__link" data-i18n="nav.faqs">FAQs</a>`;
  }
  return `<a href="news.html" class="nav__link" data-i18n="nav.blog_news">Blog &amp; News</a>
            <a href="case-studies.html" class="nav__link" data-i18n="nav.case_studies">Case Studies</a>
            <a href="industries.html" class="nav__link" data-i18n="nav.industries">Industries</a>
            <a href="faqs.html" class="nav__link" data-i18n="nav.faqs">FAQs</a>`;
}

// ── Build header from config (mirrors server.js buildHeader) ──
function buildHeader(cfg) {
  let h = partials.get('header');
  if (!h) return '';

  const activeMap = { home: '', about: '', services: '', resources: '', contact: '' };
  const activeClass = 'nav__link--active';
  if (cfg.active && cfg.active !== 'none') {
    activeMap[cfg.active] = activeClass;
  }

  h = h.replace(/{{HOME_ACTIVE}}/g, activeMap.home);
  h = h.replace(/{{ABOUT_ACTIVE}}/g, activeMap.about);
  h = h.replace(/{{SERVICES_ACTIVE}}/g, activeMap.services);
  h = h.replace(/{{RESOURCES_ACTIVE}}/g, activeMap.resources);
  h = h.replace(/{{CONTACT_ACTIVE}}/g, activeMap.contact);
  h = h.replace(/{{SERVICES_DROPDOWN}}/g, servicesDropdown(cfg.services || 'std'));
  h = h.replace(/{{RESOURCES_DROPDOWN}}/g, resourcesDropdown(cfg.resources || 'std'));
  h = h.replace(/{{CTA_HREF}}/g, cfg.cta || 'contact.html');

  return h;
}

// ── SSI processing (mirrors server.js processSSI) ──
function processSSI(html, pageName) {
  if (!partials.size) return html;

  const cfg = pageConfig[pageName] || null;

  html = html.replace(/<!--#include\s+header\s+-->/g, cfg ? buildHeader(cfg) : '');
  html = html.replace(/<!--#include\s+footer\s+-->/g, cfg ? (partials.get('footer') || '') : '');
  html = html.replace(/<!--#include\s+whatsapp\s+-->/g, partials.get('whatsapp') || '');
  html = html.replace(/<!--#include\s+scripts\s+-->/g, partials.get('scripts') || '');

  // Inject Google Search Console verification into <head> (must be in head, not body)
  html = html.replace('</head>', '  <meta name="google-site-verification" content="SBs9AoeRsqG3Ko1T1CAjNcJQpqcD031zC8GWustQ4V8">\n</head>');

  return html;
}

// ── Collect HTML pages (only root-level, not in subdirectories) ──
const htmlFiles = fs.readdirSync(ROOT)
  .filter(f => f.endsWith('.html'))
  .filter(f => {
    // Skip anything inside backend/ or assets/ — those are in subdirs; readdirSync(ROOT) only gives top-level anyway
    return true;
  });

console.log(`[build] Found ${htmlFiles.length} HTML pages: ${htmlFiles.join(', ')}`);

// ── Clean and recreate dist/ ──
if (fs.existsSync(DIST)) {
  fs.rmSync(DIST, { recursive: true, force: true });
}
fs.mkdirSync(DIST, { recursive: true });

// ── Process each HTML page ──
let processed = 0;
let skipped = 0;

htmlFiles.forEach(filename => {
  const pageName = filename.replace('.html', '');
  const cfg = pageConfig[pageName];

  // Only process pages that have a page-config entry (real site pages).
  // admin.html is a standalone SPA that doesn't use SSI.
  if (!cfg && pageName !== '404' && pageName !== '500') {
    // Pages without config: copy as-is (e.g. admin.html)
    const src = path.join(ROOT, filename);
    const dest = path.join(DIST, filename);
    fs.copyFileSync(src, dest);
    skipped++;
    console.log(`  [copy] ${filename} (no SSI config — copied as-is)`);
    return;
  }

  try {
    const html = fs.readFileSync(path.join(ROOT, filename), 'utf-8');
    const result = processSSI(html, pageName);
    fs.writeFileSync(path.join(DIST, filename), result, 'utf-8');
    processed++;
    console.log(`  [render] ${filename} (active: ${cfg ? cfg.active : 'none'}, cta: ${cfg ? cfg.cta : 'n/a'})`);
  } catch (err) {
    console.error(`  [ERROR] ${filename}: ${err.message}`);
  }
});

// ── Copy static assets ──
const staticDirs = ['css', 'js', 'assets'];
const staticFiles = ['sitemap.xml', 'robots.txt', '.htaccess'];

staticDirs.forEach(dir => {
  const src = path.join(ROOT, dir);
  const dest = path.join(DIST, dir);
  if (fs.existsSync(src)) {
    copyRecursive(src, dest);
    console.log(`  [copy] ${dir}/ → dist/${dir}/`);
  }
});

staticFiles.forEach(file => {
  const src = path.join(ROOT, file);
  const dest = path.join(DIST, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`  [copy] ${file} → dist/${file}`);
  }
});

// ── Summary ──
console.log(`\n[build] Done! ${processed} pages pre-rendered, ${skipped} copied as-is.`);
console.log(`[build] Output: ${DIST}`);
console.log('[build] Upload everything inside dist/ to Hostinger public_html/.');

// ── Helpers ──
function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  entries.forEach(entry => {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}
