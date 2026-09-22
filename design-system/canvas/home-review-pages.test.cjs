const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});try{
 const p=await b.newPage({viewport:{width:1440,height:1000}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:4173/design-system/canvas/#home-review-list');await p.waitForFunction(()=>document.querySelector('#viewport')?.getAttribute('aria-busy')==='false');
 for(const [kind,count] of [['list',2],['photo',3]]){
  assert.equal(await p.locator('#home-review-'+kind+' .screen-artboard').count(),count);
  assert.equal(await p.locator('[data-review-go="board-home-review-'+kind+'"]').count(),1);
  assert.ok(await p.evaluate(kind=>{const a=document.querySelector('#home-review-'+kind),r=document.querySelector('#home-region');return a.offsetTop+a.offsetHeight<=r.offsetTop+r.offsetHeight;},kind));
  await p.evaluate(async kind=>{const {focusBoard}=await import('/design-system/canvas/canvas.js?v=20260919-partitions');focusBoard('home-review-'+kind);},kind);
  await p.locator('#home-review-'+kind+' [data-home-prompt]').click({force:true});await p.waitForFunction(()=>document.querySelector('#home-prompt-text').value.includes('.og-review-photo-copy'));
  assert.ok((await p.locator('#home-prompt-text').inputValue()).includes('review_picture_page.dart'));
  await p.locator('#home-prompt-dialog [data-close]').click();
 }
 assert.ok(await p.locator('[data-family="home"] .screen-artboard').count()>=55);
 await p.goto('http://127.0.0.1:4173/design-system/pages/my-info/');await p.evaluate(async()=>{const l=document.createElement('link');l.rel='stylesheet';l.href='/design-system/pages/home/review-pages.css';document.head.append(l);await new Promise(r=>l.onload=r);const s=document.createElement('style');s.textContent='html,body{margin:0;padding:0;overflow-x:clip}';document.head.append(s);});
 for(const width of [320,375,414,768])for(const state of ['list','list-expanded','photo','photo-expanded','photo-contain']){
  await p.setViewportSize({width,height:800});await p.evaluate(async state=>{const m=await import('/design-system/pages/home/review-pages.mjs');const {storeImage}=await import('/design-system/canvas/specimen-media.mjs');const text='첫 번째 리뷰 문단입니다.\n매장에 방문한 날의 내용을 남겼습니다.\n사진에 대한 설명입니다.\n\n두 번째 문단입니다.\n글을 펼쳤을 때 이어지는 내용입니다.';document.body.innerHTML=state.startsWith('list')?m.reviewListScreen({items:[{text,images:[storeImage(),storeImage(),storeImage()]},{text:'사진 없는 리뷰입니다.'}],expandedIndex:state.endsWith('expanded')?0:-1}):m.reviewPhotoScreen({text,imageSrc:storeImage(),expanded:state.endsWith('expanded'),fit:state.endsWith('contain')?'contain':'cover'});await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));},state);
  assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  assert.ok(await p.evaluate(()=>[...document.querySelectorAll('.og-review-list-body,.og-review-photo-copy')].every(n=>n.scrollWidth<=n.clientWidth+1)));
  assert.ok(await p.evaluate(async()=>{const css=await(await fetch('/design-system/pages/home/review-pages.css')).text(),r=getComputedStyle(document.documentElement);return [...css.matchAll(/var\((--app-[\w-]+)/g)].every(m=>r.getPropertyValue(m[1]).trim());}));
  if(!state.startsWith('list'))assert.equal(await p.locator('.og-review-photo-image>img').evaluate(n=>getComputedStyle(n).objectFit),state.endsWith('contain')?'contain':'cover');
  if(!state.startsWith('list'))assert.ok(await p.evaluate(()=>{const n=document.querySelector('.og-review-photo-next'),img=document.querySelector('.og-review-photo-image'),a=n.getBoundingClientRect(),r=img.getBoundingClientRect();return getComputedStyle(n).color==='rgb(255, 255, 255)'&&a.bottom<=r.bottom&&a.top>=r.top;}));
  if(width===375)await p.screenshot({path:'/private/tmp/og-review-pages-'+state+'.png'});
 }
 assert.deepEqual(errors,[]);console.log('PASS review pages: 5 states × 4 widths, 55 home states, review registration, prompts, containment and tokens');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
