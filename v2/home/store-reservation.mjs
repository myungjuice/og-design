import {reservationSection} from '../../design-system/pages/home/store-services.mjs';
import {sectionHeading} from '../../design-system/components/section-heading/render.mjs';
import {escapeHTML as e,icon,uid} from '../../design-system/components/core.mjs';
import {renderSectionHeading} from '../components/section-heading.mjs';
import {setupMedia} from '../components/media.mjs';
import {renderHomeStoreContent} from './store.mjs';
import {renderDialog} from '../components/dialog.mjs';

const states=[
 ['open','예약 접수 중',{}],
 ['current','기존 예약이 있을 때',{current:true}],
 ['closed','예약 접수 중지',{open:false}],
 ['closed-current','접수 중지 · 기존 예약 있음',{open:false,current:true}],
 ['expired-multiple','예약 시간 경과 · 예약 두 건',{current:true,count:2,expired:true}],
 ['no-show-limit','미방문(노쇼) 누적 안내 · 표시 예시',{}]
];
const paths={calendar_month:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18M7 15h2m3 0h2m3 0h1M7 18h2m3 0h2"/>',event_available:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18m-11 5 2 2 4-4"/>',add:'<path d="M12 5v14M5 12h14"/>'};
const art=name=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+paths[name]+'</svg>';
export function renderHomeStoreReservationSection({open=true,current=false,count=1,expired=false}={}){
 const headingProps={title:'예약',action:'내역 보기',description:current&&count>1?'이 매장에 예약이 '+count+'건 있습니다.':''};
 let html=reservationSection({open,current,count,expired})
  .replace('class="og-store-service"','class="og-store-service v2-store-reservation"')
  .replace(sectionHeading(headingProps),()=>renderSectionHeading(headingProps))
  .replace(/<h3>/g,'<h4>').replace(/<\/h3>/g,'</h4>')
  .replace(/class="og-surface og-store-service-card"/g,'class="og-surface v2-surface og-store-service-card" data-depth="raised"')
  .replace(/class="og-button"/g,'class="og-button v2-button"')
  .replace('class="og-icon-button og-store-service-add"','class="og-icon-button v2-icon-button og-store-service-add" data-face="raised"')
  .replace('class="og-store-service-dates"','class="og-store-service-dates" role="region" tabindex="0" aria-label="예약 후보 날짜 · 표시 예시" aria-description="가로로 이동해 날짜와 예약 가능 여부를 확인합니다. 보이는 5일은 표시 예시이며 예약 기간 제한이 아닙니다."');
 if(!open)html=html.replace('data-depth="raised"','data-depth="inset"');
 for(const name of Object.keys(paths))html=html.replaceAll(icon(name),art(name));
 return html.replace(/<button\b/g,'<button inert');
}
export function renderHomeStoreReservationScreen({state='open'}={}){
 const config=states.find(([id])=>id===state);if(!config)throw new RangeError('Unsupported store reservation state');
 const store=renderHomeStoreContent({availability:{menu:true,reserve:true,wait:true},contentHTML:renderHomeStoreReservationSection(config[2]),selectedSection:2,bodyLabel:'매장 예약 안내'});
 if(state!=='no-show-limit')return `<div class="v2-home-store-frame" data-store-reservation-state="${state}" aria-label="${e(config[1])}">${store}</div>`;
 // Legacy store_reservation_widget.dart:271/430/576–640. This restores only
 // its passive notice, without implementing a block check or reservation flow.
 const id=uid('v2-store-reservation-limit'),title='미방문(노쇼) 누적 안내';
 const body='마지막 노쇼 발생일로부터 1개월간 예약 서비스가 제한되오니 양해 부탁 드립니다.\n\n미방문 누적 횟수: 3회\n마지막 노쇼 발생일: 2026년 9월 18일(금)\n해제일: 2026년 10월 18일(일)\n\n횟수와 날짜는 실제 회원정보가 아닌 표시 예시입니다.';
 const popup=renderDialog({id,title,body,actions:[{label:'확인'}]}).replace(' inert','')
  .replace('class="v2-dialog-static"',`class="v2-dialog-static" role="group" aria-labelledby="${id}-title"`)
  .replace('class="og-dialog-body"',`class="og-dialog-body" role="region" tabindex="0" aria-label="${title} 내용 · 표시 예시"`)
  .replace(/<button\b/g,'<button inert');
 return `<div class="v2-home-store-frame v2-store-reservation-limit-frame" data-store-reservation-state="${state}" aria-label="${e(config[1])}"><div class="v2-store-reservation-backdrop" inert aria-hidden="true">${store}</div><div class="v2-store-reservation-limit-overlay">${popup}</div></div>`;
}
const styles=['button','icon-button','media','section-heading','surfaces','dialog'].map(name=>'/v2/components/'+name+'.css').concat('/v2/home/store.css','/v2/home/store-reservation.css');
const example=([state,title])=>`<figure class="v2-home-search-example"><figcaption><h3>${e(title)}</h3></figcaption><div class="v2-home-search-host v2-home-store-reservation-host"><template data-store-reservation-template>${styles.map(href=>`<link rel="stylesheet" href="${href}">`).join('')}${renderHomeStoreReservationScreen({state})}</template></div></figure>`;
export function renderHomeStoreReservationReview(){
 return `<section id="store-reservation" data-review-screen hidden aria-labelledby="store-reservation-title"><h2 id="store-reservation-title">매장 예약 영역</h2><p class="v2-intro">매장 상세에서 예약 가능 날짜와 기존 예약의 일시·인원을 확인하는 영역입니다. 날짜·인원·접수 상태는 실제 예약 정보가 아닌 표시 예시이며 영업 상태도 배치용입니다. 노쇼 안내의 횟수·발생일·해제일도 표시 예시입니다. 예약·내역 이동·확인은 실행하지 않습니다.</p>${example(states[0])}<details class="v2-home-search-extra v2-home-store-reservation-extra"><summary>기존 예약·접수 중지·시간 경과·노쇼 제한 비교 · 5개</summary><div class="v2-home-search-grid">${states.slice(1).map(example).join('')}</div></details><p class="v2-intro">접수 중지 중에도 기존 예약은 유지하고 추가 예약은 표시하지 않습니다. 날짜 5개는 보이는 구간의 예시이며 예약 가능 기간을 5일로 제한하지 않습니다.</p></section>`;
}
export function setupHomeStoreReservationReview(root){
 const section=root.querySelector('#store-reservation');if(!section)return;
 const extra=section.querySelector('details');
 const mount=hosts=>{
  for(const host of hosts){
   if(host.shadowRoot)continue;
   const template=host.querySelector('template'),shadow=host.attachShadow({mode:'open'});
   shadow.append(template.content.cloneNode(true));template.remove();setupMedia(shadow);
  }
 };
 const activate=()=>{if(section.hidden)return;mount([section.querySelector('.v2-home-store-reservation-host')]);if(extra.open)mount(extra.querySelectorAll('.v2-home-store-reservation-host'));};
 new MutationObserver(activate).observe(section,{attributes:true,attributeFilter:['hidden']});
 extra.addEventListener('toggle',activate);activate();
}
