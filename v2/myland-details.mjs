import {renderMyLandFeedbackScreen} from './myland-feedback.mjs';
import {renderButton} from './components/render.mjs';

// 화면 검토용 상태. 보상·한도는 260904 기획서 초안이며 실제 지급 로직과 무관하다.
export const myLandDetailGroups=[
 {id:'myland-attendance',label:'출석 · 보상',items:[{id:'attendance-daily',label:'일반 출석 완료'},{id:'attendance-milestone',label:'7일 연속 보상'}]},
 {id:'myland-roulette',label:'룰렛',items:[{id:'roulette-ready',label:'시작'},{id:'roulette-spinning',label:'회전 중'},{id:'roulette-result',label:'보상 결과'},{id:'roulette-odds',label:'확률 안내'}]},
 {id:'myland-puzzle',label:'퍼즐',items:[{id:'puzzle-ready',label:'방법·시작'},{id:'puzzle-playing',label:'플레이'},{id:'puzzle-result',label:'점수·보상 결과'}]},
 {id:'myland-limits',label:'참여 제한 안내',items:[{id:'limit-ticket',label:'티켓 부족'},{id:'limit-daily',label:'일일 참여 한도'},{id:'limit-monthly',label:'월간 보상 한도'}]}
];
const assets='/assets/myland-final-20261015/';
const img=(name,cls='',alt='')=>`<img class="${cls}" src="${assets+name}" alt="${alt}">`;
const ticket=()=>img('70418.svg','md-ticket');
const coin=()=>'<span class="md-coin" aria-label="마일리지">M</span>';
const bear=()=>'<img class="md-bear" src="/v2/my-info/media/bear-cutout-v2.png" alt="축하하는 곰 캐릭터">';
const attendanceAction=(label,to,variant)=>renderButton({label,variant,attributes:{'data-myland-destination':to}});
const link=(text,to,cls='md-primary')=>`<a class="${cls}" href="#${to}">${text}</a>`;
const close=(to='myland-feedback')=>link('×',to,'md-close');
const reward=(kind,value)=>`<div class="md-reward">${kind==='ticket'?ticket():coin()}<span>${kind==='ticket'?'OG 티켓':'마일리지'}<strong>${value}</strong></span></div>`;
const wallet=(count=3)=>`<div class="md-wallet">${ticket()}<span>내 티켓 <b>${count}장</b></span></div>`;
function header(name,count=3,help=false){
 return `<header class="md-header">${close()}<b>${name}</b>${help?link('?', 'roulette-odds','md-help'):wallet(count)}</header>`;
}
function scene(content,cls=''){
 return `<div class="md-screen ${cls}">${cls==='md-result-screen'?'':img('c-background.png','md-landscape')}<div class="md-scenery-wash"></div>${content}</div>`;
}
function mainBackdrop(days){
 return '<div class="md-main-backdrop" inert aria-hidden="true">'+renderMyLandFeedbackScreen().replace('10일차',days+'일차').replace('출석 전','출석 완료').replace(/(data-today[^>]*>)/,'$1'+img('9f802.svg')).replace('day-mark today','day-mark done').replace('>출석하기<','>출석 완료<')+'</div>';
}
function attendance(milestone){
 return `<div class="md-screen">${mainBackdrop(milestone?7:6)}<div class="md-shade"></div><section class="md-dialog md-celebration" aria-label="출석 완료">${close()}${bear()}${milestone?'<span class="md-pill">7일 연속 출석</span>':''}<h2>${milestone?'꾸준함에 보상을 더해요':'출석 완료!'}</h2><p>${milestone?'일주일 동안 모은 출석, 선물이 도착했어요.':'6일 연속 출석했어요.'}</p><div class="md-rewards">${reward('ticket',milestone?'3장':'1장')}${milestone?reward('mileage','50 M'):''}</div><div class="md-next"><span>다음 출석 보상</span><b>${milestone?'14일':'7일'} 연속 <span>${milestone?'티켓 5장 + 100 M':'티켓 3장 + 50 M'}</span></b></div>${link('바로 룰렛 돌리기','roulette-ready')}${link('마이랜드로','myland-feedback','md-text-link')}</section></div>`;
}
const odds=[['5 M','50.6%'],['10 M','28%'],['20 M','13%'],['50 M','6%'],['100 M','2%'],['500 M','0.4%']];
function wheel(spinning=false){
 return `<div class="md-wheel-stage"><span class="md-pointer"></span><div class="md-wheel ${spinning?'is-spinning':''}" aria-label="룰렛 보상 5, 10, 20, 50, 100, 500 마일리지">${['5','10','20','50','100','500'].map((n,i)=>`<span class="md-wedge md-wedge-${i}"><b>${n}</b><small>M</small></span>`).join('')}<span class="md-wheel-hub">M</span></div><span class="md-wheel-stand"></span></div>`;
}
function roulette(spinning=false){
 return scene(`${header('룰렛',spinning?2:3,true)}<div class="md-game-heading"><span class="md-pill">꽝 없이 매번 받는 마일리지</span><h1>행운을 돌려봐요!</h1><p>티켓 한 장으로, 최대 500 M</p></div>${wallet(spinning?2:3)}${wheel(spinning)}<div class="md-game-footer">${spinning?'<button class="md-primary" disabled>행운이 돌아가는 중…</button>':link(`${ticket()} 1장으로 룰렛 돌리기`,'roulette-spinning')}<p>오늘 남은 게임 <b>${spinning?'5':'6'}회</b></p></div>`,'md-roulette');
}
function probabilities(){
 return scene(`${header('룰렛 확률 안내')}<section class="md-sheet"><span class="md-pill">룰렛 보상</span><h1>어떤 행운이 기다릴까요?</h1><p>룰렛은 꽝 없이 마일리지를 받을 수 있어요.</p><table class="md-odds"><thead><tr><th>보상</th><th>당첨 확률</th></tr></thead><tbody>${odds.map(([value,chance])=>`<tr><td>${coin()} ${value}</td><td>${chance}</td></tr>`).join('')}</tbody></table><p class="md-small">참여 시점의 확률에 따라 보상이 결정돼요.</p>${link('확인','roulette-ready')}</section>`,'md-information');
}
// 작은 게임 말은 SVG 벡터로 그린 목업용 과일 심볼이다. 최종 게임 에셋은 별도 검토한다.
function fruit(type,index=0){
 const gradient=`fruit-${type}-${index}`;
 const shapes={
  apple:'<path class="fruit-body" d="M26 22C7 11 6 35 16 46c5 6 9 1 12 1s7 5 12-1c10-12 9-35-10-24Z"/><path class="fruit-leaf" d="M28 21q-1-13 12-12-1 11-12 12Z"/>',
  orange:'<circle class="fruit-body" cx="28" cy="33" r="18"/><path class="fruit-leaf" d="M28 15q3-13 16-7-4 10-16 7Z"/>',
  grape:'<g class="fruit-body"><circle cx="20" cy="23" r="9"/><circle cx="36" cy="23" r="9"/><circle cx="28" cy="35" r="9"/><circle cx="28" cy="46" r="7"/></g><path class="fruit-leaf" d="M28 15q2-12 14-9-2 9-14 9Z"/>',
  pear:'<path class="fruit-body" d="M21 17c0-10 14-10 14 0s14 16 11 26S12 55 10 43 21 27 21 17Z"/><path class="fruit-leaf" d="M28 11q3-9 13-6-4 9-13 6Z"/>'
 };
 return `<svg class="md-fruit ${type}" viewBox="0 0 56 56" role="img" aria-label="${{apple:'사과',orange:'오렌지',grape:'포도',pear:'배'}[type]}"><defs><radialGradient id="${gradient}" cx="30%" cy="23%" r="80%"><stop class="fruit-light" offset="0"/><stop class="fruit-mid" offset=".45"/><stop class="fruit-dark" offset="1"/></radialGradient><linearGradient id="${gradient}-leaf" x2=".8" y2="1"><stop class="leaf-light"/><stop class="leaf-dark" offset="1"/></linearGradient></defs><g fill="url(#${gradient})">${shapes[type].replace('class="fruit-leaf"',`class="fruit-leaf" fill="url(#${gradient}-leaf)"`)}</g><path class="fruit-shine" d="M17 29q-3 4-1 8"/></svg>`;
}
function puzzle(playing=false){
 const types=['apple','orange','grape','pear'];
 const board=[0,1,2,0,3,1,2,0,3,1,2,0,1,2,0,3,1,3,3,0,0,2,0,1,0,2,0,1,2,0,1,3,1,2,3,2,2,1,3,0,1,0];
 if(playing)return scene(`${header('퍼즐',2)}<div class="md-scoreboard"><div><span>현재 점수</span><strong>1,240</strong></div><div class="md-timer"><span>남은 시간</span><strong>0:42</strong></div></div><div class="md-time-track"><span></span></div><div class="md-combo">콤보 ×2 <b>+30</b></div><div class="md-board" aria-label="퍼즐 플레이 화면 예시">${board.map((type,i)=>`<span class="md-cell ${[14,20,26].includes(i)?'matched':''}">${fruit(types[type],i)}</span>`).join('')}</div><div class="md-play-caption"><b>같은 과일을 3개 이상!</b><p>이웃한 과일을 바꾸어 맞춰보세요.</p></div>`,'md-puzzle md-playing');
 return scene(`${header('퍼즐')}<div class="md-game-heading"><h1>맞출수록 쌓이는 즐거움</h1><p>과일을 맞추고 마일리지를 받아요.</p></div>${img('c-puzzle.png','md-puzzle-art','입체 퍼즐 조각')}<section class="md-instructions"><div class="md-fruit-demo">${fruit('apple',0)}${fruit('apple',1)}${fruit('apple',2)}<b>+점수</b></div><p>이웃한 과일을 바꿔<br><b>같은 과일을 3개 이상</b> 연결하세요.</p><div class="md-puzzle-stats"><span>제한 시간<b>60초</b></span><span>최대 보상<b>50 M</b></span></div></section><div class="md-game-footer">${link(`${ticket()} 1장으로 시작하기`,'puzzle-playing')}<p>내 티켓 <b>3장</b><i>·</i>오늘 남은 게임 <b>6회</b></p></div>`,'md-puzzle');
}
function result(puzzleResult=false){
 return scene(`${header(puzzleResult?'퍼즐 결과':'룰렛 결과',2)}<section class="md-result"><h1>${puzzleResult?'달콤한 보상을 받았어요':'마일리지를 받았어요'}</h1><div class="md-result-art">${bear()}${coin()}</div>${puzzleResult?'<div class="md-final-score"><span>최종 점수</span><strong>2,860</strong></div>':''}<div class="md-prize"><span>획득 마일리지</span><strong>+${puzzleResult?'35':'20'} M</strong></div><div class="md-result-summary"><span>남은 티켓 <b>2장</b></span><span>오늘 남은 게임 <b>5회</b></span></div>${link(`${ticket()} 1장으로 한 번 더`,puzzleResult?'puzzle-playing':'roulette-spinning')}${link('마이랜드로','myland-feedback','md-text-link')}</section>`,'md-result-screen');
}
function limit(kind){
 const data={ticket:['티켓이 부족해요','출석하고 티켓을 받아볼까요?','티켓을 모으면 게임을 즐길 수 있어요.','출석하러 가기','myland-feedback'],daily:['오늘의 게임을 모두 즐겼어요','오늘도 함께해 주셔서 고마워요.','내일 다시 새로운 행운에 도전해요.','마이랜드로','myland-feedback'],monthly:['이번 달 마일리지를 모두 받았어요','이번 달 보상 1,500 M 달성!','이후에는 티켓·배지 보상으로 참여해요.','확인','myland-feedback']}[kind];
 const illustration=kind==='ticket'?ticket():kind==='daily'?'<span class="md-sun" aria-hidden="true">☀</span>':coin();
 return scene(`<div class="md-limit-background" inert aria-hidden="true">${header('룰렛',kind==='ticket'?0:2)}${wheel()}</div><div class="md-shade"></div><section class="md-dialog md-limit" aria-label="${data[0]}">${close()}<div class="md-limit-icon">${illustration}</div><h2>${data[0]}</h2><p>${data[1]}<br>${data[2]}</p>${kind==='daily'?'<div class="md-limit-meter"><span>오늘 참여</span><b>6 / 6회</b></div>':kind==='monthly'?'<div class="md-limit-meter"><span>이번 달 획득</span><b>1,500 / 1,500 M</b></div>':wallet(0)}${link(data[3],data[4])}${kind==='ticket'?link('닫기','roulette-ready','md-text-link'):''}</section>`,'md-limit-screen');
}
export function renderMyLandDetailScreen(id){
 const renders={'attendance-daily':()=>attendance(false),'attendance-milestone':()=>attendance(true),'roulette-ready':()=>roulette(false),'roulette-spinning':()=>roulette(true),'roulette-result':()=>result(false),'roulette-odds':probabilities,'puzzle-ready':()=>puzzle(false),'puzzle-playing':()=>puzzle(true),'puzzle-result':()=>result(true),'limit-ticket':()=>limit('ticket'),'limit-daily':()=>limit('daily'),'limit-monthly':()=>limit('monthly')};
 if(!renders[id])throw new RangeError('Unknown MyLand detail: '+id);
 return renders[id]();
}
export function renderMyLandAttendanceFeedbackScreen(id){
 if(!['attendance-daily','attendance-milestone'].includes(id))throw new RangeError('Unknown attendance feedback: '+id);
 const milestone=id==='attendance-milestone';
 const art=milestone?'attendance-burst.png':'attendance-ticket.png';
 return `<div class="md-screen md-attendance-feedback">${mainBackdrop(milestone?7:6)}<div class="md-shade"></div><section class="md-dialog md-attendance-dialog" aria-label="출석 완료 · 피드백 반영본">${close()}${milestone?'<span class="md-attendance-pill">7일 연속 출석</span>':''}<img class="md-attendance-hero" src="/assets/gasong-feedback-20261023/${art}" alt="${milestone?'입체 티켓과 마일리지 코인 보상':'입체 OG 티켓 보상'}"><h2>${milestone?'꾸준함에 보상을 더해요':'출석 완료!'}</h2><p>${milestone?'일주일 동안 모은 출석, 선물이 도착했어요.':'6일 연속 출석했어요.'}</p><div class="md-attendance-rewards"><div class="md-attendance-reward"><span>OG 티켓</span><strong>${milestone?'3장':'1장'}</strong></div>${milestone?'<div class="md-attendance-reward"><span>마일리지</span><strong>50 M</strong></div>':''}</div><div class="md-next md-attendance-next"><span>다음 출석 보상</span><b>${milestone?'14일':'7일'} 연속 <span>${milestone?'티켓 5장 + 100 M':'티켓 3장 + 50 M'}</span></b></div><div class="md-attendance-actions">${attendanceAction('마이랜드로','myland-feedback','secondary')}${attendanceAction('바로 룰렛 돌리기','roulette-ready','primary')}</div></section></div>`;
}
function attendanceFeedbackFigure(id){
 return `<figure class="md-review-figure"><figcaption>가송님 피드백 반영본 · 10/23</figcaption><div class="md-review-host" data-myland-attendance-feedback="${id}"><template><link rel="stylesheet" href="/v2/myland-feedback.css"><link rel="stylesheet" href="/v2/myland-details.css"><link rel="stylesheet" href="/v2/components/button.css"><link rel="stylesheet" href="/v2/myland-attendance-feedback.css">${renderMyLandAttendanceFeedbackScreen(id)}</template></div><p>팝업의 곰 캐릭터를 덜고 입체 보상을 중심에 배치했습니다. 두 버튼은 가로로 구성하고 기존 OG 보라색을 적용했습니다.</p></figure>`;
}
const notes={
 'attendance-daily':'일반 출석: 티켓 1장. 6일 연속 출석한 경우를 예시로 구성했습니다.',
 'attendance-milestone':'7일 보상: 티켓 3장 + 50 M. 다음 14일 보상은 티켓 5장 + 100 M. 21·30일 보상 수치는 미정입니다.',
 'roulette-ready':'시작 전: 티켓 3장, 오늘 참여 0회 예시. 두 게임의 티켓 비용 차등 여부는 미확정입니다.',
 'roulette-spinning':'참여 후: 티켓 1장 차감, 잔여 2장. 회전 중 재참여 버튼은 비활성화합니다.',
 'roulette-result':'결과 예시: 20 M 획득. 실제 무작위 추첨·차감·지급은 동작하지 않습니다.',
 'roulette-odds':'확률은 기획서 표의 예시입니다. 운영 확률은 변경 가능하며, 적용 시점의 실제 확률을 표시해야 합니다.',
 'puzzle-ready':'60초 매치3 퍼즐. 최대 50 M는 기획서 검토용 수치이며, 주간 랭킹은 제외했습니다.',
 'puzzle-playing':'1,240점·42초 남은 플레이 예시. 과일은 목업용 벡터 심볼이며 드래그·타이머·점수 계산은 동작하지 않습니다.',
 'puzzle-result':'2,860점 → 35 M 예시. 점수별 보상표는 기획서에서도 확인 필요로 표시돼 있어 추가 확정이 필요합니다.',
 'limit-ticket':'티켓이 0장일 때의 안내. 출석으로 돌아가는 동선을 제안했습니다.',
 'limit-daily':'룰렛·퍼즐 합산 6회 한도 예시. 초기화 시각은 미확정이라 화면에 특정 시각을 넣지 않았습니다.',
 'limit-monthly':'월간 마일리지 한도 1,500 M 예시. 초과 후 티켓·배지 전환의 상세 지급 방식은 추가 확정이 필요합니다.'
};
export function renderMyLandDetailsReview(){
 return '<style>.md-review-grid{display:flex;flex-wrap:wrap;gap:32px;align-items:flex-start}.md-review-figure{margin:0;width:390px;max-width:100%;min-width:0}.md-review-figure figcaption{margin:0 0 12px;font-weight:700}.md-review-host{width:100%;overflow:clip}.md-review-note{max-width:780px;line-height:1.7;color:var(--v2-workspace-muted)}.md-review-figure>p{line-height:1.6;font-size:14px;color:var(--v2-workspace-muted)}.md-review-section{margin-bottom:40px}</style>'+myLandDetailGroups.flatMap(group=>group.items.map(({id,label})=>`<section id="${id}" data-review-screen class="md-review-section"><h2>${group.label} · ${label}</h2><p class="md-review-note">C안 확장 · 화면 검토용 시안입니다. 보상·확률·한도는 기획서 초안의 예시값이며 정책 확정 후 조정합니다.</p><div class="md-review-grid"><figure class="md-review-figure"><figcaption>${label} · 390 × 844</figcaption><div class="md-review-host" data-myland-detail="${id}"><template><link rel="stylesheet" href="/v2/myland-feedback.css"><link rel="stylesheet" href="/v2/myland-details.css">${renderMyLandDetailScreen(id)}</template></div><p>${notes[id]}</p>${id==='roulette-spinning'?link('결과 시안 보기 →','roulette-result','md-review-next'):id==='puzzle-playing'?link('결과 시안 보기 →','puzzle-result','md-review-next'):''}</figure>${id.startsWith('attendance-')?attendanceFeedbackFigure(id):''}</div></section>`)).join('');
}
export function setupMyLandDetails(root){
 for(const host of root.querySelectorAll('[data-myland-detail], [data-myland-attendance-feedback]')){
  if(host.shadowRoot)continue;
  const template=host.querySelector('template');
  const shadow=host.attachShadow({mode:'open'});
  shadow.append(template.content.cloneNode(true));template.remove();
  for(const anchor of shadow.querySelectorAll('.md-close'))anchor.setAttribute('aria-label','마이랜드로 닫기');
  shadow.addEventListener('click',event=>{
   const action=event.target.closest('[data-myland-destination]');
   if(action)window.location.hash=action.dataset.mylandDestination;
  });
  const screen=shadow.querySelector('.md-screen');
  const resize=()=>{const scale=Math.min(1,host.clientWidth/390);screen.style.zoom=scale;host.style.height=844*scale+'px';};
  new ResizeObserver(resize).observe(host);resize();
 }
}
