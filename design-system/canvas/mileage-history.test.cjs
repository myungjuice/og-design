const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});try{
 const p=await b.newPage({viewport:{width:1440,height:1000}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:4173/design-system/canvas/#my-info-mileage');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(200);
 assert.equal(await p.locator('#my-info-mileage .og-history-screen[inert]').count(),3);
 assert.equal(await p.locator('#my-info-mileage .og-mileage-entry').count(),8);
 assert.equal(await p.locator('#my-info-mileage .og-mileage-empty').count(),1);
 assert.equal(await p.locator('.mileage-variant-page').count(),3);
 await p.locator('#my-info-mileage [data-screen-prompt]').click();await p.waitForFunction(()=>!document.querySelector('#screen-prompt-copy').disabled);
 const prompt=await p.locator('#screen-prompt-text').inputValue();assert.ok(prompt.includes('mileage-history.mjs')&&prompt.includes('og-sheet-panel'));
 await p.locator('#screen-prompt-close').click();
 for(const w of [320,375,414,768]){
 assert.ok(await p.locator('.og-history-screen').evaluateAll((ns,w)=>ns.every(n=>{n.style.width=w+'px';const body=n.querySelector('.og-sheet-body');return n.scrollWidth<=n.clientWidth&&body.scrollWidth<=body.clientWidth;}),w),'fits '+w);
 }
 assert.deepEqual(errors,[]);console.log('PASS: mileage history static states, shared components, prompt and four widths');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
