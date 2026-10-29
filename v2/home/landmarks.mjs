import {renderFinalLandmarkReview} from './landmark-final.mjs';
import {renderApprovedStoreReview} from './store-markers.mjs';
import {renderLatestLandmarkReview,renderPreviousLandmarkReview} from './landmark-figma.mjs';

export function renderHomeLandmarkReview(){
 return `<section id="home-landmarks" class="home-landmark-review" data-review-screen hidden aria-labelledby="home-landmarks-title"><h2 id="home-landmarks-title">랜드마크 매장 · 최종 피드백 반영</h2><p class="landmark-comparison-note">노란 네온·주황 외곽선을 유지하고 왕관을 핀 앞 레이어의 오른쪽 위에 약 25°로 얹었습니다. 미선택 원형과 선택 물방울 핀에 같은 비율로 적용했습니다.</p><div class="landmark-crown-comparison">${renderPreviousLandmarkReview()}${renderFinalLandmarkReview()}</div><p class="landmark-comparison-note">최종 반영안은 실제 앱의 핀 이미지를 사용합니다. 선택 시 핀과 왕관이 함께 1.4배 커집니다.</p><h3>이전 왕관 시안</h3><div class="landmark-crown-comparison">${renderLatestLandmarkReview()}${renderApprovedStoreReview('best')}</div></section>`;
}
