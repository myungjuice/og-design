const test=require('node:test');
const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
const states=['registered','active','upcoming-ended'];
const launch=()=>chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
async function ready(page,count=1){
 await page.waitForFunction(count=>{
  const hosts=[...document.querySelectorAll('#store-event .v2-home-store-event-host')].filter(host=>host.shadowRoot);
  return hosts.length===count&&hosts.every(host=>[...host.shadowRoot.querySelectorAll('link')].every(link=>link.sheet)&&[...host.shadowRoot.querySelectorAll('img')].every(img=>img.complete));
 },count);await page.evaluate(()=>document.fonts.ready);
}

test('event is reachable with lazy comparisons, direct hash, history and the shared updates group',async()=>{
 const browser=await launch();try{
  const page=await browser.newPage({viewport:{width:1440,height:1100}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));await page.goto(base+'/v2/home/');
  await page.locator('#overview .home-test').waitFor();assert.equal(await page.locator('#store-event [data-store-event-state]').count(),0);
  await page.locator('[data-view-link="store-event"]').click();await ready(page);
  const summary=page.locator('#store-event details summary');await summary.click();await ready(page,3);await summary.click();await summary.click();await ready(page,3);
  await page.goBack();assert.ok(await page.locator('#overview').isVisible());await page.goForward();assert.ok(await page.locator('#store-event').isVisible());
  await page.reload();await ready(page);assert.equal(await page.locator('#store-event [data-store-event-state]').count(),1);
  await page.locator('[data-group-link="store-updates"]').click();assert.ok(await page.locator('#store-news').isVisible());assert.ok(await page.locator('#store-event').isVisible());
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});

test('three event examples keep date states, star shapes and optional photos readable at eight widths',async()=>{
 const browser=await launch();try{
  const page=await browser.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
  page.on('request',request=>{if(!request.url().startsWith(base+'/')&&!request.url().startsWith('https://og-familystore-image.s3.ap-northeast-2.amazonaws.com/'))errors.push(request.url());});
  await page.goto(base+'/v2/home/#store-event');
  for(const width of [320,375,390,414,768,1024,1440,1920]){
   await page.setViewportSize({width,height:1100});await page.reload();await ready(page);await page.locator('#store-event details summary').click();await ready(page,3);
   for(const [index,state] of states.entries()){
    const frame=page.locator(`#store-event [data-store-event-state="${state}"]`);
    const result=await frame.evaluate(node=>{
     const body=node.querySelector('.og-store-body'),section=node.querySelector('.v2-store-event');
     const title=section.querySelector('.og-heading-title-line').getBoundingClientRect(),action=section.querySelector('.og-heading-action').getBoundingClientRect();
     const canvas=document.createElement('canvas');canvas.width=canvas.height=1;const context=canvas.getContext('2d');
     const lum=color=>{context.clearRect(0,0,1,1);context.fillStyle=color;context.fillRect(0,0,1,1);return [...context.getImageData(0,0,1,1).data].slice(0,3).map(value=>value/255).map(value=>value<=.04045?value/12.92:((value+.055)/1.055)**2.4).reduce((sum,value,index)=>sum+value*[.2126,.7152,.0722][index],0);};
     const contrast=(a,b)=>{const x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
     const surface=getComputedStyle(node).backgroundColor;
     const rows=[...section.querySelectorAll('.og-update-row')];
     return {size:[node.clientWidth,node.clientHeight],fits:[node,body,section,...section.querySelectorAll('.og-update-row,.og-update-copy,h4,p')].every(element=>element.scrollWidth<=element.clientWidth),
      static:[...node.querySelectorAll('button')].every(button=>button.inert||button.closest('[inert]')),readable:body.tabIndex===0&&!body.closest('[inert]'),
      current:node.querySelector('nav [aria-current="location"]').textContent,
      headingAligned:Math.abs(title.y+title.height/2-action.y-action.height/2)<=1,
      targets:[...node.querySelectorAll('button')].map(button=>[button.clientHeight,button.clientWidth,button.textContent.trim()?getComputedStyle(button).whiteSpace:'nowrap']),
      images:[...section.querySelectorAll('.v2-thumbnail')].map(photo=>[photo.clientWidth+2,photo.clientHeight+2,photo.dataset.ratio,photo.dataset.fit,getComputedStyle(photo).boxShadow!=='none']),
      rows:rows.map(row=>({date:row.querySelector('.og-update-date').textContent,title:row.querySelector('h4').textContent,status:row.dataset.status,remaining:row.querySelector('.og-update-status').textContent,star:row.querySelector('[data-event-star]').dataset.eventStar,fill:getComputedStyle(row.querySelector('[data-event-star]')).fill,shadow:getComputedStyle(row).boxShadow,width:row.clientWidth,copy:row.querySelector('.og-update-copy').clientWidth})),
      nums:getComputedStyle(section).fontVariantNumeric,font:getComputedStyle(section).fontFamily,
      textContrast:Math.min(...[...section.querySelectorAll('h3,h4,p,strong,.og-heading-action')].map(element=>contrast(getComputedStyle(element).color,surface))),
      iconContrast:Math.min(...[...section.querySelectorAll('[data-event-star]')].map(element=>contrast(getComputedStyle(element).color,surface))),
      focusContrast:contrast(getComputedStyle(body).getPropertyValue('--v2-focus'),surface)};
    });
    assert.deepEqual(result.size,[Math.min(width,390),846]);assert.ok(result.fits&&result.static&&result.readable,JSON.stringify({width,state,result}));assert.equal(result.current,'이벤트');assert.ok(result.headingAligned);
    assert.ok(result.targets.every(([height,w,wrap])=>height>=48&&w>=44&&wrap==='nowrap'));
    assert.deepEqual(result.images,[[80,80,'square','cover',true]]);
    assert.equal(result.rows.length,index===0?1:2);
    const expected=[['ended','종료된 이벤트','2026-06-26 ~ 2026-08-31']],active=[['active','진행 중 2일 남음','2026-09-01 ~ 2026-09-21'],['active','진행 중 오늘 종료','2026-09-01 ~ 2026-09-19']],other=[['upcoming','D-3','2026-09-22 ~ 2026-09-30'],['ended','종료된 이벤트','2026-09-01 ~ 2026-09-18']];
    assert.deepEqual(result.rows.map(row=>[row.status,row.remaining,row.date]),index===0?expected:index===1?active:other);
    for(const row of result.rows){assert.equal(row.title,'포장할인 5000원');assert.equal(row.shadow,'none');assert.equal(row.star,index===1?'filled':'outline');assert.equal(row.fill==='none',index!==1);}
    if(index!==0)assert.equal(result.rows[1].copy,result.rows[1].width);
    assert.equal(result.nums,'tabular-nums');assert.match(result.font,/OG V2 Pretendard/);assert.ok(result.textContrast>=4.5);assert.ok(result.iconContrast>=3);assert.ok(result.focusContrast>=3);
    if([320,375,390,414,768].includes(width))await frame.screenshot({path:`/private/tmp/og-v2-store-event-${state}-${width}.png`});
   }
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  }
  const frame=page.locator('#store-event [data-store-event-state="registered"]'),body=frame.locator('.og-store-body'),header=frame.locator('header');
  const headerY=await header.evaluate(node=>node.getBoundingClientRect().y-node.closest('.v2-home-store-frame').getBoundingClientRect().y);
  await body.evaluate(node=>{for(let i=0;i<10;i++)node.append(node.querySelector('.v2-store-event').cloneNode(true));});await body.focus();await page.keyboard.press('End');
  await page.waitForFunction(()=>{const node=document.querySelector('#store-event .v2-home-store-event-host').shadowRoot.querySelector('.og-store-body');return node.scrollTop>0&&node.scrollTop>=node.scrollHeight-node.clientHeight-2;});
  assert.equal(await header.evaluate(node=>node.getBoundingClientRect().y-node.closest('.v2-home-store-frame').getBoundingClientRect().y),headerY);assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});

test('failed source assets retain event titles, dates and states with no empty second photo',async()=>{
 const browser=await launch();try{
  const page=await browser.newPage({viewport:{width:390,height:1100}});await page.route('https://og-familystore-image.s3.ap-northeast-2.amazonaws.com/**',route=>route.abort());
  await page.goto(base+'/v2/home/#store-event');await ready(page);await page.locator('#store-event details summary').click();await ready(page,3);
  for(const [index,state] of states.entries()){
   const frame=page.locator(`#store-event [data-store-event-state="${state}"]`);
   assert.match(await frame.locator('.og-store-name').textContent(),/육감만족/);
   assert.equal(await frame.locator('.og-update-date').count(),index===0?1:2);
   assert.equal(await frame.locator('.og-update-status').count(),index===0?1:2);
   for(const media of await frame.locator('[data-v2-media]').all()){assert.equal(await media.getAttribute('data-state'),'error');await media.locator('.og-media-fallback').waitFor({state:'visible'});}
   assert.equal(await frame.locator('.v2-store-event .v2-thumbnail').count(),1);
  }
 }finally{await browser.close();}
});
