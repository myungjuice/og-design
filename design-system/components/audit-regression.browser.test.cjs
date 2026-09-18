const {test}=require('node:test');
const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
let browser,page;
test.before(async()=>{browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});page=await browser.newPage();});
test.after(async()=>{await browser?.close();});
const base='http://127.0.0.1:4173';
test('favorite preview preserves 48px width',async()=>{
 await page.goto(base+'/design-system/canvas/');
 const widths=await page.locator('.og-favorite').evaluateAll(ns=>ns.map(n=>n.offsetWidth));
 assert.ok(widths.length);assert.ok(widths.every(w=>w===48),JSON.stringify(widths));
});
test('short heading and action share a row',async()=>{
 await page.goto(base+'/design-system/canvas/');await page.evaluate(()=>document.fonts.ready);
 const deltas=await page.locator('.og-section-heading').evaluateAll(ns=>ns.filter(n=>n.querySelector('.og-heading-info')).map(n=>{const a=n.querySelector('.og-heading-action'),b=n.querySelector('.og-heading-title-line');return a?Math.abs(a.offsetTop+a.offsetHeight/2-b.offsetTop-b.offsetHeight/2):0;}));
 assert.ok(deltas.length);assert.ok(deltas.every(d=>d<2),JSON.stringify(deltas));
});
async function isolated(){await page.goto(base+'/');await page.setContent('<link rel="stylesheet" href="/design-system/components/index.css"><main id="probe"></main>');}
test('viewer retry uses shared button and same styles outside canvas',async()=>{
 const style=n=>{const s=getComputedStyle(n);return ['padding','borderRadius','borderWidth','fontSize'].map(k=>s[k]);};
 await page.goto(base+'/design-system/canvas/');const expected=await page.locator('.og-viewer-error button').evaluate(style);
 await isolated();await page.evaluate(async()=>{const ui=await import('/design-system/components/index.mjs');document.querySelector('#probe').innerHTML=ui.imageViewer({mode:'error'});});
 assert.equal(await page.locator('.og-viewer-error .og-button').count(),1);
 assert.deepEqual(await page.locator('.og-viewer-error button').evaluate(style),expected);
});
test('small secondary hover uses pale surface, with matching static state',async()=>{
 await isolated();await page.evaluate(async()=>{const ui=await import('/design-system/components/index.mjs');document.querySelector('#probe').innerHTML=ui.button({label:'취소',variant:'secondary',size:'small'});});
 await page.locator('.og-button').hover();
 const state=()=>page.locator('.og-button').evaluate(n=>({bg:getComputedStyle(n,'::before').backgroundColor,fg:getComputedStyle(n).color}));
 const actual=await state();assert.equal(actual.bg,await page.evaluate(()=>{const n=document.createElement('span');n.style.background='var(--app-state-hover)';document.body.append(n);const v=getComputedStyle(n).backgroundColor;n.remove();return v;}));
 await page.mouse.move(900,800);await page.locator('.og-button').evaluate(n=>n.classList.add('is-hover'));assert.deepEqual(await state(),actual);
});
