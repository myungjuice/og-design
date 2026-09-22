import {surface,badge,button} from '../../components/index.mjs';
import {appBar} from '../../components/app-shell/render.mjs';
import {escapeHTML as e,icon} from '../../components/core.mjs';
const labels={requested:'예약 요청',confirmed:'확정',cancelled:'매장 취소',selfCancelled:'취소',entered:'입장',noShow:'미방문',timeOver:'시간 경과'};
const reservationNotice=['예약 시간 10분 전에 매장에 도착해 주세요.','예약 시간을 초과하면 예약이 자동 취소될 수 있습니다.','예약 시간 임박한 예약 변경은 매장에 유선으로 확인하셔야 합니다.'];
const cancelNotice=['예약 임박 취소는 매장과 유선으로 연락 주세요.','취소 후 재예약은 즉시 가능합니다.','무단 노쇼 시 향후 예약에 제한이 있을 수 있습니다.'];
function steps(status){
 const current=status==='requested'?1:status==='confirmed'?2:status==='cancelled'?-1:0;
 return '<ol class="og-reservation-steps" aria-label="예약 진행">'+['예약 신청','확인 중','예약 확정'].map((label,i)=>'<li data-complete="'+(i<=current)+'"'+(i===current?' aria-current="step"':'')+'><span class="og-reservation-step-dot" aria-hidden="true">'+(i===current?icon('check'):'')+'</span><span>'+label+'</span></li>').join('')+'</ol>';
}
function notice(title,items,name){
 return surface({className:'og-reservation-notice',contentHTML:'<h3>'+icon(name)+e(title)+'</h3><ul>'+items.map(item=>'<li>'+e(item)+'</li>').join('')+'</ul>'});
}
export function reservationDetail({status='confirmed',isOld=false,storeName='회원점명',storePhone='02-000-0000',nickname='맑은 땅콩',phone='010-0000-0000'}={}){
 const active=status==='requested'||status==='confirmed';
 const label=active&&isOld?'시간 경과':labels[status]||status;
 const header=surface({className:'og-reservation-store',contentHTML:'<span class="og-reservation-store-icon">'+icon('store')+'</span><div><div class="og-reservation-store-title"><h3>'+e(storeName)+'</h3>'+badge({label,tone:active&&!isOld?'info':'neutral'})+'</div><span class="og-reservation-phone">'+icon('phone')+e(storePhone)+'</span></div>'});
 const fields=[['person','예약자',nickname],['phone','예약자 연락처',phone],['calendar_today','예약 일시','2026년 9월 18일 (금) 오후 6:00'],['people','예약 인원','성인 2명, 어린이 0명']];
 const info=surface({className:'og-reservation-info',contentHTML:'<h3>예약 내용</h3><dl>'+fields.map(([name,label,value])=>'<div>'+icon(name)+'<div><dt>'+e(label)+'</dt><dd>'+e(value)+'</dd></div></div>').join('')+'</dl>'});
 return '<section class="og-reservation-detail" inert aria-label="예약 상세 '+e(label)+'">'+appBar({title:'예약 상세',back:true})+'<div class="og-reservation-body">'+header+steps(status)+info+notice('예약 안내',reservationNotice,'info_outline')+notice('취소 안내',cancelNotice,'cancel')+'</div>'+(active?'<div class="og-reservation-actions">'+button({label:'예약 취소',variant:'secondary'})+button({label:'예약 변경'})+'</div>':'')+'</section>';
}
export function reservationDetailBoard(){
 return [['confirmed','확정'],['requested','예약 요청'],['cancelled','매장 취소']].map(([status,label],i)=>'<section class="'+(i?'history-empty-example':'')+'"><div class="screen-page-content"><div class="screen-artboard"><h3 class="history-state-label">'+label+'</h3>'+reservationDetail({status})+'</div><div class="screen-design-notes">'+(i===0?'<h3>예약 정보 먼저</h3><p>매장 연락처와 진행 단계 아래에 예약자·연락처·일시·인원을 모았습니다.</p><h3>안내와 버튼 구분</h3><p>예약 안내와 취소 안내는 옅은 배경으로 구분하고, 예약 변경·취소 버튼은 하단에 배치했습니다.</p>':i===1?'<h3>확인 중</h3><p>매장의 확인을 기다리는 단계입니다. 예약 요청 문구와 확인 중 단계를 함께 보여줍니다.</p>':'<h3>매장 취소</h3><p>취소된 상태에는 하단 변경·취소 버튼을 표시하지 않습니다.</p>')+'</div></div></section>').join('');
}
