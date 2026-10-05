const test=require('node:test');
const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
const launch=()=>chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
function contrast(foreground,background){
 const luminance=color=>color.match(/[\d.]+/g).slice(0,3).map(Number).map(n=>n/255).map(n=>n<=.04045?n/12.92:((n+.055)/1.055)**2.4).reduce((sum,n,i)=>sum+n*[.2126,.7152,.0722][i],0);
 const a=luminance(foreground),b=luminance(background);
 return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
}
async function ready(page,count=1){
 await page.waitForFunction(count=>{
  const hosts=[...document.querySelectorAll('#nearby .v2-home-nearby-host')].filter(h=>h.shadowRoot);
  return hosts.length===count&&hosts.every(h=>[...h.shadowRoot.querySelectorAll('link')].every(l=>l.sheet)&&[...h.shadowRoot.querySelectorAll('img')].every(img=>img.complete));
 },count);
 await page.evaluate(()=>document.fonts.ready);
}

// Catches eager image requests, broken group/history routing, and duplicate mounts.
test('nearby gallery mounts only on selection and defers its two comparison states',async()=>{
 const browser=await launch();
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1100}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/v2/home/');await page.locator('#overview .home-test').waitFor();
  assert.equal(await page.locator('#nearby [data-nearby-state]').count(),0);
  await page.locator('[data-view-link="nearby"]').click();await ready(page);
  assert.ok(await page.locator('#nearby').isVisible());assert.equal(await page.locator('#search').isVisible(),false);
  assert.equal(await page.locator('#nearby [data-nearby-state]').count(),1);
  const summary=page.locator('#nearby .v2-home-nearby-extra summary');
  await summary.click();await ready(page,3);await summary.click();await summary.click();await ready(page,3);
  await page.goBack();assert.ok(await page.locator('#overview').isVisible());
  await page.goForward();assert.ok(await page.locator('#nearby').isVisible());
  await page.reload();await ready(page);assert.equal(await page.locator('#nearby [data-nearby-state]').count(),1);
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});

// Catches photo resizing, clipped headings/actions, leaked background navigation, and lost scroll.
test('all nearby states preserve their photo-led panel at eight widths',async()=>{
 const browser=await launch();
 try{
  const page=await browser.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('request',r=>{if(!r.url().startsWith(base+'/')&&!r.url().startsWith('https://og-familystore-image.s3.ap-northeast-2.amazonaws.com/'))errors.push(r.url());});
  await page.goto(base+'/v2/home/#nearby');
  for(const width of [320,375,390,414,768,1024,1440,1920]){
   await page.setViewportSize({width,height:1100});await page.reload();await ready(page);
   await page.locator('#nearby .v2-home-nearby-extra summary').click();await ready(page,3);
   for(const state of ['list','no-photo','empty']){
    const frame=page.locator(`#nearby [data-nearby-state="${state}"]`);
    const geometry=await frame.evaluate(node=>{
     const box=node.getBoundingClientRect(),panel=node.querySelector('.v2-sheet-panel'),body=node.querySelector('.og-sheet-body'),photo=node.querySelector('.og-nearby-photo'),visit=node.querySelector('.og-nearby-card-heading button');
     const thumb=node.querySelector('.v2-thumbnail'),image=thumb?.querySelector('img');
     // Computed tokens remain OKLCH; rasterize to sRGB before WCAG luminance math.
     const canvas=document.createElement('canvas');canvas.width=canvas.height=1;const context=canvas.getContext('2d');
     const rgb=color=>{context.clearRect(0,0,1,1);context.fillStyle=color;context.fillRect(0,0,1,1);return `rgb(${[...context.getImageData(0,0,1,1).data].slice(0,3).join(',')})`;};
     return {size:[box.width,box.height],panelSize:panel.getBoundingClientRect().height,
      photoHeight:photo?.getBoundingClientRect().height,photoLoaded:image?image.naturalWidth>0&&thumb.dataset.state==='ready':true,
      bodyFits:body.scrollWidth<=body.clientWidth,
      navHidden:getComputedStyle(node.querySelector('.bottom-navigation')).display==='none',
      buttonsInert:[...node.querySelectorAll('button')].every(button=>button.inert||button.closest('[inert]')),
      bodyScrollable:body.tabIndex===0&&!body.closest('[inert]'),font:getComputedStyle(body).fontFamily,
      visitFits:visit?visit.getBoundingClientRect().right<=body.getBoundingClientRect().right:true,
      visitHeight:visit?.getBoundingClientRect().height,
      count:node.querySelector('.og-nearby-count')?.textContent,map:node.querySelector('.home-map-ground').naturalWidth,
      contrast:[...node.querySelectorAll('.og-sheet-header h3,.og-nearby-card-heading h4,.og-nearby-promotion,.og-nearby-card-heading button,.og-nearby-empty p,.og-nearby-count')].map(el=>[rgb(getComputedStyle(el).color),rgb(getComputedStyle(el.matches('.og-nearby-count')?el:panel).backgroundColor)]),
      focus:[rgb(getComputedStyle(body).getPropertyValue('--v2-focus').trim()),rgb(getComputedStyle(panel).backgroundColor)]};
    });
    assert.deepEqual(geometry.size,[Math.min(width,390),846]);
    assert.ok(Math.abs(geometry.panelSize-676.8)<1);
    assert.ok(geometry.bodyFits&&geometry.navHidden&&geometry.buttonsInert&&geometry.bodyScrollable&&geometry.visitFits);
    assert.match(geometry.font,/OG V2 Pretendard/);assert.equal(geometry.map,1674);
    for(const pair of geometry.contrast)assert.ok(contrast(...pair)>=4.5,`nearby text contrast: ${pair}`);
    assert.ok(contrast(...geometry.focus)>=3,'nearby body focus contrast');
    if(state==='empty'){
     // Catches a missing/shadowed icon-seat style without changing the distance message.
     const seat=await frame.locator('.og-nearby-empty').evaluate(node=>{
      const icon=node.querySelector('svg'),art=icon.parentElement,b=art.getBoundingClientRect(),i=icon.getBoundingClientRect(),s=getComputedStyle(art);
      return {size:[b.width,b.height],icon:[i.width,i.height],round:parseFloat(s.borderRadius)>=b.width/2,shadow:s.boxShadow,fill:s.backgroundColor,decorative:art.getAttribute('aria-hidden'),message:node.querySelector('p').textContent};
     });
     assert.deepEqual(seat.size,[56,56]);assert.deepEqual(seat.icon,[24,24]);assert.ok(seat.round);
     assert.notEqual(seat.shadow,'none');assert.notEqual(seat.fill,'rgba(0, 0, 0, 0)');assert.equal(seat.decorative,'true');
     assert.equal(seat.message,'2Km 이내에 매장이 없습니다.');
    }
    if(state!=='empty'){
     assert.equal(geometry.photoHeight,350);assert.equal(geometry.visitHeight,48);assert.ok(geometry.photoLoaded);
     assert.equal(geometry.count,state==='list'?'1 · 10':'0 · 0');
    }
    if([320,375,390,414,768].includes(width))await frame.screenshot({path:`/private/tmp/og-v2-home-nearby-${state}-${width}.png`});
   }
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  }
  const body=page.locator('#nearby [data-nearby-state="list"] .og-sheet-body');
  const title=page.locator('#nearby [data-nearby-state="list"] .og-sheet-header');
  const before=(await title.boundingBox()).y;
  await body.evaluate(node=>{for(let i=0;i<3;i++)node.append(node.firstElementChild.cloneNode(true));});
  await body.focus();await page.keyboard.press('End');
  await page.waitForFunction(()=>{
   const body=document.querySelector('#nearby .v2-home-nearby-host').shadowRoot.querySelector('.og-sheet-body');
   return body.scrollTop>=body.scrollHeight-body.clientHeight-1;
  });
  assert.equal((await title.boundingBox()).y,before);
  await body.evaluate(node=>node.scrollTop=0);await body.hover();await page.mouse.wheel(0,650);
  await page.waitForFunction(()=>document.querySelector('#nearby .v2-home-nearby-host').shadowRoot.querySelector('.og-sheet-body').scrollTop>0);
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});

// Catches a broken photo becoming an empty/broken icon with no resilient shared fallback.
test('nearby photo load failure retains card content and counter with the shared image fallback',async()=>{
 const browser=await launch();
 try{
  const page=await browser.newPage({viewport:{width:390,height:1100}});
  await page.route('https://og-familystore-image.s3.ap-northeast-2.amazonaws.com/store_photo/**',route=>route.abort());
  await page.goto(base+'/v2/home/#nearby');await ready(page);
  const thumbnail=page.locator('#nearby .v2-thumbnail');
  await thumbnail.locator('.og-media-fallback').waitFor({state:'visible'});
  assert.equal(await thumbnail.getAttribute('data-state'),'error');
  assert.match(await thumbnail.getAttribute('aria-label'),/이미지를 불러오지 못했어요/);
  assert.equal(await page.locator('#nearby .og-nearby-count').textContent(),'1 · 10');
  assert.equal(await page.locator('#nearby .og-nearby-card-heading h4').textContent(),'오시 망원본점');
  assert.ok(await page.locator('#nearby .og-nearby-card-heading button').evaluate(button=>button.inert));
 }finally{await browser.close();}
});
