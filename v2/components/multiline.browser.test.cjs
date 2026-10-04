const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/v2/components/#multiline-input');await page.locator('main').waitFor();
  assert.equal(await page.locator('#multiline-input textarea').count()>0,true,'group includes live multiline samples');
  for(const width of [320,375,390,414,768,1024,1440]){
   await page.setViewportSize({width,height:1100});await page.goto(base+'/v2/components/#multiline-input');await page.reload();
   const input=page.locator('#multiline-input-live textarea'),limited=page.locator('#multiline-limit-live textarea');
   await input.waitFor();assert.equal(await input.getAttribute('maxlength'),null);
   assert.equal(await page.locator('#multiline-input-live .og-field-count').count(),0);
   assert.equal(await input.getAttribute('aria-invalid'),'false');
   await input.focus();await input.press('Tab');assert.equal(await input.getAttribute('aria-invalid'),'true');
   await input.fill('한글 내용\n두 번째 줄');assert.equal(await input.getAttribute('aria-invalid'),'false');
   await input.fill('가'.repeat(500)+'😊');assert.equal((await input.inputValue()).length,502,'unlimited input keeps long text and emoji');
   await limited.fill('가😊\n나');assert.equal(await page.locator('#multiline-limit-live .og-field-count').innerText(),'5 / 200');
   await limited.evaluate(n=>{
    n.dispatchEvent(new CompositionEvent('compositionstart',{bubbles:true}));n.value='조합 중';
    n.dispatchEvent(new InputEvent('input',{bubbles:true,isComposing:true,inputType:'insertCompositionText'}));
    n.dispatchEvent(new CompositionEvent('compositionend',{bubbles:true,data:'중'}));
   });
   assert.equal(await limited.inputValue(),'조합 중','IME content is never rewritten');
   assert.equal(await page.locator('#multiline-limit-live .og-field-count').innerText(),'4 / 200');
   const details=page.locator('#multiline-input details');assert.equal(await details.getAttribute('open'),null);
   await details.locator('summary').click();
   assert.equal(await page.locator('#multiline-state-disabled textarea').isEditable(),false);
   assert.equal(await page.locator('#multiline-state-readonly textarea').isEditable(),false);
   const loading=page.locator('#multiline-state-loading textarea');assert.equal(await loading.isEditable(),true);
   await loading.fill('변경');assert.equal(await loading.getAttribute('aria-busy'),null);
   const error=page.locator('#multiline-state-error textarea');await error.fill('수정');assert.equal(await error.getAttribute('aria-invalid'),'false');
   await page.locator('#multiline-state-success textarea').fill('다시 작성');
   assert.equal(await page.locator('#multiline-state-success .v2-input').getAttribute('data-state'),'default');
   assert.ok(await page.locator('#multiline-input textarea').evaluateAll(ns=>ns.every(n=>{const s=getComputedStyle(n),r=n.getBoundingClientRect();return s.borderWidth==='1px'&&s.borderRadius==='16px'&&r.height>=144&&n.scrollWidth<=n.clientWidth+1;})),'stable, readable multiline geometry '+width);
   assert.ok(await page.locator('#multiline-input label,#multiline-input textarea,#multiline-input .og-field-help,#multiline-input .og-field-count').evaluateAll(ns=>{
    const c=document.createElement('canvas'),ctx=c.getContext('2d');c.width=c.height=1;
    const l=color=>{ctx.fillStyle=color;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data].slice(0,3).map(x=>x/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((a,x,i)=>a+x*[.2126,.7152,.0722][i],0);};
    // Entered values and metadata stay at 4.5:1; only the approved placeholder variant uses 3:1.
    return ns.every(n=>{let surface=n;while(surface.parentElement&&getComputedStyle(surface).backgroundImage==='none'&&getComputedStyle(surface).backgroundColor==='rgba(0, 0, 0, 0)')surface=surface.parentElement;const s=getComputedStyle(surface),backgrounds=s.backgroundImage==='none'?[s.backgroundColor]:s.backgroundImage.match(/oklch\([^)]*\)|rgba?\([^)]*\)/g),foregrounds=[getComputedStyle(n).color];if(n.matches('textarea'))foregrounds.push(getComputedStyle(n,'::placeholder').color);return backgrounds&&foregrounds.every((fg,index)=>backgrounds.every(bg=>(Math.max(l(fg),l(bg))+.05)/(Math.min(l(fg),l(bg))+.05)>=(index===0?4.5:3)));});
   }),'value, hint, count, error and placeholder contrast '+width);
   const parity=await page.evaluate(()=>{
    const one=getComputedStyle(document.querySelector('#text-input-live input')),multi=getComputedStyle(document.querySelector('#multiline-input-live textarea'));
    return ['backgroundImage','boxShadow','fontSize','lineHeight','color'].every(k=>one[k]===multi[k]);
   });assert.ok(parity,'shared input material '+width);
   await details.locator('summary').click();
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no page overflow '+width);
   await input.focus();assert.equal(await input.evaluate(n=>getComputedStyle(n).outlineWidth),'3px');
   if([390,1440].includes(width)){await input.fill('적립 내역이 보이지 않아요.\n확인 부탁드립니다.');await limited.fill('메뉴가 어디에 있는지 궁금해요.');await page.locator('#multiline-input-title').click();await page.locator('#multiline-input').screenshot({path:`/private/tmp/og-v2-multiline-${width}.png`});}
  }
  await page.locator('#multiline-limit-live textarea').fill('가'.repeat(197)+'😊');
  await page.locator('#multiline-limit-live textarea').press('End');await page.keyboard.type('ab');
  assert.equal(await page.locator('#multiline-limit-live textarea').inputValue(),'가'.repeat(197)+'😊a');
  assert.equal(await page.locator('#multiline-limit-live .og-field-count').innerText(),'200 / 200');
  await page.locator('#multiline-limit-live textarea').evaluate(n=>{n.value='가'.repeat(201);n.dispatchEvent(new InputEvent('input',{bubbles:true}));});
  await page.locator('#multiline-input-title').click();
  assert.equal(await page.locator('#multiline-limit-live textarea').getAttribute('aria-invalid'),'true','preloaded excess is explained, not silently discarded');
  assert.equal((await page.locator('#multiline-limit-live textarea').inputValue()).length,201);
  await page.locator('#multiline-limit-live textarea').fill('수정');assert.equal(await page.locator('#multiline-limit-live textarea').getAttribute('aria-invalid'),'false');
  await page.reload();assert.equal(await page.locator('#multiline-input-live textarea').inputValue(),'','values are not stored');
  const prefilled=await page.evaluate(async()=>{
   const {renderMultiline,setupInputSamples}=await import('/v2/components/input.mjs');
   const root=document.createElement('div');document.querySelector('main').append(root);
   const results=['','첫 줄','\n첫 줄','\n\n첫 줄'].map((value,i)=>{
    root.innerHTML=renderMultiline({id:'prefilled-'+i,label:'내용',value,maxLength:200});setupInputSamples(root);
    return {expected:value,actual:root.querySelector('textarea').value,count:root.querySelector('.og-field-count').textContent};
   });root.remove();return results;
  });
  for(const result of prefilled){assert.equal(result.actual,result.expected,'leading newlines survive HTML parsing');assert.equal(result.count,result.expected.length+' / 200');}
  assert.deepEqual(errors,[]);
  console.log('Multiline: optional native limit/count, IME content, touched errors, state reset, shared material, seven widths and no storage passed');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
