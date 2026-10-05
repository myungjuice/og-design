import {updatesSection} from '../../design-system/pages/home/store-updates.mjs';
import {publicPostsData} from '../../design-system/pages/home/public-posts-data.mjs';
import {sectionHeading} from '../../design-system/components/section-heading/render.mjs';
import {thumbnail} from '../../design-system/components/avatar/render.mjs';
import {escapeHTML as e,icon} from '../../design-system/components/core.mjs';
import {renderSectionHeading} from '../components/section-heading.mjs';
import {renderThumbnail,setupMedia} from '../components/media.mjs';
import {renderHomeStoreContent} from './store.mjs';

const states=[['registered','육감만족 · 등록된 이벤트'],['active','진행 중 · 오늘 종료'],['upcoming-ended','시작 예정 · 종료']];
const star=filled=>`<svg class="v2-event-star" data-event-star="${filled?'filled':'outline'}" viewBox="0 0 24 24" fill="${filled?'currentColor':'none'}" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z"/></svg>`;
export function renderHomeStoreEventSection(items=[],today=publicPostsData.today){
 const heading={title:'이벤트',action:'더보기'};
 let html=updatesSection('event',items,today)
  .replace('class="og-store-updates"','class="og-store-updates v2-store-event"')
  .replace(sectionHeading(heading),()=>renderSectionHeading(heading))
  .replaceAll(icon('star'),star(true)).replaceAll(icon('star_border'),star(false));
 for(const item of items.slice(0,2))if(item.image){
  const props={src:item.image,alt:item.title+' 이미지'};
  html=html.replace(thumbnail(props),()=>renderThumbnail(props));
 }
 return html.replace(/<button\b/g,'<button inert');
}
export function renderHomeStoreEventScreen({state='registered'}={}){
 const config=states.find(([id])=>id===state);if(!config)throw new RangeError('Unsupported store event state');
 // Registered snapshot is not rewritten into a live campaign. Comparison dates mirror the source board.
 const periods=state==='active'?[['2026-09-01','2026-09-21'],['2026-09-01','2026-09-19']]:[['2026-09-22','2026-09-30'],['2026-09-01','2026-09-18']];
 const items=state==='registered'?publicPostsData.events:periods.map(([start,end],index)=>({...publicPostsData.events[index%publicPostsData.events.length],start,end,image:index===0?publicPostsData.events[0].image:''}));
 const today=state==='registered'?publicPostsData.today:'2026-09-19';
 return `<div class="v2-home-store-frame" data-store-event-state="${state}" aria-label="${e(config[1])}">${renderHomeStoreContent({store:publicPostsData.store,availability:{event:true},selectedSection:1,bodyLabel:'매장 이벤트 안내',contentHTML:renderHomeStoreEventSection(items,today)})}</div>`;
}
const styles=['icon-button','media','section-heading'].map(name=>'/v2/components/'+name+'.css').concat('/v2/home/store.css','/v2/home/store-event.css');
const example=([state,title])=>`<figure class="v2-home-search-example"><figcaption><h3>${e(title)}</h3></figcaption><div class="v2-home-search-host v2-home-store-event-host"><template data-store-event-template>${styles.map(href=>`<link rel="stylesheet" href="${href}">`).join('')}${renderHomeStoreEventScreen({state})}</template></div></figure>`;
export function renderHomeStoreEventReview(){
 return `<section id="store-event" data-review-screen hidden aria-labelledby="store-event-title"><h2 id="store-event-title">매장 이벤트 영역</h2><p class="v2-intro">매장 상세에서 이벤트의 제목·기간·진행 상태를 확인하는 영역입니다. 육감만족의 기존 공개 이벤트 스냅샷을 사용하며 등록된 기간은 변경하지 않습니다. 최신 혜택이나 영업 상태를 뜻하지 않으며 더보기·이벤트 상세 이동은 실행하지 않습니다.</p>${example(states[0])}<details class="v2-home-search-extra v2-home-store-event-extra"><summary>진행 중·오늘 종료·예정·종료 비교 · 2개</summary><p class="v2-intro">같은 등록 이벤트에 상태 비교용 기간을 적용했습니다. 2026-09-19를 기준으로 표시하며 실제 행사 기간이나 등록 건수를 뜻하지 않습니다.</p><div class="v2-home-search-grid">${states.slice(1).map(example).join('')}</div></details><p class="v2-intro">기존 순서대로 두 개까지 표시합니다. 진행 중에는 채운 별, 예정·종료에는 테두리 별을 사용하며 남은 기간을 텍스트로 함께 안내합니다. 사진이 없으면 빈 이미지 자리를 생략하고, 이벤트가 없는 매장은 해당 영역과 탐색 항목을 생략합니다.</p></section>`;
}
export function setupHomeStoreEventReview(root){
 const section=root.querySelector('#store-event');if(!section)return;
 const extra=section.querySelector('details');
 const mount=hosts=>{
  for(const host of hosts){
   if(host.shadowRoot)continue;
   const template=host.querySelector('template'),shadow=host.attachShadow({mode:'open'});
   shadow.append(template.content.cloneNode(true));template.remove();setupMedia(shadow);
  }
 };
 const activate=()=>{if(section.hidden)return;mount([section.querySelector('.v2-home-store-event-host')]);if(extra.open)mount(extra.querySelectorAll('.v2-home-store-event-host'));};
 new MutationObserver(activate).observe(section,{attributes:true,attributeFilter:['hidden']});
 extra.addEventListener('toggle',activate);activate();
}
