const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto((process.env.PREVIEW_URL||'http://127.0.0.1:4173')+'/design-system/canvas/?canvas=barcode#barcode-v3');
  await page.waitForFunction(()=>document.querySelector('#viewport')?.getAttribute('aria-busy')==='false');
  assert.equal(await page.locator('#barcode-main .og-barcode-screen').count(),4);
  assert.equal(await page.locator('#barcode-v3 .og-barcode-screen').count(),1);
  assert.ok(await page.evaluate(()=>document.querySelector('#barcode-v3').offsetLeft>document.querySelector('#barcode-main').offsetLeft));
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('og-design:review-status:v1'))['board-barcode-v3']),'pending');
  assert.deepEqual(errors,[]);
  await page.addStyleTag({content:'html,body{margin:0;padding:0;overflow:clip!important;width:100%;height:auto}body{display:block!important}'});
  for(const width of [320,375,414,768]){
   await page.setViewportSize({width,height:820});
   await page.evaluate(async()=>{
    const {barcodeV3Board}=await import('/design-system/pages/barcode/v3.mjs');
    const temp=document.createElement('div');temp.innerHTML=barcodeV3Board();
    document.body.replaceChildren(temp.querySelector('.og-barcode-screen'));await document.fonts.ready;
   });
   const result=await page.evaluate(()=>{
    const root=document.querySelector('.og-barcode-screen'),body=root.querySelector('.og-sheet-body'),bars=root.querySelector('.og-barcode-bars');
    const style=getComputedStyle(root.querySelector('.og-barcode-balance'));
    return {background:style.backgroundColor,shadow:style.boxShadow,radius:style.borderRadius,bodyBackground:getComputedStyle(body).backgroundImage,fits:root.scrollWidth<=root.clientWidth+1&&body.scrollWidth<=body.clientWidth+1,height:bars.getBoundingClientRect().height,bodyFits:body.scrollHeight<=body.clientHeight+1,buttons:[...root.querySelectorAll('.og-barcode-actions button')].map(b=>({height:b.offsetHeight,fits:b.scrollWidth<=b.clientWidth+1}))};
   });
   assert.equal(result.background,'rgb(255, 255, 255)');assert.equal(result.radius,'20px');assert.notEqual(result.shadow,'none');assert.equal(result.bodyBackground,'none');
   assert.ok(result.fits,JSON.stringify({width,result}));assert.equal(result.height,112);assert.ok(result.bodyFits,JSON.stringify({width,result}));
   for(const b of result.buttons){assert.ok(b.height>=44);assert.ok(b.fits);}
   if(width===375)await page.screenshot({path:'/private/tmp/barcode-v3.png'});
  }
  console.log('PASS V3: one screen, right of original, review pending, four widths, 112px bars, no clipping');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
