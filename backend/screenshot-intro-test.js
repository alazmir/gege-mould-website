/**
 * Verification screenshots for homepage intro section image+text layout
 */
const { chromium } = require('playwright');
const path = require('path');

const OUT_DIR = path.join(__dirname, 'screenshots');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  // 1. Desktop English — side by side
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'en-US' });
    const page = await ctx.newPage();
    await page.goto('http://localhost:3000/?lang=en', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(OUT_DIR, 'intro_desktop_en.png'), fullPage: true });
    console.log('OK intro_desktop_en.png');
    await ctx.close();
  }

  // 2. Mobile English — stacked
  {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 812 }, locale: 'en-US' });
    const page = await ctx.newPage();
    await page.goto('http://localhost:3000/?lang=en', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(OUT_DIR, 'intro_mobile_en.png'), fullPage: true });
    console.log('OK intro_mobile_en.png');
    await ctx.close();
  }

  // 3. Desktop Arabic RTL — image on right, text on left
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'ar-SA' });
    const page = await ctx.newPage();
    await page.goto('http://localhost:3000/?lang=ar', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1500);
    // Check RTL
    const dir = await page.evaluate(() => document.documentElement.getAttribute('dir'));
    console.log(`Arabic page dir="${dir}"`);
    await page.screenshot({ path: path.join(OUT_DIR, 'intro_desktop_ar.png'), fullPage: true });
    console.log('OK intro_desktop_ar.png');
    await ctx.close();
  }

  await browser.close();
  console.log('\nDone — 3 screenshots captured.');
})();
