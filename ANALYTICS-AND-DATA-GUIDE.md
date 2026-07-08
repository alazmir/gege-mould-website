# Gege Mould — Analytics & Data Guide

*For the website owner. Last updated: July 2026.*

This guide explains everything you need to know about tracking, analytics,
and managing form submissions on your Gege Mould website. No technical
background required.

---

## 1. Google Analytics 4 (GA4)

Your website already has GA4 tracking code installed. You just need to
activate it with your own Measurement ID.

### Step 1: Get your GA4 Measurement ID

1. Go to [analytics.google.com](https://analytics.google.com) and sign in
   with your Google account
2. Create a new GA4 property for `gegemould.com` if you haven't already
3. Go to **Admin** (gear icon) → **Data Streams** → click your web stream
4. Copy the **Measurement ID** — it looks like `G-XXXXXXXXXX`

### Step 2: Add it to your website

1. Open the file `partials/scripts.html`
2. Find `G-XXXXXXXXXX` (it appears twice, near the top of the file)
3. Replace both occurrences with your real Measurement ID
4. Save the file and restart the server:
   ```
   cd backend
   node server.js
   ```

### What GA4 tracks automatically

- **Page views** — every page a visitor loads
- **Session data** — how long people stay, which pages they visit
- **Geographic data** — which countries your visitors come from
- **Device info** — desktop, mobile, tablet

### Key Events (custom tracking)

The following events are tracked automatically and show up in GA4 under
**Reports → Engagement → Events**:

| Event Name | What Triggers It | Category |
|---|---|---|
| `cta_click` | Someone clicks a "Get a Free Quote" button | Conversion |
| `phone_call_click` | Someone clicks/taps the phone number | Conversion |
| `whatsapp_open` | Someone opens the WhatsApp chat widget | Conversion |
| `form_submission` | Someone successfully submits a contact or RFQ form | Conversion |
| `language_switch` | Someone switches to PT, ES, AR, or ID | Engagement |
| `product_segment_click` | Someone clicks a product category in the "What We Make" grid | Engagement |
| `market_card_click` | Someone clicks a market/industry card | Engagement |
| `resource_link_click` | Someone clicks a blog post or case study link | Engagement |
| `external_link_click` | Someone clicks a link leaving your site | Engagement |

### Creating Google Ads conversion actions

For Google Ads conversion tracking, use these events in Google Ads:

1. In Google Ads, go to **Tools → Measurement → Conversions**
2. Click **+ New Conversion Action → Website**
3. Choose **Manual setup** and enter the event names from the table above
4. The key conversion events are: `cta_click`, `phone_call_click`,
   `form_submission`, and `whatsapp_open`

---

## 2. Google Search Console

### How to verify your site

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Click **Add Property** → enter `https://gegemould.com`
3. Choose **HTML tag** as the verification method
4. Copy the meta tag — it looks like:
   ```html
   <meta name="google-site-verification" content="abc123def456..." />
   ```
5. Open the file `partials/header.html`
6. Find the line with `REPLACE_WITH_YOUR_VERIFICATION_CODE`
7. Replace only the `content` value with your verification code
8. Save the file
9. Back in Search Console, click **Verify**

Once verified, Search Console shows you:
- Which search queries bring people to your site
- Which pages rank in Google
- Any indexing problems or errors
- Backlinks from other websites

---

## 3. Admin Panel

Your website has a password-protected admin panel where you can view all
form submissions and export them to Excel/CSV.

### Accessing the admin panel

1. Go to **https://gegemould.com/admin.html** (or `http://localhost:3000/admin.html` locally)
2. Enter the admin password
3. The dashboard shows all your form submissions

### Setting the admin password

The password is set in the `backend/.env` file:

```
ADMIN_PASSWORD=GegeAdmin2026!
```

**To change it:** Edit `backend/.env`, change `ADMIN_PASSWORD` to a new,
strong password, then restart the server.

**Important:** Use a strong password — at least 12 characters, mixing
uppercase, lowercase, numbers, and symbols.

### Admin panel features

**Dashboard overview**
- Total submissions count
- Today's submissions
- This week's submissions
- Number of email notifications sent

**Submissions table**
- Lists every form submission with date, name, company, email, phone,
  inquiry type, message, language, and source (UTM/referrer)
- Search bar — search by name, email, company, or message content
- Pagination — browse through submissions 50 at a time

**CSV Export**
- Click **Export CSV** to download all submissions as a CSV file
- Opens directly in Excel, Google Sheets, or any spreadsheet program
- Includes ALL columns: UTM parameters, referrer, language, email status

**Session timeout**
- The admin login expires after 12 hours of inactivity
- You'll be redirected to the login page and need to sign in again

---

## 4. UTM Parameters — Track Your Marketing

UTM parameters are tags you add to your URLs so you can see exactly where
your leads come from in GA4. They're automatically captured on every form
submission.

### UTM parameter format

Add these to the end of your URLs:

```
https://gegemould.com/?utm_source=SOURCE&utm_medium=MEDIUM&utm_campaign=CAMPAIGN
```

### The 5 UTM parameters

| Parameter | What It Means | Example |
|---|---|---|
| `utm_source` | Where the traffic comes from | `google`, `linkedin`, `email` |
| `utm_medium` | The marketing channel | `cpc`, `social`, `email` |
| `utm_campaign` | Your campaign name | `q3_automotive_bumpers` |
| `utm_term` | (optional) Paid keyword | `injection+mold+manufacturer` |
| `utm_content` | (optional) Which link variant | `button_a`, `sidebar_link` |

### Google Ads — UTM template

Use this template in Google Ads for automatic UTM tagging:

```
https://gegemould.com/?utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_term={keyword}&utm_content={creative}
```

In your Google Ads account:
1. Go to **Campaigns → Settings → Campaign Settings**
2. Under **Tracking**, find the URL options
3. Paste the UTM template above

### Email marketing — UTM examples

```
# Newsletter link
https://gegemould.com/contact.html?utm_source=email&utm_medium=newsletter&utm_campaign=july_2026

# Signature link
https://gegemould.com/?utm_source=email&utm_medium=signature&utm_campaign=always_on
```

### LinkedIn / Social Media

```
https://gegemould.com/?utm_source=linkedin&utm_medium=social&utm_campaign=mold_engineering_post
```

### Where to see UTM data

1. **GA4**: Reports → Acquisition → Traffic Acquisition — filter by
   Source/Medium
2. **Admin Panel CSV export**: Every submission includes `utm_source`,
   `utm_medium`, `utm_campaign` columns so you can filter leads by
   campaign in Excel

---

## 5. Quick Reference — Configuration Files

All configuration values live in two places:

### `backend/.env` (server settings)

| Setting | What It Does | Current Value |
|---|---|---|
| `ADMIN_PASSWORD` | Admin panel login password | `GegeAdmin2026!` |
| `SMTP_HOST` | Email server address | `smtp.qiye.aliyun.com` |
| `SMTP_PORT` | Email server port | `465` |
| `SMTP_USER` | Email account username | `sales@automotivemouldfactory.com` |
| `SMTP_PASS` | Email account password | *(set)* |
| `SMTP_FROM` | Sender name shown on emails | `"Gege Mould" <sales@...>` |
| `QUOTE_RECIPIENT` | Where form submissions are emailed | `sales@automotivemouldfactory.com` |
| `PORT` | Server port | `3000` |
| `DB_PATH` | SQLite database location | `./data/submissions.db` |

### `partials/scripts.html` (GA4 tracking)

| Setting | Line Location | What To Change |
|---|---|---|
| `G-XXXXXXXXXX` | Appears 2× near the top | Replace with your GA4 Measurement ID |

### `partials/header.html` (Search Console)

| Setting | Line Location | What To Change |
|---|---|---|
| `REPLACE_WITH_YOUR_VERIFICATION_CODE` | Line 3 | Replace with your Search Console verification code |

---

## 6. FAQ

**Q: How do I know the tracking is working?**
A: Visit your site, then check GA4 → Reports → Real-time. You should see
yourself as an active visitor. Click around — events appear within seconds.

**Q: The admin panel says "Admin panel not configured."**
A: The `ADMIN_PASSWORD` is not set in `backend/.env`. Add it, then restart
the server.

**Q: I forgot the admin password.**
A: Check `backend/.env` for the `ADMIN_PASSWORD` value. If you lost access
to the server, SSH in and check the file directly.

**Q: Can I see the actual email content that was sent to me?**
A: Form submissions are saved to the database AND emailed. The admin panel
shows the database copy. Check your email inbox for the full formatted
email.

**Q: How long is submission data stored?**
A: Indefinitely, in the SQLite database at `backend/data/submissions.db`.
Export CSV regularly for backup. The database file can be copied directly.

**Q: What happens if the SMTP credentials stop working?**
A: Form submissions are still saved to the database (you can view them in
the admin panel), but notification emails won't be delivered. Check your
Alibaba Cloud email account status and update SMTP credentials if needed.

**Q: Can multiple people access the admin panel?**
A: Yes — share the `ADMIN_PASSWORD` and the URL. All sessions use the
same password. For security, change the password if a team member leaves.

---

## 7. Maintenance Checklist

**Monthly:**
- Export CSV from the admin panel for backup
- Check GA4 for traffic trends

**Quarterly:**
- Review which UTM campaigns are generating the most leads
- Check Google Search Console for any indexing errors
- Change `ADMIN_PASSWORD` if staff have changed

**When running a new Google Ads campaign:**
- Set up UTM parameters using the template above
- Create matching Conversion Actions in Google Ads

**If you hire a new marketing agency:**
- Share this document with them
- They'll need your GA4 Measurement ID (or grant them access in GA4 admin)
- They should use the UTM template for all campaign links

---

*Questions? Contact your web developer or email sales@automotivemouldfactory.com.*
