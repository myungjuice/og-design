const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 // A stale stylesheet must not leave the expanded boards outside the background.
 await page.route('**/area-layout.css',async route=>{const response=await route.fetch();await route.fulfill({response,body:(await response.text()).replace('width:4096px','width:2480px').replace('width:7480px','width:5864px')});});
 await page.goto('http://127.0.0.1:4173/design-system/canvas/');await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(250);
 const layout=await page.evaluate(()=>{
  const rect=e=>({x:e.offsetLeft,y:e.offsetTop,w:e.offsetWidth,h:e.offsetHeight});
  return {foundation:rect(document.querySelector('#foundation-region')),component:rect(document.querySelector('#component-region')),boards:[...document.querySelectorAll('.board')].map(b=>({...rect(b),id:b.id})),backgrounds:[...document.querySelectorAll('.system-region')].map(e=>getComputedStyle(e).backgroundColor)};
 });
 assert(layout.component.x>layout.foundation.x+layout.foundation.w,'separate right-hand boundary');
 assert(layout.backgrounds.every(b=>b!=='rgba(0, 0, 0, 0)'));
 const foundations=layout.boards.filter(b=>!['buttons','inputs','selection','tabs-chips','search','badges','avatar','surfaces','list-row','section-heading','progress','loading','feedback','help','quantity','sheet','dialogs','snackbar','date-time','attachments'].includes(b.id));
 assert.equal(new Set(foundations.map(b=>b.x)).size,4);
 const components=layout.boards.filter(b=>!foundations.includes(b));
 assert.equal(new Set(components.map(b=>b.x)).size,7,'components extend horizontally across seven columns');
 assert(layout.component.h/layout.component.w<1.3,'component area stays close to square');
 for(const b of layout.boards){
  const r=['buttons','inputs','selection','tabs-chips','search','badges','avatar','surfaces','list-row','section-heading','progress','loading','feedback','help','quantity','sheet','dialogs','snackbar','date-time','attachments'].includes(b.id)?layout.component:layout.foundation;
  assert(b.x>=r.x&&b.y>=r.y&&b.x+b.w<=r.x+r.w&&b.y+b.h<=r.y+r.h,'board inside correct boundary');
 }
 for(const [i,a] of layout.boards.entries())for(const b of layout.boards.slice(i+1))assert(a.x+a.w<=b.x||b.x+b.w<=a.x||a.y+a.h<=b.y||b.y+b.h<=a.y,'no overlap');
 await page.locator('#fit').click();await page.screenshot({path:'/private/tmp/og-system-area.png'});
 console.log('PASS: foundation four columns, separate component boundary, backgrounds, no overlaps');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
