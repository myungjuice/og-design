const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.url()+':'+r.status());});
  for(const width of [320,375,390,414,768,1024,1440,1920]){
   await page.setViewportSize({width,height:1100});await page.goto(base+'/v2/my-info/#notice-detail');await page.locator('#notice-detail').waitFor();await page.evaluate(()=>document.fonts.ready);
   assert.deepEqual(await page.locator('[data-review-screen]:visible').evaluateAll(ns=>ns.map(n=>n.id)),['notices','notice-detail']);
   assert.equal(await page.locator('[data-view-link="notice-detail"]').getAttribute('aria-current'),'location');
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'document fits '+width);
   const mounted=()=>page.locator('#notice-detail .v2-notice-detail-host').evaluateAll(ns=>ns.filter(n=>n.shadowRoot).length);
   assert.equal(await mounted(),1);const extra=page.locator('.v2-notice-detail-extra');await extra.locator('summary').click();await page.locator('[data-notice-detail-state="long"] .v2-notice-detail-frame').waitFor();assert.equal(await mounted(),3);
   for(const state of ['basic','modified','long']){
    const host=page.locator(`[data-notice-detail-state="${state}"] .v2-notice-detail-host`),frame=host.locator('.v2-notice-detail-frame'),article=host.locator('.og-notice-article');
    const geometry=await frame.evaluate(n=>({width:n.getBoundingClientRect().width,height:n.getBoundingClientRect().height,overflow:n.scrollWidth>n.clientWidth,font:getComputedStyle(n).fontFamily,buttons:[...n.querySelectorAll('button')].map(b=>({inert:b.inert,w:b.getBoundingClientRect().width,h:b.getBoundingClientRect().height}))}));
    assert.equal(geometry.width,Math.min(width,390));assert.equal(geometry.height,846);assert.equal(geometry.overflow,false);assert.match(geometry.font,/OG V2 Pretendard/);assert.ok(geometry.buttons.every(b=>b.inert&&b.w>=48&&b.h>=48));
    assert.equal(await host.locator('.material-icons').count(),0);assert.equal(await host.locator('.og-notice-dates p').count(),state==='modified'?2:1);
    assert.ok(await article.evaluate(n=>!n.closest('[inert]')&&n.scrollWidth<=n.clientWidth&&n.tabIndex===0));
    assert.notEqual(await host.locator('.og-notice-detail-header').evaluate(n=>getComputedStyle(n).boxShadow),'none');assert.equal(await article.evaluate(n=>getComputedStyle(n).boxShadow),'none');
    if(state==='long'){
     assert.ok(await host.locator('.og-app-bar h2').evaluate(n=>n.getBoundingClientRect().height>parseFloat(getComputedStyle(n).lineHeight)));
     assert.equal(await article.locator('h3').count(),1);assert.equal(await article.locator('li').count(),2);assert.equal(await article.locator('strong').count(),1);assert.equal(await article.locator('a[inert]').count(),1);
    }
    if(width===320||width===390)await frame.screenshot({path:`/private/tmp/og-v2-notice-detail-${state}-${width}.png`});
   }
   await extra.locator('summary').click();await extra.locator('summary').click();assert.equal(await mounted(),3);
   const host=page.locator('[data-notice-detail-state="long"] .v2-notice-detail-host'),article=host.locator('.og-notice-article');
   await article.evaluate(n=>{const p=document.createElement('p');p.textContent='긴 공지 본문의 마지막 내용까지 확인합니다. '.repeat(150);n.append(p);});
   await article.scrollIntoViewIfNeeded();const header=await host.locator('.og-notice-detail-header').boundingBox(),r=await article.boundingBox();await page.mouse.move(r.x+r.width/2,r.y+r.height/2);await page.mouse.wheel(0,50000);
   const atBottom=()=>{const n=document.querySelector('[data-notice-detail-state="long"] .v2-notice-detail-host').shadowRoot.querySelector('.og-notice-article');return n.scrollTop+n.clientHeight>=n.scrollHeight-2;};await page.waitForFunction(atBottom);
   assert.deepEqual(await host.locator('.og-notice-detail-header').boundingBox(),header);
   await article.evaluate(n=>n.scrollTo({top:0,behavior:'instant'}));await article.focus();await page.keyboard.press('End');await page.waitForFunction(atBottom);assert.deepEqual(await host.locator('.og-notice-detail-header').boundingBox(),header);
   await page.reload();await page.locator('#notice-detail').waitFor();assert.equal(await mounted(),1);
  }
  await page.setViewportSize({width:1440,height:1100});await page.goto(base+'/v2/my-info/');await page.locator('[data-view-link="notice-detail"]').click();await page.waitForURL('**/#notice-detail');
  await page.locator('[data-view-link="notices"]').click();await page.waitForURL('**/#notices');assert.equal(await page.locator('#notice-detail').isVisible(),true);
  await page.goBack();await page.waitForURL('**/#notice-detail');assert.equal(await page.locator('[data-view-link="notice-detail"]').getAttribute('aria-current'),'location');
  await page.locator('[data-group-link="notice-notifications"]').click();await page.waitForURL('**/#group-notice-notifications');assert.deepEqual(await page.locator('[data-review-screen]:visible').evaluateAll(ns=>ns.map(n=>n.id)),['notices','notice-detail']);
  assert.deepEqual(errors,[]);console.log('notice detail: 3 states × 8 widths; dates, shared header/icon materials, authored rich text, inert service controls, lazy mount, fixed-header wheel/keyboard reading, group navigation/back passed');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
