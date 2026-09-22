const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});try{
 const p=await b.newPage({viewport:{width:1440,height:1000}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:4173/design-system/canvas/#home-event-list');await p.waitForFunction(()=>document.querySelector('#viewport')?.getAttribute('aria-busy')==='false');
 for(const kind of ['list','detail']){
  await p.locator('[data-screen-link="home-event-'+kind+'"]').click();assert.equal(await p.locator('#home-event-'+kind+' .screen-artboard').count(),2);assert.equal(await p.locator('[data-review-go="board-home-event-'+kind+'"]').count(),1);
  assert.ok(await p.evaluate(kind=>{const a=document.querySelector('#home-event-'+kind),r=document.querySelector('#home-region');return a.offsetTop+a.offsetHeight<=r.offsetTop+r.offsetHeight;},kind));
  await p.locator('#home-event-'+kind+' [data-home-prompt]').click({force:true});await p.waitForFunction(()=>document.querySelector('#home-prompt-text').value.includes('.og-reading-period'));await p.locator('#home-prompt-dialog [data-close]').click();
 }
 await p.goto('http://127.0.0.1:4173/design-system/pages/my-info/');await p.evaluate(async()=>{const l=document.createElement('link');l.rel='stylesheet';l.href='/design-system/pages/home/event-pages.css';document.head.append(l);await new Promise(r=>l.onload=r);const s=document.createElement('style');s.textContent='html,body{margin:0;padding:0;overflow-x:clip}';document.head.append(s);});
 for(const width of [320,375,414,768])for(const kind of ['list','detail'])for(const empty of [false,true]){
  await p.setViewportSize({width,height:800});await p.evaluate(async({kind,empty})=>{const {eventPagesBoard}=await import('/design-system/pages/home/event-pages.mjs');const {storeImage}=await import('/design-system/canvas/specimen-media.mjs');const holder=document.createElement('div');holder.innerHTML=eventPagesBoard(kind,{imageSrc:storeImage()});document.body.replaceChildren(holder.querySelectorAll('.og-news-page')[empty?1:0]);await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));},{kind,empty});
  assert.ok(await p.locator('.og-news-page').evaluate(n=>n.scrollWidth<=n.clientWidth+1));
  assert.ok(await p.evaluate(async()=>{const css=await(await fetch('/design-system/pages/home/event-pages.css')).text(),r=getComputedStyle(document.documentElement);return [...css.matchAll(/var\((--[\w-]+)/g)].every(m=>r.getPropertyValue(m[1]).trim());}));
  if(kind==='list'){assert.equal(await p.locator('.og-event-brand').count(),1);assert.equal(await p.locator('.og-update-row').count(),empty?0:4);}
  if(kind==='detail'){assert.equal(await p.locator('.og-reading-period').count(),1);if(!empty)assert.ok(await p.locator('.og-news-article img').evaluate(i=>Math.abs(i.width/i.height-i.naturalWidth/i.naturalHeight)<.01));}
  if(width===375)await p.screenshot({path:'/private/tmp/og-event-'+kind+'-'+empty+'.png'});
 }
 assert.deepEqual(errors,[]);console.log('PASS event pages: four states × four widths, logo, period, aspect, review, prompts and tokens');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
