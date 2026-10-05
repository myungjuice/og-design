import test from 'node:test';
import assert from 'node:assert/strict';
import {renderWorkspace} from '../render.mjs';
import {reviewGroups} from '../subnavigation.mjs';
const gallery=()=>renderWorkspace({pageId:'home'}).split('<section id="full-menu"')[1]||'';
const frame=state=>gallery().match(new RegExp(`data-full-menu-state="${state}"([\\s\\S]*?)<\\/template>`))?.[1]||'';

// Catches an unreachable board or eager expansion of expensive alternative screens.
test('full menu joins Store with three states and collapsed alternatives',()=>{
 assert.ok(reviewGroups('home').find(group=>group.id==='store').items.some(item=>item.id==='full-menu'));
 for(const state of ['basic','scrolled','search'])assert.ok(frame(state),state);
 assert.doesNotMatch(gallery(),/<details[^>]*\bopen\b/);
});

// Catches accidentally applying the major-menu four-item cap or changing price units.
test('full menu keeps all registered rows and eight featured entries with distinct price units',()=>{
 const html=frame('basic');
 assert.equal((html.match(/class="og-full-menu-item"/g)||[]).length,29);
 assert.equal((html.match(/class="og-full-menu-item is-featured"/g)||[]).length,8);
 assert.match(html,/>17,000 원</);assert.match(html,/>14,200</);assert.match(html,/쿠로 토리스테키/);
 assert.equal((html.match(/class="og-full-menu-image-space"/g)||[]).length,5);
 assert.equal((html.match(/data-state="empty"/g)||[]).length,5);
 assert.doesNotMatch(html,/장바구니|주문하기|SOLD OUT/);
});

// Catches hiding static category names from assistive technology along with service buttons.
test('static category rail exposes its available labels as readable navigation information',()=>{
 assert.match(frame('basic'),/aria-description="메뉴 검색 · 대표메뉴 · 새로 나온 메뉴 · 추천 메뉴 · 오꼬노미야끼 · 야끼소바 · 사이드메뉴"/);
});

// Catches losing compact identity or search filtering, or leaking hidden backing content.
test('scrolled and search previews preserve source identity and name-contains results',()=>{
 const scrolled=frame('scrolled'),search=frame('search');
 assert.doesNotMatch(scrolled,/og-full-menu-hero|og-full-menu-featured/);
 assert.match(scrolled,/<h4>오시 망원본점<\/h4>/);
 const results=search.split('class="og-full-menu-results"')[1]||'';
 assert.equal((results.match(/class="og-full-menu-item"/g)||[]).length,24); // all noodle/pancake names, not only the noodle category
 assert.match(search,/value="야끼"/);
 assert.match(search,/v2-full-menu-background" inert aria-hidden="true"/);
 assert.match(search,/role="region" tabindex="0" aria-label="메뉴 검색 결과"/);
 assert.doesNotMatch(search,/material-icons|role="dialog|role="tab/);
});

// Catches overwritten price text, lost sold-out/absent-photo branches and unsafe text insertion.
test('full menu preserves custom source conditions without enabling service actions',async()=>{
 assert.ok(gallery(),'full menu review must exist');
 const {renderHomeFullMenuScreen}=await import('./full-menu.mjs');
 const html=renderHomeFullMenuScreen({items:[
  {name:'<메뉴>&',description:'설명 $&',price:0,category:'테스트',featured:true,soldOut:true},
  {name:'가격 문구',price:15000,priceText:'시가',category:'테스트'}
 ]});
 assert.match(html,/&lt;메뉴&gt;&amp;/);assert.match(html,/설명 \$&amp;/);
 assert.match(html,/>0</);assert.match(html,/>0 원</);assert.match(html,/>시가</);
 assert.doesNotMatch(html,/15,000|시가 원|material-icons|class="og-full-menu"[^>]*inert/);
 assert.equal((html.match(/SOLD OUT/g)||[]).length,2);
 assert.equal((html.match(/class="og-full-menu-image-space"/g)||[]).length,2);
 assert.ok([...html.matchAll(/<button\b[^>]*>/g)].every(([tag])=>/\binert\b/.test(tag)));
 assert.match(html,/class="og-full-menu-body" role="region" tabindex="0"/);
 assert.throws(()=>renderHomeFullMenuScreen({state:'bad'}),RangeError);
});
