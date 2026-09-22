import test from 'node:test';import assert from 'node:assert/strict';import {existsSync} from 'node:fs';
test('nearby preserves image count, visit action and empty branch without new fields',async()=>{
 assert.ok(existsSync(new URL('./nearby.mjs',import.meta.url)),'nearby renderer exists');
 const {nearbyScreen,nearbyCard}=await import('./nearby.mjs');
 assert.match(nearbyScreen({state:'empty'}),/2Km 이내에 매장이 없습니다\./);
 assert.doesNotMatch(nearbyScreen({state:'empty'}),/방문하기/);
 const card=nearbyCard({name:'<매장>',promotion:'소개 & 안내',images:['test.png','other.png']});assert.match(card,/&lt;매장&gt;/);assert.match(card,/소개 &amp; 안내/);assert.match(card,/1 · 2/);assert.match(card,/방문하기/);
 assert.match(nearbyScreen({state:'no-photo'}),/no_image.png/);assert.match(nearbyScreen({state:'no-photo'}),/0 · 0/);
 assert.doesNotMatch(card,/평점|오픈일|리뷰 키워드/);
});
