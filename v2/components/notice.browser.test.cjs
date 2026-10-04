const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const width of [320,375,390,414,768,1024,1440]){
   await page.setViewportSize({width,height:1000});await page.goto(base+'/v2/components/#notices');await page.reload();
   await page.locator('#notices').waitFor();await page.evaluate(()=>document.fonts.ready);
   assert.deepEqual(await page.locator('.v2-component-section:visible').evaluateAll(ns=>ns.map(n=>n.id)),['dialogs','notices','empty-feedback'],'related feedback remains grouped');
   const notices=page.locator('#notices .v2-notice');
   assert.deepEqual(await notices.evaluateAll(ns=>ns.map(n=>n.dataset.tone)),['info','warning','error','success']);
   assert.equal(await notices.locator(':is(button,[tabindex],[role="alert"],[role="status"])').count(),0,'static examples have no controls');
   assert.equal(await notices.evaluateAll(ns=>ns.some(n=>n.hasAttribute('role')||n.hasAttribute('tabindex'))),false,'static examples do not announce themselves or take focus');
   assert.ok(await notices.evaluateAll(ns=>{
    const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');canvas.width=canvas.height=1;
    return ns.every(n=>{ctx.fillStyle=getComputedStyle(n).backgroundColor;ctx.fillRect(0,0,1,1);const [r,g,b]=ctx.getImageData(0,0,1,1).data;
     return n.dataset.tone==='info'?b>r&&b>g:n.dataset.tone==='warning'?r>g&&g>b:n.dataset.tone==='error'?r>g&&r>b:g>r&&g>b;
    });
   }),'white mixing preserves blue, amber, red and green state tints');
   assert.ok(await notices.evaluateAll(ns=>ns.every(n=>{
    const s=getComputedStyle(n),icon=n.querySelector('svg'),is=getComputedStyle(icon);
    return n.scrollWidth<=n.clientWidth+1&&s.padding==='16px'&&s.gap==='12px'&&s.borderRadius==='12px'&&s.boxShadow==='none'&&s.cursor==='default'&&is.width==='20px'&&is.height==='20px'&&icon.getAttribute('aria-hidden')==='true'&&getComputedStyle(n.querySelector('strong')).fontWeight==='700'&&getComputedStyle(n.querySelector('p')).fontWeight==='400';
   })),'readable non-button material '+width);
   assert.ok(await notices.evaluateAll(ns=>{
    const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');canvas.width=canvas.height=1;
    const l=color=>{ctx.fillStyle=color;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data].slice(0,3).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);};
    const contrast=(a,b)=>(Math.max(l(a),l(b))+.05)/(Math.min(l(a),l(b))+.05);
    return ns.every(n=>['strong','p'].every(selector=>contrast(getComputedStyle(n.querySelector(selector)).color,getComputedStyle(n).backgroundColor)>=4.5)&&contrast(getComputedStyle(n.querySelector('svg')).color,getComputedStyle(n.querySelector('.v2-notice-icon')).backgroundColor)>=3);
   }),'text and icon contrast '+width);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no horizontal overflow '+width);
   if([390,1440].includes(width))await page.locator('#notices').screenshot({path:`/private/tmp/og-v2-notices-${width}.png`});
   await page.evaluate(async()=>{
    const {renderNotice}=await import('/v2/components/notice.mjs');
    document.querySelector('#notices .v2-notice-grid').insertAdjacentHTML('beforeend',renderNotice({title:'변경한내용이아직저장되지않았습니다'.repeat(8),body:'작성한내용은그대로남아있습니다다시저장해주시기바랍니다'.repeat(12),id:'long-notice'}));
   });
   assert.ok(await page.locator('#long-notice').evaluate(n=>n.scrollWidth<=n.clientWidth+1),'long uninterrupted Korean stays inside notice '+width);
  }
  await page.goto(base+'/v2/components/#notices');
  await page.emulateMedia({forcedColors:'active',reducedMotion:'reduce'});
  assert.ok(await page.locator('#notices .v2-notice').evaluateAll(ns=>ns.every(n=>getComputedStyle(n).borderTopWidth==='1px'&&getComputedStyle(n.querySelector('.v2-notice-icon')).boxShadow==='none')),'forced colors preserve shape and separation');
  await page.emulateMedia({forcedColors:'none'});
  await page.route('**/*.woff2',route=>route.abort());await page.reload();await page.locator('#notices').waitFor();
  assert.equal(await page.locator('#notices svg').count(),4,'icons do not depend on a downloadable icon font');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'font fallback has no overflow');
  assert.deepEqual(errors,[]);
  console.log('Inline notices: four meanings, grouping, flat text/shallow icon seats, contrast, long Korean, forced colors, font fallback and seven widths passed');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
