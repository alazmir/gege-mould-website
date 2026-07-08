/**
 * Targeted viewport screenshots of the intro section
 */
const { chromium } = require('playwright');
const path = require('path');

const OUT_DIR = path.join(__dirname, 'screenshots');

(async () => {
  const browser = await chromium.launch({ headless: true });

  // 1. Desktop English — scroll to intro section, viewport only
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'en-US' });
    const page = await ctx.newPage();
    await page.goto('http://localhost:3000/?lang=en', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1500);
    // Scroll to the intro section
    await page.evaluate(() => {
      document.getElementById('intro-heading').scrollIntoView({ block: 'start' });
    });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(OUT_DIR, 'intro_vp_en.png'), fullPage: false });
    console.log('OK intro_vp_en.png');
    await ctx.close();
  }

  // 2. Mobile English (375px) — stacked layout
  {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 900 }, locale: 'en-US' });
    const page = await ctx.newPage();
    await page.goto('http://localhost:3000/?lang=en', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1500);
    await page.evaluate(() => {
      document.getElementById('intro-heading').scrollIntoView({ block: 'start' });
    });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(OUT_DIR, 'intro_vp_mobile_en.png'), fullPage: false });
    console.log('OK intro_vp_mobile_en.png');
    await ctx.close();
  }

  // 3. Desktop Arabic RTL — image on right, text on left
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'ar-SA' });
    const page = await ctx.newPage();
    await page.goto('http://localhost:3000/?lang=ar', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1500);
    const dir = await page.evaluate(() => document.documentElement.getAttribute('dir'));
    console.log(`Arabic dir="${dir}"`);
    await page.evaluate(() => {
      document.getElementById('intro-heading').scrollIntoView({ block: 'start' });
    });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(OUT_DIR, 'intro_vp_ar.png'), fullPage: false });
    console.log('OK intro_vp_ar.png');
    await ctx.close();
  }

  // 4. Verify sections above and below are intact — take a wider capture
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 1600 }, locale: 'en-US' });
    const page = await ctx.newPage();
    await page.goto('http://localhost:3000/?lang=en', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1500);
    // Scroll to show what-we-make (above intro) and capacity (below intro)
    await page.evaluate(() => {
      document.querySelector('.what-we-make').scrollIntoView({ block: 'start' });
    });
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(OUT_DIR, 'intro_context_en.png'), fullPage: false });
    console.log('OK intro_context_en.png');
    await ctx.close();
  }

  await browser.close();
  console.log('\nDone — 4 targeted screenshots.');
})();
