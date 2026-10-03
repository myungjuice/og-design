const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/v2/components/#dialogs');
  assert.equal(await page.locator('#dialogs .v2-dialog-static').count(),3,'all three approved variants');
  for(const width of [320,375,390,414,768,1024,1440]){
   await page.setViewportSize({width,height:900});await page.reload();
   assert.ok(await page.locator('#dialogs .v2-dialog-static').evaluateAll(ns=>ns.every(n=>n.inert)));
   const trigger=page.locator('[data-dialog-open="v2-dialog-confirm"]');await trigger.click();
   const modal=page.locator('#v2-dialog-confirm');await modal.waitFor({state:'visible'});
   assert.equal(await modal.evaluate(n=>n.matches(':modal')),true);
   assert.equal(await modal.getByRole('button',{name:'계속 작성',exact:true}).evaluate(n=>document.activeElement===n),true,'cancel gets initial focus');
   await modal.getByRole('button',{name:'나가기',exact:true}).focus();await page.keyboard.press('Tab');
   assert.equal(await modal.getByRole('button',{name:'계속 작성',exact:true}).evaluate(n=>document.activeElement===n),true,'Tab is contained');
   await page.keyboard.press('Escape');await modal.waitFor({state:'hidden'});
   assert.equal(await trigger.evaluate(n=>document.activeElement===n),true,'focus returns to opener');
   await trigger.click();await modal.getByRole('button',{name:'계속 작성',exact:true}).click();
   assert.equal(await modal.evaluate(n=>n.open),false);
   await trigger.click();await modal.getByRole('button',{name:'나가기',exact:true}).click();
   assert.equal(await modal.evaluate(n=>n.open),false);
   assert.match(await page.locator('#dialog-feedback').innerText(),/나가기/);
   for(const id of ['notice','delete']){
    const opener=page.locator(`[data-dialog-open="v2-dialog-${id}"]`);await opener.click();
    const other=page.locator('#v2-dialog-'+id);await other.waitFor({state:'visible'});
    assert.equal(await other.evaluate(n=>n.scrollWidth<=n.clientWidth+1),true);
    await page.keyboard.press('Escape');await other.waitFor({state:'hidden'});
   }
   assert.ok(await page.locator('#dialogs .og-dialog-panel').evaluateAll(ns=>ns.every(n=>{if(!n.getClientRects().length)return true;const s=getComputedStyle(n);return s.borderRadius==='20px'&&n.scrollWidth<=n.clientWidth+1;})),'stable 20px geometry '+width);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no horizontal overflow '+width);
   assert.ok(await page.locator('#dialogs .v2-dialog-static .v2-button').evaluateAll(ns=>ns.every(n=>{const r=n.getBoundingClientRect(),s=getComputedStyle(n);return r.height>=44&&r.width>=44&&s.whiteSpace==='nowrap'&&n.scrollWidth<=n.clientWidth+1;})),'touch targets and unwrapped labels '+width);
   assert.ok(await page.locator('#dialogs .v2-dialog-static :is(h3,p,button)').evaluateAll(ns=>{
    const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');canvas.width=canvas.height=1;
    const luminance=color=>{ctx.fillStyle=color;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data].slice(0,3).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);};
    return ns.every(n=>{let parent=n;while(parent.parentElement&&getComputedStyle(parent).backgroundImage==='none'&&getComputedStyle(parent).backgroundColor==='rgba(0, 0, 0, 0)')parent=parent.parentElement;const s=getComputedStyle(parent),colors=s.backgroundImage==='none'?[s.backgroundColor]:s.backgroundImage.match(/oklch\([^)]*\)|rgba?\([^)]*\)/g),foreground=luminance(getComputedStyle(n).color);return colors&&colors.every(bg=>(Math.max(foreground,luminance(bg))+.05)/(Math.min(foreground,luminance(bg))+.05)>=4.5);});
   }),'title, body and button contrast '+width);
   if([390,1440].includes(width)){await page.locator('#dialogs-title').click();await page.locator('#dialogs').screenshot({path:`/private/tmp/og-v2-dialogs-${width}.png`});}
  }
  await page.locator('[data-dialog-open="v2-dialog-confirm"]').click();
  const modal=page.locator('#v2-dialog-confirm'),box=await modal.boundingBox();
  await page.mouse.click(Math.max(1,box.x-10),Math.max(1,box.y-10));await modal.waitFor({state:'hidden'});
  assert.ok(await page.evaluate(async()=>{
   const trigger=document.querySelector('[data-dialog-open="v2-dialog-confirm"]'),modal=document.querySelector('#v2-dialog-confirm');
   trigger.click();modal.querySelector('[data-dialog-result="cancel"]').click();trigger.click();
   await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
   return modal.open&&document.body.style.overflow==='hidden'&&modal.contains(document.activeElement);
  }),'queued close events must not clean up a freshly reopened dialog');
  await page.keyboard.press('Escape');await modal.waitFor({state:'hidden'});
  assert.equal(await page.evaluate(()=>document.body.style.overflow),'','body scroll is restored');
  await page.evaluate(async()=>{
   const {renderDialog,setupDialogSamples}=await import('/v2/components/dialog.mjs');
   const root=document.createElement('div');root.id='long-probe';root.innerHTML='<button data-dialog-open="long-dialog">긴 안내 열기</button>'+renderDialog({id:'long-dialog',modal:true,title:'긴 안내 문구',body:'내용 확인 '.repeat(1000),actions:[{label:'확인',result:'confirm'}]});document.querySelector('main').append(root);
   setupDialogSamples(root);root.querySelector('[data-dialog-open]').click();
  });
  assert.ok(await page.locator('#long-dialog').evaluate(n=>{const r=n.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight&&n.scrollWidth<=n.clientWidth+1&&n.scrollHeight>n.clientHeight;}),'long copy scrolls inside viewport');
  assert.ok(await page.locator('#long-dialog').evaluate(n=>{const title=n.querySelector('.og-dialog-title').getBoundingClientRect(),frame=n.getBoundingClientRect();return title.top>=frame.top&&title.bottom<=frame.bottom&&n.scrollTop===0;}),'long dialog starts at the title, not its bottom action');
  await page.locator('#long-dialog button').click();await page.locator('#long-dialog').waitFor({state:'hidden'});
  assert.deepEqual(errors,[]);
  console.log('Dialog: three variants, native open/close, safe focus, keyboard/backdrop, long copy and seven widths passed');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
