const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');

(async () => {
 const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
 try {
  const page = await browser.newPage();
  const check = async (picker) => {
   const geometry = await page.locator(picker + ' .og-calendar-nav').evaluateAll(buttons => buttons.map(button => {
    const icon = button.querySelector('svg');
    if (!icon) return { icon: false };
    const bounds = button.getBoundingClientRect();
    const iconBounds = icon.getBoundingClientRect();
    const path = icon.querySelector('path');
    const box = path.getBBox();
    const center = new DOMPoint(box.x + box.width / 2, box.y + box.height / 2).matrixTransform(path.getScreenCTM());
    return { icon: true, width: bounds.width, height: bounds.height,
     dx: iconBounds.x + iconBounds.width / 2 - (bounds.x + bounds.width / 2),
     dy: iconBounds.y + iconBounds.height / 2 - (bounds.y + bounds.height / 2),
     pathDx: center.x - (bounds.x + bounds.width / 2),
     pathDy: center.y - (bounds.y + bounds.height / 2) };
   }));
   assert.equal(geometry.length, 2);
   for (const item of geometry) {
    assert.equal(item.icon, true, 'Month arrows must not depend on font glyph metrics');
    assert.equal(item.width, 48);
    assert.equal(item.height, 48);
    for (const axis of ['dx', 'dy', 'pathDx', 'pathDy']) assert.ok(Math.abs(item[axis]) < 0.5, `${axis}: ${item[axis]}`);
   }
  };
  for (const width of [320, 375, 414, 768]) {
   await page.setViewportSize({ width, height: 1000 });
   for (const [section, picker] of [['date-picker', '#v2-date-live'], ['range-picker', '#v2-range-live']]) {
    await page.goto('http://127.0.0.1:4173/v2/components/#' + section);
    await page.locator(picker).waitFor({ state: 'visible' });
    await check(picker);
    const next = page.locator(picker + ' [data-month-step="1"]');
    await next.hover();
    await check(picker);
    await next.focus();
    await check(picker);
    await next.click();
    await check(picker);
    await page.locator(picker + ' [data-month-step="-1"]').click();
    await check(picker);
   }
  }
  await page.setViewportSize({ width: 390, height: 1000 });
  await page.goto('http://127.0.0.1:4173/v2/components/#date-picker');
  await page.locator('#v2-date-live').screenshot({ path: '/private/tmp/og-calendar-nav-390.png' });
  console.log('Calendar arrows centered: date/range, 4 widths, hover/focus and month changes.');
 } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
