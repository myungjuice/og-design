const test=require('node:test');
const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
const launch=()=>chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
async function ready(page,count=1){
 await page.waitForFunction(count=>{
  const hosts=[...document.querySelectorAll('#main-menu .v2-home-main-menu-host')].filter(host=>host.shadowRoot);
  return hosts.length===count&&hosts.every(host=>[...host.shadowRoot.querySelectorAll('link')].every(link=>link.sheet)&&[...host.shadowRoot.querySelectorAll('img')].every(img=>img.complete));
 },count);
 await page.evaluate(()=>document.fonts.ready);
}

// Catches missing direct/group routes and eager/duplicate mounting of the condition example.
test('main menu is reachable beside Store and only mounts its comparison on demand',async()=>{
 const browser=await launch();
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1100}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base+'/v2/home/');await page.locator('#overview .home-test').waitFor();
  assert.equal(await page.locator('#main-menu [data-main-menu-state]').count(),0);
  await page.locator('[data-view-link="main-menu"]').click();await ready(page);
  // Related boards remain visible together; the child link scrolls to this one.
  assert.equal(await page.locator('#store').isVisible(),true);
  const summary=page.locator('#main-menu details summary');
  await summary.click();await ready(page,2);await summary.click();await summary.click();await ready(page,2);
  await page.goBack();assert.ok(await page.locator('#overview').isVisible());
  await page.goForward();assert.ok(await page.locator('#main-menu').isVisible());
  await page.reload();await ready(page);assert.equal(await page.locator('#main-menu [data-main-menu-state]').count(),1);
  await page.locator('[data-group-link="store"]').click();await ready(page);
  assert.ok(await page.locator('#store').isVisible());assert.ok(await page.locator('#main-menu').isVisible());
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});

// Catches clipped menu facts, blank photo columns, mismatched shared material and unreadable body scrolling.
test('menu facts and absent-field rows fit eight widths with static service controls',async()=>{
 const browser=await launch();
 try{
  const page=await browser.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('request',request=>{if(!request.url().startsWith(base+'/')&&!request.url().startsWith('https://og-familystore-image.s3.ap-northeast-2.amazonaws.com/'))errors.push(request.url());});
  await page.goto(base+'/v2/home/#main-menu');
  for(const width of [320,375,390,414,768,1024,1440,1920]){
   await page.setViewportSize({width,height:1100});await page.reload();await ready(page);
   await page.locator('#main-menu details summary').click();await ready(page,2);
   for(const state of ['basic','conditions']){
    const frame=page.locator(`#main-menu [data-main-menu-state="${state}"]`);
    const result=await frame.evaluate(node=>{
     const rows=[...node.querySelectorAll('.og-main-menu-row')],body=node.querySelector('.og-store-body'),nav=node.querySelector('nav'),surface=getComputedStyle(node).backgroundColor;
     const canvas=document.createElement('canvas');canvas.width=canvas.height=1;const context=canvas.getContext('2d');
     const lum=color=>{context.clearRect(0,0,1,1);context.fillStyle=color;context.fillRect(0,0,1,1);const rgb=[...context.getImageData(0,0,1,1).data].slice(0,3).map(value=>value/255).map(value=>value<=.04045?value/12.92:((value+.055)/1.055)**2.4);return rgb.reduce((sum,value,index)=>sum+value*[.2126,.7152,.0722][index],0);};
     const contrast=(a,b)=>{const x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
     return {size:[node.clientWidth,node.clientHeight],rows:rows.length,
      fits:[body,node.querySelector('header'),node.querySelector('.og-store-identity'),...rows].every(element=>element.scrollWidth<=element.clientWidth),
      images:rows.map(row=>{const photo=row.querySelector('.v2-thumbnail');if(!photo)return null;const box=photo.getBoundingClientRect();return[box.width,box.height];}),
      descriptions:rows.map(row=>!!row.querySelector('.og-main-menu-description')),
      fullCopy:rows.map(row=>row.querySelector('.og-main-menu-copy').clientWidth===row.clientWidth),
      ellipsis:rows.filter(row=>row.querySelector('.og-main-menu-description')).every(row=>{const style=getComputedStyle(row.querySelector('.og-main-menu-description'));return style.whiteSpace==='nowrap'&&style.textOverflow==='ellipsis';}),
      allReady:[...node.querySelectorAll('[data-v2-media]')].every(media=>media.dataset.state==='ready'&&media.querySelector('img').naturalWidth>0),
      static:[...node.querySelectorAll('button')].every(button=>button.inert||button.closest('[inert]')),
      current:nav.querySelector('[aria-current="location"]').textContent,
      navReadable:nav.tabIndex===0&&!nav.closest('[inert]'),bodyReadable:body.tabIndex===0&&!body.closest('[inert]'),
      actions:[...node.querySelectorAll('button')].map(button=>[button.clientHeight,button.textContent.trim()?getComputedStyle(button).whiteSpace:'nowrap']),
      font:getComputedStyle(body).fontFamily,
      textContrast:Math.min(...[...node.querySelectorAll('h4,h5,p,.og-store-name>span,button')].map(element=>contrast(getComputedStyle(element).color,surface))),
      focusContrast:contrast(getComputedStyle(body).getPropertyValue('--v2-focus'),surface),
      priceNums:rows.every(row=>getComputedStyle(row.querySelector('.og-main-menu-price')).fontVariantNumeric==='tabular-nums')};
    });
    assert.deepEqual(result.size,[Math.min(width,390),846]);assert.equal(result.rows,4);
    assert.ok(result.fits&&result.allReady&&result.static&&result.navReadable&&result.bodyReadable&&result.ellipsis&&result.priceNums);
    assert.equal(result.current,'메뉴');assert.match(result.font,/OG V2 Pretendard/);
    assert.deepEqual(result.images,state==='basic'?[[93,93],[93,93],[93,93],[93,93]]:[[93,93],null,[93,93],null]);
    assert.deepEqual(result.descriptions,state==='basic'?[true,true,true,true]:[true,true,false,false]);
    if(state==='conditions')assert.deepEqual(result.fullCopy,[false,true,false,true]);
    assert.ok(result.actions.every(([height,whitespace])=>height>=48&&whitespace==='nowrap'));
    assert.ok(result.textContrast>=4.5&&result.focusContrast>=3);
    if([320,375,390,414,768].includes(width))await frame.screenshot({path:`/private/tmp/og-v2-home-main-menu-${state}-${width}.png`});
   }
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  }
  const body=page.locator('#main-menu [data-main-menu-state="basic"] .og-store-body');
  const header=page.locator('#main-menu [data-main-menu-state="basic"] header');
  const offset=()=>header.evaluate(node=>node.getBoundingClientRect().y-node.closest('.v2-home-store-frame').getBoundingClientRect().y);
  const headerY=await offset();
  await body.evaluate(node=>{for(let i=0;i<4;i++)node.append(node.querySelector('.og-main-menu').cloneNode(true));});
  await body.focus();await page.keyboard.press('End');
  await page.waitForFunction(()=>{const body=document.querySelector('#main-menu .v2-home-main-menu-host').shadowRoot.querySelector('.og-store-body');return body.scrollTop>=body.scrollHeight-body.clientHeight-1;});
  assert.equal(await offset(),headerY);
  await body.evaluate(node=>node.scrollTop=0);await body.hover();await page.mouse.wheel(0,600);
  await page.waitForFunction(()=>document.querySelector('#main-menu .v2-home-main-menu-host').shadowRoot.querySelector('.og-store-body').scrollTop>0);
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});

// Catches a failed menu image collapsing a row or erasing its menu name/price.
test('menu photo failure retains its slot and readable facts without inventing absent photos',async()=>{
 const browser=await launch();
 try{
  const page=await browser.newPage({viewport:{width:390,height:1100}});
  await page.route('https://og-familystore-image.s3.ap-northeast-2.amazonaws.com/menu_photo/**',route=>route.abort());
  await page.goto(base+'/v2/home/#main-menu');await ready(page);
  await page.locator('#main-menu details summary').click();await ready(page,2);
  for(const state of ['basic','conditions']){
   const frame=page.locator(`#main-menu [data-main-menu-state="${state}"]`),photos=frame.locator('.og-main-menu-row .v2-thumbnail');
   assert.equal(await photos.count(),state==='basic'?4:2);
   for(const photo of await photos.all()){
    assert.equal(await photo.getAttribute('data-state'),'error');
    await photo.locator('.og-media-fallback').waitFor({state:'visible'});
    assert.deepEqual(await photo.evaluate(node=>{const box=node.getBoundingClientRect();return[box.width,box.height];}),[93,93]);
   }
   assert.equal(await frame.locator('.og-main-menu-row h5').count(),4);
   assert.equal(await frame.locator('.og-main-menu-price').count(),4);
  }
 }finally{await browser.close();}
});
