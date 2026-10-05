const test=require('node:test');
const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
const launch=()=>chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
async function ready(page,count=1){
 await page.waitForFunction(count=>{
  const hosts=[...document.querySelectorAll('#category .v2-home-category-host')].filter(h=>h.shadowRoot);
  return hosts.length===count&&hosts.every(h=>[...h.shadowRoot.querySelectorAll('link')].every(l=>l.sheet));
 },count);
 await page.evaluate(()=>document.fonts.ready);
 await page.locator('#category [data-home-category-state] img').evaluateAll(images=>Promise.all(images.map(image=>image.decode())));
}

// Catches eager comparison mounting, lost deep links, and duplicate shadow roots.
test('category review shares the search group and mounts the comparison only on expansion',async()=>{
 const browser=await launch();
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1100}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/v2/home/');await page.locator('#overview .home-test').waitFor();
  assert.equal(await page.locator('#category [data-home-category-state]').count(),0);
  await page.locator('[data-view-link="category"]').click();await ready(page);
  assert.ok(await page.locator('#search').isVisible());
  assert.equal(await page.locator('#category [data-home-category-state]').count(),1);
  const summary=page.locator('.v2-home-category-extra summary');
  await summary.click();await ready(page,2);
  await page.setViewportSize({width:320,height:1100});
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  assert.ok(await page.locator('#category .v2-home-category-selected').evaluate(chip=>{
   const rail=chip.parentElement.getBoundingClientRect(),box=chip.getBoundingClientRect();
   return box.left>=rail.left-1&&box.right<=rail.right+1;
  }),'selected category stays fully visible on a live viewport shrink');
  await summary.click();await summary.click();await ready(page,2);
  await page.goBack();assert.ok(await page.locator('#overview').isVisible());
  await page.goForward();assert.ok(await page.locator('#category').isVisible());
  await page.reload();await ready(page);
  assert.equal(await page.locator('#category [data-home-category-state]').count(),1);
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});

// Catches clipping, source choice loss, unusable internal scrolling, and layout drift.
test('category sheet and selected map fit mobile widths without enabling service actions',async()=>{
 const browser=await launch();
 try{
  const page=await browser.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',response=>{if(response.status()>=400&&!response.url().endsWith('/favicon.ico'))errors.push(response.url());});
  await page.goto(base+'/v2/home/#category');
  for(const width of [320,375,390,414,768,1440]){
   await page.setViewportSize({width,height:1100});await page.reload();await ready(page);
   await page.locator('.v2-home-category-extra summary').click();await ready(page,2);
   for(const state of ['open','selected']){
    const frame=page.locator(`#category [data-home-category-state="${state}"]`);
    const geometry=await frame.evaluate(node=>{
     const box=node.getBoundingClientRect(),panel=node.querySelector('.v2-sheet-panel'),body=node.querySelector('.og-sheet-body');
     const chip=node.querySelector('.v2-home-category-selected'),rail=node.querySelector('.home-categories');
     const r=rail.getBoundingClientRect(),c=chip?.getBoundingClientRect();
     return {size:[box.width,box.height],panelHeight:panel?.getBoundingClientRect().height,
      panelBottom:panel?Math.abs(panel.getBoundingClientRect().bottom-box.bottom):0,
      isolated:panel?getComputedStyle(node.querySelector('.v2-home-category-backdrop')).isolation==='isolate':true,
      fits:panel?body.scrollWidth<=body.clientWidth:true,
      buttonsInert:[...node.querySelectorAll('button')].every(button=>button.inert),
      bodyScrollable:body?!body.closest('[inert]')&&body.tabIndex===0:true,
      chipFits:chip?c.left>=r.left-1&&c.right<=r.right+1:true,
      touch:panel?[...panel.querySelectorAll('button')].every(button=>button.getBoundingClientRect().height>=48):true,
      font:getComputedStyle(node).fontFamily,map:node.querySelector('.home-map-ground').naturalWidth};
    });
    assert.deepEqual(geometry.size,[Math.min(width,390),846],state+' at '+width);
    if(state==='open')assert.ok(Math.abs(geometry.panelHeight-338.4)<1);
    assert.ok(geometry.panelBottom<1&&geometry.fits&&geometry.touch&&geometry.bodyScrollable);
    assert.ok(geometry.isolated,'background navigation must not paint over the category sheet');
    assert.ok(geometry.buttonsInert&&geometry.chipFits,state+' category not clipped at '+width);
    assert.match(geometry.font,/OG V2 Pretendard/);assert.equal(geometry.map,1674);
    if([320,375,390,414,768].includes(width))await frame.screenshot({path:`/private/tmp/og-v2-home-category-${state}-${width}.png`});
   }
   assert.equal(await page.locator('#category [data-category-id]').count(),13);
   assert.equal(await page.locator('#category [data-home-category-state="selected"] .home-store-pin').count(),1);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  }
  await page.setViewportSize({width:320,height:1100});await page.reload();await ready(page);
  const body=page.locator('#category .og-sheet-body');await body.focus();await page.keyboard.press('End');
  await page.waitForFunction(()=>document.querySelector('#category .v2-home-category-host').shadowRoot.querySelector('.og-sheet-body').scrollTop>0);
  assert.ok(await body.evaluate(node=>node.scrollTop>0));
  await page.waitForFunction(()=>{
   const body=document.querySelector('#category .v2-home-category-host').shadowRoot.querySelector('.og-sheet-body');
   return body.querySelector('[data-category-id="CI1010"]').getBoundingClientRect().bottom<=body.getBoundingClientRect().bottom;
  });
  assert.ok(await body.evaluate(node=>{
   const b=node.getBoundingClientRect(),last=node.querySelector('[data-category-id="CI1010"]').getBoundingClientRect();
   return last.top>=b.top&&last.bottom<=b.bottom;
  }),'last leisure choice remains fully reachable');
  await body.evaluate(node=>node.scrollTop=0);await body.hover();await page.mouse.wheel(0,600);
  await page.waitForFunction(()=>document.querySelector('#category .v2-home-category-host').shadowRoot.querySelector('.og-sheet-body').scrollTop>0);
  await page.locator('#category [data-home-category-state="open"]').screenshot({path:'/private/tmp/og-v2-home-category-open-scrolled-320.png'});
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});
