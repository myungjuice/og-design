import {renderApprovedStoreReview} from './store-markers.mjs';
import {renderLatestLandmarkReview} from './landmark-figma.mjs';

export function renderHomeLandmarkReview(){
 return `<section id="home-landmarks" class="home-landmark-review" data-review-screen hidden aria-labelledby="home-landmarks-title"><h2 id="home-landmarks-title">랜드마크 매장 · 2차 피드백 반영</h2><p class="landmark-comparison-note">네온 라인을 노란색으로 바꾸고, 수정 왕관의 오른쪽 위 위치와 각도를 적용했습니다. 얇은 주황 외곽선으로 밝은 지도 위에서도 구분되도록 했습니다.</p><div class="landmark-crown-comparison">${renderLatestLandmarkReview({crownStyle:'neon'})}${renderLatestLandmarkReview({crownStyle:'gold-neon'})}</div><p class="landmark-comparison-note">핀 그림과 크기는 동일합니다. 오른쪽 반영안의 왕관은 핀 뒤에 배치했습니다.</p><h3>이전 왕관 시안</h3><div class="landmark-crown-comparison">${renderLatestLandmarkReview()}${renderApprovedStoreReview('best')}</div></section>`;
}
