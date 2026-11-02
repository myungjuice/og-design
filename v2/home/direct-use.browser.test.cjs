const test=require('node:test');
const assert=require('node:assert/strict');
const {chromium}=require('/Users/mj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
test('direct-use routes and static specimens render without clipping, overlap or errors',async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400&&r.url().startsWith('http://127.0.0.1'))errors.push(r.status()+' '+r.url());});
  for(const width of [375,768,1600]){
   await page.setViewportSize({width,height:1000});
   await page.goto('http://127.0.0.1:4173/v2/home/#direct-use-entry');
   await page.waitForSelector('#direct-use-entry:not([hidden])');
   await page.evaluate(()=>document.fonts.ready);
   await page.waitForFunction(()=>[...document.querySelectorAll('[data-direct-use-screen]')].every(h=>h.shadowRoot&&Math.abs(h.getBoundingClientRect().height-h.shadowRoot.querySelector('.du-screen,.v2-home-store-frame').getBoundingClientRect().height)<=2));
   const issues=await page.locator('[data-direct-use-screen]').evaluateAll(hosts=>hosts.flatMap(h=>{
    const s=h.shadowRoot.querySelector('.du-screen,.v2-home-store-frame'),problems=[];
    if(s.scrollWidth>s.clientWidth+1)problems.push(h.dataset.directUseScreen+' overflow');
    if(s.getBoundingClientRect().width>h.clientWidth+1)problems.push(h.dataset.directUseScreen+' host overflow');
    const f=s.querySelector('.du-footer'),b=s.querySelector('.du-body');
    if(f&&f.getBoundingClientRect().top<b.getBoundingClientRect().bottom-1)problems.push(h.dataset.directUseScreen+' footer overlaps');
    const entry=s.querySelector('.du-entry');
    if(entry&&Number(getComputedStyle(entry).zIndex)<1)problems.push('photo covers entry');
    const counter=s.querySelector('.og-store-count');
    if(entry&&counter&&entry.getBoundingClientRect().bottom>counter.getBoundingClientRect().top-3)problems.push('photo count overlaps');
    return problems;
   }));
   assert.deepEqual(issues,[],String(width));
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,'workspace overflow '+width);
   assert.equal(await page.locator('[data-direct-use-screen]').count(),6);
   for(const id of ['direct-use-amount','direct-use-confirm']){
    if(width>=1200)await page.locator('[data-view-link="'+id+'"]').click();
    else await page.goto('http://127.0.0.1:4173/v2/home/#'+id);
    await page.waitForSelector('#'+id+':not([hidden])');
    assert.match(page.url(),new RegExp('#'+id+'$'));
   }
  }
  await page.locator('[data-view-link="store"]').click();await page.waitForSelector('#store:not([hidden])');
  assert.equal(await page.locator('#store .du-entry').count(),0);
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});
