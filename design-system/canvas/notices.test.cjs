const{chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});try{
 const p=await b.newPage({viewport:{width:1440,height:1000}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:4173/design-system/canvas/#my-info-notices');await p.waitForFunction(()=>document.querySelector('#viewport')?.getAttribute('aria-busy')==='false');
 assert.equal(await p.locator('#my-info-notices .og-notices').count(),9);
 await p.locator('#my-info-notices [data-screen-prompt]').click();await p.waitForFunction(()=>!document.querySelector('#screen-prompt-copy').disabled);
 const prompt=await p.locator('#screen-prompt-text').inputValue();assert.ok(prompt.includes('push_notifications_list_page.dart')&&prompt.includes('.og-notification-row'));
 await p.goto('http://127.0.0.1:4173/design-system/pages/my-info/');
 await p.evaluate(async()=>{const link=document.createElement('link');link.rel='stylesheet';link.href='./notices.css';document.head.append(link);await new Promise((r,j)=>{link.onload=r;link.onerror=j});await document.fonts.ready;});
 for(const width of [320,375,414,768]){await p.setViewportSize({width,height:900});
  for(const [name,props] of [['notice',{}],['notification',{selected:1}],['edit',{selected:1,editing:true}],['empty',{selected:1,empty:true}],['delete',{selected:1,overlay:'all'}]]){
   await p.evaluate(async props=>{const{notices}=await import('./notices.mjs');document.querySelector('main').innerHTML=notices(props);},props);
   assert.ok(await p.locator('.og-notices>.og-sheet-panel').evaluate(n=>n.scrollWidth<=n.clientWidth),'sheet fits '+width+' '+name);
   assert.ok(await p.locator('.og-notification-row,.og-announcement-row').evaluateAll(ns=>ns.every(n=>n.scrollWidth<=n.clientWidth)),'rows fit '+width+' '+name);
   await p.locator('.og-notices').screenshot({path:'/private/tmp/notices-'+name+'-'+width+'.png'});
  }
 }
 assert.deepEqual(errors,[]);console.log('PASS: notice states, prompt CSS, four widths and console');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
