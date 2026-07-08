/**
 * Broader screenshot sample — quality, faqs, automotive-mold-solutions
 * in English (LTR) and Arabic (RTL).
 */
const { chromium } = require('playwright');
const path = require('path');

const OUT_DIR = path.join(__dirname, 'screenshots');
const PAGES = [
  'quality.html',
  'faqs.html',
  'automotive-mold-solutions.html',
];
const LANGS = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'Arabic' },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const pageName of PAGES) {
    for (const lang of LANGS) {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        locale: lang.code === 'ar' ? 'ar-SA' : 'en-US',
      });
      const page = await context.newPage();

      const url = `http://localhost:3000/${pageName}?lang=${lang.code}`;
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
        // Let i18n apply
        await page.waitForTimeout(1500);

        const base = pageName.replace('.html', '');
        const filename = `${base}_${lang.code}.png`;
        const filepath = path.join(OUT_DIR, filename);

        await page.screenshot({ path: filepath, fullPage: true });
        console.log(`OK  ${filename}`);
        results.push({ page: pageName, lang: lang.code, file: filename, ok: true });
      } catch (err) {
        console.error(`FAIL ${pageName} [${lang.code}]: ${err.message}`);
        results.push({ page: pageName, lang: lang.code, ok: false, error: err.message });
      } finally {
        await context.close();
      }
    }
  }

  await browser.close();

  console.log('\n--- Summary ---');
  const ok = results.filter(r => r.ok).length;
  const fail = results.filter(r => !r.ok).length;
  console.log(`Pass: ${ok}, Fail: ${fail}`);
  results.filter(r => !r.ok).forEach(r => console.log(`  FAIL: ${r.page} [${r.lang}] — ${r.error}`));
})();
