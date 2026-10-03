const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)errors.push(r.url()+':'+r.status());});
  page.on('request',r=>{if(!r.url().startsWith(base+'/'))errors.push('unexpected external request: '+r.url());});
  for(const width of [320,375,390,414,768,1440]){
   await page.setViewportSize({width,height:1200});await page.goto(`${base}/v2/home/`);
   await page.locator('.home-test').waitFor();await page.evaluate(()=>document.fonts.ready);
   await page.locator('.home-test img').evaluateAll(images=>Promise.all(images.map(image=>image.decode())));
   assert.equal(await page.locator('.home-test').count(),1);
   assert.equal(await page.locator('.my-info-test,.barcode-test,iframe,.mobile-status-bar,.mobile-home-indicator').count(),0);
   assert.equal(await page.locator('.v2-menu nav [aria-current]').textContent(),'홈화면');
   assert.ok(!(await page.locator('.v2-intro').innerText()).includes('승인'));
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no root overflow '+width);
   const geometry=await page.locator('.home-test').evaluate(n=>{
    const r=n.getBoundingClientRect(),controls=n.querySelector('.home-map-controls').getBoundingClientRect(),nav=n.querySelector('.bottom-navigation').getBoundingClientRect();
    const current=n.querySelector('.bottom-navigation [aria-current]'),face=current.querySelector('.nav-face').getBoundingClientRect(),line=getComputedStyle(current.lastElementChild,'::after');
    return {size:[r.width,r.height],controlsTop:controls.top-r.top,navBottom:r.bottom-nav.bottom,navHeight:nav.height,current:current.textContent.trim(),face:[face.width,face.height],line:[line.content,line.width,line.height],footer:getComputedStyle(n.querySelector('.home-map'),'::before').backgroundImage,font:getComputedStyle(n).fontFamily};
   });
   assert.deepEqual(geometry.size,[Math.min(width,390),846]);assert.equal(geometry.controlsTop,24);
   assert.equal(geometry.navBottom,20);assert.equal(geometry.navHeight,72);assert.equal(geometry.current,'홈');
   assert.deepEqual(geometry.face,[40,32]);assert.deepEqual(geometry.line,['""','20px','2px']);
   assert.match(geometry.footer,/linear-gradient/);assert.match(geometry.font,/OG V2 Pretendard/);
   assert.deepEqual(await page.locator('.home-map-ground').evaluate(n=>[n.naturalWidth,n.naturalHeight]),[1674,2000]);
   assert.ok(await page.locator('.home-art img').evaluateAll(nodes=>nodes.every(n=>n.naturalWidth===851&&n.naturalHeight===1847)),'original Figma sprite loads');
   assert.deepEqual(await page.locator('.barcode-art').evaluate(n=>[n.getBoundingClientRect().width,n.getBoundingClientRect().height]),[60,60]);
   assert.deepEqual(await page.locator('.home-category').evaluateAll(nodes=>nodes.map(n=>[n.getBoundingClientRect().width,n.getBoundingClientRect().height])),[[76,38],[72,38],[72,38],[72,38],[64,38]]);
   assert.ok(await page.locator('.home-map button').evaluateAll(nodes=>nodes.every(n=>{
    const r=n.getBoundingClientRect(),p=getComputedStyle(n,'::before');
    const extension=p.content==='none'?0:Math.max(0,-parseFloat(p.top))+Math.max(0,-parseFloat(p.bottom));
    return r.height+extension>=44;
   })),'small visuals retain 44px touch height');
   for(const category of ['중식','한식','전체']){
    await page.locator(`[data-category="${category}"]`).click();
    assert.equal(await page.locator('[data-category][aria-pressed="true"]').count(),1);
    assert.equal(await page.locator(`[data-category="${category}"]`).getAttribute('aria-pressed'),'true');
    assert.equal(await page.getByRole('dialog').isVisible(),false);
   }
   for(const label of ['현 위치','퀵적립','현 지도 위치 둘러보기','+ 더 보기','오시 망원본점 매장 보기','바코드','내 정보']){
    const button=page.locator('.home-test').getByRole('button',{name:label,exact:true});await button.click();
    assert.equal(await page.getByRole('dialog').isVisible(),true);await page.keyboard.press('Escape');
    assert.equal(await button.evaluate(n=>n.getRootNode().activeElement===n),true);
    assert.equal(await page.locator('.bottom-navigation [aria-current]').innerText(),'홈','preview clicks do not change the current screen');
   }
   const input=page.getByRole('searchbox',{name:'매장 검색',exact:true});await input.fill('오시');await input.press('Enter');
   assert.equal(await page.locator('#preview-title').innerText(),'매장 검색');await page.keyboard.press('Escape');
   assert.equal(await input.evaluate(n=>n.getRootNode().activeElement===n),true,'search restores input focus');
   await page.getByRole('button',{name:'매장 검색 실행',exact:true}).click();assert.equal(await page.getByRole('dialog').isVisible(),true);await page.keyboard.press('Escape');
   assert.equal(page.url(),`${base}/v2/home/`,'submit does not reload the route');
   if([390,1440].includes(width)){
    await page.reload();await page.locator('.home-test').waitFor();await page.evaluate(()=>document.fonts.ready);
    await page.locator('.home-test img').evaluateAll(images=>Promise.all(images.map(image=>image.decode())));
    await page.locator('.home-test').screenshot({path:`/private/tmp/og-v2-home-${width}.png`});
    await page.screenshot({path:`/private/tmp/og-v2-home-workspace-${width}.png`});
   }
  }
  await page.setViewportSize({width:1440,height:1600});
  assert.equal((await page.locator('.home-test').boundingBox()).height,846,'tall browser does not stretch the reference frame');
  assert.deepEqual(errors,[]);
  console.log('v2 home: original Naver map/sprites, 390x846, C navigation, 6 widths, category state, search/actions/focus, touch targets and no service requests passed');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
