const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
// Browser focus may scroll the viewport; compare layout coordinates in the document.
const documentBox=locator=>locator.evaluate(n=>{const r=n.getBoundingClientRect();return{x:r.x+scrollX,y:r.y+scrollY,width:r.width,height:r.height};});
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.url()+':'+r.status());});
  for(const width of [320,375,390,414,768,1024,1440]){
   await page.setViewportSize({width,height:1000});await page.goto(`${base}/v2/components/#search`);await page.reload();
   const search=page.locator('[data-home-component="search"] .home-search-form');
   await search.waitFor();
   const material=n=>{const s=getComputedStyle(n);return {fill:s.backgroundImage,depth:s.boxShadow,radius:s.borderRadius,height:n.getBoundingClientRect().height};};
   const homeMaterial=await search.evaluate(material);
   await page.goto(`${base}/v2/components/#text-input`);
   assert.equal(await page.locator('#text-input').count(),1,'v2 offers text input previews');
   await page.locator('#text-input').waitFor();await page.evaluate(()=>document.fonts.ready);
   assert.deepEqual(await page.locator('#text-input-live input').evaluate(material),homeMaterial,'text input shares Home search surface, depth, curvature and height');
   assert.deepEqual(await page.locator('#password-input-live input').evaluate(material),homeMaterial,'password belongs to the same input family');
   assert.deepEqual(await page.locator('.v2-component-section:visible').evaluateAll(ns=>ns.map(n=>n.id)),['search','text-input','password-input','phone-input','numeric-input','multiline-input']);
   const field=page.locator('#text-input-live input'),help=page.locator('#text-input-live .og-field-help');
   await field.fill('');assert.notEqual(await field.getAttribute('aria-invalid'),'true','no error before blur');
   const before=await field.boundingBox();await page.locator('#text-input-title').click();
   assert.equal(await field.getAttribute('aria-invalid'),'true');assert.match(await help.innerText(),/비어.*입력/);
   assert.equal((await field.boundingBox()).height,before.height,'validation keeps input geometry');
   await field.fill('검토용 이름');assert.equal(await field.getAttribute('aria-invalid'),'false');assert.match(await help.innerText(),/실제.*변경하지/);
   assert.equal(await help.getAttribute('aria-live'),'polite');
   const pass=page.locator('#password-input-live input'),toggle=page.locator('#password-input-live button');
   await pass.fill('test-only-123');const passBefore=await documentBox(pass);
   await toggle.click();assert.equal(await pass.getAttribute('type'),'text');assert.equal(await pass.inputValue(),'test-only-123');
   assert.equal(await toggle.getAttribute('aria-pressed'),'true');assert.match(await toggle.getAttribute('aria-label'),/숨기기/);
   assert.deepEqual(await documentBox(pass),passBefore);await toggle.press('Space');assert.equal(await pass.getAttribute('type'),'password');
   assert.equal(await toggle.getAttribute('aria-pressed'),'false');
   await pass.fill('');await toggle.click();assert.notEqual(await pass.getAttribute('aria-invalid'),'true','visibility is not leaving field');
   await toggle.click();await page.locator('#password-input-title').click();assert.equal(await pass.getAttribute('aria-invalid'),'true');
   await pass.fill('demo');assert.equal(await pass.getAttribute('aria-invalid'),'false');
   for(const kind of ['text-input','password-input']){
    const details=page.locator(`#${kind} .v2-state-comparison`);assert.equal(await details.evaluate(n=>n.open),false);await details.locator('summary').click();
    assert.equal(await page.locator(`#${kind}-state-disabled input`).isDisabled(),true);
    if(kind==='password-input')assert.equal(await page.locator(`#${kind}-state-disabled button`).isDisabled(),true);
    assert.equal(await page.locator(`#${kind}-state-readonly input`).getAttribute('readonly'),'');
    assert.equal(await page.locator(`#${kind}-state-readonly input`).isDisabled(),false);
    const loading=page.locator(`#${kind}-state-loading input`);assert.equal(await loading.isEditable(),true);assert.equal(await loading.getAttribute('aria-busy'),'true');
    await loading.fill('changed');assert.equal(await loading.getAttribute('aria-busy'),null,'editing clears stale checking');
    const error=page.locator(`#${kind}-state-error input`);assert.equal(await error.getAttribute('aria-invalid'),'true');
    await error.fill('fixed');assert.equal(await error.getAttribute('aria-invalid'),'false');
    await page.locator(`#${kind}-state-success input`).fill('new-value');assert.equal(await page.locator(`#${kind}-state-success .v2-input`).getAttribute('data-state'),'default');
    assert.ok(await page.locator(`#${kind} .v2-input`).evaluateAll(ns=>ns.every(n=>getComputedStyle(n.querySelector('input')).borderWidth==='1px')),'constant borders');
    assert.ok(await page.locator(`#${kind} label,#${kind} .og-field-help,#${kind} input,#${kind} button`).evaluateAll(ns=>{
     const c=document.createElement('canvas'),ctx=c.getContext('2d');c.width=c.height=1;
     const l=color=>{ctx.fillStyle=color;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data].slice(0,3).map(x=>x/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((a,x,i)=>a+x*[.2126,.7152,.0722][i],0);};
     // Entered values and metadata stay at 4.5:1; only the approved #ADB0B7 placeholder uses 1.7:1.
     return ns.every(n=>{let s=n.matches('.og-password-toggle')?n.closest('.og-field-control').querySelector('input'):n;while(s.parentElement&&getComputedStyle(s).backgroundImage==='none'&&getComputedStyle(s).backgroundColor==='rgba(0, 0, 0, 0)')s=s.parentElement;const style=getComputedStyle(s),colors=style.backgroundImage==='none'?[style.backgroundColor]:style.backgroundImage.match(/oklch\([^)]*\)|rgba?\([^)]*\)/g),textColors=[getComputedStyle(n).color];if(n.matches('input'))textColors.push(getComputedStyle(n,'::placeholder').color);return colors&&textColors.every((text,index)=>{const a=l(text);return colors.every(color=>{const b=l(color);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05)>=(index===0?4.5:1.7);});});});
    }),'text contrast '+kind+' '+width);
    await details.locator('summary').click();
   }
   await field.focus();assert.equal(await field.evaluate(n=>getComputedStyle(n).outlineWidth),'3px');
   assert.ok(await page.locator('.v2-input input:visible,.v2-input button:visible').evaluateAll(ns=>ns.every(n=>{const r=n.getBoundingClientRect();return r.height>=48&&r.width>=48&&r.left>=0&&r.right<=innerWidth;})),'48px touch targets '+width);
   const label=page.locator('#text-input-live label'),original=await label.innerText();await label.evaluate(n=>n.textContent='아주긴한글입력항목이름도빠짐없이보이는지확인하는검토용라벨'.repeat(3));
   assert.ok(await label.evaluate(n=>n.scrollWidth<=n.clientWidth+1),'long label wraps');
   await label.evaluate((n,text)=>n.textContent=text,original);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no overflow '+width);
   assert.ok(await page.locator('.v2-input label,.v2-input input,.v2-input .og-field-help').evaluateAll(ns=>ns.every(n=>getComputedStyle(n).textShadow==='none')));
   if([390,1440].includes(width)){await page.locator('#text-input-title').click();await page.locator('main').screenshot({path:`/private/tmp/og-v2-input-${width}.png`});}
  }
  const touch=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true}),phone=await touch.newPage();
  await phone.goto(`${base}/v2/components/#password-input`);await phone.locator('#password-input-live button').tap();
  assert.equal(await phone.locator('#password-input-live input').getAttribute('type'),'text');await touch.close();
  await page.emulateMedia({reducedMotion:'reduce'});assert.ok(await page.locator('.v2-input input,.v2-input button').evaluateAll(ns=>ns.every(n=>getComputedStyle(n).transitionDuration==='0s'&&getComputedStyle(n).animationName==='none')));
  await page.goto(`${base}/v2/components/#password-input`);
  await page.reload();
  await page.locator('#password-input-live input').fill('');
  const nullBlur=await page.evaluate(()=>{
   const field=document.querySelector('#password-input-live .v2-input'),input=field.querySelector('input'),button=field.querySelector('button');
   input.focus();button.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,cancelable:true,pointerType:'touch'}));
   input.dispatchEvent(new FocusEvent('focusout',{bubbles:true,relatedTarget:null}));button.click();
   return {invalid:input.getAttribute('aria-invalid'),state:field.dataset.state,type:input.type};
  });
  assert.deepEqual(nullBlur,{invalid:'false',state:'default',type:'text'},'null-target blur during visibility press stays inside field');
  await page.locator('#password-input-live input').evaluate(input=>input.dispatchEvent(new FocusEvent('focusout',{bubbles:true,relatedTarget:null})));
  assert.equal(await page.locator('#password-input-live input').getAttribute('aria-invalid'),'true','later genuine outside blur still validates');
  assert.deepEqual(errors,[]);console.log('Input: grouped Home search/text/password, matching material, touched validation, editable checking, visibility/disabled/readonly, stable geometry, gradient/placeholder contrast, 7 widths and keyboard/touch passed');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
