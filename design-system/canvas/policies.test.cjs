const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});try{
 const p=await b.newPage({viewport:{width:1440,height:1000}});
 await p.goto('http://127.0.0.1:4173/design-system/canvas/#my-info-policies');await p.waitForFunction(()=>document.querySelector('#viewport')?.getAttribute('aria-busy')==='false');
 assert.equal(await p.locator('#my-info-policies .og-policies').count(),2);assert.equal(await p.locator('[data-review-go="board-my-info-policies"]').count(),1);
 await p.locator('#my-info-policies [data-screen-prompt]').click({force:true});await p.waitForFunction(()=>document.querySelector('#screen-prompt-text').value.includes('.og-policy-row'));assert.match(await p.locator('#screen-prompt-text').inputValue(),/policy_main.dart/);
 await p.goto('http://127.0.0.1:4173/design-system/pages/my-info/');await p.evaluate(async()=>{const l=document.createElement('link');l.rel='stylesheet';l.href='/design-system/pages/my-info/policies.css';document.head.append(l);await new Promise(r=>l.onload=r);const s=document.createElement('style');s.textContent='html,body{margin:0;padding:0;overflow-x:clip}';document.head.append(s);});
 for(const width of [320,375,414,768])for(const state of [0,1]){
  await p.setViewportSize({width,height:820});await p.evaluate(async state=>{const {policiesBoard}=await import('/design-system/pages/my-info/policies.mjs');const w=document.createElement('div');w.innerHTML=policiesBoard();document.body.replaceChildren(w.querySelectorAll('.og-policies')[state]);await document.fonts.ready;},state);
  const result=await p.evaluate(()=>{const arrows=[...document.querySelectorAll('.og-row-chevron')].map(n=>n.getBoundingClientRect().right);return {fits:[...document.querySelectorAll('.og-policies,.og-policies-scroll,.og-policy-row')].every(n=>n.scrollWidth<=n.clientWidth+1),aligned:Math.max(...arrows)-Math.min(...arrows)<1};});assert.ok(result.fits);assert.ok(result.aligned);
  if(width===320||width===375)await p.screenshot({path:'/private/tmp/policies-'+state+'-'+width+'.png'});
 }
 console.log('PASS policies: two states, four widths, aligned arrows, AI prompt and review');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
