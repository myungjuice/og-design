// 10/29 feedback: three categories, the purple section-card direction, current photos.
const base='/assets/figma-ogpark-20261028/';
const categories=[
 ['한식','a7e68.png','27352.svg','357'],
 ['카페/베이커리','0366b.png','deec4.svg','163'],
 ['헤어/뷰티','f968b.png','59657.svg','15']
];

export function renderFeedbackParkInterests(){
 return `<section class="park-interests park-interests-feedback"><header><h4><svg class="park-interest-heart" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20S3 14.5 3 8.5C3 3.8 9 2.5 12 7c3-4.5 9-3.2 9 1.5C21 14.5 12 20 12 20Z"/></svg>내 관심 업종</h4><span>수정하기 ›</span></header><div class="park-feedback-categories">${categories.map(([label,photo,icon,count])=>`<article class="park-feedback-category" aria-label="${label} · 매장 ${count}개"><img class="park-feedback-photo" src="${base+photo}" width="102" height="156" alt="" aria-hidden="true"><div class="park-feedback-category-name"><span class="park-feedback-category-icon"><img src="${base+icon}" width="20" height="20" alt="" aria-hidden="true"></span><strong>${label}</strong></div><p class="park-feedback-category-count">매장 <strong>${count}</strong>개</p></article>`).join('')}</div></section>`;
}
