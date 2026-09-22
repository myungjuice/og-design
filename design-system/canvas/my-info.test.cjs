const{chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});try{
 const p=await b.newPage({viewport:{width:1440,height:1000}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:4173/design-system/canvas/#my-info-main');await p.evaluate(()=>document.fonts.ready);await p.waitForFunction(()=>document.querySelector('#viewport').getAttribute('aria-busy')==='false');
 assert.equal(await p.locator('#my-info-main .og-my-info').count(),1,'main screen mounted');
 assert.equal(await p.locator('#my-info-main .og-menu-tile').count(),6);
 assert.equal(await p.locator('#my-info-main .og-my-profile').count(),1,'profile layout class survives composition');
 assert.equal(await p.locator('#my-info-main .og-my-info .og-mileage-summary').count(),1);
 assert.equal(await p.locator('#my-info-main .og-app-bottom-nav button').count(),5);
 assert.equal(await p.locator('#my-info-main .og-my-info[inert]').count(),1);
 assert.equal(await p.locator('#my-info-main .og-my-info .og-mileage-summary dt .og-progress-dot').count(),1);
 assert.equal(await p.locator('#my-info-main .screen-mileage-help .og-popover').count(),1);
 const navGeometry=await p.locator('#my-info-main .og-app-bottom-nav').evaluate(n=>{const r=n.getBoundingClientRect();const icon=n.querySelector('.og-app-barcode>.material-icons').getBoundingClientRect();const labels=[...n.querySelectorAll('button>span:last-child')].map(x=>x.getBoundingClientRect().top);return{raised:icon.top<r.top,aligned:Math.max(...labels)-Math.min(...labels)<1};});
 assert.ok(navGeometry.raised,'barcode protrudes without inflating white bar');assert.ok(navGeometry.aligned,'all navigation labels align');
 const layout=await p.evaluate(()=>({region:(()=>{let n=document.querySelector('#screen-region');return{x:n.offsetLeft,y:n.offsetTop,w:n.offsetWidth,h:n.offsetHeight}})(),pages:[...document.querySelectorAll('.screen-page[data-family="my-info"]')].map(n=>({x:n.offsetLeft,y:n.offsetTop,w:n.offsetWidth,h:n.offsetHeight})),world:{w:document.querySelector('#world').offsetWidth,h:document.querySelector('#world').offsetHeight}}));
 const upper=await p.locator('#foundation-region,#component-region').evaluateAll(ns=>ns.map(n=>({x:n.offsetLeft,bottom:n.offsetTop+n.offsetHeight})));
 assert.equal(layout.region.x,Math.min(...upper.map(n=>n.x)),'page area aligns with foundations');
 assert.ok(layout.region.y>=Math.max(...upper.map(n=>n.bottom))+320,'page area sits below both existing regions');
 assert.ok(layout.pages[0].y>=layout.region.y+136,'page content clears region heading');
 const comparisons=await p.locator('.mileage-variant-page').evaluateAll(ns=>ns.map(n=>({right:n.offsetLeft+n.offsetWidth,x:n.offsetLeft,y:n.offsetTop,fits:n.querySelector('.og-my-info').scrollWidth<=n.querySelector('.og-my-info').clientWidth})));
 assert.equal(comparisons.length,3);assert.equal(new Set(comparisons.map(n=>n.y)).size,1);
 comparisons.forEach(n=>{assert.ok(n.right<layout.region.x);assert.ok(n.fits);});
 assert.ok(layout.pages.length>15);assert.equal(new Set(layout.pages.map(n=>n.x)).size,1,'same family stays vertical');
 for(let i=0;i<layout.pages.length;i++){const n=layout.pages[i];assert.ok(n.x>=layout.region.x&&n.x+n.w<=layout.region.x+layout.region.w);assert.ok(n.y+n.h<=layout.region.y+layout.region.h);if(i)assert.ok(n.y>=layout.pages[i-1].y+layout.pages[i-1].h);}
 assert.ok(layout.world.h>=layout.region.y+layout.region.h);
 assert.equal(await p.locator('.screen-placeholder button,.screen-placeholder input').count(),0,'reserved pages stay empty');
 await p.locator('#my-info-main [data-screen-prompt]').click();await p.waitForFunction(()=>document.querySelector('#screen-prompt-copy')?.disabled===false);
 const prompt=await p.locator('#screen-prompt-text').inputValue();assert.ok(prompt.includes('og-my-info')&&prompt.includes('--app-gradient-brand')&&prompt.includes('og-menu-tile'));
 await p.locator('#screen-prompt-close').click();
 const readAmount=n=>getComputedStyle(n).color;
 const canvasAmountColor=await p.locator('#my-info-main .og-mileage-summary dd').nth(1).evaluate(readAmount);
 const before=await p.locator('#world').getAttribute('style');await p.locator('[data-screen-link="my-info-settings"]').click();assert.notEqual(await p.locator('#world').getAttribute('style'),before);
 for(const width of [320,375,414,768]){
  await p.setViewportSize({width,height:900});assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 }
 await p.goto('http://127.0.0.1:4173/design-system/pages/my-info/');await p.evaluate(()=>document.fonts.ready);
 assert.equal(await p.locator('.og-mileage-summary dd').nth(1).evaluate(readAmount),canvasAmountColor,'amount color independent of canvas CSS');
 for(const width of [320,375,414,768]){
  await p.setViewportSize({width,height:900});assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'standalone '+width);
  assert.ok(await p.locator('.og-my-info').evaluate(n=>n.scrollWidth<=n.clientWidth),'screen fits '+width);
  assert.ok(await p.locator('.og-mileage-summary dd').evaluateAll(ns=>ns.every(n=>n.offsetHeight<=parseFloat(getComputedStyle(n).lineHeight)+1)),'amount remains one line at '+width);
 }
 assert.deepEqual(errors,[]);console.log('PASS: my-info shared components, vertical reserved pages, region bounds, prompt, navigation and four widths');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
