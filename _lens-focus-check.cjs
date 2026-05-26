const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1600);

  await page.mouse.move(930, 430);
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'c:/VS CODEX/sergey-portfolio/_lens-hero-focus.png' });

  await page.evaluate(() => document.getElementById('impact')?.scrollIntoView({ behavior: 'instant', block: 'start' }));
  await page.waitForTimeout(1000);
  await page.mouse.move(620, 185);
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'c:/VS CODEX/sergey-portfolio/_lens-impact-focus.png' });

  await browser.close();
})();
