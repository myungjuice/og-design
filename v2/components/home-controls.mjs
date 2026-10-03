import {renderHomeSearch,renderHomeCategories} from '../../screens/my-info-3d-test/home-controls.mjs';
import {renderBottomNavigation} from '../../screens/my-info-3d-test/navigation.mjs';
const assetBase='/screens/my-info-3d-test/media/figma/';
const samples=[
 ['search','매장 검색바','매장명을 입력하고 검색 버튼을 눌러볼 수 있습니다.',()=>renderHomeSearch({assetBase,id:'component-store-search'})],
 ['categories','업종 카테고리','업종별 선택 상태를 확인합니다. 좁은 화면에서는 옆으로 넘겨볼 수 있습니다.',()=>renderHomeCategories({assetBase})],
 ['navigation','하단 메뉴','현재 메뉴는 아이콘 배경과 밑줄로 구분합니다. 메뉴를 눌러 선택 표시를 비교해 보세요.',()=>renderBottomNavigation({assetBase,home:true,active:'홈'})]
];
export function renderHomeControlSamples(){
 return samples.map(([id,title,description,render])=>`<section class="v2-component-section" id="${id}" aria-labelledby="${id}-title"><h2 id="${id}-title">${title}</h2><p>${description}</p><div class="v2-home-component" data-home-component="${id}"><template>
 <link rel="stylesheet" href="/screens/my-info-3d-test/styles.css">
 <link rel="stylesheet" href="/screens/my-info-3d-test/home.css">
 <link rel="stylesheet" href="/v2/components/screen.css">
 <link rel="stylesheet" href="/v2/components/bottom-navigation.css">
 <link rel="stylesheet" href="/v2/components/home-controls.css">
 <div class="component-stage component-stage-${id}">${render()}</div>
 </template></div></section>`).join('')+'<p class="v2-home-component-status" role="status" aria-live="polite">검색과 메뉴 선택은 이 페이지에서만 확인하며, 실제 서비스로 연결하지 않습니다.</p>';
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
    :'업종 더 보기 버튼을 눌렀습니다. 실제 업종 목록은 열리지 않습니다.';
  });
 }
}
