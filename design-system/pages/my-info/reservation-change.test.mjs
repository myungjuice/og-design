import test from 'node:test';
import assert from 'node:assert/strict';
import {bottomSheet} from '../../components/index.mjs';
test('sheet can share a two-action footer without changing the default',()=>{
 const html=bottomSheet({title:'예약 변경',actions:[{label:'변경 취소',variant:'secondary'},{label:'변경',disabled:true}]});
 assert.match(html,/>변경 취소</);assert.match(html,/disabled>변경</);
 assert.match(bottomSheet(),/>닫기</);
});
test('reservation change preserves current data, labels and changed-only confirmation',async()=>{
 const {reservationChange}=await import('./reservation-change.mjs');
 const initial=reservationChange();
 for(const text of ['현재 예약 정보:','예약시간 선택:','인원 선택:','성인: 2명, 어린이: 0명','오후 06:00','변경 취소'])assert.ok(initial.includes(text),text);
 assert.match(initial,/disabled>변경</);
 assert.doesNotMatch(reservationChange({changed:true}),/disabled>변경</);
 assert.match(initial, /inert/);
});
