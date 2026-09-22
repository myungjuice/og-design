const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});try{
 const p=await b.newPage({viewport:{width:1440,height:1000}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:4173/design-system/canvas/#home-menu-detail');await p.waitForFunction(()=>document.querySelector('#viewport')?.getAttribute('aria-busy')==='false');
 assert.equal(await p.locator('#home-menu-detail .screen-artboard').count(),3);assert.equal(await p.locator('[data-review-go="board-home-menu-detail"]').count(),1);
 assert.ok(await p.evaluate(()=>{const a=document.querySelector('#home-menu-detail'),m=document.querySelector('#home-full-menu'),r=document.querySelector('#home-region');return a.offsetLeft===m.offsetLeft&&a.offsetTop>m.offsetTop+m.offsetHeight&&a.offsetTop+a.offsetHeight<=r.offsetTop+r.offsetHeight;}));
 await p.locator('#home-menu-detail [data-home-prompt]').click({force:true});await p.waitForFunction(()=>document.querySelector('#home-prompt-text').value.includes('.og-menu-detail-row'));assert.match(await p.locator('#home-prompt-text').inputValue(),/store_menu_detail.dart/);
 await p.goto('http://127.0.0.1:4173/design-system/pages/my-info/');
 await p.evaluate(async()=>{const l=document.createElement('link');l.rel='stylesheet';l.href='/design-system/pages/home/menu-detail.css';document.head.append(l);await new Promise(r=>l.onload=r);const s=document.createElement('style');s.textContent='html,body{margin:0;padding:0;overflow-x:clip}';document.head.append(s);});
 for(const width of [320,375,414,768])for(const state of ['default','scrolled','empty']){
  await p.setViewportSize({width,height:800});await p.evaluate(async state=>{const {menuDetailScreen}=await import('/design-system/pages/home/menu-detail.mjs');const {storeImage}=await import('/design-system/canvas/specimen-media.mjs');document.body.innerHTML=menuDetailScreen({imageSrc:state==='empty'?'':storeImage(),scrolled:state==='scrolled',priceText:state==='empty'?'시가':'',options:state==='empty'?[]:[{name:'추가 옵션명',price:1000,selected:state==='scrolled'},{name:'다른 옵션명',price:2000}]});await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));},state);
  assert.ok(await p.locator('.og-menu-detail').evaluate(n=>n.scrollWidth<=n.clientWidth+1));
  assert.equal(await p.locator('input[type="radio"]:checked').count(),1);
  assert.equal(await p.locator('input[type="checkbox"]:checked').count(),state==='scrolled'?1:0);
  assert.equal(await p.locator('.og-menu-detail-options').count(),state==='empty'?0:1);
  assert.equal(await p.locator('.og-menu-detail-photo').count(),state==='default'?1:0);
  assert.ok(await p.locator('.og-menu-detail-row').evaluateAll(rows=>rows.every(row=>{const [label,price]=row.children;return label.getBoundingClientRect().right<=price.getBoundingClientRect().left;})));
  assert.ok(await p.evaluate(async()=>{const css=await (await fetch('/design-system/pages/home/menu-detail.css')).text();const root=getComputedStyle(document.documentElement);return [...css.matchAll(/var\((--[\w-]+)/g)].every(m=>root.getPropertyValue(m[1]).trim());}));
  if(width===375)await p.screenshot({path:'/private/tmp/og-menu-detail-'+state+'.png'});
 }
 assert.deepEqual(errors,[]);console.log('PASS menu detail: three states × four widths, no row overlap, shared controls, tokens, review and prompt');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
