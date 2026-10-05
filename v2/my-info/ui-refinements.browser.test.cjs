const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 const failures=[],errors=[];
 const check=(ok,label,width)=>{if(!ok)failures.push(width+'px: '+label);};
 try{
  const page=await browser.newPage();page.on('pageerror',e=>errors.push(e.message));
  const widths=process.env.UI_WIDTHS?process.env.UI_WIDTHS.split(',').map(Number):[320,375,390,414,768,1440];
  for(const width of widths){
   await page.setViewportSize({width,height:1100});await page.goto(base+'/v2/my-info/#profile-character');
   const view=async id=>{
    await page.evaluate(id=>location.hash=id,id);const section=page.locator('#'+id);await section.waitFor();
    for(const extra of await section.locator('.v2-source-extra,.v2-review-history-extra,.v2-notices-extra').all())await extra.evaluate(n=>n.open=true);
    await page.waitForFunction(id=>[...document.querySelectorAll('#'+id+' .v2-source-host')].every(n=>n.dataset.sourceReady==='true'),id);
    await page.waitForFunction(id=>[...document.querySelectorAll('#'+id+' *')].filter(n=>n.shadowRoot).every(n=>[...n.shadowRoot.querySelectorAll('link[rel="stylesheet"]')].every(l=>l.sheet)),id);
    await page.evaluate(()=>document.fonts.ready);return section;
   };
   let section=await view('profile-character');
   const edit=section.locator('.profile-edit').first();
   check(await edit.evaluate(n=>parseFloat(getComputedStyle(n).gap)>=8),'1: profile chevron gap',width);
   await section.locator('[data-character-choice="penguin"]').click();
   check(await edit.evaluate(n=>n.textContent.includes('변경하기')&&parseFloat(getComputedStyle(n).gap)>=8),'1: selected profile retains gap',width);
   section=await view('reservation-change');
   check(await section.locator('.v2-change-backdrop').first().evaluate(n=>getComputedStyle(n).isolation==='isolate'),'2: reservation background contains positive step z-index',width);
   section=await view('review-history');
   const management=section.locator('.v2-review-floating-menu');
   check(await management.evaluate(n=>{const r=n.getBoundingClientRect(),buttons=[...n.querySelectorAll('button')];return r.width<=144&&r.height<=110&&buttons.every(b=>getComputedStyle(b).boxShadow==='none'&&b.getBoundingClientRect().height>=44)}),'3: compact review management surface and rows',width);
   if(width===390)await section.locator('.v2-review-history-stage').last().screenshot({path:'/private/tmp/og-ui-review-menu-390.png'});
   section=await view('photo-review');
   const photo=key=>section.locator('[data-source-state="'+key+'"] .v2-source-host');
   check(await photo('basic').locator('.og-photo-action').first().evaluate(n=>{const r=n.getBoundingClientRect();return r.width<140&&r.height>=44&&r.height<=48}),'4: compact review creation',width);
   check(await photo('empty').locator('.og-feedback-icon').evaluate(n=>getComputedStyle(n).backgroundColor==='rgba(0, 0, 0, 0)'&&n.querySelector('svg').getBoundingClientRect().width>=28),'5: bare empty-state icon',width);
   check(await photo('menu').locator('.og-photo-menu').evaluate(n=>{const r=n.getBoundingClientRect();return r.width<=144&&r.height<=110}),'6: compact photo review popover',width);
   if(width===390)await photo('menu').locator('.v2-source-frame').screenshot({path:'/private/tmp/og-ui-photo-review-390.png'});
   section=await view('review-write');
   const writing=key=>section.locator('[data-source-state="'+key+'"] .v2-source-host');
   check(await writing('empty').locator('.og-write-inline[data-variant="secondary"]').evaluate(n=>{const r=n.getBoundingClientRect();return r.width<120&&r.height>=44&&r.height<=48}),'7: compact add photo',width);
   check(await writing('composed').locator('.og-write-footer').evaluate(n=>{const r=n.getBoundingClientRect(),buttons=n.querySelectorAll('button'),s=getComputedStyle(n);return Math.abs(r.right-buttons[1].getBoundingClientRect().right-parseFloat(s.paddingRight))<1&&Math.abs(buttons[0].getBoundingClientRect().left-r.left-parseFloat(s.paddingLeft))<1}),'8: cancel/save aligned to opposite footer edges',width);
   check(await writing('selected').locator('.og-write-delete').evaluate(n=>{const r=n.getBoundingClientRect(),svg=n.querySelector('svg');return r.width>=44&&r.height>=44&&svg.getBoundingClientRect().width<=24&&svg.dataset.sourceIcon==='close'&&getComputedStyle(svg).backgroundColor==='rgba(0, 0, 0, 0)'}),'9: small close glyph with full touch target',width);
   if(width===390)await writing('selected').locator('.v2-source-frame').screenshot({path:'/private/tmp/og-ui-review-write-390.png'});
   for(const key of ['empty','composed','expanded','selected','unchanged','source','help'])check(await writing(key).locator('.v2-source-frame').evaluate(n=>{const body=n.querySelector('.og-write-body');return n.scrollWidth<=n.clientWidth&&body.scrollWidth<=body.clientWidth}),'review writing fits '+key,width);
   section=await view('notices');
   const done=section.locator('[data-notice-state="editing"] [aria-label="알림 관리 끝내기"]');
   check(await done.evaluate(n=>n.textContent==='완료'&&!n.querySelector('svg')),'10: explicit Done action',width);
   section=await view('opinion');
   const select=section.locator('[data-source-state="empty"] select');
   check(await select.evaluate(n=>{const p=n.parentElement,after=getComputedStyle(p,'::after'),cs=getComputedStyle(n);return p.classList.contains('v2-select-control')&&cs.appearance==='none'&&parseFloat(after.right)===16&&parseFloat(cs.paddingRight)>=40&&n.value===''}),'11: controlled shared select arrow inset',width);
   if(width===390)await section.locator('[data-source-state="empty"] .v2-source-frame').screenshot({path:'/private/tmp/og-ui-select-390.png'});
   section=await view('account');
   for(const key of ['withdrawal','confirmed'])check(await section.locator('[data-source-state="'+key+'"] .og-account-withdrawal input').evaluate(n=>getComputedStyle(n).textAlign==='left'),'12: withdrawal text left-aligned '+key,width);
   if(width===390)await section.locator('[data-source-state="confirmed"] .v2-source-frame').screenshot({path:'/private/tmp/og-ui-withdrawal-390.png'});
   check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'workspace has no horizontal overflow',width);
  }
  assert.deepEqual(errors,[]);assert.deepEqual(failures,[]);
  console.log('12 UI refinements: '+widths.length+' widths; chevrons, Dim containment, compact actions/menus, empty icon, save alignment, attachment X, Done label, native select semantics and withdrawal alignment passed');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
