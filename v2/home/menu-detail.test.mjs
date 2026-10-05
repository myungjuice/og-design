import test from 'node:test';
import assert from 'node:assert/strict';
import {renderWorkspace} from '../render.mjs';
import {reviewGroups} from '../subnavigation.mjs';
const gallery=()=>renderWorkspace({pageId:'home'}).split('<section id="menu-detail"')[1]||'';
const frame=state=>gallery().match(new RegExp(`data-menu-detail-state="${state}"([\\s\\S]*?)<\\/template>`))?.[1]||'';

// Catches an unreachable detail board or eager rendering of three optional comparisons.
test('menu detail is reachable in Store and keeps condition examples collapsed',()=>{
 assert.ok(reviewGroups('home').find(group=>group.id==='store').items.some(item=>item.id==='menu-detail'));
 for(const state of ['basic','options','scrolled','no-photo'])assert.ok(frame(state),state);
 assert.doesNotMatch(gallery(),/<details[^>]*\bopen\b/);
});

// Catches fabricated options, lost full-size registered image or wrong price units.
test('registered menu retains the real description, detail photo and mandatory base price',()=>{
 const html=frame('basic');
 assert.match(html,/트리플치즈 오시노미야끼/);assert.match(html,/치즈로 만든 둥지 위 노른자/);
 assert.match(html,/17715485005\.jpg/);assert.doesNotMatch(html,/_thumb\.jpg/);
 assert.match(html,/>17,000 원</);assert.match(html,/data-tone="info"[^>]*>필수/);
 assert.match(html,/<input[^>]*type="radio"[^>]*checked/);
 assert.doesNotMatch(html,/og-menu-detail-options|추가 옵션명|주문하기|장바구니|SOLD OUT/);
});

// Catches lost optional-section boundaries and scrolled selected-option display.
test('detail conditions distinguish illustrative options from registered menu facts',()=>{
 const options=frame('options'),scrolled=frame('scrolled'),empty=frame('no-photo');
 assert.equal((options.match(/type="checkbox"/g)||[]).length,2);
 assert.match(options,/>\+1,000 원</);assert.match(options,/>\+2,000 원</);
 assert.doesNotMatch(scrolled,/og-menu-detail-photo|og-menu-detail-no-photo/);
 assert.match(scrolled,/<input[^>]*type="checkbox"[^>]*checked/);
 assert.doesNotMatch(empty,/og-menu-detail-photo|og-menu-detail-options|data-v2-media/);
 assert.match(empty,/og-menu-detail-no-photo/);assert.match(empty,/>17,000 원</);
 assert.match(gallery(),/실제 판매 옵션이 아닌 배치 예시/);
});

// Catches unescaped facts, replacement-token corruption, zero-price handling and accidental live actions.
test('detail adapter preserves source boundaries without enabling selection or navigation',async()=>{
 assert.ok(gallery(),'menu detail review must exist');
 const {renderHomeMenuDetailScreen}=await import('./menu-detail.mjs');
 const html=renderHomeMenuDetailScreen({item:{name:'<메뉴>&',description:'첫줄\n둘째줄 $&',price:0,options:[{name:'<옵션>',price:0,selected:true}]}});
 assert.match(html,/&lt;메뉴&gt;&amp;/);assert.match(html,/첫줄 둘째줄 \$&amp;/);
 assert.match(html,/>0 원</);assert.match(html,/>\+0 원</);assert.match(html,/&lt;옵션&gt;/);
 assert.match(html,/role="region" tabindex="0" aria-label="메뉴 가격과 옵션"/);
 assert.doesNotMatch(html,/class="og-menu-detail v2-menu-detail" inert|material-icons/);
 assert.ok([...html.matchAll(/<button\b[^>]*>/g)].every(([tag])=>/\binert\b/.test(tag)));
 assert.ok([...html.matchAll(/<label\b[^>]*>/g)].every(([tag])=>/\binert\b/.test(tag)));
 const text=renderHomeMenuDetailScreen({item:{name:'문구',description:'',price:10000,priceText:'시가',options:[]}});
 assert.match(text,/>시가</);assert.doesNotMatch(text,/10,000|시가 원|og-menu-detail-options/);
 assert.throws(()=>renderHomeMenuDetailScreen({state:'bad'}),RangeError);
});
