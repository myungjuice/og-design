const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.url()+':'+r.status());});
  for(const width of [320,375,390,414,768,1024,1440]){
   await page.setViewportSize({width,height:1100});await page.goto(base+'/v2/my-info/#reservation-detail');await page.reload();
   await page.locator('#reservation-detail').waitFor();await page.evaluate(()=>document.fonts.ready);
   assert.deepEqual(await page.locator('[data-review-screen]:visible').evaluateAll(ns=>ns.map(n=>n.id)),['use-history','reservation-detail','reservation-change','reservation-pickers'],'related group stays together');
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'document fits '+width);
   assert.equal(await page.locator('#reservation-detail .v2-reservation-extra .v2-reservation-history-host').evaluateAll(ns=>ns.filter(n=>n.shadowRoot).length),0,'extras lazy');
   for(const state of ['confirmed','requested','cancelled']){
    const frame=page.locator(`[data-reservation-state="${state}"] .v2-reservation-detail`);
    const box=await frame.evaluate(n=>{
     const r=n.getBoundingClientRect(),body=n.querySelector('.og-reservation-body'),back=n.querySelector('.v2-icon-button').getBoundingClientRect(),footer=n.querySelector('.og-reservation-actions');
     return {width:r.width,height:r.height,overflow:n.scrollWidth>n.clientWidth||body.scrollWidth>body.clientWidth,back:[back.width,back.height],actions:footer?.children.length||0,footerFits:!footer||footer.getBoundingClientRect().bottom<=r.bottom,font:getComputedStyle(n).fontFamily,inert:n.inert};
    });
    assert.equal(box.width,Math.min(width,390));assert.equal(box.height,846);assert.equal(box.overflow,false);assert.deepEqual(box.back,[48,48]);assert.equal(box.actions,state==='cancelled'?0:2);assert.ok(box.footerFits);assert.equal(box.inert,false);assert.match(box.font,/OG V2 Pretendard/);
    assert.equal(await frame.locator('.material-icons').count(),0);
    assert.equal(await frame.locator('.og-reservation-steps').count(),state==='cancelled'?0:1);
    if(width===390)await frame.screenshot({path:`/private/tmp/og-v2-reservation-${state}-390.png`});
   }
   const body=page.locator('[data-reservation-state="confirmed"] .og-reservation-body');
   await body.scrollIntoViewIfNeeded();const area=await body.boundingBox();await page.mouse.move(area.x+area.width/2,area.y+area.height/2);await page.mouse.wheel(0,900);
   await page.waitForFunction(()=>{const n=document.querySelector('[data-reservation-state="confirmed"] .v2-reservation-history-host').shadowRoot.querySelector('.og-reservation-body');return n.scrollTop+n.clientHeight>=n.scrollHeight-2;});
   // Chromium keyboard smooth-scroll can round to 0 before Home finishes.
   // Wait for scrollend, not just its intermediate coordinate, before sending End.
   await body.focus();
   await body.evaluate(n=>{n.dataset.keyboardScrollEnd='false';n.addEventListener('scrollend',()=>n.dataset.keyboardScrollEnd='true',{once:true});});
   await page.keyboard.press('Home');
   await page.waitForFunction(()=>{const n=document.querySelector('[data-reservation-state="confirmed"] .v2-reservation-history-host').shadowRoot.querySelector('.og-reservation-body');return n.scrollTop===0&&n.dataset.keyboardScrollEnd==='true';});
   await page.keyboard.press('End');
   await page.waitForFunction(()=>{const n=document.querySelector('[data-reservation-state="confirmed"] .v2-reservation-history-host').shadowRoot.querySelector('.og-reservation-body');return n.scrollTop+n.clientHeight>=n.scrollHeight-2;});
   assert.ok(await body.evaluate(n=>{const line=n.querySelector('.og-reservation-notice:last-child li:last-child').getBoundingClientRect(),body=n.getBoundingClientRect();return line.top>=body.top&&line.bottom<=body.bottom;}),'last cancellation sentence reachable');
   if(width===320)await page.locator('[data-reservation-state="confirmed"] .v2-reservation-detail').screenshot({path:'/private/tmp/og-v2-reservation-bottom-320.png'});
   await page.locator('#reservation-detail .v2-reservation-extra>summary').click();await page.locator('[data-reservation-state="old-requested"] .v2-reservation-detail').waitFor();
   for(const state of ['selfCancelled','entered','noShow','timeOver','old-confirmed','old-requested']){
    const frame=page.locator(`[data-reservation-state="${state}"] .v2-reservation-detail`);
    assert.equal(await frame.locator('.og-reservation-actions').count(),state.startsWith('old-')?1:0,'source action policy '+state);
    assert.equal(await frame.locator('.og-reservation-steps').count(),0,'ended reservation has no active progress '+state);
    if(state==='old-confirmed'||state==='old-requested')assert.deepEqual(await frame.locator('.og-reservation-actions button').allTextContents(),['예약 취소','예약 변경'],'elapsed buttons unchanged');
    assert.ok(await frame.locator('.og-reservation-body').evaluate(n=>n.scrollWidth<=n.clientWidth));
    if(state==='selfCancelled'&&[320,375,390,414,768].includes(width))await frame.screenshot({path:`/private/tmp/og-v2-reservation-fixed-${state}-${width}.png`});
   }
   assert.ok(await page.locator('.v2-reservation-history-host').evaluateAll(ns=>ns.filter(n=>n.shadowRoot).every(n=>[...n.shadowRoot.querySelectorAll('button')].every(b=>b.inert))));
   await page.locator('#reservation-detail .v2-reservation-extra>summary').click();await page.locator('#reservation-detail .v2-reservation-extra>summary').click();assert.equal(await page.locator('[data-reservation-state="old-requested"] .v2-reservation-detail').count(),1);
   // Long concrete store/title and user names wrap, without changing the source API.
   await page.evaluate(async()=>{
    const {renderReservationDetail}=await import('/v2/my-info/reservation-detail.mjs');
    const root=document.querySelector('[data-reservation-state="confirmed"] .v2-reservation-history-host').shadowRoot;
    root.querySelector('.v2-reservation-detail').outerHTML=renderReservationDetail({id:'long-review',storeName:'예술의전당 용산점 · 길어진 매장 이름 배치 확인',nickname:'아주긴이름을사용하는예약자'});
   });
   assert.ok(await page.locator('[data-reservation-state="confirmed"] .og-reservation-body').evaluate(n=>n.scrollWidth<=n.clientWidth),'long content wraps');
   if(width<1024){await page.getByRole('combobox',{name:'화면 그룹 선택'}).selectOption('overview');await page.locator('.v2-submenu>summary').click();}
   else await page.locator('[data-view-link="overview"]').click();
   await page.locator('[data-view-link="reservation-detail"]').click();await page.waitForURL('**/#reservation-detail');
   assert.equal(await page.locator('#overview').isVisible(),false);assert.equal(await page.locator('#use-history').isVisible(),true);
   await page.goBack();await page.locator('#overview').waitFor();
  }
  assert.deepEqual(errors,[]);console.log('reservation detail: 7 widths, 9 statuses, 390×846, source actions, scroll, lazy mount, long content and group navigation passed');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
