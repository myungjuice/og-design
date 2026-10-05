const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.url()+':'+r.status());});
  for(const width of [320,375,390,414,768,1024,1440,1920]){
   await page.setViewportSize({width,height:1100});await page.goto(base+'/v2/my-info/#waiting-dialogs');await page.reload();
   await page.locator('#waiting-dialogs').waitFor();await page.evaluate(()=>document.fonts.ready);
   assert.deepEqual(await page.locator('[data-review-screen]:visible').evaluateAll(ns=>ns.map(n=>n.id)),['waiting-detail','waiting-dialogs']);
   assert.equal(await page.locator('[data-view-link="waiting-dialogs"]').getAttribute('aria-current'),'location');
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'document fits '+width);
   if(width>=1840)assert.equal(await page.locator('.v2-waiting-dialogs-review-grid').evaluate(n=>getComputedStyle(n).gridTemplateColumns.split(' ').length),2,'two popup previews do not reserve a third column');
   for(const type of ['people','cancel']){
    const frame=page.locator(`[data-waiting-dialog="${type}"] .v2-picker-frame`),body=frame.locator('.v2-picker-body');
    const geometry=await frame.evaluate(n=>{
     const f=n.getBoundingClientRect(),panel=n.querySelector('.v2-waiting-dialog .v2-dialog-panel').getBoundingClientRect(),body=n.querySelector('.v2-picker-body'),footer=n.querySelector('.v2-waiting-dialog .og-dialog-actions').getBoundingClientRect();
     return {width:f.width,height:f.height,panelFits:panel.top>=f.top&&panel.bottom<=f.bottom&&panel.left>=f.left&&panel.right<=f.right,footerFits:footer.bottom<=panel.bottom&&footer.right<=panel.right,overflow:body.scrollWidth>body.clientWidth,inert:n.inert,allControlsInert:[...n.querySelectorAll('button')].every(b=>b.inert),touch:[...n.querySelectorAll('.v2-waiting-dialog button')].map(b=>({w:b.getBoundingClientRect().width,h:b.getBoundingClientRect().height,fits:b.scrollWidth<=b.clientWidth})),font:getComputedStyle(n).fontFamily};
    });
    assert.equal(geometry.width,Math.min(width,390));assert.equal(geometry.height,846);assert.ok(geometry.panelFits,'panel fits '+type+' '+width);assert.ok(geometry.footerFits);assert.equal(geometry.overflow,false);assert.equal(geometry.inert,false);assert.ok(geometry.allControlsInert);assert.ok(geometry.touch.every(n=>n.w>=48&&n.h>=48&&n.fits));assert.match(geometry.font,/OG V2 Pretendard/);
    assert.deepEqual(await frame.locator('.v2-waiting-dialog .og-dialog-actions button').allTextContents(),type==='cancel'?['돌아가기','웨이팅 취소']:['취소','확인']);
    assert.equal(await frame.locator('.v2-waiting-dialog [data-variant="danger"]').count(),type==='cancel'?1:0,'only queue cancellation is destructive');
    assert.equal(await frame.locator('.material-icons').count(),0);
    await frame.scrollIntoViewIfNeeded();
    assert.ok(await frame.evaluate(n=>{
     const restored=[...n.querySelectorAll('[inert]')];restored.forEach(v=>v.inert=false);
     const background=n.querySelector('.v2-picker-backdrop');background.style.pointerEvents='auto';
     const panel=n.querySelector('.v2-waiting-dialog .v2-dialog-panel'),r=panel.getBoundingClientRect();
     const top=n.getRootNode().elementsFromPoint(r.x+r.width/2,r.y+r.height/2)[0];
     const covered=panel.contains(top);restored.forEach(v=>v.inert=true);background.style.removeProperty('pointer-events');return covered;
    }),'waiting background stays behind popup');
    if(type==='people'){
     assert.deepEqual(await body.locator('.v2-quantity').evaluateAll(ns=>ns.map(n=>({label:n.getAttribute('aria-label'),min:n.dataset.min,value:n.dataset.value,max:n.dataset.max||null}))),[{label:'성인',min:'1',value:'2',max:null},{label:'어린이',min:'0',value:'0',max:null}]);
     assert.ok(await body.locator('[aria-label="어린이 줄이기"]').isDisabled());
     assert.equal(await body.locator('.og-res-people-notice li').count(),4);
     assert.match(await body.innerText(),/어린이 적용 기준은 매장마다 다를 수 있습니다\./);
     assert.doesNotMatch(await body.innerText(),/이린이/);
    }else{
     assert.equal(await body.innerText(),'웨이팅 취소를 하시겠습니까?');assert.equal(await body.locator('.v2-quantity').count(),0);
    }
    if([320,375,390,414,768].includes(width))await frame.screenshot({path:`/private/tmp/og-v2-waiting-dialog-${type}-${width}.png`});
    await body.evaluate(n=>{const p=document.createElement('p');p.textContent='긴 안내의 끝까지 확인할 수 있는지 검토합니다. '.repeat(80);n.append(p);});
    assert.ok(await body.evaluate(n=>n.scrollHeight>n.clientHeight));
    await body.scrollIntoViewIfNeeded();const area=await body.boundingBox();await page.mouse.move(area.x+area.width/2,area.y+area.height/2);await page.mouse.wheel(0,10000);
    const atBottom=type=>{const n=document.querySelector(`[data-waiting-dialog="${type}"] .v2-waiting-dialog-history-host`).shadowRoot.querySelector('.v2-picker-body');return n.scrollTop+n.clientHeight>=n.scrollHeight-2;};
    await page.waitForFunction(atBottom,type);
    await body.evaluate(n=>n.scrollTo({top:0,behavior:'instant'}));await body.focus();await page.keyboard.press('End');await page.waitForFunction(atBottom,type);
    assert.ok(await body.evaluate(n=>n.lastElementChild.getBoundingClientRect().bottom<=n.getBoundingClientRect().bottom+1),'keyboard reaches last content');
    assert.ok(await frame.locator('.v2-waiting-dialog .og-dialog-actions').evaluate(n=>n.getBoundingClientRect().bottom<=n.closest('.v2-picker-frame').getBoundingClientRect().bottom),'footer stays inside frame');
   }
   await page.evaluate(async()=>{const {setupWaitingDialogsReview}=await import('/v2/my-info/waiting-dialogs.mjs');setupWaitingDialogsReview(document.querySelector('#v2-root'));});
   assert.equal(await page.locator('.v2-waiting-dialog-frame').count(),2,'setup idempotent');
   if(width<1024){await page.getByRole('combobox',{name:'화면 그룹 선택'}).selectOption('overview');await page.locator('.v2-submenu>summary').click();}
   else await page.locator('[data-view-link="overview"]').click();
   await page.locator('[data-view-link="waiting-dialogs"]').click();await page.waitForURL('**/#waiting-dialogs');await page.locator('#waiting-dialogs').waitFor();
   assert.equal(await page.locator('#overview').isVisible(),false);await page.goBack();await page.locator('#overview').waitFor();
  }
  assert.deepEqual(errors,[]);console.log('waiting dialogs: 2 popups × 8 widths, source bounds/copy, shared materials, fixed footer, wheel/keyboard scroll, paint order, two-column gallery and group/back passed');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
