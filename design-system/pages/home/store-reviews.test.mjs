import test from 'node:test';
import assert from 'node:assert/strict';
test('praise folds at five, expands to seven, and protects zero counts',async()=>{
 const {praiseSection}=await import('./store-reviews.mjs');const items=Array.from({length:8},(_,i)=>({name:'칭찬'+i,count:0}));
 assert.equal((praiseSection({items}).match(/class="og-praise-row"/g)||[]).length,5);
 assert.equal((praiseSection({items,expanded:true}).match(/class="og-praise-row"/g)||[]).length,7);
 assert.doesNotMatch(praiseSection({items,canReview:false}),/리뷰 작성|NaN|Infinity/);
 assert.doesNotMatch(praiseSection({items:[]}),/더 보기|og-praise-row/);
});
test('reviews cap at two, preserve empty eligibility and collapse blank paragraphs',async()=>{
 const {reviewsSection,reviewCard,storeReviewsBoard}=await import('./store-reviews.mjs');
 assert.match(reviewsSection({canReview:false}),/이 매장을 방문하고/);assert.doesNotMatch(reviewsSection({canReview:false}),/리뷰 작성/);
 assert.match(reviewsSection({canReview:true}),/리뷰 작성/);
 assert.equal((reviewsSection({items:[{},{},{}],canReview:false}).match(/og-store-review-card/g)||[]).length,2);
 assert.match(reviewsSection({items:[{}],canReview:false}),/리뷰 작성/);
 assert.match(reviewCard({text:'첫째\n\n둘째',name:'<이름>'}),/첫째\n둘째/);assert.match(reviewCard({name:'<이름>'}),/&lt;이름&gt;/);
 assert.equal((storeReviewsBoard().match(/class="screen-artboard"/g)||[]).length,4);
});
