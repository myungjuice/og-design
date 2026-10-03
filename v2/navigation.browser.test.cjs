const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)errors.push(r.url()+':'+r.status());});
  const routes=[['design-system','디자인 시스템'],['components','공통 컴포넌트'],['home','홈화면'],['my-land','마이랜드'],['barcode','바코드'],['og-park','오지파크'],['my-info','내정보']];
  for(const [id,title] of routes){
   await page.goto(`${base}/v2/${id}/`);
   await page.locator('main > h1').waitFor();
   assert.equal(await page.locator('main > h1').textContent(),title);
   assert.equal(await page.locator('.v2-menu nav [aria-current="page"]').count(),1);
   assert.equal(await page.locator('.v2-menu nav [aria-current="page"]').textContent(),title);
   assert.equal(await page.locator('.v2-menu nav a').count(),7);
   if(['my-land','og-park'].includes(id))assert.equal((await page.locator('main').innerText()).trim(),title);
   assert.equal(await page.locator('.my-info-test,.home-test,.barcode-test').count(),id==='my-info'?1:0);
   if(id!=='design-system')assert.equal(await page.locator('link[href$="foundations.css"]').count(),0);
   await page.reload();await page.locator('main > h1').waitFor();
   assert.equal(await page.locator('.v2-menu nav [aria-current="page"]').textContent(),title);
  }
  await page.goto(`${base}/v2/`);await page.waitForURL('**/v2/design-system/');
  await page.getByRole('navigation',{name:'3D컨셉 디자인 v2'}).getByRole('link',{name:'바코드',exact:true}).click();
  await page.waitForURL('**/v2/barcode/');
  await page.goBack();await page.locator('main > h1').waitFor();
  assert.equal(await page.locator('main > h1').textContent(),'디자인 시스템');
  for(const width of [320,375,390,414,768,1440]){
   await page.setViewportSize({width,height:1000});await page.reload();await page.locator('main > h1').waitFor();
   const menu=page.locator('.v2-menu'),summary=menu.locator('summary');
   if(width<768){
    assert.equal(await menu.evaluate(n=>n.open),false,'mobile menu starts closed');
    await summary.focus();await page.keyboard.press('Enter');
    assert.equal(await menu.evaluate(n=>n.open),true,'Enter opens menu');
    await page.getByRole('navigation',{name:'3D컨셉 디자인 v2'}).getByRole('link',{name:'홈화면',exact:true}).focus();
    await page.keyboard.press('Escape');
    assert.equal(await menu.evaluate(n=>n.open),false,'Escape closes menu');
    assert.equal(await summary.evaluate(n=>document.activeElement===n),true,'focus returns before closing');
    await summary.press('Enter');
   }else{
    assert.equal(await menu.evaluate(n=>n.open),true,'desktop menu is visible');
    assert.equal(await page.locator('.v2-sidebar').evaluate(n=>n.getBoundingClientRect().width),216);
   }
   assert.ok(await page.locator('.v2-menu nav a').evaluateAll(nodes=>nodes.every(n=>{const r=n.getBoundingClientRect();return r.width>=44&&r.height>=44;})),'44px touch targets');
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no overflow '+width);
   await page.getByRole('navigation',{name:'3D컨셉 디자인 v2'}).getByRole('link',{name:'홈화면',exact:true}).focus();
   assert.ok(await page.locator('nav a:focus-visible').count(),'keyboard focus is visible');
  }
  await page.setViewportSize({width:390,height:1000});await page.reload();await page.locator('main > h1').waitFor();
  await page.setViewportSize({width:1440,height:1000});
  await page.waitForFunction(()=>document.querySelector('.v2-menu').open);
  assert.ok(await page.getByRole('navigation',{name:'3D컨셉 디자인 v2'}).isVisible());
  assert.deepEqual(errors,[]);
  console.log('v2 navigation: 7 direct routes/reloads, redirect, history, keyboard menu, resize, 6 widths passed');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
