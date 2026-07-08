# Pre-Launch Checklist — gegemould.com

> Complete every item before announcing the site is live.
> Check off items as you go: `[x]`

---

## 🔴 Critical (Must Complete Before Launch)

- [ ] **GA4 ID confirmed:** `G-BWZ65GXCPQ` is present in all pages (verified — it's in `partials/scripts.html`, which is injected everywhere)
- [ ] **Admin password changed:** The default password in `backend/.env` (`GegeAdmin2026!`) has been changed to a strong, unique password
- [ ] **SMTP email tested:** Submit a test message via the Contact form on the live domain and confirm the email arrives at `sales@automotivemouldfactory.com`
- [ ] **All forms submit successfully:** Test contact form (`/contact.html`), RFQ form (`/rfq.html`), and quick message widget on the live domain
- [ ] **SSL certificate active:** `https://gegemould.com/` shows a padlock icon — no "Not Secure" warnings
- [ ] **www redirect working:** `https://www.gegemould.com/` redirects to `https://gegemould.com/` (or vice versa, pick one)
- [ ] **All pages return 200:** Every page in sitemap.xml loads without errors on the live domain

---

## 🟡 Important (Should Complete Before Launch)

- [ ] **Google Search Console verification:**
  1. Go to [search.google.com/search-console](https://search.google.com/search-console)
  2. Add property → `https://gegemould.com/`
  3. Get the verification code (HTML tag method)
  4. Add the meta tag to `partials/header.html` (line 3, replace `REPLACE_WITH_YOUR_VERIFICATION_CODE`)
  5. Re-run `node build.js` and re-upload if using static hosting
  6. Click **Verify** in Search Console
- [ ] **Language switching works:** Test all 5 languages (EN, PT, ES, AR, ID) — the language switcher in the header should work on every page
- [ ] **Mobile responsive:** Test the site on a real phone (not just browser devtools) — navigation menu, forms, and tables should be usable
- [ ] **404 page looks correct:** Visit `https://gegemould.com/some-random-url` — the custom 404 page should appear with the full header and footer
- [ ] **Page load speed:** Run [PageSpeed Insights](https://pagespeed.web.dev/) — target 70+ on mobile and 90+ on desktop
- [ ] **All images loading:** Spot-check the homepage, about page (facility gallery), and case studies — no broken images
- [ ] **Canonical URLs correct:** View page source on any page — the `<link rel="canonical">` tag should point to `https://gegemould.com/[page]`
- [ ] **hreflang tags present:** View page source — 6 `<link rel="alternate" hreflang="...">` tags (en, pt, es, ar, id, x-default) should be in every `<head>`

---

## 🟢 Post-Launch (Within 48 Hours)

- [ ] **Submit sitemap to Google Search Console:**
  1. Search Console → Sitemaps → Add a new sitemap
  2. Enter `sitemap.xml` → Submit
  3. Check back in 24 hours — all 19 URLs should show as "Discovered"
- [ ] **Submit sitemap to Bing Webmaster Tools:** Same process at [bing.com/webmasters](https://www.bing.com/webmasters/)
- [ ] **Confirm Google Analytics data flowing:**
  1. Go to [analytics.google.com](https://analytics.google.com/)
  2. GA4 property → Reports → Real-time
  3. Visit the site from your phone (not on WiFi) — you should see a live visitor
  4. Full data appears in standard reports after 24–48 hours
- [ ] **Test form submission emails:** Submit another test — confirm emails are still delivering after 24 hours
- [ ] **Set up Google Analytics alerts:** Create alerts for traffic drops, spike in form submissions, etc.
- [ ] **Add Google My Business listing:** If not already done, claim your business on Google Maps with the gegemould.com URL

---

## 🛠️ Tools & Links

| Tool | URL |
|---|---|
| Google Search Console | [search.google.com/search-console](https://search.google.com/search-console) |
| Google Analytics (GA4) | [analytics.google.com](https://analytics.google.com/) |
| PageSpeed Insights | [pagespeed.web.dev](https://pagespeed.web.dev/) |
| SSL Checker | [ssllabs.com/ssltest](https://www.ssllabs.com/ssltest/) |
| Mobile-Friendly Test | [search.google.com/test/mobile-friendly](https://search.google.com/test/mobile-friendly) |
| Structured Data Test | [search.google.com/test/rich-results](https://search.google.com/test/rich-results) |
| Hostinger hPanel | [hpanel.hostinger.com](https://hpanel.hostinger.com/) |
| Railway Dashboard | [railway.app/dashboard](https://railway.app/dashboard) |

---

## ⚠️ Known Issues to Watch

1. **Cold starts on Railway (free tier):** The first form submission after inactivity may take 2–5 seconds. This is normal — Railway spins down idle containers on the free tier. Upgrade to Hobby ($5/mo) to eliminate cold starts.

2. **File uploads on Railway:** Uploaded RFQ files (.step, .pdf) are stored temporarily. Railway's free tier provides 1 GB ephemeral storage — files may be lost on redeploy. For persistent storage, upgrade to Hobby with a volume.

3. **Hostinger email limits:** Hostinger Premium has a limit on outgoing emails per hour via PHP mail(). Since we use external SMTP (Alibaba Cloud), this does **not** affect the site — all emails go through Alibaba's SMTP server, not Hostinger's.

4. **Cache issues after updates:** If you update CSS/JS and users see old styles, run `node bump-cache.mjs` to increment version query strings, then re-run `node build.js` and re-upload.

---

## 📞 Support Contacts

| Service | Support |
|---|---|
| Hostinger | hPanel → Help → Live Chat (24/7) |
| Railway | [docs.railway.app](https://docs.railway.app/) → Support |
| Domain (likely Hostinger) | hPanel → Domains → Support |
| SMTP (Alibaba Cloud) | [aliyun.com](https://www.aliyun.com/) → Enterprise Email Support |
