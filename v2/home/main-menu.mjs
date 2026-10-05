import {mainMenuSection} from '../../design-system/pages/home/main-menu.mjs';
import {sectionHeading} from '../../design-system/components/section-heading/render.mjs';
import {publicStoreData} from '../../design-system/pages/home/public-store-data.mjs';
import {escapeHTML as e} from '../../design-system/components/core.mjs';
import {renderSectionHeading} from '../components/section-heading.mjs';
import {renderThumbnail,setupMedia} from '../components/media.mjs';
import {renderHomeStoreContent} from './store.mjs';

// Original condition fixture; deliberately not presented as this store's menu.
const conditionItems=[
 {name:'메뉴명',description:'메뉴에 대한 설명',price:12000,image:publicStoreData.items[0].image},
 {name:'사진이 없는 메뉴',description:'메뉴에 대한 설명',price:8000},
 {name:'설명이 없는 메뉴',price:6500,image:publicStoreData.items[2].image},
 {name:'가격 문구가 있는 메뉴',price:0,priceText:'시가'}
];
const states=[
 ['basic','등록 메뉴 예시','오시 망원본점의 공개 메뉴를 등록 순서대로 4개 표시합니다. 개발용 자료의 예시이며 현재 가격·판매 여부를 조회하지 않습니다.',publicStoreData.items],
 ['conditions','사진·설명·가격 문구 비교','원본의 표시 조건 예시입니다. 메뉴명·가격은 실제 판매 정보가 아니며 사진은 배치 비교용입니다.',conditionItems]
];
export function renderHomeMainMenuSection({items=[],showAllInfo=true}={}){
 if(!showAllInfo||!items.length)return '';
 const photos=items.slice(0,4).filter(item=>item.image);let photoIndex=0;
 const heading=renderSectionHeading({title:'주요 메뉴',action:'더보기'})
  .replace('<h3>','<h4>').replace('</h3>','</h4>')
  .replace(/<button\b/g,'<button inert');
 return mainMenuSection({items})
  .replace(/<h4>/g,'<h5>').replace(/<\/h4>/g,'</h5>')
  .replace(sectionHeading({title:'주요 메뉴',action:'더보기'}),()=>heading)
  .replace(/<div class="og-thumbnail"[\s\S]*?<\/div>/g,()=>{
   const item=photos[photoIndex++];return renderThumbnail({src:item.image,alt:item.name+' 사진'});
  });
}
export function renderHomeMainMenuScreen({state='basic'}={}){
 const config=states.find(([id])=>id===state);if(!config)throw new RangeError('Unsupported main menu state');
 return `<div class="v2-home-store-frame" data-main-menu-state="${state}" aria-label="${e(config[1])}">${renderHomeStoreContent({availability:{menu:true,reserve:true,wait:true},contentHTML:renderHomeMainMenuSection({items:config[3]}),selectedSection:1,bodyLabel:'주요 메뉴'})}</div>`;
}
const styles=['/v2/components/icon-button.css','/v2/components/media.css','/v2/components/section-heading.css','/v2/home/store.css','/v2/home/main-menu.css'];
function example([state,title,copy]){
 return `<figure class="v2-home-search-example"><figcaption><h3>${e(title)}</h3><p>${e(copy)}</p></figcaption><div class="v2-home-search-host v2-home-main-menu-host"><template data-main-menu-template>${styles.map(href=>`<link rel="stylesheet" href="${href}">`).join('')}${renderHomeMainMenuScreen({state})}</template></div></figure>`;
}
export function renderHomeMainMenuReview(){
 return `<section id="main-menu" data-review-screen hidden aria-labelledby="main-menu-title"><h2 id="main-menu-title">주요 메뉴</h2><p class="v2-intro">매장 상세에서 메뉴 이름·설명·가격을 살펴보는 영역입니다. 더보기와 메뉴 선택은 실제 서비스에 연결하지 않습니다.</p>${example(states[0])}<details class="v2-home-search-extra v2-home-main-menu-extra"><summary>표시 조건 비교</summary>${example(states[1])}</details></section>`;
}
export function setupHomeMainMenuReview(root){
 const section=root.querySelector('#main-menu');if(!section)return;
 const extra=section.querySelector('details');
 const mount=hosts=>{
  for(const host of hosts){
   if(host.shadowRoot)continue;
   const template=host.querySelector('template'),shadow=host.attachShadow({mode:'open'});
   shadow.append(template.content.cloneNode(true));template.remove();setupMedia(shadow);
  }
 };
 const activate=()=>{if(section.hidden)return;mount([section.querySelector('.v2-home-main-menu-host')]);if(extra.open)mount(extra.querySelectorAll('.v2-home-main-menu-host'));};
 new MutationObserver(activate).observe(section,{attributes:true,attributeFilter:['hidden']});
 extra.addEventListener('toggle',activate);activate();
}
