const test=require('node:test');
const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
const states=['open','current','closed','closed-current','expired-multiple'];
const launch=()=>chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
async function ready(page,count=1){
 await page.waitForFunction(count=>{
  const hosts=[...document.querySelectorAll('#store-reservation .v2-home-store-reservation-host')].filter(host=>host.shadowRoot);
  return hosts.length===count&&hosts.every(host=>[...host.shadowRoot.querySelectorAll('link')].every(link=>link.sheet)&&[...host.shadowRoot.querySelectorAll('img')].every(img=>img.complete));
 },count);
 await page.evaluate(()=>document.fonts.ready);
}

// Catches eager/duplicate mounting or broken service group/direct/history routes.
test('store reservation mounts one primary example and five comparisons only on request',async()=>{
 const browser=await launch();
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1100}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base+'/v2/home/');await page.locator('#overview .home-test').waitFor();
  assert.equal(await page.locator('#store-reservation [data-store-reservation-state]').count(),0);
  await page.locator('[data-view-link="store-reservation"]').click();await ready(page);
  assert.equal(await page.locator('#store-reservation [data-store-reservation-state]').count(),1);
  const summary=page.locator('#store-reservation details summary');
  await summary.click();await ready(page,6);await summary.click();await summary.click();await ready(page,6);
  await page.goBack();assert.ok(await page.locator('#overview').isVisible());
  await page.goForward();assert.ok(await page.locator('#store-reservation').isVisible());
  await page.reload();await ready(page);
  assert.equal(await page.locator('#store-reservation [data-store-reservation-state]').count(),1);
  await page.locator('[data-group-link="store-services"]').click();await ready(page);
  assert.ok(await page.locator('#store-reservation').isVisible());assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});

// Catches precedence/material/contrast/overflow regressions and inaccessible horizontal dates.
test('five reservation states and no-show notice preserve source conditions at eight widths',async()=>{
 const browser=await launch();
 try{
  const page=await browser.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('request',request=>{if(!['GET','HEAD'].includes(request.method())||(!request.url().startsWith(base+'/')&&!request.url().startsWith('https://og-familystore-image.s3.ap-northeast-2.amazonaws.com/')))errors.push(request.url());});
  await page.goto(base+'/v2/home/#store-reservation');
  for(const width of [320,375,390,414,768,1024,1440,1920]){
   await page.setViewportSize({width,height:1100});await page.reload();await ready(page);
   await page.locator('#store-reservation details summary').click();await ready(page,6);
   for(const [index,state] of states.entries()){
    const frame=page.locator(`#store-reservation [data-store-reservation-state="${state}"]`);
    const result=await frame.evaluate(node=>{
     const body=node.querySelector('.og-store-body'),nav=node.querySelector('nav'),section=node.querySelector('.v2-store-reservation');
     const dates=section.querySelector('.og-store-service-dates'),cards=[...section.querySelectorAll('.v2-surface')];
     const canvas=document.createElement('canvas');canvas.width=canvas.height=1;const context=canvas.getContext('2d');
     const lum=color=>{context.clearRect(0,0,1,1);context.fillStyle=color;context.fillRect(0,0,1,1);return [...context.getImageData(0,0,1,1).data].slice(0,3).map(value=>value/255).map(value=>value<=.04045?value/12.92:((value+.055)/1.055)**2.4).reduce((sum,value,index)=>sum+value*[.2126,.7152,.0722][index],0);};
     const contrast=(a,b)=>{const x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
     const surface=getComputedStyle(node).backgroundColor;
     const title=section.querySelector('.og-heading-title-line').getBoundingClientRect(),action=section.querySelector('.og-heading-action').getBoundingClientRect();
     const texts=[...section.querySelectorAll('h4,p,strong,span:not(.og-store-service-icon),button:not(.v2-icon-button)')].filter(element=>element.textContent.trim()&&!element.querySelector('svg'));
     const textContrast=Math.min(...texts.map(element=>{
      const background=element.closest('.v2-button,.og-store-service-date,.v2-surface');
      if(background?.matches('.v2-button[data-variant="primary"]'))return Math.min(...['--v2-button-light','--v2-button-face'].map(token=>contrast(getComputedStyle(element).color,getComputedStyle(background).getPropertyValue(token))));
      return contrast(getComputedStyle(element).color,background?getComputedStyle(background).backgroundColor:surface);
     }));
     return {size:[node.clientWidth,node.clientHeight],
      fits:[node,body,section,...cards,...section.querySelectorAll('.og-store-service-actions')].every(element=>element.scrollWidth<=element.clientWidth),
      current:nav.querySelector('[aria-current="location"]').textContent,
      headingAligned:Math.abs(title.y+title.height/2-action.y-action.height/2)<=1,
      readable:body.tabIndex===0&&!body.closest('[inert]'),
      static:[...node.querySelectorAll('button')].every(button=>button.inert||button.closest('[inert]')),
      buttons:[...section.querySelectorAll('button')].map(button=>[button.clientHeight,button.textContent.trim()?getComputedStyle(button).whiteSpace:'nowrap']),
      cardDepth:cards.map(card=>[card.dataset.depth,getComputedStyle(card).boxShadow!=='none']),
      dateCount:section.querySelectorAll('.og-store-service-date').length,
      dateRail:dates?[dates.tabIndex,dates.scrollWidth>dates.clientWidth]:null,
      dateAvailability:dates?[...dates.querySelectorAll('.og-store-service-date')].map(date=>date.dataset.available):[],
      dateDepth:dates?[...dates.querySelectorAll('.og-store-service-date')].map(date=>getComputedStyle(date).boxShadow!=='none'):[],
      actionNames:[...section.querySelectorAll('button')].map(button=>button.getAttribute('aria-label')||button.textContent.trim()),
      text:section.textContent.replace(/\s+/g,' '),textContrast,
      focusContrast:contrast(getComputedStyle(body).getPropertyValue('--v2-focus'),surface),
      nums:getComputedStyle(section).fontVariantNumeric,font:getComputedStyle(section).fontFamily};
    });
    assert.deepEqual(result.size,[Math.min(width,390),846]);
    assert.ok(result.fits&&result.readable&&result.static);assert.ok(result.headingAligned,'reservation title/action alignment');assert.equal(result.current,'예약/웨이팅');
    assert.ok(result.buttons.every(([height,whitespace])=>height>=48&&whitespace==='nowrap'));
    assert.ok(result.textContrast>=4.5,'text contrast '+state+' '+result.textContrast);assert.ok(result.focusContrast>=3);
    assert.equal(result.nums,'tabular-nums');assert.match(result.font,/OG V2 Pretendard/);
    assert.equal(result.dateCount,index===0?5:0);
    assert.deepEqual(result.cardDepth,index===0?[]:index===1?[['raised',true]]:index===2?[['inset',true]]:index===3?[['inset',true],['raised',true]]:[['raised',true]]);
    if(index===0){assert.deepEqual(result.dateRail,[0,true]);assert.deepEqual(result.dateAvailability,['true','true','false','true','true']);assert.deepEqual(result.dateDepth,[true,true,false,true,true]);}
    assert.deepEqual(result.actionNames,index===0?['예약 내역 보기','다른 날짜 예약']:index===2?['예약 내역 보기']:index===3?['예약 내역 보기','내 예약 보기']:['예약 내역 보기','내 예약 보기','추가 예약']);
    if([2,3].includes(index))assert.match(result.text,/현재 예약 접수가 일시적으로 중지되었습니다/);
    if([1,3,4].includes(index))assert.match(result.text,/성인: 2명, 어린이: 0명/);
    if(index===4){assert.match(result.text,/예약이 2건 있습니다/);assert.match(result.text,/예약 시간 경과/);}
    if([320,375,390,414,768].includes(width))await frame.screenshot({path:`/private/tmp/og-v2-store-reservation-${state}-${width}.png`});
   }
   const popup=page.locator('#store-reservation [data-store-reservation-state="no-show-limit"]');
   await popup.scrollIntoViewIfNeeded();
   const notice=await popup.evaluate(node=>{
    const overlay=node.querySelector('.v2-store-reservation-limit-overlay'),panel=node.querySelector('.v2-dialog-panel'),body=node.querySelector('.og-dialog-body'),backdrop=node.querySelector('.v2-store-reservation-backdrop'),frame=node.getBoundingClientRect(),scrim=overlay.getBoundingClientRect(),box=panel.getBoundingClientRect();
    const header=node.querySelector('header').getBoundingClientRect(),top=node.getRootNode().elementFromPoint(header.left+24,header.top+24);
    return {size:[node.clientWidth,node.clientHeight],cover:[scrim.left-frame.left,scrim.top-frame.top,scrim.width,scrim.height],width:box.width,height:box.height,fits:[panel,body].every(n=>n.scrollWidth<=n.clientWidth),isolated:backdrop.inert&&backdrop.getAttribute('aria-hidden')==='true'&&backdrop.contains(node.querySelector('header'))&&backdrop.contains(node.querySelector('.og-store-body')),aboveHeader:overlay.contains(top),readable:body.tabIndex===0&&!body.closest('[inert]'),static:[...node.querySelectorAll('button')].every(n=>n.inert||n.closest('[inert]')),text:body.innerText,confirmation:panel.querySelector('button').textContent,title:panel.querySelector('h3').textContent};
   });
   assert.deepEqual(notice.size,[Math.min(width,390),846]);assert.deepEqual(notice.cover,[0,0,Math.min(width,390),846]);
   assert.ok(notice.width<=Math.min(320,width-32)&&notice.height<=814&&notice.fits&&notice.isolated&&notice.aboveHeader&&notice.readable&&notice.static);
   assert.equal(notice.title,'미방문(노쇼) 누적 안내');assert.equal(notice.confirmation,'확인');assert.match(notice.text,/1개월간/);assert.match(notice.text,/미방문 누적 횟수: 3회/);assert.match(notice.text,/해제일: 2026년 10월 18일/);assert.match(notice.text,/실제 회원정보가 아닌 표시 예시/);
   await popup.locator('.og-dialog-body').focus();assert.ok(await popup.locator('.og-dialog-body').evaluate(n=>n.getRootNode().activeElement===n));
   if([320,375,390,414,768].includes(width))await popup.screenshot({path:`/private/tmp/og-v2-store-reservation-no-show-limit-${width}.png`});
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  }
  const frame=page.locator('#store-reservation [data-store-reservation-state="open"]'),rail=frame.locator('.og-store-service-dates');
  await rail.focus();for(let i=0;i<8;i++)await page.keyboard.press('ArrowRight');
  await page.waitForFunction(()=>document.querySelector('#store-reservation .v2-home-store-reservation-host').shadowRoot.querySelector('.og-store-service-dates').scrollLeft>0);
  const body=frame.locator('.og-store-body'),header=frame.locator('header');
  const headerY=await header.evaluate(node=>node.getBoundingClientRect().y-node.closest('.v2-home-store-frame').getBoundingClientRect().y);
  await body.evaluate(node=>{for(let i=0;i<4;i++)node.append(node.querySelector('.v2-store-reservation').cloneNode(true));});
  await body.focus();await page.keyboard.press('End');
  await page.waitForFunction(()=>{const node=document.querySelector('#store-reservation .v2-home-store-reservation-host').shadowRoot.querySelector('.og-store-body');return node.scrollTop>0&&node.scrollTop>=node.scrollHeight-node.clientHeight-2;});
  assert.equal(await header.evaluate(node=>node.getBoundingClientRect().y-node.closest('.v2-home-store-frame').getBoundingClientRect().y),headerY);
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});

// Catches a failed identity asset blanking the reservation/date/people content.
test('store logo failure preserves reservation facts and a shared media fallback',async()=>{
 const browser=await launch();
 try{
  const page=await browser.newPage({viewport:{width:390,height:1100}});
  await page.route('https://og-familystore-image.s3.ap-northeast-2.amazonaws.com/**',route=>route.abort());
  await page.goto(base+'/v2/home/#store-reservation');await ready(page);
  await page.locator('#store-reservation details summary').click();await ready(page,6);
  for(const state of [...states,'no-show-limit']){
   const frame=page.locator(`#store-reservation [data-store-reservation-state="${state}"]`),logo=frame.locator('.v2-store-logo [data-v2-media]');
   assert.equal(await logo.getAttribute('data-state'),'error');await logo.locator('.og-media-fallback').waitFor({state:'visible'});
   assert.match(await frame.locator('.og-store-name').textContent(),/오시 망원본점/);
   assert.equal(await frame.locator('.v2-store-reservation').count(),1);
  }
 }finally{await browser.close();}
});
