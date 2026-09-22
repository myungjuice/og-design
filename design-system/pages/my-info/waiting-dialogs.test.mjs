import test from 'node:test';
import assert from 'node:assert/strict';
test('waiting dialogs preserve original confirmation and people guidance',async()=>{
 const {waitingDialog}=await import('./waiting-detail.mjs');
 assert.equal(typeof waitingDialog,'function');
 const people=waitingDialog('people'),cancel=waitingDialog('cancel');
 for(const word of ['웨이팅 인원','웨이팅 안내','성인','어린이','웨이팅을 취소하는 경우 다른 손님을 위해 꼭 취소 버튼을 눌러주세요.'])assert.ok(people.includes(word),word);
 assert.ok(people.includes('og-quantity'));assert.ok(!people.includes('data-max="5"'));
 assert.match(cancel,/>확인<\/h3>/);assert.ok(cancel.includes('웨이팅 취소를 하시겠습니까?'));
 assert.ok(cancel.includes('>취소</button>'));assert.ok(cancel.includes('>확인</button>'));
 assert.match(people,/inert/);assert.match(cancel,/inert/);
});
test('waiting examples retain review IDs and replace placeholders with screens',async()=>{
 const {waitingDetailBoard}=await import('./waiting-detail.mjs');const html=waitingDetailBoard();
 assert.ok(html.includes('id="review-waiting-people"'));assert.ok(html.includes('id="review-waiting-cancel"'));
 assert.ok(!html.includes('data-review-pending'));assert.ok(!html.includes('작업 예정'));
});
