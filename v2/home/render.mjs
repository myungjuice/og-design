import {renderFigmaHome,figmaHomeStyles} from './figma-home.mjs';
import {previewDialog} from '../components/screen-preview.mjs';
export {renderHomeSearchReview} from './search.mjs';
export {renderHomeCategoryReview} from './category.mjs';
export {renderHomeNearbyReview} from './nearby.mjs';
export {renderHomeStoreReview} from './store.mjs';
export {renderHomeMainMenuReview} from './main-menu.mjs';
export {renderHomeFullMenuReview} from './full-menu.mjs';
export {renderHomeMenuDetailReview} from './menu-detail.mjs';
export {renderHomeStoreReservationReview} from './store-reservation.mjs';
export {renderHomeStoreWaitingReview} from './store-waiting.mjs';
export {renderHomeStoreNewsReview} from './store-news.mjs';
export {renderHomeStoreEventReview} from './store-event.mjs';
export {renderHomeNewsListReview} from './news-list.mjs';
export {renderHomeNewsDetailReview} from './news-detail.mjs';
export {renderHomeEventListReview} from './event-list.mjs';
export {renderHomeEventDetailReview} from './event-detail.mjs';
export {renderHomeStoreReviewsReview,renderHomeReviewListReview,renderHomeReviewPhotoReview} from './reviews.mjs';
export {renderHomeStoreInfoReview,renderHomeStoreLocationReview} from './information.mjs';
export {renderHomeStoreShareReview,renderHomeStorePhotoReview,renderHomeStorePraiseReview} from './store-secondary.mjs';

export function renderHomePreview(){
 return `<p class="v2-intro">지도에서 주변 매장을 찾고, 업종별로 탐색하는 화면입니다.</p><p class="v2-intro">공통 구현 기준: 390 × 846 화면에서 검색바 상단 24px·높이 48px, 현 위치 버튼 상단 612px, 둘러보기 상단 678px·높이 34px, 하단 메뉴 높이 90px. 검색·업종·근처보기·바코드의 지도 배경도 같은 컴포넌트를 사용하며, 패널로 가려지는 범위만 다릅니다.</p>
 <div class="v2-screen-stage"><div class="v2-screen-host"><template data-screen-template>
 ${figmaHomeStyles.map(href=>`<link rel="stylesheet" href="${href}">`).join('')}
 ${renderFigmaHome()}${previewDialog}
 </template></div></div>`;
}
