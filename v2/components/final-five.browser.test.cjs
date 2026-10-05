const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[],failed=[],writes=[];
  page.on('pageerror',error=>errors.push(error.message));page.on('response',response=>{if(response.status()>=400)failed.push(response.url());});
  page.on('request',request=>{if(!['GET','HEAD'].includes(request.method()))writes.push(request.url());});
  const visit=async hash=>{await page.goto(base+'/v2/components/#'+hash);await page.reload();const id=({'group-surfaces':'surfaces','group-date-time':'date-picker','group-attachments':'attachment-picker'})[hash]||hash;await page.locator('#'+id).waitFor();await page.evaluate(()=>document.fonts.ready);};
  await visit('quantity');const qty=page.locator('#v2-quantity-live');
  assert.ok(await qty.locator('[data-quantity-minus]').isDisabled());
  for(let i=0;i<4;i++)await qty.locator('[data-quantity-plus]').click();
  assert.equal(await qty.getAttribute('data-value'),'5');assert.ok(await qty.locator('[data-quantity-plus]').isDisabled());
  assert.ok(await qty.locator('[data-quantity-minus]').evaluate(node=>document.activeElement===node),'boundary preserves usable focus');
  await qty.locator('[data-quantity-minus]').click();assert.equal(await qty.getAttribute('data-value'),'4');
  await visit('bottom-sheet');const open=page.locator('[data-sheet-open="v2-sheet-sort"]'),sheet=page.locator('#v2-sheet-sort');
  await open.click();assert.ok(await sheet.isVisible());assert.equal(await page.evaluate(()=>document.body.style.overflow),'hidden');
  await sheet.getByRole('radio',{name:'인기순',exact:true}).check();await page.keyboard.press('Escape');await page.waitForFunction(()=>document.body.style.overflow==='');
  assert.equal(await page.locator('[data-sheet-sort-result]').innerText(),'최근순 적용');assert.equal(await page.evaluate(()=>document.body.style.overflow),'');assert.ok(await open.evaluate(node=>document.activeElement===node));
  await open.click();await sheet.getByRole('radio',{name:'인기순',exact:true}).check();await sheet.locator('[data-sheet-apply]').click();await page.waitForFunction(()=>document.body.style.overflow==='');
  assert.equal(await page.locator('[data-sheet-sort-result]').innerText(),'인기순 적용');
  await open.click();assert.ok(await sheet.getByRole('radio',{name:'인기순',exact:true}).isChecked());await sheet.locator('[data-sheet-close]').first().click();await page.waitForFunction(()=>document.body.style.overflow==='');
  await page.locator('[data-sheet-open="v2-sheet-history"]').click();const history=page.locator('#v2-sheet-history');
  assert.equal(await history.getByRole('tab').count(),4);await history.getByRole('tab',{name:'리뷰',exact:true}).click();assert.match(await history.getByRole('tabpanel').innerText(),/리뷰 내역이 없어요/);await page.keyboard.press('Escape');await page.waitForFunction(()=>document.body.style.overflow==='');
  await visit('date-picker');const date=page.locator('#v2-date-live');
  assert.ok(await date.locator('[data-date="2026-09-22"]').isDisabled());
  await date.locator('[data-date="2026-09-20"]').click();assert.match(await date.locator('[data-picker-summary]').innerText(),/2026-09-20/);
  await date.locator('[data-picker-cancel]').click();assert.match(await date.locator('[data-picker-summary]').innerText(),/2026-09-18/);
  await date.locator('[data-date="2026-09-30"]').focus();await page.keyboard.press('ArrowRight');assert.ok(await date.locator('[data-date="2026-10-01"]').evaluate(node=>document.activeElement===node));
  await visit('range-picker');const range=page.locator('#v2-range-live');
  assert.match(await range.locator('[data-picker-summary]').innerText(),/2026-09-25.*2026-10-06/);
  await range.locator('[data-date="2026-09-18"]').click();await range.locator('[data-date="2026-09-25"]').click();assert.match(await range.locator('[data-picker-error]').innerText(),/선택 불가/);assert.ok(await range.locator('[data-picker-apply]').isDisabled());
  await range.locator('[data-picker-cancel]').click();await range.locator('[data-picker-apply]').click();assert.match(await range.locator('[data-picker-applied]').innerText(),/2026-10-06/);
  await visit('time-picker');const time=page.locator('#v2-time-live');await time.locator('[data-time-hour]').selectOption('12');await time.locator('[data-time-minute]').selectOption('59');await time.locator('[data-time-period]').selectOption('오후');assert.match(await time.locator('[data-time-summary]').innerText(),/오후 12:59/);
  await time.locator('[data-picker-cancel]').click();assert.match(await time.locator('[data-time-summary]').innerText(),/오전 09:30/);
  await visit('attachment-picker');const demo=page.locator('[data-attachment-demo]');
  await demo.locator('[data-attachment-add]').click();assert.equal(await demo.locator('img').count(),1);
  await demo.locator('[data-attachment-remove]').click();assert.equal(await demo.locator('img').count(),0);await demo.locator('[data-attachment-restore]').click();assert.equal(await demo.locator('img').count(),1);
  const preview=page.locator('[data-attachment-state-demo]');await preview.locator('select').selectOption('uploading');assert.equal(await preview.getByRole('progressbar').getAttribute('aria-valuenow'),'40');await preview.locator('[data-attachment-cancel]').click();assert.equal(await preview.locator('img').count(),1);
  await page.locator('[data-viewer-open]').click();const viewer=page.locator('#v2-image-viewer-live');await viewer.locator('img').evaluate(img=>img.decode());
  await viewer.locator('[data-viewer-zoom]').click();assert.equal(await viewer.locator('.v2-image-viewer').getAttribute('data-view'),'zoom');assert.ok(await viewer.locator('.og-viewer-image').evaluate(node=>node.scrollWidth>node.clientWidth));await page.keyboard.press('Escape');await page.waitForFunction(()=>document.body.style.overflow==='');assert.ok(await page.locator('[data-viewer-open]').evaluate(node=>document.activeElement===node));
  assert.equal(await page.locator('input[type="file"]').count(),0);
  for(const width of [320,375,390,414,768,1024,1440]){
   await page.setViewportSize({width,height:1000});
   for(const hash of ['group-surfaces','quantity','bottom-sheet','group-date-time','group-attachments']){
    await visit(hash);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no document overflow '+width+' '+hash);
    const duplicate=await page.evaluate(()=>{const ids=[...document.querySelectorAll('[id]')].map(n=>n.id);return ids.filter((id,i)=>ids.indexOf(id)!==i);});assert.deepEqual(duplicate,[],'unique ids');
    assert.ok(await page.locator('.v2-component-section:visible :is(.v2-surface h3,.v2-surface p,.v2-quantity output,.v2-quantity-stage p,.v2-calendar strong,.v2-calendar .og-picker-summary,.v2-time-picker label,.v2-time-picker select,.v2-attachment-stage p)').evaluateAll(nodes=>{
     const canvas=document.createElement('canvas');canvas.width=canvas.height=1;const ctx=canvas.getContext('2d');
     const rgba=color=>{ctx.clearRect(0,0,1,1);ctx.fillStyle=color;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data];};
     const lum=c=>c.slice(0,3).map(x=>x/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((s,x,i)=>s+x*[.2126,.7152,.0722][i],0);
     return nodes.every(node=>{let parent=node,bg;while(parent){bg=rgba(getComputedStyle(parent).backgroundColor);if(bg[3]===255)break;parent=parent.parentElement;}const a=lum(rgba(getComputedStyle(node).color)),b=lum(bg);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05)>=4.5;});
    }),'new content text contrast '+width+' '+hash);
    if([320,375,390,414,768,1440].includes(width))await page.screenshot({path:'/private/tmp/og-final-five-'+hash+'-'+width+'.png',fullPage:true});
   }
  }
  await page.setViewportSize({width:390,height:400});await visit('bottom-sheet');await open.click();
  await sheet.locator('h2').evaluate(n=>n.textContent='긴 제목 검토 '.repeat(40));
  assert.ok(await sheet.locator('[data-sheet-apply]').evaluate(n=>{const r=n.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight;}));
  for(let i=0;i<12;i++){await page.keyboard.press('Tab');assert.ok(await sheet.evaluate(n=>n.contains(document.activeElement)),'focus stays in native modal');}await page.keyboard.press('Escape');
  await page.waitForFunction(()=>document.body.style.overflow==='');
  await page.evaluate(async()=>{
   const {setupOverlay}=await import('/v2/components/overlay.mjs');
   const modal=document.querySelector('#v2-sheet-sort'),button=document.querySelector('[data-sheet-open="v2-sheet-sort"]'),controller=setupOverlay(modal);
   controller.open(button);controller.close();controller.open(button);
  });
  await page.waitForTimeout(50);assert.equal(await page.evaluate(()=>document.body.style.overflow),'hidden');await page.keyboard.press('Escape');await page.waitForFunction(()=>document.body.style.overflow==='');
  await page.route('**/membership.png',route=>route.abort());await visit('group-attachments');
  await page.locator('[data-attachment-demo] [data-attachment-add]').click();
  await page.locator('[data-attachment-demo] [data-attachment-image-retry]').waitFor();
  assert.match(await page.locator('[data-attachment-demo] [data-attachment-message]').innerText(),/불러오지 못/);
  await page.locator('[data-viewer-open]').click();await page.locator('[data-viewer-retry]').waitFor();await page.locator('[data-viewer-retry]').focus();await page.locator('[data-viewer-retry]').click();
  assert.ok(await viewer.locator('[data-viewer-close]').evaluate(n=>document.activeElement===n),'retry leaves focus on stable close control');await page.keyboard.press('Escape');await page.waitForFunction(()=>document.body.style.overflow==='');
  await page.unroute('**/membership.png');await page.emulateMedia({reducedMotion:'reduce',forcedColors:'active'});await visit('group-date-time');assert.ok(await page.locator('#v2-date-live [data-date="2026-09-18"]').isVisible());
  await page.emulateMedia({reducedMotion:'no-preference',forcedColors:'none'});await page.route('**/*.{woff,woff2}',route=>route.abort());await page.setViewportSize({width:320,height:800});await visit('group-date-time');assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'font fallback fits');await page.unroute('**/*.{woff,woff2}');
  const touch=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true}),phone=await touch.newPage();await phone.goto(base+'/v2/components/#quantity');await phone.locator('#v2-quantity-live [data-quantity-plus]').tap();assert.equal(await phone.locator('#v2-quantity-live').getAttribute('data-value'),'2');await phone.goto(base+'/v2/components/#bottom-sheet');await phone.locator('[data-sheet-open="v2-sheet-sort"]').tap();await phone.locator('#v2-sheet-sort [data-sheet-close]').first().tap();assert.ok(await phone.locator('#v2-sheet-sort').isHidden());await touch.close();
  assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);assert.deepEqual(writes,[]);
  console.log('Final five: 7 widths, 44 entries, quantity boundaries/focus, sheet apply/cancel/focus/low height, date/range/time, attachment restore/cancel, viewer zoom/close, unique IDs, no HTTP/page errors passed.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
