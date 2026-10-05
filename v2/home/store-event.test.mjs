import test from 'node:test';
import assert from 'node:assert/strict';
import {renderWorkspace} from '../render.mjs';
import {reviewGroups} from '../subnavigation.mjs';
const gallery=()=>renderWorkspace({pageId:'home'}).split('<section id="store-event"')[1]||'';
const frame=state=>gallery().match(new RegExp(`data-store-event-state="${state}"([\\s\\S]*?)<\\/template>`))?.[1]||'';

test('store event joins news in the updates group with three lazy source examples',()=>{
 const items=reviewGroups('home').find(group=>group.id==='store-updates')?.items||[];
 for(const id of ['store-news','store-event'])assert.ok(items.some(item=>item.id===id),id);
 for(const state of ['registered','active','upcoming-ended'])assert.ok(frame(state),state);
 assert.doesNotMatch(gallery(),/<details[^>]*\bopen\b/);
 assert.match(gallery(),/상태 비교용 기간/);
});

test('registered event preserves the historical record and shows ended, not a current offer',()=>{
 const html=frame('registered');assert.match(html,/육감만족/);assert.match(html,/포장할인 5000원/);
 assert.match(html,/2026-06-26 ~ 2026-08-31/);assert.match(html,/종료된 이벤트/);
 assert.equal([...html.matchAll(/class="og-update-row"/g)].length,1);
 assert.match(html,/data-status="ended"/);assert.doesNotMatch(html,/data-status="active"/);
 assert.match(html,/event_banner\/FS9184178497\/1782477916274\.jpg/);
 assert.match(html,/data-ratio="square"/);assert.match(html,/aria-current="location">이벤트</);
});

test('event comparisons preserve two-row date states, star shapes and optional photos',()=>{
 const active=frame('active'),other=frame('upcoming-ended');
 for(const html of [active,other]){assert.equal([...html.matchAll(/class="og-update-row"/g)].length,2);assert.equal([...html.matchAll(/event_banner\//g)].length,1);}
 assert.match(active,/2일 남음/);assert.match(active,/오늘 종료/);
 assert.match(active,/2026-09-01 ~ 2026-09-21/);assert.match(active,/2026-09-01 ~ 2026-09-19/);
 assert.equal([...active.matchAll(/data-event-star="filled"/g)].length,2);
 assert.match(other,/D-3/);assert.match(other,/종료된 이벤트/);
 assert.match(other,/2026-09-22 ~ 2026-09-30/);assert.match(other,/2026-09-01 ~ 2026-09-18/);
 assert.equal([...other.matchAll(/data-event-star="outline"/g)].length,2);
});

test('event adapter preserves omission, ordering, escaping, day boundaries and static controls',async()=>{
 assert.ok(gallery(),'event review must exist');
 const {renderHomeStoreEventSection:section,renderHomeStoreEventScreen:screen}=await import('./store-event.mjs');
 assert.equal(section([]),'');
 const html=section([{title:'<img onerror=alert(1)>',start:'2026-09-19',end:'2026-09-19'},{title:'두번째',start:'2026-09-20',end:'2026-09-30'},{title:'세번째',start:'2026-09-01',end:'2026-09-18'}],'2026-09-19');
 assert.match(html,/&lt;img onerror=alert\(1\)&gt;/);assert.doesNotMatch(html,/<img|세번째/);
 assert.ok(html.indexOf('오늘 종료')<html.indexOf('두번째'));assert.match(html,/D-1/);
 assert.match(html,/data-event-star="filled"/);assert.match(html,/data-event-star="outline"/);
 assert.match(section([{title:'종료 경계',start:'2026-09-01',end:'2026-09-18'}],'2026-09-19'),/종료된 이벤트/);
 assert.match(html,/v2-section-heading/);assert.match(html,/aria-label="이벤트 더보기"/);
 const rendered=screen();assert.match(rendered,/tabindex="0" aria-label="매장 이벤트 안내"/);
 assert.doesNotMatch(rendered,/material-icons|class="og-store" inert/);
 assert.ok([...rendered.matchAll(/<button\b[^>]*>/g)].every(([tag])=>/\binert\b/.test(tag)));
 assert.throws(()=>screen({state:'unknown'}),RangeError);
});
