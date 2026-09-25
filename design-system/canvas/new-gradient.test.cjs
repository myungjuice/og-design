const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4173/design-system/canvas/?canvas=explore#home-new-gradient');
  await page.waitForFunction(()=>document.querySelector('#viewport')?.getAttribute('aria-busy')==='false');
  assert.equal(await page.locator('#home-new-gradient .og-map-new').count(),1);
  assert.equal(await page.locator('#home-main .og-map-new').evaluate(n=>getComputedStyle(n).backgroundImage),'none');
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('og-design:review-status:v1'))['board-home-new-gradient']),'pending');
  assert.deepEqual(errors,[]);
  await page.addStyleTag({content:'html,body{margin:0;padding:0;overflow:clip!important;width:100%;height:auto}body{display:block!important}'});
  for(const width of [320,375,414,768]){
   await page.setViewportSize({width,height:900});
   await page.evaluate(async()=>{
    const {newGradientBoard}=await import('/design-system/pages/home/new-gradient.mjs');
    const temp=document.createElement('div');temp.innerHTML=newGradientBoard();
    document.body.replaceChildren(temp.querySelector('.screen-artboard'));
    document.querySelector('.screen-artboard').style.width='100%';await document.fonts.ready;
   });
   const result=await page.locator('.og-map-new').evaluate(n=>{
    const s=getComputedStyle(n),r=n.getBoundingClientRect();
    return {bg:s.backgroundImage,color:s.color,fits:n.scrollWidth<=n.clientWidth+1,inBounds:r.left>=0&&r.right<=innerWidth};
   });
   assert.ok(result.bg.includes('linear-gradient'));assert.equal(result.color,'rgb(255, 255, 255)');assert.ok(result.fits&&result.inBounds);
   if(width===375)await page.screenshot({path:'/private/tmp/new-gradient.png'});
  }
  console.log('PASS: original blue preserved, one NEW comparison, pending review, four widths, no page errors');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
