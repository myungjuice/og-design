import test from 'node:test';
import assert from 'node:assert/strict';
import {renderWorkspace} from '../render.mjs';
import {reviewGroups} from '../subnavigation.mjs';
const gallery=()=>renderWorkspace({pageId:'home'}).split('<section id="store-waiting"')[1]||'';
const frame=state=>gallery().match(new RegExp(`data-store-waiting-state="${state}"([\\s\\S]*?)<\\/template>`))?.[1]||'';

// Catches unreachable review, missing states or comparisons eager by default.
test('store waiting is reachable with reservation and five collapsed source states',()=>{
 const service=reviewGroups('home').find(group=>group.id==='store-services');
 assert.ok(service.items.some(item=>item.id==='store-waiting'));
 assert.ok(service.items.some(item=>item.id==='store-reservation'));
 for(const state of ['open','no-estimate','current','closed','no-info'])assert.ok(frame(state),state);
 assert.doesNotMatch(gallery(),/<details[^>]*\bopen\b/);
 assert.match(gallery(),/실제 웨이팅 정보가 아닌 표시 예시/);
});

// Catches null estimates becoming zero minutes or the register/current actions mixing.
test('available waiting shows team count and omits an unavailable estimate without losing registration',()=>{
 const open=frame('open'),noEstimate=frame('no-estimate');
 assert.match(open,/현재 웨이팅/);assert.match(open,/5 <small>팀/);
 assert.match(open,/예상 대기 시간: 20분/);assert.match(open,/웨이팅 등록/);
 assert.match(noEstimate,/현재 웨이팅/);assert.match(noEstimate,/웨이팅 등록/);
 assert.doesNotMatch(noEstimate,/예상 대기 시간:|대기번호|웨이팅 실시간 보기/);
});

// Catches ticket/order conflation and closure/missing-data accidentally offering registration.
test('current waiting keeps ticket and position distinct while unavailable states explain without registration',()=>{
 const current=frame('current'),closed=frame('closed'),noInfo=frame('no-info');
 assert.match(current,/대기번호 <em>12<\/em>번/);assert.match(current,/내 순서 <em>3<\/em>번째/);
 assert.match(current,/성인: 2명, 어린이: 0명/);assert.match(current,/웨이팅 실시간 보기/);
 assert.doesNotMatch(current,/현재 웨이팅|예상 대기 시간|웨이팅 등록/);
 assert.match(closed,/현재 웨이팅 상태가 아닙니다/);
 assert.match(noInfo,/매장의 웨이팅정보가 없습니다/);assert.match(noInfo,/입구에서 직원에게 문의해주세요/);
 for(const html of [closed,noInfo])assert.doesNotMatch(html,/웨이팅 등록|웨이팅 실시간 보기|대기번호|예상 대기 시간/);
});

// Catches priority drift, raw unsafe status, live controls and unreadable inert content.
test('waiting preserves current then missing then closed precedence and shared static materials',async()=>{
 assert.ok(gallery(),'waiting review must exist');
 const {renderHomeStoreWaitingSection,renderHomeStoreWaitingScreen}=await import('./store-waiting.mjs');
 const current=renderHomeStoreWaitingSection({current:true,open:false,info:false,status:'마감 준비'});
 assert.match(current,/대기번호/);assert.doesNotMatch(current,/마감 준비|정보가 없습니다|상태가 아닙니다/);
 const noInfo=renderHomeStoreWaitingSection({info:false,open:false,status:'마감 준비'});
 assert.match(noInfo,/정보가 없습니다/);assert.match(noInfo,/입구에서 직원/);assert.doesNotMatch(noInfo,/마감 준비|상태가 아닙니다/);
 const closed=renderHomeStoreWaitingSection({open:false,status:'<script>브레이크 준비</script>'});
 assert.match(closed,/&lt;script&gt;브레이크 준비&lt;\/script&gt;/);assert.doesNotMatch(closed,/<script>/);
 const html=renderHomeStoreWaitingScreen({state:'open'});
 assert.match(html,/오시 망원본점/);assert.match(html,/tabindex="0" aria-label="매장 웨이팅 안내"/);
 assert.match(html,/v2-section-heading/);assert.match(html,/v2-surface/);assert.match(html,/v2-button/);
 assert.match(html,/aria-label="새로고침"/);assert.match(html,/v2-icon-button/);
 assert.doesNotMatch(html,/material-icons|class="og-store" inert/);
 assert.ok([...html.matchAll(/<button\b[^>]*>/g)].every(([tag])=>/\binert\b/.test(tag)));
 assert.throws(()=>renderHomeStoreWaitingScreen({state:'unknown'}),RangeError);
});

// Catches open reception incorrectly permitting registration during runtime preparation.
test('open waiting preparation states explain the runtime event and suppress registration',async()=>{
 const {renderHomeStoreWaitingSection}=await import('./store-waiting.mjs');
 for(const [state,runtimeStatus,status] of [
  ['break-preparing','breakPreparing','곧 브레이크 타임 15:00에 브레이크 타임'],
  ['close-preparing','closePreparing','곧 영업 종료 22:00에 영업 종료']
 ]){
  const html=frame(state);assert.ok(html,state);
  assert.ok(html.includes(status));assert.match(html,/현재 웨이팅 상태가 아닙니다/);
  assert.match(html,/data-depth="inset"/);
  assert.doesNotMatch(html,/웨이팅 등록|현재 웨이팅<|예상 대기 시간:|대기번호/);
  assert.ok([...html.matchAll(/<button\b[^>]*>/g)].every(([tag])=>/\binert\b/.test(tag)));
  const current=renderHomeStoreWaitingSection({current:true,open:true,info:false,runtimeStatus,status});
  assert.match(current,/대기번호/);assert.ok(!current.includes(status));
  const missing=renderHomeStoreWaitingSection({open:true,info:false,runtimeStatus,status});
  assert.match(missing,/웨이팅정보가 없습니다/);assert.match(missing,/입구에서 직원에게 문의해주세요/);assert.ok(!missing.includes(status));
  const preparing=renderHomeStoreWaitingSection({open:true,runtimeStatus,status:'<준비>'});
  assert.match(preparing,/현재 웨이팅 상태가 아닙니다/);assert.match(preparing,/&lt;준비&gt;/);assert.doesNotMatch(preparing,/웨이팅 등록/);
 }
 assert.match(gallery(),/영업 이벤트 시간도 표시 예시/);
});
