const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});try{
 const p=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:4173/design-system/canvas/#my-info-customer-center');await p.waitForFunction(()=>document.querySelector('#viewport')?.getAttribute('aria-busy')==='false');
 assert.equal(await p.locator('#my-info-customer-center .og-customer-center').count(),1);assert.equal(await p.locator('[data-review-go="board-my-info-customer-center"]').count(),1);
 await p.locator('#my-info-customer-center [data-screen-prompt]').click({force:true});await p.waitForFunction(()=>document.querySelector('#screen-prompt-text').value.includes('.og-customer-contact'));assert.match(await p.locator('#screen-prompt-text').inputValue(),/customer_center.dart/);
 await p.goto('http://127.0.0.1:4173/design-system/pages/my-info/');
 await p.evaluate(async()=>{const l=document.createElement('link');l.rel='stylesheet';l.href='/design-system/pages/my-info/customer-center.css';document.head.append(l);await new Promise(r=>l.onload=r);const s=document.createElement('style');s.textContent='html,body{margin:0;padding:0;overflow-x:clip}';document.head.append(s);});
 for(const width of [320,375,414,768])for(const long of [false,true]){
  await p.setViewportSize({width,height:820});await p.evaluate(async long=>{const {customerCenter}=await import('/design-system/pages/my-info/customer-center.mjs');document.body.innerHTML=customerCenter(long?{email:'very.long.customer.service.email@example.com'}:{});await document.fonts.ready;},long);
  const result=await p.evaluate(()=>{const root=document.querySelector('.og-customer-scroll');return {overflow:root.scrollWidth>root.clientWidth+1,overlap:[...document.querySelectorAll('.og-customer-contact')].some(row=>row.querySelector('p').getBoundingClientRect().right>row.querySelector('button').getBoundingClientRect().left),missing:[...new Set([...Array.from([...document.styleSheets].find(s=>s.href?.endsWith('/customer-center.css')).cssRules).map(r=>r.cssText).join('').matchAll(/var\((--[^),]+)/g)].map(m=>m[1]))].filter(t=>!getComputedStyle(document.documentElement).getPropertyValue(t).trim())};});assert.equal(result.overflow,false);assert.equal(result.overlap,false);assert.deepEqual(result.missing,[]);
  if(!long)await p.screenshot({path:'/private/tmp/customer-center-'+width+'.png'});
 }
 assert.deepEqual(errors,[]);console.log('PASS customer center: 4 widths, long email, named tokens, prompt, review registration');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
