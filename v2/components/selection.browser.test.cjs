const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.url()+':'+r.status());});
  for(const width of [320,375,390,414,768,1024,1440]){
   await page.setViewportSize({width,height:1000});await page.goto(`${base}/v2/components/#checkbox`);await page.reload();
   assert.equal(await page.locator('#checkbox').count(),1,'v2 offers the checkbox gallery');
   await page.locator('#checkbox').waitFor();await page.evaluate(()=>document.fonts.ready);
   assert.deepEqual(await page.locator('.v2-component-section:visible').evaluateAll(ns=>ns.map(n=>n.id)),['checkbox','radio','switch']);
   const all=page.locator('#checkbox-live [data-selection-all]'),children=page.locator('#checkbox-live [data-selection-child]');
   await children.first().check();assert.equal(await all.evaluate(n=>n.indeterminate),true);assert.equal(await all.isChecked(),false);
   assert.match(await page.locator('#checkbox-feedback').innerText(),/1.*3/);
   await all.check();assert.equal(await children.filter({visible:true}).evaluateAll(ns=>ns.filter(n=>n.checked).length),3);assert.equal(await all.evaluate(n=>n.indeterminate),false);
   assert.equal(await page.locator('#checkbox-live input:disabled').isChecked(),false);
   await all.uncheck();assert.equal(await children.evaluateAll(ns=>ns.some(n=>n.checked)),false);
   const second=page.locator('#radio-live input').nth(1);await second.focus();await page.keyboard.press('Space');
   assert.equal(await second.isChecked(),true);assert.equal(await page.locator('#radio-live input:checked').count(),1);
   await page.keyboard.press('ArrowLeft');assert.equal(await page.locator('#radio-live input').first().isChecked(),true);
   const toggle=page.locator('#switch-live input[role="switch"]').first();await toggle.focus();await page.keyboard.press('Space');
   assert.equal(await toggle.isChecked(),true);assert.match(await page.locator('#switch-feedback').innerText(),/켜짐/);
   assert.equal(await toggle.locator('..').evaluate(n=>getComputedStyle(n).outlineWidth),'3px');
   await page.keyboard.press('Space');assert.equal(await toggle.isChecked(),false);
   for(const kind of ['checkbox','radio','switch']){
    assert.equal(await page.locator(`#${kind} .v2-state-comparison`).evaluate(n=>n.open),false);
    await page.locator(`#${kind} .v2-state-comparison > summary`).click();
    for(const state of ['disabled','loading'])assert.equal(await page.locator(`#${kind}-state-${state} input`).first().isDisabled(),true);
    assert.equal(await page.locator(`#${kind}-state-loading input`).getAttribute('aria-busy'),'true');
    assert.match(await page.locator(`#${kind}-state-error .v2-selection-result`).innerText(),/저장하지 못/);
    assert.match(await page.locator(`#${kind}-state-success .v2-selection-result`).innerText(),/저장했습니다/);
    assert.equal(await page.locator(`#${kind}-state-disabled-on input`).isChecked(),true);
    assert.ok(await page.locator(`#${kind} .og-choice-copy, #${kind} .og-choice-copy small, #${kind} .v2-selection-result`).evaluateAll(ns=>{
     const c=document.createElement('canvas');c.width=c.height=1;const ctx=c.getContext('2d');
     const luminance=color=>{ctx.clearRect(0,0,1,1);ctx.fillStyle=color;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data].slice(0,3).map(x=>x/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((sum,x,i)=>sum+x*[.2126,.7152,.0722][i],0);};
     return ns.every(n=>{let surface=n;while(surface.parentElement&&getComputedStyle(surface).backgroundColor==='rgba(0, 0, 0, 0)')surface=surface.parentElement;const a=luminance(getComputedStyle(n).color),b=luminance(getComputedStyle(surface).backgroundColor);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05)>=4.5;});
    }),'labels, descriptions and all outcome states meet 4.5:1 '+kind+' '+width);
    await page.locator(`#${kind} .v2-state-comparison > summary`).click();
   }
   assert.ok(await page.locator('.v2-selection:visible').evaluateAll(ns=>ns.every(n=>{const r=n.getBoundingClientRect();return r.height>=48&&r.width>=44&&r.left>=0&&r.right<=innerWidth&&n.scrollWidth<=n.clientWidth+1;})),'touch rows fit '+width);
   const copy=page.locator('#checkbox-live .og-choice-copy').nth(1),original=await copy.innerText();
   await copy.evaluate(n=>n.textContent='오지고랜드의새로운서비스와마일리지적립정보를받아보는아주긴항목'.repeat(3));
   assert.ok(await copy.evaluate(n=>n.scrollWidth<=n.clientWidth+1),'long Korean wraps');await copy.evaluate((n,t)=>n.textContent=t,original);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no overflow '+width);
   assert.ok(await page.locator('.v2-selection-copy,.og-choice-copy').evaluateAll(ns=>ns.every(n=>getComputedStyle(n).textShadow==='none')),'labels remain flat');
   if([390,1440].includes(width)){
    await page.locator('#checkbox-title').click();await page.locator('main').screenshot({path:`/private/tmp/og-v2-selection-${width}.png`});
   }
  }
  const touch=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const phone=await touch.newPage();
  await phone.goto(`${base}/v2/components/#switch`);await phone.locator('#switch-live .og-choice-copy').first().tap();
  assert.equal(await phone.locator('#switch-live input').first().isChecked(),true);await touch.close();
  await page.emulateMedia({reducedMotion:'reduce'});assert.ok(await page.locator('.v2-selection-mark').evaluateAll(ns=>ns.every(n=>getComputedStyle(n).animationName==='none'&&getComputedStyle(n).transitionDuration==='0s')));
  await page.emulateMedia({forcedColors:'active'});assert.ok(await page.locator('.v2-selection input').evaluateAll(ns=>ns.every(n=>getComputedStyle(n).opacity==='1')),'forced colors restore native controls');
  assert.deepEqual(errors,[]);console.log('Selection: related group, native controls, partial/all, disabled preservation, 6 operation states, 7 widths, keyboard/touch, reduced motion and forced colors passed');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
