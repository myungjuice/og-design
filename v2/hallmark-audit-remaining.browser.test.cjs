const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
const calendarFits=async locator=>{
 await locator.waitFor();
 assert.ok(await locator.evaluate(n=>{
  const viewport=n.closest('.v2-calendar-days'),r=viewport.getBoundingClientRect();
  return viewport.scrollWidth<=viewport.clientWidth+1&&[...n.children].every(day=>{
   const d=day.getBoundingClientRect();return d.left>=r.left-1&&d.right<=r.right+1;
  });
 }),'all seven columns must be visible without scrolling');
 const calendar=locator.locator('..');
 assert.ok(await calendar.locator('.og-calendar-day').evaluateAll(ns=>ns.every(n=>{
  const r=n.getBoundingClientRect();return r.width>=32&&r.height>=44;
 })),'compact dates retain at least 32px width and 44px height');
};
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 const failures=[];let passed=0;
 const check=async(label,run)=>{try{await run();passed++;console.log('PASS '+label);}catch(e){failures.push(label+': '+e.message);console.error('FAIL '+label+': '+e.message);}};
 try{
  for(const width of [320,375,390,414,768]){
   const page=await browser.newPage({viewport:{width,height:1100}});
   try{
    for(const id of ['date-picker','range-picker']){
     await page.goto(base+'/v2/components/#'+id);
     await check(id+' whole week @'+width,()=>calendarFits(page.locator('#'+id+' .og-calendar-week')));
     if([320,390].includes(width))await page.locator('#'+id+' .v2-picker-stage').screenshot({path:'/private/tmp/og-remaining-'+id+'-'+width+'.png'});
    }
    await page.goto(base+'/v2/my-info/#reservation-pickers');
    await check('reservation whole week @'+width,()=>calendarFits(page.locator('[data-reservation-picker="date"] .og-calendar-week')));
    if([320,390].includes(width))await page.locator('[data-reservation-picker="date"] .v2-picker-frame').screenshot({path:'/private/tmp/og-remaining-reservation-'+width+'.png'});
    await page.goto(base+'/v2/my-info/#account');
    await page.locator('#account details').evaluateAll(ns=>ns.forEach(n=>n.open=true));
    const account=page.locator('#account [data-source-state="withdrawal"] .v2-source-host');
    await account.locator('.og-account-auth').waitFor();
    await page.waitForFunction(()=>['true','error'].includes(document.querySelector('#account [data-source-state="withdrawal"] .v2-source-host')?.dataset.sourceReady),null,{timeout:10000});
    assert.equal(await account.getAttribute('data-source-ready'),'true');
    await check('authentication label and action @'+width,async()=>{
     assert.ok(await account.locator('.og-account-auth').evaluate(n=>{
      const label=n.querySelector('.og-account-status>span'),button=n.querySelector('.og-button'),r=button.getBoundingClientRect();
      const range=document.createRange();range.selectNodeContents(label);
      return range.getClientRects().length===1&&r.width>=48&&r.height>=44&&n.scrollWidth<=n.clientWidth+1;
     }),'authentication status must not wrap or overflow');
    });
    if([320,390].includes(width))await account.screenshot({path:'/private/tmp/og-remaining-account-'+width+'.png'});
    await page.goto(base+'/v2/my-info/#notices');
    await page.locator('#notices details').evaluateAll(ns=>ns.forEach(n=>n.open=true));
    const notices=page.locator('#notices .v2-notices-history-host').filter({has:page.locator('.og-notification-type')}).first();
    await notices.locator('.og-notification-type').first().waitFor();
    await check('notification icon seats @'+width,async()=>{
     assert.ok(await notices.locator('.og-notification-type').evaluateAll(ns=>ns.every(n=>{
      const r=n.getBoundingClientRect(),icon=n.querySelector('svg').getBoundingClientRect();return r.width===40&&r.height===40&&icon.width===20&&icon.height===20;
     })),'40px background must surround a 20px icon');
    });
    if([320,390].includes(width))await notices.screenshot({path:'/private/tmp/og-remaining-notices-'+width+'.png'});
    await page.goto(base+'/v2/home/#full-menu');
    const featured=page.locator('#full-menu [data-full-menu-state="basic"] .og-full-menu-featured');
    await featured.waitFor();
    await check('missing menu photos @'+width,async()=>{
     const missing=featured.locator('.v2-thumbnail[data-state="empty"]');assert.equal(await missing.count(),5);
     assert.equal(await missing.locator('[data-placeholder="photo"]').count(),5,'missing photos must not use storefront art');
     assert.ok(await missing.evaluateAll(ns=>ns.every(n=>/사진.*이미지 없음/.test(n.getAttribute('aria-label'))&&!n.querySelector('img'))));
    });
    if([320,390].includes(width)){
     await featured.locator('[aria-label="대표메뉴 카드"]').evaluate(n=>n.scrollTo({left:n.scrollWidth,behavior:'instant'}));
     await featured.screenshot({path:'/private/tmp/og-remaining-full-menu-'+width+'.png'});
    }
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   }finally{await page.close();}
  }
  console.log('Remaining audit regressions: '+passed+' passed; '+failures.length+' failed.');assert.deepEqual(failures,[]);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
