const test=require('node:test');
const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
const widths=[320,375,414,768];
const launch=()=>chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
async function open(page,screen,width){
 await page.setViewportSize({width,height:1100});
 await page.goto(base+'/v2/'+screen+'/');
 await page.waitForFunction(()=>{
  const root=document.querySelector('.v2-screen-host')?.shadowRoot;
  return root&&[...root.querySelectorAll('link[rel="stylesheet"]')].every(link=>link.sheet);
 });
 await page.evaluate(()=>document.fonts.ready);
 await page.locator('.'+screen+'-test img').evaluateAll(images=>Promise.all(images.map(image=>image.decode())));
 await page.locator('.'+screen+'-test').scrollIntoViewIfNeeded();
}

// Catches putting More back inside the clipped category rail.
test('Home More stays visible and stationary while categories scroll',async()=>{
 const browser=await launch();
 try{
  const page=await browser.newPage();
  for(const width of widths){
   await open(page,'home',width);
   const frame=page.locator('.home-test'),more=frame.locator('.home-category-more'),rail=frame.locator('.home-categories');
   assert.ok(await more.evaluate(node=>{
    const box=node.getBoundingClientRect(),frame=node.closest('.home-test').getBoundingClientRect();
    return box.left>=frame.left&&box.right<=frame.right&&node.scrollWidth<=node.clientWidth;
   }),'More fully visible on entry at '+width);
   assert.equal(await rail.locator('.home-category-more').count(),0,'More is independent of scrolling categories');
   const before=await more.boundingBox();
   await rail.evaluate(node=>node.scrollTo({left:node.scrollWidth,behavior:'instant'}));
   const after=await more.boundingBox();
   assert.equal(after.x,before.x);assert.equal(after.y,before.y);
   const last=rail.locator('[data-category="일식"]');
   assert.ok(await last.evaluate(node=>{
    const box=node.getBoundingClientRect(),rail=node.closest('.home-categories').getBoundingClientRect();
    return box.left>=rail.left&&box.right<=rail.right+1;
   }),'last category reachable without sitting beneath More at '+width);
   await last.click();assert.equal(await last.getAttribute('aria-pressed'),'true');
   await more.click();assert.equal(await page.getByRole('dialog').isVisible(),true);
   await page.keyboard.press('Escape');assert.ok(await more.evaluate(node=>node.getRootNode().activeElement===node),'More restores focus');
   await frame.locator('.home-search-submit').focus();await page.keyboard.press('Tab');
   assert.ok(await rail.locator('[data-category="전체"]').evaluate(node=>node.getRootNode().activeElement===node),'Tab enters the first category');
   assert.ok(await rail.locator('[data-category="전체"]').evaluate(node=>{
    const box=node.getBoundingClientRect(),rail=node.closest('.home-categories').getBoundingClientRect();
    return box.left>=rail.left-1&&box.right<=rail.right+1;
   }),'keyboard focus scrolls the first category back into view');
   await page.keyboard.press('Enter');
   assert.equal(await rail.locator('[aria-pressed="true"]').count(),1);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   await frame.screenshot({path:`/private/tmp/og-v2-home-refined-${width}.png`});
  }
 }finally{await browser.close();}
});

// Catches shrinking an important zero-balance explanation to force one line.
test('Barcode zero-balance explanation stays readable without clipping at narrow widths',async()=>{
 const browser=await launch();
 try{
  const page=await browser.newPage();
  for(const width of widths){
   await open(page,'barcode',width);
   await page.evaluate(async()=>{
    const {renderBarcodeScreen}=await import('/v2/barcode/render.mjs');
    document.querySelector('.v2-screen-host').shadowRoot.querySelector('.barcode-test').outerHTML=renderBarcodeScreen({available:0,total:2400,shared:0,sharedCount:0});
   });
   const frame=page.locator('.barcode-test'),hint=frame.locator('.barcode-empty-hint');
   const geometry=await hint.evaluate(node=>{
    const style=getComputedStyle(node),box=node.getBoundingClientRect(),sheet=node.closest('.barcode-sheet');
    return {font:style.fontSize,nowrap:style.whiteSpace==='nowrap',height:box.height,line:parseFloat(style.lineHeight),fits:node.scrollWidth<=node.clientWidth,sheetFits:sheet.scrollHeight<=sheet.clientHeight};
   });
   assert.equal(geometry.font,'12px','readable explanation at '+width);
   assert.equal(geometry.nowrap,false);assert.ok(geometry.fits&&geometry.sheetFits);
   if(width===320)assert.ok(geometry.height>=geometry.line*2,'narrow hint may use a second line');
   assert.equal(await frame.getByRole('button',{name:'마일리지 사용',exact:true}).isDisabled(),true);
   await frame.getByRole('button',{name:'마일리지 사용',exact:true}).evaluate(node=>node.click());
   assert.equal(await page.getByRole('dialog').isVisible(),false);
   assert.equal(await frame.getByRole('button',{name:'영수증 적립',exact:true}).isEnabled(),true);
   await frame.screenshot({path:`/private/tmp/og-v2-barcode-empty-refined-${width}.png`});
  }
 }finally{await browser.close();}
});
