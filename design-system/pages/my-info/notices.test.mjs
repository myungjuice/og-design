import test from 'node:test';
import assert from 'node:assert/strict';
test('notice sheet exposes planned two tabs and preserves legacy fields',async()=>{
 const {notices}=await import('./notices.mjs');const h=notices({announcements:[{type:'안내',date:'26.09.18 10:00',title:'제목 <예시>'}]});
 for(const text of ['>공지</button>','>내 알림</button>','[안내]','26.09.18 10:00','제목 &lt;예시&gt;','inert'])assert.ok(h.includes(text),text);
 assert.ok(!h.includes('전체 삭제'));assert.ok(!h.includes('알림 설정'));
});
test('notifications distinguish reading from editing and hide delete control when empty',async()=>{
 const {notices}=await import('./notices.mjs');
 const h=notices({selected:1});assert.ok(h.includes('data-read="false"'));assert.ok(h.includes('data-read="true"'));assert.ok(h.includes('알림 설정'));assert.ok(h.includes('알림 관리'));assert.ok(!h.includes('type="checkbox"'));
 const edit=notices({selected:1,editing:true});for(const text of ['전체 삭제','선택 삭제','type="checkbox"','checked'])assert.ok(edit.includes(text),text);
 const empty=notices({selected:1,empty:true});assert.ok(empty.includes('수신된 푸시 알림이 없습니다.'));assert.ok(!empty.includes('알림 관리'));assert.ok(empty.includes('알림 설정'));
});
test('delete previews retain distinct all-selected-single copy',async()=>{
 const {notices}=await import('./notices.mjs');
 assert.ok(notices({selected:1,overlay:'all'}).includes('모든 알림 내역을 완전히 삭제할까요?'));
 assert.ok(notices({selected:1,overlay:'selected'}).includes('선택한 알림 내역을 삭제할까요?'));
 assert.ok(notices({selected:1,overlay:'item'}).includes('이 알림 삭제'));
});
