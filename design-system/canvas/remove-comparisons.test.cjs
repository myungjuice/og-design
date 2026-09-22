const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});try{
const p=await b.newPage({viewport:{width:1400,height:1100}});
for(const [canvas,first,count] of [['explore','home-main',4],['store','home-store',17],['my-info','my-info-main',27]]){
 await p.goto('http://127.0.0.1:4173/design-system/canvas/?canvas='+canvas);await p.waitForFunction(()=>document.querySelector('#viewport')?.getAttribute('aria-busy')==='false');
 assert.equal(await p.locator('.proposal-page,.surface-example,.depth-proposal-section').count(),0,'top comparisons removed');
 assert.equal(await p.locator('#world>.screen-page').count(),count,'all real pages remain');
 assert.equal(await p.locator('#'+first).evaluate(n=>n.offsetTop),136,'no empty comparison rows');
 await p.locator('#review-toggle').click();assert.equal(await p.locator('[data-review-go^="surface-"],[data-review-go$="depth-subtle"],[data-review-go$="depth-proposal"]').count(),0);await p.locator('[data-review-close]').click();
 if(canvas==='my-info')assert.equal(await p.locator('.mileage-variant-page').count(),3,'left mileage comparisons preserved');
 else assert.notEqual(await p.locator(canvas==='explore'?'#home-main .og-home-top .og-field-control':'#home-store .og-store-tabs').first().evaluate(n=>getComputedStyle(n).boxShadow),'none','adopted style preserved');
}
console.log('PASS: seven top comparisons removed; real pages, left mileage variants and shared styles preserved');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
