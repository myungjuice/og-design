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
    if(entry&&counter){
     const a=entry.getBoundingClientRect(),b=counter.getBoundingClientRect(),photo=s.querySelector('.og-store-photo'),r=photo.getBoundingClientRect(),scale=r.width/photo.offsetWidth;
     if(a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top)problems.push('photo count overlaps');
     if(Math.abs((b.top-r.top)/scale-16)>2)problems.push('counter not top right');
     if(Math.abs((r.right-b.right)/scale-16)>2)problems.push('counter right offset');
     if(Math.abs((r.bottom-a.bottom)/scale-16)>2)problems.push('entry not bottom right');
     if(Math.abs((r.right-a.right)/scale-16)>2)problems.push('entry right offset');
     const ctx=document.createElement('canvas').getContext('2d');ctx.fillStyle=getComputedStyle(counter).backgroundColor;ctx.fillRect(0,0,1,1);
     if(Math.abs(ctx.getImageData(0,0,1,1).data[3]-128)>1)problems.push('counter fill not 50%');
     if(getComputedStyle(counter).opacity!=='1')problems.push('counter text faded');
    }
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
  const colors=await page.evaluate(()=>{
   const shadow=key=>document.querySelector('[data-direct-use-screen="'+key+'"]').shadowRoot;
   const color=(key,selector)=>getComputedStyle(shadow(key).querySelector(selector)).color;
   const rgb=value=>{const ctx=document.createElement('canvas').getContext('2d');ctx.fillStyle=value;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data].slice(0,3);};
   return {expired:rgb(color('confirm-expired','.du-code')),muted:rgb(getComputedStyle(shadow('confirm-expired').querySelector('.du-proof')).getPropertyValue('--v2-text-muted')),outsideExpired:color('confirm-expired','h1'),outsideActive:color('confirm-active','h1')};
  });
  assert.ok(colors.expired.every((v,i)=>v>colors.muted[i]),'expired proof text should be lighter');
  assert.equal(colors.outsideExpired,colors.outsideActive,'outside heading should retain its color');
  const codeFirst=await page.evaluate(()=>{
   const shadow=key=>document.querySelector('[data-direct-use-screen="'+key+'"]').shadowRoot;
   const focused=shadow('confirm-focused'),stale=shadow('confirm-stale');
   return {digits:[...focused.querySelectorAll('.du-code-cell')].map(e=>e.textContent),digitSize:parseFloat(getComputedStyle(focused.querySelector('.du-code-cell')).fontSize),amountSize:parseFloat(getComputedStyle(focused.querySelector('.du-summary dd')).fontSize),focusedClock:!!focused.querySelector('.du-proof-clock'),originalClock:!!shadow('confirm-active').querySelector('.du-proof-clock'),staleBackground:getComputedStyle(stale.querySelector('.du-proof')).backgroundImage,entryConfirmed:document.querySelector('#direct-use-entry').dataset.reviewStatus};
  });
  assert.deepEqual(codeFirst.digits,['4','3','6','8']);
  assert.ok(codeFirst.digitSize>codeFirst.amountSize*2,'code has visual priority over amount');
  assert.equal(codeFirst.focusedClock,false);assert.equal(codeFirst.originalClock,true);
  assert.match(codeFirst.staleBackground,/linear-gradient/,'stale connection does not gray out completed transaction');
  assert.equal(codeFirst.entryConfirmed,'confirmed');
  await page.locator('[data-view-link="store"]').click();await page.waitForSelector('#store:not([hidden])');
  assert.equal(await page.locator('#store .du-entry').count(),0);
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});
