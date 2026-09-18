const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.goto('http://127.0.0.1:4173/design-system/canvas/');
    assert.equal(await page.locator('.board').count(), 29, 'nine foundation boards and button board');
    const before = await page.locator('#zoom-value').textContent();
    await page.getByRole('button', { name: '확대', exact: true }).click();
    assert.notEqual(await page.locator('#zoom-value').textContent(), before);
    await page.getByRole('button', { name: '100%', exact: true }).click();
    assert.equal(await page.locator('#zoom-value').textContent(), '100%');
    const initial = await page.locator('#world').getAttribute('style');
    await page.mouse.move(220, 100); await page.mouse.down(); await page.mouse.move(300, 150); await page.mouse.up();
    assert.notEqual(await page.locator('#world').getAttribute('style'), initial, 'drag pans');
    await page.locator('[data-board="color"]').click();
    const board = await page.locator('#color').boundingBox();
    const prior = await page.locator('#world').getAttribute('style');
    await page.mouse.move(board.x+100,board.y+100); await page.mouse.down(); await page.mouse.move(board.x+180,board.y+140); await page.mouse.up();
    assert.notEqual(await page.locator('#world').getAttribute('style'),prior,'drag on white page pans');
    await page.locator('[data-board="color"]').click();
    const promptBefore = await page.locator('#world').getAttribute('style');
    await page.locator('[data-board-prompt="color"]').click();
    assert.equal(await page.locator('#world').getAttribute('style'),promptBefore,'prompt button does not pan');
    assert(await page.locator('#board-prompt-text').isVisible(),'prompt opens');
    await page.keyboard.press('Escape');
    for (const width of [320, 375, 414, 768]) {
      await page.setViewportSize({ width, height: 900 });
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'no root overflow '+width);
      await page.locator('#fit').click();
    }
    assert.deepEqual(errors, []);
    await page.setViewportSize({ width: 1440, height: 960 });
    await page.locator('#fit').click();
    await page.screenshot({ path: '/private/tmp/og-foundations-canvas.png' });
    console.log('PASS: foundation boards, zoom, pan, fit, responsive widths, no script errors');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
