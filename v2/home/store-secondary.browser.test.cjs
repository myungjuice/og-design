const test=require('node:test');
const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
const boards={'store-share':['open'],'store-photo':['first','last'],'praise-write':['targets','empty','selection','selected','edit','delete','limit']};
const launch=()=>chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
async function ready(page,id,count=1){
 await page.waitForFunction(({id,count})=>{
  const hosts=[...document.querySelectorAll('#'+id+' .v2-home-'+id+'-host')].filter(host=>host.shadowRoot);
  return hosts.length===count&&hosts.every(host=>[...host.shadowRoot.querySelectorAll('link')].every(link=>link.sheet)&&[...host.shadowRoot.querySelectorAll('img')].every(img=>img.complete));
 },{id,count});await page.evaluate(()=>document.fonts.ready);
}
test('restored store boards stay deferred, open comparisons once and survive direct routes',async()=>{
 const browser=await launch();try{
  const page=await browser.newPage({viewport:{width:1440,height:1100}}),errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.route('https://og-familystore-image.s3.ap-northeast-2.amazonaws.com/**',async route=>{await new Promise(resolve=>setTimeout(resolve,120));await route.continue();});
  await page.goto(base+'/v2/home/');await page.locator('#overview .home-test').waitFor();
  for(const id of Object.keys(boards))assert.equal(await page.locator('#'+id+' [data-'+id+'-state]').count(),0,id+' must be deferred');
  for(const [id,states] of Object.entries(boards)){
   await page.locator('[data-view-link="'+id+'"]').click();await ready(page,id);assert.equal(new URL(page.url()).hash,'#'+id);
   if(states.length>1){const summary=page.locator('#'+id+' summary');await summary.click();await ready(page,id,states.length);await summary.click();await summary.click();await ready(page,id,states.length);}
   await page.reload();await ready(page,id);assert.equal(await page.locator('#'+id+' [data-'+id+'-state]').count(),1);
  }
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});
test('share, photo and praise specimens fit five widths and retain passive legacy surfaces',async()=>{
 const browser=await launch();try{
  const page=await browser.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
  for(const [id,states] of Object.entries(boards)){
   await page.goto(base+'/v2/home/#'+id);await ready(page,id);
   if(states.length>1){await page.locator('#'+id+' summary').click();await ready(page,id,states.length);}
   for(const width of [320,375,390,414,768]){
    await page.setViewportSize({width,height:1100});
    for(const state of states){
     const frame=page.locator('#'+id+' [data-'+id+'-state="'+state+'"]').first();
     const result=await frame.evaluate(node=>{
      const controls=[...node.querySelectorAll('button')].filter(button=>!button.closest('.v2-secondary-background'));
      const texts=[...node.querySelectorAll('h2,h4,h5,p,.v2-chip-label')].filter(el=>!el.closest('.v2-secondary-background'));
      const photo=node.querySelector('.v2-store-photo-image img'),sheet=node.querySelector('.v2-sheet-panel');
      const kakao=node.querySelector('.v2-store-share-choice img'),sms=node.querySelector('[data-share-icon="sms"]');
      return {size:[node.clientWidth,node.clientHeight],fits:node.scrollWidth<=node.clientWidth&&texts.every(el=>el.scrollWidth<=el.clientWidth),static:controls.every(button=>button.inert),
       targets:controls.map(button=>{const box=button.getBoundingClientRect();return [box.width,box.height];}),text:node.innerText,
       font:getComputedStyle(node).fontFamily,nums:getComputedStyle(node).fontVariantNumeric,
       photo:photo?{fit:getComputedStyle(photo).objectFit,complete:photo.complete&&photo.naturalWidth>0,backFace:getComputedStyle(node.querySelector('button'),'::before').content}:null,
       sheet:sheet?{bottom:node.getBoundingClientRect().bottom-sheet.getBoundingClientRect().bottom,shadow:getComputedStyle(sheet).boxShadow}:null,
       share:kakao?{src:kakao.getAttribute('src'),loaded:kakao.complete&&kakao.naturalWidth===34&&kakao.naturalHeight===35,sms:sms?{size:[sms.clientWidth,sms.clientHeight],color:getComputedStyle(sms).color}:null}:null,
       selected:node.querySelectorAll('.v2-praise-options [aria-pressed="true"]').length,
       checks:[...node.querySelectorAll('.v2-praise-options [aria-pressed="true"] .v2-chip-check')].map(check=>getComputedStyle(check).visibility),
       emptyIcon:node.querySelector('.v2-praise-empty>svg')?[node.querySelector('.v2-praise-empty>svg').clientWidth,node.querySelector('.v2-praise-empty>svg').clientHeight]:null,noFonts:!node.querySelector('.material-icons')};
     });
     assert.deepEqual(result.size,[Math.min(width,390),846],id+' '+state+' '+width);assert.ok(result.fits&&result.static&&result.noFonts,JSON.stringify(result));
     assert.match(result.font,/OG V2 Pretendard/);assert.equal(result.nums,'tabular-nums');assert.ok(result.targets.every(([w,h])=>w>=48&&h>=48),id+' '+state+' '+JSON.stringify(result.targets));
     if(id==='store-share'){assert.equal(result.sheet.bottom,0);assert.notEqual(result.sheet.shadow,'none');assert.match(result.text,/카카오톡 공유/);assert.match(result.text,/링크 공유/);assert.deepEqual(result.share,{src:'/v2/home/media/kakao-share.png',loaded:true,sms:{size:[32,32],color:'rgb(76, 175, 80)'}});}
     if(id==='store-photo'){assert.deepEqual(result.photo,{fit:'contain',complete:true,backFace:'none'});assert.doesNotMatch(result.text,/리뷰|사진번호/);}
     if(id==='praise-write'){assert.ok(result.checks.every(visibility=>visibility==='visible'));if(state==='empty')assert.deepEqual(result.emptyIcon,[32,32]);if(state==='selected')assert.match(result.text,/2개 등록하기/);if(state==='limit'){assert.equal(result.selected,5);assert.match(result.text,/최대 5개까지 선택이 가능합니다/);assert.match(await frame.ariaSnapshot(),/region "칭찬 선택 제한 안내"/);assert.match(await frame.ariaSnapshot(),/heading "알림"/);}}
     await frame.screenshot({path:'/private/tmp/og-v2-'+id+'-'+state+'-'+width+'.png'});
    }
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),id+' document '+width);
   }
  }
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});
test('store photo failure keeps its viewer and never manufactures a replacement record',async()=>{
 const browser=await launch();try{
  const page=await browser.newPage({viewport:{width:320,height:1100}});await page.route('https://og-familystore-image.s3.ap-northeast-2.amazonaws.com/**',route=>route.abort());
  await page.goto(base+'/v2/home/#store-photo');await ready(page,'store-photo');
  const frame=page.locator('#store-photo [data-store-photo-state="first"]');assert.match(await frame.innerText(),/오시 망원본점/);
  assert.equal(await frame.locator('.v2-thumbnail').getAttribute('data-state'),'error');assert.ok(await frame.locator('.v2-thumbnail').evaluate(node=>node.clientHeight>500));
  assert.equal(await frame.locator('button').count(),1);
 }finally{await browser.close();}
});
