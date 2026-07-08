// Visual sweep — screenshot all 17 pages
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SCREENSHOTS_DIR = path.join(__dirname, '..', 'screenshots', 'sweep');
const BASE_URL = 'http://localhost:3000';

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const PAGES = [
  'index.html',
  'about.html',
  'capabilities.html',
  'capability-table.html',
  'quality.html',
  'industries.html',
  'automotive-mold-solutions.html',
  'contact.html',
  'rfq.html',
  'case-studies.html',
  'case-study-export.html',
  'news.html',
  'faqs.html',
  'blog-conformal-cooling.html',
  'blog-gate-location.html',
  'blog-material-selection.html',
  'blog-tolerances.html',
];

(async () => {
  console.log('Launching browser for visual sweep...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  try {
    for (const p of PAGES) {
      const name = p.replace('.html', '').replace(/-/g, '_');
      const url = `${BASE_URL}/${p}`;
      console.log(`  → ${name}`);
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(1500);

      const filePath = path.join(SCREENSHOTS_DIR, `${name}.png`);
      await page.screenshot({ path: filePath, fullPage: true });
      console.log(`    Saved: ${path.basename(filePath)}`);
    }

    // Also capture 404 and 500
    for (const ep of ['404.html', '500.html']) {
      const name = ep.replace('.html', '');
      console.log(`  → ${name}`);
      await page.goto(`${BASE_URL}/${ep}`, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(1000);
      const filePath = path.join(SCREENSHOTS_DIR, `${name}.png`);
      await page.screenshot({ path: filePath, fullPage: true });
      console.log(`    Saved: ${path.basename(filePath)}`);
    }

    console.log('\n✅ Visual sweep screenshots complete!');
    console.log(`   Output: ${SCREENSHOTS_DIR}`);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
