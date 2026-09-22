import test from 'node:test';import assert from 'node:assert/strict';
test('PIN pad keeps twelve fixed keys, clear and backspace, and only entered symbols',async()=>{
 const {pinPad}=await import('../../components/pin-pad/render.mjs');const h=pinPad({entered:3,lastDigit:'3'});assert.equal((h.match(/data-pin-key=/g)||[]).length,12);assert.equal((h.match(/og-pin-dot/g)||[]).length,2);assert.ok(h.includes('전체 지우기'));assert.ok(h.includes('한 자리 지우기'));assert.ok(!pinPad().includes('og-pin-dot'));
});
test('password stages preserve legacy text and do not add submit buttons',async()=>{
 const {password}=await import('./password.mjs');const current=password({stage:'auth'}),create=password(),confirm=password({stage:'confirm'});
 assert.ok(current.includes('암호를 입력해주세요.'));assert.ok(!current.includes('og-pin-steps'));assert.ok(create.includes('새로운 비밀번호를 6글자로 입력하세요.'));assert.ok(confirm.includes('비밀번호 다시 만들기'));
 assert.ok(!create.includes('>다음<'));assert.ok(!create.includes('>저장<'));assert.ok(create.includes('inert'));
 assert.ok(password({stage:'confirm',error:true}).includes('비밀번호가 맞지 않습니다.'));assert.ok(password({stage:'auth',error:true}).includes('비밀번호가 일치하지 않습니다. 다시 입력해주세요.'));
});
