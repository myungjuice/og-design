const test=require('node:test');
const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
const states=['open','no-estimate','current','closed','no-info','break-preparing','close-preparing'];
const launch=()=>chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
async function ready(page,count=1){
 await page.waitForFunction(count=>{
  const hosts=[...document.querySelectorAll('#store-waiting .v2-home-store-waiting-host')].filter(host=>host.shadowRoot);
  return hosts.length===count&&hosts.every(host=>[...host.shadowRoot.querySelectorAll('link')].every(link=>link.sheet)&&[...host.shadowRoot.querySelectorAll('img')].every(img=>img.complete));
 },count);
 await page.evaluate(()=>document.fonts.ready);
}

// Catches unreachable service routes, broken history and eager/duplicate comparisons.
test('store waiting shares the service group and lazily mounts six comparisons',async()=>{
 const browser=await launch();
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1100}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base+'/v2/home/');await page.locator('#overview .home-test').waitFor();
  assert.equal(await page.locator('#store-waiting [data-store-waiting-state]').count(),0);
  await page.locator('[data-view-link="store-waiting"]').click();await ready(page);
  assert.equal(await page.locator('#store-waiting [data-store-waiting-state]').count(),1);
  const summary=page.locator('#store-waiting details summary');
  await summary.click();await ready(page,7);await summary.click();await summary.click();await ready(page,7);
  await page.goBack();assert.ok(await page.locator('#overview').isVisible());
  await page.goForward();assert.ok(await page.locator('#store-waiting').isVisible());
  await page.reload();await ready(page);
  assert.equal(await page.locator('#store-waiting [data-store-waiting-state]').count(),1);
  await page.locator('[data-group-link="store-services"]').click();await ready(page);
  assert.ok(await page.locator('#store-reservation').isVisible());assert.ok(await page.locator('#store-waiting').isVisible());
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});

// Catches blended ticket/order, null-as-zero, overflow, inconsistent depths and unreadable text.
test('seven waiting states preserve source facts and preparation restrictions at eight widths',async()=>{
 const browser=await launch();
 try{
  const page=await browser.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('request',request=>{if(!['GET','HEAD'].includes(request.method())||(!request.url().startsWith(base+'/')&&!request.url().startsWith('https://og-familystore-image.s3.ap-northeast-2.amazonaws.com/')))errors.push(request.url());});
  await page.goto(base+'/v2/home/#store-waiting');
  for(const width of [320,375,390,414,768,1024,1440,1920]){
   await page.setViewportSize({width,height:1100});await page.reload();await ready(page);
   await page.locator('#store-waiting details summary').click();await ready(page,7);
   for(const [index,state] of states.entries()){
    const frame=page.locator(`#store-waiting [data-store-waiting-state="${state}"]`);
    const result=await frame.evaluate(node=>{
     const body=node.querySelector('.og-store-body'),section=node.querySelector('.v2-store-waiting'),card=section.querySelector('.v2-surface');
     const title=section.querySelector('.og-heading-title-line').getBoundingClientRect(),action=section.querySelector('.og-heading-action').getBoundingClientRect();
     const canvas=document.createElement('canvas');canvas.width=canvas.height=1;const context=canvas.getContext('2d');
     const lum=color=>{context.clearRect(0,0,1,1);context.fillStyle=color;context.fillRect(0,0,1,1);return [...context.getImageData(0,0,1,1).data].slice(0,3).map(value=>value/255).map(value=>value<=.04045?value/12.92:((value+.055)/1.055)**2.4).reduce((sum,value,index)=>sum+value*[.2126,.7152,.0722][index],0);};
     const contrast=(a,b)=>{const x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
     const surface=getComputedStyle(node).backgroundColor;
     const texts=[...section.querySelectorAll('h4,p,strong,small,em,span:not(.og-store-service-icon),button:not(.v2-icon-button)')].filter(element=>element.textContent.trim()&&!element.querySelector('svg'));
     const textContrast=Math.min(...texts.map(element=>{
      const background=element.closest('.v2-button,.v2-surface');
      if(background?.matches('.v2-button[data-variant="primary"]'))return Math.min(...['--v2-button-light','--v2-button-face'].map(token=>contrast(getComputedStyle(element).color,getComputedStyle(background).getPropertyValue(token))));
      return contrast(getComputedStyle(element).color,background?getComputedStyle(background).backgroundColor:surface);
     }));
     return {size:[node.clientWidth,node.clientHeight],
      fits:[node,body,section,card,section.querySelector('.og-store-service-copy'),...section.querySelectorAll('.og-store-service-ticket strong')].every(element=>element.scrollWidth<=element.clientWidth),
      headingAligned:Math.abs(title.y+title.height/2-action.y-action.height/2)<=1,
      current:node.querySelector('nav [aria-current="location"]').textContent,
      readable:body.tabIndex===0&&!body.closest('[inert]'),
      static:[...node.querySelectorAll('button')].every(button=>button.inert||button.closest('[inert]')),
      buttons:[...section.querySelectorAll('button')].map(button=>[button.clientHeight,button.textContent.trim()?getComputedStyle(button).whiteSpace:'nowrap']),
      cardDepth:[card.dataset.depth,getComputedStyle(card).boxShadow!=='none'],
      ticket:section.querySelector('.og-store-service-ticket')?[...section.querySelectorAll('.og-store-service-ticket strong')].map(element=>element.textContent):[],
      nums:getComputedStyle(section).fontVariantNumeric,font:getComputedStyle(section).fontFamily,
      actions:[...section.querySelectorAll('button')].map(button=>button.getAttribute('aria-label')||button.textContent.trim()),
      text:section.textContent.replace(/\s+/g,' '),textContrast,
      focusContrast:contrast(getComputedStyle(body).getPropertyValue('--v2-focus'),surface),
      iconContrast:contrast(getComputedStyle(section.querySelector('.v2-icon-button')).color,getComputedStyle(card).backgroundColor)};
    });
    assert.deepEqual(result.size,[Math.min(width,390),846]);assert.ok(result.fits&&result.readable&&result.static);
    assert.ok(result.headingAligned);assert.equal(result.current,'예약/웨이팅');
    assert.ok(result.buttons.every(([height,whitespace])=>height>=48&&whitespace==='nowrap'));
    assert.deepEqual(result.cardDepth,[index<3?'raised':'inset',true]);
    assert.equal(result.nums,'tabular-nums');assert.match(result.font,/OG V2 Pretendard/);
    assert.ok(result.textContrast>=4.5,'text contrast '+state+' '+result.textContrast);assert.ok(result.focusContrast>=3);assert.ok(result.iconContrast>=3);
    assert.deepEqual(result.actions,['웨이팅 내역 보기','새로고침',...(index<2?['웨이팅 등록']:index===2?['웨이팅 실시간 보기']:[])]);
    if(index<2)assert.match(result.text,/현재 웨이팅5 팀/);
    if(index===0)assert.match(result.text,/예상 대기 시간: 20분/);else assert.doesNotMatch(result.text,/예상 대기 시간:/);
    assert.deepEqual(result.ticket,index===2?['대기번호 12번','내 순서 3번째']:[]);
    if(index===2)assert.match(result.text,/성인: 2명, 어린이: 0명/);
    if(index===3)assert.match(result.text,/현재 웨이팅 상태가 아닙니다/);
    if(index===4){assert.match(result.text,/웨이팅정보가 없습니다/);assert.match(result.text,/입구에서 직원에게 문의해주세요/);}
    if(index>=5){assert.match(result.text,/현재 웨이팅 상태가 아닙니다/);assert.match(result.text,index===5?/곧 브레이크 타임 15:00에 브레이크 타임/:/곧 영업 종료 22:00에 영업 종료/);assert.doesNotMatch(result.text,/웨이팅 등록|예상 대기 시간:/);}
    if([320,375,390,414,768].includes(width))await frame.screenshot({path:`/private/tmp/og-v2-store-waiting-${state}-${width}.png`});
   }
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  }
  const frame=page.locator('#store-waiting [data-store-waiting-state="current"]'),body=frame.locator('.og-store-body'),header=frame.locator('header');
  const headerY=await header.evaluate(node=>node.getBoundingClientRect().y-node.closest('.v2-home-store-frame').getBoundingClientRect().y);
  await body.evaluate(node=>{for(let i=0;i<6;i++)node.append(node.querySelector('.v2-store-waiting').cloneNode(true));});
  await body.focus();await page.keyboard.press('End');
  await page.waitForFunction(()=>{const node=document.querySelectorAll('#store-waiting .v2-home-store-waiting-host')[2].shadowRoot.querySelector('.og-store-body');return node.scrollTop>0&&node.scrollTop>=node.scrollHeight-node.clientHeight-2;});
  assert.equal(await header.evaluate(node=>node.getBoundingClientRect().y-node.closest('.v2-home-store-frame').getBoundingClientRect().y),headerY);
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});

// Catches identity asset failure blanking team/ticket/notice information.
test('failed logo preserves all five waiting states with a shared media fallback',async()=>{
 const browser=await launch();
 try{
  const page=await browser.newPage({viewport:{width:390,height:1100}});
  await page.route('https://og-familystore-image.s3.ap-northeast-2.amazonaws.com/**',route=>route.abort());
  await page.goto(base+'/v2/home/#store-waiting');await ready(page);
  await page.locator('#store-waiting details summary').click();await ready(page,7);
  for(const state of states){
   const frame=page.locator(`#store-waiting [data-store-waiting-state="${state}"]`),logo=frame.locator('.v2-store-logo [data-v2-media]');
   assert.equal(await logo.getAttribute('data-state'),'error');await logo.locator('.og-media-fallback').waitFor({state:'visible'});
   assert.match(await frame.locator('.og-store-name').textContent(),/오시 망원본점/);
   assert.equal(await frame.locator('.v2-store-waiting').count(),1);
  }
 }finally{await browser.close();}
});
