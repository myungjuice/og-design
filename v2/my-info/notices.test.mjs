import test from 'node:test';
import assert from 'node:assert/strict';
import {renderWorkspace} from '../render.mjs';
import {reviewGroups} from '../subnavigation.mjs';
const module=()=>import('./notices.mjs').catch(()=>({}));
test('notice group exposes both basic tabs and eight folded source comparisons',()=>{
 const html=renderWorkspace({pageId:'my-info'});
 assert.ok(html.includes('<section id="notices" data-review-screen'));
 assert.deepEqual(reviewGroups('my-info').find(g=>g.id==='notice-notifications')?.items.map(i=>i.id),['notices','notice-detail']);
 assert.equal((html.match(/data-notice-state=/g)||[]).length,10);
});
test('notice adapter preserves important/category/date fields and escapes custom content',async()=>{
 const {renderNotices:render}=await module();assert.equal(typeof render,'function');
 const html=render({announcements:[{important:true,type:'공지',title:'<제목>',date:'26.09.18 10:00'},{type:'안내',title:'일반 제목',date:'26.09.16 09:00'}]});
 for(const text of ['필독','[안내]','26.09.18 10:00','&lt;제목&gt;','v2-badge','v2-sheet-panel','v2-tabs'])assert.ok(html.includes(text),text);
 assert.ok(!html.includes('알림 관리'));assert.ok(!html.includes('알림 설정'));
 assert.throws(()=>render({selected:2}),RangeError);
});
test('unread state reflects notifications across both tabs and disappears after all-read',async()=>{
 const {renderNotices:render}=await module();assert.equal(typeof render,'function');
 const unread=render({selected:1});assert.ok(unread.includes('data-read="false"'));assert.ok(unread.includes('data-read="true"'));assert.ok(unread.includes('data-unread="true"'));assert.ok(unread.includes('모두 읽음'));
 const read=render({selected:1,allRead:true});for(const text of ['data-read="false"','data-unread="true"','모두 읽음'])assert.ok(!read.includes(text),text);
 assert.ok(render({selected:0}).includes('모두 읽음'));
});
test('notification category special characters are escaped once rather than displayed as entities',async()=>{
 const {renderNotices:render}=await module();assert.equal(typeof render,'function');
 const html=render({selected:1,notifications:[{type:'공지 & <안내>',title:'제목',body:'본문',date:'',read:false}]});
 assert.ok(html.includes('공지 &amp; &lt;안내&gt;'));assert.ok(!html.includes('&amp;amp;'));assert.ok(!html.includes('&amp;lt;'));
});
test('empty notifications retain settings but remove management; selection and confirmation stay static',async()=>{
 const {renderNotices:render}=await module();assert.equal(typeof render,'function');
 const empty=render({selected:1,notifications:[]});assert.ok(empty.includes('수신된 푸시 알림이 없습니다.'));assert.ok(empty.includes('알림 설정'));assert.ok(!empty.includes('aria-label="알림 관리"'));
 const edit=render({selected:1,editing:true,selectedIndices:[]});assert.equal((edit.match(/type="checkbox"/g)||[]).length,4);assert.ok(!edit.includes(' checked'));assert.ok(edit.includes('전체 삭제'));assert.ok(edit.includes('선택 삭제'));
 for(const [overlay,copy] of [['all','모든 알림 내역을 완전히 삭제할까요?'],['selected','선택한 알림 내역을 삭제할까요?'],['item','이 알림 삭제']]){
  const html=render({selected:1,editing:overlay!=='item',overlay});assert.ok(html.includes(copy));assert.equal((html.match(/<button /g)||[]).length,(html.match(/<button inert /g)||[]).length);assert.ok(!html.includes('material-icons'));
 }
 const html=render();assert.ok(html.includes('role="region" aria-label="공지 내용 · 정적 시안" tabindex="0"'));assert.ok(!html.includes('class="v2-use-history-frame v2-notices-frame" inert'));
});
