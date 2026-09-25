const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto((process.env.PREVIEW_URL||'http://172.30.1.34:4173')+'/design-system/canvas/?canvas=barcode#barcode-main');
  await page.waitForFunction(()=>document.querySelector('#viewport')?.getAttribute('aria-busy')==='false');
  assert.equal(await page.locator('#barcode-main .og-barcode-screen').count(),4);
  assert.equal(await page.locator('[data-review-go="board-barcode-main"]').count(),1);
  const pending=await page.evaluate(()=>JSON.parse(localStorage.getItem('og-design:review-status:v1'))['board-barcode-main']);
  assert.equal(pending,'pending');
  assert.deepEqual(errors,[]);
  await page.addStyleTag({content:'html,body{margin:0;padding:0;overflow:clip!important;width:100%;height:auto}body{display:block!important}'});
  for(const width of [320,375,414,768]){
   await page.setViewportSize({width,height:820});
   for(const state of [{},{total:2400,available:0},{total:0,available:0},{loggedIn:false}]){
    await page.evaluate(async state=>{
     const {barcodeScreen}=await import('/design-system/pages/barcode/render.mjs');
     document.body.innerHTML=barcodeScreen(state);await document.fonts.ready;
    },state);
    const result=await page.evaluate(()=>{
     const root=document.querySelector('.og-barcode-screen'),panel=root.querySelector('.og-sheet-panel'),body=panel.querySelector('.og-sheet-body');
     return {fits:root.scrollWidth<=root.clientWidth+1&&body.scrollWidth<=body.clientWidth+1,
      bottom:panel.getBoundingClientRect().bottom,
      buttons:[...root.querySelectorAll('.og-barcode-actions button')].map(n=>({height:n.getBoundingClientRect().height,scroll:n.scrollWidth,width:n.clientWidth})),
      text:root.querySelector('.og-barcode-content').innerText};
    });
    assert.ok(result.fits,JSON.stringify({width,state,result}));
    assert.ok(result.bottom<=801);
    for(const b of result.buttons){assert.ok(b.height>=44);assert.ok(b.scroll<=b.width+1);}
    if(width===375)await page.screenshot({path:'/private/tmp/barcode-'+(state.loggedIn===false?'guest':state.total===0?'zero':state.total===2400?'low':'default')+'.png'});
   }
  }
  console.log('PASS barcode: 4 states x 4 widths, pending review, bounds, buttons, no page errors');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
