// 마이랜드 피드백 비교안. 피그마 이관 시안과 분리해 검토한다.
const asset='/assets/designer-20261013/';
const picture=(file,cls='',alt='')=>'<img class="'+cls+'" src="'+asset+file+'" alt="'+alt+'">';

const scenery=[
 '<svg class="park-scene" viewBox="0 0 390 188" preserveAspectRatio="xMidYMid slice" aria-hidden="true">',
 '<defs>',
 '<linearGradient id="sky" x2="0" y2="1"><stop stop-color="#9fd6ff"/><stop offset="1" stop-color="#e2f5ff"/></linearGradient>',
 '<linearGradient id="hill" x2="0" y2="1"><stop stop-color="#9ee8b3"/><stop offset="1" stop-color="#71c99b"/></linearGradient>',
 '<linearGradient id="tent" x2="0" y2="1"><stop stop-color="#ffb5c8"/><stop offset=".45" stop-color="#ff7ba8"/><stop offset="1" stop-color="#e85383"/></linearGradient>',
 '<linearGradient id="wheel" x2="0" y2="1"><stop stop-color="#8b7cfb"/><stop offset="1" stop-color="#5550d9"/></linearGradient>',
 '<radialGradient id="tree" cx=".32" cy=".23" r=".8"><stop stop-color="#b2f1bc"/><stop offset=".55" stop-color="#78d99e"/><stop offset="1" stop-color="#40aa7c"/></radialGradient>',
 '<radialGradient id="cloud" cx=".3" cy=".2" r=".9"><stop stop-color="#fff"/><stop offset="1" stop-color="#e4efff"/></radialGradient>',
 '<linearGradient id="house" x2="1" y2="1"><stop stop-color="#fffdf7"/><stop offset="1" stop-color="#edd6bd"/></linearGradient>',
 '<radialGradient id="gold" cx=".28" cy=".22" r=".8"><stop stop-color="#fff3af"/><stop offset=".5" stop-color="#ffd05e"/><stop offset="1" stop-color="#dfa12c"/></radialGradient>',
 '<radialGradient id="pink" cx=".28" cy=".22" r=".8"><stop stop-color="#ffdfeb"/><stop offset=".5" stop-color="#f58aaf"/><stop offset="1" stop-color="#cc578a"/></radialGradient>',
 '<radialGradient id="mint" cx=".28" cy=".22" r=".8"><stop stop-color="#d3fff0"/><stop offset=".5" stop-color="#8de1d0"/><stop offset="1" stop-color="#4fac9e"/></radialGradient>',
 '<filter id="depth" x="-.3" y="-.3" width="1.6" height="1.7"><feDropShadow dx="2" dy="4" stdDeviation="2" flood-color="#46718c" flood-opacity=".24"/></filter>',
 '<filter id="soft"><feGaussianBlur stdDeviation="7"/></filter>',
 '</defs>',
 '<path fill="url(#sky)" d="M0 0h390v188H0z"/>',
 '<circle cx="340" cy="27" r="29" fill="#fff5c5" opacity=".78"/>',
 '<g fill="url(#cloud)" opacity=".96"><ellipse cx="44" cy="38" rx="27" ry="10"/><circle cx="30" cy="31" r="11"/><circle cx="49" cy="27" r="15"/><ellipse cx="201" cy="25" rx="31" ry="11"/><circle cx="190" cy="19" r="12"/><circle cx="213" cy="15" r="17"/></g>',
 '<path d="M0 150Q70 119 136 143T270 135T390 141V188H0Z" fill="#bcebc2"/>',
 '<path d="M0 170Q79 131 155 157T317 143T390 157V188H0Z" fill="url(#hill)"/>',
 '<ellipse cx="211" cy="171" rx="170" ry="12" fill="#468e7c" opacity=".18" filter="url(#soft)"/>',
 '<g transform="translate(302 85)" stroke="url(#wheel)" stroke-width="4" fill="none" filter="url(#depth)">',
 '<circle cx="3" cy="3" r="56" stroke="#5c4fbb" stroke-width="8"/>',
 '<circle r="56" stroke-width="7"/><circle r="40" opacity=".65"/><path d="M0-56V56M-56 0H56M-40-40L40 40M40-40L-40 40"/><path d="M0 0-24 82M0 0 24 82" stroke-width="8"/>',
 '</g>',
 '<g filter="url(#depth)"><circle cx="302" cy="29" r="9" fill="url(#gold)"/><circle cx="342" cy="45" r="9" fill="url(#pink)"/><circle cx="358" cy="85" r="9" fill="url(#mint)"/><circle cx="342" cy="125" r="9" fill="url(#gold)"/><circle cx="262" cy="45" r="9" fill="url(#mint)"/><circle cx="246" cy="85" r="9" fill="url(#pink)"/><circle cx="262" cy="125" r="9" fill="url(#gold)"/></g>',
 '<g transform="translate(8 42) scale(.72)" filter="url(#depth)"><path d="M100 114l12-6v43l-12 3Z" fill="#c7a993"/><path d="M38 153V112l29-32 33 32v42Z" fill="url(#house)"/><path d="M67 75l12-3 40 39-12 3Z" fill="#bc4779"/><path d="M30 114 67 75l40 39Z" fill="url(#tent)"/><path d="M33 113 67 79" stroke="#ffd3e1" stroke-width="3" stroke-linecap="round"/><path d="M38 116h62v8H38z" fill="#d589a4"/><path d="M55 153v-26h24v26" fill="#6aa8df"/><path d="M58 153v-23h18v23" fill="#a0d4ff"/><path d="M60 133h14" stroke="#fff" stroke-width="3"/></g>',
 '<g><path d="M13 163v-22M119 158v-24" stroke="#936f52" stroke-width="5"/><circle cx="13" cy="137" r="16" fill="url(#tree)"/><circle cx="119" cy="130" r="18" fill="url(#tree)"/><circle cx="4" cy="132" r="11" fill="url(#tree)"/><circle cx="128" cy="126" r="12" fill="url(#tree)"/></g>',
 '<g fill="#fff7ce"><circle cx="143" cy="153" r="3"/><circle cx="166" cy="166" r="2"/><circle cx="222" cy="148" r="3"/><circle cx="364" cy="157" r="3"/></g>',
 '</svg>'
].join('');

function navigation(){
 const items=[['홈','96c0f.svg'],['마이랜드','ce3a9.svg'],['내 바코드','77fa8.svg'],['오지파크','c10fd.svg'],['내 정보','eeba5.svg']];
 return '<nav class="bottom-nav" aria-label="하단 메뉴">'+items.map((item,index)=>
  '<div class="nav-item'+(index===1?' active':'')+(index===2?' barcode':'')+'"><span>'+picture(item[1])+'</span><small>'+item[0]+'</small></div>'
 ).join('')+'</nav>';
}

function hero(){
 return '<header class="hero">'+scenery+'<div class="hero-copy"><h1>마이랜드</h1><p>오늘도 놀러 오셨네요!</p></div>'+picture('fc001.png','bear','곰 캐릭터')+'</header>';
}

const weekNames=['일','월','화','수','목','금','토'];
function weeklyCalendar(){
 const states=['done','ticket received','empty today','empty future','empty future','empty future','ticket muted future'];
 return '<div class="week-grid">'+weekNames.map((day,index)=>
  '<div class="week-day'+(index===2?' current-day':'')+'"><span class="day-slot"><span class="day-mark '+states[index]+'"'+(index===2?' data-today aria-current="date"':'')+' aria-label="'+(states[index].includes('received')?'티켓 수령 완료':states[index].startsWith('ticket')?'티켓 보상 예정':index===2?'오늘, 출석 전':states[index]==='done'?'출석 완료':'출석 예정')+'">'+(states[index]==='done'?'✓':states[index].startsWith('ticket')?'티켓':'')+'</span>'+(states[index].includes('received')?'<span class="reward-check" aria-hidden="true">✓</span>':'')+'</span><small>'+day+(index===2?' · 오늘':'')+'</small></div>'
 ).join('')+'</div>';
}

function monthlyCalendar(){
 const cells=[...Array(4).fill(0),...Array.from({length:31},(_,index)=>index+1)];
 return '<div class="month-title">2026년 10월</div><div class="month-grid">'+
  weekNames.map(day=>'<span class="weekday">'+day+'</span>').join('')+
  cells.map(day=>day?'<span class="day-slot"><span class="date'+([9,11].includes(day)?' done':'')+([12,17].includes(day)?' ticket':'')+(day===13?' today':'')+(day>13?' future':'')+'"'+(day===13?' data-today aria-current="date"':'')+' aria-label="'+day+'일'+(day===13?' 오늘, 출석 전':day===12?' 티켓 수령 완료':day===17?' 티켓 보상 예정':day>13?' 출석 예정':[9,11].includes(day)?' 출석 완료':' 미출석')+'">'+day+([12,17].includes(day)?'<small>티켓</small>':day===13?'<small>오늘</small>':'')+'</span>'+(day===12?'<span class="reward-check" aria-hidden="true">✓</span>':'')+'</span>':'<span class="date blank"></span>').join('')+
 '</div><div class="calendar-key"><span><i class="done"></i>출석 완료</span><span><i class="ticket"></i>티켓 보상</span></div>';
}

function attendance(mode){
 return '<section class="attendance card"><div class="attendance-heading"><b>출석하고 티켓받기</b><span>누적 출석 <strong>3일차</strong></span></div>'+
  (mode==='monthly'?monthlyCalendar():weeklyCalendar())+
  '<button type="button" class="attendance-button">출석하기</button></section>';
}

function games(){
 return '<div class="games">'+[['룰렛','57','933fc.png','roulette'],['퍼즐','14','99ca4.png','puzzle']].map(item=>
  '<section class="game '+item[3]+'"><div class="game-copy"><b>'+item[0]+'</b><span class="ticket-count">'+picture('a3be4.svg')+'<strong>'+item[1]+'</strong><small>장</small></span></div>'+picture(item[2],'game-art')+'</section>'
 ).join('')+'</div>';
}

function missions(){
 const rows=[['마이랜드 방문하기','','+10M'],['룰렛 2회 돌리기','1/2','방문하기'],['회원점 1곳에서 적립하기','3티켓','방문하기'],['공유인 1명 초대하기','','공유하기']];
 return '<section class="missions card"><header><b>이번주 미션</b><strong>1<span>/4</span></strong></header><div class="progress" aria-label="미션 4개 중 1개 완료"><span></span></div><div class="mission-list">'+rows.map((row,index)=>
  '<div class="mission'+(index===0?' complete':'')+'"><span class="mission-icon">'+picture('ee751.svg')+'<span class="mission-status" aria-label="'+(index===0?'완료':'진행 중')+'">'+(index===0?'✓':'·')+'</span></span><span class="mission-label"><span>'+row[0]+'</span>'+(index===0?'<em class="complete-label">완료</em>':row[1]?'<em>'+row[1]+'</em>':'')+'</span><span class="mission-action'+(index===0?' mileage':'')+'">'+row[2]+'</span></div>'
 ).join('')+'</div></section>';
}

export function renderMyLandFeedbackScreen(mode){
 return '<div class="screen '+mode+'"><div class="screen-scroll">'+hero()+'<div class="content">'+attendance(mode)+games()+missions()+'</div></div>'+navigation()+'</div>';
}

function frame(mode,label){
 return '<figure class="feedback-figure"><figcaption>'+label+'</figcaption><div class="feedback-host" data-myland-feedback-screen="'+mode+'"><template><link rel="stylesheet" href="/v2/myland-feedback.css">'+renderMyLandFeedbackScreen(mode)+'</template></div></figure>';
}

export function renderMyLandFeedbackReview(){
 return '<section id="myland-feedback" data-review-screen><style>.feedback-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,390px),1fr));gap:32px;align-items:start}.feedback-figure{margin:0;max-width:390px;min-width:0}.feedback-figure figcaption{font-weight:700;margin:0 0 16px}.feedback-host{width:100%;overflow:hidden}.feedback-note{max-width:840px;line-height:1.65;color:var(--v2-workspace-muted)}</style>'+
  '<h2>마이랜드 피드백 반영안</h2><p class="feedback-note">밝은 입체 배경과 색상 포인트를 적용하고, 요약 수치 영역은 제거했습니다. 출석표 구성은 비교 후 결정할 수 있도록 두 형태를 함께 표시합니다. 10월 13일 기준의 예시이며, 출석 날짜·티켓 보상일·미션 진행 상태는 확정 정책이 아닙니다. 출석하기를 누르면 완료 상태를 확인할 수 있습니다.</p>'+
  '<div class="feedback-grid">'+frame('weekly','주간 출석형')+frame('monthly','월간 출석형 · 미션 영역은 스크롤')+'</div>'+
  '<section class="feedback-summary" aria-label="수정 내용 요약"><style>.feedback-summary{max-width:840px;margin-top:36px;padding-top:24px;border-top:1px solid #666}.feedback-summary h3{margin:0 0 12px;font-size:18px}.feedback-summary h3:not(:first-child){margin-top:24px}.feedback-summary ul{margin:0;padding-left:20px;line-height:1.65}.feedback-summary li+li{margin-top:8px}.feedback-summary p{margin:10px 0 0;font-size:13px;color:var(--v2-workspace-muted)}</style>'+
  '<h3>윤 이사님 요청 반영</h3><ul>'+
  '<li><b>밝고 생동감 있는 3D 분위기</b> → 공원 배경과 캐릭터를 배치하고, 배경에 명암과 두께감을 추가했습니다.</li>'+
  '<li><b>티켓·게임·방문하기에 포인트 색상</b> → 분홍 티켓, 주황·파랑 게임 카드, 초록 방문하기로 구분했습니다. 기존 게임 이미지는 유지했습니다.</li>'+
  '<li><b>요약 영역 제거·게임별 티켓 강조</b> → 마일리지·티켓 요약을 없애고, 각 게임의 티켓 수량을 밝은 배지로 강조했습니다.</li>'+
  '<li><b>월간 출석표를 보고 결정</b> → 주간형·월간형을 함께 배치하고, 배경 높이와 여백을 줄여 스크롤 부담을 낮췄습니다.</li>'+
  '</ul><p>구체적인 색상과 배경 구성은 비교용 제안이며, 출석표 형식은 미확정입니다.</p>'+
  '<h3>추가 보완</h3><ul>'+
  '<li><b>출석 상태 구분</b> → 오늘·예정 날짜, 티켓 수령 체크, 출석 완료 버튼을 추가해 상태를 쉽게 알 수 있도록 했습니다.</li>'+
  '<li><b>미션 가독성·일관성</b> → 글자를 14px로 복원하고, 완료 체크와 진행률을 예시 상태에 맞췄습니다.</li>'+
  '<li><b>하단 메뉴 잘림 수정</b> → 바코드 버튼이 가려지지 않도록 겹침 순서를 조정했습니다.</li>'+
  '</ul></section></section>';
}

export function setupMyLandFeedback(root){
 for(const host of root.querySelectorAll('[data-myland-feedback-screen]')){
  const template=host.querySelector('template');
  const shadow=host.attachShadow({mode:'open'});
  shadow.append(template.content.cloneNode(true));
  template.remove();
  const screen=shadow.querySelector('.screen');
  shadow.querySelector('.attendance-button').addEventListener('click',event=>{
   const button=event.currentTarget;
   button.textContent='✓ 오늘 출석 완료';
   button.disabled=true;
   shadow.querySelector('.attendance-heading strong').textContent='4일차';
   const today=shadow.querySelector('[data-today]');
   today.classList.add('done');
   today.setAttribute('aria-label','오늘, 출석 완료');
   if(host.dataset.mylandFeedbackScreen==='weekly') today.textContent='✓';
  });
  const resize=()=>{
   const scale=Math.min(1,host.clientWidth/390);
   screen.style.zoom=scale;
   host.style.height=879*scale+'px';
  };
  new ResizeObserver(resize).observe(host);
  resize();
 }
}
