const test=require('node:test');
const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
const boards={
 'store-reviews':['registered','expanded','empty-eligible','empty-ineligible'],
 'review-list':['registered','expanded'],
 'review-photo':['registered','expanded','contain','last'],
 'store-info':['registered','minimal'],
 'store-location':['registered']
};
const launch=()=>chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
async function ready(page,id,count=1){
 await page.waitForFunction(({id,count})=>{const hosts=[...document.querySelectorAll('#'+id+' .v2-home-'+id+'-host')].filter(host=>host.shadowRoot);return hosts.length===count&&hosts.every(host=>[...host.shadowRoot.querySelectorAll('link')].every(link=>link.sheet)&&[...host.shadowRoot.querySelectorAll('img')].every(img=>img.complete));},{id,count});
 await page.evaluate(()=>document.fonts.ready);
}
test('all five remaining boards mount lazily, keep sibling groups and support history/reload',async()=>{
 const browser=await launch();try{
  const page=await browser.newPage({viewport:{width:1440,height:1100}}),errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base+'/v2/home/');await page.locator('#overview .home-test').waitFor();
  for(const id of Object.keys(boards))assert.equal(await page.locator('#'+id+' [data-'+id+'-state]').count(),0,id+' must start deferred');
  for(const [id,states] of Object.entries(boards)){
   await page.locator('[data-view-link="'+id+'"]').click();await ready(page,id);
   assert.equal(new URL(page.url()).hash,'#'+id);
   if(states.length>1){await page.locator('#'+id+' summary').click();await ready(page,id,states.length);await page.locator('#'+id+' summary').click();await page.locator('#'+id+' summary').click();await ready(page,id,states.length);}
   await page.reload();await ready(page,id);assert.equal(await page.locator('#'+id+' [data-'+id+'-state]').count(),1);
  }
  await page.locator('[data-group-link="store-reviews"]').click();for(const id of ['store-reviews','review-list','review-photo'])assert.ok(await page.locator('#'+id).isVisible());
  await page.locator('[data-group-link="store-information"]').click();for(const id of ['store-info','store-location'])assert.ok(await page.locator('#'+id).isVisible());
  await page.goBack();assert.ok(await page.locator('#review-photo').isVisible());await page.goForward();assert.ok(await page.locator('#store-location').isVisible());
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});
for(const [id,states] of Object.entries(boards))test(id+' preserves readable static content at eight widths',async()=>{
 const browser=await launch();try{
  const page=await browser.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
  page.on('request',request=>{if(!request.url().startsWith(base+'/')&&!request.url().startsWith('https://og-familystore-image.s3.ap-northeast-2.amazonaws.com/'))errors.push(request.url());});
  await page.goto(base+'/v2/home/#'+id);await ready(page,id);
  if(states.length>1){await page.locator('#'+id+' summary').click();await ready(page,id,states.length);}
  for(const width of [320,375,390,414,768,1024,1440,1920]){
   await page.setViewportSize({width,height:1100});
   for(const state of states){
    const frame=page.locator('#'+id+' [data-'+id+'-state="'+state+'"]').first();
    const result=await frame.evaluate((node,id)=>{
     const region=node.querySelector('[role="region"]'),photos=[...node.querySelectorAll('.og-store-review-images .v2-thumbnail,.og-review-photo-image>.v2-thumbnail')];
     const canvas=document.createElement('canvas');canvas.width=canvas.height=1;const context=canvas.getContext('2d');
     const lum=color=>{context.clearRect(0,0,1,1);context.fillStyle=color;context.fillRect(0,0,1,1);return [...context.getImageData(0,0,1,1).data].slice(0,3).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);};
     const ratio=(a,b)=>{const x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
     const surface=getComputedStyle(id==='review-photo'?node.querySelector('.og-review-photo-page'):node).backgroundColor;
     const text=[...node.querySelectorAll('h4,h5,p,time,.og-store-review-author strong,.og-navigation-provider span')];
     const controls=[...node.querySelectorAll('button')];
     return {size:[node.clientWidth,node.clientHeight],rootFits:node.scrollWidth<=node.clientWidth,
      static:controls.every(button=>button.inert),region:!!region&&(id==='store-location'||!region.closest('[inert]')),
      font:getComputedStyle(node).fontFamily,nums:getComputedStyle(node).fontVariantNumeric,
      fits:text.filter(el=>!el.classList.contains('og-store-review-text')).every(el=>el.scrollWidth<=el.clientWidth),
      targets:controls.filter(el=>!el.closest('.v2-location-background')).map(el=>[el.getBoundingClientRect().width,el.getBoundingClientRect().height]),
      contrast:id==='store-location'?null:Math.min(...text.map(el=>ratio(getComputedStyle(el).color,surface))),
      text:node.innerText,praise:node.querySelectorAll('.og-praise-row').length,cardCount:node.querySelectorAll('.og-store-review-card').length,
      photos:photos.map(el=>{const img=el.querySelector('img'),box=el.getBoundingClientRect();return {state:el.dataset.state,width:box.width,height:box.height,fit:getComputedStyle(img).objectFit};}),
      copy:node.querySelector('.og-review-photo-copy')?{height:node.querySelector('.og-review-photo-copy').clientHeight,mask:getComputedStyle(node.querySelector('.og-review-photo-copy')).maskImage,align:node.querySelector('.og-review-photo-copy p').getBoundingClientRect().x+parseFloat(getComputedStyle(node.querySelector('.og-review-photo-copy p')).paddingInlineStart)-node.querySelector('.og-review-photo-author strong').getBoundingClientRect().x}:null,
      sheet:node.querySelector('.og-navigation-sheet')?{bottom:node.getBoundingClientRect().bottom-node.querySelector('.og-navigation-sheet').getBoundingClientRect().bottom,shadow:getComputedStyle(node.querySelector('.og-navigation-sheet')).boxShadow,providers:[...node.querySelectorAll('.og-navigation-provider img')].map(img=>img.complete&&img.naturalWidth>0),address:node.querySelector('.og-navigation-address p').textContent}:null,
      noMaterial:!node.querySelector('.material-icons')};
    },id);
    assert.deepEqual(result.size,[Math.min(width,390),846],id+' '+width+' '+state);assert.ok(result.rootFits&&result.static&&result.region&&result.fits&&result.noMaterial,JSON.stringify(result));
    assert.match(result.font,/OG V2 Pretendard/);assert.equal(result.nums,'tabular-nums');assert.ok(result.targets.every(([w,h])=>w>=48&&h>=48),JSON.stringify(result.targets));
    if(result.contrast!==null)assert.ok(result.contrast>=4.5,id+' contrast '+result.contrast);
    for(const photo of result.photos){assert.equal(photo.state,'ready');if(id!=='review-photo')assert.deepEqual([photo.width,photo.height],[120,120]);else assert.equal(photo.fit,state==='contain'?'contain':'cover');}
    if(id==='store-reviews'){assert.equal(result.praise,state==='registered'?5:state==='expanded'?7:0);assert.equal(result.cardCount,state.startsWith('empty')?0:2);}
    if(id==='review-list'){assert.equal(result.cardCount,3);assert.match(result.text,/방문자 3/);}
    if(id==='review-photo'){assert.ok(Math.abs(result.copy.align)<=1);if(state!=='expanded'){assert.equal(result.copy.height,150);assert.notEqual(result.copy.mask,'none');}else assert.equal(result.copy.mask,'none');}
    if(id==='store-info'){assert.match(result.text,/서울 마포구 월드컵로17길 48 지하1층/);assert.equal(result.text.includes('매일 오후 12:00'),state==='registered');}
    if(id==='store-location'){assert.equal(result.sheet.bottom,32);assert.notEqual(result.sheet.shadow,'none');assert.deepEqual(result.sheet.providers,[true,true,true]);assert.equal(result.sheet.address,'서울 마포구 망원동 57-119 지하1층');}
    if([320,375,390,414,768].includes(width))await frame.screenshot({path:`/private/tmp/og-v2-${id}-${state}-${width}.png`});
   }
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),id+' root '+width);
  }
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});
test('failed review photos keep author/prose and slots, while long info remains scrollable',async()=>{
 const browser=await launch();try{
  const page=await browser.newPage({viewport:{width:320,height:1100}});await page.route('https://og-familystore-image.s3.ap-northeast-2.amazonaws.com/**',route=>route.abort());
  for(const id of ['store-reviews','review-list','review-photo']){
   await page.goto(base+'/v2/home/#'+id);await ready(page,id);const frame=page.locator('#'+id+' [data-'+id+'-state="registered"]');
   assert.match(await frame.innerText(),/방문자 1/);assert.match(await frame.innerText(),/하남에 오면 자주 오는곳입니다/);
   const media=frame.locator('.og-store-review-images .v2-thumbnail,.og-review-photo-image>.v2-thumbnail');
   for(let i=0;i<await media.count();i++){assert.equal(await media.nth(i).getAttribute('data-state'),'error');assert.ok(await media.nth(i).evaluate(el=>el.clientHeight>100));}
  }
  await page.goto(base+'/v2/home/#store-info');await ready(page,'store-info');const frame=page.locator('#store-info [data-store-info-state="registered"]');
  await frame.locator('.og-store-contact-row span').evaluate(el=>el.textContent='긴 주소를 끝까지 확인합니다. '.repeat(100));
  const region=frame.locator('.og-store-body');await region.focus();await page.keyboard.press('End');
  await page.waitForFunction(()=>{const region=document.querySelector('#store-info .v2-home-store-info-host').shadowRoot.querySelector('.og-store-body');return region.scrollTop>0&&region.scrollTop>=region.scrollHeight-region.clientHeight-2;});
  assert.ok(await region.evaluate(el=>el.scrollWidth<=el.clientWidth));
 }finally{await browser.close();}
});
