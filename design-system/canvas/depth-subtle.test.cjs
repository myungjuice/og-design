const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});try{
 const p=await b.newPage({viewport:{width:1440,height:2400}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 for(const [kind,id] of [['home','home-main'],['store','home-store']]){
  await p.goto('http://127.0.0.1:4173/design-system/canvas/#review-'+kind+'-depth-subtle');await p.waitForFunction(()=>document.querySelector('#viewport')?.getAttribute('aria-busy')==='false');
  const proposal=p.locator('#review-'+kind+'-depth-subtle');assert.equal(await proposal.count(),1);
  const positions=await p.evaluate(({kind,id})=>{const n=document.querySelector('#review-'+kind+'-depth-subtle'),a=document.querySelector('#review-'+kind+'-depth-proposal'),o=document.querySelector('#'+id+' > .og-home-example');return [n.closest('.proposal-page').offsetTop,a.closest('.proposal-page').offsetTop,o.closest('.screen-page').offsetTop];},{kind,id});assert.ok(positions[0]===positions[1]&&positions[1]<positions[2]);
  assert.equal(await p.locator('#'+id+' > .og-home-example').count(),3);
  const surface=proposal.locator(kind==='home'?'.og-home-top':'.og-store-identity');assert.equal(await surface.evaluate(n=>getComputedStyle(n).boxShadow),'none');assert.equal(await surface.evaluate(n=>getComputedStyle(n).backgroundImage),'none');
  await proposal.locator('.screen-artboard').screenshot({path:'/private/tmp/og-'+kind+'-subtle.png'});
  await proposal.locator('[data-depth-subtle]').click();await p.waitForFunction(()=>document.querySelector('#home-prompt-text')?.value.includes('og-depth-subtle 클래스를'));await p.locator('#home-prompt-dialog [data-close]').click();
  await p.locator('#review-toggle').click();assert.equal(await p.locator('[data-review-go="'+kind+'-depth-subtle"]').count(),1);await p.locator('[data-review-close]').click();
 }
 assert.deepEqual(errors,[]);console.log('PASS: A and B side-by-side above originals, no blue panel/card wrappers, handoff and review enrollment');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
