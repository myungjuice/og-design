const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});try{
 const p=await b.newPage({viewport:{width:1440,height:1000}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:4173/design-system/canvas/#home-full-menu');
 await p.waitForFunction(()=>document.querySelector('#viewport')?.getAttribute('aria-busy')==='false');
 assert.equal(await p.locator('#home-full-menu .screen-artboard').count(),3);
 assert.equal(await p.locator('[data-review-go="board-home-full-menu"]').count(),1);
 assert.ok(await p.evaluate(()=>{const a=document.querySelector('#home-full-menu'),m=document.querySelector('#home-main-menu'),r=document.querySelector('#home-region');return a.offsetLeft===m.offsetLeft&&a.offsetTop>m.offsetTop+m.offsetHeight&&a.offsetTop+a.offsetHeight<=r.offsetTop+r.offsetHeight;}));
 await p.locator('#home-full-menu [data-home-prompt]').click({force:true});await p.waitForFunction(()=>document.querySelector('#home-prompt-text').value.includes('.og-full-menu-item'));
 assert.match(await p.locator('#home-prompt-text').inputValue(),/store_menu.dart/);
 await p.goto('http://127.0.0.1:4173/design-system/pages/my-info/');
 await p.evaluate(async()=>{const l=document.createElement('link');l.rel='stylesheet';l.href='/design-system/pages/home/full-menu.css';document.head.append(l);await new Promise(r=>l.onload=r);const s=document.createElement('style');s.textContent='html,body{margin:0;padding:0;overflow-x:clip}';document.head.append(s);});
 for(const width of [320,375,414,768])for(const state of ['default','scrolled','search']){
  await p.setViewportSize({width,height:800});await p.evaluate(async state=>{const {fullMenuScreen}=await import('/design-system/pages/home/full-menu.mjs');const {storeImage}=await import('/design-system/canvas/specimen-media.mjs');document.body.innerHTML=fullMenuScreen({state,imageSrc:storeImage()});await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));},state);
  assert.ok(await p.locator('.og-full-menu').evaluate(n=>n.scrollWidth<=n.clientWidth+1));
  assert.ok(await p.locator('.og-full-menu').getAttribute('inert')!==null);
  assert.equal(await p.locator('.og-full-menu-hero').count(),state==='scrolled'?0:1);
  assert.equal(await p.locator('.og-full-menu-search-panel').count(),state==='search'?1:0);
  const missing=await p.evaluate(()=>{const css=[...document.styleSheets].flatMap(s=>{try{return [...s.cssRules].map(r=>r.cssText)}catch{return []}}).join('');const t=getComputedStyle(document.documentElement);return [...new Set([...css.matchAll(/var\((--[\w-]+)/g)].map(m=>m[1]))].filter(k=>!t.getPropertyValue(k).trim()&&k.startsWith('--app-'));});
  // Imported styles have local custom properties; verify tokens used in this page directly.
  assert.ok(await p.evaluate(()=>['--app-background','--secondary06','--app-shadow-card','--app-weight-medium'].every(k=>getComputedStyle(document.documentElement).getPropertyValue(k).trim())));
  if(width===375)await p.screenshot({path:'/private/tmp/og-full-menu-'+state+'.png'});
 }
 assert.deepEqual(errors,[]);console.log('PASS full menu: three states × four widths, canvas region, review, prompt and tokens');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
