import {newsDetailScreen} from '../../design-system/pages/home/news-pages.mjs';
import {publicPostsData} from '../../design-system/pages/home/public-posts-data.mjs';
import {appBar} from '../../design-system/components/app-shell/render.mjs';
import {iconButton} from '../../design-system/components/button/render.mjs';
import {thumbnail} from '../../design-system/components/avatar/render.mjs';
import {escapeHTML as e} from '../../design-system/components/core.mjs';
import {renderThumbnail,setupMedia} from '../components/media.mjs';

const states=[['registered','육감만족 · 등록된 소식'],['photo','사진이 있는 소식 · 배치 비교'],['no-photo','사진이 없는 소식 · 배치 비교']];
const back='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m14 5-7 7 7 7"/></svg>';
export function renderHomeNewsDetailScreen({state='registered',record=publicPostsData.news[0]}={}){
 const config=states.find(([id])=>id===state);if(!config)throw new RangeError('Unsupported news detail state');
 const imageSrc=state==='no-photo'?'':record.image||'';
 const bar=appBar({title:'매장 소식',back:true}).replace(iconButton({label:'뒤로가기',name:'arrow_back'}),()=>iconButton({label:'뒤로가기',iconHTML:back,className:'v2-icon-button',attributes:{'data-face':'raised',inert:true}}));
 let html=newsDetailScreen({title:record.title,contents:record.contents,registered:record.registered,imageSrc})
  .replace('class="og-news-page og-reading-page" inert','class="og-news-page og-reading-page v2-news-detail"')
  .replace('<h3>','<h5>').replace('</h3>','</h5>')
  .replace(appBar({title:'매장 소식',back:true}),()=>bar.replace('<h2>','<h4>').replace('</h2>','</h4>'))
  .replace('class="og-news-page-body"','class="og-news-page-body" role="region" tabindex="0" aria-label="소식 본문"');
 if(imageSrc)html=html.replace(thumbnail({src:imageSrc,alt:record.title+' 첨부 이미지'}),()=>renderThumbnail({src:imageSrc,alt:record.title+' 첨부 이미지',ratio:'wide',fit:'contain'}));
 return `<div class="v2-home-news-detail-frame" data-news-detail-state="${state}" aria-label="${e(config[1])}">${html}</div>`;
}
const styles=['/v2/components/icon-button.css','/v2/components/media.css','/v2/home/news-detail.css'];
const example=([state,title])=>`<figure class="v2-home-search-example"><figcaption><h3>${e(title)}</h3></figcaption><div class="v2-home-search-host v2-home-news-detail-host"><template data-news-detail-template>${styles.map(href=>`<link rel="stylesheet" href="${href}">`).join('')}${renderHomeNewsDetailScreen({state})}</template></div></figure>`;
export function renderHomeNewsDetailReview(){
 return `<section id="news-detail" data-review-screen hidden aria-labelledby="news-detail-title"><h2 id="news-detail-title">소식 상세</h2><p class="v2-intro">매장 소식의 등록일·제목·본문과 첨부 사진을 읽는 화면입니다. 육감만족의 기존 공개 소식 스냅샷을 사용하며 최신 소식이나 혜택을 뜻하지 않습니다. 뒤로가기는 실행하지 않습니다.</p>${example(states[0])}<details class="v2-home-search-extra v2-home-news-detail-extra"><summary>사진 배치 비교 · 2개</summary><p class="v2-intro">같은 등록 소식으로 사진이 있을 때와 없을 때를 비교합니다. 별도의 실제 소식이 아닙니다.</p><div class="v2-home-search-grid">${states.slice(1).map(example).join('')}</div></details><p class="v2-intro">등록일은 오른쪽, 제목은 가운데에 표시하고 구분선 아래 본문의 줄바꿈을 유지합니다. 첨부 사진은 본문 다음에 전체 너비로 원본 비율을 유지하며, 사진이 없으면 빈 자리를 만들지 않습니다.</p></section>`;
}
export function setupHomeNewsDetailReview(root){
 const section=root.querySelector('#news-detail');if(!section)return;
 const extra=section.querySelector('details');
 const mount=hosts=>{for(const host of hosts){if(host.shadowRoot)continue;const template=host.querySelector('template'),shadow=host.attachShadow({mode:'open'});shadow.append(template.content.cloneNode(true));template.remove();setupMedia(shadow);}};
 const activate=()=>{if(section.hidden)return;mount([section.querySelector('.v2-home-news-detail-host')]);if(extra.open)mount(extra.querySelectorAll('.v2-home-news-detail-host'));};
 new MutationObserver(activate).observe(section,{attributes:true,attributeFilter:['hidden']});extra.addEventListener('toggle',activate);activate();
}
