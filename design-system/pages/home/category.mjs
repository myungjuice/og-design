import {homeScreen} from './render.mjs';
import {bottomSheet} from '../../components/sheet/render.mjs';
import {chip} from '../../components/tabs-chips/render.mjs';
import {categoryItems,cafePin} from './category-assets.mjs';
export function categoryScreen({state='open'}={}){
 if(state==='selected')return homeScreen({selectedCategory:'카페/베이커리',markerSrc:cafePin});
 const choices=categoryItems.map(item=>chip({label:item.name,attributes:{'data-category-id':item.id},className:'og-category-chip'}).replace('>'+item.name+'</button>','><img src="'+item.image+'" alt="" width="16" height="16">'+item.name+'</button>')).join('');
 const sheet=bottomSheet({title:'업종 선택',bodyHTML:'<div class="og-category-options">'+choices+'</div>',actions:[]});
 return '<div class="og-category-stage" inert>'+homeScreen()+'<div class="og-category-overlay"><div class="og-category-scrim"></div>'+sheet+'</div></div>';
}
export function categoryBoard(){return [['open','업종 선택창','기존 아이콘과 순서를 유지했습니다. 항목을 선택하면 바로 지도에 적용됩니다.'],['selected','카페/베이커리를 선택했을 때','선택한 업종이 네 번째 칩에 나타나고, 해당 업종의 회원점만 지도에 표시됩니다.']].map(([state,title,copy])=>'<section class="og-home-example"><h3>'+title+'</h3><div class="screen-page-content"><div class="screen-artboard">'+categoryScreen({state})+'</div><div class="screen-design-notes"><p>'+copy+'</p></div></div></section>').join('');}
export const categoryPrompt='홈 업종 선택을 첨부 캡처와 CSS로 구현하세요. 기존 lib/0_pages/01_home/category_selection.dart 및 my_navermap.dart의 카테고리 바/선택 시트/마커 필터를 유지하고 스타일만 적용합니다. 기획 표기03페이지/PPT4번째는 카테고리 칩 유지이며 상세 선택창 개편은 없습니다. 전체 포함13개, store_category.dart 순서와 CI*.png 아이콘을 유지합니다. 다중선택·확인·선택완료·검색·추천·새 분류를 추가하지 않습니다. 단일 선택 시 pop후 _selectedCategory 변경/_resetMarkers를 유지합니다. 시트는 기존 초기·최대40%와 스크롤/드래그닫기/바깥눌러닫기를 유지합니다. 시트 자체에는 현재 선택 강조가 원래 없으므로 새 체크표시를 만들지 않습니다. 기본 상단4칩 전체·한식·중식·일식에서 4번째 이후 업종을 선택하면 마지막 칩을 해당 업종으로 교체하고 선택 강조합니다. 칩 바는 기존대로 가로스크롤 가능하며 좁은 화면에서 라벨을 줄이거나 줄바꿈하지 않습니다. 예시는 카페/베이커리이며 지도핀은 MCI1006.png입니다. 디자이너 PDF 업종별 신규 색상과 핀변경은 미적용입니다. 공통 bottomSheet/chip/homeScreen/토큰을 재사용합니다. 시안에는 실제 선택/닫기/지도필터 동작을 구현하지 않습니다. 렌더러 design-system/pages/home/category.mjs, CSS category.css. 지도와 회원점은 정적 배치 예시입니다.';
