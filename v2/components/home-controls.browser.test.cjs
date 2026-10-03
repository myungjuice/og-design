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
   await page.setViewportSize({width,height:1000});await page.goto(`${base}/v2/components/#search`);
   await page.locator('[data-home-component="search"] input').first().waitFor();
   await page.evaluate(()=>document.fonts.ready);
   const search=page.locator('[data-home-component="search"]');
   const categories=page.locator('[data-home-component="categories"]');
   const nav=page.locator('[data-home-component="navigation"]');
   assert.equal(await page.locator('[data-home-component]').count(),3);
   assert.equal(await page.locator('.home-map,.home-test,iframe').count(),0);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no page overflow '+width);
   assert.ok(await page.locator('[data-home-component] img').evaluateAll(ns=>ns.every(n=>n.complete&&n.naturalWidth>0&&new URL(n.src).pathname.startsWith('/screens/my-info-3d-test/media/figma/'))));
   assert.equal(await search.locator('form').getAttribute('role'),'search');
   assert.equal(await search.getByRole('searchbox',{name:'매장 검색'}).getAttribute('id'),'component-store-search');
   await search.getByRole('searchbox').fill('망원');await search.getByRole('searchbox').press('Enter');
   assert.match(await page.locator('.v2-home-component-status').innerText(),/실제 매장 검색은 진행되지 않습니다/);
   await page.evaluate(()=>location.hash='categories');await page.locator('#categories').waitFor();
   await categories.getByRole('button',{name:'한식',exact:true}).click();
   assert.equal(await categories.locator('[aria-pressed="true"]').count(),1);
   assert.equal(await categories.locator('[aria-pressed="true"]').getAttribute('data-category'),'한식');
   await categories.getByRole('button',{name:'+ 더 보기',exact:true}).click();
   assert.match(await page.locator('.v2-home-component-status').innerText(),/업종 더 보기/);
   assert.equal(await categories.locator('[aria-pressed="true"]').count(),1);
   assert.ok(await categories.locator('button').evaluateAll(ns=>ns.every(n=>{
    const r=n.getBoundingClientRect(),p=getComputedStyle(n,'::before');
    return r.width>=44&&r.height===38&&r.height-parseFloat(p.top)-parseFloat(p.bottom)>=44&&n.scrollWidth<=n.clientWidth;
   })),'category visuals and 44px hit areas '+width);
   await page.evaluate(()=>location.hash='navigation');await page.locator('#navigation').waitFor();
   assert.ok(await nav.locator('button').evaluateAll(ns=>ns.every(n=>{const r=n.getBoundingClientRect();return r.width>=44&&r.height>=44;})));
   assert.ok(await page.locator('.home-category,.nav-item,.home-search input').evaluateAll(ns=>{
    const canvas=document.createElement('canvas');canvas.width=canvas.height=1;const ctx=canvas.getContext('2d');
    const luminance=color=>{ctx.clearRect(0,0,1,1);ctx.fillStyle=color;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data].slice(0,3).map(c=>c/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4).reduce((s,c,i)=>s+c*[.2126,.7152,.0722][i],0);};
    return ns.every(n=>{
     const fg=luminance(getComputedStyle(n).color);let surface=n;
     while(surface.parentElement&&getComputedStyle(surface).backgroundImage==='none'&&getComputedStyle(surface).backgroundColor==='rgba(0, 0, 0, 0)')surface=surface.parentElement;
     const s=getComputedStyle(surface),colors=s.backgroundImage==='none'?[s.backgroundColor]:s.backgroundImage.match(/oklch\([^)]*\)|rgba?\([^)]*\)/g);
     return colors&&colors.every(c=>{const bg=luminance(c);return (Math.max(fg,bg)+.05)/(Math.min(fg,bg)+.05)>=4.5;});
    });
   }),'control text contrast on both gradient endpoints '+width);
   await nav.getByRole('button',{name:'내 정보',exact:true}).click();
   assert.equal(await nav.locator('[aria-current="page"]').count(),1);
   const selected=nav.locator('[aria-current="page"]');
   assert.equal(await selected.innerText(),'내 정보');
   assert.deepEqual(await selected.evaluate(n=>{
    const p=getComputedStyle(n.lastElementChild,'::after'),r=n.querySelector('.nav-face').getBoundingClientRect();
    return [p.width,p.height,r.width,r.height];
   }),['20px','2px',40,32]);
   await selected.focus();await page.keyboard.press('Space');
   assert.equal(await selected.evaluate(n=>getComputedStyle(n).outlineWidth),'2px');
   await nav.getByRole('button',{name:'바코드',exact:true}).click();
   assert.equal(await nav.locator('[aria-current="page"]').count(),1);
   assert.equal(await nav.locator('.nav-barcode>span:last-child').evaluate(n=>getComputedStyle(n,'::after').content),'none');
   assert.equal(new URL(page.url()).pathname,'/v2/components/');
   if(width===1440){
    await nav.getByRole('button',{name:'홈',exact:true}).click();
    await page.evaluate(()=>location.hash='categories');await page.locator('#categories').waitFor();
    await categories.getByRole('button',{name:'전체',exact:true}).click();
    await page.evaluate(()=>location.hash='search');await page.locator('#search').waitFor();
    await search.getByRole('searchbox').fill('');
    await page.locator('#search-title').click();
    await page.locator('#search').screenshot({path:'/private/tmp/og-v2-component-search.png'});
    await page.evaluate(()=>location.hash='categories');await page.locator('#categories').waitFor();
    await page.locator('#categories').screenshot({path:'/private/tmp/og-v2-component-categories.png'});
    await page.evaluate(()=>location.hash='navigation');await page.locator('#navigation').waitFor();
    await page.locator('#navigation').screenshot({path:'/private/tmp/og-v2-component-navigation.png'});
   }
  }
  // Component selection is local; the actual Home still starts on All/Home.
  await page.goto(`${base}/v2/home/`);
  assert.equal(await page.locator('[data-category="전체"]').getAttribute('aria-pressed'),'true');
  assert.equal(await page.locator('.bottom-navigation [aria-current="page"]').innerText(),'홈');
  const touch=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
  const touchPage=await touch.newPage();await touchPage.goto(`${base}/v2/components/#categories`);
  await touchPage.locator('[data-home-component="categories"] [data-category="중식"]').tap();
  assert.equal(await touchPage.locator('[data-home-component="categories"] [aria-pressed="true"]').getAttribute('data-category'),'중식');
  await touchPage.evaluate(()=>location.hash='navigation');await touchPage.locator('#navigation').waitFor();
  await touchPage.locator('[data-home-component="navigation"]').getByRole('button',{name:'내 정보',exact:true}).tap();
  assert.equal(await touchPage.locator('[data-home-component="navigation"] [aria-current="page"]').innerText(),'내 정보');
  await touch.close();
  assert.deepEqual(errors,[]);
  console.log('Home components: isolated search/categories/nav, original art/geometry, 6 widths, keyboard and no screen mutation passed');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
