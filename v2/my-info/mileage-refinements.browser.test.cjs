const test=require('node:test');
const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
const widths=[320,375,414,768];
async function open(page,width){
 await page.setViewportSize({width,height:1100});
 await page.goto(base+'/v2/my-info/#mileage-history');
 await page.waitForFunction(()=>[...document.querySelectorAll('[data-mileage-state] .v2-mileage-history-host')].every(host=>{
  const root=host.shadowRoot;return root&&[...root.querySelectorAll('link[rel="stylesheet"]')].every(link=>link.sheet);
 }));
 await page.evaluate(()=>document.fonts.ready);
}
const launch=()=>chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});

test('all four period chips fit one row without shrinking text or colliding with selection marks',async()=>{
 const browser=await launch();
 try{
  const page=await browser.newPage();
  for(const width of widths){
   await open(page,width);
   for(const state of ['basic','empty','period']){
    const frame=page.locator(`[data-mileage-state="${state}"] .v2-mileage-history-frame`);
    const chips=await frame.locator('.v2-history-periods .v2-chip').evaluateAll(nodes=>nodes.map(node=>{
     const box=node.getBoundingClientRect(),label=node.querySelector('.v2-chip-label').getBoundingClientRect(),mark=node.querySelector('.v2-chip-check').getBoundingClientRect(),rail=node.parentElement.getBoundingClientRect();
     return {top:box.top,width:box.width,height:box.height,font:getComputedStyle(node).fontSize,fits:box.left>=rail.left&&box.right<=rail.right,nowrap:node.scrollWidth<=node.clientWidth,checkFits:node.getAttribute('aria-pressed')!=='true'||mark.right<=label.left&&mark.left>=box.left&&mark.bottom<=box.bottom};
    }));
    assert.equal(chips.length,4);assert.ok(chips.every(chip=>Math.abs(chip.top-chips[0].top)<1),'one period row at '+width+' '+state);
    assert.ok(chips.every(chip=>chip.width>=44&&chip.height>=48&&chip.font==='14px'&&chip.fits&&chip.nowrap&&chip.checkFits),'readable labels, touch area and non-overlapping checks at '+width+' '+state);
   }
   await page.locator('[data-mileage-state="basic"] .v2-mileage-history-frame').screenshot({path:`/private/tmp/og-v2-mileage-refined-${width}.png`});
  }
 }finally{await browser.close();}
});

test('long mileage records support wheel and keyboard reading without enabling service actions',async()=>{
 const browser=await launch();
 try{
  const page=await browser.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('response',response=>{if(response.status()>=400)errors.push(response.url()+':'+response.status());});
  for(const width of widths){
   await open(page,width);
   await page.evaluate(async()=>{
    const {renderMileageHistory}=await import('/v2/my-info/mileage.mjs');
    const root=document.querySelector('[data-mileage-state="basic"] .v2-mileage-history-host').shadowRoot;
    root.querySelector('.v2-mileage-history-frame').outerHTML=renderMileageHistory({id:'long-reading',entries:Array.from({length:24},(_,index)=>({date:'2026-09-18',title:index===23?'마지막 기록 · 오시 망원본점':'오시 망원본점',amount:index%2?'-5,000 M':'+1,000 M'}))});
   });
   const frame=page.locator('[data-mileage-state="basic"] .v2-mileage-history-frame'),body=frame.locator('.og-sheet-body');
   assert.ok(await body.evaluate(node=>node.scrollHeight>node.clientHeight),'fixture must overflow');
   await body.scrollIntoViewIfNeeded();const box=await body.boundingBox();
   await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.wheel(0,10000);
   const atBottom=()=>{const node=document.querySelector('[data-mileage-state="basic"] .v2-mileage-history-host').shadowRoot.querySelector('.og-sheet-body');return node.scrollTop+node.clientHeight>=node.scrollHeight-2;};
   try{await page.waitForFunction(atBottom,null,{timeout:2500});}catch(error){if(error.name!=='TimeoutError')throw error;assert.fail('wheel cannot reach last mileage record at '+width);}
   assert.ok(await body.evaluate(node=>node.lastElementChild.getBoundingClientRect().bottom<=node.getBoundingClientRect().bottom),'last record visible');
   await body.evaluate(node=>node.scrollTo({top:0,behavior:'instant'}));await body.focus();
   assert.ok(await body.evaluate(node=>node.getRootNode().activeElement===node),'reading region receives keyboard focus');
   await page.keyboard.press('End');await page.waitForFunction(atBottom);
   assert.ok(await frame.evaluate(node=>[...node.querySelectorAll('button,input')].every(control=>control.inert)&&node.querySelector('.v2-mileage-backdrop').inert),'service controls/backdrop remain inert');
   assert.ok(await frame.locator('.og-sheet-footer').evaluate(node=>node.getBoundingClientRect().bottom<=node.closest('.v2-mileage-history-frame').getBoundingClientRect().bottom),'footer stays visible');
   if(width===320)await frame.screenshot({path:'/private/tmp/og-v2-mileage-long-reading-320.png'});
   const period=page.locator('[data-mileage-state="period"] .v2-mileage-history-frame');
   assert.ok(await period.locator('.v2-sheet-static').evaluate(node=>node.inert&&node.getAttribute('aria-hidden')==='true'),'calendar blocks underlying history');
   assert.ok(await period.locator('.v2-history-period-panel').evaluate(node=>!node.closest('[inert]')&&[...node.querySelectorAll('button')].every(control=>control.inert)),'calendar remains readable but static');
  }
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});
