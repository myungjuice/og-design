const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  const url=base+'/v2/components/#empty-feedback';
  for(const width of [320,375,390,414,768,1024,1440]){
   await page.setViewportSize({width,height:1000});await page.goto(url);await page.reload();await page.locator('#empty-feedback').waitFor();await page.evaluate(()=>document.fonts.ready);
   assert.deepEqual(await page.locator('.v2-component-section:visible').evaluateAll(ns=>ns.map(n=>n.id)),['dialogs','notices','empty-feedback','snackbar']);
   const panels=page.locator('#empty-feedback .v2-feedback');
   assert.equal(await panels.count(),3);assert.equal(await panels.locator('.material-icons').count(),0);
   assert.equal(await page.locator('.v2-feedback-grid button').count(),0,'empty does not invent a next action');
   assert.ok(await panels.evaluateAll(ns=>ns.every(n=>{
    const s=getComputedStyle(n),seat=getComputedStyle(n.querySelector('.og-feedback-icon'));
    return n.scrollWidth<=n.clientWidth+1&&s.boxShadow==='none'&&s.borderRadius==='20px'&&seat.boxShadow!=='none'&&getComputedStyle(n.querySelector('h3')).fontWeight==='700'&&getComputedStyle(n.querySelector('p')).fontWeight==='400';
   })),'quiet text and only shallow icon seats '+width);
   assert.ok(await panels.evaluateAll(ns=>{
    const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');canvas.width=canvas.height=1;
    const l=color=>{ctx.fillStyle=color;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data].slice(0,3).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);};
    const ratio=(a,b)=>(Math.max(l(a),l(b))+.05)/(Math.min(l(a),l(b))+.05);
    return ns.every(n=>['h3','p'].every(k=>ratio(getComputedStyle(n.querySelector(k)).color,getComputedStyle(n).backgroundColor)>=4.5)&&ratio(getComputedStyle(n.querySelector('svg')).color,getComputedStyle(n.querySelector('.og-feedback-icon')).backgroundColor)>=3);
   }),'readable copy and icons '+width);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no overflow '+width);
   if([390,1440].includes(width))await page.locator('#empty-feedback').screenshot({path:`/private/tmp/og-v2-empty-feedback-${width}.png`});
   await page.evaluate(async()=>{const {renderFeedback}=await import('/v2/components/feedback.mjs');document.querySelector('.v2-feedback-grid').insertAdjacentHTML('beforeend',renderFeedback({title:'방문한회원점이아직표시되지않았습니다'.repeat(8),body:'다른매장명이나업종으로검색해보시기바랍니다'.repeat(12),id:'long-feedback'}));});
   assert.ok(await page.locator('#long-feedback').evaluate(n=>n.scrollWidth<=n.clientWidth+1),'long Korean stays within surface '+width);
  }
  await page.goto(url);await page.reload();await page.clock.install();
  const demo=page.locator('[data-feedback-demo]'),retry=demo.locator('[data-feedback-retry]'),result=demo.locator('[data-feedback-result]'),reset=demo.locator('[data-feedback-reset]'),status=demo.locator('[data-feedback-status]');
  for(const outcome of ['error','empty','success']){
   await reset.click();await result.selectOption(outcome);
   const height=await demo.locator('[data-feedback-area]').evaluate(n=>n.getBoundingClientRect().height);
   await retry.focus();await page.keyboard.press('Enter');
   assert.equal(await retry.isDisabled(),true);assert.equal(await retry.getAttribute('aria-busy'),'true');
   assert.equal(await demo.locator('.v2-feedback').getAttribute('aria-busy'),'true');
   assert.equal(await retry.textContent(),'처리 중…');
   assert.equal(await demo.locator('[data-feedback-area]').evaluate(n=>n.getBoundingClientRect().height),height,'loading does not shift the panel');
   await retry.evaluate(n=>n.click());await page.clock.runFor(500);
   if(outcome==='error'){
    assert.equal(await retry.isEnabled(),true);assert.equal(await retry.textContent(),'다시 시도');assert.equal(await retry.evaluate(n=>document.activeElement===n),true,'error keeps retry focus');
   }else{
    assert.equal(await retry.count(),0);assert.equal(await demo.locator('[data-feedback-area] h3').evaluate(n=>document.activeElement===n),true,'removed retry hands focus to the result heading');
    assert.match(await demo.locator('[data-feedback-area]').innerText(),outcome==='empty'?/아직 방문 내역이 없어요/:/스시샤워 반주헌/);
   }
   assert.equal(await demo.locator('[data-feedback-area]').evaluate(n=>n.getBoundingClientRect().height),height,'same result region retains height');
   assert.ok((await status.textContent()).length>0);
  }
  await reset.click();await result.selectOption('success');await retry.click();await reset.click();await page.clock.runFor(1000);
  assert.equal(await retry.isEnabled(),true);assert.match(await demo.locator('[data-feedback-area]').innerText(),/불러오지 못했어요/,'reset cancels stale result');
  await retry.click();await result.focus();await page.clock.runFor(500);
  assert.equal(await result.evaluate(n=>document.activeElement===n),true,'result update does not steal focus from another control');
  await reset.click();await reset.focus();await page.keyboard.press('Tab');
  assert.ok(await retry.evaluate(n=>{const s=getComputedStyle(n);return s.outlineStyle==='solid'&&s.outlineWidth==='3px'&&s.outlineColor===getComputedStyle(n.closest('.v2-feedback')).color;}),'focus ring contrasts with the white app surface');
  await page.emulateMedia({forcedColors:'active',reducedMotion:'reduce'});
  assert.ok(await page.locator('.v2-feedback .og-feedback-icon').evaluateAll(ns=>ns.every(n=>getComputedStyle(n).boxShadow==='none'&&getComputedStyle(n).borderTopWidth==='1px')));
  await page.emulateMedia({forcedColors:'none'});await page.route('**/*.woff2',route=>route.abort());await page.reload();await page.locator('#empty-feedback').waitFor();
  assert.equal(await page.locator('#empty-feedback svg').count(),3);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  const touch=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const phone=await touch.newPage();await phone.goto(url);
  const phoneRetry=phone.locator('[data-feedback-retry]');
  assert.ok(await phoneRetry.evaluate(n=>{const r=n.getBoundingClientRect();return r.width>=44&&r.height>=44;}));
  await phone.locator('[data-feedback-result]').selectOption('empty');await phoneRetry.tap();
  await phone.locator('[data-feedback-area] .v2-feedback[data-state="history"]').waitFor();
  await touch.close();
  assert.deepEqual(errors,[]);
  console.log('Empty/error feedback: seven widths, long Korean, contrast, retry busy/deduplication, three outcomes, focus, reset race, forced colors and font fallback passed');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
