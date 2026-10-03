import test from 'node:test';
import assert from 'node:assert/strict';
import {navigationItems,renderSidebar} from './navigation.mjs';
import {renderWorkspace} from './render.mjs';
import {renderFoundations} from './design-system/foundations.mjs';

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
test('home exposes one map explorer with route-safe original assets and shared navigation',()=>{
 const html=renderWorkspace({pageId:'home'});
 assert.equal((html.match(/class="home-test"/g)||[]).length,1);
 assert.equal((html.match(/class="bottom-navigation"/g)||[]).length,1);
 assert.match(html,/망원동 네이버지도 정적 배경/);assert.match(html,/매장명으로 검색해 주세요/);
 assert.match(html,/href="\/v2\/components\/bottom-navigation.css"/);
 assert.match(html,/data-preview="홈" aria-current="page"/);
 assert.doesNotMatch(html,/대표 화면 연결 예정|승인된|class="my-info-test"|class="barcode-test"/);
 const assets=[...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map(m=>m[1]);
 assert.ok(assets.length>10);
 assert.ok(assets.every(src=>src.startsWith('/screens/my-info-3d-test/media/figma/')||src.includes('/design-system/pages/home/media/naver-mangwon.png')));
});
test('barcode exposes one shared sheet and route-safe mileage assets without other screens',()=>{
 const html=renderWorkspace({pageId:'barcode'});
 assert.equal((html.match(/class="barcode-test"/g)||[]).length,1);
 assert.equal((html.match(/class="og-surface mileage-card v2-mileage"/g)||[]).length,1);
 assert.match(html,/내 바코드/);assert.match(html,/영수증 적립/);assert.match(html,/마일리지 사용/);
 assert.match(html,/실제 회원 정보가 아닌 샘플 바코드/);
 assert.doesNotMatch(html,/대표 화면 연결 예정|class="my-info-test"|class="home-test"|승인된/);
 const images=[...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map(m=>m[1]);
 assert.ok(images.some(src=>src.endsWith('/mileage-m.png')));
 assert.ok(images.every(src=>src.startsWith('/screens/')||src.includes('/design-system/pages/home/media/naver-mangwon.png')));
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
test('my-info presents only the approved representative screen with shared navigation styling',()=>{
 const html=renderWorkspace({pageId:'my-info'});
 assert.doesNotMatch(html,/v2-nav-comparison|data-nav-template|A안 ·|B안 ·|C안 ·/);
 assert.match(html,/href="\/v2\/components\/bottom-navigation.css"/);
 assert.equal((html.match(/class="my-info-test"/g)||[]).length,1);
 assert.equal((html.match(/class="og-surface mileage-card v2-mileage"/g)||[]).length,1);
 assert.equal((html.match(/class="bottom-navigation"/g)||[]).length,1);
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
 assert.doesNotMatch(renderFoundations(),/<button|<input/);
 for(const role of ['screen-top','screen-bottom','button-light','button-face','input-ink','input-muted'])assert.match(html,new RegExp(`data-color-token="--v2-${role}"`));
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
