const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
try{const page=await browser.newPage({viewport:{width:1400,height:1100}});
await page.goto('http://127.0.0.1:4173/design-system/canvas/?canvas=store');
await page.waitForFunction(()=>document.querySelector('#viewport')?.getAttribute('aria-busy')==='false');
const failures=[];let checks=0;
for(const id of ['home-store','home-menu-detail','home-review-photo']){
const count=await page.locator('#'+id+' .screen-artboard').count();
for(let index=0;index<count;index++){
await page.evaluate(({id,index})=>{const clone=document.querySelectorAll('#'+id+' .screen-artboard')[index].cloneNode(true);clone.id='polish-preview';Object.assign(clone.style,{position:'fixed',left:'300px',top:'20px',width:'375px',maxWidth:'none',zIndex:'2147483647',contentVisibility:'visible'});document.body.append(clone);},{id,index});
await page.locator('#polish-preview img').evaluateAll(nodes=>Promise.all(nodes.map(n=>n.decode())));
for(const width of [320,375,414,768]){
const errors=await page.locator('#polish-preview').evaluate((root,width)=>{root.style.width=width+'px';const errors=[];const left=s=>root.querySelector(s)?.getBoundingClientRect().left;
if(root.scrollWidth>root.clientWidth+1)errors.push('horizontal overflow');
if(root.querySelector('.og-store-promotion')&&Math.abs(left('.og-store-photo')-left('.og-store-promotion h3'))>1)errors.push('introduction/photo alignment');
if(root.querySelector('.og-review-photo-copy p')){const p=root.querySelector('.og-review-photo-copy p');const contentLeft=p.getBoundingClientRect().left+parseFloat(getComputedStyle(p).paddingLeft);if(Math.abs(contentLeft-left('.og-review-photo-author strong'))>1)errors.push('review author/body alignment');}
const img=root.querySelector('.og-menu-detail-photo img');if(img&&(img.src.includes('_thumb')||img.naturalWidth<211))errors.push('detail does not use verified original');return errors;},width);
failures.push(...errors.map(e=>`${id}/${index}/${width}: ${e}`));checks++;
}
await page.locator('#polish-preview').evaluate(root=>root.style.width='375px');
if(index===0)await page.locator('#polish-preview').screenshot({path:'/private/tmp/'+id+'-polished.png'});
await page.locator('#polish-preview').evaluate(root=>root.remove());
}}
assert.deepEqual(failures,[]);console.log('PASS',checks,'detail image/alignment checks');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
