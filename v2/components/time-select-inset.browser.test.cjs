const test=require('node:test');
const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
test('time selection reuses the inset chevron while preserving native values and keyboard controls',async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const width of [320,375,390,414,768]){
   await page.setViewportSize({width,height:1100});await page.goto('http://127.0.0.1:4173/v2/components/#time-picker');
   const picker=page.locator('#v2-time-live');await picker.waitFor();await page.evaluate(()=>document.fonts.ready);
   const styles=await picker.locator('select').evaluateAll(nodes=>nodes.map(n=>{
    const c=getComputedStyle(n),a=getComputedStyle(n.parentElement,'::after');
    return {shared:n.parentElement.matches('.v2-select-control'),appearance:c.appearance,inset:a.right,padding:parseFloat(c.paddingRight),pointer:a.pointerEvents,fits:n.scrollWidth<=n.clientWidth};
   }));
   assert.equal(styles.length,3);
   assert.ok(styles.every(s=>s.shared&&s.appearance==='none'&&s.inset==='16px'&&s.padding>=32&&s.pointer==='none'&&s.fits),JSON.stringify(styles));
   await picker.locator('[data-time-period]').selectOption('오후');await picker.locator('[data-time-hour]').selectOption('12');await picker.locator('[data-time-minute]').selectOption('59');
   assert.match(await picker.locator('[data-time-summary]').innerText(),/오후 12:59/);
   await picker.locator('[data-picker-cancel]').click();assert.match(await picker.locator('[data-time-summary]').innerText(),/오전 09:30/);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   await picker.screenshot({path:'/private/tmp/og-time-select-inset-'+width+'.png'});
  }
  await page.goto('http://127.0.0.1:4173/v2/components/#text-input');await page.locator('#text-input summary').click();
  const error=page.locator('#text-input-state-error');assert.equal(await error.locator('.og-field-slot').count(),0);assert.equal(await error.locator('input').getAttribute('aria-invalid'),'true');
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});
