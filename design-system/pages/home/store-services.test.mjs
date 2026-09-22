import test from 'node:test';
import assert from 'node:assert/strict';
test('reservation keeps closed/current precedence and dates only without a reservation',async()=>{
 const {reservationSection}=await import('./store-services.mjs');
 const open=reservationSection();assert.match(open,/예약가능/);assert.match(open,/다른 날짜 예약/);
 const closed=reservationSection({open:false});assert.match(closed,/현재 예약 접수가 일시적으로 중지/);assert.doesNotMatch(closed,/다른 날짜 예약|내 예약 보기/);
 const active=reservationSection({open:false,current:true,count:2,expired:true});assert.match(active,/내 예약 보기/);assert.match(active,/예약 시간 경과/);assert.match(active,/예약이 2건/);assert.doesNotMatch(active,/예약가능|다른 날짜 예약/);
 assert.doesNotMatch(reservationSection({current:true,count:1}),/예약이 1건/);
});
test('waiting keeps current precedence, optional estimate and closed/missing copy',async()=>{
 const {waitingSection,serviceBoard}=await import('./store-services.mjs');
 assert.match(waitingSection(),/웨이팅 등록/);
 assert.doesNotMatch(waitingSection({estimate:null}),/예상 대기 시간/);
 assert.match(waitingSection({current:true,open:false}),/웨이팅 실시간 보기/);
 assert.doesNotMatch(waitingSection({current:true,open:false}),/현재 웨이팅 상태가 아닙니다/);
 assert.match(waitingSection({open:false}),/현재 웨이팅 상태가 아닙니다/);
 assert.doesNotMatch(waitingSection({open:false}),/웨이팅 등록/);
 assert.match(waitingSection({info:false}),/매장의 웨이팅정보가 없습니다/);
 assert.equal((serviceBoard('reservation').match(/class="screen-artboard"/g)||[]).length,5);
 assert.equal((serviceBoard('waiting').match(/class="screen-artboard"/g)||[]).length,5);
});
