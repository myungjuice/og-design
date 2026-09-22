const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});try{
 const p=await b.newPage({viewport:{width:1440,height:1000}});
 await p.goto('http://127.0.0.1:4173/design-system/canvas/#my-info-main');await p.waitForSelector('.og-wait-detail',{state:'attached'});await p.evaluate(()=>document.fonts.ready);await p.waitForFunction(()=>document.querySelector('#viewport').getAttribute('aria-busy')==='false');
 const stats=await p.evaluate(async()=>{
  const world=document.querySelector('#world'),output=document.querySelector('#zoom-value'),viewport=document.querySelector('#viewport');
  let transforms=0,labels=0;
  const a=new MutationObserver(rs=>transforms+=rs.filter(r=>r.attributeName==='style').length),b=new MutationObserver(rs=>labels+=rs.length);
  a.observe(world,{attributes:true});b.observe(output,{childList:true,subtree:true,characterData:true});
  const before=new DOMMatrix(getComputedStyle(world).transform);
  for(let i=0;i<80;i++)viewport.dispatchEvent(new WheelEvent('wheel',{deltaX:1,deltaY:1,bubbles:true,cancelable:true}));
  await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  const after=new DOMMatrix(getComputedStyle(world).transform);a.disconnect();b.disconnect();
  return{transforms,labels,dx:after.e-before.e,dy:after.f-before.f};
 });
 console.log('burst measurement:',stats);
 assert.equal(stats.transforms,1,'80 input events render once per frame');
 assert.equal(stats.labels,0,'pan does not rewrite zoom controls');
 assert.equal(stats.dx,-80);assert.equal(stats.dy,-80);
 assert.ok(await p.locator('.canvas-offscreen').count()>0,'offscreen boards skip painting');
 assert.equal(await p.locator('.canvas-offscreen').first().evaluate(n=>getComputedStyle(n).contentVisibility),'hidden','offscreen pages skip descendant layout and paint, not only visibility');
 const sizes=await p.locator('.board,.screen-page').evaluateAll(ns=>ns.map(n=>[n.id,n.offsetWidth,n.offsetHeight]));
 await p.locator('[data-screen-link="my-info-waiting-detail"]').click();
 assert.ok(await p.locator('#my-info-waiting-detail').isVisible(),'navigation reveals target');
 await p.locator('#my-info-waiting-detail [data-screen-prompt]').click();
 await p.waitForFunction(()=>!document.querySelector('#screen-prompt-copy').disabled);await p.locator('#screen-prompt-close').click();
 await p.locator('#fit').click();assert.equal(await p.locator('.canvas-offscreen').count(),0,'fit reveals all boards');
 assert.deepEqual(await p.locator('.board,.screen-page').evaluateAll(ns=>ns.map(n=>[n.id,n.offsetWidth,n.offsetHeight])),sizes,'culling preserves board geometry');
 // Real pointer capture, burst drag input, then zoom around the pointer anchor.
 await p.locator('[data-screen-link="my-info-main"]').click();
 await p.mouse.move(1000,500);await p.mouse.down();
 assert.equal(await p.locator('#canvas-drag-layer:visible').count(),1,'drag uses isolated hit surface');
 assert.equal(await p.locator('#world').evaluate(n=>getComputedStyle(n).willChange),'transform','drag moves a composited surface rather than repainting all visible pages');
 assert.ok(!await p.locator('#viewport').evaluate(n=>n.classList.contains('dragging')),'no ancestor-wide drag style invalidation');
 const drag=await p.evaluate(async()=>{
  const world=document.querySelector('#world'),v=document.querySelector('#viewport');
  const before=new DOMMatrix(getComputedStyle(world).transform);let writes=0;
  const obs=new MutationObserver(rs=>writes+=rs.filter(r=>r.attributeName==='style').length);obs.observe(world,{attributes:true});
  for(let i=1;i<=40;i++)v.dispatchEvent(new PointerEvent('pointermove',{pointerId:1,clientX:1000+i,clientY:500+i,bubbles:true}));
  await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  const after=new DOMMatrix(getComputedStyle(world).transform);obs.disconnect();
  return{writes,dx:after.e-before.e,dy:after.f-before.f};
 });
 await p.mouse.up();assert.equal(await p.locator('#world').evaluate(n=>getComputedStyle(n).willChange),'auto','release drops the temporary layer');assert.equal(await p.locator('#canvas-drag-layer:visible').count(),0);assert.equal(drag.writes,1);assert.equal(drag.dx,40);assert.equal(drag.dy,40);
 const anchor=await p.evaluate(async()=>{
  const v=document.querySelector('#viewport'),world=document.querySelector('#world'),r=v.getBoundingClientRect(),px=250,py=250;
  const before=new DOMMatrix(getComputedStyle(world).transform),local=[(px-before.e)/before.a,(py-before.f)/before.a];
  v.dispatchEvent(new WheelEvent('wheel',{ctrlKey:true,deltaY:-10,clientX:r.left+px,clientY:r.top+py,bubbles:true,cancelable:true}));
  await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  const after=new DOMMatrix(getComputedStyle(world).transform);
  return {dx:local[0]*after.a+after.e-px,dy:local[1]*after.a+after.f-py,zoomed:after.a>before.a};
 });
 assert.ok(anchor.zoomed);assert.ok(Math.abs(anchor.dx)<.1&&Math.abs(anchor.dy)<.1);
 console.log('PASS: coalesced pan, unchanged controls, offscreen culling, navigation, prompt and fit');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
