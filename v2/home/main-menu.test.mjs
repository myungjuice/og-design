import test from 'node:test';
import assert from 'node:assert/strict';
import {renderWorkspace} from '../render.mjs';
import {reviewGroups} from '../subnavigation.mjs';
const section=()=>renderWorkspace({pageId:'home'}).match(/<section id="main-menu"[\s\S]*?<\/section>\s*(?:<\/main>|$)/)?.[0]||renderWorkspace({pageId:'home'}).split('<section id="main-menu"')[1]||'';
const screen=(state)=>section().match(new RegExp(`data-main-menu-state="${state}"([\\s\\S]*?)<\\/template>`))?.[1]||'';

// Catches a missing route/group or eager opening of the optional condition comparison.
test('main menu joins the store group and keeps its condition comparison collapsed',()=>{
 const group=reviewGroups('home').find(group=>group.id==='store');
 assert.deepEqual(group.items.map(item=>item.id),['store','store-share','store-photo','main-menu','full-menu','menu-detail']);
 assert.match(renderWorkspace({pageId:'home'}),/<section id="main-menu"[^>]*data-review-screen/);
 assert.match(section(),/data-main-menu-state="basic"/);
 assert.match(section(),/data-main-menu-state="conditions"/);
 assert.doesNotMatch(section(),/<details[^>]*v2-home-main-menu-extra[^>]*\bopen\b/);
});

// Catches invented menu data, reordered entries, or showing more than the first four.
test('main menu displays the first four registered items with their existing prices',()=>{
 const html=screen('basic');
 assert.match(html,/오시 망원본점/);
 const names=[...html.matchAll(/<h5>([^<]*)<\/h5>/g)].map(match=>match[1]);
 assert.deepEqual(names,['트리플치즈 오시노미야끼','카라이 오시노미야끼🌶️🌶️','김치가쓰오 오시노미야끼','오시 야끼소바']);
 assert.deepEqual([...html.matchAll(/class="og-main-menu-price">([^<]+)</g)].map(match=>match[1]),['17,000','17,000','17,000','13,800']);
 assert.equal((html.match(/class="og-main-menu-row"/g)||[]).length,4);
 assert.equal((html.match(/data-v2-media="thumbnail"/g)||[]).length,5); // four photos plus logo
 assert.doesNotMatch(html,/주문하기|장바구니|추천 배지|og-store-photo/);
});

// Catches added blank photo slots, description placeholders or overwritten price text.
test('main menu condition example omits absent photos and descriptions and retains price text',()=>{
 const html=screen('conditions');
 assert.deepEqual([...html.matchAll(/class="og-main-menu-price">([^<]+)</g)].map(match=>match[1]),['12,000','8,000','6,500','시가']);
 const rows=html.split('<article class="og-main-menu-row">').slice(1).map(row=>row.split('</article>')[0]);
 assert.equal(rows.length,4);
 assert.ok(rows[0].includes('v2-thumbnail'));
 assert.ok(!rows[1].includes('thumbnail'));
 assert.ok(!rows[2].includes('og-main-menu-description'));
 assert.ok(!rows[3].includes('thumbnail'));
});

// Catches lost shared controls, false live actions or the wrong current section.
test('main menu keeps shared store controls and read-only scrolling with Menu current',()=>{
 const html=screen('basic');
 assert.match(html,/<button[^>]*aria-current="location"[^>]*>메뉴<\/button>/);
 assert.match(html,/class="og-store-body"[^>]*tabindex="0"[^>]*aria-label="주요 메뉴"/);
 assert.match(html,/v2-section-heading/);assert.match(html,/aria-label="주요 메뉴 더보기"/);
 assert.match(html,/data-heading-action="더보기"[^>]*inert|inert[^>]*data-heading-action="더보기"/);
 assert.doesNotMatch(html,/class="og-store" inert|role="tab|aria-controls|material-icons/);
});

// Catches dropped availability, maximum-four, zero-price and escaping contracts.
test('main menu preserves the source availability and value boundaries',async()=>{
 const {renderHomeMainMenuSection}=await import('./main-menu.mjs');
 assert.equal(renderHomeMainMenuSection({items:[]}), '');
 assert.equal(renderHomeMainMenuSection({showAllInfo:false,items:[{name:'숨김 메뉴',price:1000}]}), '');
 const html=renderHomeMainMenuSection({items:[
  {name:'<메뉴>&',description:'설명 $&',price:12000},
  {name:'문구 우선',price:5000,priceText:'시가'},
  {name:'0 가격',price:0},
  {name:'네 번째',price:6500,priceText:''},
  {name:'다섯 번째',price:9999}
 ]});
 assert.equal((html.match(/class="og-main-menu-row"/g)||[]).length,4);
 assert.match(html,/&lt;메뉴&gt;&amp;/);assert.match(html,/설명 \$&amp;/);
 assert.deepEqual([...html.matchAll(/class="og-main-menu-price">([^<]+)</g)].map(match=>match[1]),['12,000','시가','0','6,500']);
 assert.doesNotMatch(html,/다섯 번째|5,000|9,999|thumbnail/);
});
