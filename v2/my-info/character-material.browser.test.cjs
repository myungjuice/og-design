const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
// Catches a reintroduced outlined plate, missing low stand/foot contact, and clipped art.
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 const failures=[];
 try{
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  const widths=(process.env.UI_WIDTHS||'320,375,390,414,768,1440,1920').split(',').map(Number);
  for(const width of widths){
   await page.setViewportSize({width,height:1100});await page.goto('http://127.0.0.1:4173/v2/my-info/#profile-character');
   const host=page.locator('.v2-character-selection-host');await host.locator('[role="radiogroup"]').waitFor();
   await page.waitForFunction(()=>[...document.querySelector('.v2-character-selection-host').shadowRoot.querySelectorAll('link')].every(n=>n.sheet));await page.evaluate(()=>document.fonts.ready);
   for(const key of ['bear','penguin','raccoon']){
    const card=host.locator('[data-character-choice="'+key+'"]');
    for(const selected of [false,true]){
     if(selected)await card.click();
     const result=await card.evaluate(n=>{
      const cs=getComputedStyle(n),art=n.querySelector('.v2-character-art'),a=art.getBoundingClientRect(),r=n.getBoundingClientRect(),p=getComputedStyle(art,'::before'),copy=n.querySelector('.v2-character-copy').getBoundingClientRect();
      const hard=cs.boxShadow.split(/,(?![^()]*\))/).some(s=>{if(s.includes('inset'))return false;const lengths=s.match(/-?[\d.]+px/g)?.map(parseFloat)||[];return lengths.length>=3&&lengths[1]>1&&lengths[2]===0;});
      const display=n.querySelector('.v2-character-display'),stand=display&&getComputedStyle(display,'::before'),d=display&&display.getBoundingClientRect();
      const lowStand=stand&&stand.content!=='none'&&stand.backgroundImage.includes('linear-gradient')&&stand.boxShadow!=='none'&&stand.pointerEvents==='none'&&parseFloat(stand.height)>=12&&parseFloat(stand.height)<=20&&d.bottom>a.bottom&&d.bottom<=r.bottom&&d.right<=copy.left;
      return {hard,lowStand,border:parseFloat(cs.borderTopWidth),contact:p.content!=='none'&&p.backgroundImage.includes('radial-gradient')&&p.pointerEvents==='none',fill:cs.backgroundImage,fit:a.left>=r.left&&a.right<=copy.left&&a.top>=r.top&&a.bottom<=r.bottom,overflow:n.scrollWidth>n.clientWidth};
     });
     if(result.hard)failures.push(width+' '+key+' '+selected+': hard stacked lower rim');
     if(!result.contact)failures.push(width+' '+key+' '+selected+': missing noninteractive foot contact');
     if(!result.lowStand)failures.push(width+' '+key+' '+selected+': missing visible low three-dimensional stand');
     if(result.border!==0)failures.push(width+' '+key+' '+selected+': outlined plate perimeter remains');
     assert.match(result.fill,/linear-gradient/);assert.ok(result.fit&&!result.overflow,'art and copy fit '+key+' '+width);
    }
   }
   await host.locator('[data-character-choice="bear"]').click();
   assert.equal(await host.locator('[aria-checked="true"]').count(),1);assert.match(await host.locator('.v2-character-status').innerText(),/곰을 선택/);
   await page.keyboard.press('End');assert.equal(await host.locator('[aria-checked="true"]').getAttribute('data-character-choice'),'raccoon');
   if([320,390].includes(width)){
    await page.reload();await host.locator('[role="radiogroup"]').waitFor();
    await page.waitForFunction(()=>[...document.querySelector('.v2-character-selection-host').shadowRoot.querySelectorAll('link')].every(n=>n.sheet));
    await page.evaluate(()=>document.fonts.ready);await page.mouse.move(0,0);
    await host.locator('.v2-character-screen').screenshot({path:'/private/tmp/og-character-material-'+width+'.png'});
   }
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  }
  assert.deepEqual(errors,[]);assert.deepEqual(failures,[]);
  console.log('Character material: no outlined perimeter, low stand, foot contact, contained art, selection/keyboard and '+widths.length+' widths passed');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
