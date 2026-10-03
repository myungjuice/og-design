const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)errors.push(r.url()+':'+r.status());});
  for(const width of [320,375,390,414,768,1440]){
   await page.setViewportSize({width,height:1000});await page.goto(`${base}/v2/components/#list-row`);
   await page.locator('#list-row button').first().waitFor();await page.evaluate(()=>document.fonts.ready);
   const comparison=page.locator('#list-row .v2-state-comparison');
   if(!await comparison.evaluate(n=>n.open))await comparison.locator('summary').click();
   assert.equal(await page.locator('#list-row-state-error').isVisible(),true);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'page fits '+width);
   const basic=page.locator('#list-row-basic'),icons=page.locator('#list-row-icons'),info=page.locator('#list-row-information');
   assert.equal(await basic.locator('button').count(),2);
   assert.equal(await icons.locator('.og-row-icon').count(),2);
   assert.equal(await info.locator('button,.og-row-chevron,[tabindex]').count(),0);
   assert.equal(await info.locator('.og-row-value').first().innerText(),'16,000 M');
   assert.ok(await page.locator('#list-row .v2-list-row').evaluateAll(ns=>ns.every(n=>{
    const r=n.getBoundingClientRect();return r.height>=56&&r.width>=44&&r.left>=0&&r.right<=innerWidth&&n.scrollWidth<=n.clientWidth+1&&getComputedStyle(n).boxShadow==='none'&&getComputedStyle(n).textShadow==='none';
   })),'flat readable rows remain touch sized '+width);
   assert.ok(await page.locator('#list-row .v2-list-card').evaluateAll(ns=>ns.every(n=>getComputedStyle(n).boxShadow!=='none')),'card owns material depth');
   assert.ok(await page.locator('#list-row .og-row-icon img').evaluateAll(ns=>ns.every(n=>n.complete&&n.naturalWidth===384&&new URL(n.src).pathname==='/screens/my-info-3d-test/media/figma/menu-icons.png')),'actual designer artwork');
   const live=basic.getByRole('button',{name:'공지사항',exact:true});
   const before=await live.boundingBox();await live.focus();await page.keyboard.press('Enter');
   assert.match(await page.locator('.v2-list-feedback').innerText(),/공지사항.*실제 조회나 화면 이동은 진행되지 않습니다/);
   assert.equal(await live.evaluate(n=>n.matches(':focus-visible')),true);
   assert.equal(await live.evaluate(n=>getComputedStyle(n).outlineWidth),'3px');
   const after=await live.boundingBox();assert.deepEqual([after.width,after.height],[before.width,before.height]);
   await live.press('Space');
   const loading=page.locator('#list-row-state-loading button'),disabled=page.locator('#list-row-state-disabled button');
   assert.equal(await loading.isDisabled(),true);assert.equal(await loading.getAttribute('aria-busy'),'true');
   assert.equal(await disabled.isDisabled(),true);
   assert.match(await page.locator('#list-row-state-error .og-row-description').innerText(),/눌러 다시/);
   assert.match(await page.locator('#list-row-state-success .og-row-description').innerText(),/불러왔/);
   assert.ok(await page.locator('#list-row .og-row-title,#list-row .og-row-description,#list-row .og-row-value').evaluateAll(ns=>{
    const c=document.createElement('canvas');c.width=c.height=1;const ctx=c.getContext('2d');
    const l=color=>{ctx.fillStyle=color;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data].slice(0,3).map(x=>x/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((s,x,i)=>s+x*[.2126,.7152,.0722][i],0);};
    return ns.every(n=>{let s=n;while(s.parentElement&&getComputedStyle(s).backgroundColor==='rgba(0, 0, 0, 0)')s=s.parentElement;const a=l(getComputedStyle(n).color),b=l(getComputedStyle(s).backgroundColor);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05)>=4.5;});
   }),'text contrast incl disabled/error/success '+width);
   const staticRow=info.locator('.v2-list-row').first();const paint=await staticRow.evaluate(n=>[getComputedStyle(n).backgroundColor,getComputedStyle(n).boxShadow]);
   await staticRow.hover();assert.deepEqual(await staticRow.evaluate(n=>[getComputedStyle(n).backgroundColor,getComputedStyle(n).boxShadow]),paint);
   assert.equal(new URL(page.url()).pathname,'/v2/components/');
   if([390,1440].includes(width)){
    await page.locator('#list-row-title').click();
    await page.locator('#list-row').screenshot({path:`/private/tmp/og-v2-list-row-${width}.png`});
   }
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  assert.equal(await page.locator('#list-row-state-active .og-row-icon').evaluate(n=>getComputedStyle(n).transform),'none');
  const touch=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const phone=await touch.newPage();await phone.goto(`${base}/v2/components/#list-row`);
  await phone.locator('#list-row-icons').getByRole('button',{name:/공지·알림/}).tap();
  assert.match(await phone.locator('.v2-list-feedback').innerText(),/공지·알림/);await touch.close();
  assert.deepEqual(errors,[]);
  console.log('v2 list rows: 3 patterns, real 3D artwork, card-only elevation, 6 states/widths, long text, contrast, keyboard/touch and reduced motion passed');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
