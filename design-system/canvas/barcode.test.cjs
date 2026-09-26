const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto((process.env.PREVIEW_URL||'http://127.0.0.1:4173')+'/design-system/canvas/?canvas=barcode#barcode-main');
  await page.waitForFunction(()=>document.querySelector('#viewport')?.getAttribute('aria-busy')==='false');
  assert.equal(await page.locator('#barcode-main .og-barcode-screen').count(),4);
  assert.equal(await page.locator('#barcode-v2,#barcode-v3').count(),0);
  assert.equal(await page.locator('[data-review-go="board-barcode-main"]').count(),1);
  assert.doesNotMatch(await page.locator('#barcode-main').innerText(),/V[123]/);
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('og-design:review-status:v1'))['board-barcode-main']),'pending');
  assert.deepEqual(errors,[]);
  await page.addStyleTag({content:'html,body{margin:0;padding:0;overflow:clip!important;width:100%;height:auto}body{display:block!important}'});
  for(const width of [320,375,414,768]){
   await page.setViewportSize({width,height:820});
   for(const state of [{},{total:2400,available:0},{total:0,available:0},{loggedIn:false}]){
   await page.evaluate(async state=>{
    const {barcodeScreen}=await import('/design-system/pages/barcode/render.mjs');
    const temp=document.createElement('div');temp.innerHTML=barcodeScreen(state);
    document.body.replaceChildren(temp.querySelector('.og-barcode-screen'));await document.fonts.ready;
   },state);
   const result=await page.evaluate(()=>{
    const root=document.querySelector('.og-barcode-screen'),body=root.querySelector('.og-sheet-body'),bars=root.querySelector('.og-barcode-bars');
    const style=getComputedStyle(root.querySelector('.og-barcode-balance')||root.querySelector('.og-barcode-card'));
    return {background:style.backgroundColor,shadow:style.boxShadow,radius:style.borderRadius,bodyBackground:getComputedStyle(body).backgroundImage,fits:root.scrollWidth<=root.clientWidth+1&&body.scrollWidth<=body.clientWidth+1,disabled:root.querySelector('.og-barcode-actions button:last-child')?.disabled,receiptDisabled:root.querySelector('.og-barcode-actions button:first-child')?.disabled,height:bars.getBoundingClientRect().height,bodyFits:body.scrollHeight<=body.clientHeight+1,buttons:[...root.querySelectorAll('.og-barcode-actions button')].map(b=>({height:b.offsetHeight,fits:b.scrollWidth<=b.clientWidth+1}))};
   });
   assert.equal(result.background,'rgb(255, 255, 255)');assert.equal(result.radius,'20px');assert.notEqual(result.shadow,'none');assert.equal(result.bodyBackground,'none');
   assert.ok(result.fits,JSON.stringify({width,result}));assert.equal(result.height,112);assert.ok(result.bodyFits,JSON.stringify({width,result}));
   for(const b of result.buttons){assert.ok(b.height>=44);assert.ok(b.fits);}
   if(state.loggedIn!==false){assert.equal(result.disabled,state.available===0);assert.equal(result.receiptDisabled,false);}
   if(width===375)await page.screenshot({path:'/private/tmp/barcode-main-'+(state.loggedIn===false?'guest':state.total===0?'zero':state.total===2400?'low':'default')+'.png'});
   }
  }
  console.log('PASS Barcode: one unversioned board, four states, review pending, four widths, 112px bars, no clipping');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
