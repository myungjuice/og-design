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
   await page.setViewportSize({width,height:1200});await page.goto(`${base}/v2/barcode/`);
   await page.locator('.barcode-test').waitFor();await page.evaluate(()=>document.fonts.ready);
   await page.locator('.barcode-test img').evaluateAll(images=>Promise.all(images.map(image=>image.decode())));
   assert.equal(await page.locator('.barcode-test').count(),1);
   assert.equal(await page.locator('.my-info-test,.home-test,iframe,.mobile-status-bar,.mobile-home-indicator').count(),0);
   assert.equal(await page.locator('.v2-menu nav [aria-current]').textContent(),'바코드');
   assert.ok(!(await page.locator('.v2-intro').innerText()).includes('승인'));
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no root overflow '+width);
   const frame=await page.locator('.barcode-test').boundingBox();
   assert.equal(frame.width,Math.min(width,390));assert.equal(frame.height,846);
   const geometry=await page.locator('.barcode-test').evaluate(n=>{
    const frame=n.getBoundingClientRect(),sheet=n.querySelector('.barcode-sheet').getBoundingClientRect(),code=n.querySelector('.barcode-code'),r=code.getBoundingClientRect(),card=code.closest('.barcode-code-card').getBoundingClientRect();
    const bars=[...code.querySelectorAll('rect')].map(n=>n.getBoundingClientRect());
    return {top:sheet.top-frame.top,bottom:frame.bottom-sheet.bottom,overflow:n.scrollWidth>n.clientWidth,barHeight:r.height,quiet:[bars[0].left-card.left,card.right-bars.at(-1).right],filter:getComputedStyle(code).filter,font:getComputedStyle(n).fontFamily};
   });
   assert.ok(geometry.top>0);assert.equal(geometry.bottom,0);assert.equal(geometry.overflow,false);
   assert.equal(geometry.barHeight,96);assert.ok(geometry.quiet.every(v=>v>=24));assert.equal(geometry.filter,'none');assert.match(geometry.font,/OG V2 Pretendard/);
   assert.ok(await page.locator('.barcode-actions button').evaluateAll(nodes=>nodes.every(n=>{const r=n.getBoundingClientRect();return r.width>=44&&r.height>=44&&n.scrollWidth<=n.clientWidth;})),'scan actions remain touch-safe');
   for(const action of ['마일리지 안내','내역보기','영수증 적립','마일리지 사용','마일리지 적립/사용 안내']){
    const button=page.locator('.barcode-test').getByRole('button',{name:action,exact:true});await button.click();
    assert.equal(await page.getByRole('dialog').isVisible(),true);await page.keyboard.press('Escape');
    assert.equal(await button.evaluate(n=>n.getRootNode().activeElement===n),true,'dialog restores focus');
   }
   await page.getByRole('button',{name:'바코드 닫기',exact:true}).click();
   assert.equal(await page.locator('.barcode-sheet').isVisible(),false);
   assert.equal(await page.locator('.barcode-sheet-scrim').isVisible(),false);
   assert.equal(await page.getByRole('button',{name:'바코드 다시 보기',exact:true}).evaluate(n=>n.getRootNode().activeElement===n),true);
   await page.getByRole('button',{name:'바코드 다시 보기',exact:true}).click();
   assert.equal(await page.locator('.barcode-sheet').isVisible(),true);
   assert.equal(await page.getByRole('button',{name:'바코드 닫기',exact:true}).evaluate(n=>n.getRootNode().activeElement===n),true);
   if([390,1440].includes(width))await page.locator('.barcode-test').screenshot({path:`/private/tmp/og-v2-barcode-${width}.png`});
   const cardStyle=n=>{const r=n.getBoundingClientRect(),cs=getComputedStyle(n);return [r.width,r.height,cs.padding,cs.borderRadius,cs.backgroundColor,cs.boxShadow,n.innerHTML];};
   const barcodeCard=await page.locator('.mileage-card').evaluate(cardStyle);
   await page.goto(`${base}/v2/my-info/`);await page.locator('.mileage-card').waitFor();
   assert.deepEqual(await page.locator('.mileage-card').evaluate(cardStyle),barcodeCard,'same shared mileage markup and material as My Info '+width);
   assert.equal(await page.locator('.v2-intro').innerText(),'마일리지와 최근 방문 내역, 주요 메뉴를 한눈에 확인하는 화면입니다.');
   await page.goto(`${base}/v2/barcode/`);await page.locator('.barcode-test').waitFor();
   await page.evaluate(async()=>{
    const {renderBarcodeScreen}=await import('/v2/barcode/render.mjs');
    const shadow=document.querySelector('.v2-screen-host').shadowRoot;
    shadow.querySelector('.barcode-test').outerHTML=renderBarcodeScreen({available:0,total:2400,shared:0,sharedCount:0});
   });
   const use=page.getByRole('button',{name:'마일리지 사용',exact:true});
   assert.equal(await use.isDisabled(),true);assert.equal(await page.getByRole('button',{name:'영수증 적립',exact:true}).isEnabled(),true);
   assert.equal(await page.locator('.barcode-empty-hint').isVisible(),true);
   assert.equal(await use.getAttribute('aria-describedby'),'barcode-empty-hint');
   assert.ok(await page.locator('.barcode-sheet').evaluate(n=>n.scrollHeight<=n.clientHeight),'zero-balance explanation fits '+width);
   await use.evaluate(n=>n.click());assert.equal(await page.getByRole('dialog').isVisible(),false);
   await page.getByRole('button',{name:'영수증 적립',exact:true}).click();assert.equal(await page.getByRole('dialog').isVisible(),true);await page.keyboard.press('Escape');
  }
  assert.deepEqual(errors,[]);
  console.log('v2 barcode: shared sheet/mileage, original scan geometry, 390x846, 6 widths, zero balance, close/reopen, dialogs/focus, simple screen descriptions passed');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
