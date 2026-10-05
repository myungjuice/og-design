import {menuDetailScreen} from '../../design-system/pages/home/menu-detail.mjs';
import {publicStoreData} from '../../design-system/pages/home/public-store-data.mjs';
import {escapeHTML as e} from '../../design-system/components/core.mjs';
import {iconButton} from '../../design-system/components/button/render.mjs';
import {thumbnail} from '../../design-system/components/avatar/render.mjs';
import {renderSelection} from '../components/selection.mjs';
import {renderBadge} from '../components/badges.mjs';
import {renderThumbnail,setupMedia} from '../components/media.mjs';

const states=[['basic','등록된 메뉴'],['options','사진과 추가 옵션 배치 예시'],['scrolled','스크롤 후 · 옵션 선택 예시'],['no-photo','사진과 추가 옵션이 없을 때']];
const exampleOptions=[{name:'추가 옵션명',price:1000},{name:'다른 옵션명',price:2000}];
const back='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m14 5-7 7 7 7"/></svg>';

export function renderHomeMenuDetailScreen({state='basic',item=publicStoreData.items[0]}={}){
 const config=states.find(([id])=>id===state);if(!config)throw new RangeError('Unsupported menu detail state');
 const options=state==='basic'?(item.options||[]):state==='no-photo'?[]:exampleOptions.map((option,index)=>({...option,selected:state==='scrolled'&&index===0}));
 const imageSrc=state==='no-photo'?'':item.detailImage||item.image||'';
 let choiceIndex=0;
 let html=menuDetailScreen({...item,imageSrc,options,scrolled:state==='scrolled'})
  .replace('class="og-menu-detail" inert','class="og-menu-detail v2-menu-detail"')
  .replace(/<h3>/g,'<h5>').replace(/<\/h3>/g,'</h5>')
  .replace(/<h2>/g,'<h4>').replace(/<\/h2>/g,'</h4>')
  .replace(/<button[^>]*class="og-icon-button"[\s\S]*?<\/button>/g,()=>iconButton({label:'뒤로',iconHTML:back,className:'v2-icon-button',attributes:{'data-face':'raised',inert:true}}))
  .replace(/<span class="og-badge"[^>]*>[\s\S]*?<\/span>/g,markup=>renderBadge({label:markup.includes('필수')?'필수':'선택',tone:markup.includes('필수')?'info':'neutral'}))
  .replace(/<label class="og-choice [^"]*"[\s\S]*?<\/label>/g,()=>{
   const index=choiceIndex++,option=options[index-1];
   return renderSelection({kind:index===0?'radio':'checkbox',label:index===0?'기본':option.name,checked:index===0||!!option.selected,attributes:{inert:true}}).replace('<label ','<label inert ');
  })
  .replace('class="og-menu-detail-heading"','class="og-menu-detail-heading" role="region" tabindex="0" aria-label="메뉴 이름과 설명"')
  .replace('class="og-menu-detail-body"','class="og-menu-detail-body" role="region" tabindex="0" aria-label="메뉴 가격과 옵션"');
 if(imageSrc&&state!=='scrolled')html=html.replace(thumbnail({src:imageSrc,alt:item.name+' 사진'}),()=>renderThumbnail({src:imageSrc,alt:item.name+' 사진',ratio:'wide'}));
 // Static selection labels remain readable via row descriptions, without enabling native label activation.
 let rowIndex=0;
 html=html.replace(/class="og-menu-detail-row"/g,()=>{
  const index=rowIndex++,option=options[index-1];
  const description=index===0?'기본 · 선택됨':option.name+' · '+(option.selected?'선택됨':'미선택');
  return `class="og-menu-detail-row" role="group" aria-label="${e(description)}"`;
 });
 return `<div class="v2-home-menu-detail-frame" data-menu-detail-state="${state}" aria-label="${e(config[1])}">${html}</div>`;
}
const styles=['/v2/components/icon-button.css','/v2/components/media.css','/v2/components/selection.css','/v2/components/badges.css','/v2/home/menu-detail.css'];
function example([state,title]){
 const note=state==='options'||state==='scrolled'?'추가 옵션명·금액은 실제 판매 옵션이 아닌 배치 예시입니다.':'오시 망원본점의 공개 메뉴 자료를 사용한 예시입니다.';
 return `<figure class="v2-home-search-example"><figcaption><h3>${title}</h3><p>${note} 현재 가격·판매 여부를 조회하지 않습니다.</p></figcaption><div class="v2-home-search-host v2-home-menu-detail-host"><template data-menu-detail-template>${styles.map(href=>`<link rel="stylesheet" href="${href}">`).join('')}${renderHomeMenuDetailScreen({state})}</template></div></figure>`;
}
export function renderHomeMenuDetailReview(){
 return `<section id="menu-detail" data-review-screen hidden aria-labelledby="menu-detail-title"><h2 id="menu-detail-title">메뉴 상세</h2><p class="v2-intro">메뉴 사진·설명·기본 가격과 추가 옵션을 살펴보는 화면입니다. 옵션 선택·뒤로 이동은 실행하지 않는 시안입니다.</p>${example(states[0])}<details class="v2-home-search-extra"><summary>표시 조건 비교 · 3개</summary><div class="v2-home-search-grid">${states.slice(1).map(example).join('')}</div></details></section>`;
}
export function setupHomeMenuDetailReview(root){
 const section=root.querySelector('#menu-detail');if(!section)return;
 const extra=section.querySelector('details');
 const mount=hosts=>{for(const host of hosts){if(host.shadowRoot)continue;const template=host.querySelector('template'),shadow=host.attachShadow({mode:'open'});shadow.append(template.content.cloneNode(true));template.remove();setupMedia(shadow);}};
 const activate=()=>{if(section.hidden)return;mount([section.querySelector('.v2-home-menu-detail-host')]);if(extra.open)mount(extra.querySelectorAll('.v2-home-menu-detail-host'));};
 new MutationObserver(activate).observe(section,{attributes:true,attributeFilter:['hidden']});extra.addEventListener('toggle',activate);activate();
}
