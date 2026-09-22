const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});try{
 const p=await b.newPage({viewport:{width:1440,height:1600}});
 for(const id of ['home-main','home-store']){
  await p.goto('http://127.0.0.1:4173/design-system/canvas/#'+id);await p.waitForFunction(()=>document.querySelector('#viewport')?.getAttribute('aria-busy')==='false');
  assert.equal(await p.locator('#'+id+' > .og-home-example .og-depth-subtle').count(),3);
  assert.equal(await p.locator('.proposal-page').count(),2,'comparison history remains');
  assert.equal(await p.locator('.screen-page:not(#'+id+'):not(.proposal-page) .og-depth-subtle').count(),0,'other screens unchanged');
  await p.locator('#'+id+' > .screen-page-heading [data-home-prompt]').click();await p.waitForFunction(()=>document.querySelector('#home-prompt-text')?.value.includes('og-depth-subtle 클래스를'));
  const text=await p.locator('#home-prompt-text').inputValue();assert.ok(text.includes('.og-depth-subtle .og-'));assert.ok(!text.includes('og-depth-proposal 클래스를'));
 }
 console.log('PASS: B adopted for all six main states, other pages untouched, CSS handoff updated');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
