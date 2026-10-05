const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.url()+':'+r.status());});
  for(const width of [320,375,390,414,768,1024,1440,1920]){
   await page.setViewportSize({width,height:1100});await page.goto(base+'/v2/my-info/#notices');await page.locator('#notices').waitFor();await page.evaluate(()=>document.fonts.ready);
   assert.deepEqual(await page.locator('[data-review-screen]:visible').evaluateAll(ns=>ns.map(n=>n.id)),['notices','notice-detail']);
   assert.equal(await page.locator('[data-view-link="notices"]').getAttribute('aria-current'),'location');
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'document fits '+width);
   const mounted=()=>page.locator('#notices .v2-notices-history-host').evaluateAll(ns=>ns.filter(n=>n.shadowRoot).length);
   assert.equal(await mounted(),2);
   for(const extra of await page.locator('.v2-notices-extra').all())await extra.locator('summary').click();
   await page.locator('[data-notice-state="all-delete"] .v2-notice-overlay').waitFor();assert.equal(await mounted(),10);
   for(const state of ['announcements','notifications','all-read','empty-notices','empty-notifications','editing','editing-none','item','selected-delete','all-delete']){
    const host=page.locator(`[data-notice-state="${state}"] .v2-notices-history-host`),frame=host.locator('.v2-notices-frame'),overlay=['item','selected-delete','all-delete'].includes(state);
    const geometry=await frame.evaluate(n=>({w:n.getBoundingClientRect().width,h:n.getBoundingClientRect().height,overflow:n.scrollWidth>n.clientWidth,font:getComputedStyle(n).fontFamily,controls:[...n.querySelectorAll('.v2-sheet-panel button,.v2-notice-overlay button')].map(b=>({inert:b.inert,w:b.getBoundingClientRect().width,h:b.getBoundingClientRect().height,fits:b.scrollWidth<=b.clientWidth})),bodyOverflow:n.querySelector('.og-sheet-body').scrollWidth>n.querySelector('.og-sheet-body').clientWidth}));
    assert.equal(geometry.w,Math.min(width,390));assert.equal(geometry.h,846);assert.equal(geometry.overflow,false);assert.equal(geometry.bodyOverflow,false);assert.match(geometry.font,/OG V2 Pretendard/);assert.ok(geometry.controls.every(n=>n.inert&&n.w>=48&&n.h>=48&&n.fits),'touch/label geometry '+state+' '+width);
    assert.equal(await host.locator('.material-icons').count(),0);assert.equal(await host.locator('img[src^="http"]').count(),0);
    assert.deepEqual(await host.locator('[role="tab"]').allTextContents(),['공지','내 알림']);
    assert.equal(await host.locator('[role="tab"][aria-selected="true"]').innerText(),['announcements','empty-notices'].includes(state)?'공지':'내 알림');
    assert.equal(await host.locator('.v2-unread-dot').count(),['all-read','empty-notices','empty-notifications'].includes(state)?0:1);
    if(state==='announcements'){assert.equal(await host.locator('.og-announcement-row').count(),2);assert.equal(await host.locator('[data-important="true"] .v2-badge').innerText(),'필독');assert.equal(await host.locator('.og-notification-toolbar').count(),0);}
    if(state==='notifications'){
     const rows=await host.locator('.og-notification-row').evaluateAll(ns=>ns.map(n=>({read:n.dataset.read,background:getComputedStyle(n).backgroundColor,border:getComputedStyle(n).borderLeftWidth})));assert.deepEqual(rows.map(n=>n.read),['false','false','true','true']);assert.notEqual(rows[0].background,rows[2].background);assert.ok(rows.every(n=>n.border==='0px'));
    }
    if(state.startsWith('empty-')){assert.equal(await host.locator('.v2-feedback').count(),1);assert.equal(await host.locator('[aria-label="알림 관리"]').count(),0);assert.equal(await host.locator('[aria-label="알림 설정"]').count(),state==='empty-notifications'?1:0);}
    if(state==='editing'||state==='editing-none'){
     const choices=await host.locator('input[type="checkbox"]').evaluateAll(ns=>ns.map(n=>n.checked));assert.deepEqual(choices,state==='editing'?[true,false,false,false]:[false,false,false,false]);assert.equal(await host.locator('.v2-selection-mark').count(),4);
     assert.ok(await host.locator('.v2-selection').evaluateAll(ns=>ns.every(n=>n.getBoundingClientRect().width>=48&&n.getBoundingClientRect().height>=48)));
    }
    if(overlay){
     assert.equal(await host.locator('.v2-notices-base').getAttribute('inert'),'');
     const target=host.locator(state==='item'?'.v2-notice-item-menu':'.v2-dialog-panel');
     assert.ok(await target.evaluate(n=>{const r=n.getBoundingClientRect(),f=n.closest('.v2-notices-frame').getBoundingClientRect();return r.left>=f.left&&r.right<=f.right&&r.top>=f.top&&r.bottom<=f.bottom;}),'overlay fits');
     await target.scrollIntoViewIfNeeded();
     assert.ok(await target.evaluate(n=>{const inert=[...n.closest('.v2-notices-frame').querySelectorAll('[inert]')];inert.forEach(n=>n.inert=false);const r=n.getBoundingClientRect(),top=n.getRootNode().elementsFromPoint(r.x+r.width/2,r.y+r.height/2)[0],result=n.contains(top);inert.forEach(n=>n.inert=true);return result;}),'overlay above isolated backdrop');
    }
    if(width===390||width===320)await frame.screenshot({path:`/private/tmp/og-v2-notices-${state}-${width}.png`});
   }
   for(const extra of await page.locator('.v2-notices-extra').all()){await extra.locator('summary').click();await extra.locator('summary').click();}assert.equal(await mounted(),10);
   const host=page.locator('[data-notice-state="notifications"] .v2-notices-history-host'),body=host.locator('.og-sheet-body');
   await body.evaluate(n=>{const list=n.querySelector('.og-notification-list'),row=list.firstElementChild;row.querySelector('h3').textContent='아주 긴 한글 알림 제목의 줄바꿈 확인 '.repeat(10);row.querySelector('p').textContent='아주 긴 알림의 마지막 내용까지 확인합니다. '.repeat(40);for(let i=0;i<8;i++)list.append(row.cloneNode(true));});
   assert.ok(await body.evaluate(n=>n.scrollHeight>n.clientHeight&&n.scrollWidth<=n.clientWidth));await body.scrollIntoViewIfNeeded();const r=await body.boundingBox();await page.mouse.move(r.x+r.width/2,r.y+r.height/2);await page.mouse.wheel(0,50000);
   const atBottom=()=>{const n=document.querySelector('[data-notice-state="notifications"] .v2-notices-history-host').shadowRoot.querySelector('.og-sheet-body');return n.scrollTop+n.clientHeight>=n.scrollHeight-2;};await page.waitForFunction(atBottom);
   await body.evaluate(n=>n.scrollTo({top:0,behavior:'instant'}));await body.focus();await page.keyboard.press('End');await page.waitForFunction(atBottom);
   assert.ok(await body.evaluate(n=>n.querySelector('.og-notification-list').lastElementChild.getBoundingClientRect().bottom<=n.getBoundingClientRect().bottom+1));
   assert.ok(await host.locator('.og-sheet-footer').evaluate(n=>n.getBoundingClientRect().bottom<=n.closest('.v2-notices-frame').getBoundingClientRect().bottom));
   await page.reload();await page.locator('#notices').waitFor();assert.equal(await mounted(),2);
  }
  await page.setViewportSize({width:1440,height:1100});await page.goto(base+'/v2/my-info/');await page.locator('#overview').waitFor();
  for(const label of ['공지·알림','알림']){
   const button=page.locator('.v2-screen-host').locator(`[data-preview="${label}"]`);await button.focus();await page.keyboard.press('Enter');await page.waitForURL('**/#notices');await page.locator('#notices').waitFor();await page.waitForFunction(()=>document.activeElement?.id==='notices-title');assert.equal(await page.locator('#notices-title').evaluate(n=>document.activeElement===n),true);await page.goBack();await page.locator('#overview').waitFor();
  }
  assert.deepEqual(errors,[]);console.log('notices: 10 states × 8 widths; source unread/edit/empty rules, shared materials, overlay paint order, inert controls, lazy mount, long-copy wheel/keyboard scroll and main keyboard navigation/back passed');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
