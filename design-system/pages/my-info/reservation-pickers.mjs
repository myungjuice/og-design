import {calendar} from '../../components/date-time/render.mjs?v=20260918-pickers';
import {peopleDialog} from './people-dialog.mjs';
import {dialog} from '../../components/dialog/render.mjs?v=20260918-pickers';
import {badge} from '../../components/index.mjs';
import {reservationChange} from './reservation-change.mjs';
import {escapeHTML as e} from '../../components/core.mjs';
const slots=[['오후 02:00','브레이크 타임'],['오후 04:00','예약 불가'],['오후 05:00','내 다른 예약'],['오후 06:00','현재 예약'],['오후 06:30','예약 가능'],['오후 07:00','예약 가능'],['오후 08:00','마감 임박']];
export function reservationPicker(type='date'){
 let title,body,actions=[{label:'취소',variant:'secondary'}];
 if(type==='date'){
 title='예약일 선택';body=calendar({year:2026,month:9,today:18,reserved:18,previousDisabled:true,disabled:[...Array.from({length:17},(_,i)=>i+1),21,28],showSummary:false,showActions:false});
 }else if(type==='people'){
 title='예약 인원';
 }else{
 title='시간 선택';body='<p class="og-res-date">2026-09-18 (금요일)</p><div class="og-res-slot-head"><span>시간</span><span>상태</span></div>'+(type==='empty'?'<p class="og-res-no-slots">예약 가능한 시간이 없습니다.</p>':'<div class="og-res-slots">'+slots.map(([time,status])=>'<div class="og-res-slot" data-available="'+(status==='예약 가능')+'" data-reserved="'+(status==='현재 예약')+'"><span>'+time+'</span>'+badge({label:status,tone:status==='예약 가능'?'info':status==='현재 예약'||status==='내 다른 예약'?'warning':'neutral'})+'</div>').join('')+'</div>');
 }
 return '<section class="og-res-picker-screen" inert aria-label="'+title+'"><div class="og-res-picker-backdrop" aria-hidden="true">'+reservationChange()+'</div><div class="og-res-picker-overlay">'+(type==='people'?peopleDialog():dialog({title,bodyHTML:body,actions}))+'</div></section>';
}
export function reservationPickerBoard(){
 return [['date','예약일 선택','예약 가능한 날짜와 현재 예약일을 구분했습니다. 날짜를 고르면 시간 목록으로 이어집니다.'],['time','시간 선택','시간과 상태를 나란히 정렬했습니다. 현재 예약·내 다른 예약·예약 가능 여부를 문구로 구분합니다.'],['empty','예약 가능한 시간이 없을 때','빈 목록에는 안내 문구만 표시합니다.'],['people','예약 인원','성인과 어린이를 따로 조절하고, 아래에서 안내와 확인 버튼을 볼 수 있습니다.']].map(([type,title,note])=>'<section id="review-reservation-'+type+'" class="history-empty-example"><div class="screen-page-content"><div class="screen-artboard"><h3 class="history-state-label">'+title+' '+badge({label:'New',tone:'info'})+'</h3>'+reservationPicker(type)+'</div><div class="screen-design-notes"><h3>'+title+'</h3><p>'+note+'</p></div></div></section>').join('');
}
