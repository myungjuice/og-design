const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)errors.push(r.url()+':'+r.status());});
  for(const width of [320,375,390,414,768,1024,1440]){
   await page.setViewportSize({width,height:1000});await page.goto(`${base}/v2/components/#section-heading`);
   await page.reload();
   await page.locator('main h1').waitFor();
   assert.equal(await page.locator('#section-heading').count(),1,'gallery offers the section heading');
   await page.locator('#section-heading').waitFor();await page.evaluate(()=>document.fonts.ready);
   assert.deepEqual(await page.locator('.v2-component-section:visible').evaluateAll(ns=>ns.map(n=>n.id)),['cards','mileage','section-heading']);
   assert.equal(await page.locator('#heading-basic button').count(),0);
   const info=page.locator('#heading-information .og-heading-info'),action=page.locator('#heading-action .og-heading-action');
   assert.equal(await info.locator('svg').count(),1);
   assert.equal(await info.getAttribute('aria-expanded'),'false');
   await info.focus();await page.keyboard.press('Enter');
   assert.equal(await info.getAttribute('aria-expanded'),'true');assert.equal(await page.locator('#heading-information .v2-heading-help').isVisible(),true);
   await page.keyboard.press('Space');assert.equal(await info.getAttribute('aria-expanded'),'false');
   await action.focus();await page.keyboard.press('Enter');
   assert.match(await page.locator('.v2-heading-feedback').innerText(),/전체보기.*실제/);
   assert.equal(await action.evaluate(n=>n.matches(':focus-visible')),true);assert.equal(await action.evaluate(n=>getComputedStyle(n).outlineWidth),'3px');
   assert.ok(await page.locator('#section-heading button:visible').evaluateAll(ns=>ns.every(n=>{const r=n.getBoundingClientRect();return r.width>=44&&r.height>=44&&n.scrollWidth<=n.clientWidth+1&&r.left>=0&&r.right<=innerWidth;})),'separate touch targets fit '+width);
   assert.ok(await page.locator('#section-heading h3').evaluateAll(ns=>ns.every(n=>getComputedStyle(n).textShadow==='none'&&n.scrollWidth<=n.clientWidth+1)),'headings stay plain and wrap '+width);
   assert.equal(await action.evaluate(n=>getComputedStyle(n).boxShadow),'none','whole-list action stays below the review CTA');
   const title=page.locator('#heading-long h3'),originalTitle=await title.innerText();await title.evaluate(n=>{n.textContent='오지고랜드최근방문한회원점과이용내역을확인하는아주긴제목'.repeat(3);});
   assert.ok(await title.evaluate(n=>n.scrollWidth<=n.clientWidth+1),'unbroken long Korean title fits');
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no horizontal overflow '+width);
   await title.evaluate((n,text)=>{n.textContent=text;},originalTitle);
   const comparison=page.locator('#section-heading .v2-state-comparison');
   await comparison.locator('summary').click();
   assert.equal(await comparison.evaluate(n=>n.open),true,'state comparison expands at '+width);
   await page.locator('#heading-state-error .v2-heading-result').waitFor();
   for(const state of ['disabled','loading'])assert.equal(await page.locator('#heading-state-'+state+' button').isDisabled(),true);
   assert.equal(await page.locator('#heading-state-loading button').getAttribute('aria-busy'),'true');
   assert.match(await page.locator('#heading-state-error .v2-heading-result').innerText(),/다시 시도/);
   assert.match(await page.locator('#heading-state-success .v2-heading-result').innerText(),/확인했습니다/);
   assert.ok(await page.locator('#section-heading :is(h3,.og-heading-description,.og-heading-action,.v2-heading-result)').evaluateAll(ns=>{
    const c=document.createElement('canvas');c.width=c.height=1;const ctx=c.getContext('2d');
    const l=color=>{ctx.clearRect(0,0,1,1);ctx.fillStyle=color;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data].slice(0,3).map(x=>x/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((s,x,i)=>s+x*[.2126,.7152,.0722][i],0);};
    return ns.every(n=>{let s=n;while(s.parentElement&&getComputedStyle(s).backgroundColor==='rgba(0, 0, 0, 0)')s=s.parentElement;const a=l(getComputedStyle(n).color),b=l(getComputedStyle(s).backgroundColor);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05)>=4.5;});
   }),'text contrast for all action states '+width);
   if([390,1440].includes(width)){
    await comparison.locator('summary').click();await page.locator('#section-heading-title').click();await page.locator('#section-heading').screenshot({path:`/private/tmp/og-v2-section-heading-${width}.png`});
   }
  }
  const touch=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const phone=await touch.newPage();await phone.goto(`${base}/v2/components/#section-heading`);
  await phone.locator('#heading-information .og-heading-info').tap();assert.equal(await phone.locator('#heading-information .v2-heading-help').isVisible(),true);
  await phone.locator('#heading-action .og-heading-action').tap();assert.match(await phone.locator('.v2-heading-feedback').innerText(),/전체보기/);await touch.close();
  await page.emulateMedia({reducedMotion:'reduce'});assert.ok(await page.locator('#section-heading button').evaluateAll(ns=>ns.every(n=>getComputedStyle(n).animationName==='none')));
  assert.deepEqual(errors,[]);console.log('Section heading: shared semantics, 5 patterns, inline help, 6 action states, 7 widths, long Korean, contrast and keyboard/touch passed');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
