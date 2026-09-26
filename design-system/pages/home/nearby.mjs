import {homeScreen} from './render.mjs';
import {publicStoreData} from './public-store-data.mjs';
import {bottomSheet} from '../../components/sheet/render.mjs';
import {thumbnail} from '../../components/avatar/render.mjs';
import {button} from '../../components/button/render.mjs';
import {escapeHTML as e,icon} from '../../components/core.mjs';
const noImage='https://og-familystore-image.s3.ap-northeast-2.amazonaws.com/ogapp/no_image.png';
export function nearbyCard({name='회원점명',promotion='',images=[]}={}){return '<article class="og-nearby-card"><div class="og-nearby-photo">'+thumbnail({src:images[0]||noImage,alt:name+' 매장 사진'})+'<span class="og-nearby-count">'+(images.length?1:0)+' · '+images.length+'</span></div><div class="og-nearby-card-heading"><h3>'+e(name)+'</h3>'+button({label:'방문하기',variant:'text'})+'</div><p class="og-nearby-promotion">'+e(promotion)+'</p></article>';}
export function nearbyScreen({state='list',region='망원동'}={}){
 const store=publicStoreData.store;
 const body=state==='empty'?'<div class="og-nearby-empty">'+icon('search_off')+'<p>2Km 이내에 매장이 없습니다.</p></div>':nearbyCard({...store,images:state==='no-photo'?[]:store.images});
 const panel=bottomSheet({title:region+' 근처 보기',bodyHTML:body,actions:[]}).replace('>'+e(region)+' 근처 보기</h2>','>'+icon('compass_calibration_outlined')+'<span>'+e(region)+' 근처 보기</span></h2>');
 return '<div class="og-nearby-stage" inert>'+homeScreen()+'<div class="og-nearby-overlay">'+panel+'</div></div>';
}
export function nearbyBoard(){return [['list','근처 회원점 목록','오시 망원본점의 공개 매장명·소개 문구·사진 10장을 저장된 개발 DB 자료에서 연결했습니다. 실시간 반경 조회 결과는 아닙니다.'],['no-photo','매장 사진이 없을 때','동일 매장의 사진을 숨긴 상태 예시입니다. 실제 사진이 없는 매장이라는 뜻은 아닙니다.'],['empty','근처에 매장이 없을 때','빈 목록 상태를 확인하기 위한 예시입니다.']].map(([state,title,copy])=>'<section class="og-home-example"><h3>'+title+'</h3><div class="screen-page-content"><div class="screen-artboard">'+nearbyScreen({state})+'</div><div class="screen-design-notes"><p>'+copy+'</p></div></div></section>').join('');}
export const nearbyPrompt='홈 근처 보기를 첨부 캡처와 CSS로 구현하세요. 기존 lib/0_pages/01_home/near_panel.dart와 home.dart/my_navermap.dart의 흐름을 유지합니다. 현 지도 위치 둘러보기는 지도 중심2000m 조회 및 위치주소를 제목으로 사용하며 제목은 지역명+근처 보기입니다. 마커 개별 상세가 아닌 목록 패널이며 현재 onMapEvent의0.8 펼침과0.65 스냅, 하단메뉴숨김, 드래그닫기를 유지합니다. 일반 모달의 닫기X·완료·바깥스크림을 추가하지 마세요. 목록은 사진높이350, 사진슬라이드/탭확대, 현재사진수/전체사진수, 매장명, 방문하기, promotionTitle 순서입니다. 사진0개일 때 기존 noImageUrl 및0/0 표기를 유지합니다. 스타일에서 카운터 구분자만 가운데점으로 표현했습니다. StoreImageView의 사진선택확대·스와이프·인덱스리셋을 유지하고 사진단위 확대는 기존 StorePicturePage입니다. 방문하기는 매장정보 및 필요한 웨이팅정보 조회 후 ShopPanel로 이동하며 로딩차단/네트워크오류 안내를 유지합니다. 빈 목록은 search_off와 2Km 이내에 매장이 없습니다. 그대로입니다. 기획 표기03/PPT4의 오픈일·리뷰키워드는 권장안이므로 이번에 추가하지 않습니다. 주소·거리·평점·별점·NEW·정렬·필터·새CTA도 추가하지 않습니다. 기본 시안은 2026-09-20 개발 DB 공개 스냅샷의 오시 망원본점 매장명·promotion·사진을 사용합니다. 망원동 목록은 실시간 반경 조회 결과가 아니며 사진없음·빈목록은 상태 예시입니다. 실제 앱은 NearStoreModel을 사용합니다. 공통 homeScreen/bottomSheet/thumbnail/button과 토큰을 재사용하고 정적 시안에서는 스와이프·이동·조회·확대를 실행하지 않습니다. 렌더러 design-system/pages/home/nearby.mjs, CSS nearby.css.';
