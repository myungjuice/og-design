import {scene,hero,art,badge,pills,action,reward,sectionTitle,steps,terms} from './details-shared.mjs';
const data={
 automatic:{title:'첫 적립의 설렘,<br>보너스로 한 번 더',tag:'적립형',art:'b5b7b.png',name:'첫 적립 보너스 이벤트',bonus:'1,000 M',status:'자동 참여 중',hint:'회원점에서 적립하면 자동으로 참여돼요.',steps:[['회원점에서 결제해요','오지고랜드 회원점을 이용해 주세요.'],['마일리지를 적립해요','기본 적립과 이벤트 보너스를 구분해서 확인해요.'],['이벤트 혜택을 받아요','지급 일정은 이벤트 안내에서 확인해요.']]},
 draw:{title:'이번 행운의 주인공은<br>누가 될까요?',tag:'응모형',art:'c528d.png',name:'행운의 마일리지 추첨',bonus:'500 M',status:'한 번 눌러 간편하게 응모',hint:'이벤트 내용을 확인하고 참여해 주세요.',steps:[['이벤트 내용을 확인해요','참여 기간과 당첨 혜택을 확인해 주세요.'],['응모하기를 눌러요','참여 여부는 이 화면에서 확인해요.'],['당첨 결과를 기다려요','결과는 이벤트 안내에서 확인할 수 있어요.']]},
 visit:{title:'우리 동네 회원점에서<br>새로운 발견',tag:'방문형',art:'ca749.png',name:'우리 동네 방문 이벤트',bonus:'500 M',status:'매장에 도착하셨나요?',hint:'참여 매장에서 방문을 인증해 주세요.',steps:[['참여 매장을 찾아요','이벤트에 참여하는 회원점을 확인해요.'],['매장에서 방문을 인증해요','위치 확인 또는 안내된 방법으로 인증해요.'],['이벤트 혜택을 확인해요','인증 후 참여 내역에서 확인할 수 있어요.']]}
};
function eventCard(event,index){return `<article class="pd-event-card"><div class="pd-event-cover pd-event-cover-${index}"><div class="pd-card-tags">${badge('공식')}${badge(event.tag,'neutral')}</div>${art(event.art,'pd-event-cover-art')}<strong>${event.title}</strong><span class="pd-d-day">D-${12-index*3}</span></div><div class="pd-event-summary"><h3>${event.name}</h3><p>10.01 ~ 10.31</p><div><b>보너스 ${event.bonus}</b><span>${index===0?'자동 참여':'참여하기'} ›</span></div></div></article>`;}
export function renderOfficialEventList(){
 return scene({title:'이벤트',navigation:true,body:`<div class="pd-page-intro"><span class="pd-kicker">오지고랜드 공식 이벤트</span><h1>일상에 더해지는<br>작은 즐거움</h1><p>회원점에서 만나는 다양한 혜택을 확인해요.</p></div>${pills(['전체','진행 중','마감 임박','종료'],'전체')}<div class="pd-event-list">${Object.values(data).map(eventCard).join('')}</div>`});
}
export function renderOfficialEventDetail(state='automatic'){
 if(!['automatic','draw','visit','closed'].includes(state))throw new RangeError('Unsupported event state');
 const closed=state==='closed',event=data[closed?'automatic':state];
 const status=closed?'<div class="pd-participation pd-muted"><strong>이벤트가 종료되었어요</strong><p>다음 이벤트에서 다시 만나요.</p></div>':`<div class="pd-participation"><span class="pd-check">✓</span><div><strong>${event.status}</strong><p>${event.hint}</p></div></div>`;
 const benefits=state==='automatic'||closed?`<div class="pd-benefit-split">${reward('기본 적립','결제금액 3%')}<span>+</span>${reward('이벤트 보너스',event.bonus)}</div><p class="pd-note">기본 적립률은 그대로, 이벤트 혜택은 별도로 지급돼요.</p>`:`<div class="pd-benefit-single">${reward('이벤트 혜택',event.bonus)}</div>`;
 return scene({title:'이벤트',className:'pd-event-detail',body:`${hero('공식 · '+event.tag,event.title,'10.01 ~ 10.31',event.art)}${status}<section class="pd-section">${sectionTitle('이벤트 혜택')}${benefits}</section><section class="pd-section">${sectionTitle('이렇게 참여해요')}${steps(event.steps)}</section>${terms(['이벤트별 참여 대상과 혜택을 확인해 주세요.','참여 기간과 지급 일정은 이벤트 안내를 따라요.'])}`,footer:action(closed?'종료된 이벤트':state==='automatic'?'가까운 회원점 찾기':state==='draw'?'응모하기':'방문 인증하기',{disabled:closed})});
}
