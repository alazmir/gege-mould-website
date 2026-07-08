# Option B: Hostinger Premium — Frontend Upload Guide

> **Prerequisites:** Backend deployed on Railway (see `RAILWAY-DEPLOYMENT.md`)

---

## Overview

Upload the pre-rendered `dist/` folder to Hostinger Premium's `public_html/` directory. These are static HTML files with all headers, footers, and scripts already baked in — no server-side processing needed.

---

## Before You Upload

1. Make sure you've run `node build.js` in the project root — this generates the `dist/` folder
2. If you set a custom `GEGE_API_BASE` for Railway, confirm it's present in `dist/js/main.min.js` and `dist/js/main.js`
3. Spot-check a few pages in `dist/` by opening them locally in your browser

---

## Step 1: Log into Hostinger hPanel

1. Go to [hpanel.hostinger.com](https://hpanel.hostinger.com/)
2. Navigate to **Hosting → Manage** for your Premium plan
3. Open **File Manager** (or **FTP Accounts** if using FileZilla)

---

## Step 2: Upload Files

### Option A: hPanel File Manager (easiest)

1. Open **File Manager** from hPanel
2. Navigate to `public_html/`
3. **Delete** any default files Hostinger placed there (`default.php`, etc.)
4. Click **Upload** → select all files & folders from `dist/`:
   - `404.html`, `500.html`, `about.html`, ... (all `.html` files)
   - `css/` folder
   - `js/` folder
   - `assets/` folder
   - `screenshots/` folder
   - `sitemap.xml`
   - `robots.txt`
   - `.htaccess`
5. Click **Upload**

### Option B: FileZilla (faster — recommended for initial upload)

| Setting | Value |
|---|---|
| Host | `ftp.gegemould.com` (or the FTP hostname from hPanel) |
| Protocol | FTP - File Transfer Protocol (or SFTP if available) |
| Port | `21` (FTP) or `22` (SFTP) |
| Username | (from hPanel → FTP Accounts) |
| Password | (from hPanel → FTP Accounts) |

1. Connect with FileZilla
2. Navigate remote site to `/public_html/`
3. Delete default files
4. Drag everything from the `dist/` folder on your local machine to `public_html/` on the remote

---

## Step 3: Upload the `.htaccess` File

Create a file named `.htaccess` in `public_html/` with this content:

```apache
# ── Clean URL redirects (remove .html extension for SEO) ──
RewriteEngine On

# Redirect www to non-www (or vice versa — pick one)
RewriteCond %{HTTP_HOST} ^www\.gegemould\.com [NC]
RewriteRule ^(.*)$ https://gegemould.com/$1 [L,R=301]

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [L,R=301]

# Custom error pages
ErrorDocument 404 /404.html
ErrorDocument 500 /500.html

# ── Security ──
# Block access to hidden files
<FilesMatch "^\.">
    Order allow,deny
    Deny from all
</FilesMatch>

# Prevent directory listing
Options -Indexes

# ── Caching ──
# HTML: never cache
<FilesMatch "\.html$">
    Header set Cache-Control "max-age=0, must-revalidate"
</FilesMatch>

# CSS & JS: 1-day (cache-busted via ?v= param)
<FilesMatch "\.(css|js)$">
    Header set Cache-Control "max-age=86400, public"
</FilesMatch>

# Images & fonts: 1-year
<FilesMatch "\.(png|jpe?g|gif|svg|webp|ico|avif|woff2?)$">
    Header set Cache-Control "max-age=31536000, public, immutable"
</FilesMatch>

# ── Gzip compression ──
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript application/json image/svg+xml
</IfModule>
```

**NOTE:** Some of these directives (like `Header set`) require `mod_headers` to be enabled. Hostinger Premium has this by default.

---

## Step 4: Enable SSL

Hostinger Premium includes **free SSL certificates**.

1. In hPanel, go to **Websites → SSL**
2. Select `gegemould.com`
3. Click **Install SSL** (it may already be auto-installed)
4. Enable **Force HTTPS** to redirect all HTTP traffic to HTTPS

---

## Step 5: Verify the Site

1. Open `https://gegemould.com/` in your browser
2. Check the padlock icon — it should show **Connection is secure**
3. Test these pages:
   - [ ] Homepage: `https://gegemould.com/`
   - [ ] Contact: `https://gegemould.com/contact.html`
   - [ ] RFQ: `https://gegemould.com/rfq.html`
   - [ ] About: `https://gegemould.com/about.html`
   - [ ] A blog page: `https://gegemould.com/blog-gate-location.html`
4. Submit a test message via the Contact form — it should reach the Railway backend
5. Test language switching — all 5 languages should work
6. Check mobile responsiveness — resize your browser or test on a phone

---

## Step 6: Redirect www to non-www (or vice versa)

In hPanel → **Domains → gegemould.com**:

1. Make sure both `gegemould.com` and `www.gegemould.com` point to your hosting
2. The `.htaccess` file above handles the redirect automatically

---

## File Structure on Hostinger

Your `public_html/` should look like this after upload:

```
public_html/
├── .htaccess
├── robots.txt
├── sitemap.xml
├── index.html
├── about.html
├── admin.html
├── automotive-mold-solutions.html
├── blog-*.html               (5 blog articles)
├── capabilities.html
├── capability-table.html
├── case-studies.html
├── case-study-export.html
├── contact.html
├── faqs.html
├── industries.html
├── news.html
├── quality.html
├── rfq.html
├── 404.html
├── 500.html
├── css/
│   ├── style.css
│   ├── style.min.css
│   ├── rtl.css
│   └── rtl.min.css
├── js/
│   ├── main.js
│   ├── main.min.js
│   ├── i18n.js
│   ├── i18n.min.js
│   ├── quick-message.js
│   ├── quick-message.min.js
│   ├── rfq.js
│   └── capability-table.js
├── assets/
│   ├── blog/
│   ├── flags/
│   ├── i18n/
│   ├── icons/
│   ├── images/
│   └── logos/
└── screenshots/
```

---

## Updating the Site Later

1. Make changes to the source files in the project
2. Run `node build.js` to regenerate `dist/`
3. Upload only the changed files to Hostinger (overwriting the old ones)
4. Run `node bump-cache.mjs` if you changed CSS or JS — this updates version query strings so browsers fetch the new files
