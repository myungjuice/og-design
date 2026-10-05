import test from 'node:test';
import assert from 'node:assert/strict';
import {renderWorkspace} from '../render.mjs';
import {reviewGroups} from '../subnavigation.mjs';
const gallery=()=>renderWorkspace({pageId:'home'}).split('<section id="event-list"')[1]||'';
const frame=state=>gallery().match(new RegExp(`data-event-list-state="${state}"([\\s\\S]*?)<\\/template>`))?.[1]||'';

test('event whole list is reachable beside news and defers labelled status comparisons',()=>{
 assert.ok(reviewGroups('home').find(group=>group.id==='store-updates')?.items.some(item=>item.id==='event-list'));
 for(const state of ['registered','states','empty'])assert.ok(frame(state),state);
 assert.doesNotMatch(gallery(),/<details[^>]*\bopen\b/);assert.match(gallery(),/실제 행사 기간이나 등록 건수가 아닙니다/);
});
test('registered event retains its original ended period while four comparison rows are uncapped and sorted',()=>{
 const html=frame('registered'),mix=frame('states');
 assert.match(html,/우리 매장 이벤트/);assert.match(html,/육감만족/);assert.match(html,/포장할인 5000원/);
 assert.match(html,/2026\.6\.26 ~ 2026\.8\.31/);assert.match(html,/종료된 이벤트/);
 assert.equal([...html.matchAll(/class="og-update-row"/g)].length,1);assert.match(html,/event_banner\/FS9184178497\/1782477916274\.jpg/);
 assert.equal([...mix.matchAll(/class="og-update-row"/g)].length,4);
 assert.deepEqual([...mix.matchAll(/data-status="([^"]+)"/g)].map(([,status])=>status),['active','active','upcoming','ended']);
 for(const copy of ['오늘 종료','2일 남음','D-3','종료된 이벤트','2026.9.1 ~ 2026.9.19'])assert.ok(mix.includes(copy),copy);
 assert.equal([...mix.matchAll(/event_banner\//g)].length,2);
 assert.equal([...mix.matchAll(/data-event-star="filled"/g)].length,2);
 assert.equal([...mix.matchAll(/data-event-star="outline"/g)].length,2);
});
test('empty event list retains brand and source illustration and explanation without extra actions',()=>{
 const html=frame('empty');assert.match(html,/육감만족/);assert.match(html,/brand_logo\//);
 assert.match(html,/등록된 이벤트가 없습니다\./);assert.match(html,/ogapp\/empty_event\.png/);assert.match(html,/data-fit="contain"/);
 assert.doesNotMatch(html,/og-update-row|검색|정렬|참여하기|다시 시도/);assert.equal([...html.matchAll(/<button\b/g)].length,1);
});
test('event adapter preserves source date tie breakers, escaping, omitted photos and readable body',async()=>{
 assert.ok(gallery(),'event list must exist');const {renderHomeEventListScreen:screen}=await import('./event-list.mjs');
 const items=[
  {title:'종료 이전',start:'2026-09-01',end:'2026-09-17'},
  {title:'예정 짧음',start:'2026-09-22',end:'2026-09-28'},
  {title:'진행 늦음',start:'2026-09-02',end:'2026-09-21'},
  {title:'<진행 $&>',start:'2026-09-01',end:'2026-09-21'},
  {title:'예정 김',start:'2026-09-22',end:'2026-09-30'},
  {title:'종료 최근',start:'2026-09-01',end:'2026-09-18'}];
 const before=JSON.stringify(items),html=screen({items,today:'2026-09-19',logo:''});
 assert.deepEqual([...html.matchAll(/<h5>(.*?)<\/h5>/g)].map(([,title])=>title),['&lt;진행 $&amp;&gt;','진행 늦음','예정 김','예정 짧음','종료 최근','종료 이전']);
 assert.equal(JSON.stringify(items),before);assert.doesNotMatch(html,/<진행|og-update-row[^]*?<img|material-icons/);
 assert.match(html,/data-brand-fallback="storefront"/);assert.match(html,/role="region" tabindex="0" aria-label="전체 이벤트 목록"/);
 assert.ok([...html.matchAll(/<button\b[^>]*>/g)].every(([tag])=>/\binert\b/.test(tag)));
 assert.throws(()=>screen({state:'unknown'}),RangeError);
});
