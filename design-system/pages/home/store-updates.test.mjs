import test from 'node:test';
import assert from 'node:assert/strict';
test('store updates hide empty sections, cap at two and omit missing photos',async()=>{
 const {updatesSection}=await import('./store-updates.mjs');
 assert.equal(updatesSection('news',[]),'');
 const html=updatesSection('news',[{title:'<소식>',date:'9월 19일(토)',image:'sample.png'},{title:'두번째',date:'9월 18일(금)'},{title:'세번째'}]);
 assert.match(html,/&lt;소식&gt;/);assert.doesNotMatch(html,/세번째/);
 assert.equal((html.match(/class="og-thumbnail"/g)||[]).length,1);
});
test('event status preserves midnight boundary and legacy labels',async()=>{
 const {eventStatus,updatesBoard}=await import('./store-updates.mjs');
 const now='2026-09-19';
 assert.deepEqual(eventStatus('2026-09-01','2026-09-21',now),{kind:'active',label:'진행 중',remaining:'2일 남음'});
 assert.equal(eventStatus(now,now,now).remaining,'오늘 종료');
 assert.equal(eventStatus('2026-09-22','2026-09-30',now).remaining,'D-3');
 assert.equal(eventStatus('2026-09-01','2026-09-18',now).remaining,'종료된 이벤트');
 assert.equal((updatesBoard('event').match(/class="screen-artboard"/g)||[]).length,2);
});
