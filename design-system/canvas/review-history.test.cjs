const{chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});try{
 const p=await b.newPage({viewport:{width:1440,height:1000}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:4173/design-system/canvas/#my-info-review-history');await p.waitForFunction(()=>document.querySelector('#viewport')?.getAttribute('aria-busy')==='false');
 assert.equal(await p.locator('#my-info-review-history .og-review-history').count(),5);
 await p.locator('#my-info-review-history [data-screen-prompt]').click();await p.waitForFunction(()=>!document.querySelector('#screen-prompt-copy').disabled);
 const prompt=await p.locator('#screen-prompt-text').inputValue();assert.ok(prompt.includes('review_history.dart')&&prompt.includes('.og-review-history'));
 await p.goto('http://127.0.0.1:4173/design-system/pages/my-info/');
 await p.evaluate(async()=>{const{reviewHistoryBoard}=await import('./review-history.mjs');const{storeImage}=await import('../../canvas/specimen-media.mjs');const link=document.createElement('link');link.rel='stylesheet';link.href='./review-history.css';document.head.append(link);await new Promise((r,j)=>{link.onload=r;link.onerror=j});document.querySelector('main').innerHTML=reviewHistoryBoard({imageSrc:storeImage()});document.querySelector('.screen-design-notes').remove();await document.fonts.ready;});
 for(const width of [320,375,414,768]){await p.setViewportSize({width,height:900});assert.ok(await p.locator('.og-review-history').evaluateAll(ns=>ns.every(n=>n.scrollWidth<=n.clientWidth)),'fits '+width);await p.locator('.og-review-history').first().screenshot({path:'/private/tmp/review-history-'+width+'.png'});}
 await p.setViewportSize({width:375,height:900});await p.locator('.og-review-overlay-screen').first().screenshot({path:'/private/tmp/review-menu.png'});
 assert.deepEqual(errors,[]);console.log('PASS: review board, shared prompt CSS, 4 widths and console');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
