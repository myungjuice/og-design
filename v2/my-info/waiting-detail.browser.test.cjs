const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.url()+':'+r.status());});
  for(const width of [320,375,390,414,768,1024,1440,1920]){
   await page.setViewportSize({width,height:1100});await page.goto(base+'/v2/my-info/#waiting-detail');await page.reload();
   await page.locator('#waiting-detail').waitFor();await page.evaluate(()=>document.fonts.ready);
   assert.deepEqual(await page.locator('[data-review-screen]:visible').evaluateAll(ns=>ns.map(n=>n.id)),['waiting-detail','waiting-dialogs'],'waiting group does not expose all reservation previews');
   assert.equal(await page.locator('[data-view-link="waiting-detail"]').getAttribute('aria-current'),'location');
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'document fits '+width);
   const frame=page.locator('.v2-waiting-history-host .v2-wait-detail'),body=frame.locator('.og-reservation-body');
   // Shadow-root links can still be loading after the outer section is visible.
   await page.waitForFunction(()=>{
    const root=document.querySelector('.v2-waiting-history-host')?.shadowRoot;
    return root&&[...root.querySelectorAll('link[rel="stylesheet"]')].every(link=>link.sheet);
   });
   const geometry=await frame.evaluate(n=>{
    const r=n.getBoundingClientRect(),body=n.querySelector('.og-reservation-body'),footer=n.querySelector('.og-reservation-actions').getBoundingClientRect();
    return {width:r.width,height:r.height,overflow:n.scrollWidth>n.clientWidth||body.scrollWidth>body.clientWidth,footerFits:footer.bottom<=r.bottom&&footer.right<=r.right,buttons:[...n.querySelectorAll('button')].map(b=>({inert:b.inert,width:b.getBoundingClientRect().width,height:b.getBoundingClientRect().height,fits:b.scrollWidth<=b.clientWidth})),font:getComputedStyle(n).fontFamily,inert:n.inert,numbers:[...n.querySelectorAll('.og-wait-numbers strong')].map(v=>v.textContent),positionLarger:parseFloat(getComputedStyle(n.querySelector('.og-wait-numbers>span:last-child strong')).fontSize)>parseFloat(getComputedStyle(n.querySelector('.og-wait-numbers strong')).fontSize)};
   });
   assert.equal(geometry.width,Math.min(width,390));assert.equal(geometry.height,846);assert.equal(geometry.overflow,false);assert.ok(geometry.footerFits);assert.equal(geometry.inert,false);assert.ok(geometry.buttons.every(b=>b.inert&&b.width>=48&&b.height>=48&&b.fits));assert.deepEqual(geometry.numbers,['27','4']);assert.ok(geometry.positionLarger);assert.match(geometry.font,/OG V2 Pretendard/);
   assert.equal(await frame.locator('.material-icons').count(),0);assert.equal(await frame.locator('button').count(),4);
   assert.match(await frame.locator('.og-wait-people').innerText(),/성인:\s*2명/);assert.match(await frame.locator('.og-wait-people').innerText(),/어린이:\s*0명/);
   if(width===390||width===320)await frame.screenshot({path:`/private/tmp/og-v2-waiting-detail-${width}.png`});
   await body.evaluate(n=>{const p=document.createElement('p');p.textContent='긴 안내가 있을 때 본문만 스크롤하는지 검토합니다. '.repeat(60);n.insertBefore(p,n.lastElementChild);});
   assert.ok(await body.evaluate(n=>n.scrollHeight>n.clientHeight));
   await body.scrollIntoViewIfNeeded();const area=await body.boundingBox();await page.mouse.move(area.x+area.width/2,area.y+area.height/2);await page.mouse.wheel(0,10000);
   const atBottom=()=>{const n=document.querySelector('.v2-waiting-history-host').shadowRoot.querySelector('.og-reservation-body');return n.scrollTop+n.clientHeight>=n.scrollHeight-2;};
   await page.waitForFunction(atBottom);
   await body.evaluate(n=>n.scrollTo({top:0,behavior:'instant'}));await body.focus();await page.keyboard.press('End');await page.waitForFunction(atBottom);
   assert.ok(await body.evaluate(n=>n.lastElementChild.querySelector('li:last-child').getBoundingClientRect().bottom<=n.getBoundingClientRect().bottom),'last real cancellation guidance reachable');
   assert.ok(await frame.locator('.og-reservation-actions').evaluate(n=>n.getBoundingClientRect().bottom<=n.closest('.v2-wait-detail').getBoundingClientRect().bottom),'fixed footer after scroll');
   await page.evaluate(async()=>{const {setupWaitingDetailReview}=await import('/v2/my-info/waiting-detail.mjs');setupWaitingDetailReview(document.querySelector('#v2-root'));});assert.equal(await page.locator('.v2-waiting-history-host .v2-wait-detail').count(),1);
   await page.evaluate(async()=>{
    const {renderWaitingDetail}=await import('/v2/my-info/waiting-detail.mjs');const root=document.querySelector('.v2-waiting-history-host').shadowRoot;
    root.querySelector('.v2-wait-detail').outerHTML=renderWaitingDetail({id:'waiting-long',storeName:'예술의전당 용산점 · 길어진 매장 이름 배치 확인',phone:'02-1234-5678',number:123456,position:105,adults:12,children:10});
   });
   assert.ok(await body.evaluate(n=>n.scrollWidth<=n.clientWidth),'long store name and larger queue numbers wrap without clipping');
   if(width<1024){await page.getByRole('combobox',{name:'화면 그룹 선택'}).selectOption('overview');await page.locator('.v2-submenu>summary').click();}
   else await page.locator('[data-view-link="overview"]').click();
   await page.locator('[data-view-link="waiting-detail"]').click();await page.waitForURL('**/#waiting-detail');await page.locator('#waiting-detail').waitFor();
   assert.equal(await page.locator('#overview').isVisible(),false);await page.goBack();await page.locator('#overview').waitFor();
  }
  assert.deepEqual(errors,[]);console.log('waiting detail: 8 widths, 390×846, number/position hierarchy, source fields/notices, inert actions, long-content wheel/keyboard scroll, long names/numbers and group/back passed');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
