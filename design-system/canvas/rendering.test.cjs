const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict');
// Catch rendering every case in a long board, geometry jumps when cases return,
// and unrelated boards being revealed whenever one board changes height.
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4173/design-system/canvas/?canvas=my-info#my-info-history');
  await page.waitForFunction(()=>document.querySelector('#viewport').getAttribute('aria-busy')==='false');
  const frames=()=>page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
  const geometry=()=>page.locator('#world>.screen-page').evaluateAll(ns=>ns.map(n=>[n.id,n.offsetLeft,n.offsetTop,n.offsetWidth,n.offsetHeight]));
  const original=await geometry();
  const cases=page.locator('#my-info-history .screen-artboard');
  assert.equal(await cases.count(),8);
  assert.equal(await cases.first().evaluate(n=>getComputedStyle(n).contentVisibility),'visible','first case is rendered');
  assert.equal(await cases.last().evaluate(n=>getComputedStyle(n).contentVisibility),'hidden','distant cases skip rendering even inside a visible board');
  await page.evaluate(()=>{
   const v=document.querySelector('#viewport');
   v.dispatchEvent(new WheelEvent('wheel',{deltaY:7300,bubbles:true,cancelable:true}));
  });await frames();
  assert.equal(await cases.first().evaluate(n=>getComputedStyle(n).contentVisibility),'hidden','old case skips rendering after pan');
  assert.equal(await cases.last().evaluate(n=>getComputedStyle(n).contentVisibility),'visible','last case is revealed when approaching it');
  assert.deepEqual(await geometry(),original,'pan does not change board positions or sizes');
  await page.locator('#fit').click();await frames();
  assert.equal(await cases.evaluateAll(ns=>ns.filter(n=>getComputedStyle(n).contentVisibility==='hidden').length),0,'overview shows all cases');
  assert.deepEqual(await geometry(),original,'overview preserves the full layout');
  await page.locator('[data-screen-link="my-info-history"]').click();await frames();
  const resize=await page.evaluate(async()=>{
   const hidden=document.querySelector('#my-info-settings'),before=hidden.offsetHeight;
   const history=document.querySelector('#my-info-history'),historyBefore=history.offsetHeight;
   let reveals=0;const observer=new MutationObserver(records=>{
    for(const r of records)if(r.target.matches('#world>.screen-page:not(#my-info-history)')&&r.oldValue?.includes('canvas-offscreen'))reveals++;
   });observer.observe(document.querySelector('#world'),{attributes:true,attributeFilter:['class'],attributeOldValue:true,subtree:true});
   const card=document.querySelector('#my-info-history .screen-artboard');
   card.append(Object.assign(document.createElement('div'),{textContent:'Layout measurement probe'}));
   card.lastChild.style.height='120px';
   for(let i=0;i<6;i++)await new Promise(requestAnimationFrame);
   observer.disconnect();return{reveals,unrelatedHeightBefore:before,unrelatedHeightAfter:hidden.offsetHeight,historyGrowth:history.offsetHeight-historyBefore};
  });
  assert.equal(resize.reveals,0,'resizing one board never reveals every unrelated board');
  assert.equal(resize.unrelatedHeightAfter,resize.unrelatedHeightBefore);
  assert.equal(resize.historyGrowth,120,'changed content is measured, not ignored by the cache');
  const imageGrowth=await page.evaluate(async()=>{
   const board=document.querySelector('#my-info-settings'),before=board.offsetHeight;
   const image=new Image();image.style.display='block';
   board.querySelector('.screen-artboard').append(image);
   const loaded=new Promise(resolve=>image.onload=resolve);
   image.src='data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="60"/>';
   await loaded;for(let i=0;i<6;i++)await new Promise(requestAnimationFrame);
   return board.offsetHeight-before;
  });
  assert.equal(imageGrowth,60,'an image finishing in an offscreen case updates its cached height');
  assert.deepEqual(errors,[]);
  console.log('PASS: case-level rendering, stable pan/overview geometry and isolated resize');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
