const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage(),errors=[],writes=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.url()+': '+r.status());});
  page.on('request',r=>{if(!['GET','HEAD'].includes(r.method()))writes.push(r.url());});
  for(const width of [320,375,390,414,768,1440,1920]){
   await page.setViewportSize({width,height:1100});await page.goto(base+'/v2/my-info/#profile-character');
   const section=page.locator('#profile-character'),main=section.locator('.v2-character-main-host'),selection=section.locator('.v2-character-selection-host');
   await selection.locator('[role="radiogroup"]').waitFor();await page.evaluate(()=>document.fonts.ready);
   assert.deepEqual(await page.locator('[data-review-screen]:visible').evaluateAll(ns=>ns.map(n=>n.id)),['profile-character']);
   assert.equal(await main.locator('.visit-list li').count(),3);
   assert.equal(await main.locator('.v2-character-avatar .v2-character-art').count(),0);
   assert.equal(await selection.locator('[role="radio"]').count(),3);assert.equal(await selection.locator('[aria-checked="true"]').count(),0);
   assert.equal(await selection.locator('button').count(),4,'back + three one-tap choices only');
   if([320,390].includes(width))await main.locator('.v2-character-main').screenshot({path:'/private/tmp/og-v2-character-unselected-'+width+'.png'});
   const geometry=await selection.locator('.v2-character-screen').evaluate(n=>({w:n.getBoundingClientRect().width,h:n.getBoundingClientRect().height,overflow:n.scrollWidth>n.clientWidth,bodyOverflow:n.querySelector('.v2-character-body').scrollWidth>n.querySelector('.v2-character-body').clientWidth,font:getComputedStyle(n).fontFamily,controls:[...n.querySelectorAll('button')].map(b=>({w:b.getBoundingClientRect().width,h:b.getBoundingClientRect().height})),labels:[...n.querySelectorAll('.v2-character-copy>*')].every(n=>n.scrollWidth<=n.clientWidth)}));
   assert.equal(geometry.w,Math.min(width,390));assert.equal(geometry.h,846);assert.equal(geometry.overflow,false);assert.equal(geometry.bodyOverflow,false);assert.equal(geometry.labels,true,'single-line character copy fits '+width);assert.match(geometry.font,/OG V2 Pretendard/);assert.ok(geometry.controls.every(n=>n.w>=44&&n.h>=44));
   const storage=await page.evaluate(()=>JSON.stringify({...localStorage}));
   for(const key of ['bear','penguin','raccoon']){
    await selection.locator('[data-character-choice="'+key+'"]').click();
    assert.equal(await selection.locator('[aria-checked="true"]').getAttribute('data-character-choice'),key);
    assert.equal(await selection.locator('.v2-character-status').innerText(),({bear:'곰을',penguin:'펭귄을',raccoon:'너구리를'})[key]+' 선택했어요.');
    const material=await selection.locator('[aria-checked="true"]').evaluate(card=>{const style=getComputedStyle(card),frame=card.getBoundingClientRect(),art=card.querySelector('.v2-character-art').getBoundingClientRect(),check=card.querySelector('.v2-character-check').getBoundingClientRect();return {fill:style.backgroundImage,shadow:style.boxShadow,left:art.left-frame.left,right:frame.right-check.right,artFill:getComputedStyle(card.querySelector('.v2-character-art')).backgroundImage};});
    assert.match(material.fill,/linear-gradient/,'selected card keeps a modeled face rather than only a flat outline');
    assert.notEqual(material.shadow,'none');assert.ok(Math.abs(material.left-material.right)<=1,'balanced art/check insets');
    assert.match(material.artFill,new RegExp('/'+key+'-cutout-v2\\.png'),'isolated character asset, not a screenshot crop');
    assert.equal(await main.locator('.v2-character-main').getAttribute('data-character-value'),key);
    assert.equal(await main.locator('.v2-character-avatar .v2-character-art').getAttribute('data-character-art'),key);
    assert.equal(await page.locator('.v2-screen-host').locator('.profile-avatar .avatar-overlay').count(),1,'original main remains unchanged');
    assert.equal(await page.locator('#membership [data-source-state="basic"] .v2-source-host').locator('[data-membership-character] .v2-character-art').getAttribute('data-character-art'),key);
   }
   assert.equal(await page.evaluate(()=>JSON.stringify({...localStorage})),storage,'preview is not persisted');
   const raccoon=selection.locator('[data-character-choice="raccoon"]');await raccoon.focus();await page.keyboard.press('ArrowDown');assert.equal(await selection.locator('[aria-checked="true"]').getAttribute('data-character-choice'),'bear');
   await page.keyboard.press('End');assert.equal(await selection.locator('[aria-checked="true"]').getAttribute('data-character-choice'),'raccoon');
   await page.keyboard.press('Home');assert.equal(await selection.locator('[aria-checked="true"]').getAttribute('data-character-choice'),'bear');
   assert.equal(await selection.locator('[role="radio"][tabindex="0"]').count(),1);
   await main.locator('[data-character-open]').first().click();assert.equal(await selection.locator('[aria-checked="true"]').evaluate(n=>n.getRootNode().activeElement===n),true);
   if([320,390].includes(width)){await selection.locator('.v2-character-screen').screenshot({path:'/private/tmp/og-v2-character-'+width+'.png'});await main.locator('.v2-character-main').screenshot({path:'/private/tmp/og-v2-character-main-'+width+'.png'});}
   await page.evaluate(()=>location.hash='membership');await page.locator('#membership').waitFor();
   const fresh=page.locator('#membership [data-source-state="basic"] .v2-source-host');
   assert.equal(await page.locator('[data-membership-comparison],.v2-membership-comparison-host').count(),0,'comparison removed after selection');
   await page.waitForFunction(()=>document.querySelector('#membership [data-source-state="basic"] .v2-source-host').dataset.sourceReady==='true');
   const frame=fresh.locator('.v2-membership-screen');
   assert.equal(await frame.evaluate(n=>n.getBoundingClientRect().width),Math.min(width,390));assert.equal(await frame.evaluate(n=>n.getBoundingClientRect().height),846);
   assert.ok(await frame.evaluate(n=>n.scrollWidth<=n.clientWidth&&n.querySelector('.v2-member-body').scrollWidth<=n.querySelector('.v2-member-body').clientWidth));
   const portrait=await frame.evaluate(n=>{const card=n.querySelector('.v2-member-certificate').getBoundingClientRect(),art=n.querySelector('.v2-member-portrait').getBoundingClientRect(),copy=n.querySelector('.v2-member-copy').getBoundingClientRect(),screen=n.getBoundingClientRect(),style=getComputedStyle(n.querySelector('.v2-member-portrait'));return {right:art.right,cardRight:card.right,screenRight:screen.right,left:art.left,copyRight:copy.right,bg:style.backgroundColor,border:style.borderTopWidth,overflow:style.overflow};});
   assert.ok(portrait.right>portrait.cardRight,'character extends past the certificate edge');
   assert.ok(portrait.right<=portrait.screenRight&&portrait.left>=portrait.copyRight+4,'portrait stays inside phone and clear of identity copy');
   assert.equal(portrait.border,'0px','no oval picture-frame border');assert.equal(portrait.bg,'rgba(0, 0, 0, 0)');assert.equal(portrait.overflow,'visible');
   const edge=await frame.locator('.v2-member-certificate').evaluate(n=>{const s=getComputedStyle(n);return {border:s.borderBottomWidth,shadow:s.boxShadow};});
   assert.equal(edge.border,'0px','certificate has no bright outline');
   assert.ok(!edge.shadow.includes(' 0px 5px 0px '),'no solid dark thickness strip below certificate');
   assert.ok(await frame.locator('.v2-member-copy dt,.v2-member-copy dd').evaluateAll(ns=>ns.every(n=>n.getBoundingClientRect().height<=parseFloat(getComputedStyle(n).lineHeight)+1)),'existing member details stay on one line at '+width);
   for(const key of ['bear','penguin','raccoon']){
    await page.evaluate(key=>document.querySelector('.v2-character-selection-host').shadowRoot.querySelector('[data-character-choice="'+key+'"]').click(),key);
    const silhouette=await frame.evaluate(async n=>{const art=n.querySelector('.v2-member-portrait .v2-character-art'),style=getComputedStyle(art),a=art.getBoundingClientRect(),card=n.querySelector('.v2-member-certificate').getBoundingClientRect(),copy=n.querySelector('.v2-member-copy').getBoundingClientRect(),image=new Image();image.src=style.backgroundImage.slice(5,-2);await image.decode();const canvas=document.createElement('canvas');canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;const ctx=canvas.getContext('2d');ctx.drawImage(image,0,0);const pixels=ctx.getImageData(0,0,canvas.width,canvas.height).data;let x0=canvas.width,x1=0,y0=canvas.height,y1=0;for(let y=0;y<canvas.height;y++)for(let x=0;x<canvas.width;x++)if(pixels[(y*canvas.width+x)*4+3]>100){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}const extra=Number(style.backgroundSize.match(/\+ (\d+)px/)[1]),w=a.width+extra,h=w*canvas.height/canvas.width,dx=(a.width-w)/2,dy=a.height-h;return {left:a.left+dx+x0*w/canvas.width,right:a.left+dx+x1*w/canvas.width,top:a.top+dy+y0*h/canvas.height,bottom:a.top+dy+y1*h/canvas.height,box:a.toJSON(),cardRight:card.right,copyRight:copy.right,screenRight:n.getBoundingClientRect().right};});
    assert.ok(silhouette.right>silhouette.cardRight,'visible character silhouette protrudes beyond the now full-width card '+key+' at '+width);
    const minHeight=width<=350?{bear:214,penguin:188,raccoon:205}:{bear:260,penguin:225,raccoon:258};
    assert.ok(silhouette.bottom-silhouette.top>=minHeight[key],'larger full-body mascot '+key+' at '+width);
    assert.ok(silhouette.left>=silhouette.copyRight+4&&silhouette.right<=silhouette.screenRight,'visible character clears copy and screen '+key);
    assert.ok(silhouette.left>=silhouette.box.left&&silhouette.right<=silhouette.box.right&&silhouette.top>=silhouette.box.top&&silhouette.bottom<=silhouette.box.bottom,'full hand/feet/tail visible '+key);
    if([320,390].includes(width))await frame.screenshot({path:'/private/tmp/og-v2-membership-'+key+'-'+width+'.png'});
   }
   await page.evaluate(()=>document.querySelector('.v2-character-selection-host').shadowRoot.querySelector('[data-character-choice="bear"]').click());
   assert.ok(await frame.locator('button,input').evaluateAll(ns=>ns.every(n=>n.inert)),'no real copy/share/save controls');
   assert.equal(await fresh.locator('.v2-member-copy-code').getAttribute('inert'),'');
   for(const text of ['OG1234','OG-00012345','맑은 땅콩','2026-05-28'])assert.ok((await frame.innerText()).includes(text));
   if([320,390].includes(width))await frame.screenshot({path:'/private/tmp/og-v2-membership-default-'+width+'.png'});
   await page.evaluate(()=>document.querySelector('.v2-character-selection-host').shadowRoot.querySelector('[data-character-choice="penguin"]').click());
   const extras=page.locator('#membership .v2-source-extra');await extras.evaluate(n=>n.open=true);
   await page.waitForFunction(()=>[...document.querySelectorAll('#membership .v2-source-host')].every(n=>n.dataset.sourceReady==='true'));
   for(const key of ['basic','no-code','share'])assert.equal(await page.locator('#membership [data-source-state="'+key+'"] .v2-source-host').locator('[data-membership-character] .v2-character-art').getAttribute('data-character-art'),'penguin','selection also applies to lazily mounted '+key);
   const registered=page.locator('#membership [data-source-state="registered"] .v2-source-host'),absent=page.locator('#membership [data-source-state="no-code"] .v2-source-host'),share=page.locator('#membership [data-source-state="share"] .v2-source-host');
   assert.equal(await registered.locator('input').inputValue(),'AB5678');assert.equal(await registered.locator('input').isDisabled(),true);assert.equal(await registered.locator('.v2-member-certificate').count(),0);
   assert.equal(await absent.locator('.v2-member-qr,.v2-member-actions,.v2-member-link').count(),0);assert.ok((await absent.locator('.v2-member-no-code').innerText()).includes('1번 이상 적립'));
   assert.equal(await share.locator('.og-membership-overlay').count(),1);assert.equal(await share.locator('.v2-member-sheet').getAttribute('aria-hidden'),'true');
   await page.evaluate(()=>document.querySelector('.v2-character-selection-host').shadowRoot.querySelector('[data-character-choice="raccoon"]').click());
   for(const key of ['basic','no-code','share'])assert.equal(await page.locator('#membership [data-source-state="'+key+'"] .v2-source-host').locator('[data-membership-character] .v2-character-art').getAttribute('data-character-art'),'raccoon');
   if([320,390].includes(width))for(const key of ['registered','no-code','share'])await page.locator('#membership [data-source-state="'+key+'"] .v2-source-host').locator('.v2-membership-screen').screenshot({path:'/private/tmp/og-v2-membership-'+key+'-'+width+'.png'});
   await page.evaluate(()=>location.hash='notices');await page.locator('#notices').waitFor();
   const notices=page.locator('[data-notice-state="notifications"] .v2-notices-history-host');
   assert.equal(await notices.locator('.og-notification-row').count(),4);assert.ok((await notices.locator('.og-notification-list').innerText()).includes('룰렛 당첨'));
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'workspace fits '+width);
   assert.equal(await page.locator('.mobile-status-bar,.mobile-home-indicator').count(),0);
   await page.reload();await page.evaluate(()=>location.hash='profile-character');await selection.locator('[role="radiogroup"]').waitFor();assert.equal(await selection.locator('[aria-checked="true"]').count(),0,'fresh page starts unselected');
  }
  await page.setViewportSize({width:1440,height:1100});await page.goto(base+'/v2/my-info/#overview');await page.locator('.v2-screen-host .profile-edit').click();await page.waitForURL('**/#profile-character');
  assert.equal(await page.locator('[data-view-link="profile-character"]').getAttribute('aria-current'),'location');
  assert.deepEqual(errors,[]);assert.deepEqual(writes,[]);
  for(const key of ['bear','penguin','raccoon']){
   const pixels=await page.evaluate(async key=>{const image=new Image();image.src='/v2/my-info/media/'+key+'-cutout-v2.png';await image.decode();const canvas=document.createElement('canvas');canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;const ctx=canvas.getContext('2d');ctx.drawImage(image,0,0);const data=ctx.getImageData(0,0,canvas.width,canvas.height).data;let transparent=0,visible=0;for(let i=3;i<data.length;i+=4){if(data[i]===0)transparent++;if(data[i]>200)visible++;}return {transparent,visible,total:canvas.width*canvas.height,corners:[data[3],data[(canvas.width-1)*4+3],data[(canvas.height-1)*canvas.width*4+3],data[data.length-1]]};},key);
   assert.ok(pixels.transparent>pixels.total*.1&&pixels.visible>pixels.total*.2,'actual alpha cutout '+key);assert.deepEqual(pixels.corners,[0,0,0,0]);
  }
  console.log('profile/membership: 7 widths; selected certificate in all four states, lazy character propagation, preserved registration/absent-code/share rules, reset, layout and notifications passed');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
