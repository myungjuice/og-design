const{chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});try{
 const p=await b.newPage({viewport:{width:1440,height:1000}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:4173/design-system/canvas/#my-info-notice-detail');await p.waitForFunction(()=>document.querySelector('#viewport')?.getAttribute('aria-busy')==='false');
 assert.equal(await p.locator('#my-info-notice-detail .og-notice-detail').count(),3);
 await p.locator('#review-toggle').click();assert.equal(await p.locator('[data-review-go="board-my-info-notice-detail"]').count(),1);await p.locator('[data-review-go="board-my-info-notice-detail"]').click();
 await p.locator('#my-info-notice-detail [data-screen-prompt]').click();await p.waitForFunction(()=>!document.querySelector('#screen-prompt-copy').disabled);
 const prompt=await p.locator('#screen-prompt-text').inputValue();assert.ok(prompt.includes('announcement_detail.dart')&&prompt.includes('.og-notice-article'));
 await p.goto('http://127.0.0.1:4173/design-system/pages/my-info/');
 await p.evaluate(async()=>{const link=document.createElement('link');link.rel='stylesheet';link.href='./notice-detail.css';document.head.append(link);await new Promise((r,j)=>{link.onload=r;link.onerror=j});const{noticeDetailBoard}=await import('./notice-detail.mjs');document.querySelector('main').innerHTML=noticeDetailBoard();document.querySelector('.screen-design-notes').remove();await document.fonts.ready;});
 for(const width of [320,375,414,768]){await p.setViewportSize({width,height:900});assert.ok(await p.locator('.og-notice-detail,.og-notice-article').evaluateAll(ns=>ns.every(n=>n.scrollWidth<=n.clientWidth)),'fits '+width);await p.locator('.og-notice-detail').last().screenshot({path:'/private/tmp/notice-detail-'+width+'.png'});}
 const long=p.locator('.og-notice-detail').last();const header=await long.locator('.og-notice-detail-header').boundingBox();await long.locator('.og-notice-article').evaluate(n=>n.scrollTop=300);assert.deepEqual(await long.locator('.og-notice-detail-header').boundingBox(),header);
 assert.deepEqual(errors,[]);console.log('PASS: notice detail, review auto-entry, prompt CSS, four widths, fixed header');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
