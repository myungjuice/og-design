import test from 'node:test';import assert from 'node:assert/strict';import {existsSync} from 'node:fs';
test('store navigation follows legacy availability and empty photo branch',async()=>{
 assert.ok(existsSync(new URL('./store.mjs',import.meta.url)),'store renderer exists');
 const {storeNavigation,storeScreen}=await import('./store.mjs');
 assert.deepEqual(storeNavigation({menu:true,reserve:true,wait:true,news:true,event:true}),['홈','메뉴','예약/웨이팅','소식/이벤트','리뷰','매장 상세정보','위치찾기']);
 assert.deepEqual(storeNavigation({reserve:true}),['홈','예약','리뷰','매장 상세정보','위치찾기']);
 assert.deepEqual(storeNavigation({wait:true,event:true}),['홈','웨이팅','이벤트','리뷰','매장 상세정보','위치찾기']);
 const empty=storeScreen({images:[],name:'<회원점>'});assert.match(empty,/no_image.png/);assert.doesNotMatch(empty,/og-store-count/);assert.match(empty,/&lt;회원점&gt;/);
 assert.doesNotMatch(storeScreen({}),/>EVENT</);assert.match(storeScreen({event:true}),/>EVENT</);
});
