const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage();
  for(const width of [320,375,390,414,768,1100]){
   await page.setViewportSize({width,height:1200});
   await page.goto('http://127.0.0.1:4173/screens/my-info-3d-test/');
   await page.evaluate(()=>document.fonts.ready);
   const geometry=await page.evaluate(()=>{
    const relative=(node,screen)=>{const r=node.getBoundingClientRect(),s=screen.getBoundingClientRect();return {x:r.x-s.x,y:r.y-s.y,width:r.width,height:r.height,bottom:s.bottom-r.bottom};};
    return [...document.querySelectorAll('.my-info-test,.home-test')].map(screen=>({
     screen:relative(screen,screen),nav:relative(screen.querySelector('.bottom-navigation'),screen),
     status:screen.querySelector('.mobile-status-bar')?relative(screen.querySelector('.mobile-status-bar'),screen):null,
     indicator:screen.querySelector('.mobile-home-indicator')?relative(screen.querySelector('.mobile-home-indicator'),screen):null,
     card:screen.querySelector('.mileage-card')?relative(screen.querySelector('.mileage-card'),screen):null,
     recent:screen.querySelector('.recent-card')?relative(screen.querySelector('.recent-card'),screen):null,
     tiles:[...screen.querySelectorAll('.service-tile')].map(node=>relative(node,screen)),
     categories:[...screen.querySelectorAll('.home-category')].map(node=>relative(node,screen)),
     search:screen.querySelector('.home-search-form')?relative(screen.querySelector('.home-search-form'),screen):null,
     scrollHeight:screen.scrollHeight
    }));
   });
   assert.deepEqual(geometry.map(g=>g.screen.height),[996,846],'both previews use their Figma frame heights');
   assert.ok(geometry.every(g=>g.status&&g.status.y===0&&g.status.height===32),'shared static status bars');
   assert.ok(geometry.every(g=>g.indicator&&g.indicator.bottom===10),'home indicator sits below the floating navigation');
   assert.ok(geometry.every(g=>g.nav.bottom===20&&g.nav.height===72),'navigation floats 20px above the lower edge');
   assert.ok(geometry.every(g=>g.scrollHeight<=g.screen.height),'no clipped or internally scrolling content');
   assert.ok(geometry[0].tiles.every(t=>t.y+t.height<geometry[0].nav.y-14),'all six menus clear the raised barcode button');
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no root overflow at '+width);
   if(width>=390){
    const [info,home]=geometry;
    assert.equal(info.screen.width,390);assert.equal(home.screen.width,390);
    assert.deepEqual([info.card.x,info.card.y,info.card.width,info.card.height],[20,156,350,228]);
    assert.deepEqual([info.recent.x,info.recent.y,info.recent.width,info.recent.height],[20,396,350,219]);
    assert.ok(info.tiles.slice(0,3).every(t=>t.y===643&&t.height===105));
    assert.ok(info.tiles.slice(3).every(t=>t.y===764&&t.height===105));
    assert.equal(home.search.y,58);
    assert.deepEqual(home.categories.map(c=>[c.width,c.height]),[[76,38],[72,38],[72,38],[72,38],[64,38]]);
    assert.ok(home.categories.every(c=>c.y===116),'category row matches the reference vertical placement');
   }
   // A slim visual chip keeps a separate 44px touch area, including above its face.
   await page.locator('.home-test').scrollIntoViewIfNeeded();
   const category=page.locator('[data-category="한식"]');
   const hit=await category.evaluate(node=>{const r=node.getBoundingClientRect();return {x:r.x+r.width/2,y:r.top-2};});
   await page.mouse.click(hit.x,hit.y);
   assert.equal(await category.getAttribute('aria-pressed'),'true','slim category remains tappable outside its painted face');
   await page.locator('[data-category="전체"]').click();
   await page.locator('img').evaluateAll(images=>Promise.all(images.map(image=>image.decode())));
   if(width===1100){
    await page.locator('.my-info-test').screenshot({path:'/private/tmp/og-info-reference-996.png',animations:'disabled'});
    await page.locator('.home-test').screenshot({path:'/private/tmp/og-home-reference-846.png',animations:'disabled'});
    await page.screenshot({path:'/private/tmp/og-reference-pair.png',fullPage:true,animations:'disabled'});
   }
  }
  console.log('PASS: reference frame sizes, original card/menu geometry, floating navigation, shared status bars and slim touch-safe categories');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
