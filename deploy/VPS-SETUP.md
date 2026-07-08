# Option A: Deploy to Hostinger VPS (Full Node.js Stack)

> **Cost:** ~$5–8/month extra (on top of current Hostinger Premium plan)
> **Best for:** Owners who want simpler management, higher traffic, or full control

---

## Overview

With a Hostinger VPS, you can run the Express backend directly — same as your local dev environment. All form submissions, email notifications, and the admin panel work exactly as they do locally.

---

## Step 1: Upgrade to Hostinger VPS

1. Log into [Hostinger hPanel](https://hpanel.hostinger.com/)
2. Navigate to **Hosting → Upgrade**
3. Select a **VPS plan** (KVM 1 or higher recommended)
4. Choose **Ubuntu 22.04 LTS** as the operating system
5. Complete the purchase

---

## Step 2: Connect to Your VPS

Hostinger will email you the VPS IP address and root password.

**Via SSH (recommended):**
```bash
ssh root@YOUR_VPS_IP
```

**Via Hostinger's built-in terminal:**
- hPanel → VPS → Browser Terminal

---

## Step 3: Install Node.js

```bash
# Install nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Reload shell
source ~/.bashrc

# Install Node.js LTS
nvm install --lts

# Verify
node --version   # should be >= 18.x
npm --version
```

---

## Step 4: Upload Project Files

Use **FileZilla** (or any SFTP client):

| Setting | Value |
|---|---|
| Host | `YOUR_VPS_IP` |
| Protocol | SFTP - SSH File Transfer Protocol |
| Port | `22` |
| Username | `root` |
| Password | (from Hostinger email) |

**Upload path:** `/var/www/gege-mould/`

Upload everything from this project **except**:
- `backend/node_modules/` (will reinstall on server)
- `backend/.env` (will recreate with production values)
- `dist/` (not needed — VPS runs the Express server)
- `.git/` folder

---

## Step 5: Set Up the Application

```bash
# Navigate to the project
cd /var/www/gege-mould/backend

# Install dependencies
npm install --production

# Create .env file with production values
nano .env
```

**Production `.env` template:**
```
PORT=3000
NODE_ENV=production
ADMIN_PASSWORD=<CHANGE_THIS_TO_A_STRONG_PASSWORD>

SMTP_HOST=smtp.qiye.aliyun.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=sales@automotivemouldfactory.com
SMTP_PASS=YM0lV4tlY401mtAT
SMTP_FROM="Gege Mould" <sales@automotivemouldfactory.com>
QUOTE_RECIPIENT=sales@automotivemouldfactory.com

DB_PATH=./data/submissions.db
RATE_LIMIT_MAX=5
RATE_LIMIT_WINDOW_MS=900000
ALLOWED_ORIGINS=https://gegemould.com,https://www.gegemould.com
```

---

## Step 6: Start with PM2 (Process Manager)

PM2 keeps your app running 24/7 and auto-restarts on crashes.

```bash
# Install PM2 globally
npm install -g pm2

# Start the app
pm2 start server.js --name gege-mould

# Auto-start on system reboot
pm2 startup systemd
pm2 save

# Verify it's running
pm2 status
pm2 logs gege-mould
```

---

## Step 7: Install & Configure Nginx (Reverse Proxy)

Nginx sits in front of Node.js and handles SSL, static file caching, and routing.

```bash
# Install Nginx
apt update
apt install nginx -y

# Create site config
nano /etc/nginx/sites-available/gege-mould
```

**Nginx config:**
```nginx
server {
    listen 80;
    server_name gegemould.com www.gegemould.com;

    # Redirect www to non-www (or vice versa — pick one)
    return 301 https://gegemould.com$request_uri;
}

server {
    listen 443 ssl http2;
    server_name www.gegemould.com;
    
    ssl_certificate     /etc/letsencrypt/live/gegemould.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/gegemould.com/privkey.pem;
    
    return 301 https://gegemould.com$request_uri;
}

server {
    listen 443 ssl http2;
    server_name gegemould.com;

    ssl_certificate     /etc/letsencrypt/live/gegemould.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/gegemould.com/privkey.pem;

    # Security headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "0" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Static assets — serve directly via Nginx for speed
    location /css/       { root /var/www/gege-mould; expires 1d; }
    location /js/        { root /var/www/gege-mould; expires 1d; }
    location /assets/    { root /var/www/gege-mould; expires 1y; }
    location /screenshots/ { root /var/www/gege-mould; expires 1y; }
    location /sitemap.xml { root /var/www/gege-mould; }
    location /robots.txt  { root /var/www/gege-mould; }

    # Everything else → Node.js (Express handles SSI + API)
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable the site
ln -s /etc/nginx/sites-available/gege-mould /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default   # remove default site

# Test config
nginx -t

# Reload
systemctl reload nginx
```

---

## Step 8: Install SSL with Let's Encrypt (Certbot)

```bash
# Install certbot
apt install certbot python3-certbot-nginx -y

# Get certificates
certbot --nginx -d gegemould.com -d www.gegemould.com

# Follow the prompts — certbot auto-configures Nginx

# Test auto-renewal
certbot renew --dry-run
```

Certificates auto-renew via a systemd timer. No manual renewal needed.

---

## Step 9: Configure DNS

In Hostinger hPanel → **Domains → gegemould.com → DNS/Nameservers**:

| Type | Name | Value |
|---|---|---|
| A | `@` | `YOUR_VPS_IP` |
| A | `www` | `YOUR_VPS_IP` |

DNS propagation can take 15 minutes to 24 hours.

---

## Step 10: Verify Everything

- [ ] `https://gegemould.com/` loads the homepage
- [ ] `https://www.gegemould.com/` redirects to `https://gegemould.com/`
- [ ] Contact form submits successfully at `/contact.html`
- [ ] RFQ form submits at `/rfq.html`
- [ ] Admin panel at `/admin.html` is accessible and password-protected
- [ ] SSL certificate is valid (padlock icon in browser)

---

## Ongoing Maintenance

```bash
# View logs
pm2 logs gege-mould

# Restart app after code changes
pm2 restart gege-mould

# Update code
cd /var/www/gege-mould
# Upload new files via SFTP, then:
pm2 restart gege-mould

# Monitor
pm2 monit
```
