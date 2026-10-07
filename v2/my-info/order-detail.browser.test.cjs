const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.url()+':'+r.status());});
  for(const width of [320,375,390,414,768,1440]){
   await page.setViewportSize({width,height:1100});await page.goto(base+'/v2/my-info/#order-detail');await page.reload();
   await page.locator('#order-detail').waitFor();await page.evaluate(()=>document.fonts.ready);
   assert.deepEqual(await page.locator('[data-review-screen]:visible').evaluateAll(ns=>ns.map(n=>n.id)),['order-detail']);
   assert.equal(await page.locator('[data-view-link="order-detail"]').getAttribute('aria-current'),'location');
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'document width '+width);
   await page.locator('.v2-order-extra>summary').click();
   await page.waitForFunction(()=>[...document.querySelectorAll('.v2-order-history-host')].every(n=>n.shadowRoot&&[...n.shadowRoot.querySelectorAll('link')].every(l=>l.sheet)));
   const hosts=page.locator('.v2-order-history-host');assert.equal(await hosts.count(),9);
   const geometry=await hosts.evaluateAll(nodes=>nodes.map(host=>{
    const n=host.shadowRoot.querySelector('.v2-order-detail'),body=n.querySelector('.og-order-body'),r=n.getBoundingClientRect(),footer=n.querySelector('.og-order-actions');
    const images=[...n.querySelectorAll('img')];
    return {width:r.width,height:r.height,overflow:n.scrollWidth>n.clientWidth||body.scrollWidth>body.clientWidth,rootInert:n.inert,font:getComputedStyle(n).fontFamily,footerFits:!footer||footer.getBoundingClientRect().bottom<=r.bottom,buttons:[...host.shadowRoot.querySelectorAll('button')].map(b=>({inert:b.inert,fit:b.scrollWidth<=b.clientWidth,height:b.getBoundingClientRect().height})),emptySources:images.some(i=>!i.getAttribute('src')),titleWrap:getComputedStyle(n.querySelector('h2')).fontStyle};
   }));
   for(const g of geometry){assert.equal(g.width,Math.min(width,390));assert.equal(g.height,846);assert.equal(g.overflow,false);assert.equal(g.rootInert,false);assert.ok(g.footerFits);assert.ok(g.buttons.every(b=>b.inert&&b.fit&&b.height>=48));assert.equal(g.emptySources,false);assert.match(g.font,/OG V2 Pretendard/);assert.equal(g.titleWrap,'normal');}
   assert.deepEqual(await hosts.locator('.og-order-actions').evaluateAll(ns=>ns.map(n=>n.closest('.v2-order-detail').querySelector('.v2-badge').textContent)),['주문','주문','주문']);
   const overlay=page.locator('[data-order-state="cancel-confirm"] .v2-picker-overlay');
   assert.deepEqual(await overlay.locator('button').allTextContents(),['돌아가기','주문 취소']);
   assert.ok(await overlay.locator('.v2-dialog-panel').evaluate(n=>{const r=n.getBoundingClientRect(),p=n.closest('.v2-picker-frame').getBoundingClientRect();return r.left>=p.left&&r.right<=p.right&&r.top>=p.top&&r.bottom<=p.bottom;}));
   const long=page.locator('[data-order-state="long-menus"] .v2-order-detail'),body=long.locator('.og-order-body');
   assert.ok(await body.evaluate(n=>n.scrollHeight>n.clientHeight));
   await body.scrollIntoViewIfNeeded();await body.focus();await page.keyboard.press('End');
   await page.waitForFunction(()=>{const n=document.querySelector('[data-order-state="long-menus"] .v2-order-history-host').shadowRoot.querySelector('.og-order-body');return n.scrollTop+n.clientHeight>=n.scrollHeight-2;});
   assert.ok(await long.locator('.og-order-actions').evaluate(n=>n.getBoundingClientRect().bottom<=n.closest('.v2-order-detail').getBoundingClientRect().bottom));
   if(width===320||width===390){await page.locator('[data-order-state="requested"] .v2-order-detail').screenshot({path:'/private/tmp/og-v2-qorder-'+width+'.png'});await page.locator('[data-order-state="cancel-confirm"] .v2-picker-frame').screenshot({path:'/private/tmp/og-v2-qorder-cancel-'+width+'.png'});}
   await page.evaluate(async()=>{const {renderOrderDetail}=await import('/v2/my-info/order-detail.mjs');const root=document.querySelector('[data-order-state="requested"] .v2-order-history-host').shadowRoot;root.querySelector('.v2-order-detail').outerHTML=renderOrderDetail({id:'qorder-long-fields',brandName:'아주 긴 매장 이름과 지역명이 이어지는 매장 표시 예시',amount:123456789,menus:[{name:'길고긴메뉴이름이줄바꿈없이연결되는경우를점검합니다',price:8000,total:18000,count:999,options:[{name:'옵션명도아주길게이어지는입력값배치점검',total:2000}],imageSrc:'/v2/home/media/kakao-share.png'}]});});
   assert.ok(await page.locator('[data-order-state="requested"] .og-order-body').evaluate(n=>n.scrollWidth<=n.clientWidth));
   await page.locator('[data-order-state="requested"] .og-order-menu-image img').waitFor();
   await page.evaluate(async()=>{const {setupOrderDetailReview}=await import('/v2/my-info/order-detail.mjs');setupOrderDetailReview(document.querySelector('#v2-root'));});assert.equal(await hosts.count(),9);
  }
  assert.deepEqual(errors,[]);console.log('Qorder: 6 widths, 9 states, fixed footer, keyboard scrolling, cancellation conditions, isolated Dim, long names/options, optional images and idempotent mounting passed');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
