const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage(),errors=[],writes=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});page.on('request',r=>{if(!['GET','HEAD'].includes(r.method()))writes.push(r.url());});
  for(const width of [320,375,390,414,768,1024,1440]){
   await page.setViewportSize({width,height:1000});await page.goto(`${base}/v2/components/#badges`);await page.reload();
   await page.waitForFunction(()=>document.querySelector('[data-badge-preview]')?.dataset.badgeReady==='true');await page.evaluate(()=>document.fonts.ready);
   assert.deepEqual(await page.locator('.v2-component-section:visible').evaluateAll(ns=>ns.map(n=>n.id)),['badges','notification-badges']);
   assert.equal(await page.locator('#badges .v2-state-comparison').evaluate(n=>n.open),false);
   assert.equal(await page.locator('#notification-badges .v2-state-comparison').evaluate(n=>n.open),false);
   const compact=page.locator('#badges .v2-badge[data-size="compact"]');
   assert.deepEqual(await compact.evaluate(n=>{const s=getComputedStyle(n);return [n.textContent,s.fontSize,s.fontWeight,n.getBoundingClientRect().height];}),['신규','10px','400',20]);
   assert.equal(await page.locator('#badges button,#badges .v2-badge[tabindex],#badges .v2-badge[aria-pressed]').count(),0,'information labels are not selectable or focusable');
   assert.ok(await page.locator('#badges .v2-badge').evaluateAll(ns=>ns.every(n=>getComputedStyle(n).cursor==='default')));
   const shadow=await compact.evaluate(n=>getComputedStyle(n).boxShadow);await compact.hover();assert.equal(await compact.evaluate(n=>getComputedStyle(n).boxShadow),shadow,'labels do not lift on hover');
   assert.ok(await page.locator('.v2-badge,.v2-count-badge').evaluateAll(ns=>{
    const canvas=document.createElement('canvas');canvas.width=canvas.height=1;const ctx=canvas.getContext('2d');
    const lum=color=>{ctx.clearRect(0,0,1,1);ctx.fillStyle=color;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data].slice(0,3).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);};
    return ns.filter(n=>!n.hidden).every(n=>{const s=getComputedStyle(n),a=lum(s.color),b=lum(s.backgroundColor);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05)>=4.5;});
   }),'badge text meets 4.5:1 contrast '+width);
   const picker=page.getByRole('combobox',{name:'예시 알림 개수'});
   assert.ok((await picker.boundingBox()).height>=48);
   await picker.focus();assert.equal(await picker.evaluate(n=>getComputedStyle(n).outlineWidth),'3px');
   for(const [count,value] of [['0','0'],['1','1'],['99','99'],['100','99+'],['128','99+']]){
    await picker.selectOption(count);assert.equal(await page.locator('#v2-badge-live-count').isVisible(),count!=='0');assert.equal(await page.locator('#v2-badge-live-dot').isVisible(),count!=='0');
    assert.equal(await page.locator('#v2-badge-live-count').getAttribute('aria-label'),`읽지 않은 알림 ${count}개`);
    if(count!=='0')assert.equal(await page.locator('#v2-badge-live-count .og-count-value').textContent(),value);
    assert.ok((await page.locator('[data-badge-message]').textContent()).includes(`${count}개`));
    assert.equal(await picker.evaluate(n=>document.activeElement===n),true,'preview update preserves native select focus');
   }
   await page.locator('#badges .v2-state-comparison > summary').click();await page.locator('#notification-badges .v2-state-comparison > summary').click();
   assert.ok(await page.locator('.v2-badge-stage').evaluateAll(ns=>ns.every(n=>n.scrollWidth<=n.clientWidth+1)),'long names/statuses fit stage '+width);
   assert.ok(await page.locator('#badges .v2-badge[data-size="medium"]').evaluate(n=>n.getBoundingClientRect().height>=28));
   await page.emulateMedia({forcedColors:'active'});
   assert.ok(await page.locator('.v2-badge').evaluateAll(ns=>ns.every(n=>getComputedStyle(n).borderTopStyle==='solid')));
   assert.equal(await page.locator('#v2-badge-live-dot').evaluate(n=>getComputedStyle(n).backgroundColor),await page.evaluate(()=>getComputedStyle(document.body).color));
   await picker.selectOption('0');assert.equal(await page.locator('#v2-badge-live-count').isVisible(),false);await picker.selectOption('9');
   await page.emulateMedia({forcedColors:'none',reducedMotion:'reduce'});
   assert.ok(await page.locator('.v2-badge,.v2-count-badge,.v2-unread-dot').evaluateAll(ns=>ns.every(n=>getComputedStyle(n).animationName==='none')));await page.emulateMedia({reducedMotion:'no-preference'});
   const ids=await page.locator('[id]').evaluateAll(ns=>ns.map(n=>n.id));assert.equal(new Set(ids).size,ids.length);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no document overflow '+width);
   await page.locator('#badges .v2-state-comparison > summary').click();await page.locator('#notification-badges .v2-state-comparison > summary').click();
   await page.locator('#badges-title').click();
   if([320,375,390,414,768,1440].includes(width))await page.screenshot({path:`/private/tmp/og-v2-badges-${width}.png`,fullPage:true});
  }
  await page.evaluate(async()=>{const {setupBadgeSamples}=await import('/v2/components/badges.mjs');setupBadgeSamples(document);setupBadgeSamples(document);});
  await page.getByRole('combobox',{name:'예시 알림 개수'}).selectOption('128');assert.equal(await page.locator('#v2-badge-live-count').count(),1,'setup remains idempotent');
  const touch=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true}),phone=await touch.newPage();await phone.goto(`${base}/v2/components/#notification-badges`);
  await phone.waitForFunction(()=>document.querySelector('[data-badge-preview]')?.dataset.badgeReady==='true');await phone.getByRole('combobox',{name:'예시 알림 개수'}).selectOption('0');assert.equal(await phone.locator('#v2-badge-live-count').isVisible(),false);await touch.close();
  await page.route('**/*.{woff,woff2}',r=>r.abort());await page.setViewportSize({width:320,height:1000});await page.goto(`${base}/v2/components/#badges`);await page.reload();await page.waitForFunction(()=>document.querySelector('[data-badge-preview]')?.dataset.badgeReady==='true');await page.evaluate(()=>document.fonts.ready);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'font fallback fits');assert.deepEqual(errors,[]);assert.deepEqual(writes,[]);
  console.log('Badges: 7 widths, non-interactive status meaning, compact 10px/400, native count preview/zero/99+, actual accessible counts, contrast, long copy, forced colors, reduced motion, font fallback, unique ids and no writes passed');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
