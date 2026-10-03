const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)errors.push(r.url()+':'+r.status());});
  for(const width of [320,375,390,414,768,1440]){
   await page.setViewportSize({width,height:1200});await page.goto(`${base}/v2/my-info/`);
   await page.locator('.v2-nav-sample').first().waitFor();await page.evaluate(()=>document.fonts.ready);
   await page.locator('.v2-nav-sample img').evaluateAll(images=>Promise.all(images.map(image=>image.decode())));
   assert.equal(await page.locator('.my-info-test').count(),1);
   assert.equal(await page.locator('.v2-nav-sample').count(),3);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no page overflow '+width);
   const primary=page.locator('.my-info-test');
   const original=await primary.locator('.bottom-navigation').evaluate(n=>n.outerHTML);
   const primaryBox=await primary.boundingBox(),comparisonBox=await page.locator('.v2-nav-comparisons').boundingBox();
   if(width>=1200)assert.ok(comparisonBox.x>=primaryBox.x+primaryBox.width+32,'comparisons sit to the right');
   else assert.ok(comparisonBox.y>=primaryBox.y+primaryBox.height,'comparisons stack below on narrow screens');
   for(const variant of ['underline','label-chip','backed-underline']){
    const section=page.locator(`.v2-nav-comparison[data-variant="${variant}"]`),sample=section.locator('.v2-nav-sample');
    assert.equal(await sample.getByRole('button').count(),5);
    assert.equal(await sample.locator('nav').getAttribute('aria-label'),`${await section.locator('h3').innerText()} 비교 메뉴`);
    assert.equal(await sample.locator('[aria-current]').count(),1);
    assert.equal(await sample.locator('[aria-current]').innerText(),'내 정보');
    const appearance=await sample.evaluate(n=>{
     const rgba=value=>{const c=document.createElement('canvas');c.width=c.height=1;const ctx=c.getContext('2d');ctx.fillStyle=value;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data];};
     const nav=n.querySelector('nav'),current=nav.querySelector('[aria-current]'),face=current.querySelector('.nav-face'),label=current.lastElementChild;
     const r=n.getBoundingClientRect(),b=nav.getBoundingClientRect(),pseudo=getComputedStyle(label,'::after');
     return {height:r.height,navHeight:b.height,bottom:r.bottom-b.bottom,overflow:n.scrollWidth>n.clientWidth,
      faceAlpha:rgba(getComputedStyle(face).backgroundColor)[3],iconWidth:face.querySelector('svg').width.baseVal.value,
      labelBackground:rgba(getComputedStyle(label).backgroundColor),labelColor:rgba(getComputedStyle(label).color),
      underline:[pseudo.content,pseudo.width,pseudo.height],targets:[...nav.querySelectorAll('button')].map(button=>{const r=button.getBoundingClientRect();return[r.width,r.height];})};
    });
    assert.equal(appearance.height,120);assert.equal(appearance.navHeight,72);assert.equal(appearance.bottom,20);
    assert.equal(appearance.overflow,false);assert.equal(appearance.iconWidth,26);
    if(variant==='backed-underline'){
     assert.equal(appearance.faceAlpha,255);
     const faceStyle=face=>{const r=face.getBoundingClientRect(),cs=getComputedStyle(face);return[r.width,r.height,cs.backgroundColor,cs.borderRadius,...[...face.querySelectorAll('stop')].map(n=>getComputedStyle(n).stopColor)];};
     assert.deepEqual(await sample.locator('[aria-current] .nav-face').evaluate(faceStyle),await primary.locator('[aria-current] .nav-face').evaluate(faceStyle),'C keeps original backing and icon material');
    }else assert.equal(appearance.faceAlpha,0);
    assert.ok(appearance.targets.every(([w,h])=>w>=44&&h>=44),'touch targets '+width+' '+variant);
    if(variant!=='label-chip'){
     assert.deepEqual(appearance.underline,['""','20px','3px']);assert.equal(appearance.labelBackground[3],0);
    }else{
     assert.equal(appearance.labelBackground[3],255);assert.deepEqual(appearance.labelColor,[255,255,255,255]);
     const luminance=rgb=>rgb.slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
     assert.ok(1.05/(luminance(appearance.labelBackground)+.05)>=4.5,'chip text contrast');
    }
    const mainBarcode=await primary.locator('.barcode-art').evaluate(n=>[n.getBoundingClientRect().width,n.getBoundingClientRect().height,n.querySelector('img').getAttribute('src')]);
    assert.deepEqual(await sample.locator('.barcode-art').evaluate(n=>[n.getBoundingClientRect().width,n.getBoundingClientRect().height,n.querySelector('img').getAttribute('src')]),mainBarcode,'central art unchanged');
    for(const label of ['홈','오지파크','내 정보']){
     const button=sample.getByRole('button',{name:label,exact:true});await button.click();
     assert.equal(await sample.locator('[aria-current]').count(),1);assert.equal(await sample.locator('[aria-current]').innerText(),label);
     assert.equal(await primary.locator('.bottom-navigation').evaluate(n=>n.outerHTML),original,'original selection unchanged');
     assert.equal(await page.getByRole('dialog').isVisible(),false);
     assert.equal(page.url(),`${base}/v2/my-info/`);
    }
    await sample.getByRole('button',{name:'바코드',exact:true}).click();
    assert.equal(await sample.locator('[aria-current]').innerText(),'내 정보');
    assert.match(await page.getByRole('status').innerText(),/기존 중앙 버튼을 유지/);
    await page.keyboard.press('Tab');
    assert.ok(await sample.getByRole('button',{name:'오지파크',exact:true}).evaluate(n=>n.getRootNode().activeElement===n&&getComputedStyle(n).outlineStyle!=='none'),'native keyboard focus visible');
   }
   if(width===1440){
    await page.reload();await page.locator('.v2-nav-sample').first().waitFor();await page.evaluate(()=>document.fonts.ready);
    await page.locator('.my-info-test img,.v2-nav-sample img').evaluateAll(images=>Promise.all(images.map(image=>image.decode())));
    await page.screenshot({path:'/private/tmp/og-v2-navigation-comparisons-1440.png'});
    await page.locator('.v2-nav-comparisons').screenshot({path:'/private/tmp/og-v2-navigation-comparisons-detail.png'});
   }
  }
  assert.deepEqual(errors,[]);
  console.log('navigation comparisons: A/B/C shape cues, C retains original backing/material, original preserved, central artwork reused, 6 widths, touch targets, chip contrast, preview selection and focus passed');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
