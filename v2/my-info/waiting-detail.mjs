import {waitingDetail} from '../../design-system/pages/my-info/waiting-detail.mjs';
import {escapeHTML as e,icon,uid} from '../../design-system/components/core.mjs';
import {renderBadge} from '../components/badges.mjs';

const shapes={
 arrow_back:'<path d="m14 5-7 7 7 7M7 12h14"/>',
 refresh:'<path d="M20 7v5h-5M4 17v-5h5M6 7a7 7 0 0 1 12-2l2 2M4 17l2 2a7 7 0 0 0 12-2"/>',
 store:'<path d="M4 10v10h16V10M9 20v-7h6v7M3 10l2-7h14l2 7"/><path d="M3 10c0 3 4 3 4 0 0 3 5 3 5 0 0 3 5 3 5 0 0 3 4 3 4 0"/>',
 phone:'<path d="m6 3 4 4-2 3a15 15 0 0 0 6 6l3-2 4 4-2 3C10 22 2 14 3 5Z"/>',
 people:'<circle cx="9" cy="8" r="3"/><path d="M3 21v-2a6 6 0 0 1 12 0v2m0-16a3 3 0 0 1 0 6m3 4a6 6 0 0 1 3 5v1"/>',
 child_care:'<circle cx="12" cy="12" r="8"/><path d="M10 4q0-3 3-2M8 10v.1m8-.1v.1m-7 5q3 3 6 0"/>',
 info_outline:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.1"/>',
 cancel:'<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6m0-6-6 6"/>'
};
const art=name=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+shapes[name]+'</svg>';
export function renderWaitingDetail({id=uid('v2-waiting'),storeName='오시 망원본점',...fields}={}){
 // Original owns fields/actions; correct the child-guidance typo only in v2.
 let html=waitingDetail({storeName,...fields})
  .replaceAll('<li>이린이 적용 기준은 매장마다 다를 수 있습니다.</li>','<li>어린이 적용 기준은 매장마다 다를 수 있습니다.</li>')
  .replace('class="og-reservation-detail og-wait-detail" inert','class="og-reservation-detail og-wait-detail v2-reservation-detail v2-wait-detail"')
  .replace('<h2>웨이팅 현황</h2>','<h2 id="'+e(id)+'-title">웨이팅 현황</h2>')
  .replace('class="og-reservation-body"','class="og-reservation-body" role="region" aria-label="웨이팅 현황 내용 · 정적 시안" tabindex="0"')
  .replace(/class="og-surface (og-reservation-(?:store|notice)|og-wait-ticket)"/g,(_,name)=>'class="og-surface v2-surface '+name+'" data-depth="'+(name==='og-reservation-notice'?'inset':'raised')+'"')
  .replace(/<span class="og-badge" data-tone="([^"]+)" data-size="small">([^<]+)<\/span>/g,(_,tone,label)=>renderBadge({tone,label}))
  .replace(/class="og-button"/g,'class="og-button v2-button"')
  .replace(/class="og-icon-button"/g,'class="og-icon-button v2-icon-button" data-face="plain"');
 for(const name of Object.keys(shapes))html=html.replaceAll(icon(name),art(name));
 return html.replace(/<button\b/g,'<button inert');
}
const cssFiles=['button','icon-button','badges','surfaces'].map(name=>'/v2/components/'+name+'.css').concat('/v2/my-info/reservation-detail.css','/v2/my-info/waiting-detail.css');
export function renderWaitingDetailReview(){
 return '<section id="waiting-detail" data-review-screen aria-labelledby="waiting-detail-title" hidden><h2 id="waiting-detail-title">웨이팅 상세</h2><p class="v2-intro">웨이팅 번호와 현재 순서, 신청 인원·시간 및 매장 안내를 확인하는 화면입니다.</p><div class="v2-reservation-review-grid v2-waiting-review-grid"><figure class="v2-reservation-review-sample"><figcaption>웨이팅 중</figcaption><div class="v2-waiting-history-host"><template>'+cssFiles.map(href=>'<link rel="stylesheet" href="'+href+'">').join('')+renderWaitingDetail({id:'v2-waiting-main'})+'</template></div></figure></div><p class="v2-intro">번호·순서·인원은 검토용 예시입니다. 안내는 본문을 스크롤해 확인하며 뒤로가기·새로고침·전화·웨이팅 취소·인원 변경은 실행되지 않습니다.</p></section>';
}
export function setupWaitingDetailReview(root){
 for(const host of root.querySelectorAll('.v2-waiting-history-host')){
  if(host.shadowRoot)continue;
  const template=host.querySelector('template');host.attachShadow({mode:'open'}).append(template.content.cloneNode(true));template.remove();
 }
}
