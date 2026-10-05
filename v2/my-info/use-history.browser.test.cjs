const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)errors.push(r.url()+':'+r.status());});
  for(const width of [320,375,390,414,768,1024,1440]){
   await page.setViewportSize({width,height:1100});await page.goto(base+'/v2/my-info/#use-history');await page.reload();
   await page.locator('#use-history').waitFor();await page.evaluate(()=>document.fonts.ready);
   assert.equal(await page.locator('#overview').isVisible(),false);
   assert.equal(await page.locator('[data-use-state^="basic-"]').count(),4);
   assert.equal(await page.locator('.v2-use-extra .v2-use-history-host').evaluateAll(hosts=>hosts.filter(h=>h.shadowRoot).length),0,'folded states mount lazily');
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'document fits '+width);
   for(const selected of [0,1,2,3]){
    const frame=page.locator(`[data-use-state="basic-${selected}"] .v2-use-history-frame`);
    const box=await frame.evaluate(node=>{
     const r=node.getBoundingClientRect(),footer=node.querySelector('.og-sheet-footer').getBoundingClientRect(),close=node.querySelector('.og-sheet-close').getBoundingClientRect();
     const body=node.querySelector('.og-sheet-body');
     return {width:r.width,height:r.height,overflow:node.scrollWidth>node.clientWidth||body.scrollWidth>body.clientWidth,close:[close.width,close.height],footerFits:footer.bottom<=r.bottom&&footer.right<=r.right,inert:node.inert,font:getComputedStyle(node).fontFamily,
      selected:node.querySelector('[aria-selected=true]').textContent,tabWidths:[...node.querySelectorAll('[role=tab]')].map(t=>t.getBoundingClientRect().width),recordFits:node.querySelector('[data-use-record]').getBoundingClientRect().bottom<=footer.top};
    });
    assert.equal(box.width,Math.min(width,390));assert.equal(box.height,846);assert.equal(box.overflow,false);
    assert.deepEqual(box.close,[48,48]);assert.ok(box.footerFits);assert.ok(box.recordFits);assert.match(box.font,/OG V2 Pretendard/);
    assert.equal(box.selected,['예약','웨이팅','Q오더','리뷰'][selected]);
    assert.ok(Math.max(...box.tabWidths)-Math.min(...box.tabWidths)<1,'four evenly sized tabs');
    if(width===390)await frame.screenshot({path:`/private/tmp/og-v2-use-history-${selected}-390.png`});
   }
   await page.locator('.v2-use-extra').nth(0).locator('summary').click();
   await page.locator('[data-use-state="past-0"] .v2-use-history-frame').waitFor();
   for(const selected of [0,1,2]){
    const past=page.locator(`[data-use-state="past-${selected}"]`);
    assert.equal(await past.locator('[data-use-record]').count(),2);
    assert.equal(await past.locator('input[type=checkbox]').isChecked(),true);
    assert.ok(await past.locator('.og-sheet-body').evaluate(n=>n.scrollWidth<=n.clientWidth));
   }
   const longBody=page.locator('[data-use-state="past-1"] .og-sheet-body');
   await longBody.scrollIntoViewIfNeeded();
   const area=await longBody.boundingBox();await page.mouse.move(area.x+area.width/2,area.y+area.height/2);await page.mouse.wheel(0,600);
   await page.waitForFunction(()=>{
    const host=document.querySelector('[data-use-state="past-1"] .v2-use-history-host');return host.shadowRoot.querySelector('.og-sheet-body').scrollTop>0;
   },null,{timeout:2000});
   assert.ok(await longBody.evaluate(n=>n.scrollTop+n.clientHeight>=n.scrollHeight-2),'past record can be scrolled to its end');
   await longBody.focus();await page.keyboard.press('Home');await page.keyboard.press('End');
   await page.waitForFunction(()=>{
    const n=document.querySelector('[data-use-state="past-1"] .v2-use-history-host').shadowRoot.querySelector('.og-sheet-body');return n.scrollTop+n.clientHeight>=n.scrollHeight-2;
   });
   assert.equal(await page.locator('.v2-use-history-host').evaluateAll(hosts=>hosts.filter(h=>h.shadowRoot).every(h=>[...h.shadowRoot.querySelectorAll('button,input')].every(n=>n.inert))),true,'static actions cannot receive clicks/focus');
   await page.locator('.v2-use-extra').nth(1).locator('summary').click();
   await page.locator('[data-use-state="empty-3"] .v2-feedback').waitFor();
   for(const selected of [0,1,2,3]){
    const empty=page.locator(`[data-use-state="empty-${selected}"]`);
    assert.equal(await empty.locator('[data-use-record]').count(),0);assert.match(await empty.locator('.v2-feedback').innerText(),/내역이 없습니다/);
   }
   await page.locator('.v2-use-extra').nth(2).locator('summary').click();
   const menu=page.locator('[data-use-state="extra-3"] .v2-use-review-menu');await menu.waitFor();
   assert.equal(await menu.getByRole('button',{name:'삭제',includeHidden:true}).getAttribute('data-variant'),'danger','delete uses established destructive material');
   assert.match(await page.locator('[data-use-state="extra-0"] .v2-use-records').innerText(),/매장 사정으로 취소/);
   assert.match(await page.locator('[data-use-state="extra-1"] .v2-use-records').innerText(),/호출됨/);
   const ids=await page.locator('.v2-use-history-host').evaluateAll(hosts=>hosts.flatMap(host=>[...host.shadowRoot.querySelectorAll('[id]')].map(n=>n.id)));
   assert.equal(ids.length,new Set(ids).size);
   await page.locator('.v2-use-extra').nth(2).locator('summary').click();await page.locator('.v2-use-extra').nth(2).locator('summary').click();
   assert.equal(await page.locator('[data-use-state="extra-3"] .v2-use-history-frame').count(),1,'reopening never duplicates mount');
   if(width===390)await page.locator('[data-use-state="past-1"] .v2-use-history-frame').screenshot({path:'/private/tmp/og-v2-use-history-past-390.png'});
   if(width<1024)await page.getByRole('combobox',{name:'화면 그룹 선택'}).selectOption('overview');else await page.locator('[data-view-link="overview"]').click();
   const entry=page.locator('#overview').getByRole('button',{name:'이용내역',exact:true});await entry.focus();await page.keyboard.press('Enter');
   await page.waitForURL('**/#use-history');await page.waitForFunction(()=>document.activeElement?.id==='use-history-title');
   await page.goBack();await page.locator('#overview').waitFor();
  }
  assert.deepEqual(errors,[]);console.log('use history: 7 widths, 4 tabs, past/empty/supplementary states, lazy mount, main keyboard entry/back and 390×846 geometry passed');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
