import {renderApprovedStoreReview} from './store-markers.mjs';

export function renderHomeLandmarkReview(){
 return `<section id="home-landmarks" class="home-landmark-review" data-review-screen hidden aria-labelledby="home-landmarks-title"><h2 id="home-landmarks-title">랜드마크 매장 · 확정 시안</h2>${renderApprovedStoreReview('best')}</section>`;
}
