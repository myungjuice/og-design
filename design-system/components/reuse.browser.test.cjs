const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict');
const {existsSync}=require('node:fs');
(async()=>{
 assert.ok(existsSync(__dirname+'/index.css'),'shared stylesheet entry must exist');
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  // Mutation probe: modifying the actual shared renderer must reach every consumer.
  await page.route('**/components/button/render.mjs',async route=>{
   const response=await route.fetch();
   const source=(await response.text()).replace("return '<button type=","return '<button data-reuse-probe=\"1\" type=");
   await route.fulfill({response,body:source,contentType:'text/javascript'});
  });
  await page.goto('http://127.0.0.1:4173/design-system/canvas/');
  await page.evaluate(()=>document.fonts.ready);
  assert.equal(await page.locator('.board').count(),29);
  const unmigrated=await page.locator('.board .og-button:not([data-reuse-probe])').count();
  assert.equal(unmigrated,0,'all visible standard buttons must originate in the shared renderer');
  assert.ok(await page.locator('#dialogs .og-button[data-reuse-probe]').count()>0);
  assert.ok(await page.locator('#sheet .og-button[data-reuse-probe]').count()>0);
  const style=el=>{const s=getComputedStyle(el);return Object.fromEntries(['fontFamily','fontSize','lineHeight','minHeight','padding','borderRadius','backgroundColor','color'].map(k=>[k,s[k]]));};
  const canvasStyle=await page.locator('#buttons [data-button-variant="primary"] .og-button').evaluate(style);
  await page.goto('http://127.0.0.1:4173/');
  await page.setContent('<!doctype html><html lang="ko"><head><link rel="stylesheet" href="/design-system/components/index.css"></head><body><main id="probe"></main></body></html>');
  await page.evaluate(async()=>{
   const ui=await import('/design-system/components/index.mjs');
   document.querySelector('#probe').innerHTML=ui.surface({contentHTML:ui.sectionHeading({title:'공통 컴포넌트'})+ui.textField({label:'닉네임'})+ui.textField({label:'전화번호',type:'tel'})+ui.button({label:'다음',attributes:{id:'shared-next'}})+ui.quantity({value:1})});
  });
  await page.evaluate(()=>document.fonts.ready);
  assert.deepEqual(await page.locator('#shared-next').evaluate(style),canvasStyle,'isolated page must match canvas without canvas CSS');
  assert.equal(await page.locator('#shared-next[data-reuse-probe]').count(),1);
  const ids=await page.locator('[id]').evaluateAll(nodes=>nodes.map(n=>n.id));
  assert.equal(new Set(ids).size,ids.length);
  assert.equal(await page.locator('[data-quantity-minus]:disabled').count(),1);
  assert.equal(await page.locator('[data-quantity-plus]:disabled').count(),0);
  for(const width of [320,375,414,768]){
   await page.setViewportSize({width,height:900});
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'isolated consumer fits '+width);
  }
  assert.deepEqual(errors,[]);
  console.log('PASS: shared renderer mutation reaches canvas/composites/isolated page; isolated CSS, IDs, quantity bounds and four widths');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
