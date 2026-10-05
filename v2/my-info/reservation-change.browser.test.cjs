const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.url()+':'+r.status());});
  for(const width of [320,375,390,414,768,1024,1440,1920]){
   await page.setViewportSize({width,height:1100});await page.goto(base+'/v2/my-info/#reservation-change');await page.reload();
   await page.locator('#reservation-change').waitFor();await page.evaluate(()=>document.fonts.ready);
   assert.deepEqual(await page.locator('[data-review-screen]:visible').evaluateAll(ns=>ns.map(n=>n.id)),['use-history','reservation-detail','reservation-change','reservation-pickers']);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'document fits '+width);
   for(const state of ['initial','changed']){
    const frame=page.locator(`[data-change-state="${state}"] .v2-change-frame`);
    const geometry=await frame.evaluate(n=>{
     const frame=n.getBoundingClientRect(),panel=n.querySelector('.v2-sheet-panel').getBoundingClientRect(),footer=n.querySelector('.og-sheet-footer').getBoundingClientRect(),body=n.querySelector('.og-sheet-body'),close=n.querySelector('.og-sheet-close').getBoundingClientRect();
     return {width:frame.width,height:frame.height,panelFits:panel.top>=frame.top&&panel.bottom<=frame.bottom,footerFits:footer.bottom<=frame.bottom&&footer.right<=frame.right,bodyOverflow:body.scrollWidth>body.clientWidth,close:[close.width,close.height],values:[...n.querySelectorAll('.og-change-value')].map(c=>({fits:c.scrollWidth<=c.clientWidth,width:c.getBoundingClientRect().width,height:c.getBoundingClientRect().height})),inert:n.inert,buttons:[...n.querySelectorAll('button')].every(b=>b.inert),font:getComputedStyle(n).fontFamily,confirmDisabled:n.querySelector('.og-sheet-footer button:last-child').disabled,changed:n.querySelectorAll('.og-change-value.is-changed').length};
    });
    assert.equal(geometry.width,Math.min(width,390));assert.equal(geometry.height,846);assert.ok(geometry.panelFits);assert.ok(geometry.footerFits);assert.equal(geometry.bodyOverflow,false);assert.deepEqual(geometry.close,[48,48]);assert.equal(geometry.confirmDisabled,state==='initial');assert.equal(geometry.changed,state==='changed'?2:0);assert.equal(geometry.inert,false);assert.ok(geometry.buttons);assert.match(geometry.font,/OG V2 Pretendard/);
    assert.ok(geometry.values.every(n=>n.fits&&n.width>=44&&n.height>=48));assert.equal(await frame.locator('.material-icons').count(),0);
    assert.match(await frame.locator('.og-change-summary').innerText(),/성인: 2명, 어린이: 0명/);
    assert.match(await frame.locator('.og-change-value').first().innerText(),state==='changed'?/9월 19일 오후 06:30/:/9월 18일 오후 06:00/);
    if(width===390||width===320)await frame.screenshot({path:`/private/tmp/og-v2-reservation-change-${state}-${width}.png`});
   }
   // Long content must not push the shared fixed footer outside the phone frame.
   const body=page.locator('[data-change-state="changed"] .og-sheet-body');
   await body.evaluate(n=>{const p=document.createElement('p');p.textContent='긴 안내 내용을 스크롤해 확인하는 배치 검토입니다. '.repeat(40);n.append(p);});
   assert.ok(await body.evaluate(n=>n.scrollHeight>n.clientHeight));
   await body.scrollIntoViewIfNeeded();const area=await body.boundingBox();await page.mouse.move(area.x+area.width/2,area.y+area.height/2);await page.mouse.wheel(0,3000);
   await page.waitForFunction(()=>{const n=document.querySelector('[data-change-state="changed"] .v2-change-history-host').shadowRoot.querySelector('.og-sheet-body');return n.scrollTop+n.clientHeight>=n.scrollHeight-2;});
   assert.ok(await body.evaluate(n=>n.lastElementChild.getBoundingClientRect().bottom<=n.getBoundingClientRect().bottom),'last content reachable');
   await body.evaluate(n=>n.scrollTo({top:0,behavior:'instant'}));
   await body.focus();await page.keyboard.press('End');
   await page.waitForFunction(()=>{const n=document.querySelector('[data-change-state="changed"] .v2-change-history-host').shadowRoot.querySelector('.og-sheet-body');return n.scrollTop+n.clientHeight>=n.scrollHeight-2;});
   assert.ok(await body.evaluate(n=>n.lastElementChild.getBoundingClientRect().bottom<=n.getBoundingClientRect().bottom),'keyboard reaches last content');
   assert.ok(await page.locator('[data-change-state="changed"] .og-sheet-footer').evaluate(n=>n.getBoundingClientRect().bottom<=n.closest('.v2-change-frame').getBoundingClientRect().bottom),'long content retains footer');
   await page.evaluate(async()=>{const {setupReservationChangeReview}=await import('/v2/my-info/reservation-change.mjs');setupReservationChangeReview(document.querySelector('#v2-root'));});
   assert.equal(await page.locator('[data-change-state="initial"] .v2-change-frame').count(),1,'setup idempotent');
   if(width<1024){await page.getByRole('combobox',{name:'화면 그룹 선택'}).selectOption('overview');await page.locator('.v2-submenu>summary').click();}
   else await page.locator('[data-view-link="overview"]').click();
   await page.locator('[data-view-link="reservation-change"]').click();await page.waitForURL('**/#reservation-change');await page.locator('#reservation-change').waitFor();
   assert.equal(await page.locator('#overview').isVisible(),false);
   await page.goBack();await page.locator('#overview').waitFor();
  }
  assert.deepEqual(errors,[]);console.log('reservation change: 8 widths, before/after values, unchanged summary, disabled confirmation, sheet geometry, long-content scroll, inert actions and group/back passed');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
