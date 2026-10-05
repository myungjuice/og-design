const test=require('node:test');
const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
const launch=()=>chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
async function ready(page,count=1){
 await page.waitForFunction(count=>{
  const hosts=[...document.querySelectorAll('#store .v2-home-store-host')].filter(h=>h.shadowRoot);
  return hosts.length===count&&hosts.every(h=>[...h.shadowRoot.querySelectorAll('link')].every(l=>l.sheet)&&[...h.shadowRoot.querySelectorAll('img')].every(img=>img.complete));
 },count);
 await page.evaluate(()=>document.fonts.ready);
}

// Catches eager mounting, missing sidebar/hash routing, and duplicates on comparison reopening.
test('store gallery is lazy and keeps direct navigation, history and reload working',async()=>{
 const browser=await launch();
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1100}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/v2/home/');await page.locator('#overview .home-test').waitFor();
  assert.equal(await page.locator('#store [data-store-state]').count(),0);
  await page.locator('[data-view-link="store"]').click();await ready(page);
  assert.ok(await page.locator('#store').isVisible());assert.equal(await page.locator('#nearby').isVisible(),false);
  const summary=page.locator('#store .v2-home-store-extra summary');
  await summary.click();await ready(page,12);await summary.click();await summary.click();await ready(page,12);
  await page.goBack();assert.ok(await page.locator('#overview').isVisible());
  await page.goForward();assert.ok(await page.locator('#store').isVisible());
  await page.reload();await ready(page);assert.equal(await page.locator('#store [data-store-state]').count(),1);
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});

// Catches square-photo drift, clipped identity/actions, unavailable menus, contrast and lost reading scroll.
test('three store first screens retain identity, square media and static controls at eight widths',async()=>{
 const browser=await launch();
 try{
  const page=await browser.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('request',r=>{if(!r.url().startsWith(base+'/')&&!r.url().startsWith('https://og-familystore-image.s3.ap-northeast-2.amazonaws.com/'))errors.push(r.url());});
  await page.goto(base+'/v2/home/#store');
  for(const width of [320,375,390,414,768,1024,1440,1920]){
   await page.setViewportSize({width,height:1100});await page.reload();await ready(page);
   await page.locator('#store .v2-home-store-extra summary').click();await ready(page,12);
   for(const state of ['basic','limited','no-photo']){
    const frame=page.locator(`#store [data-store-state="${state}"]`);
    const result=await frame.evaluate(node=>{
     const box=node.getBoundingClientRect(),body=node.querySelector('.og-store-body'),photo=node.querySelector('.og-store-photo'),nav=node.querySelector('nav'),toolbar=node.querySelector('header'),surface=getComputedStyle(node).backgroundColor;
     const canvas=document.createElement('canvas');canvas.width=canvas.height=1;const context=canvas.getContext('2d');
     const lum=color=>{context.clearRect(0,0,1,1);context.fillStyle=color;context.fillRect(0,0,1,1);const values=[...context.getImageData(0,0,1,1).data].slice(0,3).map(n=>n/255).map(n=>n<=.04045?n/12.92:((n+.055)/1.055)**2.4);return values.reduce((sum,n,i)=>sum+n*[.2126,.7152,.0722][i],0);};
     const contrast=(a,b)=>{const x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
     const text=[...node.querySelectorAll('h4,p,.og-store-name>span,.og-store-event>span,nav button,.og-store-count')];
     const icons=[...toolbar.querySelectorAll('button')];
     return {size:[box.width,box.height],photo:[photo.clientWidth,photo.clientHeight],logo:node.querySelector('.v2-store-logo').clientWidth,
      mediaLoaded:[...node.querySelectorAll('[data-v2-media]')].every(n=>n.dataset.state==='ready'&&n.querySelector('img').naturalWidth>0),
      fits:[body,toolbar,node.querySelector('.og-store-identity')].every(n=>n.scrollWidth<=n.clientWidth),
      static:[...node.querySelectorAll('button')].every(b=>b.inert||b.closest('[inert]')),
      sizes:icons.map(b=>[b.clientWidth,b.clientHeight]),
      navLabels:[...nav.querySelectorAll('button')].map(b=>b.textContent),
      navReadable:nav.tabIndex===0&&!nav.closest('[inert]'),
      navSizes:[...nav.querySelectorAll('button')].map(b=>[b.clientHeight,getComputedStyle(b).whiteSpace]),
      scrollbar:!body.closest('[inert]')&&body.tabIndex===0,caption:node.querySelector('.og-store-count')?.textContent,
      font:getComputedStyle(body).fontFamily,minTextContrast:Math.min(...text.map(n=>contrast(getComputedStyle(n).color,n.matches('.og-store-count')?getComputedStyle(n).backgroundColor:surface))),
      minIconContrast:Math.min(...icons.map(n=>contrast(getComputedStyle(n).color,surface))),
      focusContrast:contrast(getComputedStyle(body).getPropertyValue('--v2-focus'),surface),
      descriptionClamp:getComputedStyle(node.querySelector('.og-store-promotion p')).webkitLineClamp};
    });
    assert.deepEqual(result.size,[Math.min(width,390),846]);
    assert.deepEqual(result.photo,[Math.min(width,390)-32,Math.min(width,390)-32]);assert.equal(result.logo,34);
    assert.ok(result.mediaLoaded&&result.fits&&result.static&&result.scrollbar);
    assert.ok(result.navReadable,'section rail remains keyboard-scrollable without live service actions');
    assert.ok(result.sizes.every(size=>size[0]===48&&size[1]===48));
    assert.ok(result.navSizes.every(([height,whitespace])=>height===48&&whitespace==='nowrap'));
    const expected={basic:['홈','메뉴','예약/웨이팅','소식/이벤트','리뷰','매장 상세정보','위치찾기'],limited:['홈','리뷰','매장 상세정보','위치찾기'],'no-photo':['홈','예약','리뷰','매장 상세정보','위치찾기']};
    assert.deepEqual(result.navLabels,expected[state]);
    assert.equal(result.caption,{basic:'1 · 10',limited:'1 · 1','no-photo':undefined}[state]);
    assert.match(result.font,/OG V2 Pretendard/);assert.equal(result.descriptionClamp,'2');
    assert.ok(result.minTextContrast>=4.5&&result.minIconContrast>=3&&result.focusContrast>=3);
    if([320,375,390,414,768].includes(width))await frame.screenshot({path:`/private/tmp/og-v2-home-store-${state}-${width}.png`});
   }
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  }
  await page.setViewportSize({width:320,height:1100});await page.reload();await ready(page);
  const nav=page.locator('#store [data-store-state="basic"] nav');
  await nav.focus();for(let i=0;i<20;i++)await page.keyboard.press('ArrowRight');
  await page.waitForFunction(()=>{const rail=document.querySelector('#store .v2-home-store-host').shadowRoot.querySelector('nav');return rail.scrollLeft>=rail.scrollWidth-rail.clientWidth-1;});
  assert.ok(await nav.evaluate(rail=>rail.lastElementChild.getBoundingClientRect().right<=rail.getBoundingClientRect().right+1));
  await nav.evaluate(rail=>rail.scrollLeft=0);await nav.hover();await page.mouse.wheel(600,0);
  await page.waitForFunction(()=>document.querySelector('#store .v2-home-store-host').shadowRoot.querySelector('nav').scrollLeft>0);
  const body=page.locator('#store [data-store-state="basic"] .og-store-body'),header=page.locator('#store [data-store-state="basic"] header');
  // Focusing a reading region may scroll the review page to reveal the phone.
  // The app header must stay fixed relative to that phone, not the outer page.
  const headerOffset=()=>header.evaluate(node=>node.getBoundingClientRect().y-node.closest('.v2-home-store-frame').getBoundingClientRect().y);
  const headerY=await headerOffset();
  await body.evaluate(node=>{for(let i=0;i<5;i++)node.append(node.querySelector('.og-store-promotion').cloneNode(true));});
  await body.focus();await page.keyboard.press('End');
  await page.waitForFunction(()=>{const body=document.querySelector('#store .v2-home-store-host').shadowRoot.querySelector('.og-store-body');return body.scrollTop>=body.scrollHeight-body.clientHeight-1;});
  assert.equal(await headerOffset(),headerY);
  await body.evaluate(node=>node.scrollTop=0);await body.hover();await page.mouse.wheel(0,600);
  await page.waitForFunction(()=>document.querySelector('#store .v2-home-store-host').shadowRoot.querySelector('.og-store-body').scrollTop>0);
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});

// Catches lost expansion, favorite selection, or status styling leaking beyond the photo.
test('source store comparisons retain readable expanded copy and photo-only closed treatments at mobile widths',async()=>{
 const browser=await launch();
 try{
  const page=await browser.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
  for(const width of [320,375,390,414,768]){
   await page.setViewportSize({width,height:1100});await page.goto(base+'/v2/home/#store');await page.reload();await ready(page);
   await page.locator('#store .v2-home-store-extra summary').click();await ready(page,12);
   assert.equal(await page.locator('#store [data-store-state="basic"] .og-store-identity-copy>p').first().textContent(),'서울 마포구 월드컵로17길 48 지하1층');
   assert.equal(await page.locator('#store [data-store-state="bookmarked"] [aria-label="찜"]').getAttribute('aria-pressed'),'true');
   const expanded=page.locator('#store [data-store-state="promotion-expanded"]');
   const promotion=await expanded.evaluate(node=>{
    const body=node.querySelector('.og-store-body'),paragraph=node.querySelector('.og-store-promotion p'),button=node.querySelector('.v2-store-promotion-affordance');
    return {clamp:getComputedStyle(paragraph).webkitLineClamp,display:getComputedStyle(paragraph).display,scrollable:body.scrollHeight>body.clientHeight,affordance:[button.getAttribute('aria-expanded'),button.getAttribute('aria-label'),button.clientHeight],fits:body.scrollWidth<=body.clientWidth};
   });
   assert.equal(promotion.clamp,'none');assert.equal(promotion.display,'block');assert.ok(promotion.scrollable&&promotion.fits);assert.deepEqual(promotion.affordance,['true','매장 소개 접기',48]);
   for(const state of ['closed','break-time','before-open','opening-soon','temporary-holiday','regular-holiday','holiday']){
    const frame=page.locator(`#store [data-store-state="${state}"]`);
    const hero=await frame.evaluate(node=>{
     const body=node.querySelector('.og-store-body'),photo=node.querySelector('.og-store-photo'),media=photo.querySelector('.v2-thumbnail'),status=photo.querySelector('.v2-store-hero-status');
     return {filter:getComputedStyle(media).filter,bodyFilter:getComputedStyle(body).filter,bodyInert:body.inert||!!body.closest('[inert]'),overlayPointer:getComputedStyle(status).pointerEvents,label:status.querySelector('strong').textContent,subLabel:status.querySelector('span').textContent,size:[photo.clientWidth,photo.clientHeight],fits:body.scrollWidth<=body.clientWidth,identityFilter:getComputedStyle(node.querySelector('.og-store-identity')).filter};
    });
    assert.match(hero.filter,/grayscale\(1\).*brightness\(0\.55\)/);assert.equal(hero.bodyFilter,'none');assert.equal(hero.identityFilter,'none');assert.equal(hero.bodyInert,false);assert.equal(hero.overlayPointer,'none');assert.ok(hero.label&&hero.fits);
    assert.equal(hero.subLabel,['temporary-holiday','regular-holiday','holiday'].includes(state)?'오늘은 쉬어가요':'지금은 영업 시간이 아니에요');assert.deepEqual(hero.size,[Math.min(width,390)-32,Math.min(width,390)-32]);
   }
  }
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});

// Catches real photo/logo request failures leaving broken media while identity/counter vanish.
test('store photo and logo failures retain readable identity and a shared media fallback',async()=>{
 const browser=await launch();
 try{
  const page=await browser.newPage({viewport:{width:390,height:1100}});
  await page.route('https://og-familystore-image.s3.ap-northeast-2.amazonaws.com/**',route=>route.abort());
  await page.goto(base+'/v2/home/#store');await ready(page);
  for(const selector of ['.og-store-photo .v2-thumbnail','.v2-store-logo .v2-thumbnail']){
   const media=page.locator('#store '+selector);
   assert.equal(await media.getAttribute('data-state'),'error');
   await media.locator('.og-media-fallback').waitFor({state:'visible'});
  }
  assert.equal(await page.locator('#store .og-store-name h4').textContent(),'오시 망원본점');
  assert.equal(await page.locator('#store .og-store-count').textContent(),'1 · 10');
  assert.match(await page.locator('#store .og-store-photo .v2-thumbnail').getAttribute('aria-label'),/이미지를 불러오지 못했어요/);
 }finally{await browser.close();}
});
