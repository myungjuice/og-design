import {storeScreen} from './store.mjs';
import {sectionHeading} from '../../components/section-heading/render.mjs';
import {thumbnail} from '../../components/avatar/render.mjs';
import {escapeHTML as e} from '../../components/core.mjs';
export function mainMenuSection({items=[]}={}){
 if(!items.length)return '';
 return '<section class="og-main-menu">'+sectionHeading({title:'주요 메뉴',action:'더보기'})+'<div class="og-main-menu-list">'+items.slice(0,4).map(item=>'<article class="og-main-menu-row"><div class="og-main-menu-copy"><h4>'+e(item.name)+'</h4>'+(item.description?'<p class="og-main-menu-description">'+e(item.description)+'</p>':'')+'<p class="og-main-menu-price">'+e(item.priceText!==undefined&&item.priceText!==''?item.priceText:Number(item.price).toLocaleString('ko-KR'))+'</p></div>'+(item.image?thumbnail({src:item.image,alt:item.name+' 사진'}):'')+'</article>').join('')+'</div></section>';
}
export function mainMenuScreen({imageSrc='',store={},items:registeredItems}={}){
 const items=registeredItems??[{name:'메뉴명',description:'메뉴에 대한 설명',price:12000,image:imageSrc},{name:'사진이 없는 메뉴',description:'메뉴에 대한 설명',price:8000},{name:'설명이 없는 메뉴',price:6500,image:imageSrc},{name:'가격 문구가 있는 메뉴',price:0,priceText:'시가'}];
 return storeScreen({...store,menu:true,reserve:true,wait:true,contentHTML:mainMenuSection({items}),selectedSection:1});
}
export function mainMenuBoard({imageSrc='',store={},items}={}){return '<div class="screen-page-content"><div class="screen-artboard">'+mainMenuScreen({imageSrc,store,items})+'</div><div class="screen-design-notes"><h3>최대 네 개</h3><p>주요 메뉴는 네 개까지 보여주고, 더보기로 전체 메뉴를 확인합니다.</p><h3>있는 정보만 표시</h3><p>사진이 없으면 글 영역을 넓히고, 설명이 없으면 해당 줄을 생략합니다.</p><h3>가격 문구 유지</h3><p>등록된 가격 문구가 있으면 숫자 가격 대신 보여줍니다.</p></div></div>';}
export const mainMenuPrompt='매장 상세 주요 메뉴 영역을 캡처와 CSS로 구현하세요. 기존 lib/0_pages/01_home/shop_panel_items/shop_contents.dart의 _getMainMenuItemList/_getMenuItemNative를 유지하고 스타일만 변경합니다. showAllInfo&&mainMenuList.isNotEmpty일 때만 섹션과 메뉴 탐색항목을 표시합니다. 목록은 기존순서 최대4개입니다. 메뉴명, 있을 때만 설명 한줄 말줄임, 가격 순서이며 사진이 있을 때만 오른쪽93x93에 표시합니다. 없으면 사진대체이미지나 빈사진칸을 새로 만들지 않습니다. menuPriceText가 빈문자열이 아니면 그대로 우선표시하고 아니면 menuPrice를 천단위 쉼표로 표시합니다. 원 단위·할인·인기·추천·주문버튼을 추가하지 않습니다. 메뉴행 onTap 내부는 현재 주석 처리되어 주문으로 연결하지 않습니다. 더보기는 기존 lib/0_pages/01_home/store_menu.dart의 StoreMenu(storeNo)이며 이번 시안은 전체 메뉴 페이지가 아닙니다. 탐색은 본문 섹션 이동입니다. 이번 화면은 주요메뉴 영역 비교이며 앞선 매장사진·소개나 뒤의 예약/리뷰영역을 삭제하라는 뜻이 아닙니다. 공통 storeScreen/sectionHeading/thumbnail 및 OG토큰을 재사용하고 실제이동은 캔버스에서 구현하지 않습니다. 렌더러 design-system/pages/home/main-menu.mjs, CSS main-menu.css. 예시 메뉴명·가격·이미지는 표시조건 비교용이며 실제데이터는 MenuModel을 사용합니다.';
