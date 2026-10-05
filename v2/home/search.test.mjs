import test from 'node:test';
import assert from 'node:assert/strict';
import {renderWorkspace} from '../render.mjs';
import {reviewGroups} from '../subnavigation.mjs';

// Catches a missing home search destination, lost source state, or eager gallery mount.
test('home search exposes all six source states through one grouped destination',()=>{
 const html=renderWorkspace({pageId:'home'});
 assert.ok(reviewGroups('home').some(group=>group.items.some(item=>item.id==='search'&&!item.pending)));
 assert.match(html,/<section id="search"[^>]*data-review-screen/);
 assert.deepEqual([...html.matchAll(/data-search-state="([^"]+)"/g)].map(match=>match[1]),['history','results','store-only','region-only','empty-history','empty-results']);
 assert.equal((html.match(/data-search-template/g)||[]).length,6);
 assert.match(html,/<details class="v2-home-search-extra"/);
 assert.doesNotMatch(html,/<details class="v2-home-search-extra"[^>]*\bopen\b/);
});

// Catches swapping the map or source group/empty branches when porting the six specimens.
test('home search preserves result groups and explains both empty states without service controls',()=>{
 const html=renderWorkspace({pageId:'home'});
 const states=[...html.matchAll(/data-search-state="([^"]+)"([\s\S]*?)(?=<\/template>)/g)];
 assert.equal(states.length,6);
 const byState=Object.fromEntries(states.map(match=>[match[1],match[2]]));
 assert.match(byState.history,/성수[\s\S]*카페[\s\S]*서울숲/);
 assert.match(byState.results,/오지스토어 검색 결과[\s\S]*지역 검색 결과/);
 assert.match(byState['store-only'],/no_region\.png/);
 assert.match(byState['region-only'],/no_store\.png/);
 assert.match(byState['empty-history'],/>최근 검색 기록이 없어요\.</);
 assert.match(byState['empty-results'],/>검색 결과가 없어요\.</);
 assert.match(byState['empty-results'],/다른 매장명이나 지역으로 검색해 주세요\./);
 for(const state of ['empty-history','empty-results']){
  assert.match(byState[state],/class="v2-search-empty-visual[^\"]*" aria-hidden="true"/);
  assert.match(byState[state],/class="v2-search-empty-visual[^\"]*"[^>]*><svg/);
  assert.match(byState[state],/<circle[^>]*r="(?:6|9)"/);
  assert.doesNotMatch(byState[state],/v2-search-empty-(?:clock|lens|handle)/);
  assert.doesNotMatch(byState[state],/empty_history\.jpg|empty_result\.png/);
 }
 for(const markup of Object.values(byState)){
  assert.match(markup,/naver-mangwon\.png/);
  assert.match(markup,/role="region"[^>]*tabindex="0"/);
  assert.match(markup,/<input[^>]*\breadonly\b[^>]*\binert\b/);
  assert.doesNotMatch(markup,/material-icons|og-home-ground|og-home-filters/);
 }
});
