import {nearbyCard} from '../../design-system/pages/home/nearby.mjs';
import {publicStoreData} from '../../design-system/pages/home/public-store-data.mjs';
import {renderHomeTest} from '../../screens/my-info-3d-test/home.mjs';
import {bottomSheet} from '../../design-system/components/sheet/render.mjs';
import {renderThumbnail,setupMedia} from '../components/media.mjs';
import {escapeHTML as e} from '../../design-system/components/core.mjs';

const line=path=>`<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${path}"/></svg>`;
const compass=line('M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm4.5 4.5-2.7 6.3-6.3 2.7 2.7-6.3Z');
const emptyArt='<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/></svg>';
const states=[
 ['list','근처 회원점 목록','오시 망원본점의 공개 사진·소개 문구를 사용한 배치 예시입니다. 실시간 반경 조회 결과는 아닙니다.'],
 ['no-photo','매장 사진이 없을 때','동일 매장의 사진을 숨긴 상태 예시입니다. 실제 사진이 없는 매장이라는 뜻은 아닙니다.'],
 ['empty','근처에 매장이 없을 때','주변 매장 목록이 비어 있는 상태를 비교합니다.']
];
function card(state){
 const store=publicStoreData.store;
 let html=nearbyCard({...store,images:state==='no-photo'?[]:store.images});
 const src=html.match(/class="og-thumbnail"[^>]*><img src="([^"]+)"/)?.[1];
 if(!src)throw new Error('Missing source nearby photo');
 html=html.replace(/<div class="og-thumbnail"[\s\S]*?<\/div>/,renderThumbnail({src,alt:store.name+(state==='no-photo'?' · 사진 없음 표시':' 매장 사진'),ratio:'wide'}))
  .replace('<h3>','<h4>').replace('</h3>','</h4>')
  .replace('class="og-button"','class="og-button v2-button"');
 return html.replace(/<button\b/g,'<button inert');
}
export function renderHomeNearbyScreen({state='list'}={}){
 const config=states.find(([id])=>id===state);if(!config)throw new RangeError('Unsupported nearby state');
 const body=state==='empty'?`<div class="og-nearby-empty"><div class="v2-empty-icon" aria-hidden="true">${emptyArt}</div><p>2Km 이내에 매장이 없습니다.</p></div>`:card(state);
 const sheet=bottomSheet({id:'nearby-'+state,title:'망원동 근처 보기',bodyHTML:body,actions:[]})
  .replace('class="og-sheet-panel"','class="og-sheet-panel v2-sheet-panel"')
  .replace('<div class="og-sheet-header">','<div class="v2-home-nearby-handle" aria-hidden="true"></div><div class="og-sheet-header">')
  .replace(/<button[^>]*class="[^"]*og-sheet-close[^"]*"[\s\S]*?<\/button>/,'')
  .replace('<div class="og-sheet-footer"></div>','')
  .replace('<h2 ','<h3 ').replace('</h2>','</h3>')
  .replace('>망원동 근처 보기</h3>',`>${compass}<span>망원동 근처 보기</span></h3>`)
  .replace('class="og-sheet-body"','class="og-sheet-body" role="region" tabindex="0" aria-label="근처 매장 목록"');
 return `<div class="v2-home-nearby-frame" data-nearby-state="${state}" aria-label="${e(config[1])}"><div class="v2-home-nearby-backdrop" inert aria-hidden="true">${renderHomeTest({assetBase:'/screens/my-info-3d-test/media/figma/'})}</div><div class="v2-home-nearby-overlay">${sheet}</div></div>`;
}
const styles=['/screens/my-info-3d-test/styles.css','/screens/my-info-3d-test/home.css','/v2/home/screen.css','/v2/components/sheet.css','/v2/components/button.css','/v2/components/media.css','/v2/components/empty-icon.css','/v2/home/nearby.css'];
function example([state,title,copy]){
 return `<figure class="v2-home-search-example"><figcaption><h3>${e(title)}</h3><p>${e(copy)}</p></figcaption><div class="v2-home-search-host v2-home-nearby-host"><template data-nearby-template>${styles.map(href=>`<link rel="stylesheet" href="${href}">`).join('')}${renderHomeNearbyScreen({state})}</template></div></figure>`;
}
export function renderHomeNearbyReview(){
 return `<section id="nearby" data-review-screen hidden aria-labelledby="nearby-title"><h2 id="nearby-title">근처 보기</h2><p class="v2-intro">현재 지도 위치 주변의 매장 사진과 소개를 살펴보는 목록 화면입니다. 방문하기·사진 넘기기·확대·닫기는 실행하지 않는 시안입니다.</p>${example(states[0])}<details class="v2-home-search-extra v2-home-nearby-extra"><summary>다른 상태 비교 · 2개</summary><div class="v2-home-search-grid">${states.slice(1).map(example).join('')}</div></details></section>`;
}
export function setupHomeNearbyReview(root){
 const section=root.querySelector('#nearby');if(!section)return;
 const extra=section.querySelector('details');
 const mount=hosts=>{
  for(const host of hosts){
   if(host.shadowRoot)continue;
   const template=host.querySelector('template'),shadow=host.attachShadow({mode:'open'});
   shadow.append(template.content.cloneNode(true));template.remove();
   shadow.querySelector('form').addEventListener('submit',event=>event.preventDefault());
   const rail=shadow.querySelector('.home-categories'),more=rail.querySelector('.home-category-more');
   const row=document.createElement('div');row.className='v2-home-category-row';rail.before(row);row.append(rail,more);
   setupMedia(shadow);
  }
 };
 const activate=()=>{if(section.hidden)return;mount([section.querySelector('.v2-home-nearby-host')]);if(extra.open)mount(extra.querySelectorAll('.v2-home-nearby-host'));};
 new MutationObserver(activate).observe(section,{attributes:true,attributeFilter:['hidden']});
 extra.addEventListener('toggle',activate);activate();
}
