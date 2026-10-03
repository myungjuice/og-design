const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage();const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('response',response=>{if(response.status()>=400)errors.push(response.url()+':'+response.status());});
  for(const width of [320,375,390,414,768,1100]){
   await page.setViewportSize({width,height:1024});
   await page.goto('http://127.0.0.1:4173/screens/my-info-3d-test/');
   await page.evaluate(()=>document.fonts.ready);
   await page.locator('img').evaluateAll(images=>Promise.all(images.map(image=>image.decode())));
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no root overflow at '+width);
   const info=await page.locator('.my-info-test').boundingBox(),home=await page.locator('.home-test').boundingBox();
   if(width>=900){assert.ok(home.x>=info.x+info.width);assert.equal(home.y,info.y);}
   else assert.ok(home.y>=info.y+info.height,'stacked screens at '+width);
   assert.deepEqual(await page.locator('.home-map-ground').evaluate(image=>[image.naturalWidth,image.naturalHeight]),[1674,2000]);
   assert.ok(await page.locator('.home-test .home-art img').evaluateAll(images=>images.every(image=>image.complete&&image.naturalWidth===851&&image.naturalHeight===1847)));
   assert.equal(await page.locator('.home-test .barcode-art img').count(),1);
   assert.equal(await page.locator('.home-test [aria-current="page"]').textContent(),'홈');
   assert.equal(await page.locator('.my-info-test [aria-current="page"]').textContent(),'내 정보');
   assert.ok(await page.locator('.home-map button').evaluateAll(buttons=>buttons.every(button=>{
    const box=button.getBoundingClientRect(),extra=getComputedStyle(button,'::before');
    const extension=extra.content!=='none'?Math.max(0,-parseFloat(extra.top))+Math.max(0,-parseFloat(extra.bottom)):0;
    return box.height+extension>=44;
   })),'44px home touch targets including slim visual-chip extensions at '+width);
   assert.ok(await page.locator('.home-test .nav-item>span:last-child,.home-category>span:last-child,.home-explore>span:last-child').evaluateAll(nodes=>nodes.every(node=>node.getBoundingClientRect().height<=Number.parseFloat(getComputedStyle(node).lineHeight)+1)),'single line actions at '+width);
   await page.locator('.home-test').screenshot({path:'/private/tmp/og-home-3d-'+width+'.png',animations:'disabled'});
   if(width===1100)await page.screenshot({path:'/private/tmp/og-home-pair-1100.png',fullPage:true,animations:'disabled'});
  }
  // A tall browser window must not stretch either reference screen into empty space.
  const compact=await page.locator('.my-info-test,.home-test').evaluateAll(nodes=>nodes.map(node=>node.getBoundingClientRect().height));
  await page.setViewportSize({width:1100,height:1300});
  const tall=await page.locator('.my-info-test,.home-test').evaluateAll(nodes=>nodes.map(node=>node.getBoundingClientRect().height));
  assert.deepEqual(tall,compact,'screen height is independent of browser height');
  assert.equal(tall[1],846,'home uses the reference screen height');
  await page.setViewportSize({width:1100,height:1024});
  const contrast=await page.evaluate(()=>{
   const style=getComputedStyle(document.documentElement),context=document.createElement('canvas').getContext('2d',{willReadFrequently:true});
   const luminance=key=>{
    context.fillStyle=style.getPropertyValue(key).trim();context.fillRect(0,0,1,1);
    return [...context.getImageData(0,0,1,1).data].slice(0,3).map(value=>value/255).map(value=>value<=.04045?value/12.92:((value+.055)/1.055)**2.4).reduce((sum,value,index)=>sum+value*[.2126,.7152,.0722][index],0);
   };
   return [['--test-on-card','--home-selected-lit'],['--test-on-card','--home-selected-face'],['--home-action','--test-page-bottom'],['--home-muted','--test-page-bottom'],['--home-ink','--test-page-bottom']].map(([a,b])=>({a,b,ratio:(Math.max(luminance(a),luminance(b))+.05)/(Math.min(luminance(a),luminance(b))+.05)}));
  });
  assert.ok(contrast.every(pair=>pair.ratio>=4.5),'home small-text contrast: '+JSON.stringify(contrast));
  await page.locator('[data-category="중식"]').click();
  assert.equal(await page.locator('[data-category="중식"]').getAttribute('aria-pressed'),'true');
  assert.equal(await page.locator('[data-category][aria-pressed="true"]').count(),1);
  const locate=page.locator('.home-locate');await locate.click();
  assert.equal(await page.locator('#preview-title').textContent(),'현 위치');
  assert.match(await page.locator('#preview-copy').textContent(),/실제 서비스에 연결되지 않았습니다/);
  await page.keyboard.press('Escape');assert.equal(await locate.evaluate(node=>node===document.activeElement),true);
  await page.locator('#home-store-search').fill('오시');await page.locator('#home-store-search').press('Enter');
  assert.equal(await page.locator('#preview-title').textContent(),'매장 검색');await page.keyboard.press('Escape');
  await page.locator('.home-quick').click();assert.equal(await page.locator('#preview-title').textContent(),'퀵적립');await page.keyboard.press('Escape');
  await page.locator('.home-store-pin').first().click();assert.equal(await page.locator('#preview-title').textContent(),'오시 망원본점');await page.keyboard.press('Escape');
  assert.deepEqual(errors,[]);
  console.log('PASS: Naver map, original icon crops, two-screen layout, six widths, touch targets, categories, search and preview focus');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
