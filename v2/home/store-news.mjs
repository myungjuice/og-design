import {updatesSection} from '../../design-system/pages/home/store-updates.mjs';
import {publicPostsData} from '../../design-system/pages/home/public-posts-data.mjs';
import {sectionHeading} from '../../design-system/components/section-heading/render.mjs';
import {thumbnail} from '../../design-system/components/avatar/render.mjs';
import {escapeHTML as e} from '../../design-system/components/core.mjs';
import {renderSectionHeading} from '../components/section-heading.mjs';
import {renderThumbnail,setupMedia} from '../components/media.mjs';
import {renderHomeStoreContent} from './store.mjs';

const states=[['registered','육감만족 · 등록된 소식'],['with-photo','사진이 있는 소식과 없는 소식'],['no-photo','사진이 없는 소식']];
export function renderHomeStoreNewsSection(items=[]){
 const heading={title:'소식',action:'더보기'};
 let html=updatesSection('news',items)
  .replace('class="og-store-updates"','class="og-store-updates v2-store-news"')
  .replace(sectionHeading(heading),()=>renderSectionHeading(heading));
 for(const item of items.slice(0,2))if(item.image){
  const props={src:item.image,alt:item.title+' 이미지'};
  html=html.replace(thumbnail(props),()=>renderThumbnail(props));
 }
 return html.replace(/<button\b/g,'<button inert');
}
export function renderHomeStoreNewsScreen({state='registered'}={}){
 const config=states.find(([id])=>id===state);if(!config)throw new RangeError('Unsupported store news state');
 // Preserve the registered record. Only comparison fixtures repeat it, as in the source board.
 const items=state==='registered'?publicPostsData.news:[0,1].map(index=>({...publicPostsData.news[index%publicPostsData.news.length],image:state==='with-photo'&&index===0?publicPostsData.news[0].image:''}));
 return `<div class="v2-home-store-frame" data-store-news-state="${state}" aria-label="${e(config[1])}">${renderHomeStoreContent({store:publicPostsData.store,availability:{news:true},selectedSection:1,bodyLabel:'매장 소식 안내',contentHTML:renderHomeStoreNewsSection(items)})}</div>`;
}
const styles=['icon-button','media','section-heading'].map(name=>'/v2/components/'+name+'.css').concat('/v2/home/store.css','/v2/home/store-news.css');
const example=([state,title])=>`<figure class="v2-home-search-example"><figcaption><h3>${e(title)}</h3></figcaption><div class="v2-home-search-host v2-home-store-news-host"><template data-store-news-template>${styles.map(href=>`<link rel="stylesheet" href="${href}">`).join('')}${renderHomeStoreNewsScreen({state})}</template></div></figure>`;
export function renderHomeStoreNewsReview(){
 return `<section id="store-news" data-review-screen hidden aria-labelledby="store-news-title"><h2 id="store-news-title">매장 소식 영역</h2><p class="v2-intro">매장 상세에서 등록된 소식의 제목·날짜와 사진을 확인하는 영역입니다. 육감만족의 기존 공개 소식 스냅샷을 사용하며 최신 소식이나 영업 상태를 뜻하지 않습니다. 더보기·소식 상세 이동은 실행하지 않습니다.</p>${example(states[0])}<details class="v2-home-search-extra v2-home-store-news-extra"><summary>사진 있음·없음 배치 비교 · 2개</summary><p class="v2-intro">같은 등록 소식을 두 번 배치한 상태 비교입니다. 실제 등록 건수가 아닙니다.</p><div class="v2-home-search-grid">${states.slice(1).map(example).join('')}</div></details><p class="v2-intro">기존 순서대로 두 개까지 표시합니다. 사진이 없으면 빈 이미지 자리 없이 제목 영역을 넓힙니다. 소식이 등록되지 않은 매장은 소식 영역과 탐색 항목을 생략합니다.</p></section>`;
}
export function setupHomeStoreNewsReview(root){
 const section=root.querySelector('#store-news');if(!section)return;
 const extra=section.querySelector('details');
 const mount=hosts=>{
  for(const host of hosts){
   if(host.shadowRoot)continue;
   const template=host.querySelector('template'),shadow=host.attachShadow({mode:'open'});
   shadow.append(template.content.cloneNode(true));template.remove();setupMedia(shadow);
  }
 };
 const activate=()=>{if(section.hidden)return;mount([section.querySelector('.v2-home-store-news-host')]);if(extra.open)mount(extra.querySelectorAll('.v2-home-store-news-host'));};
 new MutationObserver(activate).observe(section,{attributes:true,attributeFilter:['hidden']});
 extra.addEventListener('toggle',activate);activate();
}
