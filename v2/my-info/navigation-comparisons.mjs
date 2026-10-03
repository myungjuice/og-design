import {renderBottomNavigation} from '../../screens/my-info-3d-test/navigation.mjs';

const variants=[['underline','A안 · 짧은 밑줄형','아이콘 받침 없이, 진한 보라색 아이콘과 짧은 밑줄로 선택을 표시합니다.'],['label-chip','B안 · 메뉴명 칩형','아이콘 받침 없이, 메뉴명에만 보라색 칩을 붙여 선택을 표시합니다.']];

export function renderNavigationComparisons(){
 return `<aside class="v2-nav-comparisons" id="navigation-comparisons" aria-labelledby="navigation-comparisons-title">
 <h2 id="navigation-comparisons-title">하단 메뉴 선택 표시</h2>
 ${variants.map(([variant,title,copy])=>`<section class="v2-nav-comparison" data-variant="${variant}">
 <h3>${title}</h3><p>${copy}</p>
 <div class="v2-nav-comparison-host"><template data-nav-template>
 <link rel="stylesheet" href="/screens/my-info-3d-test/styles.css">
 <link rel="stylesheet" href="/v2/my-info/navigation-comparisons.css">
 <div class="v2-nav-sample" data-variant="${variant}">${renderBottomNavigation({assetBase:'/screens/my-info-3d-test/media/figma/'})}</div>
 </template></div></section>`).join('')}
 <p class="v2-nav-comparison-note">메뉴를 눌러 선택 표시만 비교하며 실제 화면으로 이동하지 않습니다.</p>
 <p class="v2-nav-comparison-status" role="status" aria-live="polite"></p>
 </aside>`;
}

export function setupNavigationComparisons(root){
 const status=root.querySelector('.v2-nav-comparison-status');
 for(const host of root.querySelectorAll('.v2-nav-comparison-host')){
  const template=host.querySelector('template'),sample=host.attachShadow({mode:'open'});
  sample.append(template.content.cloneNode(true));template.remove();
  const title=host.closest('section').querySelector('h3').textContent;
  sample.querySelector('nav').setAttribute('aria-label',`${title} 비교 메뉴`);
  sample.addEventListener('click',event=>{
   const button=event.target.closest('.nav-item');
   if(!button)return;
   if(button.classList.contains('nav-barcode')){
    status.textContent=`${title}: 바코드는 기존 중앙 버튼을 유지합니다. 실제 화면으로 이동하지 않습니다.`;
    return;
   }
   for(const item of sample.querySelectorAll('.nav-item')){
    item.classList.toggle('is-selected',item===button);
    if(item===button)item.setAttribute('aria-current','page');else item.removeAttribute('aria-current');
   }
   status.textContent=`${title}: '${button.dataset.preview}' 선택 표시를 비교 중입니다. 실제 화면으로 이동하지 않습니다.`;
  });
 }
}
