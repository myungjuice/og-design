import test from 'node:test';
import assert from 'node:assert/strict';
test('reservation pickers retain immediate selection and legacy states',async()=>{
 const {reservationPicker}=await import('./reservation-pickers.mjs');
 const date=reservationPicker('date');
 assert.ok(date.includes('예약일 선택'));assert.ok(date.includes('og-calendar'));
 assert.ok(!date.includes('선택 완료'));assert.ok(!date.includes('날짜를 선택해 주세요.'));
 const time=reservationPicker('time');
 for(const s of ['시간 선택','현재 예약','내 다른 예약','예약 가능','브레이크 타임','예약 불가'])assert.ok(time.includes(s),s);
 assert.ok(!time.includes('선택 완료'));
 assert.ok(reservationPicker('empty').includes('예약 가능한 시간이 없습니다.'));
 const people=reservationPicker('people');
 for(const s of ['예약 인원','성인','어린이','이린이 적용 기준은 매장마다 다를 수 있습니다.','확인'])assert.ok(people.includes(s),s);
 assert.ok(people.includes('og-quantity'));assert.ok(!people.includes('data-max="5"'));
 assert.match(date,/inert/);
});
