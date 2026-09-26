import test from 'node:test';import assert from 'node:assert/strict';import {existsSync} from 'node:fs';
test('nearby default maps the public store snapshot without placeholder cards',async()=>{
 const {nearbyScreen}=await import('./nearby.mjs');
 const html=nearbyScreen();
 assert.ok(html.includes('망원동 근처 보기'));
 assert.ok(html.includes('<h3>오시 망원본점</h3>'));
 assert.ok(html.includes('최애가 되기위해 탄생한 오꼬노미야끼'));
 assert.ok(html.includes('/store_photo/FS3627025392/1710146278412.jpg'));
 assert.ok(html.includes('1 · 10'));
 assert.equal((html.match(/class="og-nearby-card"/g)||[]).length,1);
 assert.ok(!html.includes('회원점 소개 문구'));
});
test('nearby preserves image count, visit action and empty branch without new fields',async()=>{
 assert.ok(existsSync(new URL('./nearby.mjs',import.meta.url)),'nearby renderer exists');
 const {nearbyScreen,nearbyCard}=await import('./nearby.mjs');
 assert.match(nearbyScreen({state:'empty'}),/2Km 이내에 매장이 없습니다\./);
 assert.doesNotMatch(nearbyScreen({state:'empty'}),/방문하기/);
 const card=nearbyCard({name:'<매장>',promotion:'소개 & 안내',images:['test.png','other.png']});assert.match(card,/&lt;매장&gt;/);assert.match(card,/소개 &amp; 안내/);assert.match(card,/1 · 2/);assert.match(card,/방문하기/);
 assert.match(nearbyScreen({state:'no-photo'}),/no_image.png/);assert.match(nearbyScreen({state:'no-photo'}),/0 · 0/);
 assert.doesNotMatch(card,/평점|오픈일|리뷰 키워드/);
});
