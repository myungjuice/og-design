const assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const session='og-myland-final-test';
const cli=(...args)=>{
 const response=JSON.parse(execFileSync('agent-browser',['--session',session,'--json',...args],{encoding:'utf8'}));
 assert.equal(response.success,true,response.error);
 return response.data;
};
const evaluate=fn=>cli('eval','('+fn.toString()+')()').result;

try{
 cli('open',(process.env.PREVIEW_URL||'http://127.0.0.1:4175')+'/v2/my-land/#myland-feedback');
 for(const width of [320,375,414,768,1800]){
  cli('set','viewport',String(width),'1200');
  const result=evaluate(async()=>{
   await document.fonts.ready;
   await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
   return {overflow:document.documentElement.scrollWidth>innerWidth,frames:await Promise.all([...document.querySelectorAll('[data-myland-feedback-screen]')].map(async host=>{
    const root=host.shadowRoot,screen=root.querySelector('.screen'),scroll=root.querySelector('.screen-scroll');
    await Promise.all([...root.querySelectorAll('img')].map(img=>img.decode()));
    const scale=parseFloat(screen.style.zoom),bounds=screen.getBoundingClientRect();
    const geometry=selector=>{const r=root.querySelector(selector).getBoundingClientRect();return {y:(r.y-bounds.y)/scale,height:r.height/scale,width:r.width/scale};};
    const navBefore=geometry('.bottom-nav').y;
    const fullScroll=scroll.scrollHeight>scroll.clientHeight+1;
    scroll.scrollTop=scroll.scrollHeight;
    const fixed=geometry('.bottom-nav').y===navBefore;
    const last=root.querySelector('.mission:last-child').getBoundingClientRect();
    const lastVisible=last.bottom<=root.querySelector('.bottom-nav').getBoundingClientRect().top;
    scroll.scrollTop=0;
    return {mode:host.dataset.mylandFeedbackScreen,screen:geometry('.screen'),attendance:geometry('.attendance'),games:geometry('.games'),missions:geometry('.missions'),nav:geometry('.bottom-nav'),fullScroll,fixed,lastVisible,images:[...root.querySelectorAll('img')].every(img=>img.complete&&img.naturalWidth>0),button:root.querySelector('.attendance-button').textContent,barcode:geometry('.barcode>span'),gameLabels:[...root.querySelectorAll('.game-copy>b')].map(e=>e.textContent)};
   }))};
  });
  assert.equal(result.overflow,false,'가로 넘침: '+width);
  assert.equal(result.frames.length,1);
  for(const f of result.frames){
   // 축소 시 브라우저의 서브픽셀 반올림을 허용한다. 원본 크기에서는 엄격히 비교한다.
   const close=(a,b)=>assert.ok(Math.abs(a-b)<(width>=768?.15:.75),`${width} ${f.mode}: ${a} != ${b}`);
   close(f.screen.height,844);
   close(f.attendance.y,144);close(f.attendance.height,174);
   close(f.games.y,330);close(f.games.height,92);
   close(f.missions.y,434);close(f.missions.height,290);
   close(f.nav.height,90);close(f.nav.y,f.screen.height-90);
   close(f.barcode.height,64);close(f.barcode.y,f.nav.y-24);
   assert.equal(f.fullScroll,true,'하단 메뉴 위 여백을 포함한 본문 스크롤 범위');
   assert.ok(f.fixed&&f.lastVisible&&f.images,'고정 메뉴·마지막 미션·이미지 누락');
   assert.equal(f.button,'출석하기');
   assert.deepEqual(f.gameLabels,['룰렛','퍼즐']);
  }
 }
 console.log('마이랜드 C안: 5개 화면 너비에서 이미지·배치·스크롤·고정 메뉴 검증 통과');
}finally{cli('close');}
