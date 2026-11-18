import {renderFinalLandmarkReview} from './landmark-final.mjs';

export function renderHomeLandmarkReview(){
 return `<section id="home-landmarks" class="home-landmark-review" data-review-screen hidden aria-labelledby="home-landmarks-title"><h2 id="home-landmarks-title">랜드마크 매장 · 최종 시안</h2><p class="landmark-comparison-note">노란 네온 왕관의 링이 핀 머리를 앞뒤로 감싸도록 배치했습니다. 선택 시 핀과 왕관이 함께 1.4배 커집니다.</p>${renderFinalLandmarkReview({wrapped:true})}</section>`;
}
