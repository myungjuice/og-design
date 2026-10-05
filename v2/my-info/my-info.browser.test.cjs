const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)errors.push(r.url()+':'+r.status());});
  for(const width of [320,375,390,414,768,1440]){
   await page.setViewportSize({width,height:1200});await page.goto(`${base}/v2/my-info/`);
   await page.locator('.my-info-test').waitFor();await page.evaluate(()=>document.fonts.ready);
   await page.locator('.my-info-test img').evaluateAll(images=>Promise.all(images.map(image=>image.decode())));
   assert.equal(await page.locator('.my-info-test').count(),1);
   assert.equal(await page.locator('.v2-nav-comparisons,.v2-nav-comparison-host,.v2-nav-sample').count(),0,'retired A/B/C previews are removed');
   assert.equal(await page.locator('.home-test,.barcode-test,iframe,.mobile-status-bar,.mobile-home-indicator').count(),0);
   assert.equal(await page.locator('.service-tile').count(),6);
   assert.equal(await page.locator('.mileage-card.v2-mileage').count(),1);
   assert.equal(await page.locator('.v2-menu nav [aria-current]').textContent(),'내정보');
   const appearance=await page.locator('.my-info-test').evaluate(screen=>{
    const rgba=value=>{const c=document.createElement('canvas');c.width=c.height=1;const ctx=c.getContext('2d');ctx.fillStyle=value;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data];};
    const current=screen.querySelector('.bottom-navigation [aria-current="page"]'),face=current.querySelector('.nav-face'),cs=getComputedStyle(current),ss=getComputedStyle(screen),f=face.getBoundingClientRect();
    const underline=getComputedStyle(current.lastElementChild,'::after');
    return {underline:[underline.content,underline.width,underline.height,underline.top,underline.left],gradient:ss.backgroundImage,bottom:rgba(ss.getPropertyValue('--test-page-bottom').trim()),label:current.textContent.trim(),weight:cs.fontWeight,text:rgba(cs.color),face:rgba(getComputedStyle(face).backgroundColor),faceSize:[f.width,f.height],iconSize:[face.querySelector('svg').width.baseVal.value,face.querySelector('svg').height.baseVal.value],currentCount:screen.querySelectorAll('.bottom-navigation [aria-current]').length,
     otherFaces:[...screen.querySelectorAll('.bottom-navigation .nav-item:not([aria-current]):not(.nav-barcode) .nav-face')].map(n=>rgba(getComputedStyle(n).backgroundColor)[3])};
   });
   assert.deepEqual([
    ...(!appearance.gradient.startsWith('linear-gradient(155.768')?['reference gradient missing']:[]),
    ...(appearance.face[3]===0?['current navigation has no shape cue']:[])
   ],[],'reference background and selected navigation are visible '+width);
   assert.ok(appearance.bottom.slice(0,3).every((v,i)=>Math.abs(v-[222,233,249][i])<=1),'approved pale-blue endpoint '+width);
   assert.equal(appearance.label,'내 정보');assert.equal(appearance.currentCount,1);assert.equal(appearance.weight,'700');
   assert.deepEqual(appearance.faceSize,[40,32]);assert.deepEqual(appearance.iconSize,[26,26]);
   assert.deepEqual(appearance.underline.slice(0,4),['""','20px','2px','18px'],'approved C underline is visible below the current caption '+width);
   assert.ok(appearance.otherFaces.every(alpha=>alpha===0),'unselected icons do not gain selected backgrounds');
   assert.ok(await page.locator('.bottom-navigation .nav-item:not([aria-current])>span:last-child').evaluateAll(nodes=>nodes.every(n=>getComputedStyle(n,'::after').content==='none')),'only the current menu has an underline');
   assert.ok(await page.locator('.bottom-navigation button').evaluateAll(nodes=>nodes.every(n=>{const r=n.getBoundingClientRect();return r.width>=44&&r.height>=44;})),'navigation keeps 44px touch targets');
   assert.deepEqual(await page.locator('.barcode-art').evaluate(n=>{const r=n.getBoundingClientRect();return[r.width,r.height,n.querySelector('img').getAttribute('src')];}),[60,60,'/screens/my-info-3d-test/media/figma/bottom-navigation-source.png'],'central barcode artwork is unchanged');
   const luminance=rgb=>rgb.slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
   assert.ok((1.05)/(luminance(appearance.text)+.05)>=4.5,'selected caption contrast on the white navigation '+width);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no document overflow '+width);
   const geometry=await page.locator('.my-info-test').evaluate(screen=>{
    const s=screen.getBoundingClientRect();
    const box=sel=>{const r=screen.querySelector(sel).getBoundingClientRect();return {x:r.x-s.x,y:r.y-s.y,width:r.width,height:r.height,bottom:s.bottom-r.bottom};};
    return {width:s.width,height:s.height,card:box('.mileage-card'),recent:box('.recent-card'),nav:box('.bottom-navigation'),last:box('.service-tile:last-child'),overflow:screen.scrollWidth>screen.clientWidth,
     font:getComputedStyle(screen).fontFamily,background:getComputedStyle(screen).backgroundColor};
   });
   assert.equal(geometry.height,996,'reference frame height '+width);
   assert.equal(geometry.overflow,false,'screen content fits '+width);
   assert.equal(geometry.nav.bottom,20);
   assert.ok(geometry.last.y+geometry.last.height<geometry.nav.y-14,'tiles clear raised barcode');
   assert.match(geometry.font,/OG V2 Pretendard/);
   if(width>=390){
    assert.equal(geometry.width,390);
    assert.deepEqual([geometry.card.x,geometry.card.y,geometry.card.width,geometry.card.height],[20,156,350,228]);
    assert.deepEqual([geometry.recent.x,geometry.recent.y,geometry.recent.width,geometry.recent.height],[20,396,350,219]);
   }
   assert.ok(await page.evaluate(()=>{
    const c=document.createElement('canvas');c.width=c.height=1;const ctx=c.getContext('2d');ctx.fillStyle=getComputedStyle(document.documentElement).backgroundColor;ctx.fillRect(0,0,1,1);const [r,g,b]=ctx.getImageData(0,0,1,1).data;return r>=35&&r<=65&&Math.abs(r-g)<=1&&Math.abs(g-b)<=1;
   }),'reference resets cannot recolor the workbench');
   for(const action of ['마일리지 안내','최근 방문 전체보기','스시산원 반주헌 후기 작성']){
    const target=page.getByRole('button',{name:action,exact:true}).first();await target.click();
    assert.equal(await page.getByRole('dialog').isVisible(),true);
    await page.keyboard.press('Escape');assert.equal(await page.getByRole('dialog').isVisible(),false);
    assert.equal(await target.evaluate(n=>n.getRootNode().activeElement===n),true,'dialog restores focus');
   }
   await page.locator('.my-info-test').getByRole('button',{name:'바코드',exact:true}).click();
   assert.match(await page.locator('#preview-copy').innerText(),/실제 회원 정보 조회나 서비스 이용은 진행되지 않습니다/);
   await page.getByRole('button',{name:'닫기',exact:true}).click();
   if([390,1440].includes(width))await page.locator('.my-info-test').screenshot({path:`/private/tmp/og-v2-my-info-${width}.png`});
  }
  // Future v2 consumers reuse the approved cue for every current menu, not only My Info.
  for(const active of ['홈','마이랜드','오지파크','내 정보','바코드']){
   await page.evaluate(async active=>{
    const {renderBottomNavigation}=await import('/screens/my-info-3d-test/navigation.mjs');
    const screen=document.querySelector('.v2-screen-host').shadowRoot;
    screen.querySelector('.bottom-navigation').outerHTML=renderBottomNavigation({active,assetBase:'/screens/my-info-3d-test/media/figma/'});
   },active);
   assert.equal(await page.locator('.bottom-navigation [aria-current]').count(),1);
   const cue=await page.locator('.bottom-navigation [aria-current]').evaluate(n=>{
    const line=getComputedStyle(n.lastElementChild,'::after'),face=getComputedStyle(n.querySelector('.nav-face'));
    return {line:[line.content,line.width,line.height],background:face.backgroundColor};
   });
   if(active==='바코드')assert.equal(cue.line[0],'none','raised barcode action does not gain a caption underline');
   else{assert.deepEqual(cue.line,['""','20px','2px']);assert.notEqual(cue.background,'rgba(0, 0, 0, 0)');}
  }
  await page.reload();await page.locator('.my-info-test').waitFor();
  // The same v2 token change reaches both workbench samples and the screen.
  await page.evaluate(()=>document.documentElement.style.setProperty('--v2-action','oklch(48% .16 280)'));
  assert.match(await page.locator('.mileage-card').evaluate(n=>getComputedStyle(n).backgroundColor),/0.48/);
  await page.setViewportSize({width:320,height:1200});
  await page.evaluate(async()=>{
   const {renderMileage}=await import('/v2/components/mileage.mjs');
   const screen=document.querySelector('.v2-screen-host').shadowRoot;
   screen.querySelector('.mileage-card').outerHTML=renderMileage({available:Number.MAX_SAFE_INTEGER,total:Number.MAX_SAFE_INTEGER,shared:Number.MAX_SAFE_INTEGER,sharedCount:Number.MAX_SAFE_INTEGER});
  });
  assert.ok(await page.locator('.my-info-test').evaluate(n=>n.scrollWidth<=n.clientWidth),'very long balances fit when reference CSS is also present');
  assert.ok(await page.locator('.my-info-test').evaluate(n=>{
   const tile=n.querySelector('.service-tile:last-child').getBoundingClientRect(),nav=n.querySelector('.bottom-navigation').getBoundingClientRect();return tile.bottom<nav.top-14;
  }),'large content grows the frame without covering the raised navigation');
  assert.deepEqual(errors,[]);
  console.log('v2 my-info: approved C shared navigation, comparisons removed, 5 current-menu cues, original artwork/touch targets, 390x996 geometry, 6 widths, dialogs/focus and token propagation passed');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
