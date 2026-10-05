import test from 'node:test';
import assert from 'node:assert/strict';
import {renderWorkspace} from '../render.mjs';
import {reviewGroups} from '../subnavigation.mjs';
const module=()=>import('./use-history.mjs').catch(()=>({}));

test('use-history hub is reachable with both related reservation screens ready',()=>{
 const html=renderWorkspace({pageId:'my-info'});
 assert.match(html,/<section id="use-history"[^>]*data-review-screen/);
 const group=reviewGroups('my-info').find(g=>g.id==='history-reservations');
 assert.deepEqual(group.items.map(i=>!!i.pending),[false,false,false,false]);
 assert.equal(group.items[0].id,'use-history');
 assert.equal((html.match(/data-use-state="basic-/g)||[]).length,4);
 assert.equal((html.match(/class="my-info-test"/g)||[]).length,1);
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(new Set(ids).size,ids.length);
});
test('four tab fixtures retain dates, people, amounts and conditional actions',async()=>{
 const {renderUseHistory:render}=await module();assert.equal(typeof render,'function');
 const reservation=render({selected:0});
 assert.match(reservation,/오늘\. 9\.18\(금\) 오후 6:00/);assert.match(reservation,/2명/);assert.match(reservation,/0명/);
 assert.match(reservation,/예약 상세 보기/);assert.match(reservation,/v2-sheet-panel/);assert.match(reservation,/v2-tabs/);
 assert.match(reservation,/v2-selection-switch/);assert.match(reservation,/v2-badge/);assert.match(reservation,/v2-thumbnail/);
 assert.equal((reservation.match(/data-use-record=/g)||[]).length,1);
 const past=render({selected:0,showPast:true});
 assert.equal((past.match(/data-use-record=/g)||[]).length,2);
 assert.equal((past.match(/예약 상세 보기/g)||[]).length,1,'past entered reservation has no detail CTA');
 const waiting=render({selected:1});assert.match(waiting,/25분/);assert.match(waiting,/실시간 웨이팅 보기/);
 const order=render({selected:2,showPast:true});assert.match(order,/18,000 원/);assert.match(order,/9,000 원/);
 assert.equal((order.match(/주문상세/g)||[]).length,2,'completed orders retain details');
 const review=render({selected:3});assert.match(review,/매장이 깔끔하고 편하게 이용했어요/);
 assert.doesNotMatch(review,/과거 내역 보기/);assert.equal((review.match(/aria-label="리뷰 사진 [123]/g)||[]).length,3);
});
test('empty, cancellation, called waiting and review-menu states preserve meaning',async()=>{
 const {renderUseHistory:render}=await module();assert.equal(typeof render,'function');
 for(const selected of [0,1,2,3]){
  const empty=render({selected,empty:true});assert.match(empty,/내역이 없습니다/);
  assert.doesNotMatch(empty,/data-use-record=/);assert.match(empty,/role="tablist"/);
 }
 const cancelled=render({selected:0,state:'supplementary'});assert.match(cancelled,/매장 사정으로 취소/);
 assert.equal((cancelled.match(/매장 사정으로 취소/g)||[]).length,1);assert.doesNotMatch(cancelled,/예약 상세 보기/);
 const called=render({selected:1,state:'supplementary'});assert.match(called,/호출됨/);assert.match(called,/5분/);assert.match(called,/취소시간/);
 assert.equal((called.match(/실시간 웨이팅 보기/g)||[]).length,1);
 const menu=render({selected:3,state:'supplementary'});assert.match(menu,/수정/);assert.match(menu,/삭제/);
 assert.doesNotMatch(menu,/fetch\(|https:\/\//);
 assert.doesNotMatch(menu,/class="v2-use-history-frame" inert|class="v2-sheet-static" inert/,'scrollable preview shell is not inert');
 assert.match(menu,/<button inert/,'static actions stay inactive individually');
 assert.match(menu,/role="region" aria-label="리뷰 내역 · 정적 시안" tabindex="0"/,'body supports keyboard review scrolling');
 for(const selected of [-1,4,1.5])assert.throws(()=>render({selected}),RangeError);
 assert.throws(()=>render({state:'bogus'}),RangeError);
});
