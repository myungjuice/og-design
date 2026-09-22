const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});try{
 const p=await b.newPage({viewport:{width:1440,height:1000}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:4173/design-system/canvas/#home-store-info');await p.waitForFunction(()=>document.querySelector('#viewport')?.getAttribute('aria-busy')==='false');
 for(const [kind,count] of [['info',2],['location',1]]){
  assert.equal(await p.locator('#home-store-'+kind+' .screen-artboard').count(),count);assert.equal(await p.locator('[data-review-go="board-home-store-'+kind+'"]').count(),1);
  assert.ok(await p.evaluate(kind=>{const a=document.querySelector('#home-store-'+kind),r=document.querySelector('#home-region');return a.offsetTop+a.offsetHeight<=r.offsetTop+r.offsetHeight;},kind));
  await p.evaluate(async kind=>{const {focusBoard}=await import('/design-system/canvas/canvas.js?v=20260919-partitions');focusBoard('home-store-'+kind);},kind);
  await p.locator('#home-store-'+kind+' [data-home-prompt]').click({force:true});await p.waitForFunction(()=>document.querySelector('#home-prompt-text').value.includes('.og-navigation-sheet'));
  await p.locator('#home-prompt-dialog [data-close]').click();
 }
 assert.equal(await p.locator('[data-family="home"] .screen-artboard').count(),58);
 await p.goto('http://127.0.0.1:4173/design-system/pages/my-info/');await p.evaluate(async()=>{const l=document.createElement('link');l.rel='stylesheet';l.href='/design-system/pages/home/store-info.css';document.head.append(l);await new Promise(r=>l.onload=r);const s=document.createElement('style');s.textContent='html,body{margin:0;padding:0;overflow-x:clip}';document.head.append(s);});
 for(const width of [320,375,414,768])for(const state of ['full','minimal','location']){
  await p.setViewportSize({width,height:800});await p.evaluate(async state=>{const {storeInfoScreen}=await import('/design-system/pages/home/store-info.mjs');document.body.innerHTML=storeInfoScreen({minimal:state==='minimal',location:state==='location'});await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));},state);
  assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  assert.ok(await p.evaluate(()=>[...document.querySelectorAll('.og-store-info-card,.og-navigation-sheet,.og-navigation-provider')].every(n=>n.scrollWidth<=n.clientWidth+1)));
  assert.equal(await p.locator('.og-store-contacts .og-store-contact-row').count(),state==='minimal'?1:5);
  assert.ok(await p.evaluate(async()=>{const css=await(await fetch('/design-system/pages/home/store-info.css')).text(),r=getComputedStyle(document.documentElement);return [...css.matchAll(/var\((--app-[\w-]+)/g)].every(m=>r.getPropertyValue(m[1]).trim());}));
  if(state==='location')assert.ok(await p.evaluate(()=>[...document.querySelectorAll('.og-navigation-provider')].every(n=>{const a=n.querySelector('img').getBoundingClientRect(),b=n.querySelector('span').getBoundingClientRect();return b.left>=a.right&&b.right<=n.getBoundingClientRect().right+1;})));
  if(width===375)await p.screenshot({path:'/private/tmp/og-store-info-'+state+'.png'});
 }
 assert.deepEqual(errors,[]);console.log('PASS store info: 3 states × 4 widths, 58 home states, review registration, prompts, assets and layout');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
