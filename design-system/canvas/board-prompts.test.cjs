const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});try{
 const context=await browser.newContext({viewport:{width:1440,height:1000},permissions:['clipboard-read','clipboard-write']});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4173/design-system/canvas/');
 assert.equal(await page.locator('[data-board-prompt]').count(),29);
 for(const id of ['color','type','space','depth','system','icons','layout','motion','layers','buttons']){
  await page.locator('[data-board="'+id+'"]').click();await page.locator('[data-board-prompt="'+id+'"]').click();
  await page.waitForFunction(()=>!document.querySelector('#board-prompt-copy').disabled);
  const text=await page.locator('#board-prompt-text').inputValue();assert(text.includes('Flutter'));assert(text.includes('--app-'));assert(!text.includes('전체 AI 프롬프트'));
  if(id==='depth')assert(text.includes('--app-shadow-card:'));
  if(id==='buttons'){assert(text.includes('.og-button'));assert(text.includes('위험 동작'));}
  await page.locator('#board-prompt-copy').click();assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),text);
  await page.keyboard.press('Escape');assert(await page.locator('[data-board-prompt="'+id+'"]').evaluate(e=>e===document.activeElement));
 }
 for(const width of [320,375,414,768]){await page.setViewportSize({width,height:900});await page.locator('#board-picker').selectOption('depth');await page.locator('[data-board-prompt="depth"]').click();assert(await page.locator('#board-prompt-dialog').evaluate(e=>e.scrollWidth<=e.clientWidth));await page.keyboard.press('Escape');}
 assert.deepEqual(errors,[]);console.log('PASS: 29 board prompts, live tokens, full button CSS, clipboard, focus, mobile');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
