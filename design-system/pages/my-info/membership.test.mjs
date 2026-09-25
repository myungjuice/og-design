import test from 'node:test';import assert from 'node:assert/strict';
test('membership preserves referral presence branches and registered input lock',async()=>{
 const {membership}=await import('./membership.mjs');
 const h=membership();for(const s of ['내 공유 코드','친구에게 공유','내가 초대한 공유인 수','나를 초대한 공유인 등록','저장하기'])assert.ok(h.includes(s),s);
 const no=membership({code:''});assert.ok(no.includes('1번 이상 적립을 하면 내 공유 코드가 생깁니다.'));assert.ok(!no.includes('공유하기'));assert.ok(!no.includes('og-membership-qr'));
 const registered=membership({referral:'AB1234'});assert.ok(registered.includes('나를 초대한 공유인의 공유코드'));assert.ok(registered.includes('disabled'));assert.ok(registered.includes('AB1234'));
});
test('share sheet keeps existing channel labels and no functional event handlers',async()=>{
 const {membership}=await import('./membership.mjs');const h=membership({shareOpen:true});
 for(const s of ['친구에게 오지고랜드 공유하기','카카오톡 공유','링크 공유','inert'])assert.ok(h.includes(s));assert.ok(!h.includes('onclick='));
});

test('planning certificate maps member identity and keeps export distinct from referral save',async()=>{
 const {membership}=await import('./membership.mjs');
 const html=membership({memberNumber:'OG-0042',nickname:'<닉네임>',joined:'2026-05-28'});
 for(const label of ['멤버십 인증서','회원번호','OG-0042','&lt;닉네임&gt;','2026-05-28','이미지 저장'])assert.ok(html.includes(label),label);
 assert.ok(!membership({code:''}).includes('이미지 저장'));
 assert.ok(!html.includes('0.2%'));assert.ok(!html.includes('Lv.3'));
});
