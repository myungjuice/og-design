import test from 'node:test';
import assert from 'node:assert/strict';
test('reservation detail preserves source fields, status steps and guidance',async()=>{
 const {reservationDetail}=await import('./reservation-detail.mjs');
 const html=reservationDetail();
 for(const label of ['예약 상세','회원점명','예약 신청','확인 중','예약 확정','예약 내용','예약자 연락처','예약 인원','예약 안내','취소 안내','성인 2명, 어린이 0명'])assert.ok(html.includes(label),label);
 assert.match(html,/예약 시간 10분 전에 매장에 도착해 주세요\./);
 assert.match(html,/예약 시간을 초과하면 예약이 자동 취소될 수 있습니다\./);
 assert.match(html,/inert/);
});
test('only requested and confirmed detail specimens show change-cancel actions',async()=>{
 const {reservationDetail}=await import('./reservation-detail.mjs');
 for(const status of ['requested','confirmed'])assert.match(reservationDetail({status}),/og-reservation-actions/);
 for(const status of ['cancelled','selfCancelled','entered','noShow','timeOver'])assert.doesNotMatch(reservationDetail({status}),/og-reservation-actions/);
 assert.match(reservationDetail({status:'cancelled'}),/>매장 취소</);
 assert.match(reservationDetail({status:'selfCancelled'}),/>취소</);
 assert.match(reservationDetail({status:'confirmed',isOld:true}),/>시간 경과</);
});
