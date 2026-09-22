const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});try{
 const p=await b.newPage({viewport:{width:1440,height:1000}});
 await p.goto('http://127.0.0.1:4173/design-system/canvas/#home-main-menu');await p.waitForFunction(()=>document.querySelector('#viewport')?.getAttribute('aria-busy')==='false');
 assert.equal(await p.locator('#home-main-menu .og-main-menu-row').count(),4);assert.equal(await p.locator('[data-review-go="board-home-main-menu"]').count(),1);
 assert.ok(await p.evaluate(()=>{const a=document.querySelector('#home-main-menu'),m=document.querySelector('#home-store'),r=document.querySelector('#home-region');return a.offsetLeft===m.offsetLeft&&a.offsetTop>m.offsetTop+m.offsetHeight&&a.offsetTop+a.offsetHeight<=r.offsetTop+r.offsetHeight;}));
 await p.locator('#home-main-menu [data-home-prompt]').click({force:true});await p.waitForFunction(()=>document.querySelector('#home-prompt-text').value.includes('.og-main-menu-row'));assert.match(await p.locator('#home-prompt-text').inputValue(),/_getMenuItemNative/);
 await p.goto('http://127.0.0.1:4173/design-system/pages/my-info/');await p.evaluate(async()=>{const l=document.createElement('link');l.rel='stylesheet';l.href='/design-system/pages/home/main-menu.css';document.head.append(l);await new Promise(r=>l.onload=r);const s=document.createElement('style');s.textContent='html,body{margin:0;padding:0;overflow-x:clip}';document.head.append(s);});
 for(const width of [320,375,414,768]){
  await p.setViewportSize({width,height:800});await p.evaluate(async()=>{const {mainMenuScreen}=await import('/design-system/pages/home/main-menu.mjs');const {storeImage}=await import('/design-system/canvas/specimen-media.mjs');document.body.innerHTML=mainMenuScreen({imageSrc:storeImage()});await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));});
  assert.ok(await p.locator('.og-main-menu').evaluate(n=>n.scrollWidth<=n.clientWidth+1));assert.equal(await p.locator('.og-main-menu-row .og-thumbnail').count(),2);assert.equal(await p.locator('.og-main-menu-description').count(),2);
  assert.equal(await p.locator('.og-store-tabs [aria-selected="true"]').textContent(),'메뉴');
  if(width===375)await p.screenshot({path:'/private/tmp/og-main-menu.png'});
 }
 console.log('PASS main menu: optional content, four widths, selected section, region, prompt, review');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
