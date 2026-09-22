const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1300}});
  for(const [canvas,source] of [['my-info','my-info-main'],['explore','home-main'],['store','home-store']]){
   await page.goto('http://127.0.0.1:4173/design-system/canvas/?canvas='+canvas);
   await page.waitForFunction(()=>document.querySelector('#viewport')?.getAttribute('aria-busy')==='false');
   const id='review-surface-'+canvas;
   assert.equal(await page.locator('#'+id).count(),1,'one new example must be present on '+canvas);
   const result=await page.evaluate(({id,source})=>{
    const example=document.getElementById(id),original=document.getElementById(source);
    const art=example.querySelector('.screen-artboard'),sourceArt=original.querySelector('.screen-artboard');
    return {above:[...document.querySelectorAll('#world > .screen-page')].filter(n=>n!==example&&n.offsetLeft>=0).every(n=>example.offsetTop+example.offsetHeight<n.offsetTop),same:art.textContent===sourceArt.textContent,contained:example.offsetLeft+example.offsetWidth<=document.querySelector('.system-region').offsetWidth,review:example.querySelector('[data-review-set="pending"]')?.getAttribute('aria-pressed')};
   },{id,source});
   assert.deepEqual(result,{above:true,same:true,contained:true,review:'true'});
   await page.locator('#review-toggle').click();
   assert.equal(await page.locator('[data-review-go="surface-'+canvas+'"]').count(),1);
   await page.locator('[data-review-go="surface-'+canvas+'"]').click();
   await page.waitForTimeout(200);
   await page.locator('#'+id+' .screen-page-content').screenshot({path:'/private/tmp/og-surface-'+canvas+'.png'});
  }
  console.log('PASS: three top examples, unchanged content, region containment and pending review navigation');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
