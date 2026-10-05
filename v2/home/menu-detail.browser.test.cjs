const test=require('node:test');
const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
const launch=()=>chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
async function ready(page,count=1){
 await page.waitForFunction(count=>{const roots=[...document.querySelectorAll('#menu-detail .v2-home-menu-detail-host')].map(host=>host.shadowRoot).filter(Boolean);return roots.length===count&&roots.every(root=>[...root.querySelectorAll('link')].every(link=>link.sheet)&&[...root.querySelectorAll('img')].every(img=>img.complete));},count);
 await page.evaluate(()=>document.fonts.ready);
}

// Catches dead navigation, eager comparison mounting, duplicate frames and history loss.
test('menu detail lazily mounts registered menu and three comparisons with direct navigation',async()=>{
 const browser=await launch();try{
  const page=await browser.newPage({viewport:{width:1440,height:1100}}),errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base+'/v2/home/');await page.locator('#overview .home-test').waitFor();
  assert.equal(await page.locator('#menu-detail [data-menu-detail-state]').count(),0);
  await page.locator('[data-view-link="menu-detail"]').click();await ready(page);
  assert.ok(await page.locator('#full-menu').isVisible());
  const summary=page.locator('#menu-detail details summary');await summary.click();await ready(page,4);await summary.click();await summary.click();await ready(page,4);
  await page.goBack();assert.ok(await page.locator('#overview').isVisible());await page.goForward();await ready(page,4);
  await page.reload();await ready(page);assert.equal(await page.locator('#menu-detail [data-menu-detail-state]').count(),1);
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});

// Catches altered photo/option geometry, text/label overflow, wrong selection styling and accidental service controls.
test('four menu detail conditions fit eight widths and preserve shared selection material',async()=>{
 const browser=await launch();try{
  const page=await browser.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base+'/v2/home/#menu-detail');
  for(const width of [320,375,390,414,768,1024,1440,1920]){
   await page.setViewportSize({width,height:1100});await page.reload();await ready(page);await page.locator('#menu-detail details summary').click();await ready(page,4);
   for(const state of ['basic','options','scrolled','no-photo']){
    const frame=page.locator(`#menu-detail [data-menu-detail-state="${state}"]`);
    const result=await frame.evaluate(node=>{
     const rect=element=>{const r=element.getBoundingClientRect();return[r.width,r.height];};
     const canvas=document.createElement('canvas');canvas.width=canvas.height=1;const ctx=canvas.getContext('2d');
     const lum=color=>{ctx.clearRect(0,0,1,1);ctx.fillStyle=color;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data].slice(0,3).map(x=>x/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((a,x,i)=>a+x*[.2126,.7152,.0722][i],0);};
     const contrast=(a,b)=>{const x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
     const rows=[...node.querySelectorAll('.og-menu-detail-row')],surface=getComputedStyle(node).backgroundColor;
     const text=[...node.querySelectorAll('h4,h5,p,strong,.og-choice-copy')];
     const photo=node.querySelector('.og-menu-detail-photo'),empty=node.querySelector('.og-menu-detail-no-photo');
     return {size:rect(node),photo:photo?rect(photo):null,empty:empty?rect(empty):null,
      prices:rows.map(row=>row.querySelector('strong').textContent),options:node.querySelectorAll('input[type="checkbox"]').length,checked:node.querySelectorAll('input:checked').length,
      fits:[node,node.querySelector('header'),node.querySelector('.og-menu-detail-body'),...rows,...text].every(element=>element.scrollWidth<=element.clientWidth),
      readable:[...node.querySelectorAll('header,.og-menu-detail-body')].every(element=>element.tabIndex===0&&!element.closest('[inert]')),
      static:[...node.querySelectorAll('button,input,label')].every(element=>element.inert||element.closest('[inert]')),
      selectedDepth:getComputedStyle(node.querySelector('.v2-selection-mark')).boxShadow!=='none',
      fonts:text.every(element=>getComputedStyle(element).fontFamily.includes('OG V2 Pretendard')),
      textContrast:Math.min(...text.map(element=>contrast(getComputedStyle(element).color,surface))),
      badgeContrast:Math.min(...[...node.querySelectorAll('.v2-badge')].map(element=>contrast(getComputedStyle(element).color,getComputedStyle(element).backgroundColor))),
      focusContrast:contrast(getComputedStyle(node).getPropertyValue('--v2-focus'),surface),
      rows:rows.every(row=>row.clientHeight>=48&&row.getAttribute('aria-label')&&getComputedStyle(row.querySelector('strong')).fontVariantNumeric==='tabular-nums'),
      photos:[...node.querySelectorAll('[data-media-watch="true"]')].every(element=>element.dataset.state==='ready'&&element.querySelector('img').naturalWidth>0),
      pricesBefore:rows.map(row=>row.querySelector('input').checked)};
    });
    assert.deepEqual(result.size,[Math.min(width,390),846]);assert.deepEqual(result.photo,['basic','options'].includes(state)?[Math.min(width,390),264]:null);
    assert.deepEqual(result.empty,state==='no-photo'?[Math.min(width,390),100]:null);
    assert.deepEqual(result.prices,['options','scrolled'].includes(state)?['17,000 원','+1,000 원','+2,000 원']:['17,000 원']);
    assert.equal(result.options,['options','scrolled'].includes(state)?2:0);assert.equal(result.checked,state==='scrolled'?2:1);
    assert.ok(result.fits&&result.readable&&result.static&&result.selectedDepth&&result.fonts&&result.rows&&result.photos,JSON.stringify({width,state,...result}));
    assert.ok(result.textContrast>=4.5&&result.badgeContrast>=4.5&&result.focusContrast>=3,JSON.stringify(result));
    if([320,375,390,414,768].includes(width))await frame.screenshot({path:`/private/tmp/og-v2-menu-detail-${state}-${width}.png`});
    if(state==='options'){
     const choice=frame.locator('label').nth(1);await choice.scrollIntoViewIfNeeded();const box=await choice.boundingBox();await page.mouse.click(box.x+box.width/2,box.y+box.height/2);
     assert.deepEqual(await frame.locator('input').evaluateAll(inputs=>inputs.map(input=>input.checked)),result.pricesBefore);
    }
   }
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  }
  // Catches lost access to unusually long registered descriptions and option lists.
  await page.evaluate(async()=>{
   const {renderHomeMenuDetailScreen}=await import('/v2/home/menu-detail.mjs');
   const root=document.querySelector('#menu-detail .v2-home-menu-detail-host').shadowRoot;
   root.querySelector('.v2-home-menu-detail-frame').outerHTML=renderHomeMenuDetailScreen({item:{name:'긴 메뉴 이름 '.repeat(8),description:'등록된 설명을 끝까지 읽을 수 있어야 합니다. '.repeat(70),price:0,options:Array.from({length:30},(_,index)=>({name:'추가 옵션 '+index,price:index*1000}))}});
  });
  const frame=page.locator('#menu-detail [data-menu-detail-state="basic"]');
  for(const selector of ['header','.og-menu-detail-body']){
   const region=frame.locator(selector);await region.focus();await page.keyboard.press('End');
   await page.waitForFunction(selector=>{
    const node=document.querySelector('#menu-detail .v2-home-menu-detail-host').shadowRoot.querySelector(selector);
    return node.scrollTop>0&&node.scrollTop>=node.scrollHeight-node.clientHeight-2;
   },selector);
   assert.ok(await region.evaluate(node=>node.scrollTop>0));
  }
  assert.ok(await frame.evaluate(node=>node.scrollWidth<=node.clientWidth));assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});

// Catches missing asset fallback or introducing placeholder photos in absent-photo states.
test('menu detail photo failure preserves price and missing-photo states stay compact',async()=>{
 const browser=await launch();try{
  const page=await browser.newPage({viewport:{width:390,height:1100}});
  await page.route('https://og-familystore-image.s3.ap-northeast-2.amazonaws.com/**',route=>route.abort());
  await page.goto(base+'/v2/home/#menu-detail');await ready(page);await page.locator('#menu-detail details summary').click();await ready(page,4);
  for(const state of ['basic','options']){
   const frame=page.locator(`#menu-detail [data-menu-detail-state="${state}"]`);
   assert.ok(await frame.locator('[data-media-watch="true"]').evaluate(node=>node.dataset.state==='error'&&getComputedStyle(node.querySelector('.og-media-fallback')).display!=='none'));
   assert.equal(await frame.locator('.og-menu-detail-price strong').textContent(),'17,000 원');
  }
  for(const state of ['scrolled','no-photo'])assert.equal(await page.locator(`#menu-detail [data-menu-detail-state="${state}"] img`).count(),0);
 }finally{await browser.close();}
});
