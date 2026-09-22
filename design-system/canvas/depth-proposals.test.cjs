const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});try{
 const p=await b.newPage({viewport:{width:1440,height:2400}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 for(const [kind,id,canvas] of [['home','home-main','explore'],['store','home-store','store']]){
  await p.goto('http://127.0.0.1:4173/design-system/canvas/?canvas='+canvas+'#review-'+kind+'-depth-proposal');await p.waitForFunction(()=>document.querySelector('#viewport')?.getAttribute('aria-busy')==='false');
  const proposal=p.locator('#review-'+kind+'-depth-proposal');assert.equal(await proposal.count(),1);
  const originals=p.locator('#'+id+' > .og-home-example');assert.equal(await originals.count(),3);
  assert.ok((await proposal.boundingBox()).y<(await originals.first().boundingBox()).y);
  const style=await proposal.locator('.og-depth-proposal .og-'+(kind==='home'?'home-top':'store-identity')).evaluate(n=>({shadow:getComputedStyle(n).boxShadow,bg:getComputedStyle(n).backgroundImage}));assert.notEqual(style.shadow,'none');
  const original=p.locator('#'+id+' > .og-home-example .og-'+(kind==='home'?'home-top':'store-identity')).first();assert.equal(await original.evaluate(n=>getComputedStyle(n).boxShadow),'none');
  await proposal.locator('.screen-artboard').screenshot({path:'/private/tmp/og-'+kind+'-depth.png'});
  await proposal.locator('[data-depth-prompt]').click();await p.waitForFunction(()=>document.querySelector('#home-prompt-text')?.value.includes('.og-depth-proposal'));await p.locator('#home-prompt-dialog [data-close]').click();
  await p.locator('#review-toggle').click();assert.equal(await p.locator('[data-review-go="'+kind+'-depth-proposal"]').count(),1);await p.locator('[data-review-close]').click();
 }
 assert.deepEqual(errors,[]);console.log('PASS: two proposals above unchanged originals, isolated styles, CSS handoff and review enrollment');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
