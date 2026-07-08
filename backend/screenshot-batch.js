// Batch screenshot script for Gege Mould website
// Usage: node screenshot-batch.js
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SCREENSHOTS_DIR = path.join(__dirname, '..', 'screenshots');
const BASE_URL = 'http://localhost:3000';

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function screenshot(page, name, { width = 1440, height = 900, fullPage = false, locale = 'en', urlPath = '/', waitMs = 1500 } = {}) {
  const context = await page.context();
  await page.setViewportSize({ width, height });

  const url = locale === 'en'
    ? `${BASE_URL}${urlPath}`
    : `${BASE_URL}${urlPath}${urlPath.includes('?') ? '&' : '?'}lang=${locale}`;

  console.log(`  → ${name} (${width}x${height}, ${locale}) — ${url}`);
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(waitMs);

  const filePath = path.join(SCREENSHOTS_DIR, `${name}.png`);
  await page.screenshot({ path: filePath, fullPage });
  console.log(`    Saved: ${filePath}`);
  return filePath;
}

(async () => {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // ===== TASK 2: 404/500 Translation Screenshots =====
    console.log('\n── Task 2: 404 Translation Screenshots ──');
    await screenshot(page, 'task2-404-english', { urlPath: '/404.html', locale: 'en' });
    await screenshot(page, 'task2-404-arabic-rtl', { urlPath: '/404.html', locale: 'ar' });

    // ===== TASK 3: Homepage Image Layout Screenshots =====
    console.log('\n── Task 3: Homepage Image Section Screenshots ──');
    // Desktop English — scroll to intro section
    await screenshot(page, 'task3-homepage-desktop-en', { urlPath: '/index.html', locale: 'en', fullPage: true });
    await screenshot(page, 'task3-homepage-mobile-en', { urlPath: '/index.html', locale: 'en', width: 375, height: 812, fullPage: true });
    await screenshot(page, 'task3-homepage-desktop-ar-rtl', { urlPath: '/index.html', locale: 'ar', fullPage: true });

    // ===== TASK 5: Personal Verification Screenshots =====
    console.log('\n── Task 5: Personal Review Screenshots ──');
    await screenshot(page, 'task5-homepage-fullscroll', { urlPath: '/index.html', locale: 'en', fullPage: true });
    await screenshot(page, 'task5-news', { urlPath: '/news.html', locale: 'en', fullPage: true });
    await screenshot(page, 'task5-case-studies', { urlPath: '/case-studies.html', locale: 'en', fullPage: true });
    await screenshot(page, 'task5-about', { urlPath: '/about.html', locale: 'en', fullPage: true });
    await screenshot(page, 'task5-automotive-mold-solutions', { urlPath: '/automotive-mold-solutions.html', locale: 'en', fullPage: true });

    console.log('\n✅ All screenshots captured successfully!');
    console.log(`   Output directory: ${SCREENSHOTS_DIR}`);
  } catch (err) {
    console.error('❌ Screenshot error:', err.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
