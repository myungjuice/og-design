const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const assert = require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4173/design-system/canvas/');
 assert.equal(await page.locator('[data-palette-swatch]').count(),27,'3 ramps × 9 shades');
 assert(!/Apple|HIG|WCAG|대비 판정|표본 최저|4\.5:1|3:1/.test(await page.locator('body').innerText()),'no research or contrast prose');
 for(const family of ['primary','secondary','gray']){
  assert.equal(await page.locator('[data-palette="'+family+'"] [data-palette-swatch]').count(),9);
 }
 assert.equal(await page.locator('[data-contrast-row]').count(),12,'12 semantic contrast specimens');
 const ratios=await page.locator('[data-contrast-row]').evaluateAll(rows=>rows.map(r=>({ratio:Number(r.dataset.ratio),min:Number(r.dataset.minimum)})));
 assert(ratios.every(r=>Number.isFinite(r.ratio)&&r.ratio>=r.min),'text and control contrast floors');
 assert.equal(await page.locator('[data-gradient]').count(),4,'four documented gradients');
 for(const card of await page.locator('[data-gradient]').all()){
  assert(await card.locator('.gradient-stops li').count()>=2);
  assert((await card.locator('pre').textContent()).includes('linear-gradient('));
  assert.notEqual(await card.locator('.gradient-preview').evaluate(e=>getComputedStyle(e).backgroundImage),'none');
 }
 assert.equal(await page.locator('[data-type-spec]').count(),7);
 assert.equal(await page.locator('[data-provenance]').count(),0,'no provisional-status labels');
 assert(!/기초 기준|내 정보 v2|공식 BI|신규 제안|통합 제안|공통화 제안|정책.*확인|실제 데이터.*연결/.test(await page.locator('body').innerText()),'design copy has no workflow disclaimers');
 assert.equal(await page.locator('#foundation-region h2').textContent(),'기본 스타일');
 await page.locator('[data-board="type"]').click();
 async function reachTypeControls(){
  await page.waitForTimeout(100);
  await page.locator('[data-board="type"]').click();
  const box=await page.locator('.text-size-controls').boundingBox();
  const view=await page.locator('#viewport').boundingBox();
  await page.mouse.move(view.x+100,view.y+200);
  await page.mouse.wheel(0,box.y-view.y-80);
  await page.waitForTimeout(100);
 }
 const base=await page.locator('.reading-sample .sample-store').evaluate(e=>getComputedStyle(e).fontSize);
 const controlBox=await page.locator('.text-size-controls').boundingBox();
 const viewportBox=await page.locator('#viewport').boundingBox();
 await page.mouse.move(viewportBox.x+100,viewportBox.y+200);
 await page.mouse.wheel(0,controlBox.y-viewportBox.y-80);
 await page.getByRole('button',{name:'글자 150%'}).click();
 assert.equal(await page.locator('.reading-sample .sample-store').evaluate(e=>parseFloat(getComputedStyle(e).fontSize)),parseFloat(base)*1.5);
 await reachTypeControls();
 await page.getByRole('button',{name:'글자 200%'}).click();
 const enlarged=await page.locator('.reading-sample .sample-store').evaluate(e=>getComputedStyle(e).fontSize);
 assert.equal(parseFloat(enlarged),parseFloat(base)*2);
 assert(await page.locator('.reading-sample').evaluate(e=>e.scrollWidth<=e.clientWidth),'200% content must fit 320px frame');
 assert(await page.locator('.sample-amount').evaluate(e=>e.scrollWidth<=e.clientWidth),'amount remains visible');
 await page.screenshot({path:'/private/tmp/og-foundations-text-200.png'});
 await reachTypeControls();
 await page.getByRole('button',{name:'글자 100%'}).click();
 assert.equal(await page.locator('.reading-sample .sample-store').evaluate(e=>getComputedStyle(e).fontSize),base);
 for(const width of [320,375,414,768]){
 await page.setViewportSize({width,height:900});
 await page.locator('#board-picker').selectOption('type');
 await page.locator('#fit').click();
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 }
 assert.deepEqual(errors,[]);
 await page.setViewportSize({width:1440,height:1000});
 await page.locator('[data-board="color"]').click();
 await page.screenshot({path:'/private/tmp/og-foundations-color.png'});
 await page.locator('[data-board="type"]').click();
 await page.screenshot({path:'/private/tmp/og-foundations-type.png'});
 console.log('PASS: semantic pairs, origins, type specs, 200% text, 320px specimen, mobile navigation');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
