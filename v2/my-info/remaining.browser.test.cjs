const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
const states={membership:['basic','registered','no-code','share'],settings:['basic','permissions','lower','no-password','logged-out','kakao','night'],password:['auth','create','confirm','confirm-error','auth-error'],account:['hidden','visible','profile','no-inviter','withdrawal','confirmed','assets','nickname'],support:['basic','notification','guest','confirm','access'],faq:['basic','best','category','answer'],opinion:['empty','filled','photos','records','answered','processing','no-records'],'customer-center':['basic'],policies:['basic','long'],'policy-detail':['basic','long'],'photo-review':['basic','no-photos','empty','menu','delete'],'review-write':['empty','composed','expanded','selected','unchanged','source','help']};
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage(),errors=[],remote=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{
   // Chrome's implicit favicon fetch is a pre-existing site-level request.
   if(m.type()==='error'&&!(m.location().url===base+'/favicon.ico'&&m.text().includes('404')))errors.push(m.text());
  });
  page.on('response',r=>{if(r.status()>=400)errors.push(r.url()+':'+r.status());});
  page.on('request',r=>{if(!r.url().startsWith(base)&&!r.url().startsWith('data:'))remote.push(r.url());});
  for(const width of [320,375,390,414,768,1024,1440,1920]){
   await page.setViewportSize({width,height:1100});await page.goto(base+'/v2/my-info/#membership');await page.reload();
   await page.waitForFunction(()=>[...document.querySelectorAll('.v2-source-host')].filter(n=>n.dataset.sourceReady==='true').length===12);
   await page.evaluate(()=>document.fonts.ready);
   assert.equal(await page.locator('.v2-subnav-pending').count(),2);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'workspace width '+width);
   for(const [domain,keys] of Object.entries(states)){
    await page.evaluate(id=>location.hash=id,domain);await page.locator('#'+domain).waitFor();
    const section=page.locator('#'+domain),extras=section.locator('.v2-source-extra');
    assert.equal(await section.locator('.v2-source-host').evaluateAll(ns=>ns.filter(n=>n.shadowRoot).length),1,'basic only '+domain);
    if(await extras.count()){await extras.evaluate(n=>n.open=true);}
    await page.waitForFunction(id=>[...document.querySelectorAll('#'+id+' .v2-source-host')].every(n=>n.dataset.sourceReady==='true'),domain);
    for(const key of keys){
     const host=section.locator(`[data-source-state="${key}"] .v2-source-host`),frame=host.locator('.v2-source-frame');
     const geo=await frame.evaluate(n=>{
      const rect=n.getBoundingClientRect(),cs=getComputedStyle(n),regions=[...n.querySelectorAll('[role="region"]')];
      return {w:rect.width,h:rect.height,font:cs.fontFamily,inert:n.inert,overflow:n.scrollWidth>n.clientWidth,controls:[...n.querySelectorAll('button,input,textarea,select,a')].every(b=>b.inert),regionOverflow:regions.filter(r=>!r.classList.contains('og-faq-carousel')).some(r=>r.scrollWidth>r.clientWidth),regionTabs:regions.every(r=>r.tabIndex===0),unknown:n.querySelector('.material-icons')!==null};
     });
     assert.equal(geo.w,Math.min(width,390),domain+' '+key+' width '+width);
     assert.equal(geo.h,846,domain+' '+key+' height '+width);
     assert.equal(geo.inert,false);assert.equal(geo.overflow,false,domain+' '+key+' frame overflow '+width);
     assert.equal(geo.regionOverflow,false,domain+' '+key+' body overflow '+width);assert.equal(geo.regionTabs,true);
     assert.equal(geo.controls,true,domain+' '+key+' static controls');assert.equal(geo.unknown,false);assert.match(geo.font,/OG V2 Pretendard/);
     assert.equal(await host.locator('img[src^="http"],iframe,script').count(),0);
     assert.ok(await host.locator('.v2-input textarea').evaluateAll(ns=>ns.every(n=>getComputedStyle(n).borderRadius==='16px')),'shared multiline shape '+domain+' '+key);
     if(['opinion','review-write'].includes(domain))assert.ok(await host.locator('.v2-input textarea').evaluateAll(ns=>ns.every(n=>getComputedStyle(n).resize==='none')),'no desktop resize handle in mobile source');
     if(domain==='opinion')assert.ok(await host.locator('.v2-input textarea').evaluateAll(ns=>ns.every(n=>getComputedStyle(n).minHeight==='160px')),'original opinion reading height');
     if(domain==='review-write'&&['help','selected'].includes(key)){
      const button=host.locator(key==='help'?'.og-write-help-close':'.og-write-delete');
      assert.equal(await button.evaluate(n=>getComputedStyle(n).position),'absolute','source icon overlay position');
      assert.ok(await button.evaluate(n=>{const r=n.getBoundingClientRect(),p=n.closest('.og-dialog-panel,.og-write-photo').getBoundingClientRect();return r.left>=p.left&&r.right<=p.right+.5&&r.top>=p.top&&r.bottom<=p.bottom+.5;}),'icon contained by its target');
     }
     const overlays=frame.locator(':scope > [class*="-overlay"]');
     if(await overlays.count()){
      assert.ok(await frame.evaluate(n=>[...n.children].filter(c=>!c.className.includes('-overlay')).every(c=>c.inert&&c.getAttribute('aria-hidden')==='true')),'background isolated '+domain+' '+key);
      assert.ok(await overlays.evaluateAll(ns=>ns.every(n=>{const f=n.closest('.v2-source-frame').getBoundingClientRect();return [...n.querySelectorAll('.og-dialog-panel,.og-sheet-panel')].every(p=>{const r=p.getBoundingClientRect();return r.left>=f.left-.5&&r.right<=f.right+.5&&r.top>=f.top-.5&&r.bottom<=f.bottom+.5;});})),'overlay fits '+domain+' '+key+' '+width);
     }
     if([390,320].includes(width)&&key===keys[0])await frame.screenshot({path:`/private/tmp/og-v2-remaining-${domain}-${width}.png`});
    }
    if(await extras.count()){await extras.evaluate(n=>n.open=false);await extras.evaluate(n=>n.open=true);}
    assert.equal(await section.locator('.v2-source-host').evaluateAll(ns=>ns.filter(n=>n.shadowRoot).length),keys.length,'no duplicate state mounts');
   }
   await page.evaluate(()=>location.hash='faq');await page.locator('#faq').waitFor();
   const carousel=page.locator('#faq [data-source-state="basic"] .v2-source-host').locator('.og-faq-carousel');
   await carousel.focus();await page.keyboard.press('ArrowRight');
   await carousel.evaluate(n=>new Promise((resolve,reject)=>{const start=Date.now(),check=()=>n.scrollLeft>0?resolve():Date.now()-start>3000?reject(Error('FAQ carousel did not keyboard-scroll')):requestAnimationFrame(check);check();}));
   await page.evaluate(()=>location.hash='settings');await page.locator('#settings').waitFor();
   const label=page.locator('#settings [data-source-state="basic"] .v2-source-host').locator('.og-choice').first();
   const checked=await label.locator('input').isChecked();await label.click({force:true});assert.equal(await label.locator('input').isChecked(),checked,'label cannot activate an inert service switch');
   // Actual reading region, not its non-scrolling wrapper, must accept keyboard scroll.
   for(const [domain,key,selector] of [['policy-detail','long','.og-policy-document'],['opinion','filled','.og-opinion-scroll'],['password','auth','.og-password-content'],['settings','lower','.og-sheet-body'],['review-write','expanded','.og-write-body']]){
    await page.evaluate(id=>location.hash=id,domain);await page.locator('#'+domain).waitFor();
    const body=page.locator(`#${domain} [data-source-state="${key}"] .v2-source-host`).locator(selector);
    await body.evaluate(n=>{const filler=document.createElement('p');filler.textContent='긴 본문 마지막 내용까지 확인합니다. '.repeat(800);n.append(filler);});
    assert.ok(await body.evaluate(n=>n.scrollHeight>n.clientHeight&&n.scrollWidth<=n.clientWidth),'long body '+domain);
    await body.scrollIntoViewIfNeeded();const box=await body.boundingBox();await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.wheel(0,50000);
    await body.evaluate(n=>new Promise((resolve,reject)=>{const start=Date.now(),check=()=>n.scrollTop+n.clientHeight>=n.scrollHeight-2?resolve():Date.now()-start>3000?reject(Error('wheel did not reach bottom')):requestAnimationFrame(check);check();}));
    await body.evaluate(n=>n.scrollTo({top:0,behavior:'instant'}));await body.focus();await page.keyboard.press('End');
    await body.evaluate(n=>new Promise((resolve,reject)=>{const start=Date.now(),check=()=>n.scrollTop+n.clientHeight>=n.scrollHeight-2?resolve():Date.now()-start>3000?reject(Error('keyboard did not reach bottom')):requestAnimationFrame(check);check();}));
   }
  }
  await page.setViewportSize({width:1440,height:1100});await page.goto(base+'/v2/my-info/');await page.locator('#overview').waitFor();
  for(const [label,id] of [['멤버십','membership'],['문의하기','support'],['설정','settings'],['내 정보','account']]){
   const button=page.locator('.v2-screen-host').locator(`[data-preview="${label}"]`).first();await button.focus();await page.keyboard.press('Enter');await page.waitForURL('**/#'+id);await page.locator('#'+id).waitFor();
   await page.waitForFunction(id=>document.activeElement?.id===id+'-title',id);await page.goBack();await page.locator('#overview').waitFor();
  }
  assert.deepEqual(remote,[]);assert.deepEqual(errors,[]);
  console.log('remaining MyInfo: 12 bodies, 57 states × 8 widths; shared font/materials, inert controls, isolated/contained overlays, lazy mounts, real body wheel/keyboard scrolling and 4 main entries passed');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
