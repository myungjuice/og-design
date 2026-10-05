import test from 'node:test';
import assert from 'node:assert/strict';
import {renderWorkspace} from '../render.mjs';
import {reviewGroups} from '../subnavigation.mjs';
const gallery=()=>renderWorkspace({pageId:'home'}).split('<section id="store-reservation"')[1]||'';
const frame=state=>gallery().match(new RegExp(`data-store-reservation-state="${state}"([\\s\\S]*?)<\\/template>`))?.[1]||'';

// Catches missing navigation or loading four comparisons before the user asks.
test('store reservation is reachable in a service group with five collapsed state examples',()=>{
 assert.ok(reviewGroups('home').some(group=>group.items.some(item=>item.id==='store-reservation')));
 for(const state of ['open','current','closed','closed-current','expired-multiple'])assert.ok(frame(state),state);
 assert.doesNotMatch(gallery(),/<details[^>]*\bopen\b/);
 assert.match(gallery(),/실제 예약 정보가 아닌 표시 예시/);
});

// Catches dates incorrectly shown for an existing reservation and lost availability labels.
test('open reservation shows a readable candidate rail and current reservation shows date and people instead',()=>{
 const open=frame('open'),current=frame('current');
 assert.equal((open.match(/class="og-store-service-date"/g)||[]).length,5);
 assert.match(open,/9\/19\(토\)/);assert.match(open,/9\/23\(수\)/);
 assert.match(open,/data-available="false"/);assert.match(open,/예약불가/);assert.match(open,/다른 날짜 예약/);
 assert.match(open,/tabindex="0" aria-label="예약 후보 날짜/);
 assert.doesNotMatch(open,/내 예약 보기|추가 예약|성인: 2명/);
 assert.match(current,/2026년 9월 22일\(화\) 18:00/);assert.match(current,/성인: 2명, 어린이: 0명/);
 assert.match(current,/내 예약 보기/);assert.match(current,/aria-label="추가 예약"/);
 assert.doesNotMatch(current,/og-store-service-dates|다른 날짜 예약|예약이 1건/);
});

// Catches closure erasing an existing booking, or permitting an extra booking while closed.
test('closed states retain the notice before existing facts and expired multiple state retains count',()=>{
 const closed=frame('closed'),current=frame('closed-current'),expired=frame('expired-multiple');
 assert.match(closed,/현재 예약 접수가 일시적으로 중지되었습니다/);
 assert.doesNotMatch(closed,/내 예약 보기|추가 예약|다른 날짜 예약|og-store-service-dates/);
 assert.match(current,/내 예약 보기/);assert.match(current,/성인: 2명/);
 assert.ok(current.indexOf('현재 예약 접수가')<current.indexOf('예약일:'));
 assert.doesNotMatch(current,/추가 예약|다른 날짜 예약|og-store-service-dates/);
 assert.match(expired,/예약이 2건 있습니다/);assert.match(expired,/예약 시간 경과/);
 assert.match(expired,/2026년 9월 18일\(금\) 18:00/);assert.match(expired,/aria-label="추가 예약"/);
});

// Catches live booking/navigation, inconsistent icon fonts, or an inert reading region.
test('reservation adapter uses shared materials and keeps only review reading active',async()=>{
 assert.ok(gallery(),'reservation review must exist');
 const {renderHomeStoreReservationScreen,renderHomeStoreReservationSection}=await import('./store-reservation.mjs');
 const html=renderHomeStoreReservationScreen({state:'current'});
 assert.match(html,/오시 망원본점/);assert.match(html,/body" role="region" tabindex="0" aria-label="매장 예약 안내"/);
 assert.match(html,/v2-section-heading/);assert.match(html,/v2-surface/);assert.match(html,/v2-button/);
 assert.doesNotMatch(html,/material-icons|class="og-store" inert/);
 assert.ok([...html.matchAll(/<button\b[^>]*>/g)].every(([tag])=>/\binert\b/.test(tag)));
 const section=renderHomeStoreReservationSection({open:false,current:true,count:3,expired:true});
 assert.match(section,/예약이 3건 있습니다/);assert.match(section,/예약 시간 경과/);assert.doesNotMatch(section,/추가 예약/);
 assert.throws(()=>renderHomeStoreReservationScreen({state:'unknown'}),RangeError);
});

// Catches a missing restriction popup, live confirmation or an accessible undimmed base.
test('no-show restriction specimen preserves the source notice and isolates the whole store backdrop',()=>{
 const html=frame('no-show-limit');assert.ok(html,'no-show-limit specimen');
 assert.match(html,/미방문\(노쇼\) 누적 안내/);assert.match(html,/마지막 노쇼 발생일로부터 1개월간/);
 for(const text of ['미방문 누적 횟수: 3회','마지막 노쇼 발생일: 2026년 9월 18일(금)','해제일: 2026년 10월 18일(일)','실제 회원정보가 아닌 표시 예시'])assert.ok(html.includes(text),text);
 assert.match(html,/class="v2-store-reservation-backdrop" inert aria-hidden="true"/);
 const overlay=html.split('<div class="v2-store-reservation-limit-overlay">')[1]||'';
 assert.match(overlay,/v2-dialog-panel/);assert.match(overlay,/role="region"[^>]*tabindex="0"/);
 assert.doesNotMatch(overlay,/<div class="v2-dialog-static"[^>]*inert/);
 assert.match(overlay,/>확인<\/button>/);
 assert.ok([...html.matchAll(/<button\b[^>]*>/g)].every(([tag])=>/\binert\b/.test(tag)));
 assert.doesNotMatch(html,/<form|<script|\bonclick=|data-dialog-open/);
});
