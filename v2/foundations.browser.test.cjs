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
   await page.setViewportSize({width,height:1000});await page.goto(`${base}/v2/design-system/`);
   await page.locator('main h1').waitFor();await page.evaluate(()=>document.fonts.ready);
   assert.deepEqual(await page.locator('[data-foundation]').evaluateAll(n=>n.map(n=>n.dataset.foundation)),['colors','typography','spacing','radius','materials']);
   assert.equal(await page.locator('main button,main input').count(),0,'specimens do not pretend to be completed controls');
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no overflow at '+width);
   assert.ok(await page.locator('[data-sample]').evaluateAll(nodes=>nodes.every(n=>{const b=n.getBoundingClientRect();return b.left>=0&&b.right<=innerWidth+1&&n.scrollWidth<=n.clientWidth+1;})),'specimens are not clipped at '+width);
   const styles=await page.evaluate(()=>{
    const amount=getComputedStyle(document.querySelector('[data-type="amount"]'));
    const body=getComputedStyle(document.querySelector('[data-type="body"]'));
    const tokens=getComputedStyle(document.documentElement);
    const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');canvas.width=canvas.height=1;
    const rgba=color=>{ctx.clearRect(0,0,1,1);ctx.fillStyle=color;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data];};
    const l=color=>rgba(color).slice(0,3).map(c=>c/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4).reduce((a,c,i)=>a+c*[.2126,.7152,.0722][i],0);
    const ratio=(a,b)=>(Math.max(l(a),l(b))+.05)/(Math.min(l(a),l(b))+.05);
    const contrasts=[...document.querySelectorAll('[data-contrast]')].map(n=>{
     const s=getComputedStyle(n);return {name:n.dataset.contrast,ratio:ratio(s.color,s.backgroundColor),min:n.dataset.large==='true'?3:4.5};
    });
    contrasts.push({name:'focus',ratio:ratio(tokens.getPropertyValue('--v2-focus'),tokens.getPropertyValue('--v2-page')),min:3});
    const faces=[...document.styleSheets].flatMap(sheet=>[...sheet.cssRules]).filter(r=>r.type===CSSRule.FONT_FACE_RULE).map(r=>r.style.getPropertyValue('font-weight')).sort();
    return {page:rgba(tokens.getPropertyValue('--v2-page')),muted:rgba(tokens.getPropertyValue('--v2-muted-surface')),fontLoaded:document.fonts.check('400 16px "OG V2 Pretendard"')&&document.fonts.check('700 28px "OG V2 Pretendard"'),faces,amount:[amount.fontSize,amount.lineHeight,amount.fontWeight],bodyWeight:body.fontWeight,contrasts};
   });
   assert.ok(styles.page[0]>=230&&styles.page[0]<250,'workspace is light gray, not white');assert.equal(styles.page[0],styles.page[1]);assert.equal(styles.page[1],styles.page[2]);assert.equal(styles.muted[0],styles.muted[1]);assert.equal(styles.muted[1],styles.muted[2]);
   await page.waitForFunction(()=>[...document.querySelectorAll('[data-color-token]')].every(n=>/^RGB\(\d+, \d+, \d+\)$/.test(n.textContent)));
   assert.equal(await page.locator('[data-color-token]').count(),13);
   assert.ok(await page.locator('.v2-foundation-end a').evaluate(n=>n.getBoundingClientRect().height>=44));
   assert.ok(await page.locator('[data-color-token]').evaluateAll(outputs=>{
    const canvas=document.createElement('canvas');canvas.width=canvas.height=1;
    const ctx=canvas.getContext('2d');
    return outputs.every(output=>{
     ctx.fillStyle=getComputedStyle(output.closest('.v2-color-row').querySelector('.v2-swatch')).backgroundColor;
     ctx.fillRect(0,0,1,1);const [r,g,b]=ctx.getImageData(0,0,1,1).data;
     return output.textContent===`RGB(${r}, ${g}, ${b})`;
    });
   }),'every displayed RGB matches the rendered swatch');
   await page.evaluate(()=>document.documentElement.style.setProperty('--v2-action','rgb(12, 34, 56)'));
   await page.waitForFunction(()=>document.querySelector('[data-color-token="--v2-action"]').textContent==='RGB(12, 34, 56)');
   await page.evaluate(()=>document.documentElement.style.removeProperty('--v2-action'));
   assert.equal(styles.fontLoaded,true);assert.deepEqual(styles.faces,['400','700']);
   assert.deepEqual(styles.amount,['28px','38px','700']);assert.equal(styles.bodyWeight,'400');
   assert.ok(styles.contrasts.every(c=>c.ratio>=c.min),JSON.stringify(styles.contrasts));
   const h1=page.locator('main h1');await h1.evaluate(n=>{n.textContent='아주긴한글제목이이어져도모바일디자인시스템검토화면의가로영역밖으로넘치지않아야합니다'.repeat(3);});
   assert.ok(await h1.evaluate(n=>n.scrollWidth<=n.clientWidth),'long title wraps');
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'long title no overflow');
   await h1.evaluate(n=>{n.textContent='디자인 시스템';});
   if([390,768,1440].includes(width))await page.screenshot({path:`/private/tmp/og-v2-foundations-${width}.png`,fullPage:true});
  }
  const fallback=await browser.newPage({viewport:{width:390,height:1000}});
  const fallbackErrors=[];fallback.on('pageerror',e=>fallbackErrors.push(e.message));
  await fallback.route('**/*.woff2',route=>route.abort('failed'));
  await fallback.goto(`${base}/v2/design-system/`);await fallback.locator('[data-type="amount"]').waitFor();await fallback.evaluate(()=>document.fonts.ready);
  assert.equal(await fallback.locator('[data-type="amount"]').innerText(),'15,000 M');
  assert.ok(await fallback.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'fallback stays readable');
  assert.ok(await fallback.locator('[data-sample]').evaluateAll(nodes=>nodes.every(n=>n.scrollWidth<=n.clientWidth+1)),'fallback sample text fits');
  assert.deepEqual(fallbackErrors,[]);assert.deepEqual(errors,[]);
  console.log('v2 foundations: 5 groups, 6 widths, actual fonts, contrast, long Korean titles, font failure fallback passed');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
