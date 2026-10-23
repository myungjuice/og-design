import {renderNewStoreFeedbackComparison} from './feedback-20261023.mjs';

// Shared overview fixtures are independent of the comparison gallery.
export const homeNewStoreExamples=['파샤도 망원','세븐일레븐'];

export function renderHomeNewStoresReview(){
 return `<section id="home-new-stores" class="home-new-review" data-review-screen hidden aria-labelledby="home-new-stores-title"><h2 id="home-new-stores-title">신규 회원점 표시 비교</h2>${renderNewStoreFeedbackComparison()}</section>`;
}
