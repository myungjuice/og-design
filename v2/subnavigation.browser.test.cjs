const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)errors.push(r.url()+':'+r.status());});
  for(const id of ['design-system','components','home','my-land','barcode','og-park','my-info']){
   await page.goto(`${base}/v2/${id}/`);await page.locator('main > h1').waitFor();
   assert.equal(await page.locator('.v2-workspace > aside').count(),2,'two sidebar tiers on '+id);
   const rails=await page.locator('.v2-workspace > aside,main').evaluateAll(ns=>ns.map(n=>n.getBoundingClientRect().toJSON()));
   assert.ok(rails[0].right<=rails[1].left&&rails[1].right<=rails[2].left,'primary / secondary / content '+id);
   assert.equal(await page.locator('.v2-primary-nav > a').count(),7);
   assert.equal(await page.locator('.v2-sidebar [data-view-link]').count(),0,'children never embedded in primary');
   if(['my-land','og-park'].includes(id)){
    assert.equal(await page.locator('.v2-secondary-sidebar a').count(),0,'no invented pages');
   }
  }
  assert.match(await page.locator('.v2-secondary-sidebar').innerText(),/내역·예약/);
  assert.equal(await page.locator('.v2-secondary-sidebar [aria-disabled="true"]').count()>0,true,'unported pages are not fake links');
  await page.goto(`${base}/v2/components/`);await page.locator('#primary').waitFor();
  const visible=()=>page.locator('.v2-component-section:visible').evaluateAll(ns=>ns.map(n=>n.id));
  assert.deepEqual(await visible(),['primary','secondary','review'],'related buttons together');
  assert.equal(await page.locator('.v2-state-comparison[open]').count(),0);
  const aux=page.getByRole('navigation',{name:'공통 컴포넌트 하위 메뉴'});
  assert.ok(await aux.locator('[data-view-link]').evaluateAll(ns=>ns.every(n=>{
   const r=n.getBoundingClientRect(),g=n.closest('[data-review-group]').querySelector('[data-group-link]').getBoundingClientRect();return r.left>g.left&&r.width>=44&&r.height>=44;
  })),'child links indented with touch targets');
  await aux.getByRole('link',{name:'보조 버튼',exact:true}).click();
  assert.deepEqual(await visible(),['primary','secondary','review'],'child jump keeps siblings visible');
  assert.equal(new URL(page.url()).hash,'#secondary');
  assert.ok(await page.locator('#secondary').evaluate(n=>{const r=n.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight&&(scrollY>0||document.documentElement.scrollHeight<=innerHeight);}),'child jump reveals its section within the available document scroll');
  await aux.locator('[data-group-link="cards-information"]').click();
  assert.deepEqual(await visible(),['cards','mileage','section-heading']);
  await page.goBack();await page.locator('#secondary').waitFor();assert.deepEqual(await visible(),['primary','secondary','review']);
  await page.reload();await page.locator('#secondary').waitFor();assert.deepEqual(await visible(),['primary','secondary','review']);
  await page.locator('.v2-skip').focus();await page.keyboard.press('Enter');
  assert.deepEqual(await visible(),['primary','secondary','review']);assert.equal(new URL(page.url()).hash,'#secondary');
  const search=page.getByRole('searchbox',{name:'컴포넌트 검색'});await search.fill('버튼');
  assert.equal(await aux.locator('[data-view-link]:visible').count(),3);
  await search.fill('없는항목');assert.equal(await aux.locator('[data-view-link]:visible').count(),0);
  assert.match(await page.locator('.v2-subnav-status').innerText(),/검색 결과가 없습니다/);
  assert.deepEqual(await visible(),['primary','secondary','review']);
  await page.getByRole('button',{name:'검색 지우기',exact:true}).click();
  await aux.locator('[data-group-link="inputs"]').click();
  assert.deepEqual(await visible(),['search','text-input','password-input','phone-input','numeric-input','multiline-input']);
  await aux.locator('[data-view-link="password-input"]').click();
  assert.deepEqual(await visible(),['search','text-input','password-input','phone-input','numeric-input','multiline-input'],'child input link keeps the entire input family visible');
  assert.equal(new URL(page.url()).hash,'#password-input');
  await page.reload();await page.locator('#password-input').waitFor();
  assert.deepEqual(await visible(),['search','text-input','password-input','phone-input','numeric-input','multiline-input'],'input deep link survives refresh');
  await aux.locator('[data-group-link="map-exploration"]').focus();await page.keyboard.press('Enter');
  assert.deepEqual(await visible(),['categories']);
  await page.goto(`${base}/v2/design-system/#typography`);await page.locator('#typography').waitFor();
  assert.deepEqual(await page.locator('.v2-foundation:visible').evaluateAll(ns=>ns.map(n=>n.id)),['typography','spacing']);
  assert.match(await page.locator('#colors [data-color-token]').first().textContent(),/RGB/);
  for(const width of [320,375,390,414,768,1024,1440]){
   await page.setViewportSize({width,height:1000});await page.goto(`${base}/v2/components/#primary`);await page.reload();await page.locator('#primary').waitFor();await page.evaluate(()=>document.fonts.ready);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no overflow '+width);
   if(width<1024){
    const picker=page.getByRole('combobox',{name:'화면 그룹 선택'});await picker.selectOption('map-exploration');
    assert.deepEqual(await visible(),['categories']);
    await picker.selectOption('inputs');
    assert.deepEqual(await visible(),['search','text-input','password-input','phone-input','numeric-input','multiline-input']);
    await page.locator('.v2-submenu > summary').click();
    await aux.getByRole('link',{name:'보조 버튼',exact:true}).click();
    assert.equal(await page.locator('.v2-submenu').evaluate(n=>n.open),false);
    assert.equal(await page.locator('#secondary-title').evaluate(n=>document.activeElement===n),true);
   }else{
    await page.locator('#review').scrollIntoViewIfNeeded();
    assert.ok(await search.evaluate(n=>{const r=n.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight;}),'secondary search stays reachable');
   }
   if([390,1440].includes(width)){
    await page.goto(`${base}/v2/components/#primary`);await page.reload();await page.locator('#primary').waitFor();await page.evaluate(()=>scrollTo(0,0));
    await page.screenshot({path:`/private/tmp/og-v2-two-sidebar-${width}.png`,fullPage:true});
   }
  }
  for(const selector of ['.v2-menu > summary','.v2-submenu > summary','#review-picker']){
   await page.setViewportSize({width:390,height:1000});await page.locator(selector).focus();
   await page.setViewportSize({width:1440,height:1000});
   const destination=selector==='.v2-menu > summary'?'.v2-primary-nav [aria-current="page"]':'.v2-subnav [aria-current="location"]';
   await page.waitForFunction(selector=>document.activeElement===document.querySelector(selector),destination);
   assert.equal(await page.evaluate(()=>document.activeElement===document.body),false,'responsive transition retains keyboard focus: '+selector);
   assert.ok(await page.evaluate(()=>{const r=document.activeElement.getBoundingClientRect();return r.width>0&&r.height>0;}),'focused destination stays visible: '+selector);
  }
  await page.setViewportSize({width:390,height:1000});await page.locator('.v2-submenu > summary').click();
  await search.fill('없는항목');await page.locator('#review-picker').focus();await page.setViewportSize({width:1440,height:1000});
  await page.waitForFunction(()=>document.activeElement===document.querySelector('main'));
  assert.deepEqual(errors,[]);
  console.log('Two sidebars: all7 routes, group previews, indented child jumps, pending pages, search, history, skip, keyboard and7 widths passed');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
