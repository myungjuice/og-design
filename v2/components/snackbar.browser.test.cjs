const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:1000}}),errors=[],writes=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.method()!=='GET')writes.push(r.url());});
  const url=base+'/v2/components/#snackbar';await page.goto(url);
  const section=page.locator('#snackbar'),show=section.locator('[data-snackbar-show]'),close=section.locator('[data-snackbar-close]'),host=section.locator('[data-snackbar-host]'),select=section.locator('[data-snackbar-kind]');
  await show.click();assert.equal(await host.locator('.v2-snackbar').count(),1,'open creates a single snackbar');
  for(const width of [320,375,390,414,768,1024,1440]){
   await page.setViewportSize({width,height:1000});await page.goto(url);await page.reload();await section.waitFor();await page.evaluate(()=>document.fonts.ready);
   assert.equal(await host.locator('.v2-snackbar').count(),0,'no automatic toast on load');assert.equal(await close.isDisabled(),true);
   assert.equal(await section.locator('[data-snackbar-announcement]').textContent(),'');
   assert.ok(await section.locator('.v2-snackbar-stage').evaluateAll(ns=>ns.every(n=>n.inert)),'static action specimens are not interactive');
   const geometry=()=>section.locator('.v2-snackbar-preview').evaluate(n=>{const r=n.getBoundingClientRect();return {x:r.x+scrollX,y:r.y+scrollY,width:r.width,height:r.height};});
   const before=await geometry();
   await select.selectOption('undo');await show.click();
   const toast=host.locator('.v2-snackbar'),id=await toast.getAttribute('id');
   assert.equal(await show.evaluate(n=>document.activeElement===n),true,'opening does not steal focus');
   assert.match(await section.locator('[data-snackbar-announcement]').textContent(),/즐겨찾기/);
   await show.click();assert.equal(await toast.getAttribute('id'),id,'same message is not recreated or queued');assert.equal(await host.locator('.v2-snackbar').count(),1);
   assert.deepEqual(await geometry(),before,'toast does not move content '+width);
   await toast.evaluate(n=>n.getAnimations().forEach(a=>a.finish()));
   assert.ok(await host.evaluate(n=>{const t=n.firstElementChild.getBoundingClientRect(),s=n.parentElement.getBoundingClientRect();return t.left>=s.left+15&&t.right<=s.right-15&&t.bottom<=s.bottom-15&&t.top>=s.top;}),'toast is contained with 16px margins '+width);
   assert.ok(await section.locator('.og-snackbar-action:visible').evaluateAll(ns=>ns.every(n=>{const r=n.getBoundingClientRect();return r.width>=44&&r.height>=44&&getComputedStyle(n).whiteSpace==='nowrap';})),'44px actions, single-line labels');
   const action=toast.getByRole('button',{name:'실행 취소'});await action.focus();const focusedScroll=await page.evaluate(()=>scrollY);await page.keyboard.press('Enter');
   assert.equal(await show.evaluate(n=>document.activeElement===n),true,'removed action returns focus without a scroll jump');
   assert.equal(await page.evaluate(()=>scrollY),focusedScroll,'returning focus preserves scroll position');
   assert.match(await toast.textContent(),/실행 취소 동작 예시/);assert.equal(await toast.getByRole('button').count(),0);
   await select.selectOption('retry');await show.click();await toast.getByRole('button',{name:'다시 시도'}).click();assert.match(await toast.textContent(),/다시 시도 동작 예시/);
   await close.click();assert.equal(await host.locator('.v2-snackbar').count(),0);assert.equal(await show.evaluate(n=>document.activeElement===n),true,'close does not leave focus on disabled control');
   await select.selectOption('saved');await show.click();assert.equal(await toast.getByRole('button').count(),0);
   assert.ok(await section.locator('.v2-snackbar').evaluateAll(ns=>{
    const canvas=document.createElement('canvas');canvas.width=canvas.height=1;const c=canvas.getContext('2d');
    const lum=color=>{c.fillStyle=color;c.fillRect(0,0,1,1);return [...c.getImageData(0,0,1,1).data].slice(0,3).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);};
    return ns.every(n=>{const s=getComputedStyle(n),fg=lum(s.color),bg=lum(s.backgroundColor);return (Math.max(fg,bg)+.05)/(Math.min(fg,bg)+.05)>=4.5;});
   }),'readable contrast');
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no overflow '+width);
   if([390,1440].includes(width)){await toast.evaluate(n=>n.getAnimations().forEach(a=>a.finish()));await section.screenshot({path:`/private/tmp/og-v2-snackbar-${width}.png`});}
  }
  // Long Korean/unbroken messages reflow; the action moves below instead of clipping.
  await page.setViewportSize({width:320,height:1000});await page.goto(url);
  await page.evaluate(async()=>{const {renderSnackbar}=await import('/v2/components/snackbar.mjs');document.querySelector('#snackbar .v2-snackbar-stage').innerHTML=renderSnackbar({message:'저장하지 못했습니다. 입력한 내용은 그대로 남아 있습니다. 연결을 확인한 뒤 다시 시도해 주세요. '+'가'.repeat(60),action:'다시 시도'});});
  assert.ok(await section.locator('.v2-snackbar-stage .v2-snackbar').first().evaluate(n=>n.scrollWidth<=n.clientWidth),'long message does not overflow');
  const comparison=section.locator('.v2-state-comparison');await comparison.locator('summary').click();
  assert.ok(await section.locator('[data-state="loading"], [data-state="disabled"]').evaluateAll(ns=>ns.every(n=>n.querySelector('button').disabled)));
  await select.selectOption('undo');await show.click();const action=host.getByRole('button');await show.focus();await page.keyboard.press('Tab');await page.keyboard.press('Tab');
  assert.equal(await action.evaluate(n=>document.activeElement===n),true,'keyboard can reach the action');assert.equal(await action.evaluate(n=>getComputedStyle(n).outlineWidth),'3px');
  await page.emulateMedia({reducedMotion:'reduce'});
  assert.equal(await host.locator('.v2-snackbar').evaluate(n=>getComputedStyle(n).animationName),'none');
  assert.equal(await section.locator('[data-state="loading"] button').evaluate(n=>getComputedStyle(n,'::before').animationName),'none');
  await page.emulateMedia({forcedColors:'active'});assert.equal(await host.locator('.v2-snackbar').evaluate(n=>getComputedStyle(n).borderTopWidth),'1px');
  await page.emulateMedia({forcedColors:'none',reducedMotion:'no-preference'});
  await page.route('**/*.woff2',route=>route.abort());await page.reload();await show.click();assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'font fallback fits');
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true}),phone=await context.newPage();await phone.goto(url);await phone.locator('[data-snackbar-kind]').selectOption('undo');await phone.locator('[data-snackbar-show]').tap();await phone.locator('[data-snackbar-host] button').tap();assert.match(await phone.locator('[data-snackbar-host]').textContent(),/실행 취소 동작 예시/);await context.close();
  assert.deepEqual(errors,[]);assert.deepEqual(writes,[]);
  console.log('Snackbar: seven widths, single/deduplicated preview, no layout shift, keyboard/touch/focus, long messages, contrast, reduced motion, forced colors, fallback and no service writes passed');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
