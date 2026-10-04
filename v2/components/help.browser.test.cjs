const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:1000}}),errors=[],writes=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.method()!=='GET')writes.push(r.url());});
  const url=base+'/v2/components/#help';
  for(const width of [320,375,390,414,768,1024,1440]){
   await page.setViewportSize({width,height:1000});await page.goto(url);await page.evaluate(()=>document.fonts.ready);
   const section=page.locator('#help'),trigger=section.locator('[data-help-trigger="popover"]'),panel=section.locator('#v2-mileage-help'),tip=section.locator('#v2-total-help');
   assert.equal(await panel.isVisible(),false,'panel closed initially');
   assert.ok(await section.locator('.v2-help-stage').evaluateAll(ns=>ns.every(n=>n.inert)));
   assert.ok(await trigger.evaluate(n=>{const r=n.getBoundingClientRect();return r.width>=48&&r.height>=48;}));
   await trigger.click();await page.waitForFunction(()=>document.querySelector('#v2-mileage-help').matches(':popover-open'));
   assert.equal(await trigger.getAttribute('aria-expanded'),'true');
   const close=panel.getByRole('button',{name:'안내 닫기'});
   assert.equal(await close.evaluate(n=>document.activeElement===n),true,'focus on close');
   assert.ok(await panel.evaluate(n=>{const r=n.getBoundingClientRect();return r.left>=11&&r.right<=innerWidth-11&&r.top>=11&&r.bottom<=innerHeight-11;}),'panel fits viewport '+width);
   assert.ok(await panel.evaluate(n=>{
    const canvas=document.createElement('canvas');canvas.width=canvas.height=1;const ctx=canvas.getContext('2d');
    const lum=color=>{ctx.fillStyle=color;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data].slice(0,3).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);};
    const bg=lum(getComputedStyle(n).backgroundColor);
    return [...n.querySelectorAll('h3,p')].every(el=>{const fg=lum(getComputedStyle(el).color);return (Math.max(fg,bg)+.05)/(Math.min(fg,bg)+.05)>=4.5;});
   }),'help title/copy contrast');
   await close.click();assert.equal(await panel.isVisible(),false);assert.equal(await trigger.evaluate(n=>document.activeElement===n),true,'close returns focus');
   await page.keyboard.press('Enter');await page.keyboard.press('Escape');assert.equal(await panel.isVisible(),false);assert.equal(await trigger.evaluate(n=>document.activeElement===n),true,'Escape returns focus');
   await trigger.click();await section.locator('.v2-help-outside').click();assert.equal(await panel.isVisible(),false);
   await page.waitForFunction(()=>document.querySelector('[data-help-trigger="popover"]').getAttribute('aria-expanded')==='false');
   const short=section.locator('[data-help-trigger="tooltip"]');await short.click();assert.equal(await tip.isVisible(),true);assert.equal(await tip.getByRole('button').count(),0);
   await page.keyboard.press('Escape');assert.equal(await tip.isVisible(),false);
   await trigger.click();await page.evaluate(()=>{location.hash='primary';});await panel.waitFor({state:'hidden'});
   assert.equal(await trigger.getAttribute('aria-expanded'),'false','group switch closes top layer');
   await page.goto(url);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no overflow '+width);
   if([390,1440].includes(width))await section.screenshot({path:`/private/tmp/og-v2-help-${width}.png`});
  }
  // Anchor near lower/right edge; long copy scrolls without overflowing the viewport.
  await page.goto(url);await page.setViewportSize({width:390,height:700});
  const trigger=page.locator('[data-help-trigger="popover"]'),panel=page.locator('#v2-mileage-help');
  await trigger.evaluate(n=>{n.style.position='fixed';n.style.right='12px';n.style.bottom='12px';n.style.zIndex='10';});
  await trigger.click();assert.ok(await panel.evaluate(n=>n.getBoundingClientRect().bottom<document.querySelector('[data-help-trigger="popover"]').getBoundingClientRect().top),'flips above');
  await panel.locator('p').evaluate(n=>n.textContent='총 보유 마일리지에는 사용 가능한 금액이 포함됩니다. '.repeat(100));
  await page.waitForTimeout(100);assert.ok(await panel.evaluate(n=>n.scrollHeight>n.clientHeight&&n.scrollWidth<=n.clientWidth),'long help scrolls without horizontal clipping');
  await page.setViewportSize({width:320,height:500});await page.waitForTimeout(100);assert.ok(await panel.evaluate(n=>n.getBoundingClientRect().right<=innerWidth-11),'resize repositions');
  await panel.evaluate(n=>n.scrollTop=n.scrollHeight);assert.ok(await panel.evaluate(n=>n.scrollTop>0));
  await page.keyboard.press('Escape');await trigger.click();
  assert.equal(await panel.evaluate(n=>n.scrollTop),0,'reopening long help starts at its title');
  assert.ok(await panel.locator('button').evaluate(n=>{const r=n.getBoundingClientRect(),p=n.closest('[popover]').getBoundingClientRect();return r.top>=p.top&&r.bottom<=p.bottom;}),'focused close is visible when reopened');
  await page.keyboard.press('Escape');
  await page.emulateMedia({forcedColors:'active'});await trigger.click();assert.equal(await panel.evaluate(n=>getComputedStyle(n).borderTopWidth),'1px');await page.keyboard.press('Escape');
  await page.emulateMedia({forcedColors:'none'});await page.route('**/*.woff2',r=>r.abort());await page.reload();assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'fallback fits');
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true}),phone=await context.newPage();
  await phone.goto(url);await phone.locator('[data-help-trigger="popover"]').tap();assert.equal(await phone.locator('#v2-mileage-help').isVisible(),true);await phone.locator('#v2-mileage-help button').tap();assert.equal(await phone.locator('#v2-mileage-help').isVisible(),false);await context.close();
  assert.deepEqual(errors,[]);assert.deepEqual(writes,[]);
  console.log('Help: seven widths, closed/static semantics, touch/keyboard/focus, outside dismissal, group cleanup, edge flipping, long copy, resize, forced colors and fallback passed');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
