const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});try{
 const p=await b.newPage({viewport:{width:1440,height:1000}});
 const ready=async()=>{await p.waitForSelector('#screen-region');await p.evaluate(()=>document.fonts.ready);await p.waitForFunction(()=>document.querySelector('#viewport').getAttribute('aria-busy')==='false')};
 await p.goto('http://127.0.0.1:4173/design-system/canvas/#my-info-main');await ready();
 await p.locator('#plus').click();
 await p.mouse.move(1000,500);await p.mouse.down();await p.mouse.move(850,400,{steps:5});await p.mouse.up();
 const before=await p.locator('#world').getAttribute('style');const transform=await p.locator('#world').evaluate(n=>n.style.transform);
 await p.reload();await ready();
 assert.equal(await p.locator('#world').evaluate(n=>n.style.transform),transform,'reload restores zoom and pan, including immediate reload after drag');
 await p.goto('http://127.0.0.1:4173/design-system/canvas/?test=link#my-info-waiting-detail');await ready();
 assert.notEqual(await p.locator('#world').evaluate(n=>n.style.transform),transform,'explicit different screen takes priority');
 assert.ok(await p.locator('#my-info-waiting-detail').isVisible());
 await p.evaluate(()=>localStorage.setItem('og-design:canvas-view:v2:my-info','{"scale":-5,"x":"bad","y":null}'));
 await p.reload();await ready();assert.ok(!(await p.locator('#world').getAttribute('style')).includes('NaN'));
 console.log('PASS: reload state, deep-link priority, invalid stored state');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
