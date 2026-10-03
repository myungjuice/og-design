const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage();
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('response',response=>{if(response.status()>=400)errors.push(response.url()+':'+response.status());});
  for(const width of [320,375,390,414,768]){
   await page.setViewportSize({width,height:1024});
   await page.goto('http://127.0.0.1:4173/screens/my-info-3d-test/');
   await page.evaluate(()=>document.fonts.ready);
   await page.locator('.my-info-test img').evaluateAll(images=>Promise.all(images.map(image=>image.decode())));
   // Capture after decoded images have reached a painted frame, not just the decoder.
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no overflow at '+width);
   assert.equal(await page.locator('.service-face img').count(),6);
   assert.ok(await page.locator('.service-face img').evaluateAll(images=>images.every(image=>image.complete&&image.naturalWidth>0)));
   assert.deepEqual(await page.locator('.m-coin').evaluate(image=>[image.naturalWidth,image.naturalHeight]),[48,48]);
   assert.equal(await page.locator('.m-coin').evaluate(image=>getComputedStyle(image).borderRadius),'50%','mask the exported background outside the circular M coin');
   assert.ok(await page.locator('.visit-symbol img').evaluateAll(images=>images.every(image=>image.getBoundingClientRect().width===32&&image.getBoundingClientRect().height===32)));
   assert.equal(await page.locator('.review-write img').evaluate(image=>image.getBoundingClientRect().width),16);
   assert.equal(await page.locator('.profile-avatar img').count(),2,'original layered Figma profile');
   assert.equal(await page.locator('.profile-avatar').evaluate(node=>node.getBoundingClientRect().width),60);
   assert.ok(await page.locator('.header-actions .icon-button').evaluateAll(buttons=>{
    const [a,b]=buttons.map(n=>n.getBoundingClientRect());
    return a.width>=44&&a.height>=44&&b.width>=44&&b.height>=44&&a.right<=b.left;
   }),'header touch targets do not overlap');
   const graph=await page.evaluate(()=>{
    const rect=selector=>{const r=document.querySelector(selector).getBoundingClientRect();return {left:r.left,right:r.right,width:r.width,height:r.height,top:r.top};};
    return {track:rect('.mileage-graph'),fill:rect('.graph-available'),held:rect('.graph-held'),marker:rect('.graph-marker'),gradient:getComputedStyle(document.querySelector('.graph-available')).backgroundImage};
   });
   assert.equal(graph.marker.width,20);
   assert.ok(graph.marker.right<=graph.fill.right+1.1,'entire white marker belongs inside lit fill');
   assert.match(graph.gradient,/90deg|to right/,'gradient must run left to right');
   if(width===390){
    assert.deepEqual(await page.locator('.header-actions img').evaluateAll(images=>images.map(n=>{const r=n.getBoundingClientRect();return r.x+r.width/2;})),[320,360]);
    const card=await page.locator('.mileage-card').boundingBox();
    assert.equal(card.width,350);assert.equal(card.height,228);assert.equal(card.y,156);
    assert.equal(graph.track.width,310);assert.equal(graph.track.height,20);
    assert.equal(graph.fill.width,164);assert.equal(graph.held.width,189);
    assert.equal(graph.marker.left-graph.track.left,145);
    assert.equal(await page.locator('.mileage-info img').evaluate(node=>node.getBoundingClientRect().width),10);
   }
   const regions=await page.locator('.service-art').evaluateAll(nodes=>nodes.map(node=>{
    const image=node.querySelector('img'),box=node.getBoundingClientRect(),style=getComputedStyle(node);
    return {name:node.dataset.art,width:box.width,height:box.height,natural:[image.naturalWidth,image.naturalHeight],crop:[style.getPropertyValue('--art-left'),style.getPropertyValue('--art-top')],clip:style.overflow};
   }));
   const slotSize=width<=352?72:80;
   assert.ok(regions.every(region=>region.width===slotSize&&region.height===slotSize&&region.clip==='clip'),'square clipping region at '+width);
   assert.ok(regions.every(region=>region.natural.join(',')==='384,256'));
   assert.equal(new Set(regions.map(region=>region.crop.join(','))).size,6);
   assert.deepEqual(regions.map(region=>region.name),['receipt','bell','membership','support','settings','account']);
   assert.ok(await page.locator('.review-button,.recent-heading .icon-button').evaluateAll(buttons=>buttons.every(button=>{
    const box=button.getBoundingClientRect(),x=box.x+box.width/2;
    return [box.top-4,box.bottom+4].every(y=>document.elementFromPoint(x,y)?.closest('button')===button);
   })),'small recent-visit buttons retain independent expanded hit areas at '+width);
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
  // The small pencil pill retains its appearance but has a 44px touch target.
  const reviewHit=await review.evaluate(node=>{
   const box=node.getBoundingClientRect();return {x:box.x+box.width/2,y:box.top-4};
  });
  await page.mouse.click(reviewHit.x,reviewHit.y);
  assert.equal(await page.locator('#preview-dialog').evaluate(node=>node.open),true);
  assert.equal(await page.locator('#preview-title').textContent(),'후기 작성');
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#preview-dialog').evaluate(node=>node.open),false);
  assert.equal(await review.evaluate(node=>node===document.activeElement),true);
  await page.locator('.mileage-info').click();
  assert.match(await page.locator('#preview-copy').textContent(),/시안용 데이터/);
  await page.locator('.preview-close').click();
  assert.equal(await page.locator('#preview-dialog').evaluate(node=>node.open),false);
  // Verify real CSS geometry for zero/tiny/full values, not only HTML percentages.
  for(const amount of [0,1,20000]){
   await page.evaluate(async amount=>{
    const {renderMyInfoTest}=await import('/screens/my-info-3d-test/render.mjs');
    const template=document.createElement('template');template.innerHTML=renderMyInfoTest({available:amount,total:amount,shared:0});
    document.querySelector('.mileage-card').replaceWith(template.content.querySelector('.mileage-card'));
   },amount);
   const bounds=await page.evaluate(()=>{
    const r=selector=>document.querySelector(selector).getBoundingClientRect();
    const track=r('.mileage-graph'),fill=r('.graph-available'),marker=r('.graph-marker');
    return {trackRight:track.right,fillRight:fill.right,fillWidth:fill.width,markerRight:marker.right,hidden:document.querySelector('.graph-marker').hidden};
   });
   assert.ok(bounds.fillRight<=bounds.trackRight+.1,'filled bar stays inside track');
   if(amount===0){assert.equal(bounds.fillWidth,0);assert.equal(bounds.hidden,true);}
   else{assert.equal(bounds.hidden,false);assert.ok(bounds.markerRight<=bounds.fillRight+1.1,'edge value marker remains contained');}
  }
  assert.deepEqual(errors,[]);
  console.log('PASS: five responsive widths, original layered profile, exact 350×228 mileage card, horizontal gradient/contained marker, six sprite crops, navigation, dialogs and focus');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
