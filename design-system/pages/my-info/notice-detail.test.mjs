import test from 'node:test';
import assert from 'node:assert/strict';
test('notice detail preserves conditional modified date and original date strings',async()=>{
 const {noticeDetail}=await import('./notice-detail.mjs');
 for(const modified of ['', '2026-09-18 10:00:00','2026-09-19 09:30:00']){
  const h=noticeDetail({title:'제목 <예시>',created:'2026-09-18 10:00:00',modified});
  assert.ok(h.includes('제목 &lt;예시&gt;'));assert.ok(h.includes('작성일: 2026-09-18 10:00:00'));
  assert.equal(h.includes('수정일:'),modified==='2026-09-19 09:30:00');assert.ok(h.includes('inert'));
 }
});
test('notice rich content remains in its body with no invented actions',async()=>{
 const {noticeDetail}=await import('./notice-detail.mjs');
 const h=noticeDetail({bodyHTML:'<h3>본문 소제목</h3><p>본문 <strong>강조</strong></p><ul><li>항목</li></ul>'});
 assert.ok(h.includes('<strong>강조</strong>'));assert.ok(h.includes('<li>항목</li>'));
 for(const value of ['공유하기','첨부파일','이전글','다음글'])assert.ok(!h.includes(value));
});
