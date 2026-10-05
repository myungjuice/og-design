import {renderHomeTest} from '../../screens/my-info-3d-test/home.mjs';
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
 return `<p class="v2-intro">지도에서 주변 매장을 찾고, 업종별로 탐색하는 화면입니다.</p>
 <div class="v2-screen-stage"><div class="v2-screen-host"><template data-screen-template>
 <link rel="stylesheet" href="/screens/my-info-3d-test/styles.css">
 <link rel="stylesheet" href="/screens/my-info-3d-test/home.css">
 <link rel="stylesheet" href="/v2/home/screen.css">
 <link rel="stylesheet" href="/v2/components/bottom-navigation.css">
 ${renderHomeTest({assetBase:'/screens/my-info-3d-test/media/figma/'})}${previewDialog}
 </template></div></div>`;
}
