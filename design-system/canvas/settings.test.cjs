const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});try{
 const p=await b.newPage({viewport:{width:1440,height:1000}});
 await p.goto('http://127.0.0.1:4173/design-system/canvas/#my-info-settings');await p.waitForFunction(()=>document.querySelector('#viewport')?.getAttribute('aria-busy')==='false');assert.equal(await p.locator('#my-info-settings .og-settings').count(),4);assert.equal(await p.locator('[data-review-go="board-my-info-settings"]').count(),1);
 await p.locator('#my-info-settings [data-screen-prompt]').click({force:true});await p.waitForFunction(()=>document.querySelector('#screen-prompt-text').value.includes('.og-settings-group'));assert.match(await p.locator('#screen-prompt-text').inputValue(),/setting_main.dart/);
 await p.goto('http://127.0.0.1:4173/design-system/pages/my-info/');await p.evaluate(async()=>{const l=document.createElement('link');l.rel='stylesheet';l.href='/design-system/pages/my-info/settings.css';document.head.append(l);await new Promise(r=>l.onload=r);const s=document.createElement('style');s.textContent='html,body{margin:0;padding:0;overflow-x:clip}';document.head.append(s);});
 for(const width of [320,375,414,768])for(const state of [0,1,2,3]){
  await p.setViewportSize({width,height:820});await p.evaluate(async state=>{const {settingsBoard}=await import('/design-system/pages/my-info/settings.mjs');const w=document.createElement('div');w.innerHTML=settingsBoard();document.body.replaceChildren(w.querySelectorAll('.og-settings')[state]);await document.fonts.ready;},state);
  const result=await p.evaluate(()=>{const body=document.querySelector('.og-sheet-body'),sw=[...document.querySelectorAll('.og-settings-group [role=switch]')].map(n=>n.getBoundingClientRect().right);return {fits:body.scrollWidth<=body.clientWidth+1,aligned:Math.max(...sw)-Math.min(...sw)<1,footer:document.querySelector('.og-sheet-footer').getBoundingClientRect().bottom};});assert.ok(result.fits);assert.ok(result.aligned);assert.ok(result.footer<=801);
  if(width===320||width===375)await p.screenshot({path:'/private/tmp/settings-'+state+'-'+width+'.png'});
 }
 console.log('PASS settings: 4 states, 4 widths, aligned switches, footer, AI prompt and review');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
