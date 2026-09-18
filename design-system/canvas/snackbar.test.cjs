const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright'),assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});try{
const p=await b.newPage({viewport:{width:1440,height:1000},permissions:['clipboard-read','clipboard-write']});
await p.goto('http://127.0.0.1:4173/design-system/canvas/');
assert.equal(await p.locator('#snackbar .og-snackbar').count(),3);
assert(await p.locator('#snackbar .og-snackbar').evaluateAll(es=>es.every(e=>e.inert)));
await p.locator('[data-board="snackbar"]').click();
await p.screenshot({path:'/private/tmp/og-snackbar.png'});
for(const selector of ['[data-board-prompt="snackbar"]','[data-field-prompt="snackbar-saved-specimen"]']){
 await p.locator(selector).click();await p.waitForFunction(()=>!document.querySelector('#board-prompt-copy').disabled);
 const prompt=await p.locator('#board-prompt-text').inputValue();assert(prompt.includes('.og-snackbar'));assert(prompt.includes('저장했습니다.'));
 await p.locator('#board-prompt-copy').click();assert.equal(await p.evaluate(()=>navigator.clipboard.readText()),prompt);await p.keyboard.press('Escape');
}
for(const w of [320,375,414,768]){await p.setViewportSize({width:w,height:900});await p.locator('#board-picker').selectOption('snackbar');assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
await p.locator('.snackbar-stage').evaluateAll(es=>es.forEach(e=>e.style.width='288px'));
assert(await p.locator('.og-snackbar').evaluateAll(es=>es.every(e=>e.scrollWidth<=e.clientWidth)));
console.log('PASS: 3 static snackbars, prompt CSS/copy, mobile and narrow content');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
