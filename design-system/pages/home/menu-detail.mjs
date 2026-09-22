import {escapeHTML as e} from '../../components/core.mjs';
import {iconButton} from '../../components/button/render.mjs';
import {thumbnail} from '../../components/avatar/render.mjs';
import {radio,checkbox} from '../../components/selection/render.mjs';
import {badge} from '../../components/badges/render.mjs';

export function menuDetailScreen({name='메뉴명',description='메뉴에 대한 설명',imageSrc='',price=12000,priceText='',options=[],scrolled=false}={}){
 const photo=imageSrc&&!scrolled;
 const back=iconButton({name:'arrow_back_ios',label:'뒤로'});
 const formatted=priceText||Number(price).toLocaleString('ko-KR')+' 원';
 const heading='<header class="og-menu-detail-heading">'+(scrolled?back:'')+'<div><h2>'+e(name)+'</h2><p>'+e(description.replace(/[\n\r]/g,' '))+'</p></div></header>';
 const base='<section class="og-menu-detail-price"><div class="og-menu-detail-section-heading"><h3>가격</h3>'+badge({label:'필수',tone:'info'})+'</div><div class="og-menu-detail-row">'+radio({label:'기본',checked:true})+'<strong>'+e(formatted)+'</strong></div></section>';
 const extra=options.length?'<section class="og-menu-detail-options"><div class="og-menu-detail-section-heading"><h3>추가</h3>'+badge({label:'선택'})+'</div>'+options.map(option=>'<div class="og-menu-detail-row">'+checkbox({label:option.name,checked:!!option.selected})+'<strong>+'+e(Number(option.price).toLocaleString('ko-KR'))+' 원</strong></div>').join('')+'</section>':'';
 return '<div class="og-menu-detail" inert data-scrolled="'+scrolled+'">'+(photo?'<div class="og-menu-detail-photo">'+thumbnail({src:imageSrc,alt:name+' 사진'})+back+'</div>':!scrolled?'<div class="og-menu-detail-no-photo">'+back+'</div>':'')+heading+'<div class="og-menu-detail-body">'+base+extra+'</div></div>';
}
export function menuDetailBoard({imageSrc='',item}={}){
 const options=[{name:'추가 옵션명',price:1000},{name:'다른 옵션명',price:2000}];
 return '<div class="screen-page-content"><div>'+(item?'<section class="screen-state-example"><h3>등록된 메뉴</h3><div class="screen-artboard">'+menuDetailScreen({...item,imageSrc:item.detailImage||item.image})+'</div></section>':'')+[
 [item?'옵션 배치 예시 · 사진과 추가 옵션이 있을 때':'사진과 추가 옵션이 있을 때',{imageSrc,options}],
 ['스크롤 후 · 옵션을 선택했을 때',{imageSrc,scrolled:true,options:options.map((o,i)=>({...o,selected:i===0}))}],
 ['사진과 추가 옵션이 없을 때',{priceText:'시가'}]
 ].map(([label,props])=>'<section class="screen-state-example"><h3>'+label+'</h3><div class="screen-artboard">'+menuDetailScreen({...item,...props,...(item?{name:item.name,description:item.description,price:item.price,priceText:item.priceText,imageSrc:props.imageSrc?(item.detailImage||item.image):''}:{})})+'</div></section>').join('')+'</div><div class="screen-design-notes"><h3>메뉴 정보</h3><p>사진 아래에 메뉴명과 설명을 배치하고, 가격과 추가 옵션을 구분선으로 나눕니다.</p><h3>선택 표시</h3><p>기본 가격은 선택된 라디오로, 추가 옵션은 체크박스로 보여줍니다.</p><h3>사진이 없을 때</h3><p>사진 영역을 줄이고 메뉴명과 설명을 위로 올립니다.</p></div></div>';
}
export const menuDetailPrompt='기존 메뉴 상세 StoreMenuDetail의 구성과 문구를 유지하며 캡처와 CSS로 스타일만 변경하세요. 기존 코드 lib/0_pages/01_home/store_menu_detail.dart 및 lib/9_database/92_database_model/qorder_cart_model.dart의 initOrder를 기준으로 합니다. 전체 메뉴 대표카드/일반목록/검색결과 선택으로 진입합니다. 사진·메뉴명·설명·가격/필수·기본 라디오·추가/선택·옵션 체크박스 순서를 유지합니다. menuUrlThumbnail이 비면 대체 이미지없이 헤더 높이를 줄입니다. 스크롤하면 사진이 접히며 이름과 설명 및 뒤로가기가 남습니다. 설명의 줄바꿈은 공백으로 치환합니다. 기본 라디오는 항상 선택상태입니다. menuPriceText가 있으면 그대로 표시하고 숫자가격에만 천단위 쉼표와 원 단위를 붙입니다. submenuList가 비면 추가 섹션과 구분선을 생략합니다. 옵션가격은 +숫자 원이며 선택은 기존 submenuCount 0/1 토글을 유지합니다. 이 상세에는 주문/장바구니/수량/합계/별도 품절표시가 없으므로 추가하지 않습니다. 정적 시안에서 실제 토글·이동·스크롤연동은 구현하지 않습니다. 공통 iconButton/thumbnail/radio/checkbox/badge와 OG토큰을 재사용하세요. 렌더러 design-system/pages/home/menu-detail.mjs, 스타일 menu-detail.css. 예시 데이터와 사진은 실제 메뉴 정보가 아닙니다.';
