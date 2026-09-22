import {escapeHTML as e,icon} from '../../components/core.mjs';
import {iconButton,favorite} from '../../components/button/render.mjs';
import {chip} from '../../components/tabs-chips/render.mjs';
import {searchField} from '../../components/search/render.mjs';
import {thumbnail} from '../../components/avatar/render.mjs';

// Shared by featured cards, category rows and search results. Legacy units differ.
export function menuItem(item,{featured=false}={}){
 const price=item.priceText?item.priceText:Number(item.price).toLocaleString('ko-KR')+(featured?'':' 원');
 const media=item.image?thumbnail({src:item.image,alt:item.name+' 사진'}):'<div class="og-full-menu-image-space" aria-hidden="true">'+(featured?icon('image_not_supported'):'')+'</div>';
 const copy='<div class="og-full-menu-copy"><h4>'+e(item.name)+'</h4><p class="og-full-menu-description">'+e(item.description||'')+'</p><p class="og-full-menu-price">'+e(price)+'</p></div>';
 return '<article class="og-full-menu-item'+(featured?' is-featured':'')+(item.soldOut?' is-sold-out':'')+'"><div class="og-full-menu-item-content">'+(featured?media+copy:copy+media)+'</div>'+(item.soldOut?'<strong class="og-full-menu-sold-out">SOLD OUT</strong>':'')+'</article>';
}
const caution='<section class="og-full-menu-caution"><h3>유의사항</h3><ul><li>메뉴 사진은 연출된 이미지로 실제 조리된 음식과 다를 수 있습니다.</li><li>상단 메뉴 및 가격은 업소에서 제공한 정보를 기준으로 작성되었으며, 변동될 수 있습니다.</li></ul></section>';
export function fullMenuScreen({state='default',imageSrc='',store={},items:registeredItems}={}){
 const scrolled=state==='scrolled',search=state==='search';
 const items=registeredItems??[{name:'메뉴명',description:'메뉴에 대한 설명',price:12000,image:imageSrc},{name:'품절 메뉴',description:'메뉴에 대한 설명',price:8000,image:imageSrc,soldOut:true},{name:'사진이 없는 메뉴',description:'메뉴에 대한 설명',price:6500},{name:'가격 문구가 있는 메뉴',description:'',price:0,priceText:'시가'}];
 const categories=[...new Set(items.map(item=>item.category||'카테고리명'))];
 const featuredItems=registeredItems?items.filter(item=>item.featured):items.slice(0,2);
 const searchTerm=registeredItems?'야끼':'메뉴';
 const header='<header class="og-full-menu-heading">'+(scrolled?iconButton({name:'arrow_back_ios',label:'뒤로'}):'')+'<div><h2>'+e(store.name||'회원점명')+'</h2>'+(!scrolled?'<p>'+e(store.menuPromotion??'매장 소개 문구')+'</p>':'')+'</div>'+favorite()+'</header>';
 const navigation='<nav class="og-full-menu-categories" aria-label="메뉴 카테고리">'+chip({label:'메뉴 검색'})+['대표메뉴',...categories].map((label,i)=>chip({label,selected:i===(scrolled?1:0)})).join('')+'</nav>';
 const featured='<section class="og-full-menu-featured"><h3>대표메뉴</h3><div>'+featuredItems.map(item=>menuItem(item,{featured:true})).join('')+'</div></section>';
 const list=categories.map(category=>'<section class="og-full-menu-list"><h3>'+e(category)+'</h3>'+items.filter(item=>(item.category||'카테고리명')===category).map(item=>menuItem(item)).join('')+'</section>').join('');
 const hero='<div class="og-full-menu-hero">'+thumbnail({src:imageSrc,alt:(store.name||'회원점')+' 대표 이미지'})+iconButton({name:'arrow_back_ios',label:'뒤로'})+'</div>';
 const overlay=search?'<div class="og-full-menu-search-scrim"><section class="og-full-menu-search-panel">'+iconButton({name:'arrow_back_ios',label:'검색 닫기'})+searchField({label:'메뉴 검색',value:searchTerm,placeholder:'메뉴 이름으로 검색해보세요.'})+'<div class="og-full-menu-results">'+(registeredItems?items.filter(item=>item.name.includes(searchTerm)):items.slice(0,2)).map(item=>menuItem(item)).join('')+'</div></section></div>':'';
 return '<div class="og-full-menu" data-state="'+e(state)+'" inert>'+(!scrolled?hero:'')+header+navigation+'<div class="og-full-menu-body">'+(!scrolled?featured:'')+list+caution+'</div>'+overlay+'</div>';
}
export function fullMenuBoard({imageSrc='',store={},items}={}){
 return '<div class="screen-page-content"><div>'+[['default','처음 열었을 때'],['scrolled','아래로 스크롤했을 때'],['search','메뉴 검색 결과']].map(([state,label])=>'<section class="screen-state-example"><h3>'+label+'</h3><div class="screen-artboard">'+fullMenuScreen({state,imageSrc,store,items})+'</div></section>').join('')+'</div><div class="screen-design-notes"><h3>대표메뉴와 목록</h3><p>대표메뉴는 가로 카드로, 전체 메뉴는 카테고리별 목록으로 보여줍니다.</p><h3>스크롤 후</h3><p>매장 사진과 소개가 접히고, 매장명과 카테고리를 상단에 남깁니다.</p><h3>품절 표시</h3><p>메뉴 사진과 글을 흐리게 처리하고 SOLD OUT 문구를 겹쳐 보여줍니다.</p></div></div>';
}
export const fullMenuPrompt='기존 StoreMenu 전체 메뉴 화면의 기능과 문구를 유지하며 첨부 캡처와 CSS로 스타일만 적용하세요. 소스 lib/0_pages/01_home/store_menu.dart. 진입은 매장 상세 주요 메뉴 더보기입니다. 기존 매장 대표사진·회원점명·qorderPromotionTitle·즐겨찾기, 메뉴 검색과 대표메뉴/카테고리 탐색, 대표메뉴 가로카드, 카테고리별 전체목록, 유의사항을 유지합니다. 스크롤하면 사진/소개가 접히며 상단 회원점명과 카테고리가 남습니다. 대표메뉴는 mainMenuList 전체를 쓰며 주요 메뉴의 최대4개 제한을 적용하지 않습니다. 숫자 가격은 대표카드에 단위없이, 일반목록과 검색결과에 원을 붙입니다. menuPriceText가 있으면 우선표시하며 단위는 붙이지 않습니다. 일반목록 사진없음은 빈93px영역을 유지합니다. 대표카드 사진없음은 image_not_supported 아이콘입니다. 품절은 내용을 흐리게 하고 SOLD OUT을 표시하지만 기존 onTap의 StoreMenuDetail 이동은 유지합니다. 검색은 메뉴 이름 contains 조건이며 별도 화면이 아니라 상단 패널과 아래 스크림입니다. 새 주문/장바구니 버튼을 추가하지 않습니다. 정적 시안이므로 실제검색/스크롤연동/이동을 구현하지 않습니다. 공통 iconButton/favorite/chip/searchField/thumbnail과 menuItem 렌더러를 재사용하세요. 구현경로 design-system/pages/home/full-menu.mjs, 스타일 full-menu.css. 샘플 이름·가격·사진은 예시입니다. 검색결과없음·사진없음 등 추가 세부 상태는 이번3상태에 별도 화면으로 포함하지 않았습니다.';
