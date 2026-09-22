const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});try{
 const p=await b.newPage({viewport:{width:1400,height:1200}});
 await p.goto('http://127.0.0.1:4173/design-system/canvas/?canvas=explore');
 await p.evaluate(()=>{localStorage.setItem('og-design:review-status:v1',JSON.stringify({'board-home-search':'done','board-home-menu-detail':'done'}));localStorage.removeItem('og-design:surface-rollout:v1');});await p.reload();
 await p.waitForFunction(()=>document.querySelector('#viewport')?.getAttribute('aria-busy')==='false');
 assert.equal(await p.locator('#home-search [data-review-set="pending"]').first().getAttribute('aria-pressed'),'true','revised page reopens');
 let states=await p.evaluate(()=>JSON.parse(localStorage.getItem('og-design:review-status:v1')));assert.equal(states['board-home-menu-detail'],'done','unrelated completion preserved');
 const search=await p.locator('#home-search .og-home-search-field').first().evaluate(n=>getComputedStyle(n).backgroundImage);assert.notEqual(search,'none','search receives shared surface');
 await p.evaluate(()=>{const s=JSON.parse(localStorage.getItem('og-design:review-status:v1'));s['board-home-search']='done';localStorage.setItem('og-design:review-status:v1',JSON.stringify(s));});await p.reload();await p.waitForFunction(()=>document.querySelector('#viewport')?.getAttribute('aria-busy')==='false');
 assert.equal(await p.locator('#home-search [data-review-set="done"]').first().getAttribute('aria-pressed'),'true','review completion survives reload');
 for(const canvas of ['explore','store']){
  await p.goto('http://127.0.0.1:4173/design-system/canvas/?canvas='+canvas);await p.waitForFunction(()=>document.querySelector('#viewport')?.getAttribute('aria-busy')==='false');
  const values=await p.locator('#world>.screen-page:not(.proposal-page) .og-home-filters .og-chip:not([aria-pressed="true"]),#world>.screen-page:not(.proposal-page) .og-store-tabs').evaluateAll(ns=>ns.map(n=>({tabs:n.classList.contains('og-store-tabs'),bg:getComputedStyle(n).backgroundImage,shadow:getComputedStyle(n).boxShadow})));
  assert.ok(values.length);values.forEach(v=>assert.ok(v.tabs?v.shadow!=='none':v.bg!=='none','all shared states receive depth'));
 }
 for(const id of ['home-news-detail','home-event-detail']){
  const styles=await p.locator('#'+id+' .og-news-article').evaluateAll(ns=>ns.map(n=>({shadow:getComputedStyle(n).boxShadow,border:getComputedStyle(n).borderTopWidth,radius:getComputedStyle(n).borderRadius,bg:getComputedStyle(n.closest('.og-news-page')).backgroundColor})));
  assert.equal(styles.length,2);styles.forEach(s=>assert.deepEqual(s,{shadow:'none',border:'0px',radius:'0px',bg:'rgb(255, 255, 255)'}));
 }
 assert.notEqual(await p.locator('#home-news-list .og-news-list').first().evaluate(n=>getComputedStyle(n).boxShadow),'none','list cards retained');
 console.log('PASS: shared depth across states; flat reading pages; review migration one-time and scoped');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
