import test from 'node:test';
import assert from 'node:assert/strict';
import {renderWorkspace} from './render.mjs';
import {renderDesignerScreen,categoryRows} from './designer-20261013.mjs';
import {existsSync} from 'node:fs';

// 실제 렌더 결과에서 새 시안 누락과 선택 상태 유실을 검출한다.
test('카테고리 비교는 홈과 선택 전후 및 전체 화면형을 모두 노출한다',()=>{
 const html=renderWorkspace({pageId:'home'});
 assert.match(html,/id="category-design"/);
 assert.equal((html.match(/data-designer-screen="(?:home|category-before|category-after|category-full)"/g)||[]).length,4);
 assert.match(html,/초기화/);
});
test('23종 카테고리는 수령한 로컬 SVG를 사용하며 전체 항목을 추가하지 않는다',()=>{
 const names=categoryRows.flat();
 assert.equal(names.length,23);
 for(const name of names)assert.ok(existsSync(new URL('../assets/received-icons-20261022/categories/'+name.replaceAll('/','-')+'.svg',import.meta.url)),name);
 for(const state of ['category-before','category-after','category-full']){
  const html=renderDesignerScreen(state).split('<section class="filter-panel">')[1];
  assert.equal((html.match(/data-category=/g)||[]).length,23);
  assert.equal((html.match(/data-received-icon="category"/g)||[]).length,23);
  assert.equal((html.match(/aria-pressed="true"/g)||[]).length,state==='category-before'?0:4);
  assert.doesNotMatch(html,/전체\.svg|data-category="전체"/);
 }
});
test('마이랜드는 폐기한 두 배경 비교안 대신 확정안과 세부시안만 렌더링한다',()=>{
 const html=renderWorkspace({pageId:'my-land'});
 assert.doesNotMatch(html,/data-designer-screen="myland-v[12]"|id="myland-design"|미션마다 아이콘 필요/);
 assert.equal((html.match(/data-myland-feedback-screen=/g)||[]).length,1);
 assert.equal((html.match(/data-myland-detail=/g)||[]).length,12);
});
