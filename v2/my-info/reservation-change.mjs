import {reservationChange} from '../../design-system/pages/my-info/reservation-change.mjs';
import {escapeHTML as e,icon,uid} from '../../design-system/components/core.mjs';
import {renderSheet} from '../components/sheet.mjs';
import {renderReservationDetail} from './reservation-detail.mjs';

const shapes={
 calendar_today:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18"/>',
 access_time:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 people:'<circle cx="9" cy="8" r="3"/><path d="M3 21v-2a6 6 0 0 1 12 0v2m0-16a3 3 0 0 1 0 6m3 4a6 6 0 0 1 3 5v1"/>',
 child_care:'<circle cx="12" cy="12" r="8"/><path d="M10 4q0-3 3-2M8 10v.1m8-.1v.1m-7 5q3 3 6 0"/>'
};
const art=name=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+shapes[name]+'</svg>';
export function renderReservationChange({id=uid('v2-reservation-change'),changed=false}={}){
 if(typeof changed!=='boolean')throw new TypeError('Reservation change state must be boolean');
 // Read original selection/summary markup; shared v2 renderer owns sheet geometry.
 const body=reservationChange({changed}).match(/<div class="og-sheet-body">([\s\S]*?)<\/div><div class="og-sheet-footer">/);
 if(!body)throw new Error('Reservation change source sheet body is missing');
 let content=body[1].replace('class="og-surface og-change-summary"','class="og-surface v2-surface og-change-summary"')
  .replaceAll('class="og-button','class="og-button v2-button');
 for(const name of Object.keys(shapes))content=content.replaceAll(icon(name),art(name));
 const sheet=renderSheet({id,title:'예약 변경',bodyHTML:content,actions:[
  {label:'변경 취소',variant:'secondary',className:'v2-button'},
  {label:'변경',disabled:!changed,className:'v2-button'}
 ]}).replace('class="v2-sheet-static" inert','class="v2-sheet-static"')
  .replace('class="og-sheet-body"','class="og-sheet-body" role="region" aria-label="예약 변경 내용 · 정적 시안" tabindex="0"');
 return ('<section class="v2-change-frame" aria-label="예약 변경 '+(changed?'변경 후':'변경 전')+'"><div class="v2-change-backdrop" inert aria-hidden="true">'+renderReservationDetail({id:id+'-detail'})+'</div><div class="v2-change-scrim" aria-hidden="true"></div>'+sheet+'</section>')
  .replace(/<button(?! inert)\b/g,'<button inert');
}
const cssFiles=['button','icon-button','badges','surfaces','sheet'].map(name=>'/v2/components/'+name+'.css').concat('/v2/my-info/reservation-detail.css','/v2/my-info/reservation-change.css');
const sample=(changed)=>'<figure class="v2-reservation-review-sample" data-change-state="'+(changed?'changed':'initial')+'"><figcaption>'+e(changed?'날짜·시간·인원 변경 후':'처음 열었을 때')+'</figcaption><div class="v2-change-history-host"><template>'+cssFiles.map(href=>'<link rel="stylesheet" href="'+href+'">').join('')+renderReservationChange({id:'v2-change-'+(changed?'changed':'initial'),changed})+'</template></div></figure>';
export function renderReservationChangeReview(){
 return '<section id="reservation-change" data-review-screen aria-labelledby="reservation-change-title" hidden><h2 id="reservation-change-title">예약 변경</h2><p class="v2-intro">현재 예약을 확인하고 바꿀 날짜·시간과 인원을 선택하는 화면입니다.</p><div class="v2-reservation-review-grid v2-change-review-grid">'+[false,true].map(sample).join('')+'</div><p class="v2-intro">변경 전후를 나란히 보여주는 정적 시안입니다. 원본처럼 값을 바꾸기 전에는 변경 버튼을 비활성으로 표시합니다. 날짜·시간·인원 선택 팝업은 아래에서 함께 확인할 수 있으며 실제 선택·변경·취소·닫기는 실행되지 않습니다.</p></section>';
}
export function setupReservationChangeReview(root){
 for(const host of root.querySelectorAll('.v2-change-history-host')){
  if(host.shadowRoot)continue;
  const template=host.querySelector('template');host.attachShadow({mode:'open'}).append(template.content.cloneNode(true));template.remove();
 }
}
