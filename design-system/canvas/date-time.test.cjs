const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright'),assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});try{
const p=await b.newPage({viewport:{width:1440,height:1100},permissions:['clipboard-read','clipboard-write']});await p.goto('http://127.0.0.1:4173/design-system/canvas/');
assert.equal(await p.locator('#date-time .og-calendar').count(),6);assert.equal(await p.locator('#date-time .og-time-picker').count(),2);
assert.equal(await p.locator('.og-calendar').first().locator('.og-calendar-day').count(),30);
assert.equal(await p.locator('.og-calendar').first().locator('.og-calendar-blank').count(),2);
assert.equal(await p.locator('#date-picker-specimen .og-calendar-day[aria-selected="true"]').count(),1);
assert.equal(await p.locator('#date-picker-specimen .og-calendar-day[aria-selected="true"]').innerText(),'18');
assert(await p.locator('#date-time [data-picker-panel]').evaluateAll(es=>es.every(e=>e.inert)));
await p.locator('[data-board="date-time"]').click();await p.screenshot({path:'/private/tmp/og-date-time.png'});
await p.locator('[data-board-prompt="date-time"]').click();await p.waitForFunction(()=>!document.querySelector('#board-prompt-copy').disabled);
const value=await p.locator('#board-prompt-text').inputValue();assert(value.includes('.og-calendar'));assert(value.includes('.og-time-picker'));
await p.locator('#board-prompt-copy').click();assert.equal(await p.evaluate(()=>navigator.clipboard.readText()),value);await p.keyboard.press('Escape');
for(const width of [320,375,414,768]){await p.setViewportSize({width,height:900});await p.locator('#board-picker').selectOption('date-time');assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
assert(await p.locator('.og-calendar,.og-time-picker').evaluateAll(es=>es.every(e=>e.scrollWidth<=e.clientWidth)));
assert.equal(await p.locator('#range-picker-specimen .og-range-calendar').count(),4);
assert.equal(await p.locator('#range-picker-specimen .og-range-calendar').nth(1).locator('[data-in-range]').count(),15);
assert.equal(await p.locator('#range-picker-specimen .og-range-calendar').first().getByText('기간 적용',{exact:true}).isDisabled(),true);
console.log('PASS: calendar dates, static selected/disabled states, time specimens, CSS handoff, mobile');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
