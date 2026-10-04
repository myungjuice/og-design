const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage(),errors=[],writes=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.url()+':'+r.status());});
  page.on('request',r=>{if(!['GET','HEAD'].includes(r.method()))writes.push(r.method()+' '+r.url());});
  await page.goto(base+'/v2/components/#phone-input');
  assert.equal(await page.locator('#phone-input').count(),1,'phone specimen is connected to the real gallery');
  const material=n=>{const s=getComputedStyle(n),r=n.getBoundingClientRect();return {fill:s.backgroundImage,depth:s.boxShadow,radius:s.borderRadius,height:r.height};};
  for(const width of [320,375,390,414,768,1024,1440]){
   await page.setViewportSize({width,height:1000});await page.goto(base+'/v2/components/#phone-input');await page.reload();
   await page.locator('#phone-input').waitFor();await page.evaluate(()=>document.fonts.ready);
   const home=await page.locator('.home-search-form').evaluate(material);
   for(const kind of ['phone','numeric']){
    const section=page.locator('#'+kind+'-input'),field=page.locator('#'+kind+'-input-live input'),help=page.locator('#'+kind+'-input-live .og-field-help');
    assert.deepEqual(await field.evaluate(material),home,'shared Home input finish '+kind);
    assert.equal(await field.getAttribute('type'),kind==='phone'?'tel':'text');
    assert.equal(await field.getAttribute('inputmode'),kind==='phone'?'tel':'numeric');
    await field.fill('');assert.equal(await field.getAttribute('aria-invalid'),'false','not invalid on first focus');
    await section.locator('h2').click();assert.equal(await field.getAttribute('aria-invalid'),'true');assert.match(await help.innerText(),/비어.*입력/);
    const partial=kind==='phone'?'010':'1e3';await field.fill(partial);assert.equal(await field.inputValue(),partial);assert.equal(await field.getAttribute('aria-invalid'),'true');
    const valid=kind==='phone'?'010 0000-0000':'00090071992547409931234567890';
    await field.fill(valid);assert.equal(await field.inputValue(),valid);assert.equal(await field.getAttribute('aria-invalid'),'false');
    const invalid=kind==='phone'?'010-abcd-0000':'1,000';await field.fill(invalid);await section.locator('h2').click();
    assert.equal(await field.inputValue(),invalid);assert.equal(await field.getAttribute('aria-invalid'),'true','bad values preserved for correction');
    await field.evaluate(n=>n.dispatchEvent(new CompositionEvent('compositionstart',{bubbles:true})));
    await field.fill(valid);assert.equal(await field.getAttribute('aria-invalid'),'true','defer error updates while composing');
    await field.evaluate(n=>n.dispatchEvent(new CompositionEvent('compositionend',{bubbles:true})));
    assert.equal(await field.getAttribute('aria-invalid'),'false');assert.equal(await field.inputValue(),valid);
    assert.equal(await help.getAttribute('aria-live'),'polite');
    const details=section.locator('details');await details.locator('summary').click();
    assert.equal(await page.locator('#'+kind+'-input-state-disabled input').isDisabled(),true);
    const readonly=page.locator('#'+kind+'-input-state-readonly input');assert.equal(await readonly.getAttribute('readonly'),'');
    assert.equal(await readonly.isDisabled(),false);
    const checking=page.locator('#'+kind+'-input-state-loading input');assert.equal(await checking.isEditable(),true);assert.equal(await checking.getAttribute('aria-busy'),'true');
    await checking.fill(valid);assert.equal(await checking.getAttribute('aria-busy'),null);
    await field.focus();assert.equal(await field.evaluate(n=>getComputedStyle(n).outlineWidth),'3px');
    assert.ok(await section.locator('input:visible').evaluateAll(ns=>ns.every(n=>{const r=n.getBoundingClientRect();return r.height>=48&&r.left>=0&&r.right<=innerWidth&&getComputedStyle(n).borderWidth==='1px';})));
    await details.locator('summary').click();
   }
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no overflow '+width);
   if([390,1440].includes(width)){await page.locator('#phone-input').scrollIntoViewIfNeeded();await page.screenshot({path:'/private/tmp/og-v2-typed-input-'+width+'.png'});}
  }
  await page.emulateMedia({reducedMotion:'reduce',forcedColors:'active'});await page.locator('#phone-input-live input').focus();
  assert.equal(await page.locator('#phone-input-live input').evaluate(n=>getComputedStyle(n).outlineWidth),'3px');
  assert.equal(await page.locator('#phone-input-live input').evaluate(n=>getComputedStyle(n).animationName),'none');
  const touch=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true}),mobile=await touch.newPage();
  await mobile.goto(base+'/v2/components/#numeric-input');await mobile.locator('#numeric-input-live label').tap();
  assert.equal(await mobile.locator('#numeric-input-live input').evaluate(n=>n===document.activeElement),true);
  await mobile.locator('#numeric-input-live input').fill('000123');assert.equal(await mobile.locator('#numeric-input-live input').inputValue(),'000123');await touch.close();
  assert.deepEqual(errors,[]);assert.deepEqual(writes,[]);
  console.log('Typed input: shared Home material, value preservation, blur/format/IME validation, native keyboard hints, states, 7 widths, keyboard/touch and no service writes passed');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
