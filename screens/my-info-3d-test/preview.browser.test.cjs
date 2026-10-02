const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage();
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('response',response=>{if(response.status()>=400)errors.push(response.url()+':'+response.status());});
  for(const width of [320,375,414,768]){
   await page.setViewportSize({width,height:1024});
   await page.goto('http://127.0.0.1:4173/screens/my-info-3d-test/');
   await page.evaluate(()=>document.fonts.ready);
   await page.locator('.service-face img').evaluateAll(images=>Promise.all(images.map(image=>image.decode())));
   // Capture after decoded images have reached a painted frame, not just the decoder.
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no overflow at '+width);
   assert.equal(await page.locator('.service-face img').count(),6);
   assert.ok(await page.locator('.service-face img').evaluateAll(images=>images.every(image=>image.complete&&image.naturalWidth>0)));
   assert.ok(await page.evaluate(()=>{
    const title=document.querySelector('.mileage-title>div').getBoundingClientRect();
    const history=document.querySelector('.mileage-history').getBoundingClientRect();
    return title.right<=history.left;
   }),'balance title and history do not collide at '+width);
   const labels=await page.locator('.nav-item>span:last-child').evaluateAll(nodes=>nodes.map(node=>({height:node.getBoundingClientRect().height,line:Number.parseFloat(getComputedStyle(node).lineHeight)})));
   assert.ok(labels.every(label=>label.height<=label.line+1),'navigation remains single-line');
   // A settled screenshot also verifies the entire offscreen second menu row.
   await page.locator('.service-menu').scrollIntoViewIfNeeded();
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   await page.screenshot({path:'/private/tmp/my-info-3d-'+width+'.png',fullPage:true,animations:'disabled'});
  }
  const contrast=await page.evaluate(()=>{
   const canvas=document.createElement('canvas');canvas.width=canvas.height=1;
   const context=canvas.getContext('2d',{willReadFrequently:true});
   const tokens=getComputedStyle(document.documentElement);
   const luminance=key=>{
    context.fillStyle=tokens.getPropertyValue(key).trim();context.fillRect(0,0,1,1);
    const channels=[...context.getImageData(0,0,1,1).data].slice(0,3).map(value=>value/255).map(value=>value<=.04045?value/12.92:((value+.055)/1.055)**2.4);
    return channels.reduce((sum,value,index)=>sum+value*[.2126,.7152,.0722][index],0);
   };
   return [['--test-on-card','--test-card-top'],['--test-on-card-muted','--test-card-top'],['--test-muted','--test-page-bottom'],['--test-muted','--test-surface'],['--test-accent','--test-page-bottom']].map(([text,surface])=>{
    const a=luminance(text),b=luminance(surface);
    return {text,surface,ratio:(Math.max(a,b)+.05)/(Math.min(a,b)+.05)};
   });
  });
  assert.ok(contrast.every(pair=>pair.ratio>=4.5),JSON.stringify(contrast));
  const review=page.locator('.review-write');
  await review.click();
  assert.equal(await page.locator('#preview-dialog').evaluate(node=>node.open),true);
  assert.equal(await page.locator('#preview-title').textContent(),'후기 작성');
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#preview-dialog').evaluate(node=>node.open),false);
  assert.equal(await review.evaluate(node=>node===document.activeElement),true);
  await page.locator('.mileage-info').click();
  assert.match(await page.locator('#preview-copy').textContent(),/시안용 데이터/);
  await page.locator('.preview-close').click();
  assert.equal(await page.locator('#preview-dialog').evaluate(node=>node.open),false);
  assert.deepEqual(errors,[]);
  console.log('PASS: four responsive widths, six loaded assets, balance layout, navigation, preview dialog and focus restoration');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
