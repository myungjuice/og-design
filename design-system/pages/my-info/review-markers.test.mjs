import test from 'node:test';
import assert from 'node:assert/strict';
import {reservationPickerBoard,reservationPicker} from './reservation-pickers.mjs';
import {waitingDetailBoard,waitingDetail} from './waiting-detail.mjs';
test('New markers appear on review headings only, including waiting dialogs',()=>{
 assert.equal((reservationPickerBoard().match(/>New</g)||[]).length,4);
 const waiting=waitingDetailBoard();
 assert.equal((waiting.match(/>New</g)||[]).length,2);
 assert.ok(waiting.includes('웨이팅 인원 변경'));assert.ok(waiting.includes('웨이팅 취소 확인'));
 assert.ok(!waiting.includes('작업 예정'));
 assert.ok(!reservationPicker().includes('>New<'));assert.ok(!waitingDetail().includes('>New<'));
});
