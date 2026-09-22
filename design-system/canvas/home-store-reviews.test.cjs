const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});try{
 const p=await b.newPage({viewport:{width:1440,height:1000}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:4173/design-system/canvas/#home-store-reviews');await p.waitForFunction(()=>document.querySelector('#viewport')?.getAttribute('aria-busy')==='false');
 assert.equal(await p.locator('#home-store-reviews .screen-artboard').count(),4);assert.equal(await p.locator('[data-review-go="board-home-store-reviews"]').count(),1);
 assert.ok(await p.evaluate(()=>{const a=document.querySelector('#home-store-reviews'),r=document.querySelector('#home-region');return a.offsetTop+a.offsetHeight<=r.offsetTop+r.offsetHeight;}));
 await p.locator('#home-store-reviews [data-home-prompt]').click({force:true});await p.waitForFunction(()=>document.querySelector('#home-prompt-text').value.includes('.og-praise-row'));
 await p.goto('http://127.0.0.1:4173/design-system/pages/my-info/');await p.evaluate(async()=>{const l=document.createElement('link');l.rel='stylesheet';l.href='/design-system/pages/home/store-reviews.css';document.head.append(l);await new Promise(r=>l.onload=r);const s=document.createElement('style');s.textContent='html,body{margin:0;padding:0;overflow-x:clip}';document.head.append(s);});
 for(const width of [320,375,414,768])for(const state of ['default','expanded','empty-eligible','empty-ineligible']){
  await p.setViewportSize({width,height:800});await p.evaluate(async state=>{const {storeReviewsScreen}=await import('/design-system/pages/home/store-reviews.mjs');const {storeImage}=await import('/design-system/canvas/specimen-media.mjs');document.body.innerHTML=storeReviewsScreen({state,imageSrc:storeImage()});await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));},state);
  assert.ok(await p.locator('.og-store-reviews').evaluate(n=>n.scrollWidth<=n.clientWidth+1));assert.equal(await p.locator('.og-praise-row').count(),state==='default'?5:state==='expanded'?7:0);
  assert.equal(await p.locator('.og-store-review-card').count(),state.startsWith('empty')?0:2);
  assert.ok(await p.evaluate(async()=>{const css=await(await fetch('/design-system/pages/home/store-reviews.css')).text(),r=getComputedStyle(document.documentElement);return [...css.matchAll(/var\((--app-[\w-]+)/g)].every(m=>r.getPropertyValue(m[1]).trim());}));
  if(width===375){await p.screenshot({path:'/private/tmp/og-reviews-'+state+'.png'});if(state==='default'){await p.locator('.og-store-body').evaluate(n=>n.scrollTop=n.scrollHeight);await p.screenshot({path:'/private/tmp/og-reviews-bottom.png'});}}
 }
 assert.deepEqual(errors,[]);console.log('PASS reviews: four states × four widths, counts, token checks, review and prompt');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
