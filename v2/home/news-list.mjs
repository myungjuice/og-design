import {newsListScreen} from '../../design-system/pages/home/news-pages.mjs';
import {publicPostsData} from '../../design-system/pages/home/public-posts-data.mjs';
import {appBar} from '../../design-system/components/app-shell/render.mjs';
import {iconButton} from '../../design-system/components/button/render.mjs';
import {thumbnail} from '../../design-system/components/avatar/render.mjs';
import {escapeHTML as e} from '../../design-system/components/core.mjs';
import {renderThumbnail,setupMedia} from '../components/media.mjs';

const states=[['registered','육감만족 · 등록된 소식 목록'],['photo-mix','사진 있음·없음 · 3행 배치 비교'],['empty','소식이 없는 목록']];
const back='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m14 5-7 7 7 7"/></svg>';
export function renderHomeNewsListScreen({state='registered',items}={}){
 const config=states.find(([id])=>id===state);if(!config)throw new RangeError('Unsupported news list state');
 // Registered count stays intact; only the labelled layout comparison repeats the source record.
 const records=items??(state==='empty'?[]:state==='photo-mix'?[0,1,2].map(index=>({...publicPostsData.news[0],image:index===1?'':publicPostsData.news[0].image})):publicPostsData.news);
 const bar=appBar({title:'우리 가게 소식',back:true}).replace(iconButton({label:'뒤로가기',name:'arrow_back'}),()=>iconButton({label:'뒤로가기',iconHTML:back,className:'v2-icon-button',attributes:{'data-face':'raised',inert:true}}));
 let html=newsListScreen({items:records})
  .replace('class="og-news-page" inert','class="og-news-page v2-news-list"')
  .replace(/<h4>/g,'<h5>').replace(/<\/h4>/g,'</h5>')
  .replace(appBar({title:'우리 가게 소식',back:true}),()=>bar.replace('<h2>','<h4>').replace('</h2>','</h4>'))
  .replace('class="og-news-page-body"','class="og-news-page-body" role="region" tabindex="0" aria-label="전체 소식 목록"')
  .replace(/(<div class="og-news-empty">)<img src="([^"]+)"[^>]*>/,(_,prefix,src)=>prefix+renderThumbnail({src,alt:'소식 없음 안내 이미지',fit:'contain',decorative:true}));
 for(const item of records)if(item.image){
  const props={src:item.image,alt:item.title+' 이미지'};
  html=html.replace(thumbnail(props),()=>renderThumbnail(props));
 }
 return `<div class="v2-home-news-list-frame" data-news-list-state="${state}" aria-label="${e(config[1])}">${html}</div>`;
}
const styles=['/v2/components/icon-button.css','/v2/components/media.css','/v2/home/news-list.css'];
const example=([state,title])=>`<figure class="v2-home-search-example"><figcaption><h3>${e(title)}</h3></figcaption><div class="v2-home-search-host v2-home-news-list-host"><template data-news-list-template>${styles.map(href=>`<link rel="stylesheet" href="${href}">`).join('')}${renderHomeNewsListScreen({state})}</template></div></figure>`;
export function renderHomeNewsListReview(){
 return `<section id="news-list" data-review-screen hidden aria-labelledby="news-list-title"><h2 id="news-list-title">소식 전체 목록</h2><p class="v2-intro">매장에 등록된 소식의 날짜·제목과 사진을 전체 목록으로 확인하는 화면입니다. 육감만족의 기존 공개 소식 스냅샷을 사용하며 최신 소식이나 혜택을 뜻하지 않습니다. 뒤로가기·소식 상세 이동은 실행하지 않습니다.</p>${example(states[0])}<details class="v2-home-search-extra v2-home-news-list-extra"><summary>사진 배치·빈 목록 비교 · 2개</summary><p class="v2-intro">사진 배치 비교는 같은 등록 소식을 세 번 배치한 예시이며 실제 등록 건수가 아닙니다. 빈 목록은 소식이 없을 때의 안내입니다.</p><div class="v2-home-search-grid">${states.slice(1).map(example).join('')}</div></details><p class="v2-intro">매장 상세의 요약 영역과 달리 두 개 제한 없이 기존 순서대로 표시합니다. 사진이 없으면 빈 이미지 자리 없이 제목 영역을 넓히며, 빈 목록에는 기존 안내 이미지와 문구만 표시합니다.</p></section>`;
}
export function setupHomeNewsListReview(root){
 const section=root.querySelector('#news-list');if(!section)return;
 const extra=section.querySelector('details');
 const mount=hosts=>{for(const host of hosts){if(host.shadowRoot)continue;const template=host.querySelector('template'),shadow=host.attachShadow({mode:'open'});shadow.append(template.content.cloneNode(true));template.remove();setupMedia(shadow);}};
 const activate=()=>{if(section.hidden)return;mount([section.querySelector('.v2-home-news-list-host')]);if(extra.open)mount(extra.querySelectorAll('.v2-home-news-list-host'));};
 new MutationObserver(activate).observe(section,{attributes:true,attributeFilter:['hidden']});extra.addEventListener('toggle',activate);activate();
}
