const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict');

(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  await page.goto('http://127.0.0.1:4173/design-system/canvas/?canvas=my-info#my-info-main');
  await page.waitForFunction(()=>document.querySelector('#viewport')?.getAttribute('aria-busy')==='false');
  const original=page.locator('#my-info-main');
  assert.equal(await original.locator('.og-my-info .og-mileage-summary').count(),1,'original balance remains unchanged');
  assert.equal(await original.locator('.og-my-info .og-my-visit .og-text-button').count(),1,'original review action remains unchanged');
  const mileage=page.locator('#my-info-mileage-feedback');
  assert.equal(await mileage.locator('.og-my-info').count(),1,'mileage option is a separate complete screen');
  assert.match(await mileage.locator('.og-my-balance').innerText(),/사용 가능한 OG 마일리지/);
  assert.match(await mileage.locator('.og-my-balance').innerText(),/15,000 M/);
  assert.match(await mileage.locator('.og-my-balance').innerText(),/16,000 M/);
  assert.equal(await mileage.locator('.og-my-visit .og-text-button').count(),1,'mileage option does not change review action');
  const review=page.locator('#my-info-review-feedback');
  assert.equal(await review.locator('.og-my-info').count(),1,'review option is a separate complete screen');
  assert.equal(await review.locator('.og-mileage-summary').count(),1,'review option keeps original balance');
  assert.equal(await review.locator('.og-my-visit .og-button[data-variant="secondary"]').count(),1,'review action gets a button treatment');
  assert.equal(await review.locator('.og-section-heading .og-text-button').count(),2,'top actions remain text links');
  const positions=await page.locator('#my-info-main,#my-info-mileage-feedback,#my-info-review-feedback').evaluateAll(nodes=>nodes.map(n=>({x:n.offsetLeft,y:n.offsetTop})));
  assert.equal(new Set(positions.map(p=>p.y)).size,1,'all three boards share one row');
  assert.ok(positions[0].x<positions[1].x&&positions[1].x<positions[2].x,'comparison boards sit to the right of original');
  for(const width of [320,375,414]){
   await page.setViewportSize({width,height:900});
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'viewport fits '+width);
  }
  console.log('PASS: my-info feedback boards preserve original and compare both revisions');
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
