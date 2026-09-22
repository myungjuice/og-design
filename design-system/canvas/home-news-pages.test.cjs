const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});try{
 const p=await b.newPage({viewport:{width:1440,height:1000}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:4173/design-system/canvas/#home-news-list');await p.waitForFunction(()=>document.querySelector('#viewport')?.getAttribute('aria-busy')==='false');
 for(const kind of ['list','detail']){
  await p.locator('[data-screen-link="home-news-'+kind+'"]').click();assert.equal(await p.locator('#home-news-'+kind+' .screen-artboard').count(),2);assert.equal(await p.locator('[data-review-go="board-home-news-'+kind+'"]').count(),1);
  assert.ok(await p.evaluate(kind=>{const a=document.querySelector('#home-news-'+kind),r=document.querySelector('#home-region');return a.offsetTop+a.offsetHeight<=r.offsetTop+r.offsetHeight;},kind));
  await p.locator('#home-news-'+kind+' [data-home-prompt]').click({force:true});await p.waitForFunction(()=>document.querySelector('#home-prompt-text').value.includes('.og-news-page'));await p.locator('#home-prompt-dialog [data-close]').click();
 }
 await p.goto('http://127.0.0.1:4173/design-system/pages/my-info/');await p.evaluate(async()=>{const l=document.createElement('link');l.rel='stylesheet';l.href='/design-system/pages/home/news-pages.css';document.head.append(l);await new Promise(r=>l.onload=r);const s=document.createElement('style');s.textContent='html,body{margin:0;padding:0;overflow-x:clip}';document.head.append(s);});
 for(const width of [320,375,414,768])for(const kind of ['list','detail'])for(const empty of [false,true]){
  await p.setViewportSize({width,height:800});await p.evaluate(async({kind,empty})=>{const {newsListScreen,newsDetailScreen}=await import('/design-system/pages/home/news-pages.mjs');const {storeImage}=await import('/design-system/canvas/specimen-media.mjs');document.body.innerHTML=kind==='list'?newsListScreen({items:empty?[]:[{title:'회원점 소식 제목',date:'오늘. 9.19(토)',image:storeImage()},{title:'사진 없이 등록한 소식 제목',date:'어제. 9.18(금)'},{title:'이전 소식 제목',date:'9.12(토)',image:storeImage()}]}):newsDetailScreen({imageSrc:empty?'':storeImage()});await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));},{kind,empty});
  assert.ok(await p.locator('.og-news-page').evaluate(n=>n.scrollWidth<=n.clientWidth+1));
  assert.ok(await p.evaluate(async()=>{const css=await(await fetch('/design-system/pages/home/news-pages.css')).text(),r=getComputedStyle(document.documentElement);return [...css.matchAll(/var\((--[\w-]+)/g)].every(m=>r.getPropertyValue(m[1]).trim());}));
  if(kind==='list')assert.equal(await p.locator('.og-update-row').count(),empty?0:3);
  if(kind==='detail'&&!empty)assert.ok(await p.locator('.og-news-article img').evaluate(i=>Math.abs(i.width/i.height-i.naturalWidth/i.naturalHeight)<.01));
  if(width===375)await p.screenshot({path:'/private/tmp/og-news-'+kind+'-'+empty+'.png'});
 }
 assert.deepEqual(errors,[]);console.log('PASS news pages: four states × four widths, images/aspect, review, prompts and tokens');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
