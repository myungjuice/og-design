import test from 'node:test';import assert from 'node:assert/strict';
test('support preserves six legacy destinations and membership visibility',async()=>{
 const{support}=await import('./support.mjs');const h=support();
 for(const label of ['자주 묻는 질문','1:1 문의하기','의견보내기','고객 센터','약관 및 정책','접근 권한 안내'])assert.ok(h.includes(label));
 assert.equal((h.match(/class="og-menu-tile/g)||[]).length,12); // six tiles in my-info backdrop plus six support tiles
 const guest=support({loggedIn:false});assert.ok(!guest.includes('1:1 문의하기'));assert.ok(!guest.includes('의견보내기'));assert.ok(guest.includes('접근 권한 안내'));
});
test('one-to-one inquiry uses original external-channel confirmation',async()=>{
 const{support}=await import('./support.mjs');const h=support({confirmOpen:true});
 assert.ok(h.includes('1:1 상담 문의'));assert.ok(h.includes('카카로 앱으로 이동하시겠습니까?'));assert.ok(h.includes('취소'));assert.ok(h.includes('확인'));assert.ok(h.includes('inert'));
});
