const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage(),errors=[],writes=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.url()+':'+r.status());});
  page.on('request',r=>{if(!['GET','HEAD'].includes(r.method()))writes.push(r.url());});
  for(const width of [320,375,390,414,768,1024,1440]){
   await page.setViewportSize({width,height:1000});await page.goto(`${base}/v2/components/#tabs`);await page.reload();
   await page.locator('#tabs').waitFor();await page.evaluate(()=>document.fonts.ready);
   assert.deepEqual(await page.locator('.v2-component-section:visible').evaluateAll(ns=>ns.map(n=>n.id)),['tabs','segmented']);
   assert.equal(await page.locator('#tabs .v2-state-comparison').evaluate(n=>n.open),false);
   const widget=page.locator('[data-v2-tabs]').filter({has:page.locator('#v2-history-tabs-tab-0')});
   const selected=()=>widget.locator('[role="tab"][aria-selected="true"]').textContent();
   assert.equal(await selected(),'전체');
   await widget.getByRole('tab',{name:'적립',exact:true}).click();assert.equal(await selected(),'적립');
   assert.equal(await widget.locator('[role="tabpanel"]:visible').count(),1);
   assert.match(await widget.locator('[role="tabpanel"]:visible').textContent(),/적립/);
   assert.equal(await widget.locator('[role="tab"][tabindex="0"]').count(),1);
   await page.keyboard.press('End');assert.equal(await selected(),'사용','End skips disabled last tab');
   await page.keyboard.press('ArrowRight');assert.equal(await selected(),'전체','wrap skips disabled');
   await page.keyboard.press('ArrowLeft');assert.equal(await selected(),'사용');
   await page.keyboard.press('Home');assert.equal(await selected(),'전체');
   const y=await page.evaluate(()=>scrollY);await page.keyboard.press('ArrowRight');assert.equal(await selected(),'적립');
   assert.equal(await page.evaluate(()=>scrollY),y,'tab activation does not jump vertically');
   await page.keyboard.press('Tab');assert.equal(await widget.locator('#v2-history-tabs-panel-1').evaluate(n=>document.activeElement===n),true);
   const disabledTab=widget.getByRole('tab',{name:'직접 선택',exact:true});assert.equal(await disabledTab.isDisabled(),true);
   await disabledTab.dispatchEvent('click');assert.equal(await selected(),'적립');
   assert.ok(await widget.locator('[role="tab"]').evaluateAll(ns=>ns.every(n=>{const r=n.getBoundingClientRect();return r.height>=48&&r.width>=48&&getComputedStyle(n).whiteSpace==='nowrap';})),'tabs touch sizes '+width);
   assert.equal(await widget.locator('[aria-selected="true"]').evaluate(n=>getComputedStyle(n,'::after').height),'2px');
   const sort=page.locator('[data-v2-segment]').filter({has:page.locator('#v2-sort-segment-0')});
   const period=page.locator('[data-v2-segment]').filter({has:page.locator('#v2-period-segment-0')});
   await sort.getByRole('radio',{name:'금액순',exact:true}).click();assert.equal(await sort.getByRole('radio',{name:'금액순',exact:true}).isChecked(),true);
   assert.match(await sort.locator('[data-segment-result]').textContent(),/금액순/);
   assert.match(await sort.locator('[data-segment-feedback]').textContent(),/실제 조회·저장은 하지 않습니다/);
   assert.equal(await period.getByRole('radio',{name:'1개월',exact:true}).isChecked(),true,'groups remain independent');
   await period.getByRole('radio',{name:'1개월',exact:true}).focus();await page.keyboard.press('ArrowRight');
   assert.equal(await period.getByRole('radio',{name:'3개월',exact:true}).isChecked(),true);
   const radioY=await page.evaluate(()=>scrollY);await page.keyboard.press('ArrowRight');
   assert.equal(await period.getByRole('radio',{name:'1개월',exact:true}).isChecked(),true,'native arrow skips disabled');
   assert.equal(await page.evaluate(()=>scrollY),radioY,'native radio stays in-flow');
   const radio=period.getByRole('radio',{name:'6개월',exact:true});assert.equal(await radio.isDisabled(),true);
   await radio.dispatchEvent('change');assert.equal(await period.getByRole('radio',{name:'1개월',exact:true}).isChecked(),true);
   assert.ok(await page.evaluate(()=>{
    const canvas=document.createElement('canvas');canvas.width=canvas.height=1;const ctx=canvas.getContext('2d');
    const lum=color=>{ctx.clearRect(0,0,1,1);ctx.fillStyle=color;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data].slice(0,3).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);};
    const background=document.createElement('div');background.style.background='var(--v2-disabled)';document.body.append(background);
    const preservedBackground=getComputedStyle(background).backgroundColor;background.remove();
    return [
     [document.querySelector('#v2-history-tabs-tab-3'),document.querySelector('#v2-history-tabs-tab-2')],
     [document.querySelector('#v2-period-segment-2+span'),document.querySelector('#v2-period-segment-1+span')]
    ].every(([disabled,enabled])=>{const style=getComputedStyle(disabled);return lum(style.color)>lum(getComputedStyle(enabled).color)+.28&&style.backgroundColor===preservedBackground&&style.filter==='none'&&style.opacity==='1';});
   }),'disabled text is visibly lighter, without blur or changing its background '+width);
   assert.ok(await page.locator('#segmented .v2-segment input:visible').evaluateAll(ns=>ns.every(n=>{const r=n.getBoundingClientRect();return r.width>=48&&r.height>=48;})),'segment touch sizes '+width);
   assert.notEqual(await sort.locator('input:checked+span').evaluate(n=>getComputedStyle(n).boxShadow),'none');
   await widget.getByRole('tab',{name:'전체',exact:true}).focus();await page.keyboard.press('ArrowRight');
   assert.equal(await widget.getByRole('tab',{name:'적립',exact:true}).evaluate(n=>getComputedStyle(n).outlineWidth),'3px');
   await page.emulateMedia({reducedMotion:'reduce'});
   assert.ok(await page.locator('.v2-tabs [role="tab"],.v2-segment span').evaluateAll(ns=>ns.every(n=>getComputedStyle(n).animationName==='none')));
   await page.emulateMedia({forcedColors:'active'});
   assert.notEqual(await sort.locator('input:checked+span').evaluate(n=>getComputedStyle(n).outlineStyle),'none');
   await page.emulateMedia({forcedColors:'none',reducedMotion:'no-preference'});
   for(const section of ['tabs','segmented'])await page.locator('#'+section+' .v2-state-comparison > summary').click();
   assert.ok(await page.locator('.v2-tabs-stage[inert]').count()>0);
   assert.ok(await page.locator('#tabs [data-state="loading"] [role="tabpanel"]:visible').getAttribute('aria-busy')==='true');
   assert.equal(await page.locator('#tabs [data-state="loading"] [role="tab"]:disabled').count(),0,'loading belongs to content');
   assert.match(await page.locator('#tabs [data-state="error"] [role="tabpanel"]:visible').textContent(),/다시 시도/);
   assert.match(await page.locator('#tabs [data-state="empty"] [role="tabpanel"]:visible').textContent(),/아직 방문 내역/);
   assert.equal(await page.locator('#tabs [data-state="success"] [aria-selected="true"]').textContent(),'적립');
   // Native unavailable controls are contrast-exempt; enabled text keeps its AA floor.
   assert.ok(await page.locator('.v2-tabs [role="tab"]:not(:disabled),.v2-segment input:not(:disabled)+span').evaluateAll(ns=>{
    const c=document.createElement('canvas');c.width=c.height=1;const ctx=c.getContext('2d');
    const lum=color=>{ctx.clearRect(0,0,1,1);ctx.fillStyle=color;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data].slice(0,3).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);};
    return ns.every(n=>{let surface=n;while(surface.parentElement&&getComputedStyle(surface).backgroundColor==='rgba(0, 0, 0, 0)')surface=surface.parentElement;const a=lum(getComputedStyle(n).color),b=lum(getComputedStyle(surface).backgroundColor);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05)>=4.5;});
   }),'selection text contrast >=4.5 '+width);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no root overflow '+width);
   if([390,1440].includes(width)){
    for(const section of ['tabs','segmented'])await page.locator('#'+section+' .v2-state-comparison > summary').click();
    await page.locator('#tabs-title').click();await page.screenshot({path:`/private/tmp/og-v2-tabs-${width}.png`,fullPage:true});
   }
  }
  await page.setViewportSize({width:320,height:1000});await page.goto(`${base}/v2/components/#tabs`);await page.reload();
  await page.evaluate(async()=>{
   const {renderTabs,setupTabs}=await import('/v2/components/tabs.mjs');
   const fixture=document.createElement('div');fixture.className='v2-tabs-stage';fixture.id='long-tab-fixture';
   fixture.innerHTML=renderTabs({id:'long-tabs',items:['전체 내역 보기','매장 방문 적립','후기 작성 적립','영수증 적립 내역','공유 마일리지 적립','마일리지 사용 내역']});
   document.querySelector('#tabs').append(fixture);setupTabs(fixture);setupTabs(fixture);
  });
  const long=page.locator('#long-tab-fixture');await long.getByRole('tab').first().click();
  const longY=await page.evaluate(()=>scrollY);await page.keyboard.press('End');
  assert.equal(await long.getByRole('tab').last().getAttribute('aria-selected'),'true');assert.equal(await page.evaluate(()=>scrollY),longY);
  assert.ok(await long.getByRole('tab').last().evaluate(n=>{const a=n.getBoundingClientRect(),b=n.parentElement.getBoundingClientRect();return a.left>=b.left-1&&a.right<=b.right+1;}),'offscreen selected tab revealed horizontally');
  await long.evaluate(n=>n.dir='rtl');await page.keyboard.press('Home');await page.keyboard.press('ArrowLeft');
  assert.equal(await long.getByRole('tab').nth(1).getAttribute('aria-selected'),'true','RTL arrow follows visual direction');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.evaluate(async()=>{
   const {renderTabs,renderSegment,setupTabs}=await import('/v2/components/tabs.mjs');
   const fixture=document.createElement('div');fixture.id='nested-switches';fixture.className='v2-tabs-stage';
   fixture.innerHTML=renderTabs({id:'outer-tabs',items:['정보','활동'],panels:[renderTabs({id:'inner-tabs',items:['소개','후기']}),'<p>활동 내용</p>']})+renderSegment({id:'outer-segment'});
   fixture.querySelector('[data-v2-segment] .v2-segment-result').insertAdjacentHTML('beforeend',renderSegment({id:'inner-segment',items:['기본','상세']}));
   document.querySelector('#tabs').append(fixture);setupTabs(fixture);
  });
  await page.locator('#inner-tabs-tab-1').click();
  assert.equal(await page.locator('#outer-tabs-tab-0').getAttribute('aria-selected'),'true','nested tab click never clears parent selection');
  assert.equal(await page.locator('#outer-tabs-panel-0').isVisible(),true);
  assert.equal(await page.locator('#inner-tabs-panel-1').isVisible(),true);
  await page.keyboard.press('Home');assert.equal(await page.locator('#inner-tabs-tab-0').getAttribute('aria-selected'),'true');
  assert.equal(await page.locator('#outer-tabs-tab-0').getAttribute('aria-selected'),'true');
  await page.locator('#outer-tabs-tab-1').click();
  assert.equal(await page.locator('#inner-tabs-tab-0').getAttribute('aria-selected'),'true','parent tab activation preserves nested selection');
  await page.locator('#inner-segment-1').click();
  const outerSegment=page.locator('#outer-segment-0').locator('../..').locator('..');
  assert.equal(await page.locator('#outer-segment-0').isChecked(),true);
  assert.equal(await outerSegment.locator(':scope > [data-segment-feedback]').textContent(),'','nested radio change never announces from parent');
  const touch=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true}),phone=await touch.newPage();
  await phone.goto(`${base}/v2/components/#tabs`);await phone.locator('#v2-history-tabs-tab-2').tap();
  assert.equal(await phone.locator('#v2-history-tabs-tab-2').getAttribute('aria-selected'),'true');
  await phone.locator('#v2-sort-segment-1').tap();assert.equal(await phone.locator('#v2-sort-segment-1').isChecked(),true);await touch.close();
  await page.route('**/*.{woff,woff2}',route=>route.abort());await page.goto(`${base}/v2/components/#tabs`);await page.reload();await page.evaluate(()=>document.fonts.ready);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'font fallback fits');
  const ids=await page.locator('[id]').evaluateAll(ns=>ns.map(n=>n.id));assert.equal(new Set(ids).size,ids.length,'unique ids');
  assert.deepEqual(errors,[]);assert.deepEqual(writes,[]);
  console.log('Tabs/segments: 7 widths, linked panels, touch/keyboard/RTL, disabled skip, local results, content states, focus/contrast, long rail without vertical jumps, font fallback and no writes passed');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
