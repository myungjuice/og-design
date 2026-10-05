const test=require('node:test');
const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
const states=['registered','photo','no-photo'];
const launch=()=>chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
async function ready(page,count=1){
 await page.waitForFunction(count=>{
  const hosts=[...document.querySelectorAll('#event-detail .v2-home-event-detail-host')].filter(host=>host.shadowRoot);
  return hosts.length===count&&hosts.every(host=>[...host.shadowRoot.querySelectorAll('link')].every(link=>link.sheet)&&[...host.shadowRoot.querySelectorAll('img')].every(img=>img.complete));
 },count);await page.evaluate(()=>document.fonts.ready);
}

test('event detail mounts on demand and preserves direct hash, history, reload and the updates group',async()=>{
 const browser=await launch();try{
  const page=await browser.newPage({viewport:{width:1440,height:1100}}),errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base+'/v2/home/');await page.locator('#overview .home-test').waitFor();
  assert.equal(await page.locator('#event-detail [data-event-detail-state]').count(),0);
  await page.locator('[data-view-link="event-detail"]').click();await ready(page);
  const summary=page.locator('#event-detail details summary');await summary.click();await ready(page,3);await summary.click();await summary.click();await ready(page,3);
  await page.goBack();assert.ok(await page.locator('#overview').isVisible());await page.goForward();assert.ok(await page.locator('#event-detail').isVisible());
  await page.reload();await ready(page);assert.equal(await page.locator('#event-detail [data-event-detail-state]').count(),1);
  await page.locator('[data-group-link="store-updates"]').click();
  for(const id of ['store-news','store-event','news-list','news-detail','event-list','event-detail'])assert.ok(await page.locator('#'+id).isVisible());
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});

test('three event details preserve period before prose, natural attachment ratio and shared chrome at eight widths',async()=>{
 const browser=await launch();try{
  const page=await browser.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
  page.on('request',request=>{if(!request.url().startsWith(base+'/')&&!request.url().startsWith('https://og-familystore-image.s3.ap-northeast-2.amazonaws.com/'))errors.push(request.url());});
  await page.goto(base+'/v2/home/#event-detail');
  for(const width of [320,375,390,414,768,1024,1440,1920]){
   await page.setViewportSize({width,height:1100});await page.reload();await ready(page);await page.locator('#event-detail details summary').click();await ready(page,3);
   for(const state of states){
    const frame=page.locator(`#event-detail [data-event-detail-state="${state}"]`);
    const result=await frame.evaluate(node=>{
     const body=node.querySelector('.og-news-page-body'),bar=node.querySelector('.og-app-bar'),article=body.querySelector('.og-news-article'),heading=article.querySelector('h5'),prose=article.querySelector('.og-news-contents'),date=article.querySelector('.og-news-registered'),period=article.querySelector('.og-reading-period'),box=node.getBoundingClientRect(),headbox=bar.querySelector('h4').getBoundingClientRect();
     const canvas=document.createElement('canvas');canvas.width=canvas.height=1;const context=canvas.getContext('2d');
     const lum=color=>{context.clearRect(0,0,1,1);context.fillStyle=color;context.fillRect(0,0,1,1);return [...context.getImageData(0,0,1,1).data].slice(0,3).map(value=>value/255).map(value=>value<=.04045?value/12.92:((value+.055)/1.055)**2.4).reduce((sum,value,index)=>sum+value*[.2126,.7152,.0722][index],0);};
     const contrast=(a,b)=>{const x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
     const surface=getComputedStyle(node).backgroundColor;
     return {size:[node.clientWidth,node.clientHeight],fits:[node,body,article,heading,prose,date,period].every(element=>element.scrollWidth<=element.clientWidth),
      static:[...node.querySelectorAll('button')].every(button=>button.inert),readable:body.tabIndex===0&&!body.closest('[inert]'),title:bar.querySelector('h4').textContent,
      centered:Math.abs(headbox.x+headbox.width/2-box.x-box.width/2)<=1,date:date.textContent,dateAlign:getComputedStyle(date).textAlign,
      heading:heading.textContent,headingAlign:getComputedStyle(heading).textAlign,divider:getComputedStyle(heading).borderBottomWidth,period:period.textContent,periodAlign:getComputedStyle(period).textAlign,periodDivider:getComputedStyle(period).borderBottomWidth,periodAfterTitle:period.getBoundingClientRect().y>=heading.getBoundingClientRect().bottom,proseAfterPeriod:prose.getBoundingClientRect().y>=period.getBoundingClientRect().bottom,
      contents:prose.textContent,whiteSpace:getComputedStyle(prose).whiteSpace,shadow:getComputedStyle(article).boxShadow,
      photos:[...article.querySelectorAll('.v2-thumbnail')].map(photo=>{const img=photo.querySelector('img'),rect=img.getBoundingClientRect();return {state:photo.dataset.state,fit:getComputedStyle(img).objectFit,width:rect.width,height:rect.height,ratio:img.naturalWidth/img.naturalHeight,fullWidth:Math.abs(photo.getBoundingClientRect().width-article.getBoundingClientRect().width)<=1,after:photo.getBoundingClientRect().y>=prose.getBoundingClientRect().bottom,shadow:getComputedStyle(photo).boxShadow};}),
      targets:[...node.querySelectorAll('button')].map(button=>[button.clientHeight,button.clientWidth]),nums:getComputedStyle(node.querySelector('.v2-event-detail')).fontVariantNumeric,font:getComputedStyle(body).fontFamily,
      textContrast:Math.min(...[...node.querySelectorAll('h4,h5,p,.og-news-contents')].map(element=>contrast(getComputedStyle(element).color,surface))),
      iconContrast:contrast(getComputedStyle(bar.querySelector('button')).color,surface),focusContrast:contrast(getComputedStyle(body).getPropertyValue('--v2-focus'),surface)};
    });
    assert.deepEqual(result.size,[Math.min(width,390),846]);assert.ok(result.fits&&result.static&&result.readable&&result.centered);
    assert.equal(result.title,'이벤트');assert.equal(result.date,'등록일 : 2026.6.26 21.45');assert.equal(result.dateAlign,'right');
    assert.equal(result.heading,'포장할인 5000원');assert.equal(result.headingAlign,'center');assert.equal(result.divider,'0px');assert.equal(result.period,'2026.6.26 ~ 2026.8.31');assert.equal(result.periodAlign,'center');assert.equal(result.periodDivider,'1px');assert.ok(result.periodAfterTitle&&result.proseAfterPeriod);
    assert.equal(result.contents,'대표메뉴 주문시 포장\n5000원 할인 됩니다.');assert.equal(result.whiteSpace,'pre-wrap');assert.equal(result.shadow,'none');
    assert.equal(result.photos.length,state==='no-photo'?0:1);
    for(const photo of result.photos){assert.equal(photo.state,'ready');assert.equal(photo.fit,'contain');assert.ok(photo.fullWidth&&photo.after);assert.ok(Math.abs(photo.width/photo.height-photo.ratio)<.01);assert.notEqual(photo.shadow,'none');}
    assert.deepEqual(result.targets,[[48,48]]);assert.equal(result.nums,'tabular-nums');assert.match(result.font,/OG V2 Pretendard/);assert.ok(result.textContrast>=4.5);assert.ok(result.iconContrast>=3&&result.focusContrast>=3);
    if([320,375,390,414,768].includes(width))await frame.screenshot({path:`/private/tmp/og-v2-event-detail-${state}-${width}.png`});
   }
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  }
  await page.setViewportSize({width:320,height:1100});
  const frame=page.locator('#event-detail [data-event-detail-state="registered"]'),body=frame.locator('.og-news-page-body'),header=frame.locator('header');
  const headerY=await header.evaluate(node=>node.getBoundingClientRect().y-node.closest('.v2-home-event-detail-frame').getBoundingClientRect().y);
  await frame.locator('h5').evaluate(node=>node.textContent='긴이벤트제목'.repeat(30));
  await frame.locator('.og-news-contents').evaluate(node=>node.textContent='긴 본문과 줄바꿈을 확인합니다.\n\n'.repeat(80));
  for(const selector of ['h5','.og-news-contents','.og-news-article'])assert.ok(await frame.locator(selector).evaluate(node=>node.scrollWidth<=node.clientWidth));
  await body.focus();await page.keyboard.press('End');
  await page.waitForFunction(()=>{const node=document.querySelector('#event-detail .v2-home-event-detail-host').shadowRoot.querySelector('.og-news-page-body');return node.scrollTop>0&&node.scrollTop>=node.scrollHeight-node.clientHeight-2;});
  assert.equal(await header.evaluate(node=>node.getBoundingClientRect().y-node.closest('.v2-home-event-detail-frame').getBoundingClientRect().y),headerY);
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});

test('attachment failures retain date, title, prose and a visible fallback while no-photo stays slot-free',async()=>{
 const browser=await launch();try{
  const page=await browser.newPage({viewport:{width:390,height:1100}});await page.route('https://og-familystore-image.s3.ap-northeast-2.amazonaws.com/**',route=>route.abort());
  await page.goto(base+'/v2/home/#event-detail');await ready(page);await page.locator('#event-detail details summary').click();await ready(page,3);
  for(const state of states){
   const frame=page.locator(`#event-detail [data-event-detail-state="${state}"]`);
   assert.equal(await frame.locator('.og-reading-period').textContent(),'2026.6.26 ~ 2026.8.31');
   assert.equal(await frame.locator('h5').textContent(),'포장할인 5000원');assert.equal(await frame.locator('.og-news-registered').textContent(),'등록일 : 2026.6.26 21.45');
   assert.equal(await frame.locator('.og-news-contents').textContent(),'대표메뉴 주문시 포장\n5000원 할인 됩니다.');
   assert.equal(await frame.locator('[data-v2-media]').count(),state==='no-photo'?0:1);
   if(state!=='no-photo'){
    const media=frame.locator('[data-v2-media]');assert.equal(await media.getAttribute('data-state'),'error');
    await media.locator('.og-media-fallback').waitFor({state:'visible'});assert.match(await media.getAttribute('aria-label'),/이미지를 불러오지 못했어요/);
    assert.ok(await media.evaluate(node=>node.getBoundingClientRect().height>=180));
    assert.equal(await media.locator('.og-media-fallback>span').textContent(),'이미지를 불러오지 못했어요');
   }
  }
 }finally{await browser.close();}
});
