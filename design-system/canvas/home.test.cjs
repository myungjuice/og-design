const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});try{
 const p=await b.newPage({viewport:{width:1440,height:1000}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:4173/design-system/canvas/#home-main');await p.waitForFunction(()=>document.querySelector('#viewport')?.getAttribute('aria-busy')==='false');
 assert.equal(await p.locator('#home-main .og-home').count(),3);assert.equal(await p.locator('[data-review-go="board-home-main"]').count(),1);
 assert.ok(await p.evaluate(()=>{const a=document.querySelector('#home-main'),r=document.querySelector('#home-region'),m=document.querySelector('#screen-region');return a.offsetLeft>=r.offsetLeft&&a.offsetLeft+a.offsetWidth<=r.offsetLeft+r.offsetWidth&&a.offsetTop+a.offsetHeight<=r.offsetTop+r.offsetHeight&&r.offsetLeft>=m.offsetLeft+m.offsetWidth&&r.offsetTop===m.offsetTop;}));
 await p.locator('#home-main [data-home-prompt]').click({force:true});await p.waitForFunction(()=>document.querySelector('#home-prompt-text').value.includes('.og-home-map'));
 assert.match(await p.locator('#home-prompt-text').inputValue(),/my_navermap.dart/);assert.deepEqual(errors,[]);
 await p.goto('http://127.0.0.1:4173/design-system/pages/my-info/');await p.evaluate(async()=>{const l=document.createElement('link');l.rel='stylesheet';l.href='/design-system/pages/home/home.css';document.head.append(l);await new Promise(r=>l.onload=r);const style=document.createElement('style');style.textContent='html,body{margin:0;padding:0;overflow-x:clip}';document.head.append(style);});
 for(const width of [320,375,414,768])for(const state of ['default','cluster','new']){
  await p.setViewportSize({width,height:800});await p.evaluate(async state=>{const {homeScreen}=await import('/design-system/pages/home/render.mjs');document.body.innerHTML=homeScreen({state});await document.fonts.ready;},state);
  assert.ok(await p.locator('.og-home .og-search input').evaluate(n=>parseFloat(getComputedStyle(n).paddingLeft)>=44),'search text clears icon');
  const result=await p.evaluate(()=>{const root=document.querySelector('.og-home'),nav=root.querySelector('nav'),css=[...document.styleSheets].find(s=>s.href?.endsWith('/home.css'));return {fits:root.scrollWidth<=root.clientWidth+1,nav:nav.getBoundingClientRect().bottom,missing:[...new Set([...Array.from(css.cssRules).map(r=>r.cssText).join('').matchAll(/var\((--[^),]+)/g)].map(m=>m[1]))].filter(t=>!getComputedStyle(document.documentElement).getPropertyValue(t).trim()),images:[...root.querySelectorAll('img')].every(i=>i.complete&&i.naturalWidth>0)};});
  assert.ok(result.fits);assert.ok(result.nav<=801);assert.deepEqual(result.missing,[]);assert.ok(result.images);
  if(width===375)await p.screenshot({path:'/private/tmp/og-home-'+state+'.png'});
 }
 console.log('PASS home: three states, four widths, tokens, images, region, prompt, review');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
