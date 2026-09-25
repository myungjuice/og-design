const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});try{
 const p=await b.newPage({viewport:{width:1440,height:1000}});
 const base=process.env.PREVIEW_URL||'http://127.0.0.1:4173';
 await p.goto(base+'/design-system/canvas/#my-info-main');
 const ready=()=>p.waitForFunction(()=>document.querySelector('#viewport')?.getAttribute('aria-busy')==='false');
 await ready();
 for(const id of ['main','mileage','history','reservation-detail','reservation-change','waiting-detail']){
  assert.equal(await p.locator('#my-info-'+id+'>.canvas-review-controls [data-review-set="pending"]').getAttribute('aria-pressed'),'true');
  assert.match(await p.locator('#my-info-'+id+'>.canvas-review-note').textContent(),/기획:[\s\S]*기존 페이지:/);
 }
 await p.locator('#my-info-main [data-review-set="done"]').click({force:true});
 await p.reload();await ready();
 assert.equal(await p.locator('#my-info-main [data-review-set="done"]').getAttribute('aria-pressed'),'true');
 await p.goto(base+'/design-system/pages/my-info/');await p.evaluate(()=>document.fonts.ready);
 for(const width of [320,375,414,768]){
  await p.setViewportSize({width,height:900});
  assert.equal(await p.locator('.og-mileage-summary dt').nth(1).innerText(),'보유 마일리지');
  assert.ok(await p.locator('.og-my-info').evaluate(n=>n.scrollWidth<=n.clientWidth));
  assert.ok(await p.locator('.og-mileage-summary dt').evaluateAll(ns=>ns.every(n=>n.scrollWidth<=n.clientWidth)));
  if(width===320)await p.screenshot({path:'/private/tmp/balance-label-320.png'});
 }
 console.log('PASS: early review enrollment, saved completion, balance labels at four widths');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1});
