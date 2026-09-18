const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4173/design-system/canvas/');
 assert.equal(await page.locator('.board').count(),29);
 assert.equal(await page.locator('link[href="../foundations/tokens.css"]').count(),0,'no legacy token dependency');
 for(const id of ['system','space','depth','icons','layout','motion','layers']){
  await page.locator('[data-board="'+id+'"]').click();
  const box=await page.locator('#'+id).boundingBox();assert(box.y>=75&&box.y<200,'board focus '+id);
  assert(await page.locator('#'+id+' [data-token]').count()>0,'specifications '+id);
 }
 const values=await page.evaluate(()=>{const s=getComputedStyle(document.documentElement);return ['--app-action','--app-title-1-size','--app-space-4','--app-z-dialog','--app-motion-feedback'].map(k=>s.getPropertyValue(k).trim());});
 assert(values.every(Boolean));assert.equal(values[0],'#0022e9');
 await page.locator('[data-board="motion"]').click();
 assert.equal(await page.locator('#motion-toggle').count(),0);
 assert.equal(await page.locator('#motion-sample').getAttribute('aria-hidden'),'false');
 await page.emulateMedia({reducedMotion:'reduce'});
 assert.equal(await page.locator('#motion-sample').evaluate(e=>getComputedStyle(e).transitionDuration),'0s');
 for(const width of [320,375,414,768]){await page.setViewportSize({width,height:900});await page.locator('#board-picker').selectOption('layout');assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
 assert.deepEqual(errors,[]);console.log('PASS: 29 boards, standalone tokens, focus navigation, specifications, motion/reduced-motion, mobile');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
