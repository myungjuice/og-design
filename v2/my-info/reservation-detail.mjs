import {reservationDetail} from '../../design-system/pages/my-info/reservation-detail.mjs';
import {escapeHTML as e,icon,uid} from '../../design-system/components/core.mjs';
import {renderBadge} from '../components/badges.mjs';

const labels={confirmed:'확정',requested:'예약 요청',cancelled:'매장 취소',selfCancelled:'취소',entered:'입장',noShow:'미방문',timeOver:'시간 경과'};
// Same 20px, 1.75px stroke family as existing v2 information/back controls.
const shapes={
 arrow_back:'<path d="m14 5-7 7 7 7M7 12h14"/>',
 store:'<path d="M4 10v10h16V10M9 20v-7h6v7M3 10l2-7h14l2 7"/><path d="M3 10c0 3 4 3 4 0 0 3 5 3 5 0 0 3 5 3 5 0 0 3 4 3 4 0"/>',
 phone:'<path d="m6 3 4 4-2 3a15 15 0 0 0 6 6l3-2 4 4-2 3C10 22 2 14 3 5Z"/>',
 person:'<circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
 calendar_today:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18"/>',
 people:'<circle cx="9" cy="8" r="3"/><path d="M3 21v-2a6 6 0 0 1 12 0v2m0-16a3 3 0 0 1 0 6m3 4a6 6 0 0 1 3 5v1"/>',
 info_outline:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.1"/>',
 cancel:'<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6m0-6-6 6"/>',
 check:'<path d="m5 12 4 4L19 6"/>'
};
const art=name=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+shapes[name]+'</svg>';
export function renderReservationDetail({id=uid('v2-reservation'),status='confirmed',isOld=false,storeName='오시 망원본점',...fields}={}){
 if(!Object.hasOwn(labels,status))throw new RangeError('Unknown reservation status');
 if(typeof isOld!=='boolean')throw new TypeError('Elapsed reservation state must be boolean');
 // Source owns fields/actions; v2 shows progress only for live reservations.
 let html=reservationDetail({status,isOld,storeName,...fields})
  .replace('class="og-reservation-detail" inert','class="og-reservation-detail v2-reservation-detail"')
  .replace('<h2>예약 상세</h2>','<h2 id="'+e(id)+'-title">예약 상세</h2>')
  .replace('class="og-reservation-body"','class="og-reservation-body" role="region" aria-label="예약 상세 내용 · 정적 시안" tabindex="0"')
  .replace(/class="og-surface (og-reservation-(store|info|notice))"/g,(_,name,kind)=>'class="og-surface v2-surface '+name+'" data-depth="'+({store:'raised',info:'flat',notice:'inset'}[kind])+'"')
  .replace(/<span class="og-badge" data-tone="([^"]+)" data-size="small">([^<]+)<\/span>/g,(_,tone,label)=>renderBadge({tone,label}))
  .replace(/class="og-button"/g,'class="og-button v2-button"')
  .replace(/class="og-icon-button"/g,'class="og-icon-button v2-icon-button" data-face="plain"');
 if(isOld||!['confirmed','requested'].includes(status))html=html.replace(/<ol class="og-reservation-steps"[^>]*>[\s\S]*?<\/ol>/,'');
 for(const name of Object.keys(shapes))html=html.replaceAll(icon(name),art(name));
 return html.replace(/<button\b/g,'<button inert');
}
const cssFiles=['button','icon-button','badges','surfaces'].map(name=>'/v2/components/'+name+'.css').concat('/v2/my-info/reservation-detail.css');
const sample=(key,title,options={})=>'<figure class="v2-reservation-review-sample" data-reservation-state="'+key+'"><figcaption>'+e(title)+'</figcaption><div class="v2-reservation-history-host"><template>'+cssFiles.map(href=>'<link rel="stylesheet" href="'+href+'">').join('')+renderReservationDetail({id:'v2-reservation-'+key,...options})+'</template></div></figure>';
export function renderReservationDetailReview(){
 return '<section id="reservation-detail" data-review-screen aria-labelledby="reservation-detail-title" hidden><h2 id="reservation-detail-title">예약 상세</h2><p class="v2-intro">매장 연락처, 예약 진행 상태와 예약자·일시·인원을 확인하는 화면입니다.</p><div class="v2-reservation-review-grid">'+['confirmed','requested','cancelled'].map(status=>sample(status,labels[status],{status})).join('')+'</div><p class="v2-intro">예약·취소 안내는 본문을 스크롤해 확인합니다. 정보는 배치 확인용 예시이며 뒤로가기·예약 변경·취소·전화 연결은 실행되지 않습니다.</p><details class="v2-reservation-extra"><summary>취소·입장·미방문·시간 경과 비교</summary><div class="v2-reservation-review-grid">'+['selfCancelled','entered','noShow','timeOver'].map(status=>sample(status,labels[status],{status})).join('')+['confirmed','requested'].map(status=>sample('old-'+status,labels[status]+' · 시간 경과',{status,isOld:true})).join('')+'</div><p class="v2-intro">종료·시간 경과 상태는 진행 단계 없이 상태 라벨로 구분합니다. 시간이 경과한 확정·예약 요청의 버튼 표시는 원본 조건을 유지하며 실제 서비스 조건은 별도 검토가 필요합니다.</p></details></section>';
}
export function setupReservationDetailReview(root){
 const section=root.querySelector('#reservation-detail');if(!section||section.dataset.reservationReady)return;
 const mount=scope=>{for(const host of scope.querySelectorAll('.v2-reservation-history-host')){
  if(host.shadowRoot)continue;
  const template=host.querySelector('template');host.attachShadow({mode:'open'}).append(template.content.cloneNode(true));template.remove();
 }};
 section.dataset.reservationReady='true';mount(section.querySelector('.v2-reservation-review-grid'));
 for(const details of section.querySelectorAll('.v2-reservation-extra')){
  if(details.open)mount(details);
  details.addEventListener('toggle',()=>{if(details.open)mount(details);});
 }
}
