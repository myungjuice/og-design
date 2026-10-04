const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  const url=base+'/v2/components/#loading';
  await page.goto(url);await page.locator('#loading').waitFor();
  const select=page.locator('[data-loading-state]');
  await select.selectOption('ready');
  assert.ok(await page.locator('#loading .v2-loading-frame').evaluateAll(ns=>ns.every(n=>n.getAttribute('aria-busy')==='false')),'state picker reveals content');
  for(const width of [320,375,390,414,768,1024,1440]){
   await page.setViewportSize({width,height:1000});await page.goto(url);await page.reload();await page.locator('#loading').waitFor();await page.evaluate(()=>document.fonts.ready);
   assert.deepEqual(await page.locator('.v2-component-section:visible').evaluateAll(ns=>ns.map(n=>n.id)),['loading'],'loading examples remain grouped without a long feedback page');
   const frames=page.locator('#loading .v2-loading-frame');assert.equal(await frames.count(),3);
   assert.equal(await page.locator('#loading').getByRole('meter').count(),0,'unknown mileage is not announced as the hidden example value');
   assert.equal(await page.locator('#loading').getByRole('button').count(),0,'masked sample controls are not focusable');
   assert.ok(await frames.evaluateAll(ns=>ns.every(n=>n.getAttribute('aria-busy')==='true'&&n.querySelector(':scope>[data-content]').inert&&n.querySelector(':scope>[data-content]').getAttribute('aria-hidden')==='true'&&!n.querySelector(':scope>[data-skeleton]').hidden)));
   const before=await page.locator('[data-loading-example]').evaluateAll(ns=>ns.map(n=>{const r=n.getBoundingClientRect();return {kind:n.dataset.loadingExample,x:r.x,y:r.y,width:r.width,height:r.height};}));
   assert.ok(await page.locator('#loading .og-skeleton').evaluateAll(ns=>ns.every(n=>getComputedStyle(n).boxShadow==='none'&&getComputedStyle(n).borderTopWidth==='0px')),'flat placeholder material');
   if([390,1440].includes(width))await page.locator('#loading').screenshot({path:`/private/tmp/og-v2-loading-${width}.png`});
   await select.focus();await select.selectOption('ready');
   const after=await page.locator('[data-loading-example]').evaluateAll(ns=>ns.map(n=>{const r=n.getBoundingClientRect();return {kind:n.dataset.loadingExample,x:r.x,y:r.y,width:r.width,height:r.height};}));
   assert.deepEqual(after,before,'content reveal preserves card positions and sizes '+width);
   assert.ok(await frames.evaluateAll(ns=>ns.every(n=>n.getAttribute('aria-busy')==='false'&&!n.querySelector(':scope>[data-content]').inert&&n.querySelector(':scope>[data-content]').getAttribute('aria-hidden')==='false'&&n.querySelector(':scope>[data-skeleton]').hidden)));
   assert.equal(await page.locator('#loading').getByRole('meter').count(),1,'loaded mileage can be read after reveal');
   assert.ok(await page.locator('[data-loading-example="mileage"] [data-content] button').evaluateAll(ns=>ns.length===2&&ns.every(n=>n.disabled)),'only unconnected sample actions stay disabled');
   assert.match(await page.locator('[data-loading-example="mileage"] [data-content]').innerText(),/15,000 M/);
   assert.match(await page.locator('[data-loading-status]').textContent(),/내용/);
   assert.equal(await select.evaluate(n=>document.activeElement===n),true,'changing preview does not steal focus');
   // Compare the actual shared mileage against its wrapped version, not a second style implementation.
   await page.evaluate(async()=>{const {renderMileage}=await import('/v2/components/mileage.mjs');document.querySelector('#loading').insertAdjacentHTML('beforeend','<div id="mileage-parity-probe">'+renderMileage()+'</div>');});
   const parity=await page.evaluate(()=>{
    const a=document.querySelector('[data-loading-example="mileage"] .v2-mileage'),b=document.querySelector('#mileage-parity-probe .v2-mileage');
    return [a,b].map(root=>{const s=getComputedStyle(root);return {width:root.getBoundingClientRect().width,height:root.getBoundingClientRect().height,padding:s.padding,radius:s.borderRadius,shadow:s.boxShadow,background:s.backgroundColor,parts:['.m-coin','.mileage-top','.mileage-title strong','.mileage-graph','.graph-labels','.mileage-breakdown'].map(selector=>{const n=root.querySelector('[data-content] '+selector)||root.querySelector(selector),r=n.getBoundingClientRect(),c=getComputedStyle(n);return [r.width,r.height,c.fontSize,c.lineHeight,c.backgroundColor];})};});
   });
   assert.deepEqual(parity[0],parity[1],'current shared mileage material and geometry '+width);
   await page.locator('#mileage-parity-probe').evaluate(n=>n.remove());
   await select.selectOption('loading');
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no overflow '+width);
  }
  await page.goto(url);await page.reload();
  // macOS headless Chrome does not open the native option popup via keyboard.
  // Verify keyboard reachability/focus; selectOption above verifies the change handler.
  await select.focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');
  assert.equal(await select.evaluate(n=>document.activeElement===n),true,'keyboard focus returns to the native state picker');
  assert.equal(await select.evaluate(n=>getComputedStyle(n).outlineWidth),'3px','visible keyboard focus');
  await page.emulateMedia({reducedMotion:'reduce'});await select.selectOption('loading');
  assert.ok(await page.locator('#loading .og-spinner,#loading .og-skeleton').evaluateAll(ns=>ns.every(n=>getComputedStyle(n).animationName==='none')),'reduced motion freezes functional placeholders');
  await page.emulateMedia({forcedColors:'active'});
  assert.ok(await page.locator('#loading .og-skeleton').evaluateAll(ns=>ns.every(n=>getComputedStyle(n).backgroundColor!=='rgba(0, 0, 0, 0)')),'forced colors keep placeholder blocks visible');
  assert.ok(await page.locator('.v2-loading-mileage>[data-skeleton] .mileage-title strong,.v2-loading-mileage>[data-skeleton] .mileage-rows dd,.v2-loading-mileage>[data-skeleton] .graph-labels>span').evaluateAll(ns=>ns.length>0&&ns.every(n=>getComputedStyle(n).color==='rgba(0, 0, 0, 0)')),'forced colors do not reveal unknown copied values');
  await page.emulateMedia({forcedColors:'none',reducedMotion:'no-preference'});
  await page.route('**/*.woff2',route=>route.abort());await page.reload();await select.selectOption('ready');
  assert.equal(await page.locator('#loading .material-icons').count(),0,'no icon font dependency');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'font fallback fits');
  const touch=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const phone=await touch.newPage();await phone.goto(url);await phone.locator('[data-loading-state]').selectOption('ready');
  assert.equal(await phone.locator('#loading .v2-loading-frame[aria-busy="false"]').count(),3);await touch.close();
  assert.deepEqual(errors,[]);
  console.log('Loading: seven widths, geometry/shared mileage parity, inert hidden controls, state/keyboard focus/touch, reduced motion, forced colors and font fallback passed');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
