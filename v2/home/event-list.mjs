import {eventListScreen} from '../../design-system/pages/home/event-pages.mjs';
import {publicPostsData} from '../../design-system/pages/home/public-posts-data.mjs';
import {appBar} from '../../design-system/components/app-shell/render.mjs';
import {iconButton} from '../../design-system/components/button/render.mjs';
import {thumbnail} from '../../design-system/components/avatar/render.mjs';
import {escapeHTML as e,icon} from '../../design-system/components/core.mjs';
import {renderThumbnail,setupMedia} from '../components/media.mjs';

const states=[['registered','육감만족 · 등록된 이벤트 목록'],['states','진행 중·시작 예정·종료 · 기간 비교'],['empty','이벤트가 없는 목록']];
const back='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m14 5-7 7 7 7"/></svg>';
const star=filled=>`<svg class="v2-event-star" data-event-star="${filled?'filled':'outline'}" viewBox="0 0 24 24" fill="${filled?'currentColor':'none'}" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z"/></svg>`;
const comparisons=()=>[
 {...publicPostsData.events[0],start:'2026-09-01',end:'2026-09-19'},
 {...publicPostsData.events[0],start:'2026-09-01',end:'2026-09-21',image:''},
 {...publicPostsData.events[0],start:'2026-09-22',end:'2026-09-30'},
 {...publicPostsData.events[0],start:'2026-09-01',end:'2026-09-18',image:''}
];
export function renderHomeEventListScreen({state='registered',items,today,logo=publicPostsData.store.logo,name=publicPostsData.store.name}={}){
 const config=states.find(([id])=>id===state);if(!config)throw new RangeError('Unsupported event list state');
 // Only the labelled comparison changes dates; the registered snapshot stays intact.
 const records=items??(state==='empty'?[]:state==='states'?comparisons():publicPostsData.events);
 const bar=appBar({title:'우리 매장 이벤트',back:true}).replace(iconButton({label:'뒤로가기',name:'arrow_back'}),()=>iconButton({label:'뒤로가기',iconHTML:back,className:'v2-icon-button',attributes:{'data-face':'raised',inert:true}}));
 const brand=renderThumbnail({src:logo,alt:name+' 로고',fit:'contain',decorative:true}).replace('<svg ','<svg data-brand-fallback="storefront" ');
 let html=eventListScreen({items:records,today:today??(state==='states'?'2026-09-19':publicPostsData.today),logo,name})
  .replace('class="og-news-page og-event-page" inert','class="og-news-page og-event-page v2-news-list v2-event-list"')
  .replace(/<h4>/g,'<h5>').replace(/<\/h4>/g,'</h5>')
  .replace(appBar({title:'우리 매장 이벤트',back:true}),()=>bar.replace('<h2>','<h4>').replace('</h2>','</h4>'))
  .replace(/(<div class="og-event-brand">).*?(<strong>)/,(_,prefix,suffix)=>prefix+brand+suffix)
  .replaceAll(icon('star'),star(true)).replaceAll(icon('star_border'),star(false))
  .replace('class="og-news-page-body"','class="og-news-page-body" role="region" tabindex="0" aria-label="전체 이벤트 목록"')
  .replace(/(<div class="og-news-empty">)<img src="([^"]+)"[^>]*>/,(_,prefix,src)=>prefix+renderThumbnail({src,alt:'이벤트 없음 안내 이미지',fit:'contain',decorative:true}));
 for(const item of records)if(item.image){const props={src:item.image,alt:item.title+' 이미지'};html=html.replace(thumbnail(props),()=>renderThumbnail(props));}
 return `<div class="v2-home-news-list-frame v2-home-event-list-frame" data-event-list-state="${state}" aria-label="${e(config[1])}">${html}</div>`;
}
const styles=['/v2/components/icon-button.css','/v2/components/media.css','/v2/home/news-list.css','/v2/home/event-list.css'];
const example=([state,title])=>`<figure class="v2-home-search-example"><figcaption><h3>${e(title)}</h3></figcaption><div class="v2-home-search-host v2-home-event-list-host"><template data-event-list-template>${styles.map(href=>`<link rel="stylesheet" href="${href}">`).join('')}${renderHomeEventListScreen({state})}</template></div></figure>`;
export function renderHomeEventListReview(){
 return `<section id="event-list" data-review-screen hidden aria-labelledby="event-list-title"><h2 id="event-list-title">이벤트 전체 목록</h2><p class="v2-intro">매장의 이벤트 제목·진행 상태·기간과 사진을 전체 목록으로 확인하는 화면입니다. 육감만족의 기존 공개 스냅샷을 사용하며 최신 행사나 혜택을 뜻하지 않습니다. 뒤로가기·이벤트 상세 이동은 실행하지 않습니다.</p>${example(states[0])}<details class="v2-home-search-extra"><summary>기간·빈 목록 비교 · 2개</summary><p class="v2-intro">기간 비교는 같은 등록 이벤트에 원본의 비교용 날짜를 적용한 예시로, 실제 행사 기간이나 등록 건수가 아닙니다. 비교 기준일은 2026.9.19이며 실제 등록 이벤트는 스냅샷 기준일 2026.9.20과 원래 기간을 유지합니다.</p><div class="v2-home-search-grid">${states.slice(1).map(example).join('')}</div></details><p class="v2-intro">진행 중 → 시작 예정 → 종료 순서로 두 개 제한 없이 표시합니다. 진행 중은 종료가 가까운 순, 시작 예정은 시작일 순, 종료는 최근 종료일 순으로 정렬합니다. 사진이 없으면 빈 자리를 만들지 않고, 이벤트가 없어도 매장명과 로고는 유지합니다.</p></section>`;
}
export function setupHomeEventListReview(root){
 const section=root.querySelector('#event-list');if(!section)return;const extra=section.querySelector('details');
 const mount=hosts=>{for(const host of hosts){if(host.shadowRoot)continue;const template=host.querySelector('template'),shadow=host.attachShadow({mode:'open'});shadow.append(template.content.cloneNode(true));template.remove();setupMedia(shadow);}};
 const activate=()=>{if(section.hidden)return;mount([section.querySelector('.v2-home-event-list-host')]);if(extra.open)mount(extra.querySelectorAll('.v2-home-event-list-host'));};
 new MutationObserver(activate).observe(section,{attributes:true,attributeFilter:['hidden']});extra.addEventListener('toggle',activate);activate();
}
