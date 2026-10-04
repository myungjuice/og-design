const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
const appearance=n=>{
 const c=document.createElement('canvas');c.width=c.height=1;const ctx=c.getContext('2d');
 const rgb=color=>{ctx.fillStyle=color;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data].slice(0,3);};
 const lum=color=>rgb(color).map(x=>x/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((s,x,i)=>s+x*[.2126,.7152,.0722][i],0);
 const style=getComputedStyle(n),placeholder=getComputedStyle(n,'::placeholder');let plane=n;
 while(plane.parentElement&&getComputedStyle(plane).backgroundImage==='none'&&getComputedStyle(plane).backgroundColor==='rgba(0, 0, 0, 0)')plane=plane.parentElement;
 const fill=getComputedStyle(plane),colors=fill.backgroundImage==='none'?[fill.backgroundColor]:fill.backgroundImage.match(/oklch\([^)]*\)|rgba?\([^)]*\)/g);
 return {ink:style.color,placeholder:placeholder.color,rgb:rgb(placeholder.color),separation:(lum(placeholder.color)+.05)/(lum(style.color)+.05),opacity:placeholder.opacity,contrast:Math.min(...colors.map(bg=>(Math.max(lum(bg),lum(placeholder.color))+.05)/(Math.min(lum(bg),lum(placeholder.color))+.05)))};
};
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  let shared;
  for(const width of [320,375,390,414,768,1440]){
   await page.setViewportSize({width,height:1000});await page.goto(base+'/v2/components/#numeric-input');await page.locator('#numeric-input-live input').waitFor();
   for(const selector of ['#text-input-live input','#password-input-live input','#phone-input-live input','#numeric-input-live input','#multiline-input-live textarea','.home-search input']){
    const data=await page.locator(selector).evaluate(appearance);
    assert.ok(Math.max(...data.rgb)-Math.min(...data.rgb)<=12,'placeholder remains near-neutral gray, not blue: '+selector);
    assert.equal(data.ink,'oklch(0.39 0.065 265)','actual input ink stays unchanged');
    assert.ok(data.separation>=3.5,'placeholder has a clear lightness separation from entered values: '+selector);
    // User-approved #A0A3AA review variant: placeholder alone has a 2:1 floor, not normal-text AA.
    assert.ok(data.contrast>=2,'lighter placeholder retains the review contrast floor: '+selector);
    assert.equal(data.opacity,'1');shared??=data.placeholder;assert.equal(data.placeholder,shared,'all input kinds share a placeholder token');
   }
   const field=page.locator('#numeric-input-live input');assert.equal(await field.inputValue(),'');await field.fill('1234');
   assert.equal(await field.inputValue(),'1234');assert.equal(await field.evaluate(n=>n.matches(':placeholder-shown')),false);await field.fill('');
   assert.equal(await field.evaluate(n=>n.matches(':placeholder-shown')),true);
   await page.goto(base+'/v2/home/');await page.locator('.home-search input').waitFor();
   assert.equal((await page.locator('.home-search input').evaluate(appearance)).placeholder,shared,'actual Home uses the same placeholder');
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  }
  await page.goto(base+'/screens/my-info-3d-test/');await page.locator('.home-search input').waitFor();
  assert.equal((await page.locator('.home-search input').evaluate(appearance)).placeholder,'oklch(0.5 0.06 265)','original test screen stays unchanged');
  assert.deepEqual(errors,[]);console.log('Placeholder: clear lightness separation, unchanged value ink, user-approved 2:1 review floor (not normal-text AA), empty/filled states, actual Home, six widths and original screen preservation passed');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
