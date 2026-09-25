import test from 'node:test';import assert from 'node:assert/strict';
test('settings preserves password-dependent rows and login branch without hiding membership',async()=>{
 const {settings}=await import('./settings.mjs');const h=settings();
 for(const label of ['알림','적립·사용 알림','출석 알림','이벤트 알림','커뮤니티 알림','야간 알림','권한','카메라','앱 버전','캐시 삭제','회원 탈퇴','카카오채널 알림','위치정보 약관 동의','약관보기','보안 설정','패스워드 사용','패스워드 변경','지문/얼굴인식 사용','로그아웃','회원 정보'])assert.ok(h.includes(label),label);
 const noPin=settings({hasPassword:false});assert.ok(!noPin.includes('패스워드 변경'));assert.ok(!noPin.includes('지문/얼굴인식 사용'));
 const guest=settings({loggedIn:false,hasPassword:false});assert.ok(guest.includes('로그인 또는 가입하기'));assert.ok(!guest.includes('로그아웃'));assert.ok(guest.includes('회원 정보'));
 assert.ok(h.includes('21시 - 08시'));assert.ok(!h.includes('전체 알림'));assert.ok(h.includes('inert'));
});
test('Kakao remains a link and its confirmation removes retired PAY branding',async()=>{
 const {settings}=await import('./settings.mjs');const h=settings({kakaoOpen:true});assert.ok(h.includes('카카오 채널에 친구 등록이 됩니다.'));assert.ok(h.includes('카카오 채널 알림'));assert.equal((settings().match(/role="switch"/g)||[]).length,8);
});
