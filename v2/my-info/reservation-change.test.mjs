import test from 'node:test';
import assert from 'node:assert/strict';
import {renderWorkspace} from '../render.mjs';
import {reviewGroups} from '../subnavigation.mjs';
const module=()=>import('./reservation-change.mjs').catch(()=>({}));

test('reservation change becomes a ready sibling with before and after previews',()=>{
 const html=renderWorkspace({pageId:'my-info'});
 assert.ok(html.includes('<section id="reservation-change" data-review-screen'));
 assert.deepEqual(reviewGroups('my-info').find(g=>g.id==='history-reservations').items.map(i=>[i.id,!!i.pending]),[['use-history',false],['reservation-detail',false],['reservation-change',false],['reservation-pickers',false]]);
 assert.equal((html.match(/data-change-state="(?:initial|changed)"/g)||[]).length,2);
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);
});
test('reservation change preserves current information and changed-only confirmation',async()=>{
 const {renderReservationChange:render}=await module();assert.equal(typeof render,'function');
 for(const changed of [false,true]){
  const html=render({id:changed?'after':'before',changed});
  for(const copy of ['현재 예약 정보:','2026년 9월 18일 (금요일)','오후 06:00','성인: 2명, 어린이: 0명','예약시간 선택:','인원 선택:','변경 취소'])assert.ok(html.includes(copy),copy);
  assert.ok(html.includes(changed?'9월 19일 오후 06:30':'9월 18일 오후 06:00'));
  assert.ok(html.includes(changed?'aria-label="성인 3명, 어린이 0명"':'aria-label="성인 2명, 어린이 0명"'));
  const footer=html.match(/<div class="og-sheet-footer">([\s\S]*?)<\/div>/)[1];
  assert.equal(/disabled/.test(footer),!changed);
  assert.equal((html.match(/og-change-value is-changed/g)||[]).length,changed?2:0);
 }
 assert.throws(()=>render({changed:'false'}),TypeError);
});
test('static change sheet reuses v2 styles without making its scroll shell inert',async()=>{
 const {renderReservationChange:render}=await module();assert.equal(typeof render,'function');
 const html=render({id:'test-change'});
 for(const name of ['v2-reservation-detail','v2-sheet-panel','v2-surface','v2-button','v2-icon-button'])assert.ok(html.includes(name),name);
 assert.match(html,/class="v2-change-backdrop" inert aria-hidden="true"/);
 assert.doesNotMatch(html,/class="v2-change-frame" inert|class="v2-sheet-static" inert|material-icons|href="tel:/);
 assert.match(html,/role="region" aria-label="예약 변경 내용 · 정적 시안" tabindex="0"/);
 assert.equal((html.match(/<button(?! inert)/g)||[]).length,0,'static controls individually inert');
});
