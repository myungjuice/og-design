const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict');
async function run(only){
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1100},permissions:['clipboard-read','clipboard-write']});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4173/design-system/canvas/');
  const expected={help:4,sheet:6,progress:5,loading:6,feedback:4,search:5,avatar:4,badges:5,selection:3,'tabs-chips':5,inputs:2,quantity:0,'section-heading':2};
  for(const [id,count] of Object.entries(expected)){
   if(only&&id!==only)continue;
   const board=page.locator('#'+id);assert(await board.locator('[data-static-state]').count()>=count,id+' must show states without interaction');
   assert.equal(await board.locator('select').count(),0,id+' has no state picker');
   const live=await board.locator('button,input,textarea,[tabindex],a,summary').evaluateAll(es=>es.filter(e=>!e.matches('[data-field-prompt],[data-board-prompt],[data-prompt]')&&!e.closest('[inert]')).map(e=>e.outerHTML));
   assert.deepEqual(live,[],id+' sample controls must not be interactive');
  }
  assert.equal(await page.locator('#sheet-choice-dialog,#sheet-scroll-dialog').count(),0);
  assert.equal(await page.locator('#help [popover]').count(),0);
  const before=await page.locator('#help').innerHTML();await page.locator('#help .og-help-trigger').first().evaluate(e=>e.click());await page.waitForTimeout(900);assert.equal(await page.locator('#help').innerHTML(),before,'sample click cannot open UI');
  const duplicates=await page.evaluate(()=>{const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);return ids.filter((id,i)=>ids.indexOf(id)!==i);});assert.deepEqual(duplicates,[]);
  await page.locator('[data-board="help"]').click();await page.locator('[data-board-prompt="help"]').click();await page.waitForFunction(()=>!document.querySelector('#board-prompt-copy').disabled);const value=await page.locator('#board-prompt-text').inputValue();assert(value.includes('툴팁'));await page.locator('#board-prompt-copy').click();assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),value);await page.keyboard.press('Escape');
  for(const width of [320,375,414,768]){await page.setViewportSize({width,height:900});await page.locator('#board-picker').selectOption(only||'help');assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
  assert.deepEqual(errors,[]);console.log('PASS: static states, noninteractive samples, unique IDs, prompt copy, mobile'+(only?' / '+only:''));
 }finally{await browser.close();}
}
module.exports=run;
if(require.main===module)run().catch(e=>{console.error(e);process.exitCode=1;});
