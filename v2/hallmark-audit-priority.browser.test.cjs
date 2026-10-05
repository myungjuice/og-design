const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';

// Real rendered regressions: shared surface padding, icon state overrides,
// and dark-workspace focus colors leaking into light app specimens.
const contrast=(locator,property,backgroundSelector)=>locator.evaluate((node,{property,backgroundSelector})=>{
 const canvas=document.createElement('canvas');canvas.width=canvas.height=1;
 const ctx=canvas.getContext('2d');
 const luminance=color=>{
  ctx.clearRect(0,0,1,1);ctx.fillStyle=color;ctx.fillRect(0,0,1,1);
  return [...ctx.getImageData(0,0,1,1).data].slice(0,3).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
 };
 const fg=luminance(getComputedStyle(node)[property]);
 let surface=node.closest(backgroundSelector);
 while(surface&&getComputedStyle(surface).backgroundColor==='rgba(0, 0, 0, 0)')surface=surface.parentElement;
 const bg=luminance(getComputedStyle(surface).backgroundColor);
 return (Math.max(fg,bg)+.05)/(Math.min(fg,bg)+.05);
},{property,backgroundSelector});

(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 const failures=[];let count=0;
 const check=async(name,run)=>{try{await run();count++;console.log('PASS '+name);}catch(error){failures.push(name+': '+error.message);console.error('FAIL '+name+': '+error.message);}};
 const focus=async(page,control)=>{await page.keyboard.press('Tab');await control.focus();assert.ok(await control.evaluate(n=>n.matches(':focus-visible')));};
 try{
  for(const width of [320,375,390,414,768]){
   const page=await browser.newPage({viewport:{width,height:1100}});
   try{
    await page.goto(base+'/v2/my-info/#faq');
    const host=page.locator('#faq [data-source-state="basic"] .v2-source-host');
    await host.locator('.og-faq-best-card button').first().waitFor();
    await page.waitForFunction(()=>['true','error'].includes(document.querySelector('#faq [data-source-state="basic"] .v2-source-host')?.dataset.sourceReady),null,{timeout:10000});
    assert.equal(await host.getAttribute('data-source-ready'),'true','FAQ source styles failed to load');
    await check('FAQ title retains usable card width @'+width,async()=>{
     const cards=await host.locator('.og-faq-best-card').evaluateAll(nodes=>nodes.map(card=>{
      const button=card.querySelector('button'),s=getComputedStyle(button),r=card.getBoundingClientRect();
      return {usable:button.clientWidth-parseFloat(s.paddingLeft)-parseFloat(s.paddingRight),width:r.width,height:r.height,shadow:getComputedStyle(card).boxShadow};
     }));
     for(const card of cards){assert.ok(card.usable>=card.width-28,'duplicated outer padding shrinks FAQ title width');assert.ok(card.height>=156);assert.notEqual(card.shadow,'none');}
    });
    if([320,390].includes(width))await host.screenshot({path:'/private/tmp/og-priority-faq-'+width+'.png'});

    await page.goto(base+'/v2/components/#date-picker');
    const cancel=page.locator('#v2-date-live [data-picker-cancel]');await cancel.waitFor();
    await check('calendar footer focus is visible on light surface @'+width,async()=>{
     await focus(page,cancel);assert.ok(await contrast(cancel,'outlineColor','.v2-picker-stage')>=3,'focus ring contrast below 3:1');
    });
    if([320,390].includes(width))await page.locator('#v2-date-live').screenshot({path:'/private/tmp/og-priority-focus-'+width+'.png'});

    await page.goto(base+'/v2/components/#dialogs');
    const workspace=page.locator('[data-dialog-open="v2-dialog-notice"]');await workspace.waitFor();
    await check('dark workspace retains visible focus @'+width,async()=>{
     await focus(page,workspace);assert.ok(await contrast(workspace,'outlineColor','.v2-component-section')>=3,'dark workspace focus ring contrast below 3:1');
    });
    await page.goto(base+'/v2/components/#bottom-sheet');
    const trigger=page.locator('[data-sheet-open="v2-sheet-sort"]');await trigger.waitFor();
    await trigger.click();const footer=page.locator('#v2-sheet-sort [data-sheet-close]').last();
    await check('sheet footer focus is visible on light surface @'+width,async()=>{
     await focus(page,footer);assert.ok(await contrast(footer,'outlineColor','.v2-sheet-panel')>=3,'focus ring contrast below 3:1');
    });
    await page.keyboard.press('Escape');

    await page.goto(base+'/v2/components/#image-viewer');const open=page.locator('[data-viewer-open]');await open.waitFor();
    await check('attachment-stage focus is visible on light surface @'+width,async()=>{
     await focus(page,open);assert.ok(await contrast(open,'outlineColor','.v2-attachment-stage')>=3,'focus ring contrast below 3:1');
    });
    await open.click();const close=page.locator('[data-viewer-close]');await close.waitFor();
    await check('viewer close remains readable on hover @'+width,async()=>{
     await close.hover();assert.ok(await contrast(close,'color','.v2-viewer-dialog')>=3,'hover icon contrast below 3:1');
    });
    if([320,390].includes(width))await page.locator('.og-viewer-header').screenshot({path:'/private/tmp/og-priority-viewer-'+width+'.png'});
    await check('viewer close remains readable while pressed @'+width,async()=>{
     await page.mouse.down();try{assert.ok(await close.evaluate(n=>n.matches(':active')));assert.ok(await contrast(close,'color','.v2-viewer-dialog')>=3,'pressed icon contrast below 3:1');}finally{await page.mouse.up();}
    });
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   }finally{await page.close();}
  }
  console.log('Priority audit regressions: '+count+' passed; '+failures.length+' failed.');
  assert.deepEqual(failures,[]);
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
