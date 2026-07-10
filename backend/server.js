require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const quoteRouter = require('./routes/quote');
const rfqRouter = require('./routes/rfq');
const adminRouter = require('./routes/admin');
const { initDb } = require('./lib/db');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Load SSI partials & page config at startup ──
const partialsDir = path.join(__dirname, '..', 'partials');
const partials = new Map();
const pageConfig = {};

(function loadPartials() {
  try {
    // Load all .html partials
    const files = fs.readdirSync(partialsDir).filter(f => f.endsWith('.html'));
    files.forEach(f => {
      partials.set(f.replace('.html', ''), fs.readFileSync(path.join(partialsDir, f), 'utf-8'));
    });
    console.log(`[SSI] Loaded ${partials.size} partials: ${[...partials.keys()].join(', ')}`);
  } catch (err) {
    console.warn('[SSI] Failed to load partials — SSI disabled:', err.message);
  }

  try {
    const configPath = path.join(partialsDir, 'page-config.json');
    Object.assign(pageConfig, JSON.parse(fs.readFileSync(configPath, 'utf-8')));
    console.log(`[SSI] Loaded page config: ${Object.keys(pageConfig).length} pages`);
  } catch (err) {
    console.warn('[SSI] Failed to load page-config.json — SSI disabled:', err.message);
  }
})();

// ── Dropdown HTML generators ──
function servicesDropdown(variant) {
  if (variant === 'full') {
    return `<a href="capabilities.html#design" class="nav__link" data-i18n="nav.mold_design">Mold Design &amp; Engineering</a>
            <a href="capabilities.html#tooling" class="nav__link" data-i18n="nav.tooling">Precision Tooling &amp; Mold Making</a>
            <a href="capabilities.html#molding" class="nav__link" data-i18n="nav.injection_molding">Injection Molding Production</a>
            <a href="capability-table.html" class="nav__link" data-i18n="nav.equipment_specs">Equipment Specs</a>
            <a href="rfq.html" class="nav__link" data-i18n="nav.request_quote">Request a Quote</a>`;
  }
  // std
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
  // std and compact both use the same 4-item layout
  return `<a href="news.html" class="nav__link" data-i18n="nav.blog_news">Blog &amp; News</a>
            <a href="case-studies.html" class="nav__link" data-i18n="nav.case_studies">Case Studies</a>
            <a href="industries.html" class="nav__link" data-i18n="nav.industries">Industries</a>
            <a href="faqs.html" class="nav__link" data-i18n="nav.faqs">FAQs</a>`;
}

// ── SSI processing ──
function processSSI(html, pageName) {
  if (!partials.size) return html; // SSI disabled

  const cfg = pageConfig[pageName] || null;

  // Replace include markers
  html = html.replace(/<!--#include\s+header\s+-->/g, cfg ? buildHeader(cfg) : '');
  html = html.replace(/<!--#include\s+footer\s+-->/g, cfg ? (partials.get('footer') || '') : '');
  html = html.replace(/<!--#include\s+whatsapp\s+-->/g, partials.get('whatsapp') || '');
  html = html.replace(/<!--#include\s+scripts\s+-->/g, partials.get('scripts') || '');

  // Inject Google Search Console verification into <head> (must be in head, not body)
  html = html.replace('</head>', '  <meta name="google-site-verification" content="SBs9AoeRsqG3Ko1T1CAjNcJQpqcD031zC8GWustQ4V8">\n</head>');

  return html;
}

function buildHeader(cfg) {
  var h = partials.get('header');
  if (!h) return '';

  // Active class tokens
  var activeMap = { home: '', about: '', services: '', resources: '', contact: '' };
  var activeClass = 'nav__link--active';
  if (cfg.active && cfg.active !== 'none') {
    activeMap[cfg.active] = activeClass;
  }

  h = h.replace(/{{HOME_ACTIVE}}/g, activeMap.home);
  h = h.replace(/{{ABOUT_ACTIVE}}/g, activeMap.about);
  h = h.replace(/{{SERVICES_ACTIVE}}/g, activeMap.services);
  h = h.replace(/{{RESOURCES_ACTIVE}}/g, activeMap.resources);
  h = h.replace(/{{CONTACT_ACTIVE}}/g, activeMap.contact);

  // Dropdowns
  h = h.replace(/{{SERVICES_DROPDOWN}}/g, servicesDropdown(cfg.services || 'std'));
  h = h.replace(/{{RESOURCES_DROPDOWN}}/g, resourcesDropdown(cfg.resources || 'std'));

  // CTA href
  h = h.replace(/{{CTA_HREF}}/g, cfg.cta || 'contact.html');

  return h;
}

// ── Trust proxy (required for rate limiting behind reverse proxies / Vercel) ──
app.set('trust proxy', 1);

// ── Cookie parsing (admin auth) ──
app.use(cookieParser());

// ── Body parsing ──
app.use(express.json({ limit: '64kb' }));
app.use(express.urlencoded({ extended: false, limit: '64kb' }));

// ── Security headers ──
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '0'); // deprecated but still blocks in older browsers
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://www.google.com https://*.google.com; frame-src 'self' https://www.google.com; form-action 'self'; base-uri 'self'; object-src 'none'");
  next();
});

// ── CORS ──
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map(s => s.trim());

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
});

// ── API routes ──
app.use('/api/quote', quoteRouter);
app.use('/api/rfq', rfqRouter);
app.use('/api/widget-interaction', require('./routes/widget'));
app.use('/api/quick-message', require('./routes/quick-message'));
app.use('/api/admin', adminRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── SSI Middleware: intercept HTML requests ──
const staticDir = path.join(__dirname, '..');
app.use((req, res, next) => {
  var urlPath = req.path;
  // Only handle .html requests (or / which serves index.html)
  if (!urlPath.endsWith('.html') && urlPath !== '/' && !urlPath.endsWith('/')) {
    return next();
  }

  // Resolve page name from URL
  var pageName;
  if (urlPath === '/' || urlPath.endsWith('/')) {
    pageName = 'index';
  } else {
    pageName = path.basename(urlPath, '.html');
  }

  // Try to read the HTML file from disk
  var filePath;
  if (urlPath === '/' || urlPath.endsWith('/')) {
    filePath = path.join(staticDir, urlPath, 'index.html');
  } else {
    filePath = path.join(staticDir, urlPath);
  }

  try {
    var html = fs.readFileSync(filePath, 'utf-8');
    html = processSSI(html, pageName);

    // Never cache HTML
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err) {
    // File not found — let express.static or 404 handler deal with it
    next();
  }
});

// ── Serve static front-end (non-HTML assets) ──
app.use(express.static(staticDir, {
  maxAge: '1d',
  setHeaders: (res, filePath) => {
    // HTML: never cache — always fetch fresh from server
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    }
    // Images & fonts: 1-year cache (versioned by filename, immutable)
    if (/\.(png|jpe?g|gif|svg|webp|ico|avif|woff2?)$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
    // CSS & JS: 1-day cache (cache-busted via ?v= query param)
    if (filePath.endsWith('.css') || filePath.endsWith('.js')) {
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }
  },
}));

// ── Fallback: custom 404 (with SSI) ──
app.use((_req, res) => {
  try {
    var html404 = fs.readFileSync(path.join(staticDir, '404.html'), 'utf-8');
    html404 = processSSI(html404, '404');
    res.status(404).setHeader('Content-Type', 'text/html; charset=utf-8').send(html404);
  } catch (e) {
    res.status(404).send('404 - Page Not Found');
  }
});

// ── Global error handler (with SSI) ──
app.use((err, _req, res, _next) => {
  const isProduction = process.env.NODE_ENV === 'production';
  console.error('[ERROR]', isProduction ? err.message : err.stack);
  if (isProduction) {
    try {
      var html500 = fs.readFileSync(path.join(staticDir, '500.html'), 'utf-8');
      html500 = processSSI(html500, '500');
      return res.status(500).setHeader('Content-Type', 'text/html; charset=utf-8').send(html500);
    } catch (e) {
      return res.status(500).send('500 - Internal Server Error');
    }
  }
  res.status(500).json({ success: false, errors: [{ field: 'general', message: err.message }] });
});

// ── Start ──
initDb();

app.listen(PORT, () => {
  console.log(`[Gege Mould API] Running on http://localhost:${PORT}`);
  console.log(`[Gege Mould API] Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
