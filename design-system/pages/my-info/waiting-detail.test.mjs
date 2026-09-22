import test from 'node:test';
import assert from 'node:assert/strict';
test('waiting detail retains legacy labels and distinct ticket/position values',async()=>{
 const {waitingDetail}=await import('./waiting-detail.mjs');
 const html=waitingDetail({number:27,position:4});
 for(const text of ['웨이팅 현황','웨이팅 중','현재 내 순서','27','4','번째','웨이팅 신청:','웨이팅 취소하기','인원 변경','새로고침','이린이 적용 기준은 매장마다 다를 수 있습니다.'])assert.ok(html.includes(text),text);
 assert.match(html,/inert/);assert.ok(!html.includes('예상 대기'));
});
