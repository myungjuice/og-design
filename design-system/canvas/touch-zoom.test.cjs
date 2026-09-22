const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
  const mobile=process.env.MOBILE==='1';
  const page=await browser.newPage({viewport:{width:mobile?344:1024,height:mobile?882:1366},hasTouch:true,isMobile:mobile});
  if(process.env.STALE_CODE==='1'){
   const old=require('node:child_process').execFileSync('git',['show','HEAD:design-system/canvas/canvas.js'],{encoding:'utf8'});
   await page.route('**/canvas.js?v=20260919-partitions',route=>route.fulfill({contentType:'text/javascript',body:old}));
  }
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto((process.env.PREVIEW_URL||'http://172.30.1.81:4173')+'/design-system/canvas/?canvas='+(process.env.CANVAS||'my-land'));
  const ready=()=>page.waitForFunction(()=>document.querySelector('#viewport').getAttribute('aria-busy')==='false');
  await ready();await page.locator('#actual').click();
  const cdp=await page.context().newCDPSession(page);
  const state=()=>page.locator('#world').evaluate(n=>{const m=new DOMMatrix(getComputedStyle(n).transform);return {x:m.e,y:m.f,scale:m.a}});
  const touch=async(type,points)=>{await cdp.send('Input.dispatchTouchEvent',{type,touchPoints:points.map(([id,x,y])=>({id,x,y,radiusX:4,radiusY:4,force:1}))});await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));};
  const near=(a,b)=>assert.ok(Math.abs(a-b)<.1,`${a} != ${b}`);
  const rect=await page.locator('#viewport').boundingBox();
  const cx=Math.round(rect.x+rect.width*.55),cy=Math.round(rect.y+350);
  const start=await state();
  await touch('touchStart',[[1,cx-60,cy],[2,cx+60,cy]]);
  await touch('touchMove',[[1,cx-90,cy+20],[2,cx+90,cy+20]]);
  const enlarged=await state();near(enlarged.scale,1.5);
  near((cx-rect.x-enlarged.x)/enlarged.scale,(cx-rect.x-start.x)/start.scale);
  near((cy+20-rect.y-enlarged.y)/enlarged.scale,(cy-rect.y-start.y)/start.scale);
  await touch('touchMove',[[1,cx-30,cy+20],[2,cx+30,cy+20]]);
  near((await state()).scale,.5);
  await touch('touchEnd',[[2,cx+30,cy+20]]);
  const single=await state();
  await touch('touchMove',[[1,cx-10,cy+35]]);
  const panned=await state();near(panned.x-single.x,20);near(panned.y-single.y,15);near(panned.scale,single.scale);
  await touch('touchEnd',[]);
  assert.equal(await page.locator('#canvas-drag-layer').evaluate(n=>n.hidden),true);
  await page.reload();await ready();const restored=await state();near(restored.x,panned.x);near(restored.y,panned.y);near(restored.scale,panned.scale);
  await touch('touchStart',[[1,cx-10,cy],[2,cx+10,cy]]);
  await touch('touchMove',[[1,cx-90,cy],[2,cx+90,cy]]);near((await state()).scale,2);
  await touch('touchCancel',[]);
  assert.equal(await page.locator('#canvas-drag-layer').evaluate(n=>n.hidden),true);
  await page.mouse.move(cx,cy);await page.mouse.down();const before=await state();await page.mouse.move(cx+30,cy+10);await page.mouse.up();
  await page.evaluate(()=>new Promise(r=>requestAnimationFrame(r)));const after=await state();near(after.x-before.x,30);near(after.y-before.y,10);
  await page.locator('#minus').click();assert.ok((await state()).scale<after.scale);
  assert.deepEqual(errors,[]);
  console.log('PASS: native two-touch zoom, midpoint anchoring, pinch-to-pan, persistence, clamp, cancellation and mouse controls');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
