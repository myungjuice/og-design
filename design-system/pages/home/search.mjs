import {homeScreen} from './render.mjs';
import {searchField} from '../../components/search/render.mjs';
import {listRow} from '../../components/list-row/render.mjs';
import {iconButton} from '../../components/button/render.mjs';
import {icon} from '../../components/core.mjs';
const imageRoot='https://og-familystore-image.s3.ap-northeast-2.amazonaws.com/ogapp/';
const emptyImage=(file,alt)=>'<img class="og-search-empty-art" src="'+imageRoot+file+'" alt="'+alt+'">';
const emptyGroup=(file)=>'<div class="og-search-empty-group"><img src="'+imageRoot+file+'" alt="" width="30" height="30"><span>검색 결과가 없습니다.</span></div>';
const resultRow=(title,description)=>listRow({title,description,interactive:false});
function resultGroup(title,body){return '<section class="og-home-result-group"><div class="og-home-result-heading"><h4>'+title+'</h4>'+icon('expand_less')+'</div>'+body+'</section>';}
export function searchScreen({state='history'}={}){
 const query=['history','empty-history'].includes(state)?'':'성수';
 let content='';
 if(state==='history')content=['성수','카페','서울숲'].map(title=>'<div class="og-home-history-row">'+resultRow(title,'')+iconButton({name:'close',label:title+' 검색어 삭제'})+'</div>').join('');
 else if(state==='empty-history')content=emptyImage('empty_history.jpg','검색 기록 없음');
 else if(state==='empty-results')content=emptyImage('empty_result.png','검색 결과 없음');
 else{
  const stores=state==='region-only'?emptyGroup('no_store.png'):resultRow('회원점명 성수점','서울특별시 성동구 도로명 주소')+resultRow('다른 회원점 성수점','서울특별시 성동구 도로명 주소');
  const regions=state==='store-only'?emptyGroup('no_region.png'):resultRow('성수역','서울 성동구 성수동2가')+resultRow('성수동','서울 성동구 성수동1가');
  content=resultGroup('오지스토어 검색 결과',stores)+resultGroup('지역 검색 결과',regions);
 }
 const overlay='<div class="og-home-search-overlay"><div class="og-home-search-field">'+iconButton({name:'arrow_back',label:'검색 닫기'})+searchField({label:'매장 검색',value:query,placeholder:'매장명으로 검색해 주세요.'})+(query?iconButton({name:'close',label:'검색어 지우기'}):'')+'</div><div class="og-home-search-panel">'+content+'</div></div>';
 return homeScreen().replace('class="og-home"','class="og-home og-home-search"').replace('data-home-state="default"','data-home-state="search-'+state+'"').replace('<div class="og-home-map">','<div class="og-home-map">'+overlay);
}
export const searchStates=[['history','최근 검색어','최근 검색어를 위에서부터 보여주고 항목마다 삭제 버튼을 둡니다.'],['results','검색 결과','매장과 지역을 나눠 보여줍니다. 이름 아래에는 주소를 배치했습니다.'],['store-only','매장 결과만 있을 때','지역 결과 영역에는 기존의 빈 결과 안내를 표시합니다.'],['region-only','지역 결과만 있을 때','매장 결과 영역에는 기존의 빈 결과 안내를 표시합니다.'],['empty-history','검색 기록이 없을 때','기존 앱에서 사용하는 빈 검색 기록 이미지를 유지했습니다.'],['empty-results','검색 결과가 없을 때','두 종류의 결과가 모두 없으면 기존 빈 결과 이미지를 표시합니다.']];
export function searchBoard(){return searchStates.map(([state,title,copy])=>'<section class="og-home-example"><h3>'+title+'</h3><div class="screen-page-content"><div class="screen-artboard">'+searchScreen({state})+'</div><div class="screen-design-notes"><p>'+copy+'</p></div></div></section>').join('');}
export const searchPrompt='홈 검색 시안을 첨부 캡처와 CSS로 구현하세요. 별도 새 화면이 아닌 기존 my_navermap.dart buildFloatingSearchBar 위의 검색 패널입니다. 기획 표기03페이지/PPT4번째에는 검색바 유지가 명시되어 있고 상세 검색 변경은 없습니다. 기존 _getSearchResultWidget, _historyResultWidget, _searchResultWidget 조건과 기능·문구를 유지합니다. 제출 전에는 검색 기록을 최신순으로 표시하고 입력 중에는 contains로 기록만 필터합니다. 기록이 있지만 필터 결과가 없으면 기존처럼 빈 목록입니다. 추천 검색·전체 삭제·자동완성 서버조회·썸네일·거리·결과 개수는 추가하지 않습니다. 2글자 이상 제출 시 기존 매장명/키워드 검색과 Kakao 지역검색을 실행하고 마지막 지도 위치 기준 거리순을 유지합니다. 두 결과 그룹은 처음에 모두 펼칩니다. 한쪽만 비면 no_store/no_region 이미지와 검색 결과가 없습니다.를 표시하고 양쪽 모두 비면 emptyResultUrl 이미지만 표시합니다. 기록 자체가 없으면 emptyHistoryUrl입니다. 원본 이미지는 lib/7_constants/image_urls.dart를 유지합니다. 매장 선택은 zoom15 지도 이동+onMarkerTapped, 지역 선택은 zoom15 지도 이동, 둘 다 검색어 지우기와 검색 닫기를 유지합니다. Backspace/빈 제출/검색창 열기 시 패널 닫기 등 기존 동작도 유지합니다. 캔버스 상태는 키보드를 생략한 정적 예시이며 실제 앱의 키보드/스크롤 대응을 제거하지 않습니다. 예시 매장과 주소는 배치용입니다. 공통 searchField/listRow/iconButton과 OG 토큰을 재사용하세요. 렌더러 design-system/pages/home/search.mjs, CSS search.css. 시안에서는 입력·삭제·검색·패널접기를 실행하지 않습니다.';
