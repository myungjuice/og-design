const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});try{
 const p=await b.newPage({viewport:{width:1400,height:1100}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:4173/design-system/canvas/?canvas=store#home-store');
 await p.waitForFunction(()=>document.querySelector('#viewport')?.getAttribute('aria-busy')==='false');
 const ids=['home-store','home-main-menu','home-full-menu','home-menu-detail','home-store-info','home-store-location'];
 assert.equal(await p.locator('#world>.screen-page').count(),17);
 for(const id of ids){assert.match(await p.locator('#'+id).textContent(),id==='home-menu-detail'?/트리플치즈 오시노미야끼/:/오시 망원본점/);}
 assert.equal(await p.locator('#home-full-menu .og-full-menu').first().locator('.og-full-menu-list .og-full-menu-item').count(),29);
 const checks=await p.evaluate(async ids=>{const failures=[];let checked=0;
 for(const id of ids)for(const original of document.querySelectorAll('#'+id+' .screen-artboard')){
 const clone=original.cloneNode(true);clone.id='audit-preview';Object.assign(clone.style,{position:'fixed',left:'300px',top:'100px',maxWidth:'none',zIndex:'2147483647',background:'white',contentVisibility:'visible'});document.body.append(clone);
 await Promise.all([...clone.querySelectorAll('img')].map(img=>img.decode().catch(()=>failures.push('image:'+img.src))));
 for(const width of [320,375,414,768]){clone.style.width=width+'px';await new Promise(requestAnimationFrame);if(clone.scrollWidth>width+1)failures.push(id+':overflow:'+width);checked++;}
 clone.remove();}
 return {checked,failures};},ids);
 assert.deepEqual(checks.failures,[]);
 const states=await p.evaluate(()=>JSON.parse(localStorage.getItem('og-design:review-status:v1')));for(const id of ids)assert.equal(states['board-'+id],'pending');
 await p.locator('#home-store [data-review-set="done"]').evaluate(n=>n.click());await p.reload();await p.waitForFunction(()=>document.querySelector('#viewport')?.getAttribute('aria-busy')==='false');
 assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem('og-design:review-status:v1'))['board-home-store']),'done');
 for(const id of ['home-store','home-main-menu','home-full-menu','home-menu-detail']){
 await p.evaluate(id=>{const clone=document.querySelector('#'+id+' .screen-artboard').cloneNode(true);clone.id='audit-preview';Object.assign(clone.style,{position:'fixed',left:'300px',top:'100px',width:'375px',maxWidth:'none',zIndex:'2147483647',background:'white',contentVisibility:'visible'});document.body.append(clone);},id);
 await p.locator('#audit-preview').screenshot({path:'/private/tmp/'+id+'-real-store.png'});await p.locator('#audit-preview').evaluate(n=>n.remove());}
 assert.deepEqual(errors,[]);console.log('PASS',checks.checked,'width/state checks; loaded images; 29 menus; six review entries and saved completion; 17 store pages intact');
 }finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
