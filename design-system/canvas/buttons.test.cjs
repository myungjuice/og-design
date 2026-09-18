const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});try{
 const context=await browser.newContext({viewport:{width:1440,height:1000},permissions:['clipboard-read','clipboard-write']});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4173/design-system/canvas/');
 assert.equal(await page.locator('#buttons').count(),1);
 assert.equal(await page.locator('[data-button-variant]').count(),5);
 assert.equal(await page.locator('#buttons > .button-states .button-state').count(),8);
 assert.equal(await page.locator('#favorite-specimen .og-favorite').count(),2);
 await page.locator('[data-board="buttons"]').click();
 await page.locator('[data-prompt="primary"]').click();
 assert(await page.locator('#button-prompt-dialog').evaluate(e=>e.open));
 const prompt=await page.locator('#button-prompt-text').inputValue();assert(prompt.includes('#0022e9'));assert(prompt.includes('Flutter'));assert(prompt.includes('사진은 별도'));
 await page.locator('#button-prompt-copy').click();assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),prompt);
 await page.keyboard.press('Escape');assert(await page.locator('[data-prompt="primary"]').evaluate(e=>e===document.activeElement));
 for(const width of [320,375,414,768]){
  await page.setViewportSize({width,height:900});await page.locator('#board-picker').selectOption('buttons');
  await page.locator('[data-prompt="primary"]').click();
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  assert(await page.locator('#button-prompt-dialog').evaluate(e=>e.scrollWidth<=e.clientWidth));
  await page.keyboard.press('Escape');
 }
 assert.deepEqual(errors,[]);await page.setViewportSize({width:1440,height:1100});await page.locator('[data-board="buttons"]').click();await page.screenshot({path:'/private/tmp/og-buttons.png'});
 console.log('PASS: variants, states, prompt values, clipboard, focus return, responsive dialog');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
