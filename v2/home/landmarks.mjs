import {renderBestStoreFeedbackComparison} from './feedback-20261023.mjs';

export function renderHomeLandmarkReview(){
 return `<section id="home-landmarks" class="home-landmark-review" data-review-screen hidden aria-labelledby="home-landmarks-title"><h2 id="home-landmarks-title">랜드마크 매장 표시 비교</h2>${renderBestStoreFeedbackComparison()}</section>`;
}
