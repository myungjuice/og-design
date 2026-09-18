const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright'),assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});try{
const p=await b.newPage({viewport:{width:1440,height:1100},permissions:['clipboard-read','clipboard-write']});await p.goto('http://127.0.0.1:4173/design-system/canvas/');
assert.equal(await p.locator('#attachments [data-attachment-state]').count(),5);assert.equal(await p.locator('#attachments .og-image-viewer').count(),3);
assert.equal(await p.locator('#attachments input[type="file"]').count(),0);
assert(await p.locator('#attachments [data-media-example]').evaluateAll(es=>es.every(e=>e.inert)));
assert(await p.locator('#attachments img').evaluateAll(es=>es.every(e=>e.complete&&e.naturalWidth>0)));
await p.locator('[data-board="attachments"]').click();await p.screenshot({path:'/private/tmp/og-attachments.png'});
await p.locator('[data-board-prompt="attachments"]').click();await p.waitForFunction(()=>!document.querySelector('#board-prompt-copy').disabled);
const value=await p.locator('#board-prompt-text').inputValue();assert(value.includes('.og-image-viewer'));assert(value.includes('업로드'));await p.locator('#board-prompt-copy').click();assert.equal(await p.evaluate(()=>navigator.clipboard.readText()),value);await p.keyboard.press('Escape');
for(const width of [320,375,414,768]){await p.setViewportSize({width,height:900});await p.locator('#board-picker').selectOption('attachments');assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
console.log('PASS: attachment/viewer states, inert examples, images, prompt copy, mobile');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
