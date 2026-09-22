import test from 'node:test';
import assert from 'node:assert/strict';
import {storeReviewsBoard} from './store-reviews.mjs';
import {reviewPagesBoard} from './review-pages.mjs';
const data={store:{name:'실제 매장',category:'한식',address:'실제 주소'},praise:[{name:'실제 칭찬',count:1,icon:'eco'}],items:[{name:'방문자 1',date:'2026. 7. 25',photoDate:'26.7.25 15:28',text:'등록된 리뷰 본문',images:['https://example.com/food.jpg']}]};
test('actual reviews use supplied store, aggregate and anonymous content before illustrative states',()=>{const html=storeReviewsBoard({publicData:data});for(const text of ['실제 매장','실제 칭찬','방문자 1','등록된 리뷰 본문','food.jpg'])assert.ok(html.includes(text));assert.doesNotMatch(html,/회원 닉네임/);assert.match(html,/상태별 배치 예시/);});
test('review list and photo viewer consume the same anonymous record',()=>{for(const kind of ['list','photo']){const html=reviewPagesBoard(kind,{publicData:data});for(const text of ['실제 매장','방문자 1','등록된 리뷰 본문','food.jpg'])assert.ok(html.includes(text));if(kind==='photo')assert.ok(html.includes('26.7.25 15:28'));}});
