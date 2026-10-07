const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 const page=await browser.newPage(),failures=[];let passed=0;
 const check=async(name,run)=>{try{await run();passed++;console.log('PASS '+name);}catch(e){failures.push(name+': '+e.message);console.error('FAIL '+name+': '+e.message);}};
 const gallery=async(id)=>{await page.goto(base+'/v2/my-info/#'+id);const more=page.locator('#'+id+' .v2-source-extra>summary');if(await more.count())await more.click();await page.waitForFunction(id=>[...document.querySelectorAll('#'+id+' .v2-source-host')].every(n=>n.dataset.sourceReady==='true'),id);};
 try{for(const width of [320,390,768]){
  await page.setViewportSize({width,height:1100});await page.goto(base+'/v2/components/#text-input');
  await page.evaluate(async()=>{
   const {renderInput}=await import('/v2/components/input.mjs');
   const stage=document.createElement('div');stage.id='qa-rules';stage.style.cssText='position:fixed;top:0;left:16px;width:calc(100vw - 32px);max-width:390px;z-index:100';stage.innerHTML='<div class="v2-dialog-panel"><h3>확인</h3>'+renderInput({label:'확인창 입력',value:'입력값'})+'<div class="og-dialog-actions v2-dialog-actions"><button class="v2-button" data-variant="primary">확인</button><button class="v2-button" data-variant="secondary">취소</button></div></div><button class="v2-chip" aria-pressed="false">한식</button><button class="v2-chip" aria-pressed="true">중식</button><span class="v2-count-badge">99+</span><span class="v2-unread-dot"></span><span class="v2-badge" data-variant="solid">진행 중</span>';document.body.append(stage);
  });
  await check('flat Fill/Line including pressed; modal keeps depth @'+width,async()=>{
   const rows=await page.locator('#qa-rules .v2-button').evaluateAll(ns=>ns.map(n=>{const s=getComputedStyle(n),r=n.getBoundingClientRect();return {shadow:s.boxShadow,image:s.backgroundImage,bg:s.backgroundColor,border:s.borderWidth,size:[r.width,r.height]};}));
   assert.equal(rows.length,2);for(const r of rows){assert.equal(r.shadow,'none');assert.equal(r.image,'none');assert.ok(r.size.every(v=>v>=44));}assert.equal(rows[1].bg,'oklch(1 0 0)');assert.equal(rows[1].border,'1px');
   await page.locator('#qa-rules .v2-button').evaluateAll(ns=>ns.forEach(n=>n.dataset.state='active'));assert.ok(await page.locator('#qa-rules .v2-button').evaluateAll(ns=>ns.every(n=>getComputedStyle(n).boxShadow==='none')));
   assert.equal(await page.locator('#qa-rules .v2-dialog-panel').evaluate(n=>getComputedStyle(n).textAlign),'center');assert.notEqual(await page.locator('#qa-rules .v2-dialog-panel').evaluate(n=>getComputedStyle(n).boxShadow),'none');
  });
  await check('Line/Fill chips and red notification-only badges @'+width,async()=>{
   for(const chip of await page.locator('#qa-rules .v2-chip').all()){assert.equal(await chip.evaluate(n=>getComputedStyle(n).boxShadow),'none');assert.equal(await chip.evaluate(n=>getComputedStyle(n).backgroundImage),'none');assert.equal(await chip.evaluate(n=>getComputedStyle(n).borderWidth),'1px');}
   const colors=await page.locator('#qa-rules :is(.v2-count-badge,.v2-unread-dot,.v2-badge)').evaluateAll(ns=>ns.map(n=>getComputedStyle(n).backgroundColor));assert.equal(colors[0],colors[1]);assert.notEqual(colors[0],colors[2]);const rgb=await page.evaluate(color=>{const c=document.createElement('canvas').getContext('2d');c.fillStyle=color;c.fillRect(0,0,1,1);return [...c.getImageData(0,0,1,1).data];},colors[0]);assert.ok(rgb[0]>rgb[1]&&rgb[0]>rgb[2]);
  });
  await check('modal Line input; default raised input preserved @'+width,async()=>{
   const field=page.locator('#qa-rules input');assert.equal(await field.evaluate(n=>getComputedStyle(n).boxShadow),'none');assert.equal(await field.evaluate(n=>getComputedStyle(n).backgroundColor),'oklch(1 0 0)');assert.ok(['left','start'].includes(await field.evaluate(n=>getComputedStyle(n).textAlign)));assert.notEqual(await page.locator('#text-input-live input').evaluate(n=>getComputedStyle(n).boxShadow),'none');
  });
  await check('Line button has a visible pale gray boundary @'+width,async()=>{
   const rgb=await page.locator('#qa-rules [data-variant="secondary"]').evaluate(n=>{const c=document.createElement('canvas').getContext('2d');c.fillStyle=getComputedStyle(n).borderColor;c.fillRect(0,0,1,1);return [...c.getImageData(0,0,1,1).data].slice(0,3);});
   assert.ok(rgb.every(c=>c>=190&&c<245)&&Math.max(...rgb)-Math.min(...rgb)<12,JSON.stringify(rgb));
  });
  await page.goto(base+'/v2/home/');await page.locator('.home-search-form').waitFor();
  await check('Home buttons flat; search field retains its raised surface @'+width,async()=>{
   const controls=page.locator('.home-category,.home-locate,.home-quick,.home-explore');assert.ok(await controls.count()>=6);assert.ok(await controls.evaluateAll(ns=>ns.every(n=>getComputedStyle(n).boxShadow==='none'&&getComputedStyle(n).backgroundImage==='none')));
   assert.notEqual(await page.locator('.home-search-form').evaluate(n=>getComputedStyle(n).boxShadow),'none');assert.notEqual(await page.locator('.bottom-navigation').evaluate(n=>getComputedStyle(n).boxShadow),'none');
  });
  await check('selected Home category retains its keyboard focus ring @'+width,async()=>{
   const selected=page.locator('.home-category[data-category][aria-pressed="true"]').first();await selected.focus();
   const focus=await selected.evaluate(n=>{const s=getComputedStyle(n);return {visible:n.matches(':focus-visible'),style:s.outlineStyle,width:parseFloat(s.outlineWidth)};});
   assert.ok(focus.visible);assert.notEqual(focus.style,'none');assert.ok(focus.width>=2);
   await selected.evaluate(n=>n.blur());
  });
  if(width===390)await page.locator('.home-test').screenshot({path:'/private/tmp/og-qa-home-flat-390.png'});
  await page.goto(base+'/v2/home/#review-list');await page.locator('#review-list .og-app-bar .og-icon-button').first().waitFor();
  await check('review toolbar does not restore icon button depth @'+width,async()=>{assert.equal(await page.locator('#review-list .og-app-bar .og-icon-button').first().evaluate(n=>getComputedStyle(n).boxShadow),'none');});
  await gallery('password');
  await check('Figma PIN slots, flat bottom keypad and retained error states @'+width,async()=>{
   for(const state of ['auth','create','confirm','confirm-error','auth-error']){
    const screen=page.locator('#password [data-source-state="'+state+'"] .v2-source-frame');assert.equal(await screen.locator('.og-pin-display .og-pin-dot').count(),6);assert.equal(await screen.locator('[data-pin-key]').count(),11);assert.equal(await screen.locator('[data-pin-key="clear"]').count(),0);assert.equal(await screen.locator('.v2-pin-empty').count(),1);
    assert.ok(await screen.locator('[data-pin-key]').evaluateAll(ns=>ns.every(n=>getComputedStyle(n).boxShadow==='none'&&getComputedStyle(n).backgroundImage==='none')));
    const box=await screen.boundingBox(),keys=await screen.locator('.og-pin-keys').boundingBox(),dots=await screen.locator('.og-pin-display').boundingBox();assert.ok(Math.abs(box.y+box.height-keys.y-keys.height)<1);assert.ok(dots.y<box.y+320);assert.equal(Math.round(dots.width),200);assert.ok(await screen.evaluate(n=>n.scrollWidth<=n.clientWidth));assert.ok(await screen.locator('[data-pin-key="backspace"] img').evaluate(n=>n.complete&&n.naturalWidth>0));
   }
   assert.equal(await page.locator('#password [data-source-state="create"] .og-pin-dot.is-filled').count(),3);assert.equal(await page.locator('#password [data-source-state="confirm-error"] .og-pin-dot.is-filled').count(),6);assert.ok(await page.locator('#password [data-source-state="confirm-error"] .og-dialog-panel').count());assert.ok(await page.locator('#password [data-source-state="auth-error"] .og-snackbar').count());
  });
  if(width===390)for(const state of ['auth','create','confirm-error'])await page.locator('#password [data-source-state="'+state+'"] .v2-source-frame').screenshot({path:'/private/tmp/og-qa-password-'+state+'.png'});
  await gallery('membership');
  await check('referral underline; certificate keeps depth @'+width,async()=>{
   for(const seat of await page.locator('#membership .v2-member-referral>div').all()){assert.equal(await seat.evaluate(n=>getComputedStyle(n).boxShadow),'none');assert.equal(await seat.evaluate(n=>getComputedStyle(n).borderBottomWidth),'1px');assert.equal(await seat.evaluate(n=>getComputedStyle(n).borderRadius),'0px');}
   assert.notEqual(await page.locator('#membership [data-source-state="basic"] .v2-member-certificate').evaluate(n=>getComputedStyle(n).boxShadow),'none');
  });
  await gallery('opinion');
  await check('opinion fields use the same flat neutral Line including select @'+width,async()=>{
   const fields=page.locator('#opinion [data-source-state="empty"] .v2-input :is(input,textarea,select)');assert.ok(await fields.count()>=2);
   assert.ok(await fields.evaluateAll(ns=>ns.every(n=>{const s=getComputedStyle(n),c=document.createElement('canvas').getContext('2d');c.fillStyle=s.borderColor;c.fillRect(0,0,1,1);const rgb=[...c.getImageData(0,0,1,1).data].slice(0,3);return s.boxShadow==='none'&&s.backgroundImage==='none'&&s.borderWidth==='1px'&&Math.max(...rgb)-Math.min(...rgb)<12;})));
  });
  if(width===390)await page.locator('#opinion [data-source-state="empty"] .v2-source-frame').screenshot({path:'/private/tmp/og-qa-opinion-flat-390.png'});
  await page.goto(base+'/v2/my-info/#use-history');await page.locator('[data-use-state="basic-0"] .v2-use-history-frame').waitFor();
  await check('reservation details outrank Line close within the actual sheet @'+width,async()=>{
   const frame=page.locator('[data-use-state="basic-0"] .v2-use-history-frame');assert.equal(await frame.locator('.v2-use-action button').getAttribute('data-variant'),'primary');assert.equal(await frame.locator('.og-sheet-footer button').getAttribute('data-variant'),'secondary');assert.ok(await frame.locator('.v2-button').evaluateAll(ns=>ns.every(n=>getComputedStyle(n).boxShadow==='none')));
  });
  if(width===390)await page.locator('[data-use-state="basic-0"] .v2-use-history-frame').screenshot({path:'/private/tmp/og-qa-use-history-flat-390.png'});
 }console.log('QA agreed rules: '+passed+' passed; '+failures.length+' failed.');assert.deepEqual(failures,[]);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
