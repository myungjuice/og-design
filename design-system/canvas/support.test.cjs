const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});try{
 const p=await b.newPage({viewport:{width:1440,height:1000}});
 await p.goto(''+(process.env.PREVIEW_URL||'http://127.0.0.1:4173')+'/design-system/canvas/#my-info-support');await p.waitForFunction(()=>document.querySelector('#viewport')?.getAttribute('aria-busy')==='false');
 assert.equal(await p.locator('#my-info-support .og-support').count(),4);assert.equal(await p.locator('[data-review-go="board-my-info-support"]').count(),1);
 await p.locator('#my-info-support [data-screen-prompt]').click({force:true});await p.waitForFunction(()=>document.querySelector('#screen-prompt-text').value.includes('PPT17'));
 await p.goto(''+(process.env.PREVIEW_URL||'http://127.0.0.1:4173')+'/design-system/pages/my-info/');await p.evaluate(async()=>{const l=document.createElement('link');l.rel='stylesheet';l.href='/design-system/pages/my-info/support.css';document.head.append(l);await new Promise(r=>l.onload=r);const s=document.createElement('style');s.textContent='html,body{margin:0;padding:0;overflow-x:clip}';document.head.append(s);});
 for(const width of [320,375,414,768])for(let state=0;state<4;state++){
  await p.setViewportSize({width,height:820});await p.evaluate(async state=>{const {supportBoard}=await import('/design-system/pages/my-info/support.mjs');const w=document.createElement('div');w.innerHTML=supportBoard();document.body.replaceChildren(w.querySelectorAll('.og-support')[state]);await document.fonts.ready;},state);
  const result=await p.evaluate(()=>{const root=document.querySelector('.og-support'),body=root.querySelector(':scope>.og-sheet-panel>.og-sheet-body'),footer=root.querySelector(':scope>.og-sheet-panel>.og-sheet-footer');return {fits:body.scrollWidth<=body.clientWidth+1,footer:footer.getBoundingClientRect().bottom<=801,missing:[...new Set([...Array.from([...document.styleSheets].find(s=>s.href?.endsWith('/support.css')).cssRules).map(r=>r.cssText).join('').matchAll(/var\((--[^),]+)/g)].map(m=>m[1]))].filter(t=>!getComputedStyle(document.documentElement).getPropertyValue(t).trim())};});assert.ok(result.fits);assert.ok(result.footer);assert.deepEqual(result.missing,[]);
  if(width===375)await p.screenshot({path:'/private/tmp/support-'+state+'.png'});
 }
 console.log('PASS support: four states, four widths, tokens, footer, prompt and review');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
