import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
test('search preserves history, two result groups and distinct empty branches',async()=>{
 assert.ok(existsSync(new URL('./search.mjs',import.meta.url)),'search renderer exists');
 const {searchScreen}=await import('./search.mjs');
 const history=searchScreen({state:'history'});assert.match(history,/검색어 삭제/);assert.doesNotMatch(history,/전체 삭제|추천 검색어/);
 for(const state of ['results','store-only','region-only']){const html=searchScreen({state});assert.match(html,/오지스토어 검색 결과/);assert.match(html,/지역 검색 결과/);assert.equal((html.match(/검색 결과가 없습니다\./g)||[]).length,state==='results'?0:1);assert.match(html,/inert/);}
 assert.match(searchScreen({state:'empty-history'}),/empty_history.jpg/);
 assert.match(searchScreen({state:'empty-results'}),/empty_result.png/);
 assert.doesNotMatch(searchScreen({state:'empty-results'}),/오지스토어 검색 결과/);
});
