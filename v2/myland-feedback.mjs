// 피그마 확정안: 주간 출석 C · 옐로·오렌지 231:2573. 원본 v1·v2와 분리한다.
const asset='/assets/myland-final-20261015/';
const picture=(file,cls='',alt='')=>'<img class="'+cls+'" src="'+asset+file+'" alt="'+alt+'">';
const screenHeights={weekly:844};

function navigation(){
 const items=[['홈','bec64.svg'],['마이랜드','88502.svg'],['내 바코드','8c9c2.svg'],['오지파크','1358b.svg'],['내 정보','c9d49.svg']];
 return '<nav class="bottom-nav" aria-label="하단 메뉴">'+items.map((item,index)=>
  '<div class="nav-item'+(index===1?' active':'')+(index===2?' barcode':'')+'"><span>'+picture(item[1])+'</span><small>'+item[0]+'</small></div>'
 ).join('')+'</nav>';
}

function hero(){
 return '<header class="hero">'+picture('c-background.png','park-scene','밝은 들판과 주택 앞에서 인사하는 곰 캐릭터')+'<div class="hero-copy"><h1>마이랜드</h1></div></header>';
}

const weekNames=['일','월','화','수','목','금','토'];
function weeklyCalendar(){
 return '<div class="week-grid">'+weekNames.map((day,index)=>{
  const state=index<2?'done':index===2?'today':index===5?'ticket':'future';
  const label=state==='done'?'출석 완료':state==='today'?'오늘, 출석 전':state==='ticket'?'티켓 보상 예정':'출석 예정';
  const mark=state==='done'?picture('9f802.svg'):state==='ticket'?picture('ececb.svg','ticket-shape')+'<span>티켓</span>':'';
  return '<div class="week-day'+(index===2?' current-day':'')+'"><span class="day-mark '+state+'" aria-label="'+label+'"'+(index===2?' data-today aria-current="date"':'')+'>'+mark+'</span><small>'+day+'·'+(index===2?'오늘':index+11)+'</small></div>';
 }).join('')+'</div>';
}

function attendance(){
 return '<section class="attendance card"><div class="attendance-heading"><b>출석하고 티켓받기</b><span>누적 출석 <strong>10일차</strong></span></div>'+
  weeklyCalendar()+
  '<button type="button" class="attendance-button">출석하기</button></section>';
}

function games(){
 return '<div class="games">'+[['룰렛','c-roulette.png','roulette'],['퍼즐','c-puzzle.png','puzzle']].map(item=>
  '<section class="game '+item[2]+'"><div class="game-copy"><b>'+item[0]+'</b><span class="ticket-count">'+picture('70418.svg')+'<strong>57</strong></span></div>'+picture(item[1],'game-art',item[0])+'</section>'
 ).join('')+'</div>';
}

function missions(){
 const rows=[['마이랜드 방문하기','','+10M'],['룰렛 2회 돌리기','1/2','방문하기'],['회원점 1곳에서 적립하기','3티켓','방문하기'],['공유인 1명 초대하기','','공유하기']];
 return '<section class="missions card"><header><b>이번주 미션</b><strong>1<span>/4</span></strong></header><div class="progress" aria-label="미션 4개 중 1개 완료"><span></span></div><div class="mission-list">'+rows.map((row,index)=>
  '<div class="mission'+(index===0?' complete':'')+'"><span class="mission-icon">'+picture('28c82.svg')+'<span class="mission-status" aria-label="'+(index===0?'완료':'진행 중')+'">'+picture('b2e4e.svg')+'</span></span><span class="mission-label"><span>'+row[0]+'</span>'+(index===0?'<em class="complete-label">완료</em>':row[1]?'<em>'+row[1]+'</em>':'')+'</span><span class="mission-action'+(index===0?' mileage':'')+'">'+row[2]+'</span></div>'
 ).join('')+'</div></section>';
}

export function renderMyLandFeedbackScreen(){
 return '<div class="screen weekly"><div class="screen-scroll" tabindex="0" aria-label="마이랜드 본문">'+hero()+'<div class="content">'+attendance()+games()+missions()+'</div></div>'+navigation()+'</div>';
}

function frame(mode,label){
 return '<figure class="feedback-figure"><figcaption>'+label+'</figcaption><div class="feedback-host" data-myland-feedback-screen="'+mode+'"><template><link rel="stylesheet" href="/v2/myland-feedback.css">'+renderMyLandFeedbackScreen(mode)+'</template></div></figure>';
}

export function renderMyLandFeedbackReview(){
 return '<section id="myland-feedback" data-review-screen><style>.feedback-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,390px),1fr));gap:32px;align-items:start}.feedback-figure{margin:0;max-width:390px;min-width:0}.feedback-figure figcaption{font-weight:700;margin:0 0 16px}.feedback-host{width:100%;overflow:clip}.feedback-note{max-width:840px;line-height:1.65;color:var(--v2-workspace-muted)}</style>'+
  '<h2>마이랜드 확정안</h2><p class="feedback-note">주간 출석과 옐로·오렌지 미션 색상을 적용한 시안입니다.</p>'+
  '<div class="feedback-grid">'+frame('weekly','주간 출석 · C안 옐로·오렌지')+'</div>'+
  '<section class="feedback-summary" aria-label="수정 내용 요약"><style>.feedback-summary{max-width:840px;margin-top:36px;padding-top:24px;border-top:1px solid var(--v2-workspace-edge)}.feedback-summary h3{margin:0 0 12px;font-size:18px}.feedback-summary h3:not(:first-child){margin-top:24px}.feedback-summary ul{margin:0;padding-left:20px;line-height:1.65}.feedback-summary li+li{margin-top:8px}</style>'+
  '<h3>반영 사항</h3><ul>'+
  '<li><b>배경</b> — 밝은 하늘·들판·주택과 캐릭터로 생동감 있는 3D 분위기를 구성했습니다.</li>'+
  '<li><b>주간 출석</b> — 주간형으로 확정하고, 오늘은 숫자 없는 빈 원으로 표시했습니다.</li>'+
  '<li><b>게임 카드</b> — 기존 입체 형태의 룰렛·퍼즐에 색상을 적용하고, 게임별 티켓 수량을 유지했습니다.</li>'+
  '<li><b>미션 색상</b> — 미션 바는 옐로·오렌지 그라데이션, 방문하기는 연한 옐로로 적용했습니다.</li>'+
  '</ul></section></section>';
}

export function setupMyLandFeedback(root){
 for(const host of root.querySelectorAll('[data-myland-feedback-screen]')){
  if(host.shadowRoot)continue;
  const template=host.querySelector('template');
  const shadow=host.attachShadow({mode:'open'});
  shadow.append(template.content.cloneNode(true));
  template.remove();
  const screen=shadow.querySelector('.screen');
  const resize=()=>{
   const scale=Math.min(1,host.clientWidth/390);
   screen.style.zoom=scale;
   host.style.height=screenHeights[host.dataset.mylandFeedbackScreen]*scale+'px';
  };
  new ResizeObserver(resize).observe(host);
  resize();
 }
}
