import test from 'node:test';
import assert from 'node:assert/strict';

// These fixtures are hand-checked against the original screen board, not rebuilt
// with the source renderer. Dropping a state or changing its options breaks them.
const implementation = await import('./account-settings.mjs').catch(() => null);
const render = () => {
 assert.ok(implementation?.renderAccountSettingsReview, 'The account review renderer must exist');
 return implementation.renderAccountSettingsReview();
};
const states = (html, id) => {
 const section = html.split('<section id="' + id + '"')[1]?.split('<section id="')[0] || '';
 return [...section.matchAll(/<template>([\s\S]*?)<\/template>/g)].map(match => match[1]);
};
const field = (html, value) => [...html.matchAll(/<input\b[^>]*>/g)].map(match => match[0]).find(input => input.includes('value="' + value + '"'));

test('all four account bodies retain every source board specimen', () => {
 const html = render();
 for (const [id, count] of [['membership', 4], ['settings', 7], ['password', 5], ['account', 8]]) {
  assert.match(html, new RegExp('<section id="' + id + '"[^>]*data-review-screen'));
  assert.equal(states(html, id).length, count, id + ' source state count');
 }
 assert.equal(typeof implementation.setupAccountSettingsReview, 'function');
 const keys = [...html.matchAll(/data-source-state="([^"]+)"/g)].map(match => match[1]);
 assert.deepEqual(keys, ['basic','registered','no-code','share','basic','permissions','lower','no-password','logged-out','kakao','night','auth','create','confirm','confirm-error','auth-error','hidden','visible','profile','no-inviter','withdrawal','confirmed','assets','nickname']);
});

test('membership keeps certificate values, disabled referral and absent-code branch', () => {
 const [basic, registered, noCode, share] = states(render(), 'membership');
 for (const text of ['OG1234', 'OG-00012345', '맑은 땅콩', '2026-05-28', '3명', '이미지 저장', '친구에게 공유', '공유 QR코드 디자인 예시']) assert.ok(basic.includes(text), text);
 assert.match(field(registered, 'AB5678'), /\bdisabled\b/);
 assert.ok(registered.includes('나를 초대한 공유인의 공유코드'));
 assert.ok(!registered.includes('v2-member-certificate'));
 assert.ok(noCode.includes('1번 이상 적립을 하면 내 공유 코드가 생깁니다.'));
 assert.ok(!noCode.includes('v2-member-actions'));
 assert.ok(!noCode.includes('공유 QR코드 디자인 예시'));
 for (const text of ['친구에게 오지고랜드 공유하기', '카카오톡 공유', '링크 공유']) assert.ok(share.includes(text));
});

test('settings preserves security, login and channel confirmation conditions', () => {
 const [basic, permissions, lower, noPassword, loggedOut, kakao] = states(render(), 'settings');
 for (const text of ['적립·사용 알림', '출석 알림', '이벤트 알림', '커뮤니티 알림', '야간 알림', '21시 - 08시에도 알림 받기']) assert.ok(basic.includes(text), text);
 for (const text of ['패스워드 변경', '지문/얼굴인식 사용', '허용됨']) assert.ok(permissions.includes(text));
 for (const text of ['약관보기', '앱 버전', '캐시 삭제', '로그아웃', '회원 탈퇴', '—']) assert.ok(lower.includes(text));
 assert.ok(!noPassword.includes('패스워드 변경'));
 assert.ok(!noPassword.includes('지문/얼굴인식 사용'));
 assert.ok(noPassword.match(/<input\b[^>]*checked/));
 assert.ok(loggedOut.includes('로그인 또는 가입하기'));
 assert.ok(!loggedOut.includes('로그아웃'));
 assert.ok(!loggedOut.includes('회원 탈퇴'));
 assert.ok(!loggedOut.match(/<input\b[^>]*checked/));
 assert.ok(kakao.includes('카카오 채널 알림에 동의 하면, 카카오 채널에 친구 등록이 됩니다.'));
});

test('password uses six fixed Figma slots and preserves separate confirmation/auth errors', () => {
 const [auth, create, confirm, confirmError, authError] = states(render(), 'password');
 assert.ok(auth.includes('현재 비밀번호를 입력해주세요'));
 assert.ok(auth.includes('aria-label="0자리 입력됨"'));
 assert.ok(!auth.includes('og-pin-steps'));
 assert.ok(create.includes('새로운 비밀번호를 입력해주세요'));
 assert.ok(create.includes('aria-label="3자리 입력됨"'));
 assert.equal([...create.matchAll(/class="[^"]*\bog-pin-dot\b[^"]*"/g)].length, 6);
 assert.equal([...create.matchAll(/class="og-pin-dot is-filled[^"]*"/g)].length, 3);
 assert.ok(create.includes('aria-label="1 / 2 단계"'));
 assert.ok(confirm.includes('비밀번호 다시 만들기'));
 assert.ok(confirm.includes('aria-label="2 / 2 단계"'));
 assert.ok(confirmError.includes('aria-label="6자리 입력됨"'));
 assert.equal([...confirmError.matchAll(/class="og-pin-dot is-filled[^"]*"/g)].length, 6);
 assert.ok(confirmError.includes('비밀번호가 맞지 않습니다.'));
 assert.ok(authError.includes('aria-label="0자리 입력됨"'));
 assert.equal([...authError.matchAll(/class="og-pin-dot [^"]*"/g)].length, 6);
 assert.ok(!authError.includes('is-filled'));
 assert.ok(authError.includes('비밀번호가 일치하지 않습니다. 다시 입력해주세요.'));
 for (const screen of [auth, create, confirm, confirmError, authError]) {
  assert.equal([...screen.matchAll(/data-pin-key=/g)].length, 11);
  assert.ok(!screen.includes('전체 지우기'));
  assert.ok(screen.includes('v2-pin-empty'));
  assert.ok(screen.includes('/v2/my-info/assets/password-backspace.svg'));
  assert.ok(screen.includes('한 자리 지우기'));
 }
});
test('V2 password layout does not change the legacy last-digit and clear-key specimens', async()=>{
 const {password}=await import('../../design-system/pages/my-info/password.mjs');
 const legacy=password({entered:3,lastDigit:'3'});
 assert.match(legacy,/<span aria-hidden="true">3<\/span>/);
 assert.equal([...legacy.matchAll(/data-pin-key=/g)].length,12);
});

test('account keeps masking, readonly profile and original withdrawal conditions', () => {
 const [hidden, visible, profile, noInviter, withdrawal, confirmed, assets] = states(render(), 'account');
 for (const text of ['홍*동', '010-****-5678', '2026-05-28', '16,000 M', '윤*환', '2026-05-28 초대']) assert.ok(hidden.includes(text), text);
 assert.ok(visible.includes('홍길동'));
 assert.ok(visible.includes('010-1234-5678'));
 assert.match(field(hidden, '맑은 땅콩'), /\breadonly\b/);
 assert.match(field(hidden, ''), /placeholder="미입력"/);
 assert.match(field(profile, '1995-04-12'), /\breadonly\b/);
 assert.ok(profile.includes('>여<'));
 assert.ok(noInviter.includes('등록된 공유인이 없습니다.'));
 assert.ok(withdrawal.includes('data-authenticated="false" data-confirmed="false"'));
 assert.ok(withdrawal.includes('인증하기'));
 assert.ok(withdrawal.includes('확인을 위해 &quot;회원탈퇴&quot;라고 입력해주세요'));
 assert.ok(confirmed.includes('data-authenticated="true" data-confirmed="true"'));
 assert.match(field(confirmed, '회원탈퇴'), /\breadonly\b/);
 assert.ok(confirmed.includes('is-confirmed'));
 assert.ok(assets.includes('마일리지 등 남은 자산이 있습니다. 회원 탈퇴시 모든 자산은 소멸됩니다.'));
 assert.ok(assets.includes('회원 탈퇴를 진행하시겠습니까?'));
});

test('static service controls stay inert while screen bodies can be read and scrolled', () => {
 const html = render();
 for (const id of ['membership', 'settings', 'password', 'account']) for (const screen of states(html, id)) {
  for (const tag of screen.matchAll(/<(?:button|input|textarea|select|a)\b[^>]*>/g)) assert.match(tag[0], /\binert\b/, id + ': ' + tag[0]);
  assert.ok(!screen.match(/<section\b[^>]*\binert\b/), id + ' root must remain scrollable');
  assert.ok(screen.includes('tabindex="0"'), id + ' body keyboard scrolling');
 }
 assert.ok(!html.includes('<form'));
 assert.ok(!html.match(/\bon(?:click|submit|change|input)=/));
 assert.ok(!html.includes('<script'));
});
