const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 await page.route('**/area-layout.css',async route=>{const response=await route.fetch();await route.fulfill({response,body:(await response.text()).replace('width:4096px','width:2480px')});});
 for(const [canvas,columns] of [['foundations',4],['components',7],['explore',4],['store',4],['my-info',4]]){
  await page.goto('http://127.0.0.1:4173/design-system/canvas/?canvas='+canvas);
  await page.waitForFunction(()=>document.querySelector('#viewport').getAttribute('aria-busy')==='false');
  if(['explore','store'].includes(canvas)){
   assert.equal(await page.locator('#world > .proposal-page').count(),2);
   const pos=await page.locator('#world > .proposal-page').evaluateAll(ns=>ns.map(n=>({x:n.offsetLeft,y:n.offsetTop,b:n.offsetTop+n.offsetHeight})));
   assert.equal(pos[0].y,pos[1].y);assert.ok(pos[0].x<pos[1].x);
   const originalTop=await page.locator('#world > .screen-page:not(.proposal-page)').first().evaluate(n=>n.offsetTop);
   assert.ok(pos.every(p=>p.b<originalTop));
  }
  const layout=await page.evaluate(()=>{
   const rect=e=>({x:e.offsetLeft,y:e.offsetTop,w:e.offsetWidth,h:e.offsetHeight});
   return {regions:[...document.querySelectorAll('.system-region')].map(e=>({...rect(e),color:getComputedStyle(e).backgroundColor})),boards:[...document.querySelectorAll('#world>.board,#world>.screen-page,#world>.mileage-variant-page')].map(b=>({...rect(b),id:b.id,comparison:b.matches('.mileage-variant-page,.proposal-page')}))};
  });
  assert.equal(new Set(layout.boards.filter(b=>!b.comparison).map(b=>b.x)).size,columns);
  if(['explore','store','my-info'].includes(canvas)){
   const pages=layout.boards.filter(b=>!b.comparison);
   for(let i=0;i<pages.length;i+=4){
    const row=pages.slice(i,i+4);assert(row.every(p=>p.y===row[0].y),'row tops align');
    row.forEach((p,j)=>assert.equal(p.x,48+j*808,'original reading order runs right'));
    if(i+4<pages.length)assert.equal(pages[i+4].y,Math.max(...row.map(p=>p.y+p.h))+40,'next row clears tallest page');
   }
  }
  assert(layout.regions.every(r=>r.color!=='rgba(0, 0, 0, 0)'));
  for(const b of layout.boards)assert(layout.regions.some(r=>b.x>=r.x&&b.y>=r.y&&b.x+b.w<=r.x+r.w&&b.y+b.h<=r.y+r.h),'board inside background: '+b.id);
  for(const [i,a] of layout.boards.entries())for(const b of layout.boards.slice(i+1))assert(a.x+a.w<=b.x||b.x+b.w<=a.x||a.y+a.h<=b.y||b.y+b.h<=a.y,'no overlap');
 }
 console.log('PASS: five independent boundaries, original grid columns, four-column page rows and no overlaps');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
