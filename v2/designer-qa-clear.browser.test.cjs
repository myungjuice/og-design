const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';

// Clear designer QA only: preserve touch targets, scroll behavior and loaded material.
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 const failures=[];let passed=0;
 const check=async(name,run)=>{try{await run();passed++;console.log('PASS '+name);}catch(error){failures.push(name+': '+error.message);console.error('FAIL '+name+': '+error.message);}};
 try{
  const page=await browser.newPage();
  const gallery=async(id)=>{
   await page.goto(base+'/v2/my-info/#'+id);
   const section=page.locator('#'+id),extra=section.locator('.v2-source-extra>summary');
   if(await extra.count())await extra.click();
   await page.waitForFunction(id=>[...document.querySelectorAll('#'+id+' .v2-source-host')].every(n=>n.dataset.sourceReady==='true'),id);
   await page.evaluate(()=>document.fonts.ready);return section;
  };
  for(const width of [320,390,768]){
   await page.setViewportSize({width,height:1100});
   await page.goto(base+'/v2/home/#search');await page.locator('#search .v2-home-search-extra>summary').click();
   await page.waitForFunction(()=>[...document.querySelectorAll('#search .v2-home-search-host')].every(n=>n.shadowRoot&&[...n.shadowRoot.querySelectorAll('link')].every(l=>l.sheet)));
   await page.locator('#search [data-search-state] img').evaluateAll(images=>Promise.all(images.map(image=>image.decode())));
   await check('history has no separators; small X retains target @'+width,async()=>{
    const rows=await page.locator('[data-search-state="history"] .og-home-history-row').evaluateAll(ns=>ns.map(n=>{
     const b=n.querySelector('button'),r=b.getBoundingClientRect(),s=b.querySelector('svg').getBoundingClientRect();
     return {border:getComputedStyle(n).borderBottomWidth,target:[r.width,r.height],glyph:s.width,text:parseFloat(getComputedStyle(n.querySelector('.og-row-title')).fontSize)};
    }));
    assert.equal(rows.length,3);for(const r of rows){assert.equal(r.border,'0px');assert.ok(r.glyph<=r.text);assert.ok(r.target.every(v=>v>=44));}
   });
   await check('partial empty results stack and center @'+width,async()=>{
    const groups=await page.locator('.og-search-empty-group').evaluateAll(ns=>ns.map(n=>{
     const i=n.querySelector('img').getBoundingClientRect(),t=n.querySelector('span').getBoundingClientRect(),s=getComputedStyle(n);
     return {above:i.bottom<=t.top,center:Math.abs((i.left+i.right-t.left-t.right)/2),padding:parseFloat(s.paddingTop),fits:n.scrollWidth<=n.clientWidth};
    }));
    assert.equal(groups.length,2);for(const g of groups){assert.ok(g.above);assert.ok(g.center<1);assert.ok(g.padding>=24);assert.ok(g.fits);}
   });
   if(width===390)await page.locator('[data-search-state="store-only"]').screenshot({path:'/private/tmp/og-qa-search-390.png'});

   await page.goto(base+'/v2/components/#loading');const mileage=page.locator('[data-loading-example="mileage"]');await mileage.waitFor();
   await check('continuous mileage masks preserve ready geometry @'+width,async()=>{
    const masks=await mileage.locator('[data-skeleton] :is(.mileage-title,.graph-labels)').evaluateAll(ns=>ns.map(n=>({fill:getComputedStyle(n).backgroundColor,children:[...n.children].map(c=>getComputedStyle(c).backgroundColor)})));
    assert.equal(masks.length,2);for(const m of masks){assert.notEqual(m.fill,'rgba(0, 0, 0, 0)');assert.ok(m.children.every(c=>c==='rgba(0, 0, 0, 0)'));}
    const before=await mileage.boundingBox();await page.locator('[data-loading-state]').selectOption('ready');const after=await mileage.boundingBox();assert.deepEqual(after,before);
    assert.notEqual(await mileage.locator('.v2-mileage').evaluate(n=>getComputedStyle(n).boxShadow),'none');
   });
   await page.locator('[data-loading-state]').selectOption('loading');
   if(width===390)await mileage.screenshot({path:'/private/tmp/og-qa-loading-390.png'});

   const faq=await gallery('faq');
   await check('FAQ shadow has room without losing card depth @'+width,async()=>{
    for(const state of ['basic','best']){
     const metrics=await faq.locator('[data-source-state="'+state+'"] .og-faq-carousel').evaluate(n=>{
      const r=n.getBoundingClientRect(),c=n.querySelector('.og-faq-best-card'),b=c.getBoundingClientRect(),s=getComputedStyle(n);
      return {left:b.left-r.left,top:b.top-r.top,bottom:r.bottom-b.bottom,paddingRight:parseFloat(s.paddingRight),shadow:getComputedStyle(c).boxShadow,scrollable:s.overflowX};
     });
     assert.ok(metrics.left>=12&&metrics.top>=12&&metrics.bottom>=16&&metrics.paddingRight>=12);assert.notEqual(metrics.shadow,'none');assert.equal(metrics.scrollable,'auto');
    }
   });
   if(width===390)await faq.locator('[data-source-state="best"] .v2-source-frame').screenshot({path:'/private/tmp/og-qa-faq-390.png'});

   await page.goto(base+'/v2/my-info/#reservation-detail');const reservation=page.locator('[data-reservation-state="confirmed"] .v2-reservation-detail');await reservation.waitFor();
   await check('reservation notices flat; store card unchanged @'+width,async()=>{
    assert.ok(await reservation.locator('.og-reservation-notice').evaluateAll(ns=>ns.length>0&&ns.every(n=>getComputedStyle(n).boxShadow==='none')));
    assert.notEqual(await reservation.locator('.og-reservation-store').evaluate(n=>getComputedStyle(n).boxShadow),'none');
   });
   if(width===390){await reservation.locator('.og-reservation-body').evaluate(n=>n.scrollTop=n.scrollHeight);await reservation.screenshot({path:'/private/tmp/og-qa-reservation-390.png'});}

   const writing=await gallery('review-write');
   await check('attachment X has no circular surface @'+width,async()=>{
    const x=await writing.locator('[data-source-state="selected"] .og-write-delete').evaluate(n=>({pseudo:getComputedStyle(n,'::before').content,fill:getComputedStyle(n).backgroundColor,shadow:getComputedStyle(n).boxShadow,size:[n.clientWidth,n.clientHeight],icon:n.querySelector('svg').dataset.sourceIcon}));
    assert.ok(['none','normal'].includes(x.pseudo));assert.equal(x.fill,'rgba(0, 0, 0, 0)');assert.equal(x.shadow,'none');assert.ok(x.size.every(v=>v>=44));assert.equal(x.icon,'close');
   });
   await check('photo help headings have no leading icons @'+width,async()=>{
    const help=writing.locator('[data-source-state="help"]');assert.equal(await help.locator('.og-write-help h4').count(),2);assert.equal(await help.locator('.og-write-help h4 svg').count(),0);assert.equal(await help.locator('.og-write-help-close svg').count(),1);
   });
   if(width===390){for(const state of ['selected','help'])await writing.locator('[data-source-state="'+state+'"] .v2-source-frame').screenshot({path:'/private/tmp/og-qa-writing-'+state+'-390.png'});}
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  }
  console.log('Designer QA clear fixes: '+passed+' passed; '+failures.length+' failed.');assert.deepEqual(failures,[]);
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
