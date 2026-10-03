import test from 'node:test';
import assert from 'node:assert/strict';
import {navigationItems,renderSidebar} from './navigation.mjs';
import {renderWorkspace} from './render.mjs';

test('menu anchors expose all six destinations in the approved order',()=>{
 assert.deepEqual(navigationItems.map(({id,label,href})=>[id,label,href]),[
  ['design-system','디자인 시스템','/v2/design-system/'],['home','홈화면','/v2/home/'],
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
 for(const id of ['home','barcode','my-info']){
  const html=renderWorkspace({pageId:id});
  assert.match(html,/대표 화면 연결 예정/);
  assert.match(html,/href="\/screens\/my-info-3d-test\/"/);
  assert.doesNotMatch(html,/class="(?:my-info-test|home-test|barcode-test)"/);
 }
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
 for(const id of ['home','my-land','barcode','og-park','my-info'])assert.doesNotMatch(renderWorkspace({pageId:id}),/data-foundation=/);
});
