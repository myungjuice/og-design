const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});try{
 const p=await b.newPage({viewport:{width:1440,height:1000}});
 await p.goto(''+(process.env.PREVIEW_URL||'http://127.0.0.1:4173')+'/design-system/canvas/');await p.waitForFunction(()=>document.querySelector('#viewport')?.getAttribute('aria-busy')==='false');
 await p.locator('#review-toggle').click();
 for(const key of ['settings','password','account','photo-review','review-write','services','character','main','mileage','history','reservation-detail','reservation-change','waiting-detail','order-detail','review-history','notice-detail','faq','customer-center','policies','policy-detail']){
  const entry=p.locator('[data-review-row]').filter({has:p.locator('[data-review-go="board-my-info-'+key+'"]')});
  assert.equal(await entry.count(),1);assert.match(await entry.innerText(),/기획/);assert.match(await entry.innerText(),/기존 페이지/);assert.match(await entry.innerText(),/lib\//);
 }
 const row=p.locator('[data-review-row]').filter({has:p.locator('[data-review-go="board-my-info-services"]')});
 assert.equal(await row.count(),1,'noted placeholder is reviewable');assert.match(await row.innerText(),/이용내역/);assert.match(await row.innerText(),/기획/);
 await p.locator('[data-review-complete="board-my-info-services"]').click();await p.reload();await p.waitForFunction(()=>document.querySelector('#viewport')?.getAttribute('aria-busy')==='false');
 await p.locator('#review-toggle').click();assert.equal(await p.locator('[data-review-go="board-my-info-services"]').count(),0);
 await p.locator('[data-review-tab="done"]').click();assert.match(await p.locator('[data-review-row]').filter({has:p.locator('[data-review-go="board-my-info-services"]')}).innerText(),/이용내역/);
 await p.locator('[data-review-reopen="board-my-info-services"]').click();await p.locator('[data-review-tab="pending"]').click();
 for(const width of [320,375,414,768]){await p.setViewportSize({width,height:900});assert.ok(await p.locator('#review-panel').evaluate(n=>n.scrollWidth<=n.clientWidth+1));}
 await p.locator('#review-panel').screenshot({path:'/private/tmp/review-notes.png'});
 await p.locator('[data-review-go="board-my-info-services"]').click();assert.match(await p.locator('#my-info-services>.canvas-review-note').innerText(),/검토 메모/);
 console.log('PASS review notes: noted placeholder, persistent completion, reopen, page note and responsive panel');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1});
