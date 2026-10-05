import test from 'node:test';
import assert from 'node:assert/strict';

const implementation=()=>import('./review-writing.mjs').catch(()=>({}));
const stateHTML=(html,id,key)=>{
 const section=html.slice(html.indexOf('<section id="'+id+'"'));
 const marker='data-source-state="'+key+'"';
 const start=section.indexOf(marker);
 assert.notEqual(start,-1,id+' / '+key+' must be available');
 return section.slice(start,section.indexOf('</figure>',start));
};

test('review writing galleries retain the twelve photo and writing states',async()=>{
 const {renderReviewWritingReview:render}=await implementation();
 assert.equal(typeof render,'function');
 const html=render();
 for(const [id,keys] of [
  ['photo-review',['basic','no-photos','empty','menu','delete']],
  ['review-write',['empty','composed','expanded','selected','unchanged','source','help']]
 ]){
  assert.match(html,new RegExp('<section id="'+id+'" data-review-screen'));
  for(const key of keys)stateHTML(html,id,key);
 }
 assert.equal((html.match(/data-source-state=/g)||[]).length,12);
});

test('photo reviews preserve photo absence, empty history and management alternatives',async()=>{
 const {renderReviewWritingReview:render}=await implementation();assert.equal(typeof render,'function');
 const html=render(),basic=stateHTML(html,'photo-review','basic');
 assert.match(basic,/오시 망원본점/);assert.doesNotMatch(html,/회원점명/);
 assert.match(basic,/포토 리뷰 작성/);assert.match(basic,/리뷰 완료/);
 assert.match(basic,/리뷰 사진 1/);assert.match(basic,/리뷰 사진 2/);
 assert.doesNotMatch(stateHTML(html,'photo-review','no-photos'),/리뷰 사진 [12]|og-photo-images/);
 assert.match(stateHTML(html,'photo-review','empty'),/아직 적립 내역이 없습니다/);
 assert.match(stateHTML(html,'photo-review','menu'),/>수정</);
 assert.match(stateHTML(html,'photo-review','delete'),/리뷰를 삭제하시겠습니까/);
});

test('review composition preserves placeholders and shows save only for source changed states',async()=>{
 const {renderReviewWritingReview:render}=await implementation();assert.equal(typeof render,'function');
 const html=render();
 for(const key of ['empty','unchanged','help'])assert.doesNotMatch(stateHTML(html,'review-write',key),/og-write-footer/);
 for(const key of ['composed','expanded','selected','source'])assert.match(stateHTML(html,'review-write',key),/og-write-footer/);
 assert.match(stateHTML(html,'review-write','empty'),/placeholder="리뷰 내용을 입력해주세요\."/);
 assert.match(stateHTML(html,'review-write','expanded'),/다음에도 방문하고 싶어요/);
 assert.match(stateHTML(html,'review-write','selected'),/리뷰 사진 삭제/);
 assert.doesNotMatch(stateHTML(html,'review-write','composed'),/리뷰 사진 삭제/);
 assert.match(stateHTML(html,'review-write','source'),/>갤러리</);
 assert.match(stateHTML(html,'review-write','source'),/>카메라</);
 assert.match(stateHTML(html,'review-write','help'),/순서 변경/);
 assert.match(stateHTML(html,'review-write','help'),/사진삭제/);
});

test('v2 photo deletion uses the danger action while leaving the original board untouched',async()=>{
 const {renderReviewWritingReview:render}=await implementation();
 const html=stateHTML(render(),'photo-review','delete');
 assert.match(html,/<button inert\b[^>]*data-variant="danger"[^>]*>삭제<\/button>/);
 const {photoReview}=await import('../../design-system/pages/my-info/photo-review.mjs');
 assert.match(photoReview({deleteOpen:true}),/<button\b[^>]*data-variant="primary"[^>]*>확인<\/button>/);
});
