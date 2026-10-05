const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage(),errors=[],writes=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});page.on('request',r=>{if(!['GET','HEAD'].includes(r.method()))writes.push(r.url());});
  for(const width of [320,375,390,414,768,1024,1440]){
   await page.setViewportSize({width,height:1000});await page.goto(`${base}/v2/components/#group-media`);await page.reload();
   await page.waitForFunction(()=>document.querySelector('[data-media-preview="thumbnail"]')?.dataset.mediaPreviewReady==='true');
   await page.waitForFunction(()=>[...document.querySelectorAll('[data-v2-media][data-media-watch="true"]')].every(n=>n.dataset.state==='ready'));
   await page.evaluate(()=>document.fonts.ready);
   assert.deepEqual(await page.locator('.v2-component-section:visible').evaluateAll(ns=>ns.map(n=>n.id)),['avatar','thumbnail']);
   assert.deepEqual(await page.locator('.v2-avatar-sizes .v2-avatar').evaluateAll(ns=>ns.map(n=>{const r=n.getBoundingClientRect();return [r.width,r.height];})),[[32,32],[48,48],[64,64]]);
   assert.equal(await page.locator('#avatar .v2-state-comparison').evaluate(n=>n.open),false);
   assert.equal(await page.locator('#thumbnail .v2-state-comparison').evaluate(n=>n.open),false);
   assert.ok(await page.locator('.v2-avatar,.v2-thumbnail').evaluateAll(ns=>ns.every(n=>getComputedStyle(n).cursor==='default'&&!n.hasAttribute('tabindex')&&!n.hasAttribute('aria-pressed'))));
   assert.ok(await page.locator('[data-media-image]').evaluateAll(ns=>ns.every(n=>n.getAttribute('alt')===''&&n.getAttribute('aria-hidden')==='true'&&n.hasAttribute('width')&&n.hasAttribute('height'))));
   assert.ok(await page.locator('.v2-thumbnail[data-ratio="wide"]:visible').evaluateAll(ns=>ns.every(n=>{const r=n.getBoundingClientRect();return Math.abs(r.width/r.height-16/9)<.01;})),'visible thumbnail ratios '+width);
   assert.equal(await page.locator('.v2-thumbnail[data-fit="contain"]>img').first().evaluate(n=>getComputedStyle(n).objectFit),'contain');
   assert.equal(await page.locator('.v2-thumbnail[data-fit="cover"]>img').first().evaluate(n=>getComputedStyle(n).objectFit),'cover');
   for(const kind of ['avatar','thumbnail']){
    const widget=page.locator(`[data-media-preview="${kind}"]`),picker=widget.getByRole('combobox'),media=widget.locator('[data-v2-media]');
    const before=await media.boundingBox();assert.ok((await picker.boundingBox()).height>=48);await picker.focus();assert.equal(await picker.evaluate(n=>getComputedStyle(n).outlineWidth),'3px');
    for(const state of ['loading','empty','error','ready']){
     await picker.selectOption(state);
     if(state==='ready')await media.locator('[data-media-image]').first().waitFor();
     await page.waitForFunction(({kind,state})=>document.querySelector(`[data-media-preview="${kind}"] [data-v2-media]`)?.dataset.state===state,{kind,state});
     const rect=await media.boundingBox();assert.ok(Math.abs(rect.width-before.width)<1&&Math.abs(rect.height-before.height)<1,'state changes do not shift image geometry');
     assert.equal(await media.getAttribute('aria-busy'),state==='loading'?'true':null);
     if(state!=='ready')assert.equal(await media.locator('img').count(),0,'explicit fallback states do not fetch images');
     assert.ok((await widget.locator('[data-media-message]').textContent()).length>0);assert.equal(await picker.evaluate(n=>document.activeElement===n),true);
    }
   }
   await page.locator('#avatar .v2-state-comparison>summary').click();await page.locator('#thumbnail .v2-state-comparison>summary').click();
   assert.ok(await page.locator('.v2-thumbnail[data-ratio="wide"]:visible').evaluateAll(ns=>ns.every(n=>{const r=n.getBoundingClientRect();return Math.abs(r.width/r.height-16/9)<.01;})),'expanded fallback ratios '+width);
   assert.ok(await page.locator('.v2-media-stage').evaluateAll(ns=>ns.every(n=>n.scrollWidth<=n.clientWidth+1)),'media stages fit '+width);
   assert.ok(await page.locator('.v2-media-stage').evaluateAll(ns=>{
    const canvas=document.createElement('canvas');canvas.width=canvas.height=1;const ctx=canvas.getContext('2d');
    const lum=color=>{ctx.clearRect(0,0,1,1);ctx.fillStyle=color;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data].slice(0,3).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);};
    return ns.every(n=>[...n.querySelectorAll('p,strong,select,.v2-avatar-sizes>div>span:last-child,.og-media-fallback>span')].every(child=>{const a=lum(getComputedStyle(child).color),b=lum(getComputedStyle(n).backgroundColor);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05)>=4.5;}));
   }),'media text contrast '+width);
   await page.emulateMedia({forcedColors:'active',reducedMotion:'reduce'});
   assert.ok(await page.locator('.v2-avatar,.v2-thumbnail').evaluateAll(ns=>ns.every(n=>getComputedStyle(n).borderTopStyle==='solid'&&getComputedStyle(n).boxShadow==='none'&&getComputedStyle(n).animationName==='none')));
   await page.emulateMedia({forcedColors:'none',reducedMotion:'no-preference'});
   const ids=await page.locator('[id]').evaluateAll(ns=>ns.map(n=>n.id));assert.equal(new Set(ids).size,ids.length);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no document overflow '+width);
   await page.locator('#avatar .v2-state-comparison>summary').click();await page.locator('#thumbnail .v2-state-comparison>summary').click();await page.locator('#avatar-title').click();
   if([320,375,390,414,768,1440].includes(width))await page.screenshot({path:`/private/tmp/og-v2-media-${width}.png`,fullPage:true});
  }
  // Exercise real load/error events, not hand-written state flags.
  let releaseSlow;const slow=new Promise(resolve=>releaseSlow=resolve);
  await page.route('**/slow-profile.png',async route=>{await slow;await route.fulfill({path:'/Users/mj/Documents/github/myungjuice/og-design/screens/my-info-3d-test/media/account.png',contentType:'image/png'});});
  await page.route('**/failed-image.png',route=>route.abort());
  await page.evaluate(async()=>{
   const {renderAvatar,renderThumbnail,setupMedia}=await import('/v2/components/media.mjs');
   const stage=document.createElement('div');stage.className='v2-media-stage';stage.id='media-network-probe';document.querySelector('#thumbnail').append(stage);
   stage.innerHTML=renderAvatar({id:'slow-profile',src:'/slow-profile.png',label:'느린 프로필'})+renderThumbnail({id:'failed-thumb',src:'/failed-image.png',alt:'실패 이미지',ratio:'wide'});setupMedia(stage);setupMedia(stage);
  });
  await page.waitForFunction(()=>document.querySelector('#slow-profile')?.dataset.state==='loading');const before=await page.locator('#slow-profile').boundingBox();
  await page.waitForFunction(()=>document.querySelector('#failed-thumb')?.dataset.state==='error');
  assert.match(await page.locator('#failed-thumb').getAttribute('aria-label'),/불러오지 못/);assert.equal(await page.locator('#failed-thumb .og-media-fallback').isVisible(),true);
  releaseSlow();await page.waitForFunction(()=>document.querySelector('#slow-profile')?.dataset.state==='ready');assert.equal(await page.locator('#slow-profile').getAttribute('aria-busy'),null);assert.equal(await page.locator('#slow-profile').getAttribute('aria-label'),'느린 프로필');
  const after=await page.locator('#slow-profile').boundingBox();assert.equal(before.height,after.height);assert.equal(before.width,after.width);
  // One failed designer layer must not reveal the other as a partial face.
  await page.route('**/figma/profile-overlay.png',route=>route.abort());
  await page.reload();await page.waitForFunction(()=>document.querySelector('.v2-avatar-sizes .v2-avatar')?.dataset.state==='error');
  assert.equal(await page.locator('.v2-avatar-sizes .v2-avatar-image').first().isVisible(),false);assert.equal(await page.locator('.v2-avatar-sizes .v2-avatar-fallback').first().isVisible(),true);
  await page.unroute('**/figma/profile-overlay.png');
  const touch=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true}),phone=await touch.newPage();await phone.goto(`${base}/v2/components/#thumbnail`);
  await phone.waitForFunction(()=>document.querySelector('[data-media-preview="thumbnail"]')?.dataset.mediaPreviewReady==='true');await phone.locator('[data-media-preview="thumbnail"] select').selectOption('empty');
  assert.equal(await phone.locator('[data-media-preview="thumbnail"] .og-media-fallback').isVisible(),true);await touch.close();
  await page.route('**/*.{woff,woff2}',r=>r.abort());await page.setViewportSize({width:320,height:1000});await page.goto(`${base}/v2/components/#avatar`);await page.reload();await page.evaluate(()=>document.fonts.ready);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'font fallback fits');assert.deepEqual(errors,[]);assert.deepEqual(writes,[]);
  console.log('Media: 7 widths, designer profile layers/sizes, image ratios/fit, fixed state geometry, real loading/failure fallback, decorative semantics, contrast, native preview/focus, forced colors, reduced motion, touch, font fallback and no writes passed');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
