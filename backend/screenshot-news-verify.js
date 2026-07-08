const { chromium } = require('playwright');
const path = require('path');
const OUT = path.join(__dirname, 'screenshots');

(async () => {
  const browser = await chromium.launch({ headless: true });

  // 1. Desktop EN
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'en-US' });
    const page = await ctx.newPage();
    await page.goto('http://localhost:3000/news.html?lang=en', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(OUT, 'news_vp_en.png'), fullPage: true });
    console.log('OK news_vp_en.png');
    await ctx.close();
  }

  // 2. Mobile EN
  {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 812 }, locale: 'en-US' });
    const page = await ctx.newPage();
    await page.goto('http://localhost:3000/news.html?lang=en', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(OUT, 'news_mobile_en.png'), fullPage: true });
    console.log('OK news_mobile_en.png');
    await ctx.close();
  }

  // 3. Desktop AR
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'ar-SA' });
    const page = await ctx.newPage();
    await page.goto('http://localhost:3000/news.html?lang=ar', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1500);
    const dir = await page.evaluate(() => document.documentElement.getAttribute('dir'));
    console.log('AR dir=' + dir);
    await page.screenshot({ path: path.join(OUT, 'news_vp_ar.png'), fullPage: true });
    console.log('OK news_vp_ar.png');
    await ctx.close();
  }

  // 4. Verify content
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'en-US' });
    const page = await ctx.newPage();
    await page.goto('http://localhost:3000/news.html?lang=en', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1500);
    const cardCount = await page.evaluate(() => document.querySelectorAll('.news-card').length);
    const heading = await page.evaluate(() => document.querySelector('h1').textContent);
    const sectionH2 = await page.evaluate(() => {
      const h2s = document.querySelectorAll('h2');
      return h2s.length > 0 ? h2s[0].textContent : 'MISSING';
    });
    console.log('Cards: ' + cardCount + ', H1: ' + JSON.stringify(heading) + ', Section H2: ' + JSON.stringify(sectionH2));
    await ctx.close();
  }

  await browser.close();
  console.log('Done.');
})();
