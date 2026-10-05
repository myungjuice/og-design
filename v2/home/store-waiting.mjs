import {waitingSection} from '../../design-system/pages/home/store-services.mjs';
import {sectionHeading} from '../../design-system/components/section-heading/render.mjs';
import {escapeHTML as e,icon} from '../../design-system/components/core.mjs';
import {renderSectionHeading} from '../components/section-heading.mjs';
import {setupMedia} from '../components/media.mjs';
import {renderHomeStoreContent} from './store.mjs';

const states=[
 ['open','웨이팅 접수 중',{}],
 ['no-estimate','예상 대기 시간이 없을 때',{estimate:null}],
 ['current','내 웨이팅이 있을 때',{current:true}],
 ['closed','웨이팅 접수 중지',{open:false}],
 ['no-info','웨이팅 정보가 없을 때',{info:false,status:'known'}],
 // RuntimeValidater labels/sublabels; event times are passive display fixtures.
 ['break-preparing','곧 브레이크 타임 · 웨이팅 접수 중지',{open:true,runtimeStatus:'breakPreparing',status:'곧 브레이크 타임 15:00에 브레이크 타임'}],
 ['close-preparing','곧 영업 종료 · 웨이팅 접수 중지',{open:true,runtimeStatus:'closePreparing',status:'곧 영업 종료 22:00에 영업 종료'}]
];
const art=path=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
const people=art('<circle cx="9" cy="7" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6m2 4a5 5 0 0 1 3 4v3"/>');
const refresh=art('<path d="M20 7V3m0 4h-4M4 17v4m0-4h4M20 7a9 9 0 0 0-15-2M4 17a9 9 0 0 0 15 2"/>');
export function renderHomeStoreWaitingSection({open=true,current=false,info=true,estimate=20,status='',runtimeStatus=''}={}){
 const headingProps={title:'웨이팅',action:'내역 보기'};
 // Legacy store_waiting_widget.dart:231–240 keeps current/missing data ahead
 // of closure and both preparing statuses, even when reception itself is open.
 const accepting=open&&!['breakPreparing','closePreparing'].includes(runtimeStatus);
 let html=waitingSection({open:accepting,current,info,estimate,status})
  .replace('class="og-store-service"','class="og-store-service v2-store-waiting"')
  .replace(sectionHeading(headingProps),()=>renderSectionHeading(headingProps))
  .replace(/<h3>/g,'<h4>').replace(/<\/h3>/g,'</h4>')
  .replace('class="og-surface og-store-service-card"',`class="og-surface v2-surface og-store-service-card" data-depth="${current||(info&&accepting)?'raised':'inset'}"`)
  .replace(/class="og-button"/g,'class="og-button v2-button"')
  .replace('class="og-icon-button"','class="og-icon-button v2-icon-button" data-face="raised"')
  .replaceAll(icon('people_alt'),people).replaceAll(icon('refresh'),refresh);
 return html.replace(/<button\b/g,'<button inert');
}
export function renderHomeStoreWaitingScreen({state='open'}={}){
 const config=states.find(([id])=>id===state);if(!config)throw new RangeError('Unsupported store waiting state');
 return `<div class="v2-home-store-frame" data-store-waiting-state="${state}" aria-label="${e(config[1])}">${renderHomeStoreContent({availability:{menu:true,reserve:true,wait:true},contentHTML:renderHomeStoreWaitingSection(config[2]),selectedSection:2,bodyLabel:'매장 웨이팅 안내'})}</div>`;
}
const styles=['button','icon-button','media','section-heading','surfaces'].map(name=>'/v2/components/'+name+'.css').concat('/v2/home/store.css','/v2/home/store-waiting.css');
const example=([state,title])=>`<figure class="v2-home-search-example"><figcaption><h3>${e(title)}</h3></figcaption><div class="v2-home-search-host v2-home-store-waiting-host"><template data-store-waiting-template>${styles.map(href=>`<link rel="stylesheet" href="${href}">`).join('')}${renderHomeStoreWaitingScreen({state})}</template></div></figure>`;
export function renderHomeStoreWaitingReview(){
 return `<section id="store-waiting" data-review-screen hidden aria-labelledby="store-waiting-title"><h2 id="store-waiting-title">매장 웨이팅 영역</h2><p class="v2-intro">매장 상세에서 대기 팀 수·예상 대기 시간과 내 대기번호·순서를 확인하는 영역입니다. 숫자·인원·접수 상태는 실제 웨이팅 정보가 아닌 표시 예시이며 영업 상태도 배치용입니다. 영업 이벤트 시간도 표시 예시입니다. 등록·새로고침·내역 이동은 실행하지 않습니다.</p>${example(states[0])}<details class="v2-home-search-extra v2-home-store-waiting-extra"><summary>예상 시간 없음·내 웨이팅·접수 중지·정보 없음·영업 준비 비교 · 6개</summary><div class="v2-home-search-grid">${states.slice(1).map(example).join('')}</div></details><p class="v2-intro">내 웨이팅이 있으면 접수 상태보다 먼저 표시합니다. 예상 시간이 없으면 0분으로 바꾸지 않고 생략하며, 정보 없음·접수 중지·브레이크 준비·마감 준비는 구분해 안내합니다.</p></section>`;
}
export function setupHomeStoreWaitingReview(root){
 const section=root.querySelector('#store-waiting');if(!section)return;
 const extra=section.querySelector('details');
 const mount=hosts=>{
  for(const host of hosts){
   if(host.shadowRoot)continue;
   const template=host.querySelector('template'),shadow=host.attachShadow({mode:'open'});
   shadow.append(template.content.cloneNode(true));template.remove();setupMedia(shadow);
  }
 };
 const activate=()=>{if(section.hidden)return;mount([section.querySelector('.v2-home-store-waiting-host')]);if(extra.open)mount(extra.querySelectorAll('.v2-home-store-waiting-host'));};
 new MutationObserver(activate).observe(section,{attributes:true,attributeFilter:['hidden']});
 extra.addEventListener('toggle',activate);activate();
}
