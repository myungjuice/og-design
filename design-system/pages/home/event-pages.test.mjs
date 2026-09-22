import test from 'node:test';
import assert from 'node:assert/strict';
test('event list sorts all entries by legacy group and date tie breakers without mutating data',async()=>{
 const {sortEvents,eventListScreen}=await import('./event-pages.mjs');
 const items=[{title:'종료',start:'2026-09-01',end:'2026-09-18'},{title:'예정',start:'2026-09-22',end:'2026-09-30'},{title:'진행',start:'2026-09-01',end:'2026-09-21'},{title:'오늘종료',start:'2026-09-01',end:'2026-09-19'}];
 assert.deepEqual(sortEvents(items).map(i=>i.title),['오늘종료','진행','예정','종료']);assert.equal(items[0].title,'종료');
 const html=eventListScreen({items});assert.equal((html.match(/class="og-update-row"/g)||[]).length,4);assert.match(html,/우리 매장 이벤트/);assert.match(html,/회원점명/);assert.match(html,/2026.9.1 ~ 2026.9.19/);
 assert.match(eventListScreen(),/등록된 이벤트가 없습니다/);
 const tie=[{title:'짧은예정',start:'2026-09-22',end:'2026-09-28'},{title:'긴예정',start:'2026-09-22',end:'2026-09-30'}];assert.equal(sortEvents(tie)[0].title,'긴예정');
});
test('event detail reuses reading layout and keeps period before body without action buttons',async()=>{
 const {eventDetailScreen,eventPagesBoard}=await import('./event-pages.mjs');
 const html=eventDetailScreen({title:'<행사>',contents:'본문',imageSrc:'sample.png'});
 assert.match(html,/&lt;행사&gt;/);assert.ok(html.indexOf('2026.9.1 ~ 2026.9.30')<html.indexOf('본문'));assert.ok(html.indexOf('본문')<html.indexOf('sample.png'));
 assert.doesNotMatch(html,/참여하기|공유|댓글/);assert.doesNotMatch(eventDetailScreen(),/<img/);
 assert.equal((eventPagesBoard('list').match(/class="screen-artboard"/g)||[]).length,2);
});
