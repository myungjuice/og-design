const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});try{
 const p=await b.newPage({viewport:{width:1440,height:1000}});
 await p.goto('http://127.0.0.1:4173/design-system/canvas/#home-category');await p.waitForFunction(()=>document.querySelector('#viewport')?.getAttribute('aria-busy')==='false');
 assert.equal(await p.locator('#home-category .og-home-example').count(),2);assert.equal(await p.locator('[data-review-go="board-home-category"]').count(),1);
 assert.ok(await p.evaluate(()=>{const a=document.querySelector('#home-category'),m=document.querySelector('#home-search'),r=document.querySelector('#home-region');return a.offsetLeft===m.offsetLeft&&a.offsetTop>m.offsetTop+m.offsetHeight&&a.offsetTop+a.offsetHeight<=r.offsetTop+r.offsetHeight;}));
 await p.locator('#home-category [data-home-prompt]').click({force:true});await p.waitForFunction(()=>document.querySelector('#home-prompt-text').value.includes('.og-category-options'));assert.match(await p.locator('#home-prompt-text').inputValue(),/category_selection.dart/);
 await p.goto('http://127.0.0.1:4173/design-system/pages/my-info/');await p.evaluate(async()=>{const l=document.createElement('link');l.rel='stylesheet';l.href='/design-system/pages/home/category.css';document.head.append(l);await new Promise(r=>l.onload=r);const style=document.createElement('style');style.textContent='html,body{margin:0;padding:0;overflow-x:clip}';document.head.append(style);});
 for(const width of [320,375,414,768])for(const state of ['open','selected']){
  await p.setViewportSize({width,height:800});await p.evaluate(async state=>{const {categoryScreen}=await import('/design-system/pages/home/category.mjs');document.body.innerHTML=categoryScreen({state});await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));},state);
  assert.ok(await p.evaluate(()=>document.body.scrollWidth<=innerWidth+1));
  if(state==='open'){assert.equal(await p.locator('[data-category-id]').count(),13);assert.ok(await p.locator('.og-sheet-panel').evaluate(n=>Math.abs(n.getBoundingClientRect().height-320)<2));assert.ok(await p.locator('.og-sheet-body').evaluate(n=>n.scrollWidth<=n.clientWidth+1));}
  else{assert.equal(await p.locator('.og-home-filters [aria-pressed="true"]').textContent(),'카페/베이커리');assert.equal(await p.locator('.og-sheet-panel').count(),0);}
  if(width===375)await p.screenshot({path:'/private/tmp/og-category-'+state+'.png'});
 }
 console.log('PASS category: 13 legacy icons, two states, four widths, 40% sheet, region, prompt, review');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
