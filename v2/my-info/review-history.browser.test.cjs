const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.url()+':'+r.status());});
  for(const width of [320,375,390,414,768,1024,1440,1920]){
   await page.setViewportSize({width,height:1100});await page.goto(base+'/v2/my-info/#review-history');await page.locator('#review-history').waitFor();await page.evaluate(()=>document.fonts.ready);
   assert.deepEqual(await page.locator('[data-review-screen]:visible').evaluateAll(ns=>ns.map(n=>n.id)),['review-history','photo-review','review-write']);
   assert.equal(await page.locator('[data-view-link="review-history"]').getAttribute('aria-current'),'location');
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'document fits '+width);
   assert.equal(await page.locator('#review-history .v2-review-history-host').evaluateAll(ns=>ns.filter(n=>n.shadowRoot).length),3);
   const extra=page.locator('.v2-review-history-extra');await extra.locator('summary').click();await page.locator('[data-review-history-state="menu"] .v2-review-floating-menu').waitFor();
   for(const state of ['basic','empty','no-photos','menu','delete']){
    const host=page.locator(`[data-review-history-state="${state}"] .v2-review-history-host`),frame=host.locator(state==='delete'?'.v2-review-delete-frame':'.v2-review-history-frame');
    const geometry=await frame.evaluate(n=>({width:n.getBoundingClientRect().width,height:n.getBoundingClientRect().height,overflow:n.scrollWidth>n.clientWidth,buttons:[...n.querySelectorAll('button')].map(b=>({inert:b.inert,w:b.getBoundingClientRect().width,h:b.getBoundingClientRect().height})),font:getComputedStyle(n).fontFamily}));
    assert.equal(geometry.width,Math.min(width,390));assert.equal(geometry.height,846);assert.equal(geometry.overflow,false);assert.ok(geometry.buttons.every(b=>b.inert&&b.w>=48&&b.h>=48));assert.match(geometry.font,/OG V2 Pretendard/);
    await page.waitForFunction(state=>document.querySelector(`[data-review-history-state="${state}"] .v2-review-history-host`).shadowRoot.querySelector('.v2-avatar').dataset.state==='ready',state);
    assert.equal(await host.locator('.v2-avatar img').count(),2);assert.equal(await host.locator('.material-icons').count(),0);
    assert.equal(await host.locator('.v2-use-review-photos .v2-thumbnail').count(),['empty','no-photos'].includes(state)?0:3);
    if(state==='empty')assert.match(await frame.innerText(),/리뷰 내역이 없습니다/);
    if(state==='menu'){
     assert.deepEqual(await host.locator('.v2-review-floating-menu button').allTextContents(),['수정','삭제']);
     assert.ok(await host.locator('.v2-review-floating-menu').evaluate(n=>{const a=n.getBoundingClientRect(),b=n.parentElement.getBoundingClientRect();return a.left>=b.left&&a.right<=b.right&&a.bottom<=b.bottom;}));
    }
    if(state==='delete'){
     assert.deepEqual(await host.locator('.v2-picker-overlay button').allTextContents(),['취소','삭제']);assert.match(await host.locator('.v2-picker-overlay').innerText(),/리뷰를 삭제하시겠습니까/);
     assert.ok(await host.locator('.v2-dialog-panel').evaluate(n=>{const a=n.getBoundingClientRect(),b=n.closest('.v2-picker-frame').getBoundingClientRect();return a.left>=b.left&&a.right<=b.right&&a.top>=b.top&&a.bottom<=b.bottom;}));
    }
    if(width===390||width===320)await frame.screenshot({path:`/private/tmp/og-v2-review-history-${state}-${width}.png`});
   }
   await extra.locator('summary').click();await extra.locator('summary').click();
   assert.equal(await page.locator('#review-history .v2-review-history-host').evaluateAll(ns=>ns.reduce((sum,n)=>sum+(n.shadowRoot?.querySelectorAll('.v2-review-history-frame').length||0),0)),5);
   const body=page.locator('[data-review-history-state="basic"] .v2-review-history-body');
   await body.evaluate(n=>{const card=n.querySelector('article');card.querySelector('h3').textContent='매우 긴 매장 이름의 줄바꿈 확인 '.repeat(8);card.querySelector('.v2-use-review-text').textContent='긴 리뷰의 마지막 내용까지 확인합니다. '.repeat(20);for(let i=0;i<9;i++)n.querySelector('.v2-use-records').append(card.cloneNode(true));});
   assert.ok(await body.evaluate(n=>n.scrollHeight>n.clientHeight&&n.scrollWidth<=n.clientWidth));
   await body.scrollIntoViewIfNeeded();const area=await body.boundingBox();await page.mouse.move(area.x+area.width/2,area.y+area.height/2);await page.mouse.wheel(0,20000);
   const atBottom=()=>{const n=document.querySelector('[data-review-history-state="basic"] .v2-review-history-host').shadowRoot.querySelector('.v2-review-history-body');return n.scrollTop+n.clientHeight>=n.scrollHeight-2;};await page.waitForFunction(atBottom);
   await body.evaluate(n=>n.scrollTo({top:0,behavior:'instant'}));await body.focus();await page.keyboard.press('End');await page.waitForFunction(atBottom);
   assert.ok(await body.evaluate(n=>n.lastElementChild.lastElementChild.getBoundingClientRect().bottom<=n.getBoundingClientRect().bottom+1));
   await page.reload();await page.locator('#review-history').waitFor();assert.equal(await page.locator('#review-history .v2-review-history-host').evaluateAll(ns=>ns.filter(n=>n.shadowRoot).length),3);
  }
  assert.deepEqual(errors,[]);console.log('review history: five states × eight widths; shared cards/profile, source copy, inert controls, lazy/idempotent comparison and wheel/keyboard scroll passed');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
