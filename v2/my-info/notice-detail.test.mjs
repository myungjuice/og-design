import test from 'node:test';
import assert from 'node:assert/strict';
import {renderWorkspace} from '../render.mjs';
import {reviewGroups} from '../subnavigation.mjs';
const module=()=>import('./notice-detail.mjs').catch(()=>({}));
test('notice detail is reachable beside notices and retains all three source specimens',()=>{
 const html=renderWorkspace({pageId:'my-info'});
 assert.match(html,/<section id="notice-detail" data-review-screen/);
 assert.deepEqual(reviewGroups('my-info').find(g=>g.id==='notice-notifications')?.items.map(i=>i.id),['notices','notice-detail']);
 assert.equal((html.match(/data-notice-detail-state=/g)||[]).length,3);
 assert.match(html,/수정일: 2026-09-19 09:30:00/);
 assert.match(html,/공지 제목이 여러 줄로 이어질 때의 표시 예시/);
 assert.match(html,/<h3>본문 소제목<\/h3>/);assert.match(html,/<li>목록의 첫 번째 항목입니다\.<\/li>/);
});
test('notice detail retains escaped title and dates including conditional modified date',async()=>{
 const {renderNoticeDetail:render}=await module();assert.equal(typeof render,'function');
 for(const [modified,visible] of [['',false],['2026-09-18 10:00:00',false],['<다른 날짜>',true]]){
  const html=render({title:'<공지 & 제목>',created:'2026-09-18 10:00:00',modified});
  assert.match(html,/&lt;공지 &amp; 제목&gt;/);assert.match(html,/작성일: 2026-09-18 10:00:00/);
  assert.equal(html.includes('수정일:'),visible);if(visible)assert.match(html,/수정일: &lt;다른 날짜&gt;/);
 }
});
test('authored rich notice body is preserved while service links and back button remain inert',async()=>{
 const {renderNoticeDetail:render}=await module();assert.equal(typeof render,'function');
 const html=render({bodyHTML:'<h3>소제목</h3><p><strong>중요</strong></p><ol><li>목록</li></ol><p><a href="https://example.com">본문 링크 예시</a></p>'});
 assert.match(html,/<strong>중요<\/strong>/);assert.match(html,/<ol><li>목록<\/li><\/ol>/);
 assert.match(html,/<a inert href="https:\/\/example.com">본문 링크 예시<\/a>/);
 assert.match(html,/<button inert [^>]*aria-label="뒤로가기"/);
 assert.match(html,/class="og-notice-article" role="region" aria-label="공지 본문 · 정적 시안" tabindex="0"/);
 assert.doesNotMatch(html,/class="v2-notice-detail-frame" inert|material-icons|공유하기|첨부파일|이전글|다음글/);
});
