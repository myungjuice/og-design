const test=require('node:test');
const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
const launch=()=>chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
async function ready(page,count=1){
 await page.waitForFunction(count=>{const roots=[...document.querySelectorAll('#full-menu .v2-home-full-menu-host')].map(host=>host.shadowRoot).filter(Boolean);return roots.length===count&&roots.every(root=>[...root.querySelectorAll('link')].every(link=>link.sheet)&&[...root.querySelectorAll('img')].every(img=>img.complete));},count);
 await page.evaluate(()=>document.fonts.ready);
}
// Catches a dead route, eager comparison mounting, duplicate mounts and broken history.
test('full menu lazy gallery supports direct entry, group navigation and history',async()=>{
 const browser=await launch();try{
  const page=await browser.newPage({viewport:{width:1440,height:1100}}),errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base+'/v2/home/');await page.locator('#overview .home-test').waitFor();
  assert.equal(await page.locator('#full-menu [data-full-menu-state]').count(),0);
  await page.locator('[data-view-link="full-menu"]').click();await ready(page);
  assert.ok(await page.locator('#store').isVisible());assert.ok(await page.locator('#main-menu').isVisible());
  const summary=page.locator('#full-menu details summary');await summary.click();await ready(page,3);await summary.click();await summary.click();await ready(page,3);
  await page.goBack();assert.ok(await page.locator('#overview').isVisible());await page.goForward();await ready(page,3);
  await page.reload();await ready(page);assert.equal(await page.locator('#full-menu [data-full-menu-state]').count(),1);
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});
// Catches layout loss, image failures, wrong absent-photo geometry, inaccessible scroll rails and fabricated actions.
test('three full menu states preserve facts and shared materials at eight widths',async()=>{
 const browser=await launch();try{
  const page=await browser.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
  page.on('request',request=>{if(!request.url().startsWith(base+'/')&&!request.url().startsWith('https://og-familystore-image.s3.ap-northeast-2.amazonaws.com/'))errors.push(request.url());});
  await page.goto(base+'/v2/home/#full-menu');
  for(const width of [320,375,390,414,768,1024,1440,1920]){
   await page.setViewportSize({width,height:1100});await page.reload();await ready(page);await page.locator('#full-menu details summary').click();await ready(page,3);
   for(const state of ['basic','scrolled','search']){
    const frame=page.locator(`#full-menu [data-full-menu-state="${state}"]`);
    const result=await frame.evaluate(node=>{
     const search=node.dataset.fullMenuState==='search',content=search?node.querySelector('.og-full-menu-results'):node.querySelector('.og-full-menu-body');
     const rows=[...content.querySelectorAll('.og-full-menu-item:not(.is-featured)')],featured=[...node.querySelectorAll('.is-featured')];
     const canvas=document.createElement('canvas');canvas.width=canvas.height=1;const ctx=canvas.getContext('2d');
     const lum=color=>{ctx.clearRect(0,0,1,1);ctx.fillStyle=color;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data].slice(0,3).map(x=>x/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((a,x,i)=>a+x*[.2126,.7152,.0722][i],0);};
     const contrast=(a,b)=>{const x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
     const rect=element=>{const r=element.getBoundingClientRect();return[r.width,r.height];};
     const surface=getComputedStyle(node).backgroundColor;
     return {size:rect(node),rows:rows.length,featured:featured.length,hero:!!node.querySelector('.og-full-menu-hero'),
      fits:[node,node.querySelector('header'),content,...rows].every(element=>element.scrollWidth<=element.clientWidth),
      media:[...node.querySelectorAll('[data-media-watch="true"]')].every(media=>media.dataset.state==='ready'&&media.querySelector('img').naturalWidth>0),
      missing:rows.filter(row=>row.querySelector('.og-full-menu-image-space')).map(row=>rect(row.querySelector('.og-full-menu-image-space'))),
      emptyFeatured:featured.filter(row=>row.querySelector('[data-state="empty"]')).map(row=>rect(row.querySelector('.v2-thumbnail'))),
      rowMedia:rows.filter(row=>row.querySelector('.v2-thumbnail')).map(row=>rect(row.querySelector('.v2-thumbnail'))),
      static:[...node.querySelectorAll('button,input')].every(control=>control.inert||control.closest('[inert]')),
      touch:[...node.querySelectorAll('button')].every(button=>button.clientHeight>=48),
      readable:content.tabIndex===0&&!content.closest('[inert]'),
      typography:[...node.querySelectorAll('h4,h5,h6,p')].every(element=>getComputedStyle(element).fontFamily.includes('OG V2 Pretendard')),
      noWrap:[...node.querySelectorAll('.v2-chip')].every(button=>getComputedStyle(button).whiteSpace==='nowrap'),
      depth:getComputedStyle(node.querySelector('.v2-chip')).boxShadow!=='none',
      textContrast:Math.min(...[...content.querySelectorAll('h5,h6,p,li')].map(element=>contrast(getComputedStyle(element).color,surface))),
      focusContrast:contrast(getComputedStyle(node).getPropertyValue('--v2-focus'),surface),
      tabular:rows.every(row=>getComputedStyle(row.querySelector('.og-full-menu-price')).fontVariantNumeric==='tabular-nums')};
    });
    assert.deepEqual(result.size,[Math.min(width,390),846]);assert.equal(result.rows,state==='search'?24:29);
    assert.equal(result.featured,state==='scrolled'?0:8);assert.equal(result.hero,state!=='scrolled');
    assert.ok(result.fits&&result.media&&result.static&&result.touch&&result.readable&&result.typography&&result.noWrap&&result.depth&&result.tabular,JSON.stringify({width,state,...result}));
    assert.deepEqual(result.missing,state==='search'?[]:Array(5).fill([93,64]));
    assert.deepEqual(result.emptyFeatured,state==='scrolled'?[]:Array(5).fill([160,119]));
    assert.ok(result.rowMedia.every(size=>size[0]===93&&size[1]===64));assert.ok(result.textContrast>=4.5&&result.focusContrast>=3);
    if([320,375,390,414,768].includes(width))await frame.screenshot({path:`/private/tmp/og-v2-home-full-menu-${state}-${width}.png`});
    const scroll=frame.locator(state==='search'?'.og-full-menu-results':'.og-full-menu-body');
    await scroll.focus();await page.keyboard.press('End');
    await scroll.evaluate(node=>new Promise(resolve=>{const check=()=>node.scrollTop>=node.scrollHeight-node.clientHeight-2?resolve():requestAnimationFrame(check);check();}));
    assert.ok(await scroll.evaluate(node=>node.scrollTop>0));
    if(state==='basic'){
     const rail=frame.locator('.og-full-menu-featured>div');await rail.focus();await page.keyboard.press('End');
     await rail.evaluate(node=>node.scrollLeft=node.scrollWidth);
     assert.ok(await rail.evaluate(node=>node.scrollLeft>0&&node.lastElementChild.getBoundingClientRect().right<=node.getBoundingClientRect().right+1));
    }
   }
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  }
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});
// Catches missing fallback frames and lost menu identity when remote photos are unavailable.
test('failed menu and store photos keep readable facts and shared fallback geometry',async()=>{
 const browser=await launch();try{
  const page=await browser.newPage({viewport:{width:390,height:1100}});
  await page.route('https://og-familystore-image.s3.ap-northeast-2.amazonaws.com/**',route=>route.abort());
  await page.goto(base+'/v2/home/#full-menu');await ready(page);await page.locator('#full-menu details summary').click();await ready(page,3);
  for(const state of ['basic','scrolled','search']){
   const frame=page.locator(`#full-menu [data-full-menu-state="${state}"]`);
   const failed=await frame.locator('[data-media-watch="true"]').evaluateAll(nodes=>nodes.every(node=>node.dataset.state==='error'&&getComputedStyle(node.querySelector('.og-media-fallback')).display!=='none'));
   assert.ok(failed);assert.equal(await frame.locator('.og-full-menu-list .og-full-menu-item').count(),29);
   assert.equal(await frame.locator('.og-full-menu-price').count(),state==='scrolled'?29:state==='search'?61:37);
  }
 }finally{await browser.close();}
});
