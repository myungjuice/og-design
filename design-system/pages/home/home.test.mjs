import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
test('home provides static default, clustered and new-store states with shared navigation',async()=>{
 assert.ok(existsSync(new URL('./render.mjs',import.meta.url)),'home renderer is present');
 const {homeScreen}=await import('./render.mjs');
 for(const state of ['default','cluster','new']){
  const html=homeScreen({state});
  assert.match(html,/inert/);assert.match(html,/매장명으로 검색해 주세요/);
  assert.match(html,/현 지도 위치 둘러보기/);assert.match(html,/og-app-bottom-nav/);
  assert.equal((html.match(/class="og-map-cluster"/g)||[]).length,state==='cluster'?3:0);
  assert.equal((html.match(/class="og-map-new"/g)||[]).length,state==='new'?1:0);
 }
});
