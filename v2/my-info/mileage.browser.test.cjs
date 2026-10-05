const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('response',response=>{if(response.status()>=400)errors.push(response.url()+':'+response.status());});
  for(const width of [320,375,390,414,768,1024,1440]){
   await page.setViewportSize({width,height:1100});
   await page.goto(`${base}/v2/my-info/#mileage-history`);
   await page.locator('#mileage-history').waitFor();await page.evaluate(()=>document.fonts.ready);
   await page.waitForFunction(()=>[...document.querySelectorAll('[data-mileage-state] .v2-mileage-history-host')].every(host=>host.shadowRoot&&[...host.shadowRoot.querySelectorAll('link[rel="stylesheet"]')].every(link=>link.sheet)));
   if(width===320){
    await page.getByRole('combobox',{name:'화면 그룹 선택'}).selectOption('overview');
    const entry=page.locator('#overview').getByRole('button',{name:'내역보기',exact:false});
    await entry.focus();await page.keyboard.press('Enter');await page.waitForURL('**/#mileage-history');
    await page.waitForFunction(()=>document.activeElement?.id==='mileage-history-title');
    assert.equal(await page.locator('#mileage-history-title').evaluate(node=>node.ownerDocument.activeElement===node),true,'keyboard entry transfers focus to the visible review heading');
   }
   assert.equal(await page.locator('#overview').isVisible(),false);
   assert.equal(await page.locator('[data-mileage-state]').count(),3);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'document fits '+width);
   for(const state of ['basic','empty','period']){
    const frame=page.locator(`[data-mileage-state="${state}"] .v2-mileage-history-frame`);
    assert.ok(await frame.isVisible());
    const box=await frame.evaluate(node=>{
     const r=node.getBoundingClientRect(),sheet=node.querySelector('.v2-sheet-panel').getBoundingClientRect();
     const close=node.querySelector('.og-sheet-close').getBoundingClientRect(),footer=node.querySelector('.og-sheet-footer').getBoundingClientRect();
     return {width:r.width,height:r.height,overflow:node.scrollWidth>node.clientWidth,sheetTop:sheet.top-r.top,footerFits:footer.bottom<=r.bottom&&footer.left>=r.left&&footer.right<=r.right,close:[close.width,close.height],inert:node.inert,font:getComputedStyle(node).fontFamily};
    });
    assert.equal(box.height,846);assert.equal(box.overflow,false,'frame fits '+width+' '+state);
    assert.equal(box.width,Math.min(width,390),'app-sized state preview '+width);assert.equal(box.sheetTop,64);assert.ok(box.footerFits);
    assert.deepEqual(box.close,[48,48]);assert.equal(box.inert,false);assert.match(box.font,/OG V2 Pretendard/);
   }
   const basic=page.locator('[data-mileage-state="basic"]');
   assert.equal(await basic.locator('.v2-history-record').count(),3);
   assert.match(await basic.locator('.v2-history-records').innerText(),/\+1,000 M/);
   assert.match(await page.locator('[data-mileage-state="empty"] .v2-history-empty').innerText(),/조회한 기간의 내역이 없습니다/);
   const calendar=page.locator('[data-mileage-state="period"] .v2-calendar');
   assert.equal(await calendar.locator('[data-date][aria-pressed="true"]').count(),2);
   assert.equal(await calendar.locator('[data-date]:disabled').count(),0);
   assert.ok(await calendar.locator('[data-date]').evaluateAll(nodes=>nodes.every(node=>{
    const r=node.getBoundingClientRect(),panel=node.closest('.v2-history-period-panel').getBoundingClientRect();return r.left>=panel.left&&r.right<=panel.right;
   })),'all calendar dates visible in static preview '+width);
   assert.equal(await page.locator('iframe,.mobile-status-bar,.mobile-home-indicator').count(),0);
   assert.ok(await calendar.evaluate(node=>{
    const panel=node.closest('.v2-history-period-panel').getBoundingClientRect(),header=node.querySelector('.og-calendar-header').getBoundingClientRect(),footer=node.querySelector('.og-picker-footer').getBoundingClientRect();
    return header.left>=panel.left&&header.right<=panel.right&&footer.right<=panel.right&&footer.bottom<=panel.bottom;
   }),'calendar controls fit '+width);
   if([390,1440].includes(width)){
    for(const state of ['basic','empty','period'])await page.locator(`[data-mileage-state="${state}"] .v2-mileage-history-frame`).screenshot({path:`/private/tmp/og-v2-mileage-${state}-${width}.png`});
   }
   if(width<1024)await page.getByRole('combobox',{name:'화면 그룹 선택'}).selectOption('overview');
   else await page.locator('[data-view-link="overview"]').click();
   assert.equal(await page.locator('#mileage-history').isVisible(),false);
   await page.locator('#overview').getByRole('button',{name:'내역보기',exact:false}).click();
   await page.waitForURL('**/#mileage-history');
   assert.equal(await page.locator('#mileage-history').isVisible(),true);
   await page.goBack();await page.locator('#overview').waitFor();
  }
  await page.goto(`${base}/v2/my-info/#mileage-history`);await page.locator('#mileage-history').waitFor();
  await page.locator('.v2-mileage-extra summary').click();
  const cancellation=page.locator('.v2-mileage-extra .v2-history-records');
  assert.match(await cancellation.innerText(),/-1,000 M/);assert.match(await cancellation.innerText(),/지급 정보 없음/);assert.match(await cancellation.innerText(),/\+5,000 M/);
  const ids=await page.locator('.v2-mileage-history-host').evaluateAll(hosts=>hosts.flatMap(host=>[...host.shadowRoot.querySelectorAll('[id]')].map(node=>node.id)));
  assert.equal(ids.length,new Set(ids).size);
  assert.deepEqual(errors,[]);
  console.log('mileage migration: 7 widths, 3 static states + cancellation, shared styles, calendar/touch geometry, deep links/main entry/back passed');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
