const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1800);

  const sections = ['hero', 'impact', 'expertise', 'cases', 'process', 'about', 'contact'];
  for (const id of sections) {
    await page.evaluate((sectionId) => {
      const node = document.getElementById(sectionId);
      node?.scrollIntoView({ behavior: 'instant', block: 'start' });
    }, id);
    await page.waitForTimeout(900);

    await page.mouse.move(960, 540);
    await page.waitForTimeout(220);

    const state = await page.evaluate(() => {
      const lens = document.querySelector('[data-cursor-lens-layer]');
      const mirror = document.querySelector('[data-cursor-mirror-shell]');
      const mirrorIds = mirror ? mirror.querySelectorAll('[id]').length : -1;
      return {
        lensExists: !!lens,
        lensOpacity: lens ? getComputedStyle(lens).opacity : null,
        mirrorExists: !!mirror,
        mirrorIds,
        mirrorTransform: mirror ? getComputedStyle(mirror).transform : null,
        scrollY: Math.round(window.scrollY),
      };
    });

    console.log(`SECTION ${id}: ${JSON.stringify(state)}`);
    await page.screenshot({ path: `c:/VS CODEX/sergey-portfolio/_lens-${id}.png` });
  }

  await browser.close();
})();
