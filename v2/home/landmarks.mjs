import {renderFinalLandmarkReview} from './landmark-final.mjs';
import {renderApprovedStoreReview} from './store-markers.mjs';
import {renderLatestLandmarkReview} from './landmark-figma.mjs';

export function renderHomeLandmarkReview(){
 return `<section id="home-landmarks" class="home-landmark-review" data-review-screen hidden aria-labelledby="home-landmarks-title"><h2 id="home-landmarks-title">랜드마크 매장 · 4차 피드백 반영</h2><p class="landmark-comparison-note">왕관 링의 뒤쪽은 핀 뒤로 가리고 앞쪽은 핀 앞으로 지나가도록 나눴습니다. PDF의 B안처럼 왕관을 조금 왼쪽·위로 옮기고 약 28°로 기울였습니다.</p><div class="landmark-crown-comparison">${renderFinalLandmarkReview()}${renderFinalLandmarkReview({wrapped:true})}</div><p class="landmark-comparison-note">최종 반영안은 실제 앱의 핀 이미지를 사용합니다. 선택 시 핀과 왕관이 함께 1.4배 커집니다.</p><h3>이전 왕관 시안</h3><div class="landmark-crown-comparison">${renderLatestLandmarkReview()}${renderApprovedStoreReview('best')}</div></section>`;
}
