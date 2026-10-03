const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('response',response=>{if(response.status()>=400)errors.push(response.url()+':'+response.status());});
  for(const width of [320,375,390,414,768,1100,1440]){
   await page.setViewportSize({width,height:1150});
   await page.goto('http://127.0.0.1:4173/screens/my-info-3d-test/');
   assert.equal(await page.locator('.barcode-test').count(),1,'one barcode screen appears beside the existing previews');
   await page.evaluate(()=>document.fonts.ready);
   await page.locator('img').evaluateAll(images=>Promise.all(images.map(image=>image.decode())));
   const frame=await page.locator('.barcode-test').boundingBox();
   assert.equal(frame.height,846);assert.equal(frame.width,Math.min(width,390));
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no root overflow at '+width);
   const cards=await page.locator('.my-info-test .mileage-card,.barcode-test .mileage-card').evaluateAll(nodes=>nodes.map(node=>{
    const r=node.getBoundingClientRect(),s=getComputedStyle(node),g=node.querySelector('.mileage-graph').getBoundingClientRect();
    return {width:r.width,height:r.height,padding:s.padding,radius:s.borderRadius,color:s.color,background:s.backgroundColor,shadow:s.boxShadow,graph:[g.width,g.height],html:node.innerHTML};
   }));
   assert.deepEqual(cards[0],cards[1],'same data, assets, geometry and material in both mileage cards');
   assert.ok(await page.locator('.barcode-test').evaluate(node=>node.scrollHeight<=node.clientHeight),'no internally clipped content');
   assert.ok(await page.locator('.barcode-sheet').evaluate(node=>{
    const r=node.getBoundingClientRect(),s=node.closest('.barcode-test').getBoundingClientRect();
    return r.top>s.top&&r.bottom<=s.bottom+.1;
   }),'sheet overlays home with the original bottom-sheet flow');
   assert.ok(await page.locator('.barcode-test .barcode-code').evaluate(node=>{
    const code=node.getBoundingClientRect(),card=node.closest('.barcode-code-card').getBoundingClientRect(),style=getComputedStyle(node),bars=[...node.querySelectorAll('rect')].map(bar=>bar.getBoundingClientRect());
    return code.height===96&&bars[0].left>=card.left+24&&bars.at(-1).right<=card.right-24&&style.filter==='none';
   }),'barcode has a compact 96px, unfiltered scan region with unchanged quiet space');
   assert.ok(await page.locator('.barcode-code-card').evaluate(node=>{
    const card=node.getBoundingClientRect(),number=node.querySelector('.barcode-member-number').getBoundingClientRect(),actions=node.querySelector('.barcode-actions').getBoundingClientRect();
    return card.height<=274&&Math.abs(actions.top-number.bottom-16)<.1;
   }),'barcode holder stays compact with a 16px number-to-actions gap');
   assert.equal(await page.locator('.barcode-test .mobile-status-bar,.barcode-test .mobile-home-indicator').count(),0);
   assert.ok(await page.locator('.barcode-actions button').evaluateAll(buttons=>buttons.every(button=>{
    const r=button.getBoundingClientRect(),text=document.createRange();text.selectNodeContents(button);
    return r.height>=44&&r.width>=44&&text.getClientRects().length===1&&text.getBoundingClientRect().height<=parseFloat(getComputedStyle(button).lineHeight)+1&&button.scrollWidth<=button.clientWidth;
   })),'touch-safe single-line payment actions');
   if(width===1440){
    const home=await page.locator('.home-test').boundingBox();
    assert.ok(frame.x>=home.x+home.width);assert.equal(frame.y,home.y);
    await page.screenshot({path:'/private/tmp/og-three-3d-screens.png',fullPage:true,animations:'disabled'});
   }
   await page.locator('.barcode-test').screenshot({path:'/private/tmp/og-barcode-3d-'+width+'.png',animations:'disabled'});
   await page.evaluate(async()=>{
    const {renderBarcodeTest}=await import('/screens/my-info-3d-test/render.mjs');
    const template=document.createElement('template');template.innerHTML=renderBarcodeTest({available:0,total:2400,shared:0});
    document.querySelector('.barcode-test').replaceWith(template.content.firstElementChild);
   });
   assert.equal(await page.locator('.barcode-test [data-preview="마일리지 사용"]').isDisabled(),true);
   assert.equal(await page.locator('.barcode-test [data-preview="영수증 적립"]').isEnabled(),true);
   assert.ok(await page.locator('.barcode-test').evaluate(node=>{
    const frame=node.getBoundingClientRect(),sheet=node.querySelector('.barcode-sheet').getBoundingClientRect(),hint=node.querySelector('.barcode-empty-hint').getBoundingClientRect();
    return node.scrollHeight<=node.clientHeight&&sheet.top>=frame.top&&hint.left>=frame.left&&hint.right<=frame.right&&hint.bottom<=frame.bottom;
   }),'empty balance explanation fits at '+width);
  }
  await page.goto('http://127.0.0.1:4173/screens/my-info-3d-test/');
  for(const action of ['영수증 적립','마일리지 사용','마일리지 적립/사용 안내']){
   const trigger=page.locator('.barcode-test [data-preview="'+action+'"]');await trigger.click();
   assert.equal(await page.locator('#preview-title').textContent(),action);await page.keyboard.press('Escape');
   assert.equal(await trigger.evaluate(node=>node===document.activeElement),true);
  }
  const contrast=await page.evaluate(()=>{
   const context=document.createElement('canvas').getContext('2d',{willReadFrequently:true}),root=getComputedStyle(document.documentElement);
   const luminance=color=>{context.fillStyle=color;context.fillRect(0,0,1,1);return [...context.getImageData(0,0,1,1).data].slice(0,3).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);};
   const ratio=(a,b)=>(Math.max(luminance(a),luminance(b))+.05)/(Math.min(luminance(a),luminance(b))+.05);
   return [
    ['use-lit','.barcode-use','--home-selected-lit'],['use-face','.barcode-use','--home-selected-face'],
    ['earn','.barcode-earn','--test-surface'],['guide','.barcode-guide','--test-page-bottom'],
    ['code','.barcode-member-number','--test-surface']
   ].map(([name,selector,token])=>({name,ratio:ratio(getComputedStyle(document.querySelector(selector)).color,root.getPropertyValue(token).trim())}));
  });
  assert.ok(contrast.every(pair=>pair.ratio>=4.5),'barcode readable text contrast: '+JSON.stringify(contrast));
  await page.locator('.barcode-close').click();
  assert.equal(await page.locator('.barcode-sheet').isVisible(),false);
  assert.equal(await page.locator('.barcode-reopen').evaluate(node=>node===document.activeElement),true);
  await page.locator('.barcode-reopen').click();
  assert.equal(await page.locator('.barcode-sheet').isVisible(),true);
  assert.equal(await page.locator('.barcode-close').evaluate(node=>node===document.activeElement),true);
  await page.evaluate(async()=>{
   const {renderBarcodeTest}=await import('/screens/my-info-3d-test/render.mjs');
   const template=document.createElement('template');template.innerHTML=renderBarcodeTest({available:0,total:2400,shared:0});
   document.querySelector('.barcode-test').replaceWith(template.content.firstElementChild);
  });
  const use=page.locator('.barcode-test [data-preview="마일리지 사용"]');
  assert.equal(await use.isDisabled(),true);assert.equal(await page.locator('.barcode-empty-hint').isVisible(),true);
  assert.ok(await page.locator('.barcode-test').evaluate(node=>node.scrollHeight<=node.clientHeight),'empty balance explanation fits the same frame');
  assert.ok(await page.locator('.barcode-sheet').evaluate(node=>node.getBoundingClientRect().top>=node.closest('.barcode-test').getBoundingClientRect().top),'empty explanation never pushes the sheet outside the screen');
  await use.evaluate(node=>node.click());assert.equal(await page.locator('#preview-dialog').evaluate(node=>node.open),false);
  await page.locator('.barcode-test [data-preview="영수증 적립"]').click();
  assert.equal(await page.locator('#preview-title').textContent(),'영수증 적립');await page.keyboard.press('Escape');
  assert.deepEqual(errors,[]);
  console.log('PASS: three-screen comparison, shared mileage materials, seven widths, compact quiet barcode, disabled use, preview actions and sheet focus');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
