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

test('planning unread controls reflect records and disappear after all-read',async()=>{
 const {notices}=await import('./notices.mjs');
 assert.ok(notices().includes('모두 읽음'));assert.ok(notices().includes('data-unread="true"'));
 const read=notices({selected:1,allRead:true});assert.ok(!read.includes('data-read="false"'));assert.ok(!read.includes('data-unread="true"'));assert.ok(!read.includes('모두 읽음'));
 assert.ok(!notices({empty:true}).includes('모두 읽음'));
});
test('planning important and category badges use explicit data rather than inferring from title',async()=>{
 const {notices}=await import('./notices.mjs');
 assert.ok(notices({announcements:[{type:'공지',title:'제목',date:'',important:true}]}).includes('필독'));
 assert.ok(!notices({announcements:[{type:'공지',title:'필독처럼 보이는 제목',date:''}]}).includes('data-important="true"'));
 const html=notices({selected:1,notifications:[{type:'적립',title:'예시',body:'내용',date:'',read:false}]});
 assert.ok(html.includes('og-notification-type'));assert.ok(html.includes('storefront'));
});
