import test from 'node:test';import assert from 'node:assert/strict';import {existsSync} from 'node:fs';
test('category keeps thirteen choices without confirmation and selected category replaces fourth filter',async()=>{
 assert.ok(existsSync(new URL('./category.mjs',import.meta.url)),'category renderer exists');
 const {categoryScreen}=await import('./category.mjs');
 const open=categoryScreen();assert.equal((open.match(/data-category-id=/g)||[]).length,13);assert.match(open,/업종 선택/);assert.doesNotMatch(open,/>선택 완료<|>확인<|>적용</);
 const selected=categoryScreen({state:'selected'});assert.doesNotMatch(selected,/og-category-overlay/);assert.match(selected,/카페\/베이커리/);assert.doesNotMatch(selected,/>일식</);assert.match(selected,/aria-pressed="true"[^>]*>카페\/베이커리/);
});
