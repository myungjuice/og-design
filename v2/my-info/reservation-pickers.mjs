import {reservationPicker} from '../../design-system/pages/my-info/reservation-pickers.mjs';
import {escapeHTML as e,uid} from '../../design-system/components/core.mjs';
import {renderDialog} from '../components/dialog.mjs';
import {renderQuantity} from '../components/quantity.mjs';
import {renderReservationChange} from './reservation-change.mjs';

const types=[['date','예약일 선택'],['time','시간 선택'],['empty','예약 가능한 시간이 없을 때'],['people','예약 인원']];
export function renderReservationPicker({id=uid('v2-reservation-picker'),type='date'}={}){
 if(!types.some(([key])=>key===type))throw new RangeError('Unknown reservation picker');
 // Source owns reservation dates, time availability, quantities and notices.
 const source=reservationPicker(type).match(/<div class="og-res-picker-overlay"><div class="og-dialog-panel"><h3 class="og-dialog-title">([^<]+)<\/h3>([\s\S]*?)<div class="og-dialog-actions">/);
 if(!source)throw new Error('Reservation picker source body is missing');
 const title=source[1];let body=source[2];
 body=body.replaceAll('<li>이린이 적용 기준은 매장마다 다를 수 있습니다.</li>','<li>어린이 적용 기준은 매장마다 다를 수 있습니다.</li>');
 body=body.replace('class="og-calendar"','class="og-calendar v2-calendar"')
  .replace(/aria-selected="([^"]+)"/g,'aria-pressed="$1"')
  .replace(/(<div class="og-calendar-week">[\s\S]*<\/div>)(<\/div>)$/,(_,days,end)=>'<div class="v2-calendar-days" role="region" aria-label="예약 달력" tabindex="0">'+days+'</div>'+end);
 if(type==='date')body+='<p class="v2-picker-legend">현재 예약일 · 9월 18일</p>';
 body=body.replace(/<div id="[^"]+" class="og-quantity"[^>]*>[\s\S]*?<\/div>/g,markup=>{
  const label=markup.match(/aria-label="([^"]+)"/)[1],value=Number(markup.match(/data-value="(\d+)"/)[1]),min=Number(markup.match(/data-min="(\d+)"/)[1]);
  const max=markup.match(/data-max="(\d+)"/);
  return renderQuantity({id:id+'-'+(label==='성인'?'adults':'children'),label,value,min,max:max?Number(max[1]):null})
   .replace('<span class="og-quantity-unit">개</span>','<span class="og-quantity-unit">명</span>');
 }).replaceAll('class="og-badge"','class="og-badge v2-badge"');
 const actions=[{label:'취소',variant:'secondary'},...(type==='people'?[{label:'확인'}]:[])];
 const dialog=renderDialog({id,title,body:'',actions}).replace(' inert','')
  .replace('class="v2-dialog-static"','class="v2-dialog-static v2-picker-dialog"')
  .replace(/<p class="og-dialog-body"[^>]*><\/p>/,()=>'<div class="v2-picker-body" role="region" aria-label="'+e(title)+' 내용 · 정적 시안" tabindex="0">'+body+'</div>');
 return ('<section class="v2-picker-frame" aria-label="'+e(title)+'"><div class="v2-picker-backdrop" inert aria-hidden="true">'+renderReservationChange({id:id+'-change'})+'</div><div class="v2-picker-overlay">'+dialog+'</div></section>')
  .replace(/<button(?! inert)\b/g,'<button inert');
}
const cssFiles=['button','icon-button','badges','surfaces','sheet','dialog','date-time','quantity'].map(name=>'/v2/components/'+name+'.css')
 .concat('/v2/my-info/reservation-detail.css','/v2/my-info/reservation-change.css','/v2/my-info/reservation-pickers.css');
export function renderReservationPickersReview(){
 return '<section id="reservation-pickers" data-review-screen aria-labelledby="reservation-pickers-title" hidden><h2 id="reservation-pickers-title">예약 날짜·시간·인원 선택</h2><p class="v2-intro">예약 변경에서 날짜와 가능한 시간을 고르고, 성인·어린이 인원을 조절하는 팝업입니다.</p><div class="v2-reservation-review-grid v2-picker-review-grid">'+types.map(([type,title])=>'<figure class="v2-reservation-review-sample" data-reservation-picker="'+type+'"><figcaption>'+e(title)+'</figcaption><div class="v2-picker-history-host"><template>'+cssFiles.map(href=>'<link rel="stylesheet" href="'+href+'">').join('')+renderReservationPicker({id:'v2-picker-'+type,type})+'</template></div></figure>').join('')+'</div><p class="v2-intro">날짜·시간은 원본의 즉시 선택 구성을 유지하고 인원에만 확인 버튼을 둡니다. 예약 가능 여부와 수치는 검토용 예시이며 실제 선택·조회·예약 변경은 실행되지 않습니다.</p></section>';
}
export function setupReservationPickersReview(root){
 for(const host of root.querySelectorAll('.v2-picker-history-host')){
  if(host.shadowRoot)continue;
  const template=host.querySelector('template');host.attachShadow({mode:'open'}).append(template.content.cloneNode(true));template.remove();
 }
}
