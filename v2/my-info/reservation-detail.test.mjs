import test from 'node:test';
import assert from 'node:assert/strict';
import {renderWorkspace} from '../render.mjs';
import {reviewGroups} from '../subnavigation.mjs';
import {reservationDetail as original} from '../../design-system/pages/my-info/reservation-detail.mjs';
const module=()=>import('./reservation-detail.mjs').catch(()=>({}));

test('reservation detail joins the history group alongside reservation change',()=>{
 const html=renderWorkspace({pageId:'my-info'});
 assert.ok(html.includes('<section id="reservation-detail" data-review-screen'),'reservation review is reachable');
 const group=reviewGroups('my-info').find(g=>g.id==='history-reservations');
 assert.deepEqual(group.items.map(i=>[i.id,!!i.pending]),[['use-history',false],['reservation-detail',false],['reservation-change',false],['reservation-pickers',false]]);
 assert.equal((html.match(/data-reservation-state="(?:confirmed|requested|cancelled)"/g)||[]).length,3);
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length);
 assert.equal((html.match(/class="my-info-test"/g)||[]).length,1);
});
test('reservation fields and guidance are preserved while adapting shared v2 surfaces and actions',async()=>{
 const {renderReservationDetail:render}=await module();assert.equal(typeof render,'function');
 const html=render({id:'example-reservation',storeName:'<가게>',nickname:'<이름>'});
 for(const copy of ['02-000-0000','010-0000-0000','2026년 9월 18일 (금) 오후 6:00','성인 2명, 어린이 0명','예약 시간 10분 전에 매장에 도착해 주세요.','예약 시간을 초과하면 예약이 자동 취소될 수 있습니다.','예약 시간 임박한 예약 변경은 매장에 유선으로 확인하셔야 합니다.','예약 임박 취소는 매장과 유선으로 연락 주세요.','취소 후 재예약은 즉시 가능합니다.','무단 노쇼 시 향후 예약에 제한이 있을 수 있습니다.'])assert.ok(html.includes(copy),copy);
 assert.match(html,/&lt;가게&gt;/);assert.match(html,/&lt;이름&gt;/);assert.doesNotMatch(html,/<가게>|<이름>/);
 assert.match(html,/v2-surface/);assert.match(html,/v2-badge/);assert.match(html,/v2-button/);assert.match(html,/v2-icon-button/);
 assert.doesNotMatch(html,/material-icons|class="og-reservation-detail" inert|href="tel:/);
 assert.match(html,/role="region"[^>]*tabindex="0"/);assert.match(html,/<button inert/);
});
test('reservation status labels and action visibility remain unchanged including elapsed active examples',async()=>{
 const {renderReservationDetail:render}=await module();assert.equal(typeof render,'function');
 const cases=[['confirmed',false,'확정',true],['requested',false,'예약 요청',true],['cancelled',false,'매장 취소',false],['selfCancelled',false,'취소',false],['entered',false,'입장',false],['noShow',false,'미방문',false],['timeOver',false,'시간 경과',false],['confirmed',true,'시간 경과',true],['requested',true,'시간 경과',true]];
 for(const [status,isOld,label,actions] of cases){
  const html=render({status,isOld});assert.ok(html.includes('예약 상세 '+label));
  assert.equal(html.includes('og-reservation-actions'),actions,status+' '+isOld);
 }
 assert.throws(()=>render({status:'unknown'}),RangeError);assert.throws(()=>render({isOld:'true'}),TypeError);
});
test('only live reservations show progress; completed and elapsed examples keep their status without an active step',async()=>{
 const {renderReservationDetail:render}=await module();
 for(const [status,isOld,want] of [['requested',false,'확인 중'],['confirmed',false,'예약 확정'],['cancelled',false,null],['selfCancelled',false,null],['entered',false,null],['noShow',false,null],['timeOver',false,null],['confirmed',true,null],['requested',true,null]]){
  const html=render({status,isOld}),step=html.match(/<li[^>]*aria-current="step"[^>]*>[\s\S]*?<span>([^<]+)<\/span><\/li>/)?.[1]||null;
  assert.equal(step,want,status+' elapsed='+isOld);
  assert.equal(html.includes('class="og-reservation-steps"'),want!==null,'no misleading progress for '+status);
 }
 assert.match(original({status:'selfCancelled'}),/aria-current="step"/,'original canvas is unchanged');
});
