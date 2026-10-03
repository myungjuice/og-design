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
   await page.setViewportSize({width,height:1000});await page.goto(`${base}/v2/components/`);
   await page.locator('#try').waitFor();await page.evaluate(()=>document.fonts.ready);
   assert.equal(await page.locator('[data-component="button"]').count(),18);
   assert.equal(await page.locator('main [data-state="hover"],main [data-state="focus"]').count(),0);
   const accessibility=page.locator('.v2-accessibility-check');
   assert.equal(await accessibility.evaluate(n=>n.open),false);
   await accessibility.locator('summary').focus();await page.keyboard.press('Enter');
   assert.equal(await accessibility.evaluate(n=>n.open),true);
   await page.keyboard.press('Enter');assert.equal(await accessibility.evaluate(n=>n.open),false);
   assert.equal(await page.locator('[data-foundation]').count(),0);
   assert.equal(await page.locator('link[href$="foundations.css"]').count(),0);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no overflow '+width);
   assert.ok(await page.locator('.v2-button,.v2-menu-tile').evaluateAll(nodes=>nodes.every(n=>{
    const r=n.getBoundingClientRect();return r.width>=44&&r.height>=44&&n.scrollWidth<=n.clientWidth+1&&r.left>=0&&r.right<=innerWidth;
   })),'touch targets / single-line fit '+width);
   for(const id of ['primary','secondary','review']){
    const heights=await page.locator(`#${id} button`).evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().height));
    assert.equal(new Set(heights).size,1,'state changes do not shift height '+id);
   }
   assert.ok(await page.locator('[data-state="loading"]').evaluateAll(nodes=>nodes.every(n=>n.disabled&&n.getAttribute('aria-busy')==='true')));
   assert.ok(await page.locator('[data-state="disabled"]').evaluateAll(nodes=>nodes.every(n=>n.disabled)));
   assert.ok(await page.locator('.v2-button,.v2-menu-tile,.v2-mileage button').evaluateAll(nodes=>{
    const canvas=document.createElement('canvas');canvas.width=canvas.height=1;const ctx=canvas.getContext('2d');
    const luminance=color=>{ctx.clearRect(0,0,1,1);ctx.fillStyle=color;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data].slice(0,3).map(c=>c/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4).reduce((sum,c,i)=>sum+c*[.2126,.7152,.0722][i],0);};
    return nodes.every(n=>{
     const style=getComputedStyle(n);let surface=n;
     while(surface.parentElement&&getComputedStyle(surface).backgroundColor==='rgba(0, 0, 0, 0)')surface=surface.parentElement;
     const a=luminance(style.color),b=luminance(getComputedStyle(surface).backgroundColor);
     return (Math.max(a,b)+.05)/(Math.min(a,b)+.05)>=4.5;
    });
   }),'button text contrast >= 4.5:1');
   assert.ok(await page.locator('main h1,.v2-component-section>p,.v2-component-sample figcaption,.v2-component-sample figcaption span,.v2-component-nav a').evaluateAll(nodes=>{
    const canvas=document.createElement('canvas');canvas.width=canvas.height=1;const ctx=canvas.getContext('2d');
    const l=color=>{ctx.fillStyle=color;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data].slice(0,3).map(c=>c/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4).reduce((s,c,i)=>s+c*[.2126,.7152,.0722][i],0);};
    const bg=l(getComputedStyle(document.documentElement).backgroundColor);
    return nodes.every(n=>{const fg=l(getComputedStyle(n).color);return (Math.max(fg,bg)+.05)/(Math.min(fg,bg)+.05)>=4.5;});
   }),'gallery text remains readable on dark gray');
   const info=page.locator('.v2-card');const before=await info.evaluate(n=>getComputedStyle(n).boxShadow);
   await info.hover();assert.equal(await info.evaluate(n=>getComputedStyle(n).boxShadow),before,'information card has no hover interaction');
   const tile=page.locator('[data-preview-action="tile"]');await tile.focus();
   assert.equal(await tile.evaluate(n=>n.matches(':focus-visible')),true);
   assert.equal(await tile.evaluate(n=>getComputedStyle(n).outlineWidth),'3px');
   await page.keyboard.press('Space');assert.equal(await tile.getAttribute('aria-pressed'),'true');
   await page.keyboard.press('Enter');assert.equal(await tile.getAttribute('aria-pressed'),'false');
   await page.locator('[data-preview-action="button"]').click();
   assert.match(await page.locator('.v2-preview-status').innerText(),/실제 마일리지 사용은 진행되지 않습니다/);
   if([390,1440].includes(width))await page.screenshot({path:`/private/tmp/og-v2-components-${width}.png`,fullPage:true});
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  assert.ok(await page.locator('main button').evaluateAll(nodes=>nodes.every(n=>getComputedStyle(n).animationName==='none')));
  const touch=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
  const touchPage=await touch.newPage();await touchPage.goto(`${base}/v2/components/`);
  await touchPage.locator('[data-preview-action="tile"]').tap();
  assert.equal(await touchPage.locator('[data-preview-action="tile"]').getAttribute('aria-pressed'),'true');
  assert.deepEqual(errors,[]);
  console.log('v2 components: 6 app states, separate accessibility checklist, 3 button roles, card/tile, 6 widths, keyboard/touch passed');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
