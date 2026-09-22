const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 let count=0;
 for(const canvas of ['explore','store']){
  await page.goto('http://127.0.0.1:4173/design-system/canvas/?canvas='+canvas);
  await page.waitForFunction(()=>document.querySelector('#viewport')?.getAttribute('aria-busy')==='false');
  const frames=await page.locator('[data-family="home"] .screen-artboard:not(.og-depth-proposal)').evaluateAll(ns=>ns.map(n=>{
   const css=getComputedStyle(n),nav=n.querySelector('.og-app-bottom-nav');
   return {outline:css.outlineStyle,width:css.outlineWidth,offset:css.outlineOffset,w:n.offsetWidth,h:n.offsetHeight,childHeight:n.firstElementChild.offsetHeight,navInside:!nav||(()=>{const a=n.getBoundingClientRect(),b=nav.getBoundingClientRect();return b.left>=a.left-1&&b.right<=a.right+1&&b.bottom<=a.bottom+1;})()};
  }));
  assert.ok(frames.length>0);
  for(const f of frames){assert.equal(f.outline,'solid');assert.equal(f.width,'1px');assert.equal(f.offset,'-1px');assert.equal(f.w,375);assert.ok(f.h>=f.childHeight);assert.ok(f.navInside);}
  count+=frames.length;
 }
 assert.equal(count,58);console.log('PASS: all 58 home/explore/store screen specimens have a shared full-height frame without changing content width');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
