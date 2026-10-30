const test=require('node:test');
const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'/Users/mj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const ids=['park-events','park-event-detail','park-contests','park-contest-detail','park-contest-judging','park-contest-result','park-community-interests','park-community-feed'];
const expected=[1,4,1,1,1,1,3,3];
test('all 15 park specimens load on direct routes without overflow or missing assets at mobile/tablet/desktop widths',async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage();const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
  for(const width of [375,768,1440]){
   await page.setViewportSize({width,height:1000});
   for(let i=0;i<ids.length;i++){
    const id=ids[i];await page.goto('http://127.0.0.1:4173/v2/og-park/#'+id);
    await page.waitForSelector('#'+id+':not([hidden])');await page.evaluate(()=>document.fonts.ready);
    await page.waitForFunction(id=>[...document.querySelectorAll('#'+id+' [data-park-detail-screen]')].every(h=>h.shadowRoot&&[...h.shadowRoot.querySelectorAll('img')].every(i=>i.complete)),id);
    // Host scaling is applied by ResizeObserver after layout; measure its settled result.
    await page.waitForFunction(id=>[...document.querySelectorAll('#'+id+' [data-park-detail-screen]')].every(h=>Math.abs(h.getBoundingClientRect().height-h.shadowRoot.querySelector('.pd-screen').getBoundingClientRect().height)<=2),id,{timeout:5000});
    assert.equal(await page.locator('#'+id+' [data-park-detail-screen]').count(),expected[i]);
    const issues=await page.locator('#'+id+' [data-park-detail-screen]').evaluateAll(hosts=>hosts.flatMap(h=>{
     const s=h.shadowRoot.querySelector('.pd-screen'),problems=[];
     if(s.scrollWidth>s.clientWidth+1)problems.push(h.dataset.parkDetailScreen+' content overflow');
     if(s.getBoundingClientRect().width>h.getBoundingClientRect().width+1)problems.push(h.dataset.parkDetailScreen+' host overflow');
     if(Math.abs(h.getBoundingClientRect().height-s.getBoundingClientRect().height)>2)problems.push(h.dataset.parkDetailScreen+' scaled height mismatch');
     if([...h.shadowRoot.querySelectorAll('img')].some(i=>!i.naturalWidth))problems.push(h.dataset.parkDetailScreen+' missing image');
     const footer=h.shadowRoot.querySelector('.pd-footer'),body=h.shadowRoot.querySelector('.pd-body');
     if(footer&&footer.getBoundingClientRect().top<body.getBoundingClientRect().bottom-1)problems.push(h.dataset.parkDetailScreen+' footer overlap');
     return problems;
    }));
    assert.deepEqual(issues,[],width+' '+id);
    assert.equal(await page.locator('#'+id).getAttribute('data-review-status'),'pending');
    const docOverflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);assert.equal(docOverflow,false,width+' workspace overflow');
   }
  }
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});

test('old park comparison routes and menu navigation remain reachable',async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  await page.goto('http://127.0.0.1:4173/v2/og-park/');
  await page.waitForSelector('#park-latest:not([hidden])');
  await page.locator('[data-view-link="park-events"]').click();await page.waitForSelector('#park-events:not([hidden])');
  assert.match(page.url(),/#park-events$/);
  await page.locator('[data-view-link="park-contest-judging"]').click();await page.waitForSelector('#park-contest-judging:not([hidden])');
  await page.goBack();await page.waitForSelector('#park-events:not([hidden])');
  await page.locator('[data-view-link="park-comparison"]').click();await page.waitForSelector('#park-comparison:not([hidden])');
  assert.equal(await page.locator('#park-comparison [data-park-screen]').count(),3);
 }finally{await browser.close();}
});
