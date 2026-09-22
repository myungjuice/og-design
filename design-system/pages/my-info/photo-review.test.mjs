import test from 'node:test';
import assert from 'node:assert/strict';
import {photoReview,photoReviewBoard} from './photo-review.mjs';
test('review eligibility renders existing actions without filtering cancelled history',()=>{
 const html=photoReview({items:[{date:'9.18(금)',amount:12000,hasReview:false,isCancelled:true},{date:'9.17(목)',amount:9000,hasReview:true,text:'리뷰 본문',photos:[]}]});
 assert.match(html,/12,000원 사용/);assert.match(html,/포토 리뷰 작성/);assert.match(html,/리뷰 완료/);assert.match(html,/내 리뷰: 1회/);assert.match(html,/리뷰 본문/);assert.doesNotMatch(html,/og-photo-images/);
});
test('empty source shows original empty guidance and previsit status',()=>{
 const html=photoReview({items:[]});assert.match(html,/내 리뷰: 0회/);assert.match(html,/방문 전/);assert.match(html,/이 매장에 아직 적립 내역이 없습니다./);assert.match(html,/매장을 이용 후 포토 리뷰를 작성할 수 있어요./);assert.doesNotMatch(html,/포토 리뷰 작성<\/span>/);
});
test('specimens escape text and expose separate static management states',()=>{
 assert.doesNotMatch(photoReview({storeName:'<script>x</script>',items:[]}),/<script>/);
 const html=photoReviewBoard();assert.equal((html.match(/class="og-photo-review"/g)||[]).length,5);assert.match(html,/리뷰를 삭제하시겠습니까/);assert.match(html,/수정/);assert.match(html,/삭제/);
});
