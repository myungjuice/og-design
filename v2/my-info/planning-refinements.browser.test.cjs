const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage(),errors=[],writes=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)errors.push(r.url()+': '+r.status());});
  page.on('request',r=>{if(!['GET','HEAD'].includes(r.method()))writes.push(r.url());});
  for(const width of [320,375,390,414,768,1440]){
   await page.setViewportSize({width,height:1100});await page.goto(base+'/v2/my-info/#membership');
   await page.waitForFunction(()=>document.querySelector('#membership [data-source-state="basic"] .v2-source-host')?.dataset.sourceReady==='true');
   await page.evaluate(()=>document.fonts.ready);
   const member=page.locator('#membership [data-source-state="basic"] .v2-source-host');
   const geo=await member.locator('.v2-membership-screen').evaluate(n=>{
    const frame=n.getBoundingClientRect(),card=n.querySelector('.v2-member-certificate').getBoundingClientRect(),actions=n.querySelector('.v2-member-actions').getBoundingClientRect(),sheet=n.querySelector('.v2-member-sheet')?.getBoundingClientRect();
    return {card:card.toJSON(),actions:actions.toJSON(),sheet:sheet?.toJSON(),frame:frame.toJSON(),overflow:n.scrollWidth>n.clientWidth||n.querySelector('.v2-member-body').scrollWidth>n.querySelector('.v2-member-body').clientWidth};
   });
   assert.ok(Math.abs(geo.card.right-geo.actions.right)<1,'certificate and actions share right edge at '+width);
   assert.ok(Math.abs(geo.card.left-geo.actions.left)<1,'certificate and actions share left edge');
   assert.ok(geo.sheet&&geo.sheet.top-geo.frame.top===64,'membership is a bottom sheet over dimmed backdrop');
   assert.equal(geo.overflow,false);
   if(width===390)await member.locator('.v2-membership-screen').screenshot({path:'/private/tmp/og-planning-membership-390.png'});
   await page.evaluate(()=>location.hash='mileage-monthly');await page.locator('#mileage-monthly').waitFor();
   const monthly=page.locator('#mileage-monthly .v2-mileage-history-host');
   await monthly.locator('.v2-monthly-records').waitFor();
   assert.equal(await monthly.locator('.v2-monthly-types .v2-chip').count(),5);
   assert.equal(await monthly.locator('.v2-monthly-records li').count(),6);
   const compact=await monthly.locator('.v2-monthly-frame').evaluate(n=>{
    const list=n.querySelector('.v2-monthly-records'),r=list.getBoundingClientRect();
    return {height:n.getBoundingClientRect().height,overflow:n.scrollWidth>n.clientWidth||list.scrollWidth>list.clientWidth,visible:[...list.querySelectorAll('li')].filter(row=>row.getBoundingClientRect().bottom<=r.bottom+1).length,static:[...n.querySelectorAll('button')].every(b=>b.inert)};
   });
   assert.equal(compact.height,846);assert.equal(compact.overflow,false);assert.equal(compact.static,true);
   assert.ok(compact.visible>=5,'at least five complete compact rows visible at '+width);
   assert.deepEqual(await page.locator('[data-review-screen]:visible').evaluateAll(ns=>ns.map(n=>n.id)),['mileage-history','mileage-monthly'],'existing and monthly views remain in the same group');
   if(width===390)await monthly.locator('.v2-monthly-frame').screenshot({path:'/private/tmp/og-planning-mileage-390.png'});
   for(const [domain,key,selector] of [['account','nickname','.v2-nickname-overlay'],['support','access','.v2-access-overlay'],['settings','night','.v2-night-overlay']]){
    await page.evaluate(id=>location.hash=id,domain);await page.locator('#'+domain).waitFor();
    await page.locator('#'+domain+' .v2-source-extra').evaluate(n=>n.open=true);
    await page.waitForFunction(({domain,key})=>document.querySelector('#'+domain+' [data-source-state="'+key+'"] .v2-source-host')?.dataset.sourceReady==='true',{domain,key});
    const host=page.locator('#'+domain+' [data-source-state="'+key+'"] .v2-source-host');
    const overlay=host.locator(selector);
    assert.ok(await host.locator('.v2-source-frame').evaluate(n=>[...n.children].filter(c=>!c.className.includes('-overlay')).every(c=>c.inert&&c.getAttribute('aria-hidden')==='true')),'background isolated '+domain);
    assert.ok(await overlay.locator('.og-dialog-panel').evaluate(n=>{const r=n.getBoundingClientRect(),f=n.closest('.v2-source-frame').getBoundingClientRect();return r.left>=f.left&&r.right<=f.right&&r.top>=f.top&&r.bottom<=f.bottom&&n.scrollWidth<=n.clientWidth;}),'dialog contained '+domain+' '+width);
    assert.ok(await host.locator('button,input').evaluateAll(ns=>ns.every(n=>n.inert)),'service controls remain static');
    if(width===390)await host.locator('.v2-source-frame').screenshot({path:'/private/tmp/og-planning-'+domain+'-390.png'});
   }
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   assert.equal(await page.locator('#services,[data-view-link="services"]').count(),0,'duplicate services removed');
  }
  assert.deepEqual(errors,[]);assert.deepEqual(writes,[]);
  console.log('planning refinements: 6 widths; equal certificate/action edges, membership sheet, 5+ compact visible rows, static nickname/permissions and contained overlays passed');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
