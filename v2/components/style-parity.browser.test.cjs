const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
const material=n=>{const s=getComputedStyle(n);return Object.fromEntries(['fontSize','fontWeight','lineHeight','color','backgroundColor','backgroundImage','borderRadius','borderWidth','borderColor','boxShadow'].map(k=>[k,s[k]]));};
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1100}}),reference=await browser.newPage({viewport:{width:1440,height:1100}}),original=await browser.newPage({viewport:{width:1440,height:1100}});
  await original.goto(base+'/screens/my-info-3d-test/');await original.locator('.barcode-use').waitFor();
  await reference.goto(base+'/v2/barcode/');await reference.locator('.barcode-use').waitFor();
  await page.goto(base+'/v2/components/#group-buttons');await page.locator('#primary').waitFor();
  for(const [id,selector] of [['primary','.barcode-use'],['secondary','.barcode-earn']]){
   assert.deepEqual(await page.locator(`#${id} .v2-button`).first().evaluate(material),await reference.locator(selector).evaluate(material),'common '+id+' material matches actual barcode action');
   assert.equal(await reference.locator(selector).evaluate(n=>getComputedStyle(n).boxShadow),'none','V2 '+id+' follows the approved flat button rule');
   assert.notEqual(await original.locator(selector).evaluate(n=>getComputedStyle(n).boxShadow),'none','legacy canvas material remains unchanged');
  }
  await reference.goto(base+'/v2/my-info/');await reference.locator('.service-tile').first().waitFor();
  await page.goto(base+'/v2/components/#group-cards-information');await page.locator('#cards').waitFor();
  const icon=page.locator('#cards .v2-menu-tile[data-layout="icon"]').first(),real=reference.locator('.service-tile').first();
  for(const part of ['.service-face','.service-art img']){
   const size=n=>{const r=n.getBoundingClientRect(),s=getComputedStyle(n);return [r.width,r.height,s.borderRadius,s.boxShadow,s.backgroundColor,s.objectFit];};
   assert.deepEqual(await icon.locator(part).evaluate(size),await real.locator(part).evaluate(size),'icon tile preserves real plate and artwork crop');
   assert.deepEqual(await real.locator(part).evaluate(size),await original.locator('.service-tile').first().locator(part).evaluate(size),'My Info plate/crop retains the original appearance');
  }
  assert.equal(await icon.locator('img').getAttribute('src'),await real.locator('img').getAttribute('src'));
  assert.equal(await page.locator('#cards .v2-menu-tile[data-layout="text"]').count(),1,'text-only variant remains separate');
  const action=page.locator('#heading-action .og-heading-action');
  assert.equal(await action.evaluate(n=>getComputedStyle(n).boxShadow),'none','secondary whole-list action does not compete with review CTA');
  assert.equal(await action.evaluate(n=>getComputedStyle(n).borderWidth),'0px');
  assert.equal(await action.locator('svg[aria-hidden="true"]').count(),1);
  await page.locator('#cards').screenshot({path:'/private/tmp/og-v2-aligned-menu-tiles.png'});
  await page.locator('#section-heading').screenshot({path:'/private/tmp/og-v2-aligned-headings.png'});
  for(const width of [320,375,414,768]){
   await page.setViewportSize({width,height:1100});
   for(const id of ['group-buttons','group-cards-information']){
    await page.goto(base+'/v2/components/#'+id);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no overflow '+width);
    assert.ok(await page.locator('.v2-menu-tile:visible,.og-heading-action:visible,.v2-button:visible').evaluateAll(ns=>ns.every(n=>{const r=n.getBoundingClientRect();return r.width>=44&&r.height>=44&&n.scrollWidth<=n.clientWidth+1;})),'touch-safe control fit '+width);
   }
  }
  console.log('Style parity: actual barcode materials, My Info icon asset/crop, separate text tile, quiet whole-list action, four mobile widths passed');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
