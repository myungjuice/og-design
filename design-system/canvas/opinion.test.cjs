const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4173/design-system/canvas/#my-info-opinion');await page.waitForFunction(()=>document.querySelector('#viewport')?.getAttribute('aria-busy')==='false');
 assert.equal(await page.locator('#my-info-opinion .og-opinion').count(),7);assert.equal(await page.locator('[data-review-go="board-my-info-opinion"]').count(),1);
 await page.locator('#my-info-opinion [data-screen-prompt]').click({force:true});await page.waitForFunction(()=>document.querySelector('#screen-prompt-text').value.includes('.og-opinion-form'));
 assert.match(await page.locator('#screen-prompt-text').inputValue(),/customer_request.dart/);
 await page.goto('http://127.0.0.1:4173/design-system/pages/my-info/');
 await page.evaluate(async()=>{const link=document.createElement('link');link.rel='stylesheet';link.href='/design-system/pages/my-info/opinion.css';document.head.append(link);await new Promise(r=>link.onload=r);const s=document.createElement('style');s.textContent='html,body{margin:0;padding:0;overflow-x:clip}';document.head.append(s);});
 for(const width of [320,375,414,768])for(let state=0;state<7;state++){
  await page.setViewportSize({width,height:820});
  await page.evaluate(async state=>{const {opinionBoard}=await import('/design-system/pages/my-info/opinion.mjs');const {storeImage}=await import('/design-system/canvas/specimen-media.mjs');const wrapper=document.createElement('div');wrapper.innerHTML=opinionBoard({imageSrc:storeImage()});document.body.replaceChildren(wrapper.querySelectorAll('.og-opinion')[state]);await document.fonts.ready;},state);
  if(state===1||state===2){assert.equal(await page.locator('.og-opinion > .og-opinion-submit').count(),1,'submit stays outside scrolling form');assert.ok(await page.locator('.og-opinion-submit').evaluate(n=>n.getBoundingClientRect().bottom<=800));}
  assert.ok(await page.locator('.og-opinion-scroll').evaluate(n=>n.scrollWidth<=n.clientWidth+1),'no horizontal overflow '+width+' '+state);
  assert.ok(await page.locator('.og-opinion').evaluate(n=>n.getBoundingClientRect().width<=innerWidth+1));
  const missing=await page.evaluate(()=>{const css=[...document.styleSheets].find(s=>s.href?.endsWith('/opinion.css'));return [...new Set([...Array.from(css.cssRules).map(r=>r.cssText).join('').matchAll(/var\((--[^),]+)/g)].map(m=>m[1]))].filter(t=>!getComputedStyle(document.documentElement).getPropertyValue(t).trim());});assert.deepEqual(missing,[]);
  if(width===375||width===320)await page.screenshot({path:'/private/tmp/opinion-'+state+'-'+width+'.png'});
 }
 assert.deepEqual(errors,[]);console.log('PASS opinion: seven states, four widths, defined tokens, AI prompt and review registration');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
