const test=require('node:test');
const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
const launch=()=>chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
async function ready(page,count=1){
 await page.waitForFunction(count=>{
  const hosts=[...document.querySelectorAll('#search .v2-home-search-host')].filter(h=>h.shadowRoot);
  return hosts.length===count&&hosts.every(h=>[...h.shadowRoot.querySelectorAll('link')].every(l=>l.sheet));
 },count);
 await page.evaluate(()=>document.fonts.ready);
 await page.locator('#search [data-search-state] img').evaluateAll(images=>Promise.all(images.map(image=>image.decode())));
}

// Catches eager comparison mounting, broken deep links and duplicate shadow roots.
test('search review mounts only the selected primary state until comparisons open',async()=>{
 const browser=await launch();
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1100}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/v2/home/');
  await page.locator('#overview .home-test').waitFor();
  assert.equal(await page.locator('#search [data-search-state]').count(),0);
  await page.locator('[data-view-link="search"]').click();await ready(page);
  assert.equal(await page.locator('#search [data-search-state]').count(),1);
  assert.equal(await page.locator('#overview').isVisible(),false);
  await page.locator('#search .v2-home-search-extra summary').click();await ready(page,6);
  assert.equal(await page.locator('#search [data-search-state]').count(),6);
  await page.locator('#search .v2-home-search-extra summary').click();
  await page.locator('#search .v2-home-search-extra summary').click();await ready(page,6);
  assert.equal(await page.locator('#search [data-search-state]').count(),6);
  await page.goBack();assert.equal(await page.locator('#overview').isVisible(),true);
  await page.goForward();assert.equal(await page.locator('#search').isVisible(),true);
  await page.reload();await ready(page);
  assert.equal(await page.locator('#search [data-search-state]').count(),1);
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});

// Catches clipped inputs/results, lost empty branches and inert scroll containers.
test('all six search states fit mobile widths and preserve readable, static source content',async()=>{
 const browser=await launch();
 try{
  const page=await browser.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('request',r=>{if(!r.url().startsWith(base+'/')&&!r.url().startsWith('https://og-familystore-image.s3.ap-northeast-2.amazonaws.com/ogapp/'))errors.push(r.url());});
  await page.goto(base+'/v2/home/#search');
  for(const width of [320,375,390,414,768,1440]){
   await page.setViewportSize({width,height:1100});await page.reload();await ready(page);
   await page.locator('#search .v2-home-search-extra summary').click();await ready(page,6);
   assert.equal(await page.locator('#search [data-search-state]').count(),6);
   for(const state of ['history','results','store-only','region-only','empty-history','empty-results']){
    const frame=page.locator(`#search [data-search-state="${state}"]`);
    const geometry=await frame.evaluate(node=>{
     const box=node.getBoundingClientRect(),panel=node.querySelector('.og-home-search-panel'),input=node.querySelector('.v2-home-search-overlay input');
     const header=node.querySelector('.v2-home-search-header').getBoundingClientRect();
     const overlay=node.querySelector('.v2-home-search-overlay');
     const canvas=document.createElement('canvas');canvas.width=canvas.height=1;const context=canvas.getContext('2d');
     const luminance=color=>{context.fillStyle=color;context.fillRect(0,0,1,1);const rgb=[...context.getImageData(0,0,1,1).data].slice(0,3).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;};
     const background=luminance(getComputedStyle(panel).backgroundColor);
     const contrast=[...panel.querySelectorAll('h3,.og-row-title,.og-row-description,.og-search-empty-group span')].map(text=>{const ink=luminance(getComputedStyle(text).color);return(Math.max(ink,background)+.05)/(Math.min(ink,background)+.05);});
     return {size:[box.width,box.height],fits:panel.scrollWidth<=panel.clientWidth&&input.scrollWidth<=input.clientWidth,
      headerFits:header.left>=box.left&&header.right<=box.right,font:getComputedStyle(panel).fontFamily,
      controlsInert:[...overlay.querySelectorAll('button,input')].every(control=>control.inert),inputReadonly:input.readOnly,
      scrollable:!panel.closest('[inert]')&&panel.tabIndex===0,map:node.querySelector('.home-map-ground').naturalWidth,minTextContrast:Math.min(...contrast)};
    });
    assert.deepEqual(geometry.size,[Math.min(width,390),846],state+' at '+width);
    assert.ok(geometry.fits&&geometry.headerFits,state+' does not clip at '+width);
    assert.match(geometry.font,/OG V2 Pretendard/);
    assert.ok(geometry.controlsInert&&geometry.inputReadonly&&geometry.scrollable);
    assert.equal(geometry.map,1674);
    assert.ok(geometry.minTextContrast>=4.5,'panel text contrast at '+width);
    if(['empty-history','empty-results'].includes(state)){
     const empty=await frame.locator('.v2-search-empty').evaluate(node=>{
      const art=node.querySelector('.v2-search-empty-visual'),box=art.getBoundingClientRect(),style=getComputedStyle(art);
      const svg=art.querySelector('svg').getBoundingClientRect();
      return {visual:[box.width,box.height],icon:[svg.width,svg.height],round:parseFloat(style.borderRadius)>=box.width/2,ink:style.color,fill:style.backgroundColor,title:node.querySelector('h3').textContent,decorative:art.getAttribute('aria-hidden'),images:node.querySelectorAll('img').length,within:node.scrollWidth<=node.clientWidth,shadow:style.boxShadow,background:style.backgroundImage,iconCount:art.querySelectorAll('svg').length};
     });
     // Catches a missing shared stylesheet inside the shadow-root preview.
     assert.deepEqual(empty.visual,[56,56]);assert.deepEqual(empty.icon,[24,24]);assert.ok(empty.round);
     assert.equal(empty.decorative,'true');assert.equal(empty.images,0);assert.ok(empty.within);
     assert.notEqual(empty.shadow,'none');assert.notEqual(empty.fill,'rgba(0, 0, 0, 0)');assert.equal(empty.background,'none');assert.equal(empty.iconCount,1);
     assert.equal(empty.title,state==='empty-history'?'최근 검색 기록이 없어요.':'검색 결과가 없어요.');
    }
    if(width===390||width===320||(['history','results'].includes(state)&&[375,414,768].includes(width)))await frame.screenshot({path:`/private/tmp/og-v2-home-search-${state}-${width}.png`});
   }
   assert.equal(await page.locator('#search [data-search-state="history"] .og-home-history-row').count(),3);
   assert.equal(await page.locator('#search [data-search-state="results"] .og-home-result-group').count(),2);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  }
  const panel=page.locator('#search [data-search-state="history"] .og-home-search-panel');
  await panel.evaluate(node=>{for(let i=0;i<30;i++)node.append(node.firstElementChild.cloneNode(true));});
  await panel.focus();await page.keyboard.press('End');
  await page.waitForFunction(()=>document.querySelector('#search .v2-home-search-host').shadowRoot.querySelector('.og-home-search-panel').scrollTop>0);
  assert.ok(await panel.evaluate(node=>node.scrollTop>0),'keyboard reaches long history without enabling service controls');
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});
