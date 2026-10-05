const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage(),errors=[],writes=[];
  page.on('pageerror',error=>errors.push(error.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.url()+':'+r.status());});
  page.on('request',r=>{if(!['GET','HEAD'].includes(r.method()))writes.push(r.url());});
  for(const width of [320,375,390,414,768,1024,1440]){
   await page.setViewportSize({width,height:1000});await page.goto(`${base}/v2/components/#chip-single`);await page.reload();await page.evaluate(()=>document.fonts.ready);
   assert.deepEqual(await page.locator('.v2-component-section:visible').evaluateAll(ns=>ns.map(n=>n.id)),['chip-single','chip-multiple','chip-filters']);
   assert.equal(await page.locator('#chip-multiple .v2-state-comparison').evaluate(n=>n.open),false);
   const single=page.locator('#v2-chip-single'),multiple=page.locator('#v2-chip-multiple'),filters=page.locator('#v2-chip-filters');
   assert.ok(await page.locator('#v2-chip-single .v2-chip,#v2-chip-multiple .v2-chip').evaluateAll(ns=>ns.every(n=>{
    const chip=n.getBoundingClientRect(),label=n.querySelector('.v2-chip-label').getBoundingClientRect();
    return Math.abs((label.left+label.right)/2-(chip.left+chip.right)/2)<.5;
   })),'selected, unselected and disabled labels are centered without a hidden icon offset '+width);
   assert.ok(await multiple.locator('[aria-pressed="true"]').evaluateAll(ns=>{
    const canvas=document.createElement('canvas');canvas.width=canvas.height=1;const ctx=canvas.getContext('2d');
    const lum=color=>{ctx.clearRect(0,0,1,1);ctx.fillStyle=color;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data].slice(0,3).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);};
    const face=lum(getComputedStyle(document.documentElement).getPropertyValue('--home-selected-face'));
    return ns.every(n=>{const colors=getComputedStyle(n).boxShadow.match(/(?:oklch|oklab|rgba?|color)\([^)]*\)/g)||[];return colors.length>=3&&lum(colors[0])>face+.12&&lum(colors[1])<face;});
   }),'selected chips have a visible lit upper edge and darker lower lip '+width);
   await single.getByRole('radio',{name:'적립',exact:true}).click();
   assert.equal(await single.getByRole('radio',{name:'적립',exact:true}).isChecked(),true);
   const y=await page.evaluate(()=>scrollY);await page.keyboard.press('ArrowRight');
   assert.equal(await single.getByRole('radio',{name:'사용',exact:true}).isChecked(),true);
   assert.equal(await page.evaluate(()=>scrollY),y,'native chips do not jump vertically');
   await page.keyboard.press('ArrowRight');assert.equal(await single.getByRole('radio',{name:'전체',exact:true}).isChecked(),true,'skip unavailable chip');
   assert.equal(await single.getByRole('radio',{name:'직접 선택',exact:true}).isDisabled(),true);
   const selected=()=>multiple.locator('button[aria-pressed="true"]').count();
   assert.equal(await selected(),2);await multiple.getByRole('button',{name:'중식',exact:true}).click();assert.equal(await selected(),3);
   const dimensions=await multiple.getByRole('button',{name:'양식',exact:true}).boundingBox();
   await multiple.getByRole('button',{name:'양식',exact:true}).click();assert.equal(await selected(),3);
   assert.match(await multiple.locator('[data-chip-message]').textContent(),/최대 3개/);
   await multiple.getByRole('button',{name:'한식',exact:true}).click();await multiple.getByRole('button',{name:'양식',exact:true}).click();assert.equal(await selected(),3);
   const changed=await multiple.getByRole('button',{name:'양식',exact:true}).boundingBox();
   assert.equal(changed.width,dimensions.width,'selection reserves check slot');assert.equal(changed.height,dimensions.height);
   assert.ok(await multiple.getByRole('button',{name:'양식',exact:true}).evaluate(n=>{const label=n.querySelector('.v2-chip-label').getBoundingClientRect(),check=n.querySelector('.v2-chip-check').getBoundingClientRect();return check.right<=label.left-3&&getComputedStyle(n.querySelector('.v2-chip-check')).visibility==='visible';}),'selected check never overlaps the centered label');
   await multiple.getByRole('button',{name:'양식',exact:true}).focus();await page.keyboard.press('Space');assert.equal(await selected(),2);
   assert.equal(await multiple.getByRole('button',{name:'양식',exact:true}).evaluate(n=>getComputedStyle(n).outlineWidth),'3px');
   await filters.getByRole('button',{name:'한식 필터 해제',exact:true}).click();
   assert.equal(await filters.getByRole('button',{name:'한식 필터 해제',exact:true}).count(),0);
   assert.equal(await filters.getByRole('button',{name:'영업 중 필터 해제',exact:true}).evaluate(n=>document.activeElement===n),true);
   await page.keyboard.press('Enter');await page.keyboard.press('Enter');
   assert.match(await filters.locator('[data-chip-message]').textContent(),/적용된 필터가 없습니다/);
   assert.equal(await filters.getByRole('button',{name:'필터 예시 복원',exact:true}).evaluate(n=>document.activeElement===n),true);
   await page.keyboard.press('Enter');assert.equal(await filters.locator('[data-chip-remove]').count(),3);
   assert.equal(await filters.locator('[aria-pressed]').count(),0,'removal is not a toggle');
   assert.ok(await page.locator('.v2-chip-stage:not([inert]) .v2-chip').evaluateAll(ns=>ns.every(n=>{const r=n.getBoundingClientRect();return r.width>=48&&r.height>=48&&getComputedStyle(n).whiteSpace==='nowrap';})),'48px chip targets '+width);
   assert.ok(await page.locator('.v2-chip-stage:not([inert]) .v2-chip').evaluateAll(ns=>{
    const canvas=document.createElement('canvas');canvas.width=canvas.height=1;const ctx=canvas.getContext('2d'),root=getComputedStyle(document.documentElement);
    const lum=color=>{ctx.clearRect(0,0,1,1);ctx.fillStyle=color;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data].slice(0,3).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);};
    return ns.filter(n=>!n.disabled&&!n.previousElementSibling?.disabled).every(n=>{
     const isSelected=n.getAttribute('aria-pressed')==='true'||n.previousElementSibling?.checked;
     const stops=isSelected?['--home-selected-lit','--home-selected-face']:['--test-surface','--test-page-bottom'];
     return stops.every(stop=>{const a=lum(getComputedStyle(n).color),b=lum(root.getPropertyValue(stop));return (Math.max(a,b)+.05)/(Math.min(a,b)+.05)>=4.5;});
    });
   }),'enabled chip text contrast across both gradient stops '+width);
   await page.locator('#chip-multiple .v2-state-comparison > summary').click();
   for(const state of ['disabled','loading'])assert.ok(await page.locator(`.v2-chip-stage[inert] [data-v2-chips][data-state="${state}"] button`).evaluateAll(ns=>ns.every(n=>n.disabled)));
   assert.ok(await page.locator('[data-v2-chips][data-state="loading"] .v2-loading').count()>0);
   assert.match(await page.locator('[data-v2-chips][data-state="error"] [data-chip-message]').textContent(),/다시 선택/);
   await page.emulateMedia({reducedMotion:'reduce'});
   assert.ok(await page.locator('.v2-chip,.v2-chip-stage .og-spinner').evaluateAll(ns=>ns.every(n=>getComputedStyle(n).animationName==='none')));
   await page.emulateMedia({forcedColors:'active'});
   assert.notEqual(await single.locator('input:checked+.v2-chip').evaluate(n=>getComputedStyle(n).outlineStyle),'none');
   await page.emulateMedia({forcedColors:'none',reducedMotion:'no-preference'});
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no root overflow '+width);
   if([320,375,390,414,768,1440].includes(width)){
    await page.locator('#chip-multiple .v2-state-comparison > summary').click();await page.locator('#chip-single-title').click();
    await page.screenshot({path:`/private/tmp/og-v2-chips-${width}.png`,fullPage:true});
   }
  }
  await page.evaluate(async()=>{
   const {renderChipGroup,setupChips}=await import('/v2/components/chips.mjs');
   const fixture=document.createElement('div');fixture.className='v2-chip-stage';fixture.id='chip-fixture';
   fixture.innerHTML=renderChipGroup({id:'unlimited',items:['한식','중식','일식','양식']})+renderChipGroup({id:'unavailable',state:'disabled',items:['한식','중식'],selected:[0]});
   document.querySelector('#chip-multiple').append(fixture);setupChips(fixture);setupChips(fixture);
  });
  for(const label of ['한식','중식','일식','양식'])await page.locator('#unlimited').getByRole('button',{name:label,exact:true}).click();
  assert.equal(await page.locator('#unlimited [aria-pressed="true"]').count(),4,'limit is optional and setup is idempotent');
  await page.locator('#unavailable button').first().dispatchEvent('click');assert.equal(await page.locator('#unavailable [aria-pressed="true"]').count(),1);
  const touch=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true}),phone=await touch.newPage();
  await phone.goto(`${base}/v2/components/#chip-multiple`);await phone.locator('#v2-chip-multiple').getByRole('button',{name:'한식',exact:true}).tap();
  assert.equal(await phone.locator('#v2-chip-multiple button[aria-pressed="true"]').count(),1);await touch.close();
  await page.route('**/*.{woff,woff2}',route=>route.abort());await page.setViewportSize({width:320,height:1000});await page.goto(`${base}/v2/components/#chip-single`);await page.reload();await page.evaluate(()=>document.fonts.ready);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'font fallback fits');
  const ids=await page.locator('[id]').evaluateAll(ns=>ns.map(n=>n.id));assert.equal(new Set(ids).size,ids.length);
  assert.deepEqual(errors,[]);assert.deepEqual(writes,[]);
  console.log('Chips: 7 widths, native single selection, multi limit/unlimited, removal/focus/reset, stable geometry, touch/keyboard, states/contrast/forced colors, font fallback and no writes passed');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
