const test=require('node:test');
const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.V2_BASE_URL||'http://127.0.0.1:4173';
const states=['registered','with-photo','no-photo'];
const launch=()=>chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
async function ready(page,count=1){
 await page.waitForFunction(count=>{
  const hosts=[...document.querySelectorAll('#store-news .v2-home-store-news-host')].filter(host=>host.shadowRoot);
  return hosts.length===count&&hosts.every(host=>[...host.shadowRoot.querySelectorAll('link')].every(link=>link.sheet)&&[...host.shadowRoot.querySelectorAll('img')].every(img=>img.complete));
 },count);await page.evaluate(()=>document.fonts.ready);
}

test('news is reachable with lazy comparisons, direct hash, history and group selection',async()=>{
 const browser=await launch();try{
  const page=await browser.newPage({viewport:{width:1440,height:1100}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));await page.goto(base+'/v2/home/');
  await page.locator('#overview .home-test').waitFor();assert.equal(await page.locator('#store-news [data-store-news-state]').count(),0);
  await page.locator('[data-view-link="store-news"]').click();await ready(page);
  const summary=page.locator('#store-news details summary');await summary.click();await ready(page,3);await summary.click();await summary.click();await ready(page,3);
  await page.goBack();assert.ok(await page.locator('#overview').isVisible());await page.goForward();assert.ok(await page.locator('#store-news').isVisible());
  await page.reload();await ready(page);assert.equal(await page.locator('#store-news [data-store-news-state]').count(),1);
  await page.locator('[data-group-link="store-updates"]').click();await ready(page);assert.ok(await page.locator('#store-news').isVisible());assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});

test('three news examples keep optional 80px photos, readable flat rows and shared chrome at eight widths',async()=>{
 const browser=await launch();try{
  const page=await browser.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
  page.on('request',request=>{if(!request.url().startsWith(base+'/')&&!request.url().startsWith('https://og-familystore-image.s3.ap-northeast-2.amazonaws.com/'))errors.push(request.url());});
  await page.goto(base+'/v2/home/#store-news');
  for(const width of [320,375,390,414,768,1024,1440,1920]){
   await page.setViewportSize({width,height:1100});await page.reload();await ready(page);await page.locator('#store-news details summary').click();await ready(page,3);
   for(const [index,state] of states.entries()){
    const frame=page.locator(`#store-news [data-store-news-state="${state}"]`);
    const result=await frame.evaluate(node=>{
     const body=node.querySelector('.og-store-body'),section=node.querySelector('.v2-store-news');
     const title=section.querySelector('.og-heading-title-line').getBoundingClientRect(),action=section.querySelector('.og-heading-action').getBoundingClientRect();
     const canvas=document.createElement('canvas');canvas.width=canvas.height=1;const context=canvas.getContext('2d');
     const lum=color=>{context.clearRect(0,0,1,1);context.fillStyle=color;context.fillRect(0,0,1,1);return [...context.getImageData(0,0,1,1).data].slice(0,3).map(value=>value/255).map(value=>value<=.04045?value/12.92:((value+.055)/1.055)**2.4).reduce((sum,value,index)=>sum+value*[.2126,.7152,.0722][index],0);};
     const contrast=(a,b)=>{const x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
     const surface=getComputedStyle(node).backgroundColor;
     const rows=[...section.querySelectorAll('.og-update-row')];
     return {size:[node.clientWidth,node.clientHeight],fits:[node,body,section,...section.querySelectorAll('.og-update-row,.og-update-copy,h4')].every(element=>element.scrollWidth<=element.clientWidth),
      static:[...node.querySelectorAll('button')].every(button=>button.inert||button.closest('[inert]')),readable:body.tabIndex===0&&!body.closest('[inert]'),
      current:node.querySelector('nav [aria-current="location"]').textContent,
      headingAligned:Math.abs(title.y+title.height/2-action.y-action.height/2)<=1,
      targets:[...node.querySelectorAll('button')].map(button=>[button.clientHeight,button.clientWidth,button.textContent.trim()?getComputedStyle(button).whiteSpace:'nowrap']),
      images:[...section.querySelectorAll('.v2-thumbnail')].map(photo=>[photo.clientWidth+2,photo.clientHeight+2,photo.dataset.ratio,photo.dataset.fit,getComputedStyle(photo).boxShadow!=='none']),
      rows:rows.map(row=>({date:row.querySelector('.og-update-date').textContent,title:row.querySelector('h4').textContent,shadow:getComputedStyle(row).boxShadow,width:row.clientWidth,copy:row.querySelector('.og-update-copy').clientWidth})),
      nums:getComputedStyle(section).fontVariantNumeric,font:getComputedStyle(section).fontFamily,
      textContrast:Math.min(...[...section.querySelectorAll('h3,h4,p,.og-heading-action')].map(element=>contrast(getComputedStyle(element).color,surface))),
      focusContrast:contrast(getComputedStyle(body).getPropertyValue('--v2-focus'),surface)};
    });
    assert.deepEqual(result.size,[Math.min(width,390),846]);assert.ok(result.fits&&result.static&&result.readable);assert.equal(result.current,'소식');assert.ok(result.headingAligned);
    assert.ok(result.targets.every(([height,w,wrap])=>height>=48&&w>=44&&wrap==='nowrap'));
    assert.deepEqual(result.images,index<2?[[80,80,'square','cover',true]]:[]);
    assert.equal(result.rows.length,index===0?1:2);for(const row of result.rows){assert.equal(row.date,'6.26(금)');assert.equal(row.title,'포장할인 5000원');assert.equal(row.shadow,'none');}
    if(index!==0)assert.equal(result.rows[1].copy,result.rows[1].width);
    assert.equal(result.nums,'tabular-nums');assert.match(result.font,/OG V2 Pretendard/);assert.ok(result.textContrast>=4.5);assert.ok(result.focusContrast>=3);
    if([320,375,390,414,768].includes(width))await frame.screenshot({path:`/private/tmp/og-v2-store-news-${state}-${width}.png`});
   }
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  }
  const frame=page.locator('#store-news [data-store-news-state="registered"]'),body=frame.locator('.og-store-body'),header=frame.locator('header');
  const headerY=await header.evaluate(node=>node.getBoundingClientRect().y-node.closest('.v2-home-store-frame').getBoundingClientRect().y);
  await body.evaluate(node=>{for(let i=0;i<10;i++)node.append(node.querySelector('.v2-store-news').cloneNode(true));});await body.focus();await page.keyboard.press('End');
  await page.waitForFunction(()=>{const node=document.querySelector('#store-news .v2-home-store-news-host').shadowRoot.querySelector('.og-store-body');return node.scrollTop>0&&node.scrollTop>=node.scrollHeight-node.clientHeight-2;});
  assert.equal(await header.evaluate(node=>node.getBoundingClientRect().y-node.closest('.v2-home-store-frame').getBoundingClientRect().y),headerY);assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});

test('failed source assets retain news titles and dates, square fallback slots and no-photo omission',async()=>{
 const browser=await launch();try{
  const page=await browser.newPage({viewport:{width:390,height:1100}});await page.route('https://og-familystore-image.s3.ap-northeast-2.amazonaws.com/**',route=>route.abort());
  await page.goto(base+'/v2/home/#store-news');await ready(page);await page.locator('#store-news details summary').click();await ready(page,3);
  for(const [index,state] of states.entries()){
   const frame=page.locator(`#store-news [data-store-news-state="${state}"]`);
   assert.match(await frame.locator('.og-store-name').textContent(),/육감만족/);
   assert.equal(await frame.locator('.og-update-date').count(),index===0?1:2);
   for(const media of await frame.locator('[data-v2-media]').all()){assert.equal(await media.getAttribute('data-state'),'error');await media.locator('.og-media-fallback').waitFor({state:'visible'});}
   assert.equal(await frame.locator('.v2-store-news .v2-thumbnail').count(),index<2?1:0);
  }
 }finally{await browser.close();}
});
