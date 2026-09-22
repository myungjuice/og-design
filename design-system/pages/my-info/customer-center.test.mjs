import test from 'node:test';import assert from 'node:assert/strict';
test('customer center keeps legacy fallback fields and two contact actions',async()=>{
 const {customerCenter}=await import('./customer-center.mjs');const h=customerCenter();
 for(const value of ['고객 센터','고객 문의','Phone. 02-6949-2587','E-mail. jbgroup0501@gmail.com','전화하기','복사하기','위치','(주)제비그룹','대표이사 김도현 | 사업자등록번호 123-86-50879','왕십리로 58'])assert.ok(h.includes(value),value);
 assert.ok(h.indexOf('고객 문의')<h.indexOf('위치'));assert.ok(h.indexOf('위치')<h.indexOf('(주)제비그룹'));assert.ok(h.includes('inert'));
 assert.ok(!h.includes('운영시간'));assert.ok(!h.includes('길찾기'));
});
test('customer center renders caller data safely and can show an authored map image',async()=>{
 const {customerCenter}=await import('./customer-center.mjs');const h=customerCenter({phone:'<123>',email:'team@example.com',mapSrc:'/test-map.png'});
 assert.ok(h.includes('Phone. &lt;123&gt;'));assert.ok(!h.includes('<123>'));assert.ok(h.includes('E-mail. team@example.com'));assert.ok(h.includes('src="/test-map.png"'));
});
