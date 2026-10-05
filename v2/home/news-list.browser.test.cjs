const test=require('node:test');
const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
const states=['registered','photo-mix','empty'];
const launch=()=>chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
async function ready(page,count=1){
 await page.waitForFunction(count=>{
  const hosts=[...document.querySelectorAll('#news-list .v2-home-news-list-host')].filter(host=>host.shadowRoot);
  return hosts.length===count&&hosts.every(host=>[...host.shadowRoot.querySelectorAll('link')].every(link=>link.sheet)&&[...host.shadowRoot.querySelectorAll('img')].every(img=>img.complete));
 },count);await page.evaluate(()=>document.fonts.ready);
}

test('full news list is reachable with deferred comparisons, direct hash, history and group selection',async()=>{
 const browser=await launch();try{
  const page=await browser.newPage({viewport:{width:1440,height:1100}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));await page.goto(base+'/v2/home/');
  await page.locator('#overview .home-test').waitFor();assert.equal(await page.locator('#news-list [data-news-list-state]').count(),0);
  await page.locator('[data-view-link="news-list"]').click();await ready(page);
  const summary=page.locator('#news-list details summary');await summary.click();await ready(page,3);await summary.click();await summary.click();await ready(page,3);
  await page.goBack();assert.ok(await page.locator('#overview').isVisible());await page.goForward();assert.ok(await page.locator('#news-list').isVisible());
  await page.reload();await ready(page);assert.equal(await page.locator('#news-list [data-news-list-state]').count(),1);
  await page.locator('[data-group-link="store-updates"]').click();assert.ok(await page.locator('#store-news').isVisible());assert.ok(await page.locator('#store-event').isVisible());assert.ok(await page.locator('#news-list').isVisible());
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});

test('registered, optional-photo and empty news lists fit eight widths with readable scroll and shared materials',async()=>{
 const browser=await launch();try{
  const page=await browser.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
  page.on('request',request=>{if(!request.url().startsWith(base+'/')&&!request.url().startsWith('https://og-familystore-image.s3.ap-northeast-2.amazonaws.com/'))errors.push(request.url());});
  await page.goto(base+'/v2/home/#news-list');
  for(const width of [320,375,390,414,768,1024,1440,1920]){
   await page.setViewportSize({width,height:1100});await page.reload();await ready(page);await page.locator('#news-list details summary').click();await ready(page,3);
   for(const [index,state] of states.entries()){
    const frame=page.locator(`#news-list [data-news-list-state="${state}"]`);
    const result=await frame.evaluate(node=>{
     const body=node.querySelector('.og-news-page-body'),header=node.querySelector('.og-app-bar'),title=header.querySelector('h4').getBoundingClientRect(),box=node.getBoundingClientRect();
     const canvas=document.createElement('canvas');canvas.width=canvas.height=1;const context=canvas.getContext('2d');
     const lum=color=>{context.clearRect(0,0,1,1);context.fillStyle=color;context.fillRect(0,0,1,1);return [...context.getImageData(0,0,1,1).data].slice(0,3).map(value=>value/255).map(value=>value<=.04045?value/12.92:((value+.055)/1.055)**2.4).reduce((sum,value,index)=>sum+value*[.2126,.7152,.0722][index],0);};
     const contrast=(a,b)=>{const x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
     const surface=getComputedStyle(node).backgroundColor;
     return {size:[node.clientWidth,node.clientHeight],fits:[node,body,...body.querySelectorAll('.og-update-row,.og-update-copy,h5,p')].every(element=>element.scrollWidth<=element.clientWidth),
      static:[...node.querySelectorAll('button')].every(button=>button.inert),readable:body.tabIndex===0&&!body.closest('[inert]'),
      heading:header.querySelector('h4').textContent,headingCentered:Math.abs(title.x+title.width/2-box.x-box.width/2)<=1,
      targets:[...node.querySelectorAll('button')].map(button=>[button.clientHeight,button.clientWidth]),
      images:[...body.querySelectorAll('.og-update-row>.v2-thumbnail')].map(photo=>[photo.clientWidth+2,photo.clientHeight+2,photo.dataset.ratio,photo.dataset.fit,getComputedStyle(photo).boxShadow!=='none']),
      empty:[...body.querySelectorAll('.og-news-empty')].map(empty=>{const photo=empty.querySelector('.v2-thumbnail');return[photo.clientWidth,photo.clientHeight,photo.dataset.fit,photo.getAttribute('aria-hidden'),getComputedStyle(photo).boxShadow,empty.querySelector('p').textContent];}),
      rows:[...body.querySelectorAll('.og-update-row')].map(row=>({date:row.querySelector('.og-update-date').textContent,title:row.querySelector('h5').textContent,shadow:getComputedStyle(row).boxShadow,width:row.clientWidth,copy:row.querySelector('.og-update-copy').clientWidth})),
      nums:getComputedStyle(node.querySelector('.v2-news-list')).fontVariantNumeric,font:getComputedStyle(body).fontFamily,
      textContrast:Math.min(...[...node.querySelectorAll('h4,h5,p')].map(element=>contrast(getComputedStyle(element).color,surface))),
      iconContrast:contrast(getComputedStyle(header.querySelector('button')).color,surface),focusContrast:contrast(getComputedStyle(body).getPropertyValue('--v2-focus'),surface)};
    });
    assert.deepEqual(result.size,[Math.min(width,390),846]);assert.ok(result.fits&&result.static&&result.readable);assert.equal(result.heading,'우리 가게 소식');assert.ok(result.headingCentered);
    assert.deepEqual(result.targets,[[48,48]]);
    assert.deepEqual(result.images,index===2?[]:Array.from({length:index===0?1:2},()=>[80,80,'square','cover',true]));
    assert.deepEqual(result.empty,index===2?[[150,150,'contain','true','none','등록된 데이터가 없어요.']]:[]);
    assert.equal(result.rows.length,index===0?1:index===1?3:0);for(const row of result.rows){assert.equal(row.date,'6.26(금)');assert.equal(row.title,'포장할인 5000원');assert.equal(row.shadow,'none');}
    if(index===1)assert.equal(result.rows[1].copy,result.rows[1].width);
    assert.equal(result.nums,'tabular-nums');assert.match(result.font,/OG V2 Pretendard/);assert.ok(result.textContrast>=4.5);assert.ok(result.iconContrast>=3&&result.focusContrast>=3);
    if([320,375,390,414,768].includes(width))await frame.screenshot({path:`/private/tmp/og-v2-news-list-${state}-${width}.png`});
   }
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  }
  const frame=page.locator('#news-list [data-news-list-state="photo-mix"]'),body=frame.locator('.og-news-page-body'),header=frame.locator('header');
  const headerY=await header.evaluate(node=>node.getBoundingClientRect().y-node.closest('.v2-home-news-list-frame').getBoundingClientRect().y);
  await body.evaluate(node=>{const list=node.querySelector('.og-news-list');for(let i=0;i<12;i++)list.append(list.querySelector('.og-update-row').cloneNode(true));});
  await body.focus();await page.keyboard.press('End');
  await page.waitForFunction(()=>{const node=[...document.querySelectorAll('#news-list .v2-home-news-list-host')][1].shadowRoot.querySelector('.og-news-page-body');return node.scrollTop>0&&node.scrollTop>=node.scrollHeight-node.clientHeight-2;});
  assert.equal(await header.evaluate(node=>node.getBoundingClientRect().y-node.closest('.v2-home-news-list-frame').getBoundingClientRect().y),headerY);
  await page.setViewportSize({width:320,height:1100});await frame.locator('h5').first().evaluate(node=>node.textContent='긴소식제목'.repeat(30));
  assert.ok(await frame.locator('.og-update-copy').first().evaluate(node=>node.scrollWidth<=node.clientWidth));assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});

test('failed news and empty-state images retain dates, titles, explanation and fallback geometry',async()=>{
 const browser=await launch();try{
  const page=await browser.newPage({viewport:{width:390,height:1100}});await page.route('https://og-familystore-image.s3.ap-northeast-2.amazonaws.com/**',route=>route.abort());
  await page.goto(base+'/v2/home/#news-list');await ready(page);await page.locator('#news-list details summary').click();await ready(page,3);
  for(const [index,state] of states.entries()){
   const frame=page.locator(`#news-list [data-news-list-state="${state}"]`);
   assert.equal(await frame.locator('.og-update-date').count(),index===0?1:index===1?3:0);
   for(const media of await frame.locator('[data-v2-media]').all()){assert.equal(await media.getAttribute('data-state'),'error');await media.locator('.og-media-fallback').waitFor({state:'visible'});}
   if(index===2){assert.equal(await frame.locator('.og-news-empty p').textContent(),'등록된 데이터가 없어요.');assert.deepEqual(await frame.locator('.og-news-empty .v2-thumbnail').evaluate(node=>[node.clientWidth,node.clientHeight]),[150,150]);}
   else for(const title of await frame.locator('h5').all())assert.equal(await title.textContent(),'포장할인 5000원');
  }
 }finally{await browser.close();}
});
