const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});try{
 const p=await b.newPage({viewport:{width:1440,height:1000}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:4173/design-system/canvas/#home-search');await p.waitForFunction(()=>document.querySelector('#viewport')?.getAttribute('aria-busy')==='false');
 assert.equal(await p.locator('#home-search .og-home-search').count(),6);assert.equal(await p.locator('[data-review-go="board-home-search"]').count(),1);
 assert.ok(await p.evaluate(()=>{const a=document.querySelector('#home-search'),m=document.querySelector('#home-main'),r=document.querySelector('#home-region');return a.offsetLeft===m.offsetLeft&&a.offsetTop>m.offsetTop+m.offsetHeight&&a.offsetTop+a.offsetHeight<=r.offsetTop+r.offsetHeight;}));
 await p.locator('#home-search [data-home-prompt]').click({force:true});await p.waitForFunction(()=>document.querySelector('#home-prompt-text').value.includes('.og-home-search-panel'));assert.match(await p.locator('#home-prompt-text').inputValue(),/_historyResultWidget/);
 assert.deepEqual(errors,[]);
 await p.goto('http://127.0.0.1:4173/design-system/pages/my-info/');await p.evaluate(async()=>{const l=document.createElement('link');l.rel='stylesheet';l.href='/design-system/pages/home/search.css';document.head.append(l);await new Promise(r=>l.onload=r);const style=document.createElement('style');style.textContent='html,body{margin:0;padding:0;overflow-x:clip}';document.head.append(style);});
 for(const width of [320,375,414,768])for(const state of ['history','results','store-only','region-only','empty-history','empty-results']){
  await p.setViewportSize({width,height:800});await p.evaluate(async state=>{const {searchScreen}=await import('/design-system/pages/home/search.mjs');document.body.innerHTML=searchScreen({state});await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));},state);
  const result=await p.evaluate(()=>{const root=document.querySelector('.og-home-search-panel'),field=document.querySelector('.og-home-search-field'),css=[...document.styleSheets].find(s=>s.href?.endsWith('/search.css'));return {fits:root.scrollWidth<=root.clientWidth+1&&field.scrollWidth<=field.clientWidth+1,below:root.getBoundingClientRect().top>=field.getBoundingClientRect().bottom,missing:[...new Set([...Array.from(css.cssRules).map(r=>r.cssText).join('').matchAll(/var\((--[^),]+)/g)].map(m=>m[1]))].filter(t=>!getComputedStyle(document.documentElement).getPropertyValue(t).trim())};});
  assert.ok(result.fits);assert.ok(result.below);assert.deepEqual(result.missing,[]);
  if(width===375)await p.screenshot({path:'/private/tmp/og-search-'+state+'.png'});
 }
 console.log('PASS home search: six states, four widths, original images, region, prompt, review');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
