const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});try{
 const p=await b.newPage({viewport:{width:1440,height:1000}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:4173/design-system/canvas/#my-info-order-detail');
 await p.waitForFunction(()=>document.querySelector('#viewport')?.getAttribute('aria-busy')==='false');
 assert.equal(await p.locator('#my-info-order-detail .og-order-detail').count(),5);
 assert.equal(await p.locator('#my-info-order-detail .og-order-actions').count(),1);
 await p.locator('#my-info-order-detail [data-screen-prompt]').click();
 await p.waitForFunction(()=>!document.querySelector('#screen-prompt-copy').disabled);
 const prompt=await p.locator('#screen-prompt-text').inputValue();
 assert.ok(prompt.includes('q_order_history_detail.dart'));assert.ok(prompt.includes('.og-order-menu'));assert.ok(prompt.includes('시간 경과'));
 await p.goto('http://127.0.0.1:4173/design-system/pages/my-info/');
 await p.evaluate(async()=>{const{orderDetail}=await import('./order-detail.mjs');const{storeImage}=await import('../../canvas/specimen-media.mjs');const link=document.createElement('link');link.rel='stylesheet';link.href='./order-detail.css';document.head.append(link);await new Promise((r,j)=>{link.onload=r;link.onerror=j});document.querySelector('main').innerHTML=orderDetail({imageSrc:storeImage(),menus:[{name:'메뉴명',price:8000,total:18000,count:2,options:[{name:'추가 옵션',total:2000}],imageSrc:storeImage()},{name:'다른 메뉴',price:4000,total:4000,count:1}]});await document.fonts.ready;});
 for(const width of [320,375,414,768]){
  await p.setViewportSize({width,height:900});
  assert.ok(await p.locator('.og-order-detail').evaluate(n=>n.scrollWidth<=n.clientWidth),'screen width '+width);
  assert.ok(await p.locator('.og-order-menu').evaluateAll(ns=>ns.every(n=>n.scrollWidth<=n.clientWidth)),'menu width '+width);
  await p.screenshot({path:'/private/tmp/order-detail-'+width+'.png',fullPage:true});
 }
 assert.deepEqual(errors,[]);console.log('PASS: order states, prompt CSS, four widths and console');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
