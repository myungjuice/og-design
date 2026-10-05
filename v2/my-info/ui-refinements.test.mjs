import test from 'node:test';
import assert from 'node:assert/strict';
import {renderReviewWritingReview} from './review-writing.mjs';
import {renderReviewHistory} from './review-history.mjs';
import {renderNotices} from './notices.mjs';
import {adaptSourceScreen} from './source-review.mjs';
import * as help from '../components/help.mjs';
import {photoReview,photoReviewBoard} from '../../design-system/pages/my-info/photo-review.mjs';
import {reviewWrite} from '../../design-system/pages/my-info/review-write.mjs';

const state=(id,key)=>{
 const html=renderReviewWritingReview().split('<section id="'+id+'"')[1];
 const start=html.indexOf('data-source-state="'+key+'"');
 return html.slice(start,html.indexOf('</figure>',start));
};
test('review management uses one compact shared surface, not two raised CTA buttons',()=>{
 assert.equal(typeof help.renderActionMenu,'function');
 const menu=help.renderActionMenu();
 assert.match(menu,/v2-action-menu/);assert.match(menu,/>수정</);assert.match(menu,/>삭제</);
 assert.equal((menu.match(/data-variant="text"/g)||[]).length,2);
 assert.match(menu,/data-tone="danger"/);assert.doesNotMatch(menu,/data-variant="danger"/);
 assert.match(renderReviewHistory({state:'menu'}),/v2-action-menu/);
 assert.match(state('photo-review','menu'),/v2-action-menu/);
});
test('photo review creation and photo add use compact buttons without changing legacy boards',()=>{
 assert.match(state('photo-review','basic'),/og-photo-action[^>]*data-size="compact"/);
 assert.match(state('review-write','empty'),/og-write-inline[^>]*data-size="compact"/);
 assert.doesNotMatch(photoReviewBoard(),/data-size="compact"|v2-action-menu/);
});
test('draft photo removal uses a close icon and preserves its accessible removal label',()=>{
 const selected=state('review-write','selected');
 assert.match(selected,/aria-label="리뷰 사진 삭제"/);
 assert.match(selected,/data-source-icon="close"/);
 assert.doesNotMatch(selected,/data-source-icon="delete"/);
 assert.match(reviewWrite({photos:[{src:''}],selected:0}),/>delete<\/span>/);
});
test('notification editing ends with a visible Done label, not a crossed pencil',()=>{
 const editing=renderNotices({selected:1,editing:true});
 assert.match(editing,/aria-label="알림 관리 끝내기"[^>]*>완료<\/button>/);
 assert.doesNotMatch(editing,/m3 3 18 18M5 14/);
 assert.match(renderNotices({selected:1}),/aria-label="알림 관리"/);
});
test('source selects consume shared arrow positioning while retaining native values and labels',()=>{
 const source='<section class="og-opinion" inert><div class="og-field"><label for="category">분류</label><select id="category" disabled><option value="">선택</option><option value="a" selected>문의</option></select></div></section>';
 const html=adaptSourceScreen(source);
 assert.match(html,/<div class="v2-select-control"><select inert id="category" disabled>/);
 assert.match(html,/label inert for="category"/);assert.match(html,/<option value="a" selected>문의/);
});
test('review delete confirmation stays destructive while ordinary management is quiet',()=>{
 assert.match(state('photo-review','delete'),/data-variant="danger"[^>]*>삭제<\/button>/);
 assert.match(photoReview({deleteOpen:true}),/data-variant="primary"[^>]*>확인<\/button>/);
});
