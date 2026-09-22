import {surface,button} from '../../components/index.mjs';
import {bottomSheet} from '../../components/sheet/render.mjs?v=20260918-change';
import {icon} from '../../components/core.mjs';
import {reservationDetail} from './reservation-detail.mjs';
export function reservationChange({changed=false}={}){
 const summary=surface({className:'og-change-summary',depth:'flat',contentHTML:'<h3>현재 예약 정보:</h3><p>'+icon('calendar_today')+'<span>2026년 9월 18일 (금요일)</span></p><p>'+icon('access_time')+'<span>오후 06:00</span></p><p>'+icon('people')+'<span>성인: 2명, 어린이: 0명</span></p>'});
 const row=(name,label,value)=>'<div class="og-change-row"><span class="og-change-label">'+icon(name)+label+'</span>'+button({label:value,variant:'secondary',className:changed?'og-change-value is-changed':'og-change-value'})+'</div>';
 const body=summary+row('access_time','예약시간 선택:',changed?'9월 19일 오후 06:30':'9월 18일 오후 06:00')+'<div class="og-change-row"><span class="og-change-label">'+icon('people')+'인원 선택:</span>'+button({variant:'secondary',className:changed?'og-change-value is-changed':'og-change-value',iconHTML:'<span>'+(changed?'3':'2')+'명</span>'+icon('child_care')+'<span>0명</span>',attributes:{'aria-label':changed?'성인 3명, 어린이 0명':'성인 2명, 어린이 0명'}})+'</div>';
 return '<section class="og-change-screen" inert aria-label="예약 변경 '+(changed?'변경 후':'변경 전')+'"><div class="og-change-backdrop" aria-hidden="true">'+reservationDetail()+'</div><div class="og-change-scrim"></div>'+bottomSheet({title:'예약 변경',bodyHTML:body,actions:[{label:'변경 취소',variant:'secondary'},{label:'변경',disabled:!changed}]})+'</section>';
}
export function reservationChangeBoard(){
 return [false,true].map((changed,i)=>'<section class="'+(i?'history-empty-example':'')+'"><div class="screen-page-content"><div class="screen-artboard"><h3 class="history-state-label">'+(changed?'날짜·시간·인원 변경 후':'처음 열었을 때')+'</h3>'+reservationChange({changed})+'</div><div class="screen-design-notes">'+(changed?'<h3>바꾼 값 강조</h3><p>바꾼 날짜·시간과 인원에 연한 블루 배경을 적용했습니다. 아래 변경 버튼도 함께 활성화됩니다.</p>':'<h3>현재 예약과 선택 구분</h3><p>현재 예약은 옅은 배경에 모으고, 바꿀 항목은 버튼으로 구분했습니다.</p><h3>예약 상세 위에 열리는 시트</h3><p>뒤 화면은 어둡게 낮추고, 아래에 변경 취소와 변경 버튼을 나란히 배치했습니다.</p>')+'</div></div></section>').join('');
}
