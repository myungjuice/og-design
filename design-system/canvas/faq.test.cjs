const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 await page.goto('http://127.0.0.1:4173/design-system/canvas/#my-info-faq');
 await page.waitForFunction(()=>document.querySelector('#viewport')?.getAttribute('aria-busy')==='false');
 assert.equal(await page.locator('#my-info-faq .og-faq').count(),4);
 assert.equal(await page.locator('[data-review-go="board-my-info-faq"]').count(),1);
 await page.locator('#my-info-faq [data-screen-prompt]').click({force:true});
 await page.waitForFunction(()=>document.querySelector('#screen-prompt-text').value.includes('.og-faq-categories'));
 assert.match(await page.locator('#screen-prompt-text').inputValue(),/faq.dart/);
 const specimen=await browser.newPage();await specimen.goto('http://127.0.0.1:4173/design-system/pages/my-info/');
 for(const width of [320,375,414,768])for(const [state,props]of [['basic',{}],['best',{bestIndex:0}],['category',{categoryIndex:0}],['answer',{categoryIndex:0,itemIndex:0}]]){
  await specimen.setViewportSize({width,height:820});
  await specimen.evaluate(async props=>{const {faq}=await import('/design-system/pages/my-info/faq.mjs');document.head.innerHTML='<link rel="stylesheet" href="/design-system/pages/my-info/faq.css"><style>html,body{margin:0;overflow-x:clip}body{padding:0}</style>';document.body.innerHTML=faq(props);},props);
  await specimen.waitForFunction(()=>getComputedStyle(document.querySelector('.og-faq')).display==='flex');await specimen.evaluate(()=>document.fonts.ready);
  const measurements=await specimen.evaluate(()=>{const q=document.querySelector('.og-faq');const selected=document.querySelector('.og-faq-best-card.is-selected,.og-faq-categories>[aria-pressed="true"]');return {root:q.getBoundingClientRect().width,scroll:document.querySelector('.og-faq-scroll').scrollWidth,inner:document.querySelector('.og-faq-scroll').clientWidth,selectedColor:selected?getComputedStyle(selected).color:null,clipped:[...document.querySelectorAll('.og-faq button')].filter(e=>e.scrollWidth>e.clientWidth+1).length};});
  assert(measurements.root<=width+1,JSON.stringify(measurements));assert(measurements.scroll<=measurements.inner+1,JSON.stringify(measurements));assert.equal(measurements.clipped,0);
  if(state!=='basic')assert.equal(measurements.selectedColor,'rgb(255, 255, 255)');
  await specimen.screenshot({path:'/private/tmp/faq-'+state+'-'+width+'.png'});
 }
 console.log('PASS FAQ: four states at four widths, prompt CSS, automatic review registration');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
