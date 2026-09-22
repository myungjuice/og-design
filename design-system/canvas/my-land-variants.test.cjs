const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
try{
 const page=await browser.newPage({viewport:{width:1400,height:1700}}),errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.goto('http://127.0.0.1:4173/design-system/canvas/?canvas=my-land');
 await page.waitForFunction(()=>document.querySelector('#viewport')?.getAttribute('aria-busy')==='false');
 const ids=['my-land-main','my-land-plaza','my-land-attendance','my-land-lounge','my-land-blue-header','my-land-miniature','my-land-relief','my-land-paper'];
 assert.deepEqual(await page.locator('#world>.screen-page').evaluateAll(ns=>ns.map(n=>n.id)),ids);
 const geometry=await page.locator('#world>.screen-page').evaluateAll(ns=>ns.map(n=>({top:n.offsetTop,left:n.offsetLeft,right:n.offsetLeft+n.offsetWidth})));
 assert.equal(new Set(geometry.map(n=>n.top)).size,1);
 for(let i=1;i<geometry.length;i++)assert.ok(geometry[i].left>geometry[i-1].right);
 assert.ok(await page.locator('#my-land-region').evaluate(n=>n.offsetWidth)>=geometry.at(-1).right);
 let checks=0;
 for(const id of ids){
  assert.equal(await page.evaluate(id=>JSON.parse(localStorage.getItem('og-design:review-status:v1'))['board-'+id],id),'pending');
  await page.evaluate(id=>{const c=document.querySelector('#'+id+' .screen-artboard').cloneNode(true);c.id='variant-preview';Object.assign(c.style,{position:'fixed',left:'300px',top:'10px',maxWidth:'none',width:'375px',zIndex:'2147483647',contentVisibility:'visible'});document.body.append(c);},id);
  for(const width of [320,375,414,768]){
   await page.locator('#variant-preview').evaluate((n,w)=>n.style.width=w+'px',width);
   assert.ok(await page.locator('#variant-preview').evaluate(n=>n.scrollWidth<=n.clientWidth+1),id+' overflow '+width);
   assert.equal(await page.locator('#variant-preview .og-myland-mission').count(),4);
   assert.equal(await page.locator('#variant-preview [data-milestone]').count(),4);checks++;
  }
  await page.locator('#variant-preview').evaluate(n=>n.style.width='375px');
  await page.locator('#variant-preview').screenshot({path:'/private/tmp/'+id+'-comparison.png'});
  await page.locator('#variant-preview').evaluate(n=>n.remove());
 }
 await page.locator('#my-land-plaza [data-review-set="done"]').evaluate(n=>n.click());
 await page.reload();await page.waitForFunction(()=>document.querySelector('#viewport')?.getAttribute('aria-busy')==='false');
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('og-design:review-status:v1'))['board-my-land-plaza']),'done');
 assert.deepEqual(errors,[]);console.log('PASS',checks,'width checks; eight horizontal boards; background coverage; review completion retained');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
