import test from 'node:test';
import assert from 'node:assert/strict';
test('details hide absent optional fields and preserve provided text',async()=>{
 const {storeInfoSection}=await import('./store-info.mjs');
 const html=storeInfoSection({streetAddress:'도로명 주소',detailAddress:'2층',hours:['월–금 10:00–20:00'],breakTime:['매일 15:00–16:00'],closeDay:['매주 월요일'],tempCloseDay:['9월 20일'],phone:'02-000-0000',homepage:'https://example.com'});
 for(const t of ['도로명 주소 2층','월–금 10:00–20:00','브레이크타임','정기 휴무일','임시 휴무일','02-000-0000','https://example.com'])assert.ok(html.includes(t));
 const minimal=storeInfoSection({streetAddress:'주소'});
 assert.match(minimal,/위치찾기/);assert.doesNotMatch(minimal,/브레이크타임|정기 휴무일|임시 휴무일|contact_phone|contact_instagram/);
 assert.doesNotMatch(storeInfoSection({streetAddress:'<script>'}),/<script>/);
});
test('navigation sheet retains local address and three providers without new actions',async()=>{
 const {locationSheet}=await import('./store-info.mjs');
 const html=locationSheet({name:'회원점명',localAddress:'지번 주소',detailAddress:'2층'});
 for(const t of ['회원점명','지번 주소 2층','복사','카카오','네이버','티맵'])assert.ok(html.includes(t));
 assert.equal((html.match(/class="og-navigation-provider"/g)||[]).length,3);
 assert.doesNotMatch(html,/닫기|확인|지도 보기/);
});
test('boards provide two details states and one inert navigation overlay',async()=>{
 const {storeInfoBoard}=await import('./store-info.mjs');
 assert.equal((storeInfoBoard('info').match(/class="screen-artboard"/g)||[]).length,2);
 const h=storeInfoBoard('location');assert.equal((h.match(/class="screen-artboard"/g)||[]).length,1);
 assert.match(h,/og-location-overlay/);assert.match(h,/inert/);
});
