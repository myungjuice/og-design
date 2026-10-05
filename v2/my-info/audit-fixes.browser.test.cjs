const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';

(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage(),failures=[];
  const check=(name,run)=>{try{run();}catch(error){failures.push(name+': '+error.message);}};
  const info=locator=>locator.evaluate(n=>{const s=getComputedStyle(n),r=n.getBoundingClientRect();return {text:n.textContent.trim(),variant:n.dataset.variant,w:r.width,h:r.height,bg:s.backgroundColor,shadow:s.boxShadow,color:s.color,inert:n.inert,disabled:n.disabled};});
  for(const width of [320,375,390,414,768,1440]){
   await page.setViewportSize({width,height:1100});
   await page.goto(base+'/v2/my-info/#review-write');await page.reload();
   await page.waitForFunction(()=>[...document.querySelectorAll('.v2-source-host')].filter(n=>n.dataset.sourceReady==='true').length===12);
   const ready=async(id,state)=>{
    await page.evaluate(id=>location.hash=id,id);const section=page.locator('#'+id);await section.waitFor();
    if(state!==({'review-write':'empty','photo-review':'basic','opinion':'empty'}[id]))await section.locator('.v2-source-extra').evaluate(n=>n.open=true);
    const host=section.locator(`[data-source-state="${state}"] .v2-source-host`);
    await host.evaluate(n=>new Promise(resolve=>{const check=()=>n.dataset.sourceReady==='true'?resolve():requestAnimationFrame(check);check();}));return host;
   };
   for(const state of ['empty','expanded']){
    const host=await ready('review-write',state),expand=await info(host.locator('.og-write-inline').first()),add=await info(host.locator('.og-write-inline').last());
    check('quiet expansion '+state+' @'+width,()=>{assert.equal(expand.shadow,'none');assert.equal(expand.bg,'rgba(0, 0, 0, 0)');assert.ok(expand.w<164);assert.ok(expand.h>=48);});
    check('photo addition stays raised @'+width,()=>{assert.equal(add.variant,'secondary');assert.notEqual(add.shadow,'none');assert.ok(add.h>=48);});
   }
   const basic=await ready('photo-review','basic');
   const complete=await info(basic.locator('.og-photo-action').filter({hasText:'리뷰 완료'})),write=await info(basic.locator('.og-photo-action').filter({hasText:'포토 리뷰 작성'}));
   check('completed review is quiet @'+width,()=>{assert.equal(complete.shadow,'none');assert.equal(complete.bg,'rgba(0, 0, 0, 0)');assert.ok(complete.h>=48);});
   check('review writing stays raised @'+width,()=>{assert.equal(write.variant,'secondary');assert.notEqual(write.shadow,'none');});
   const deletion=await ready('photo-review','delete'),danger=await info(deletion.locator('.og-dialog-actions button').last());
   check('photo deletion uses explicit danger @'+width,()=>{assert.equal(danger.variant,'danger');assert.equal(danger.text,'삭제');assert.equal(danger.inert,true);});
   await page.evaluate(()=>location.hash='review-history');await page.locator('#review-history').waitFor();
   await page.locator('#review-history .v2-review-history-extra').evaluate(n=>n.open=true);
   const history=page.locator('[data-review-history-state="delete"] .v2-review-history-host');await history.locator('.v2-dialog-panel').waitFor();
   const historyDanger=await info(history.locator('.og-dialog-actions button').last());
   check('history deletion matches photo deletion @'+width,()=>{assert.equal(historyDanger.variant,'danger');assert.equal(historyDanger.text,'삭제');assert.equal(historyDanger.inert,true);});
   const empty=await ready('opinion','empty'),filled=await ready('opinion','filled');
   const placeholder=await empty.locator('select').evaluate(n=>{
    const token=document.createElement('span');token.style.color='var(--v2-input-placeholder)';n.parentElement.append(token);const result={actual:getComputedStyle(n).color,expected:getComputedStyle(token).color};token.remove();return result;
   });
   const colors=await filled.locator('select').evaluate(n=>{
    const token=document.createElement('span');token.style.color='var(--v2-input-ink)';n.parentElement.append(token);const result={actual:getComputedStyle(n).color,expected:getComputedStyle(token).color};token.remove();return result;
   });
   check('empty select uses placeholder token @'+width,()=>assert.equal(placeholder.actual,placeholder.expected));
   check('filled select keeps readable value @'+width,()=>assert.equal(colors.actual,colors.expected));
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   if([320,375,390,414,768].includes(width))for(const [id,state] of [['review-write','empty'],['photo-review','delete'],['opinion','empty']]){
    const host=await ready(id,state);await host.locator('.v2-source-frame').screenshot({path:`/private/tmp/og-v2-audit-fixed-${id}-${width}.png`});
   }
  }
  assert.deepEqual(failures,[]);console.log('audit fixes: quiet secondary actions, raised create actions, two danger dialogs and empty/filled select colors × six widths passed');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
