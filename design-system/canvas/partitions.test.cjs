const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const base='http://127.0.0.1:4173/design-system/canvas/';
 const ready=()=>page.waitForFunction(()=>document.querySelector('#viewport')?.getAttribute('aria-busy')==='false');
 const {boards}=await import('./catalog.mjs');
 const results=[];
 for(const id of ['foundations','components','explore','store','my-info']){
  await page.goto(base+'?canvas='+id);await ready();
  const actual=await page.locator('#world > .board,#world > .screen-page:not(.proposal-page),#world > .mileage-variant-page').evaluateAll(ns=>ns.map(n=>n.id));
  assert.deepEqual(actual.sort(),boards.filter(b=>b.canvas===id).map(b=>b.id).sort());
  assert.equal(await page.locator('.canvas-switcher [aria-current="page"]').count(),1);
  results.push({id,boards:actual.length,nodes:await page.locator('*').count()});
  const first=boards.find(b=>b.canvas===id).id;
  await page.locator('[data-board="'+first+'"],[data-screen-link="'+first+'"]').click();
  const prompt=id==='foundations'||id==='components'?'[data-board-prompt]':id==='my-info'?'[data-screen-prompt]':'[data-home-prompt]';
  await page.locator('#'+first+' '+prompt).first().click();
  await page.waitForFunction(()=>document.querySelector('dialog[open] textarea')?.value.length>100);
  await page.locator('dialog[open]').evaluate(d=>d.close());
  await page.locator('#review-toggle').click();
  assert.equal(await page.locator('[data-review-go="board-home-store-info"]').count(),1,'global review includes unloaded boards');
  await page.locator('[data-review-close]').click();
 }
 await page.locator('#review-toggle').click();
 await page.locator('[data-review-complete="board-home-store-info"]').click();
 await page.locator('[data-review-tab="done"]').click();
 await page.locator('[data-review-go="board-home-store-info"]').click();await page.waitForURL('**/?canvas=store#home-store-info');await ready();
 assert.equal(await page.locator('#home-store-info [data-review-set="done"]').first().getAttribute('aria-pressed'),'true');
 await page.locator('#actual').click();await page.waitForTimeout(350);
 const view=await page.locator('#world').evaluate(n=>n.style.transform);
 await page.locator('.canvas-switcher a[href="?canvas=foundations"]').click();await ready();
 await page.locator('.canvas-switcher a[href="?canvas=store"]').click();await ready();
 assert.equal(await page.locator('#world').evaluate(n=>n.style.transform),view,'canvas restores its independent position');
 await page.goto(base+'?canvas=foundations#home-search');await ready();assert.ok(page.url().includes('canvas=explore'));
 await page.screenshot({path:'/private/tmp/og-split-explore.png'});
 assert.deepEqual(errors,[]);console.log(results);console.log('partitions, global review, deep links and per-canvas restore passed');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});
