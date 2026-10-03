import test from 'node:test';
import assert from 'node:assert/strict';
import {navigationItems,renderSidebar} from './navigation.mjs';
import {renderWorkspace} from './render.mjs';

test('menu anchors expose all seven destinations in the approved order',()=>{
 assert.deepEqual(navigationItems.map(({id,label,href})=>[id,label,href]),[
  ['design-system','디자인 시스템','/v2/design-system/'],['components','공통 컴포넌트','/v2/components/'],['home','홈화면','/v2/home/'],
  ['my-land','마이랜드','/v2/my-land/'],['barcode','바코드','/v2/barcode/'],
  ['og-park','오지파크','/v2/og-park/'],['my-info','내정보','/v2/my-info/']
 ]);
 const html=renderSidebar({activeId:'barcode'});
 assert.equal((html.match(/aria-current="page"/g)||[]).length,1);
 assert.match(html,/<a[^>]*href="\/v2\/barcode\/"[^>]*aria-current="page"/);
});
test('blank future destinations contain only their title in main',()=>{
 for(const [id,title] of [['my-land','마이랜드'],['og-park','오지파크']]){
  const html=renderWorkspace({pageId:id});
  assert.match(html,new RegExp(`<main[^>]*>\\s*<h1[^>]*>${title}</h1>\\s*</main>`));
 }
});
test('pending representative screens link to the preserved test page',()=>{
 for(const id of ['home','barcode']){
  const html=renderWorkspace({pageId:id});
  assert.match(html,/대표 화면 연결 예정/);
  assert.match(html,/href="\/screens\/my-info-3d-test\/"/);
  assert.doesNotMatch(html,/class="(?:my-info-test|home-test|barcode-test)"/);
 }
});
test('my-info exposes one approved representative screen without pulling home or barcode screens',()=>{
 const html=renderWorkspace({pageId:'my-info'});
 assert.equal((html.match(/class="my-info-test"/g)||[]).length,1);
 assert.match(html,/class="og-surface mileage-card v2-mileage"/);
 assert.match(html,/최근 방문/);assert.match(html,/스시산원 반주헌/);
 assert.doesNotMatch(html,/대표 화면 연결 예정|class="home-test"|class="barcode-test"/);
 const images=[...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map(m=>m[1]);
 assert.ok(images.length>10);
 assert.ok(images.every(src=>src.startsWith('/screens/my-info-3d-test/media/figma/')),'shared assets resolve from the v2 route');
});
test('my-info adds three navigation-only comparisons without duplicating the representative screen',()=>{
 const html=renderWorkspace({pageId:'my-info'});
 assert.deepEqual([...html.matchAll(/class="v2-nav-comparison" data-variant="([^"]+)"/g)].map(m=>m[1]),['underline','label-chip','backed-underline']);
 assert.match(html,/A안 · 짧은 밑줄형/);assert.match(html,/B안 · 메뉴명 칩형/);
 assert.match(html,/C안 · 기존 선택 표시 \+ 밑줄/);
 assert.equal((html.match(/class="my-info-test"/g)||[]).length,1);
 assert.equal((html.match(/class="og-surface mileage-card v2-mileage"/g)||[]).length,1);
 assert.equal((html.match(/class="bottom-navigation"/g)||[]).length,4);
 assert.match(html,/선택 표시만 비교하며 실제 화면으로 이동하지 않습니다/);
});
test('unknown IDs give a safe return route without echoing markup',()=>{
 const html=renderWorkspace({pageId:'<script>bad</script>'});
 assert.match(html,/href="\/v2\/design-system\/"/);
 assert.doesNotMatch(html,/<script>bad/);
});
test('design system presents five foundation groups as visual specimens',()=>{
 const html=renderWorkspace({pageId:'design-system'});
 assert.deepEqual([...html.matchAll(/data-foundation="([^"]+)"/g)].map(x=>x[1]),['colors','typography','spacing','radius','materials']);
 assert.match(html,/시각 규칙 검토용/);
 assert.doesNotMatch(html,/<button|<input/);
 assert.equal((html.match(/data-color-token=/g)||[]).length,13);
 for(const id of ['components','home','my-land','barcode','og-park','my-info'])assert.doesNotMatch(renderWorkspace({pageId:id}),/data-foundation=/);
});
test('components have their own route and use the actual shared renderers',()=>{
 const html=renderWorkspace({pageId:'components'});
 assert.match(html,/<h1>공통 컴포넌트<\/h1>/);
 assert.match(html,/class="og-button v2-button/);
 assert.match(html,/class="og-surface v2-card/);
 assert.match(html,/class="og-menu-tile v2-menu-tile/);
 for(const state of ['default','active','disabled','loading','error','success'])assert.match(html,new RegExp(`data-state="${state}"`));
 assert.doesNotMatch(html,/data-state="(?:hover|focus)"/);
});
