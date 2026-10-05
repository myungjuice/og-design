import test from 'node:test';
import assert from 'node:assert/strict';
import {renderWorkspace} from '../render.mjs';
import {reviewGroups} from '../subnavigation.mjs';
const module=()=>import('./reservation-pickers.mjs').catch(()=>({}));

test('reservation selection popups are reachable together with their parent flow',()=>{
 const html=renderWorkspace({pageId:'my-info'});
 assert.ok(html.includes('<section id="reservation-pickers" data-review-screen'));
 const group=reviewGroups('my-info').find(g=>g.id==='history-reservations');
 assert.ok(group.items.some(i=>i.id==='reservation-pickers'&&!i.pending));
 assert.equal((html.match(/data-reservation-picker="(?:date|time|empty|people)"/g)||[]).length,4);
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);
});
test('reservation calendar retains unavailable dates, current date and immediate-selection layout',async()=>{
 const {renderReservationPicker:render}=await module();assert.equal(typeof render,'function');
 const html=render({id:'date-review',type:'date'}),calendar=html.slice(html.indexOf('class="og-calendar v2-calendar"'));
 assert.ok(calendar.includes('2026년 9월'));
 const days=[...calendar.matchAll(/<button[^>]*class="og-calendar-day"[^>]*>/g)].map(m=>m[0]);
 assert.equal(days.length,30);assert.equal(days.filter(t=>t.includes(' disabled')).length,19);
 assert.match(days[17],/data-reserved="true"/);assert.match(days[17],/aria-current="date"/);
 assert.match(calendar,/<button[^>]*aria-label="이전 달"[^>]*disabled/);
 assert.doesNotMatch(calendar,/선택 완료|선택 적용|날짜를 선택해 주세요\.|aria-selected/);
});
test('reservation time list preserves all availability states and its empty state',async()=>{
 const {renderReservationPicker:render}=await module();assert.equal(typeof render,'function');
 const html=render({id:'time-review',type:'time'});
 assert.equal((html.match(/class="og-res-slot"/g)||[]).length,7);
 assert.equal((html.match(/data-available="true"/g)||[]).length,2);
 for(const copy of ['오후 02:00','브레이크 타임','예약 불가','내 다른 예약','현재 예약','오후 06:30','오후 07:00','마감 임박'])assert.ok(html.includes(copy),copy);
 const empty=render({type:'empty'});assert.ok(empty.includes('예약 가능한 시간이 없습니다.'));assert.doesNotMatch(empty,/class="og-res-slot"/);
});
test('people use the shared counter while retaining adult/child minimums and original notices',async()=>{
 const {renderReservationPicker:render}=await module();assert.equal(typeof render,'function');
 const html=render({id:'people-review',type:'people'});
 assert.match(html,/class="og-quantity v2-quantity"[^>]*aria-label="성인"[^>]*data-min="1"[^>]*data-value="2"/);
 assert.match(html,/class="og-quantity v2-quantity"[^>]*aria-label="어린이"[^>]*data-min="0"[^>]*data-value="0"/);
 assert.doesNotMatch(html,/data-max="5"|material-icons/);
 assert.equal((html.match(/class="og-quantity-unit">명/g)||[]).length,2);
 for(const copy of ['예약 시간 10분 전에 매장에 도착해 주세요.','예약 시간을 초과하면 예약이 자동 취소될 수 있습니다.','예약 시간 임박한 예약 변경은 매장에 유선으로 확인하셔야 합니다.','어린이 적용 기준은 매장마다 다를 수 있습니다.'])assert.ok(html.includes(copy),copy);
 assert.doesNotMatch(html,/이린이/);
 const footer=html.slice(html.lastIndexOf('class="og-dialog-actions"'));assert.ok(footer.includes('취소'));assert.ok(footer.includes('확인'));
});
test('static picker controls are inert without blocking content scrolling',async()=>{
 const {renderReservationPicker:render}=await module();assert.equal(typeof render,'function');
 for(const type of ['date','time','empty','people']){
  const html=render({id:'static-'+type,type});
  assert.ok(html.includes('v2-dialog-panel'));assert.ok(html.includes('v2-button'));
  assert.match(html,/class="v2-picker-backdrop" inert aria-hidden="true"/);
  assert.match(html,/class="v2-picker-body" role="region"[^>]*tabindex="0"/);
  assert.doesNotMatch(html,/class="v2-picker-frame" inert|class="v2-dialog-static"[^>]*inert|<button(?! inert)|material-icons/);
 }
 assert.throws(()=>render({type:'unknown'}),RangeError);
});
