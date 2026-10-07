const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage(),errors=[],writes=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)errors.push(r.url()+':'+r.status());});
  page.on('request',r=>{if(!['GET','HEAD'].includes(r.method()))writes.push(r.url());});
  for(const width of [320,375,390,414,768,1024,1440]){
   await page.setViewportSize({width,height:1000});await page.goto(`${base}/v2/components/#icon-buttons`);await page.reload();
   const section=page.locator('#icon-buttons');await section.waitFor();await page.evaluate(()=>document.fonts.ready);
   assert.deepEqual(await page.locator('.v2-component-section:visible').evaluateAll(ns=>ns.map(n=>n.id)),['primary','secondary','review','icon-buttons']);
   assert.equal(await section.locator('[data-icon-feedback]').textContent(),'');
   assert.equal(await section.locator('.v2-icon-stage:not([inert])').count(),0);
   const geometry=await section.locator('.v2-icon-button:visible').evaluateAll(ns=>ns.map(n=>{
    const r=n.getBoundingClientRect(),s=n.querySelector('svg').getBoundingClientRect();return [r.width,r.height,s.width,s.height];
   }));
   assert.ok(geometry.every(v=>v.every((x,i)=>Math.abs(x-(i<2?48:20))<0.1)),'48px touch / 20px art '+width);
   assert.ok(await section.locator('.v2-icon-button:visible').evaluateAll(ns=>{
    const canvas=document.createElement('canvas');canvas.width=canvas.height=1;const ctx=canvas.getContext('2d');
    const lum=color=>{ctx.clearRect(0,0,1,1);ctx.fillStyle=color;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data].slice(0,3).map(c=>c/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4).reduce((s,c,i)=>s+c*[.2126,.7152,.0722][i],0);};
    return ns.every(n=>{const a=lum(getComputedStyle(n).color),b=lum(getComputedStyle(n.closest('.v2-icon-stage,.v2-icon-live')).backgroundColor);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05)>=3;});
   }),'icon contrast >= 3:1 '+width);
   const raised=section.locator('[data-face="raised"]').first();
   assert.equal(await raised.evaluate(n=>getComputedStyle(n,'::before').top),'4px');
   assert.equal(await raised.evaluate(n=>getComputedStyle(n,'::before').boxShadow),'none');
   assert.equal(await raised.evaluate(n=>getComputedStyle(n,'::before').borderWidth),'1px','standalone icon uses a flat Line face');
   const favorite=section.locator('[data-icon-favorite]').first(),disabled=section.locator('[data-icon-favorite]').last();
   const name=await favorite.getAttribute('aria-label');
   assert.equal(await favorite.getAttribute('aria-pressed'),'false');
   assert.equal(await favorite.locator('svg').evaluate(n=>getComputedStyle(n).fill),'none');
   await favorite.click();assert.equal(await favorite.getAttribute('aria-pressed'),'true');
   assert.equal(await favorite.getAttribute('aria-label'),name);
   assert.notEqual(await favorite.locator('svg').evaluate(n=>getComputedStyle(n).fill),'none');
   assert.equal(await favorite.evaluate(n=>document.activeElement===n),true);
   assert.match(await section.locator('[data-icon-feedback]').textContent(),/선택 예시/);
   await page.keyboard.press('Space');assert.equal(await favorite.getAttribute('aria-pressed'),'false');
   await page.keyboard.press('Enter');assert.equal(await favorite.getAttribute('aria-pressed'),'true');
   const feedback=await section.locator('[data-icon-feedback]').textContent();
   assert.equal(await disabled.isDisabled(),true);
   assert.equal(await disabled.evaluate(n=>getComputedStyle(n).color),await section.locator('.v2-icon-stage [data-face="plain"]').first().evaluate(n=>getComputedStyle(n).color),'disabled selection keeps fill but uses muted ink');
   await disabled.dispatchEvent('click');
   assert.equal(await disabled.getAttribute('aria-pressed'),'true');
   assert.equal(await section.locator('[data-icon-feedback]').textContent(),feedback);
   await section.locator('.v2-state-comparison > summary').click();
   const pending=section.locator('[data-state="loading"]');
   assert.equal(await pending.isDisabled(),true);assert.equal(await pending.getAttribute('aria-busy'),'true');
   assert.equal(await pending.getAttribute('aria-pressed'),'false');
   assert.equal(await section.locator('[data-state="error"]').getAttribute('aria-pressed'),'false');
   assert.equal(await section.locator('[data-state="success"]').getAttribute('aria-pressed'),'true');
   await page.emulateMedia({reducedMotion:'reduce'});
   assert.equal(await pending.evaluate(n=>getComputedStyle(n,'::after').animationName),'none');
   await favorite.focus();assert.equal(await favorite.evaluate(n=>getComputedStyle(n).outlineWidth),'3px');
   await page.emulateMedia({forcedColors:'active'});
   assert.notEqual(await favorite.evaluate(n=>getComputedStyle(n).outlineStyle),'none');
   await page.emulateMedia({forcedColors:'none',reducedMotion:'no-preference'});
   await section.locator('.v2-icon-demo-row > span').first().evaluate(n=>{n.textContent='아주 긴 이름을 가진 오시 망원본점 즐겨찾기 검토용 매장';});
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no horizontal overflow '+width);
   if([390,1440].includes(width)){
    await section.locator('.v2-state-comparison > summary').click();await page.evaluate(()=>document.activeElement.blur());await section.screenshot({path:`/private/tmp/og-v2-icon-buttons-${width}.png`});
   }
  }
  const touch=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const phone=await touch.newPage();await phone.goto(`${base}/v2/components/#icon-buttons`);
  const button=phone.locator('#icon-buttons [data-icon-favorite]').first();await button.tap();
  assert.equal(await button.getAttribute('aria-pressed'),'true');await touch.close();
  await page.route('**/*.{woff,woff2}',route=>route.abort());await page.goto(`${base}/v2/components/#icon-buttons`);await page.evaluate(()=>document.fonts.ready);
  assert.equal(await page.locator('#icon-buttons .material-icons').count(),0,'no icon font dependency');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'font fallback does not overflow');
  assert.deepEqual(writes,[]);assert.deepEqual(errors,[]);
  console.log('Icon buttons: 7 widths, 48px touch / 20px art, selection, keyboard/touch, disabled/pending, focus, reduced motion, forced colors, font fallback and no writes passed');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
