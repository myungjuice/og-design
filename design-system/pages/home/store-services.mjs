import {storeScreen} from './store.mjs';
import {escapeHTML as e,icon} from '../../components/core.mjs';
import {button,iconButton} from '../../components/button/render.mjs';
import {surface} from '../../components/surfaces/render.mjs';
import {sectionHeading} from '../../components/section-heading/render.mjs';
const card=(content,kind='calendar_month',refresh=false)=>surface({className:'og-store-service-card',contentHTML:'<span class="og-store-service-icon">'+icon(kind)+'</span><div class="og-store-service-copy">'+content+'</div>'+(refresh?iconButton({name:'refresh',label:'새로고침'}):'')});
export function reservationSection({open=true,current=false,count=1,expired=false}={}){
 const heading=sectionHeading({title:'예약',action:'내역 보기',description:current&&count>1?'이 매장에 예약이 '+count+'건 있습니다.':''});
 const notice=!open?card('<p>현재 예약 접수가 일시적으로 중지되었습니다. 자세한 사항은 매장에 문의하세요.</p>'):'';
 const currentCard=card((expired?'<p class="og-store-service-expired">예약 시간 경과</p>':'')+'<p><strong>예약일: 2026년 9월 '+(expired?'18일(금)':'22일(화)')+' 18:00</strong></p><p>성인: 2명, 어린이: 0명</p>','event_available');
 const dates='<div class="og-store-service-dates">'+['9/19(토)','9/20(일)','9/21(월)','9/22(화)','9/23(수)'].map((date,i)=>'<div class="og-store-service-date" data-available="'+(i!==2)+'"><strong>'+date+'</strong><span>'+(i===2?'예약불가':'예약가능')+'</span></div>').join('')+'</div>';
 const content=current?currentCard+'<div class="og-store-service-actions">'+button({label:'내 예약 보기',variant:'secondary'})+(open?iconButton({name:'add',label:'추가 예약',className:'og-store-service-add'}):'')+'</div>':open?dates+button({label:'다른 날짜 예약'}):'';
 return '<section class="og-store-service" data-service="reservation">'+heading+notice+content+'</section>';
}
export function waitingSection({open=true,current=false,info=true,estimate=20,status=''}={}){
 let content='';
 if(current)content=card('<div class="og-store-service-ticket"><strong>대기번호 <em>12</em>번</strong><strong>내 순서 <em>3</em>번째</strong></div><p>성인: 2명, 어린이: 0명</p>','people_alt',true)+button({label:'웨이팅 실시간 보기',variant:'secondary'});
 else if(!info)content=card('<p>매장의 웨이팅정보가 없습니다.</p>'+(status?'<p class="og-store-service-sub">입구에서 직원에게 문의해주세요.</p>':''),'people_alt',true);
 else if(!open)content=card('<p>현재 웨이팅 상태가 아닙니다.</p>'+(status?'<p class="og-store-service-sub">'+e(status)+'</p>':''),'people_alt',true);
 else content=card('<div class="og-store-service-total"><span>현재 웨이팅</span><strong>5 <small>팀</small></strong></div>'+(estimate!==null?'<p class="og-store-service-sub">예상 대기 시간: '+e(estimate)+'분</p>':''),'people_alt',true)+button({label:'웨이팅 등록'});
 return '<section class="og-store-service" data-service="waiting">'+sectionHeading({title:'웨이팅',action:'내역 보기'})+content+'</section>';
}
export function serviceScreen(kind,props={},store={}){
 return storeScreen({...store,reserve:kind==='reservation',wait:kind==='waiting',selectedSection:1,contentHTML:kind==='reservation'?reservationSection(props):waitingSection(props)});
}
export function serviceBoard(kind,{store}={}){
 const examples=kind==='reservation'?[
 ['예약 접수 중',{}],['기존 예약이 있을 때',{current:true}],['예약 접수 중지',{open:false}],['접수 중지 · 기존 예약 있음',{open:false,current:true}],['예약 시간 경과 · 예약 두 건',{current:true,count:2,expired:true}]
 ]:[['웨이팅 접수 중',{}],['예상 대기 시간이 없을 때',{estimate:null}],['내 웨이팅이 있을 때',{current:true}],['웨이팅 접수 중지',{open:false}],['웨이팅 정보가 없을 때',{info:false,status:'known'}]];
 return '<div class="screen-page-content"><div>'+examples.map(([label,props])=>'<section class="screen-state-example"><h3>'+(store?'상태 예시 · ':'')+label+'</h3><div class="screen-artboard">'+serviceScreen(kind,props,store)+'</div></section>').join('')+'</div><div class="screen-design-notes"><h3>접수와 내역 구분</h3><p>접수 버튼은 카드 아래에, 내역 보기는 제목 오른쪽에 배치합니다.</p><h3>정보 강조</h3><p>날짜와 대기 숫자는 굵게 표시하고, 안내 문구는 같은 카드 안에서 정리합니다.</p><h3>같은 깊이</h3><p>기존 카드와 같은 모서리와 부드러운 그림자를 사용합니다.</p></div></div>';
}
export const servicePrompt='기존 매장 상세 예약·웨이팅 영역을 첨부 캡처와 CSS로 구현하세요. lib/0_pages/01_home/shop_panel_items/shop_contents.dart, store_reservation_widget.dart, store_waiting_widget.dart 기준으로 기능·문구를 유지하고 스타일만 적용합니다. reservationActivated/waitingActivated가 Y일 때 각각 섹션과 탐색항목을 표시합니다. 둘다 활성화면 예약/웨이팅 탐색 하나 아래에 예약부터 웨이팅 순서입니다. 예약: reservationOpenStatus=open 여부와 activeReservationStore 첫 항목을 사용합니다. 예약있음이면 날짜선택 대신 예약일·인원·내 예약 보기, 접수열림일 때만 +추가예약을 표시합니다. 접수중지 안내는 기존예약 위에도 표시합니다. 예약건수 안내는 1보다 클 때만, 예약 시간 경과는 시간이 지났을 때만 표시합니다. 예약없음+접수열림이면 오늘부터31일 가로 날짜(시간표상 가능/불가)와 다른 날짜 예약을 표시합니다. 날짜선택은 시간→인원, 다른 날짜 예약은 DateSelectDialog→시간→인원입니다. 캔버스 날짜는 보이는 구간 예시이며 5일 제한이 아닙니다. 웨이팅: 내웨이팅을 우선표시하고 대기번호와 내순서를 구분합니다. 없으면 정보없음→접수중지/브레이크준비/마감준비→접수가능 순서입니다. 예상 대기 시간은 null이면 생략합니다. 새로고침·웨이팅 등록·웨이팅 실시간 보기 문구와 연결을 유지합니다. 예약 내역은 기존 ReservationHistory(매장필터없음), 웨이팅 내역은 WaitingHistory(storeNo)입니다. 이 시안은 본문 영역이며 이전/이후 섹션을 삭제하지 않습니다. 공통 storeScreen/sectionHeading/surface/button/iconButton을 재사용하고 기존 날짜시간·인원선택 시안과 상세시안을 참고하세요. 실제 네트워크·등록·새로고침·날짜조작은 정적 캔버스에 구현하지 않습니다. 렌더러 design-system/pages/home/store-services.mjs, CSS store-services.css.';
