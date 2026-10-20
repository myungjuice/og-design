import {renderDesignerScreen,designerStyles,setupCategoryControls,categoryRows} from '../designer-20261013.mjs';
import {escapeHTML as e} from '../../design-system/components/core.mjs';

const states=[['open','업종 선택 전',`${categoryRows.flat().length}개 업종을 표시합니다. ‘전체’ 대신 선택 초기화로 전체보기를 표현합니다.`],['selected','업종 선택 후','복수 선택·선택 개수·초기화를 동일한 전달 시안으로 비교합니다. 결과 수는 시안 예시입니다.']];
export function renderHomeCategoryScreen({state='open'}={}){
 const config=states.find(([id])=>id===state);if(!config)throw new RangeError('Unsupported home category state');
 return `<div class="v2-home-category-frame" data-home-category-state="${state}" aria-label="${e(config[1])}">${renderDesignerScreen(state==='open'?'category-before':'category-after')}</div>`;
}
function example([state,title,copy]){
 return `<figure class="v2-home-search-example"><figcaption><h3>${e(title)}</h3><p>${e(copy)}</p></figcaption><div class="v2-home-search-host v2-home-category-host"><template data-category-template>${designerStyles('category-before').map(href=>`<link rel="stylesheet" href="${href}">`).join('')}<link rel="stylesheet" href="/v2/home/category.css">${renderHomeCategoryScreen({state})}</template></div></figure>`;
}
export function renderHomeCategoryReview(){
 return `<section id="category" data-review-screen hidden aria-labelledby="category-title"><h2 id="category-title">업종 선택</h2><p class="v2-intro">카테고리 시안과 같은 업종 목록·복수 선택 방식을 사용합니다. 예전 13개 단일 선택안은 현재 기준에서 제외했습니다. 전체 화면형은 ‘카테고리 시안’의 비교안이며, 실제 필터 조회·화면 이동은 실행하지 않습니다.</p>${example(states[0])}<details class="v2-home-search-extra v2-home-category-extra"><summary>선택 후 비교 · 1개</summary>${example(states[1])}</details></section>`;
}
export function setupHomeCategoryReview(root){
 const section=root.querySelector('#category');if(!section)return;
 const extra=section.querySelector('details');
 const mount=hosts=>{for(const host of hosts){if(host.shadowRoot)continue;const template=host.querySelector('template'),shadow=host.attachShadow({mode:'open'});shadow.append(template.content.cloneNode(true));template.remove();shadow.querySelector('form')?.addEventListener('submit',event=>event.preventDefault());setupCategoryControls(shadow);}};
 const activate=()=>{if(section.hidden)return;mount([section.querySelector('.v2-home-category-host')]);if(extra.open)mount(extra.querySelectorAll('.v2-home-category-host'));};
 new MutationObserver(activate).observe(section,{attributes:true,attributeFilter:['hidden']});extra.addEventListener('toggle',activate);activate();
}
