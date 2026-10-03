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
   await page.setViewportSize({width,height:1000});await page.goto(`${base}/v2/components/#mileage`);
   await page.locator('.v2-mileage').first().waitFor();await page.evaluate(()=>document.fonts.ready);
   const comparison=page.locator('#mileage .v2-state-comparison');
   if(!await comparison.evaluate(n=>n.open))await comparison.locator('summary').click();
   assert.equal(await page.locator('#mileage .v2-mileage:visible').count(),4);
   assert.equal(await page.locator('.v2-mileage').count(),4);
   assert.equal(await page.locator('.v2-mileage .mileage-rows>div:last-child dd').first().innerText(),'공유인 3명 | 1,250 M');
   assert.ok(await page.locator('.v2-mileage .mileage-rows>div:last-child dd').evaluateAll(nodes=>nodes.every(n=>{const r=document.createRange();r.selectNodeContents(n);return r.getBoundingClientRect().height<=parseFloat(getComputedStyle(n).lineHeight)+1;})),'sharing count/unit and amount stay on one line '+width);
   assert.ok(await page.locator('.v2-mileage img').evaluateAll(nodes=>nodes.every(n=>n.complete&&n.naturalWidth>0)));
   assert.equal(await page.locator('#mileage [role="slider"],#mileage input').count(),0);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'page overflow '+width);
   const geometry=await page.locator('.v2-mileage').evaluateAll(cards=>cards.map(card=>{
    const r=card.getBoundingClientRect(),bar=card.querySelector('.mileage-graph').getBoundingClientRect();
    const marker=card.querySelector('.graph-marker'),m=marker.getBoundingClientRect();
    const areas=[...card.querySelectorAll('button')].map(button=>{
     const b=button.getBoundingClientRect(),s=getComputedStyle(button,'::before');
     return {left:b.left+parseFloat(s.left),right:b.right-parseFloat(s.right),top:b.top+parseFloat(s.top),bottom:b.bottom-parseFloat(s.bottom)};
    });
    return {fits:r.left>=0&&r.right<=innerWidth&&card.scrollWidth<=card.clientWidth+1,
     contained:marker.hidden||(m.left>=bar.left-.1&&m.right<=bar.right+.1),
     areas,background:getComputedStyle(card).backgroundColor,
     held:card.querySelector('.graph-held').getBoundingClientRect().width,
     available:card.querySelector('.graph-available').getBoundingClientRect().width,
     hidden:marker.hidden};
   }));
   assert.ok(geometry.every(g=>g.fits&&g.contained),'card/marker bounds '+width);
   for(const g of geometry){
    assert.ok(g.areas.every(a=>a.right-a.left>=44&&a.bottom-a.top>=44),'44px touch areas '+width);
    const [a,b]=g.areas;
    assert.ok(a.right<=b.left||b.right<=a.left||a.bottom<=b.top||b.bottom<=a.top,'non-overlapping controls '+width);
   }
   assert.equal(geometry[2].available,0);assert.equal(geometry[2].held,0);assert.equal(geometry[2].hidden,true);
   assert.equal(geometry[1].available,0);assert.ok(geometry[1].held>0);
   assert.ok(await page.locator('.v2-mileage').evaluateAll(cards=>{
    const canvas=document.createElement('canvas');canvas.width=canvas.height=1;const ctx=canvas.getContext('2d');
    const lum=color=>{ctx.fillStyle=color;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data].slice(0,3).map(c=>c/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4).reduce((s,c,i)=>s+c*[.2126,.7152,.0722][i],0);};
    return cards.every(card=>{const s=getComputedStyle(card),bg=lum(s.backgroundColor),fg=lum(s.color);return (Math.max(bg,fg)+.05)/(Math.min(bg,fg)+.05)>=4.5;});
   }),'mileage text contrast >=4.5:1');
   await page.locator('.v2-mileage .mileage-info').first().focus();await page.keyboard.press('Enter');
   assert.match(await page.locator('.v2-mileage-feedback').innerText(),/밝은 구간과 흰 원/);
   await page.locator('.v2-mileage .mileage-history').first().click();
   assert.match(await page.locator('.v2-mileage-feedback').innerText(),/실제 내역 화면 연결은 다음/);
   if([390,1440].includes(width))await page.locator('#mileage').screenshot({path:`/private/tmp/og-v2-mileage-${width}.png`});
  }
  // Long balances and different display ranges must not change business amounts.
  await page.setViewportSize({width:320,height:1000});
  await page.evaluate(async()=>{
   const {renderMileage}=await import('/v2/components/mileage.mjs');
   document.querySelector('.v2-mileage').outerHTML=renderMileage({available:999999999,total:999999999,shared:999999999,sharedCount:999});
  });
  assert.ok(await page.locator('.v2-mileage').first().evaluate(n=>n.scrollWidth<=n.clientWidth+1),'long amount fits');
  assert.equal(await page.locator('.v2-mileage [role="meter"]').first().getAttribute('aria-valuenow'),'20000');
  assert.equal(await page.locator('.v2-mileage [role="meter"]').first().getAttribute('aria-valuetext'),'999,999,999 M');
  assert.deepEqual(errors,[]);
  console.log('v2 mileage: shared original assets, 4 balance cases, 6 widths, touch areas, meter bounds, contrast and preview actions passed');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
