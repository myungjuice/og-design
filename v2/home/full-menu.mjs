import {fullMenuScreen} from '../../design-system/pages/home/full-menu.mjs';
import {publicStoreData} from '../../design-system/pages/home/public-store-data.mjs';
import {escapeHTML as e} from '../../design-system/components/core.mjs';
import {iconButton} from '../../design-system/components/button/render.mjs';
import {thumbnail} from '../../design-system/components/avatar/render.mjs';
import {renderIconButton} from '../components/icon-button.mjs';
import {renderChip} from '../components/chips.mjs';
import {renderThumbnail,setupMedia} from '../components/media.mjs';

const states=[['basic','처음 열었을 때'],['scrolled','아래로 스크롤했을 때'],['search','메뉴 검색 결과']];
const back='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m14 5-7 7 7 7"/></svg>';
export function renderHomeFullMenuScreen({state='basic',store=publicStoreData.store,items=publicStoreData.items}={}){
 const config=states.find(([id])=>id===state);if(!config)throw new RangeError('Unsupported full menu state');
 const sourceState=state==='basic'?'default':state;
 const featured=items.filter(item=>item.featured),results=items.filter(item=>item.name.includes('야끼'));
 const photoItems=[...(state==='scrolled'?[]:[{image:store.images?.[0]||'',name:store.name+' 대표 이미지'},...featured.filter(item=>item.image)]),...items.filter(item=>item.image),...(state==='search'?results.filter(item=>item.image):[])];
 const missingFeatured=featured.filter(item=>!item.image);
 const categories=[...new Set(items.map(item=>item.category||'카테고리명'))];
 const chips=['메뉴 검색','대표메뉴',...categories];let emptyIndex=0,chipIndex=0;
 let html=fullMenuScreen({state:sourceState,store,items,imageSrc:store.images?.[0]||''})
  .replace('class="og-full-menu"','class="og-full-menu v2-full-menu"')
  .replace(' inert>','>')
  .replace(/<h4>/g,'<h6>').replace(/<\/h4>/g,'</h6>')
  .replace(/<h3>/g,'<h5>').replace(/<\/h3>/g,'</h5>')
  .replace(/<h2>/g,'<h4>').replace(/<\/h2>/g,'</h4>')
  .replace(/<div class="og-full-menu-image-space"[^>]*>[\s\S]*?<\/div>/g,markup=>{
   if(!markup.includes('image_not_supported'))return markup;
   const item=missingFeatured[emptyIndex++];return renderThumbnail({alt:item.name+' 사진',placeholder:'photo'});
  })
  .replace(/<button[^>]*class="og-icon-button"[\s\S]*?<\/button>/g,markup=>iconButton({label:markup.includes('검색 닫기')?'검색 닫기':'뒤로',iconHTML:back,className:'v2-icon-button',attributes:{'data-face':'raised',inert:true}}))
  .replace(/<button[^>]*class="og-button og-favorite"[\s\S]*?<\/button>/g,()=>renderIconButton({kind:'favorite',face:'raised',attributes:{inert:true}}))
  .replace(/<button[^>]*class="og-chip"[\s\S]*?<\/button>/g,()=>{
   const index=chipIndex++;return renderChip({label:chips[index],selected:index===(state==='scrolled'?2:1),attributes:{inert:true}});
  })
  .replace('class="og-full-menu-categories"',()=>`class="og-full-menu-categories" tabindex="0" aria-description="${e(chips.join(' · '))}"`)
  .replace('class="og-full-menu-body"','class="og-full-menu-body" role="region" tabindex="0" aria-label="전체 메뉴 목록"');
 for(const [index,item] of photoItems.entries()){
  const alt=item.name+(index===0&&state!=='scrolled'?'':' 사진');
  html=html.replace(thumbnail({src:item.image||'',alt}),()=>renderThumbnail({src:item.image||'',alt,ratio:'wide'}));
 }
 // Only the source image/control surfaces change. Menu item content/units/order stay source-owned.
 html=html.replace(/(<section class="og-full-menu-featured"><h5>대표메뉴<\/h5>)<div>/,'$1<div role="region" tabindex="0" aria-label="대표메뉴 카드">')
  .replace('class="og-full-menu-search-panel"','class="og-full-menu-search-panel" role="region" tabindex="0" aria-label="메뉴 검색 결과"')
  .replace('class="og-full-menu-results"','class="og-full-menu-results" role="region" tabindex="0" aria-label="검색 결과 목록"')
  .replace(/<input\b/g,'<input readonly inert')
  .replace(/<button\b[^>]*>/g,tag=>/\binert\b/.test(tag)?tag:tag.replace('<button','<button inert'));
 if(state==='search')html=html.replace(/(<div class="og-full-menu v2-full-menu"[^>]*>)/,'$1<div class="v2-full-menu-background" inert aria-hidden="true">')
  .replace('<div class="og-full-menu-search-scrim">','</div><div class="og-full-menu-search-scrim">');
 return `<div class="v2-home-full-menu-frame" data-full-menu-state="${state}" aria-label="${e(config[1])}">${html}</div>`;
}
const styles=['/v2/components/icon-button.css','/v2/components/media.css','/v2/components/chips.css','/v2/home/full-menu.css'];
function example([state,title]){
 return `<figure class="v2-home-search-example"><figcaption><h3>${title}</h3><p>${state==='search'?'「야끼」를 포함하는 메뉴 이름의 검색 결과 예시입니다.':'오시 망원본점의 공개 메뉴 자료를 사용한 예시입니다.'} 현재 가격·판매 여부를 조회하지 않습니다.</p></figcaption><div class="v2-home-search-host v2-home-full-menu-host"><template data-full-menu-template>${styles.map(href=>`<link rel="stylesheet" href="${href}">`).join('')}${renderHomeFullMenuScreen({state})}</template></div></figure>`;
}
export function renderHomeFullMenuReview(){
 return `<section id="full-menu" data-review-screen hidden aria-labelledby="full-menu-title"><h2 id="full-menu-title">전체 메뉴</h2><p class="v2-intro">매장의 대표 메뉴와 카테고리별 메뉴 이름·설명·가격을 살펴보는 화면입니다. 검색·즐겨찾기·메뉴 이동은 실행하지 않는 시안입니다.</p>${example(states[0])}<details class="v2-home-search-extra"><summary>다른 상태 비교 · 2개</summary><div class="v2-home-search-grid">${states.slice(1).map(example).join('')}</div></details></section>`;
}
export function setupHomeFullMenuReview(root){
 const section=root.querySelector('#full-menu');if(!section)return;
 const extra=section.querySelector('details');
 const mount=hosts=>{for(const host of hosts){if(host.shadowRoot)continue;const template=host.querySelector('template'),shadow=host.attachShadow({mode:'open'});shadow.append(template.content.cloneNode(true));template.remove();setupMedia(shadow);}};
 const activate=()=>{if(section.hidden)return;mount([section.querySelector('.v2-home-full-menu-host')]);if(extra.open)mount(extra.querySelectorAll('.v2-home-full-menu-host'));};
 new MutationObserver(activate).observe(section,{attributes:true,attributeFilter:['hidden']});extra.addEventListener('toggle',activate);activate();
}
