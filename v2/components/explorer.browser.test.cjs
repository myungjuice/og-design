const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`${base}/v2/components/`);
  await page.locator('#primary').waitFor();
  assert.equal(await page.locator('.v2-component-section:visible').count(),3,'related buttons are visible together');
  assert.equal(await page.locator('#primary .v2-button:visible').count(),1,'basic form first');
  const explorer=page.getByRole('navigation',{name:'공통 컴포넌트 하위 메뉴'});
  const search=page.getByRole('searchbox',{name:'컴포넌트 검색'});
  assert.equal(await explorer.locator('[data-view-link]').count(),18);
  assert.equal(await page.locator('.v2-primary-nav > a,.v2-primary-nav > div > a').count(),7);
  await search.fill('마일리지');
  assert.equal(await explorer.locator('[data-view-link]:visible').count(),1);
  await explorer.getByRole('link',{name:'마일리지 카드·진행바',exact:true}).click();
  assert.deepEqual(await page.locator('.v2-component-section:visible').evaluateAll(ns=>ns.map(n=>n.id)),['cards','mileage','section-heading']);
  assert.equal(new URL(page.url()).hash,'#mileage');
  assert.equal(await page.locator('#mileage .v2-mileage:visible').count(),1);
  await page.locator('#mileage .v2-state-comparison > summary').click();
  assert.equal(await page.locator('#mileage .v2-mileage:visible').count(),4);
  await page.reload();await page.locator('#mileage').waitFor();
  assert.equal(await page.locator('.v2-component-section:visible').count(),3);
  assert.equal(await page.locator('#mileage .v2-state-comparison').evaluate(n=>n.open),false);
  await explorer.getByRole('link',{name:'목록 행',exact:true}).focus();await page.keyboard.press('Enter');
  assert.equal(await page.locator('.v2-component-section:visible').getAttribute('id'),'list-row');
  assert.equal(await explorer.locator('a[aria-current="location"]').count(),1);
  const fragment=new URL(page.url()).hash;
  await page.locator('.v2-skip').focus();await page.keyboard.press('Enter');
  assert.equal(await page.locator('.v2-component-section:visible').getAttribute('id'),'list-row','skip link preserves selected component');
  assert.equal(new URL(page.url()).hash,fragment,'skip link does not overwrite selected URL');
  assert.equal(await page.locator('main').evaluate(n=>document.activeElement===n),true);
  assert.equal(await page.locator('#list-row-state-loading').isVisible(),false);
  await page.locator('#list-row .v2-state-comparison > summary').focus();await page.keyboard.press('Space');
  assert.equal(await page.locator('#list-row-state-loading').isVisible(),true);
  await page.reload();await page.locator('#list-row').waitFor();
  assert.equal(await page.locator('#list-row .v2-state-comparison').evaluate(n=>n.open),false,'refresh starts with basic patterns');
  await page.goBack();await page.locator('#mileage').waitFor();
  assert.deepEqual(await page.locator('.v2-component-section:visible').evaluateAll(ns=>ns.map(n=>n.id)),['cards','mileage','section-heading']);
  await page.goForward();await page.locator('#list-row').waitFor();
  assert.equal(await page.locator('.v2-component-section:visible').getAttribute('id'),'list-row');
  await search.fill('없는항목');
  assert.equal(await explorer.locator('a:visible').count(),0);
  assert.match(await page.locator('.v2-subnav-status').innerText(),/검색 결과가 없습니다/);
  assert.equal(await page.locator('#list-row').isVisible(),true,'search filters navigation, not the current preview');
  await page.getByRole('button',{name:'검색 지우기',exact:true}).click();
  assert.equal(await explorer.locator('[data-view-link]:visible').count(),18);
  await search.fill('  하단   메뉴  ');assert.equal(await explorer.locator('[data-view-link]:visible').count(),1);
  await search.press('Escape');assert.equal(await search.inputValue(),'');
  await page.goto(`${base}/v2/components/#not-a-component`);await page.locator('#primary').waitFor();
  assert.deepEqual(await page.locator('.v2-component-section:visible').evaluateAll(ns=>ns.map(n=>n.id)),['primary','secondary','review']);
  for(const width of [320,375,390,414,768,1440]){
   await page.setViewportSize({width,height:1000});await page.goto(`${base}/v2/components/#list-row`);
   await page.locator('#list-row').waitFor();await page.evaluate(()=>document.fonts.ready);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no overflow '+width);
   assert.equal(await page.locator('.v2-component-section:visible').count(),1);
   if(width<1024){
    const picker=page.getByRole('combobox',{name:'화면 그룹 선택'});
    await picker.selectOption('navigation');
    assert.equal(await page.locator('.v2-component-section:visible').getAttribute('id'),'navigation');
    assert.equal(new URL(page.url()).hash,'#group-navigation');
    await page.locator('.v2-submenu > summary').click();
    await explorer.getByRole('link',{name:'목록 행',exact:true}).click();
    assert.equal(await page.locator('.v2-submenu').evaluate(n=>n.open),false,'mobile selection closes the secondary menu');
    assert.equal(await page.locator('#list-row-title').evaluate(n=>document.activeElement===n),true);
   }else{
    const selectedLink=explorer.locator('[aria-current="location"]');
    assert.ok(await selectedLink.evaluate(n=>{const r=n.getBoundingClientRect(),b=n.closest('nav').getBoundingClientRect();return r.top>=b.top-1&&r.bottom<=b.bottom+1;}),'selected component stays in the sublist viewport');
    await page.locator('#list-row .v2-state-comparison > summary').click();
    await page.locator('#list-row-state-success').scrollIntoViewIfNeeded();
    assert.ok(await search.isVisible());
    assert.ok(await search.evaluate(n=>{const r=n.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight;}),'sticky sidebar keeps search reachable');
   }
   if([390,1440].includes(width)){
    await page.goto(`${base}/v2/components/#list-row`);await page.reload();await page.locator('#list-row').waitFor();
    await page.locator('#list-row-title').click();
    await page.evaluate(()=>scrollTo(0,0));
    await page.screenshot({path:`/private/tmp/og-v2-component-explorer-${width}.png`,fullPage:true});
   }
  }
  const touch=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const phone=await touch.newPage();await phone.goto(`${base}/v2/components/#primary`);
  await phone.getByRole('combobox',{name:'화면 그룹 선택'}).selectOption('cards-information');
  await phone.locator('#mileage .v2-state-comparison > summary').tap();
  assert.equal(await phone.locator('#mileage .v2-mileage:visible').count(),4);await touch.close();
  assert.deepEqual(errors,[]);
  console.log('Component explorer: grouped previews, default-first disclosure, sidebar search/empty/clear, deep links/history, sticky sidebar, 6 widths and touch passed');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
