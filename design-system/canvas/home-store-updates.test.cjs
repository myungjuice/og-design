const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});try{
 const p=await b.newPage({viewport:{width:1440,height:1000}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:4173/design-system/canvas/#home-store-news');await p.waitForFunction(()=>document.querySelector('#viewport')?.getAttribute('aria-busy')==='false');
 for(const kind of ['news','event']){
  await p.locator('[data-screen-link="home-store-'+kind+'"]').click();
  assert.equal(await p.locator('#home-store-'+kind+' .screen-artboard').count(),2);assert.equal(await p.locator('[data-review-go="board-home-store-'+kind+'"]').count(),1);
  assert.ok(await p.evaluate(kind=>{const a=document.querySelector('#home-store-'+kind),r=document.querySelector('#home-region');return a.offsetLeft>=r.offsetLeft&&a.offsetTop+a.offsetHeight<=r.offsetTop+r.offsetHeight;},kind));
  await p.locator('#home-store-'+kind+' [data-home-prompt]').click({force:true});await p.waitForFunction(()=>document.querySelector('#home-prompt-text').value.includes('.og-update-row'));await p.locator('#home-prompt-dialog [data-close]').click();
 }
 await p.goto('http://127.0.0.1:4173/design-system/pages/my-info/');await p.evaluate(async()=>{const l=document.createElement('link');l.rel='stylesheet';l.href='/design-system/pages/home/store-updates.css';document.head.append(l);await new Promise(r=>l.onload=r);const s=document.createElement('style');s.textContent='html,body{margin:0;padding:0;overflow-x:clip}';document.head.append(s);});
 for(const width of [320,375,414,768])for(const kind of ['news','event'])for(const alternate of [false,true]){
  await p.setViewportSize({width,height:800});await p.evaluate(async({kind,alternate})=>{const {updatesScreen}=await import('/design-system/pages/home/store-updates.mjs');const {storeImage}=await import('/design-system/canvas/specimen-media.mjs');document.body.innerHTML=updatesScreen(kind,{alternate,imageSrc:storeImage()});await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));},{kind,alternate});
  assert.ok(await p.locator('.og-store-updates').evaluate(n=>n.scrollWidth<=n.clientWidth+1));assert.equal(await p.locator('.og-update-row').count(),2);
  assert.equal(await p.locator('.og-update-row>.og-thumbnail').count(),kind==='news'&&alternate?0:1);
  assert.ok(await p.evaluate(async()=>{const css=await(await fetch('/design-system/pages/home/store-updates.css')).text(),root=getComputedStyle(document.documentElement);return [...css.matchAll(/var\((--[\w-]+)/g)].every(m=>root.getPropertyValue(m[1]).trim());}));
  if(kind==='event'&&!alternate)assert.ok(await p.locator('.og-update-title>.material-icons').first().evaluate(n=>getComputedStyle(n).color!==getComputedStyle(n.parentElement).color));
  if(width===375)await p.screenshot({path:'/private/tmp/og-'+kind+'-'+alternate+'.png'});
 }
 assert.deepEqual(errors,[]);console.log('PASS updates: four states at four widths, limits/photos, status icon, tokens, review and prompts');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
