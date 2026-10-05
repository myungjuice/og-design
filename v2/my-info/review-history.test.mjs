import test from 'node:test';
import assert from 'node:assert/strict';
import {renderWorkspace} from '../render.mjs';
import {reviewGroups} from '../subnavigation.mjs';
const module=()=>import('./review-history.mjs').catch(()=>({}));
test('review history has its own related group and five source states',()=>{
 const html=renderWorkspace({pageId:'my-info'});
 assert.match(html,/<section id="review-history" data-review-screen/);
 assert.deepEqual(reviewGroups('my-info').find(g=>g.id==='history-reviews')?.items.map(i=>i.id),['review-history','photo-review','review-write']);
 assert.equal((html.match(/data-review-history-state=/g)||[]).length,5);
});
test('review shell retains source heading, profile and static controls without blocking scrolling',async()=>{
 const {renderReviewHistory:render}=await module();assert.equal(typeof render,'function');
 const html=render({id:'sample'});
 assert.match(html,/리뷰 내역/);assert.match(html,/profile-base.png/);assert.match(html,/profile-overlay.png/);
 assert.match(html,/role="region" aria-label="리뷰 내역 · 정적 시안" tabindex="0"/);
 assert.doesNotMatch(html,/material-icons|role="tab"|class="v2-reservation-detail v2-review-history-frame" inert/);
 assert.equal((html.match(/<button /g)||[]).length,(html.match(/<button inert /g)||[]).length);
});
test('review cards share the hub renderer and respect absent photos and escaped content',async()=>{
 const {renderReviewHistory:render}=await module();assert.equal(typeof render,'function');
 assert.equal((render().match(/aria-label="리뷰 사진 [123]/g)||[]).length,3);
 const html=render({items:[{title:'<매장>',meta:'<업종>',date:'2026. 9. 18',review:'<본문>',photos:[]}]});
 assert.match(html,/&lt;매장&gt;/);assert.match(html,/&lt;본문&gt;/);assert.doesNotMatch(html,/v2-use-review-photos|v2-thumbnail/);
 assert.match(render({empty:true}),/리뷰 내역이 없습니다\./);assert.doesNotMatch(render({empty:true}),/data-use-record/);
});
test('management menu and deletion confirmation use an explicit danger action without performing deletion',async()=>{
 const {renderReviewHistory:render}=await module();assert.equal(typeof render,'function');
 assert.match(render({state:'menu'}),/리뷰 관리 메뉴/);assert.match(render({state:'menu'}),/>수정</);assert.match(render({state:'menu'}),/>삭제</);
 const html=render({state:'delete'});assert.match(html,/리뷰를 삭제하시겠습니까\?/);assert.match(html,/>취소</);assert.match(html,/<button inert\b[^>]*data-variant="danger"[^>]*>삭제<\/button>/);
 assert.throws(()=>render({state:'wrong'}),RangeError);
});
