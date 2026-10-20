import {renderFigmaHomeSearch,renderFigmaHomeCategories} from '../home/figma-home.mjs';
import {renderFigmaNavigation} from './figma-navigation.mjs';
import {applyReceivedIcons} from '../received-icons.mjs';
const samples=[
 ['search','매장 검색바','홈과 동일한 검색바입니다. 검색 아이콘 20px, 우측 현 위치 아이콘 24px, 높이 48px을 공통 기준으로 사용합니다.',()=>renderFigmaHomeSearch({id:'component-store-search'})],
 ['categories','업종 카테고리','홈과 동일한 30px 칩과 고정 더보기 버튼입니다. 미선택 상태가 전체보기이며 별도 전체 칩은 사용하지 않습니다.',()=>renderFigmaHomeCategories()],
 ['navigation','하단 메뉴','모든 현재 시안에서 같은 90px 메뉴를 사용합니다. 현재 메뉴는 아이콘 색상과 밑줄로 구분합니다.',()=>renderFigmaNavigation({active:'홈'})]
];
export function renderHomeControlSamples(){
 return applyReceivedIcons(samples.map(([id,title,description,render])=>`<section class="v2-component-section" id="${id}" aria-labelledby="${id}-title" hidden><h2 id="${id}-title">${title}</h2><p>${description}</p><div class="v2-home-component" data-home-component="${id}"><template>
 <link rel="stylesheet" href="/screens/my-info-3d-test/styles.css">
 <link rel="stylesheet" href="/screens/my-info-3d-test/home.css">
 <link rel="stylesheet" href="/v2/components/screen.css">
 <link rel="stylesheet" href="/v2/components/bottom-navigation.css">
 <link rel="stylesheet" href="/v2/home/figma-home.css">
 <link rel="stylesheet" href="/v2/components/home-controls.css">
 <div class="component-stage component-stage-${id}" data-figma-home>${render()}</div>
 </template></div></section>`).join('')+'<p class="v2-home-component-status" role="status" aria-live="polite">검색과 메뉴 선택은 이 페이지에서만 확인하며, 실제 서비스로 연결하지 않습니다.</p>');
}
export function setupHomeControlSamples(root){
 const status=root.querySelector('.v2-home-component-status');
 for(const host of root.querySelectorAll('[data-home-component]')){
  const shadow=host.attachShadow({mode:'open'});
  shadow.append(host.querySelector('template').content.cloneNode(true));
  shadow.querySelector('form')?.addEventListener('submit',event=>{
   event.preventDefault();
   status.textContent='검색 버튼 눌림을 확인했습니다. 실제 매장 검색은 진행되지 않습니다.';
  });
  shadow.addEventListener('click',event=>{
   const category=event.target.closest('[data-category]');
   if(category){
    for(const button of shadow.querySelectorAll('[data-category]'))button.setAttribute('aria-pressed',String(button===category));
    status.textContent=category.dataset.category+' 업종을 선택했습니다.';
    return;
   }
   const nav=event.target.closest('.nav-item');
   if(nav){
    for(const button of shadow.querySelectorAll('.nav-item')){
     button.classList.toggle('is-selected',button===nav);
     if(button===nav)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');
    }
   }
   const action=event.target.closest('[data-preview]');
   if(action)status.textContent=nav
    ?action.dataset.preview+' 선택 표시를 확인했습니다. 실제 화면 이동은 진행되지 않습니다.'
    :action.dataset.preview==='현 위치'?'현 위치 버튼을 눌렀습니다. 실제 GPS는 조회하지 않습니다.':'업종 더 보기 버튼을 눌렀습니다. 실제 업종 목록은 열리지 않습니다.';
  });
 }
}
