const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:1000}}),failures=[];
  for(const width of [320,375,390,414,768,1440]){
   await page.setViewportSize({width,height:1000});await page.goto(base+'/v2/components/#help');await page.evaluate(()=>document.fonts.ready);
   const panel=page.locator('.v2-help-stage .og-popover');
   const spacing=await panel.evaluate(n=>{
    const p=n.getBoundingClientRect(),title=n.querySelector('h3').getBoundingClientRect(),button=n.querySelector('button').getBoundingClientRect(),icon=n.querySelector('svg').getBoundingClientRect(),body=n.querySelector('p').getBoundingClientRect();
    return {top:title.top-p.top,right:p.right-icon.right,center:Math.abs((title.top+title.bottom-icon.top-icon.bottom)/2),bodyGap:body.top-title.bottom,hitWidth:button.width,hitHeight:button.height,contained:button.top>=p.top+4&&button.right<=p.right-4,overlap:button.bottom>body.top};
   });
   if(!(spacing.top>=16&&spacing.top<=18&&spacing.right>=16&&spacing.right<=20&&spacing.center<1&&spacing.bodyGap>=11&&spacing.bodyGap<=13&&spacing.hitWidth>=48&&spacing.hitHeight>=48&&spacing.contained&&!spacing.overlap))failures.push('Compact heading and contained 48px close target '+width+': '+JSON.stringify(spacing));
   const trigger=page.locator('[data-help-trigger="tooltip"]');await trigger.click();
   const gap=await trigger.evaluate(n=>{const icon=n.querySelector('svg').getBoundingClientRect(),tip=document.getElementById('v2-total-help').getBoundingClientRect();return {vertical:tip.top-icon.bottom,horizontal:tip.left-icon.left,fits:icon.left+tip.width<=innerWidth-12,rightMargin:innerWidth-tip.right};});
   if(Math.abs(gap.vertical-8)>.5||(gap.fits?Math.abs(gap.horizontal)>.5:Math.abs(gap.rightMargin-12)>.5))failures.push('Tooltip anchored 8px from visible icon '+width+': '+JSON.stringify(gap));
   await page.keyboard.press('Escape');
   if(width===390){await panel.screenshot({path:'/private/tmp/og-v2-help-compact-header.png'});await trigger.click();await page.locator('.v2-help-live-stage').screenshot({path:'/private/tmp/og-v2-help-icon-anchor.png'});await page.keyboard.press('Escape');}
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no horizontal scroll');
  }
  assert.deepEqual(failures,[]);
  // Optional visual anchors must not change callers that omit the option.
  const originalGap=await page.evaluate(()=>{
   const trigger=document.createElement('button'),panel=document.createElement('div');
   trigger.style.cssText='position:fixed;top:100px;left:100px;width:48px;height:48px';
   panel.setAttribute('popover','auto');panel.style.cssText='position:fixed;inset:auto;margin:0;width:100px;height:40px';
   document.body.append(trigger,panel);window.ogAttachHelp(trigger,panel).show();
   const gap=panel.getBoundingClientRect().top-trigger.getBoundingClientRect().bottom;panel.hidePopover();trigger.remove();panel.remove();return gap;
  });
  assert.equal(originalGap,8,'original callers retain button-based 8px placement');
  // Long titles reserve space for the close target rather than overlap it.
  await page.goto(base+'/v2/components/#help');await page.setViewportSize({width:320,height:1000});
  await page.locator('.v2-help-stage .og-popover h3').evaluate(n=>n.textContent='사용 가능한 OG 마일리지와 총 보유 마일리지 안내');
  assert.ok(await page.locator('.v2-help-stage .og-popover').evaluate(n=>{const t=n.querySelector('h3').getBoundingClientRect(),b=n.querySelector('button').getBoundingClientRect(),p=n.querySelector('p').getBoundingClientRect();return t.right<=b.left&&p.top>=b.bottom&&n.scrollWidth<=n.clientWidth;}),'long title and copy stay clear of close target');
  console.log('Help spacing: six widths, compact title/close alignment, retained 48px targets, icon-based 8px tooltip, long title and unchanged legacy anchoring passed');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
