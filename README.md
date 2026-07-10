# Gege Mould Website

Production-ready, 8-page B2B injection mold manufacturing website with a Node.js/Express backend for contact form handling.

---

## Project Structure

```
gege-mould-website/
├── index.html              # Home — hero, stats, capabilities, industries, CTA
├── about.html              # About Us — company story, values, facility gallery
├── capabilities.html       # Capabilities — mold design, tooling, molding, materials
├── quality.html            # Quality — ISO 9001, PPAP, SPC, inspection process
├── contact.html            # Contact — address, form with honeypot, map info
├── news.html               # News/Blog — 6 industry articles
├── industries.html         # Industries — automotive, appliance, industrial, consumer
├── faqs.html               # FAQs — 10 common questions answered
├── 404.html                # Custom 404 error page
├── 500.html                # Custom 500 error page
├── sitemap.xml             # XML sitemap
├── robots.txt              # Robots exclusion file
├── .gitignore
│
├── css/
│   └── style.css           # 29 KB — responsive stylesheet (4 breakpoints)
│
├── js/
│   └── main.js             # Navigation, form handling, animations, API integration
│
├── backend/
│   ├── server.js           # Express server entry point
│   ├── package.json        # Dependencies & scripts
│   ├── .env.example        # Required environment variables (template)
│   ├── vercel.json         # Vercel deployment config (rewrites, headers, redirects)
│   ├── routes/
│   │   └── quote.js        # POST /api/quote — handles form submissions
│   ├── middleware/
│   │   ├── validate.js     # Server-side validation (email, length, spam checks)
│   │   └── rateLimiter.js  # IP-based rate limiting (5 req / 15 min)
│   └── lib/
│       ├── email.js        # Nodemailer SMTP email sending with HTML templates
│       └── db.js           # SQLite persistence — saves every submission
│
└── README.md               # This file
```

---

## Quick Start (Local Development)

### Prerequisites

- **Node.js** >= 18.x
- **npm** (comes with Node.js)

### 1. Install backend dependencies

```bash
cd backend
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and fill in at minimum:
- `SMTP_USER` — your email sending account
- `SMTP_PASS` — app password or SMTP credential
- `QUOTE_RECIPIENT` — where form submissions should be delivered

> **Without SMTP configured**, form submissions will still be saved to the local SQLite database, but email notifications won't send.

### 3. Start the server

```bash
npm run dev
```

Opens at `http://localhost:3000`. The front-end HTML pages are served as static files; the API lives at `/api/quote`.

### 4. Open in browser

Visit `http://localhost:3000` — the homepage loads. Navigate to `/contact.html` to test the quote form.

### Form submission flow

1. User fills in the contact form → clicks Submit
2. Client-side validation runs first (instant UX feedback)
3. Form data POSTs to `/api/quote` as JSON
4. Server validates (required fields, email format, length limits, URL spam check)
5. Honeypot field checked — if filled, silently accepted (bot trap)
6. Submission written to SQLite database (`backend/data/submissions.db`)
7. Notification email sent via SMTP to the configured recipient
8. JSON response returned → front-end displays success or error message

---

## Environment Variables

All in `backend/.env`:

| Variable | Required | Description |
|---|---|---|
| `PORT` | No (default: 3000) | Server port |
| `NODE_ENV` | No | `production` or `development` |
| `SMTP_HOST` | For email | SMTP server (e.g. `smtp.gmail.com`) |
| `SMTP_PORT` | For email | SMTP port (587 for TLS) |
| `SMTP_SECURE` | For email | `true` for port 465, `false` for 587 |
| `SMTP_USER` | For email | SMTP login username |
| `SMTP_PASS` | For email | SMTP password / app password |
| `SMTP_FROM` | For email | `"From"` header for notification emails |
| `QUOTE_RECIPIENT` | For email | Where quote requests are delivered |
| `DB_PATH` | No | SQLite database file path |
| `RATE_LIMIT_MAX` | No (default: 5) | Max submissions per IP per window |
| `RATE_LIMIT_WINDOW_MS` | No (default: 900000) | Rate limit window in ms (15 min) |
| `ALLOWED_ORIGINS` | Yes (production) | Comma-separated CORS origins |

---

## Deployment

### Option A: Vercel (Recommended)

1. Push the entire project to a GitHub repo
2. Import into Vercel
3. Set **Root Directory** to the repo root (not `/backend`)
4. Add all environment variables from `.env.example` in Vercel's project settings
5. Deploy — Vercel uses `vercel.json` for API rewrites, security headers, and redirects

**Redirects included in vercel.json:** clean URLs like `/about` → `/about.html`, `/contact` → `/contact.html`, etc.

### Option B: Any VPS / Node.js Host

```bash
cd backend
npm install --production
cp .env.example .env   # edit with real values
node server.js
```

The Express server serves front-end static files AND the API — no separate web server needed.

### Option C: Static Hosting + Separate API

If preferred, deploy the HTML/CSS/JS to any static host (Netlify, Cloudflare Pages, S3) and the `/backend` folder to a Node.js host. Update `window.GEGE_API_BASE` in the front-end to point to the API URL:

```html
<script>
  window.GEGE_API_BASE = 'https://your-api-host.com/api';
</script>
```

Place this `<script>` tag **before** `<script src="js/main.js"></script>` in every page with a form.

### Option D: GitHub Actions → Hostinger FTP (Recommended for Hostinger)

This project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically builds and deploys the `dist/` folder to Hostinger via FTP on every push to `main`.

**One-time setup:**

1. Push this repo to GitHub
2. Go to **Settings → Secrets and variables → Actions** in your GitHub repo
3. Add these **Repository Secrets:**

   | Secret Name | Value |
   |---|---|
   | `HOSTINGER_FTP_HOST` | Your Hostinger FTP server (e.g. `ftp.gegemould.com` or the IP from hPanel) |
   | `HOSTINGER_FTP_USER` | FTP username from Hostinger → FTP Accounts |
   | `HOSTINGER_FTP_PASSWORD` | FTP password |
   | `HOSTINGER_REMOTE_DIR` | `public_html/` (or the full path shown in hPanel) |

4. That's it — any push to `main` will trigger a deploy. You can also trigger manually from the **Actions** tab → **Deploy to Hostinger** → **Run workflow**.

> **How it works:** GitHub Actions checks out the repo, runs `node build.js` to rebuild `dist/`, then uploads everything inside `dist/` directly to your Hostinger `public_html/` via FTP. No more manual ZIP uploads.

### Keeping Render Backend Warm (Cold Start Prevention)

Render's free tier puts services to sleep after 15 minutes of inactivity. The first request after sleep triggers a **cold start** that can take 30–60 seconds. The frontend form submission includes retry logic (retries once after 5 seconds), but the best way to avoid cold starts entirely is **UptimeRobot** — a free uptime monitoring service that pings your backend every 5 minutes.

#### Setup Instructions

1. **Create a free UptimeRobot account** at [uptimerobot.com](https://uptimerobot.com)
2. **Add a new monitor:**
   - **Monitor Type:** `HTTP(s)`
   - **Friendly Name:** `Gege Mould API`
   - **URL:** `https://gege-mould-website-1.onrender.com/api/health`
   - **Monitoring Interval:** `5 minutes`
   - **Timeout:** `30 seconds`
3. **Save** — UptimeRobot will now ping the `/api/health` endpoint every 5 minutes, keeping the Render service from sleeping.

> **Note:** The `/api/health` endpoint at `GET /api/health` returns `{"status":"ok","timestamp":"..."}` — it's lightweight and designed for this purpose. Forms also have built-in retry logic as a fallback if the server is cold-starting.

---

## Design & Tech Stack

| Layer | Technology |
|---|---|
| Front-end | Static HTML5, CSS3 (custom properties, Grid, Flexbox), vanilla JavaScript (ES6+) |
| Backend | Node.js, Express 4 |
| Database | SQLite via `better-sqlite3` |
| Email | Nodemailer (SMTP) |
| Rate limiting | `express-rate-limit` |
| Visual identity | Navy `#1a2d3d` + brass/gold `#c7821a`, Segoe UI font stack |
| Responsive | 4 breakpoints: 1024px, 768px, 480px + desktop |
| Accessibility | WCAG AA contrast, focus-visible, aria-labels, semantic HTML5, alt text, labels |
| SEO | Unique `<title>` + `<meta>` per page, JSON-LD structured data, sitemap.xml, robots.txt, OG tags |
| Performance | Lazy-loaded images, explicit width/height, no frameworks, CSS/JS served with immutable cache headers |

---

## What Still Needs Client Input Before Going Live

| Item | Details |
|---|---|
| **Domain name** | Update `sitemap.xml`, `robots.txt`, JSON-LD `url`, and `ALLOWED_ORIGINS` with the real domain |
| **SMTP credentials** | Create `.env` from `.env.example` with real email credentials |
| **Recipient email** | Set `QUOTE_RECIPIENT` to the actual email address that should receive form submissions |
| **Founding year** | Replace "[INSERT founding year]" if known (currently described as "10+ years experience") |
| **Employee count** | Not available on source site — add to stats bar and About page if desired |
| **Certifications beyond ISO 9001** | If IATF 16949, ISO 14001, etc. apply — add to Quality page |
| **News article detail pages** | 2 of 6 articles have real blog content (gate-location, conformal-cooling). 4 articles marked "Coming Soon" — content needed. |
| **Google reCAPTCHA / Cloudflare Turnstile** | Add if spam becomes an issue post-launch (honeypot + rate limiting is the first line of defense) |
| **Google Analytics / Tag Manager** | Add tracking snippet for visitor analytics |
| **Hosting account** | Set up on Vercel, Netlify, or preferred platform |

---

## Security

### Input Validation
- **All endpoints** use server-side validation via `middleware/validate.js`. Client-side validation is UX only — never trusted.
- Fields are trimmed, length-limited, and validated: required fields checked, email format validated via RFC 5322 regex, inquiry type validated against allowlist, spam URLs limited to 3 per message.
- **Honeypot trap** on both `/api/quote` and `/api/rfq` — hidden `_website` field catches bots silently (returns success so bots don't know they were caught).

### File Upload Security
- **Extension allowlist**: Only `.step`, `.stp`, `.igs`, `.iges`, `.pdf`, `.dwg`, `.dxf`, `.zip` accepted.
- **Magic-byte validation**: Uploaded files are checked against known magic bytes for their claimed extension — prevents disguised executables or scripts masquerading as CAD files.
- **File size limit**: 25 MB per file, 5 files max per submission.
- **Unique filenames**: Crypto-random prefix prevents path traversal and name collisions.
- **Rejected files**: Uploaded files that fail magic-byte validation are deleted from disk before the response is sent.

### Rate Limiting
- Both `/api/quote` and `/api/rfq` endpoints are rate-limited via `express-rate-limit`.
- Default: 5 requests per IP per 15-minute window. Configurable via `RATE_LIMIT_MAX` and `RATE_LIMIT_WINDOW_MS` env vars.
- Rate limit headers returned on all responses (`RateLimit-*`).

### Secrets Management
- All secrets (SMTP credentials, API keys) are in environment variables via `.env`.
- `.env` is in `.gitignore` — never committed.
- `.env.example` provided as a template with placeholder values.

### Security Headers (applied to all responses)
| Header | Value |
|---|---|
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `Content-Security-Policy` | `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; frame-src 'self' https://www.google.com; form-action 'self'; base-uri 'self'; object-src 'none'` |

### Error Handling
- **Production mode** (`NODE_ENV=production`): 500 errors serve a static HTML page. No stack traces or internal paths sent to client.
- **Development mode**: Error details returned as JSON for debugging.
- All errors logged server-side via `console.error`.

### Dependency Audit
- Dependencies scanned via `npm audit` at each build.
- Nodemailer upgraded to 9.0.1 to resolve GHSA-rcmh-qjqh-p98v and related advisories (SMTP command injection, CRLF injection).
- **0 known vulnerabilities** as of last audit (June 2026).

### Pre-Launch Security Checklist
- [ ] Set real SMTP credentials in `.env`
- [ ] Set `NODE_ENV=production`
- [ ] Set `ALLOWED_ORIGINS` to the real domain(s)
- [ ] Consider adding Cloudflare Turnstile or reCAPTCHA if spam volume increases
- [ ] Set up HTTPS (Vercel provides this automatically; for VPS, use Certbot/Let's Encrypt)
- [ ] Review CSP header if adding third-party analytics or chat widgets

---

## License

Unlicensed — proprietary. All rights reserved. This code is built for Gege Mould and Taizhou Jingling Moulding Technology Co., Ltd.

All images are now served locally from `assets/images/`. External hotlinking to `automotivemouldfactory.com` has been fully removed.
