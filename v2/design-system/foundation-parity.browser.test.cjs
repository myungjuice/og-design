const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
const style=(n,keys)=>{const s=getComputedStyle(n);return keys.map(k=>s[k]);};
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1100}}),reference=await browser.newPage({viewport:{width:1440,height:1100}});
  await page.goto(base+'/v2/design-system/#materials');
  await page.locator('#materials').waitFor();
  assert.equal(await page.locator('.v2-material-input').count(),1,'foundation guide distinguishes the raised Home input material');
  for(const [sample,url,selector,keys] of [
   ['input','/v2/home/','.home-search-form',['backgroundImage','boxShadow','borderRadius']],
   ['action','/v2/barcode/','.barcode-use',['backgroundImage','boxShadow','borderRadius','height','fontSize','lineHeight','fontWeight']],
   ['panel','/v2/my-info/','.recent-card',['backgroundColor','boxShadow','borderRadius']],
   ['tile','/v2/my-info/','.service-face',['backgroundColor','boxShadow','borderRadius','width','height']],
   ['primary','/v2/my-info/','.v2-mileage',['backgroundColor','boxShadow','borderRadius']]
  ]){
   await reference.goto(base+url);await reference.locator(selector).first().waitFor();
   assert.deepEqual(await page.locator('.v2-material-'+sample).evaluate(style,keys),await reference.locator(selector).first().evaluate(style,keys),sample+' specimen follows the actual screen');
   if(sample==='tile')assert.deepEqual(await page.locator('.v2-material-tile').evaluate(n=>getComputedStyle(n,'::after').boxShadow),await reference.locator(selector).first().evaluate(n=>getComputedStyle(n,'::after').boxShadow));
  }
  await page.goto(base+'/v2/design-system/#typography');
  await reference.goto(base+'/v2/my-info/');
  for(const [sample,selector] of [['app-heading','.recent-heading h2'],['mileage-title','.mileage-title>div'],['store-name','.visit-copy strong'],['visit-date','.visit-copy>span'],['menu-caption','.service-tile'],['nav-label','.nav-item:not(.is-selected)']]){
   const keys=['fontSize','lineHeight','fontWeight'];
   assert.deepEqual(await page.locator('[data-type="'+sample+'"]').evaluate(style,keys),await reference.locator(selector).first().evaluate(style,keys),sample+' uses the actual screen typography');
  }
  await page.goto(base+'/v2/design-system/#radius');await reference.goto(base+'/v2/barcode/');
  assert.equal(await page.locator('.v2-radius-sheet').evaluate(n=>getComputedStyle(n).borderRadius),await reference.locator('.barcode-sheet').evaluate(n=>getComputedStyle(n).borderRadius));
  await reference.goto(base+'/v2/my-info/');
  assert.equal(await page.locator('.v2-radius-navigation').evaluate(n=>getComputedStyle(n).borderRadius),await reference.locator('.bottom-navigation').evaluate(n=>getComputedStyle(n).borderRadius));
  console.log('Foundation parity: Home input, barcode action/sheet, My Info panel/tile/mileage/type/navigation passed');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
