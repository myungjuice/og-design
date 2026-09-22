const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});try{
 const p=await b.newPage({viewport:{width:1440,height:1000}});
 await p.goto('http://127.0.0.1:4173/design-system/canvas/#home-nearby');await p.waitForFunction(()=>document.querySelector('#viewport')?.getAttribute('aria-busy')==='false');
 assert.equal(await p.locator('#home-nearby .og-home-example').count(),3);assert.equal(await p.locator('[data-review-go="board-home-nearby"]').count(),1);
 assert.ok(await p.evaluate(()=>{const a=document.querySelector('#home-nearby'),m=document.querySelector('#home-category'),r=document.querySelector('#home-region');return a.offsetLeft===m.offsetLeft&&a.offsetTop>m.offsetTop+m.offsetHeight&&a.offsetTop+a.offsetHeight<=r.offsetTop+r.offsetHeight;}));
 await p.locator('#home-nearby [data-home-prompt]').click({force:true});await p.waitForFunction(()=>document.querySelector('#home-prompt-text').value.includes('.og-nearby-card'));assert.match(await p.locator('#home-prompt-text').inputValue(),/near_panel.dart/);
 await p.goto('http://127.0.0.1:4173/design-system/pages/my-info/');await p.evaluate(async()=>{const l=document.createElement('link');l.rel='stylesheet';l.href='/design-system/pages/home/nearby.css';document.head.append(l);await new Promise(r=>l.onload=r);const style=document.createElement('style');style.textContent='html,body{margin:0;padding:0;overflow-x:clip}';document.head.append(style);});
 for(const width of [320,375,414,768])for(const state of ['list','no-photo','empty']){
  await p.setViewportSize({width,height:800});await p.evaluate(async state=>{const {nearbyScreen}=await import('/design-system/pages/home/nearby.mjs');const {storeImage}=await import('/design-system/canvas/specimen-media.mjs');document.body.innerHTML=nearbyScreen({state,imageSrc:storeImage()});await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));},state);
  assert.ok(await p.locator('.og-sheet-body').evaluate(n=>n.scrollWidth<=n.clientWidth+1));assert.equal(await p.locator('.og-sheet-close').isVisible(),false);assert.equal(await p.locator('.og-sheet-footer').isVisible(),false);
  if(state==='empty')assert.equal(await p.locator('.og-nearby-card').count(),0);else assert.ok(await p.locator('.og-nearby-photo').first().evaluate(n=>Math.abs(n.getBoundingClientRect().height-350)<1));
  const missing=await p.evaluate(()=>{const css=[...document.styleSheets].find(s=>s.href?.endsWith('/nearby.css'));return [...new Set([...Array.from(css.cssRules).map(r=>r.cssText).join('').matchAll(/var\((--[^),]+)/g)].map(m=>m[1]))].filter(t=>!getComputedStyle(document.documentElement).getPropertyValue(t).trim());});assert.deepEqual(missing,[]);
  if(width===375)await p.screenshot({path:'/private/tmp/og-nearby-'+state+'.png'});
 }
 console.log('PASS nearby: three states, four widths, images, shared components, region, prompt, review');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
