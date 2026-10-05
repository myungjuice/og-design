const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});const failures=[];
 const cases=[
  ['narrow calendar keeps month navigation and apply action fully visible',async page=>{
   await page.setViewportSize({width:320,height:800});await page.goto(base+'/v2/components/#date-picker');
   for(const selector of ['[data-month-step="1"]','[data-picker-apply]'])assert.ok(await page.locator('#v2-date-live '+selector).evaluate(n=>{const r=n.getBoundingClientRect(),container=n.closest('.v2-picker-stage').getBoundingClientRect();return r.right<=container.right&&r.left>=container.left;}));
  }],
  ['long sheet title keeps actions visible',async page=>{
   await page.goto(base+'/v2/components/#bottom-sheet');await page.locator('[data-sheet-open="v2-sheet-sort"]').click();
   await page.locator('#v2-sheet-sort h2').evaluate(n=>n.textContent='긴 제목 검토 '.repeat(40));
   assert.ok(await page.locator('#v2-sheet-sort [data-sheet-apply]').evaluate(n=>{const r=n.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight;}));
  }],
  ['reopened modal owns scroll lock until its own close',async page=>{
   await page.goto(base+'/v2/components/#bottom-sheet');await page.locator('#bottom-sheet').waitFor();
   await page.evaluate(async()=>{const {setupOverlay}=await import('/v2/components/overlay.mjs');const modal=document.querySelector('#v2-sheet-sort'),trigger=document.querySelector('[data-sheet-open="v2-sheet-sort"]'),c=setupOverlay(modal);c.open(trigger);c.close();c.open(trigger);});
   await page.waitForTimeout(50);assert.equal(await page.evaluate(()=>document.body.style.overflow),'hidden');
   await page.keyboard.press('Escape');await page.waitForFunction(()=>document.body.style.overflow==='',{timeout:2000});
  }],
  ['attachment failure is visible, retryable and retains image',async page=>{
   await page.route('**/membership.png',route=>route.abort());await page.goto(base+'/v2/components/#group-attachments');const demo=page.locator('[data-attachment-demo]');
   await demo.locator('[data-attachment-add]').click();await page.waitForTimeout(100);
   assert.equal(await demo.locator('[data-attachment-image-retry]:visible').count(),1);assert.match(await demo.locator('[data-attachment-message]').innerText(),/불러오지 못/);
   assert.equal(await demo.locator('img').getAttribute('src'),'/screens/my-info-3d-test/media/membership.png');
   await page.unroute('**/membership.png');await demo.locator('[data-attachment-image-retry]').click();await demo.locator('img').evaluate(img=>img.decode());
   assert.equal(await demo.locator('[data-attachment-image-retry]:visible').count(),0);assert.equal(await demo.locator('[data-attachment-remove]').count(),1);
  }],
  ['viewer retry retains focus on stable close control',async page=>{
   await page.route('**/membership.png',route=>route.abort());await page.goto(base+'/v2/components/#group-attachments');await page.locator('[data-viewer-open]').click();
   await page.locator('[data-viewer-retry]').waitFor();await page.locator('[data-viewer-retry]').click();
   assert.ok(await page.locator('[data-viewer-close]').evaluate(n=>document.activeElement===n));
  }]
 ];
 try{for(const [name,check] of cases){const page=await browser.newPage({viewport:{width:390,height:400}});try{await check(page);console.log('PASS '+name);}catch(error){failures.push(name);console.error('FAIL '+name+': '+error.message);}finally{await page.close();}}assert.deepEqual(failures,[]);}finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
