const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.url()+':'+r.status());});
  for(const width of [320,375,390,414,768,1024,1440,1920]){
   await page.setViewportSize({width,height:1100});await page.goto(base+'/v2/my-info/#reservation-pickers');await page.reload();
   await page.locator('#reservation-pickers').waitFor();await page.evaluate(()=>document.fonts.ready);
   assert.deepEqual(await page.locator('[data-review-screen]:visible').evaluateAll(ns=>ns.map(n=>n.id)),['use-history','reservation-detail','reservation-change','reservation-pickers']);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'document fits '+width);
   for(const type of ['date','time','empty','people']){
    const frame=page.locator(`[data-reservation-picker="${type}"] .v2-picker-frame`);
    const geometry=await frame.evaluate(n=>{
     const f=n.getBoundingClientRect(),panel=n.querySelector('.v2-picker-dialog .v2-dialog-panel').getBoundingClientRect(),body=n.querySelector('.v2-picker-body'),footer=n.querySelector('.v2-picker-dialog .og-dialog-actions').getBoundingClientRect();
     return {width:f.width,height:f.height,panelFits:panel.top>=f.top&&panel.bottom<=f.bottom&&panel.left>=f.left&&panel.right<=f.right,footerFits:footer.bottom<=panel.bottom&&footer.right<=panel.right,overflow:body.scrollWidth>body.clientWidth,inert:n.inert,allControlsInert:[...n.querySelectorAll('button')].every(b=>b.inert),touch:[...n.querySelectorAll('.v2-picker-dialog .og-dialog-actions button,.v2-picker-dialog .v2-quantity button,.v2-picker-dialog .og-calendar-nav')].map(b=>({w:b.getBoundingClientRect().width,h:b.getBoundingClientRect().height})),font:getComputedStyle(n).fontFamily};
    });
    assert.equal(geometry.width,Math.min(width,390));assert.equal(geometry.height,846);assert.ok(geometry.panelFits,'panel fits '+type+' '+width);assert.ok(geometry.footerFits);assert.equal(geometry.overflow,false,'body fits '+type+' '+width);assert.equal(geometry.inert,false);assert.ok(geometry.allControlsInert);assert.ok(geometry.touch.every(n=>n.w>=44&&n.h>=48));assert.match(geometry.font,/OG V2 Pretendard/);
    assert.equal(await frame.locator('.material-icons').count(),0);
    await frame.scrollIntoViewIfNeeded();
    assert.ok(await frame.evaluate(n=>{
     // Enable hit testing temporarily to inspect real paint order, including inert backgrounds.
     const restored=[...n.querySelectorAll('[inert]')];restored.forEach(v=>v.inert=false);
     const backgrounds=[...n.querySelectorAll('.v2-picker-backdrop,.v2-change-backdrop')];backgrounds.forEach(v=>v.style.pointerEvents='auto');
     const panel=n.querySelector('.v2-picker-dialog .v2-dialog-panel'),r=panel.getBoundingClientRect(),root=n.getRootNode();
     let covered=true;
     for(const dot of n.querySelectorAll('.og-reservation-step-dot')){
      const d=dot.getBoundingClientRect(),x=d.x+d.width/2,y=d.y+d.height/2;
      if(x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom){const top=root.elementsFromPoint(x,y)[0];covered=covered&&panel.contains(top);}
     }
     restored.forEach(v=>v.inert=true);backgrounds.forEach(v=>v.style.removeProperty('pointer-events'));return covered;
    }),'background progress cannot paint above popup '+type+' '+width);
    if(width===390||width===320)await frame.screenshot({path:`/private/tmp/og-v2-reservation-picker-${type}-${width}.png`});
   }
   const date=page.locator('[data-reservation-picker="date"] .v2-picker-body');
   assert.equal(await date.locator('.og-calendar-day').count(),30);assert.equal(await date.locator('.og-calendar-day:disabled').count(),19);
   assert.match(await date.locator('.og-calendar-day[data-reserved="true"]').getAttribute('aria-label'),/9월 18일/);
   const days=date.locator('.v2-calendar-days');
   // Whole weeks fit compact phones; row height preserves the vertical touch target.
   assert.ok(await days.evaluate(n=>n.scrollWidth<=n.clientWidth+1&&[...n.querySelectorAll('.og-calendar-day')].every(d=>d.getBoundingClientRect().width>=32&&d.getBoundingClientRect().height>=44)));
   assert.ok(await days.evaluate(n=>{const last=n.querySelector('.og-calendar-week span:last-child').getBoundingClientRect(),r=n.getBoundingClientRect();return last.right<=r.right+1;}),'last calendar column visible without scrolling');
   assert.equal(await page.locator('[data-reservation-picker="time"] .og-res-slot').count(),7);
   assert.equal(await page.locator('[data-reservation-picker="empty"] .og-res-slot').count(),0);
   const people=page.locator('[data-reservation-picker="people"] .v2-picker-body');
   assert.deepEqual(await people.locator('.v2-quantity').evaluateAll(ns=>ns.map(n=>({label:n.getAttribute('aria-label'),min:n.dataset.min,value:n.dataset.value,max:n.dataset.max||null}))),[{label:'성인',min:'1',value:'2',max:null},{label:'어린이',min:'0',value:'0',max:null}]);
   assert.ok(await people.locator('[aria-label="어린이 줄이기"]').isDisabled());
   await people.evaluate(n=>{const p=document.createElement('p');p.textContent='긴 안내의 끝까지 확인할 수 있는지 검토합니다. '.repeat(80);n.append(p);});
   assert.ok(await people.evaluate(n=>n.scrollHeight>n.clientHeight));
   await people.scrollIntoViewIfNeeded();const area=await people.boundingBox();await page.mouse.move(area.x+area.width/2,area.y+area.height/2);await page.mouse.wheel(0,10000);
   const atBottom=()=>{const n=document.querySelector('[data-reservation-picker="people"] .v2-picker-history-host').shadowRoot.querySelector('.v2-picker-body');return n.scrollTop+n.clientHeight>=n.scrollHeight-2;};
   await page.waitForFunction(atBottom);
   await people.evaluate(n=>n.scrollTo({top:0,behavior:'instant'}));await people.focus();await page.keyboard.press('End');await page.waitForFunction(atBottom);
   assert.ok(await people.evaluate(n=>n.lastElementChild.getBoundingClientRect().bottom<=n.getBoundingClientRect().bottom+1),'keyboard reaches last content');
   assert.ok(await page.locator('[data-reservation-picker="people"] .v2-picker-dialog .og-dialog-actions').evaluate(n=>n.getBoundingClientRect().bottom<=n.closest('.v2-picker-frame').getBoundingClientRect().bottom),'footer stays inside frame');
   await page.evaluate(async()=>{const {setupReservationPickersReview}=await import('/v2/my-info/reservation-pickers.mjs');setupReservationPickersReview(document.querySelector('#v2-root'));});
   assert.equal(await page.locator('#reservation-pickers .v2-picker-frame').count(),4,'setup idempotent');
   if(width<1024){await page.getByRole('combobox',{name:'화면 그룹 선택'}).selectOption('overview');await page.locator('.v2-submenu>summary').click();}
   else await page.locator('[data-view-link="overview"]').click();
   await page.locator('[data-view-link="reservation-pickers"]').click();await page.waitForURL('**/#reservation-pickers');await page.locator('#reservation-pickers').waitFor();
   assert.equal(await page.locator('#overview').isVisible(),false);await page.goBack();await page.locator('#overview').waitFor();
  }
  assert.deepEqual(errors,[]);console.log('reservation pickers: 4 states × 8 widths, source availability/minimums, shared materials, whole-week calendar, content wheel/keyboard scroll, fixed footer and group/back passed');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
