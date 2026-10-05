import {membershipBoard} from '../../design-system/pages/my-info/membership.mjs';
import {settings,settingsBoard} from '../../design-system/pages/my-info/settings.mjs';
import {passwordBoard} from '../../design-system/pages/my-info/password.mjs';
import {account,accountBoard} from '../../design-system/pages/my-info/account.mjs';
import {dialog,iconButton} from '../../design-system/components/index.mjs';
import {renderInput} from '../components/input.mjs';
import {extractSourceScreens, renderSourceGallery, setupSourceGallery} from './source-review.mjs';
import {renderMembershipScreen,setupMembershipCharacters} from './membership-comparison.mjs';

// Original boards own fixtures, copy and security conditions. Membership uses
// the selected certificate layout; other domains retain the shared source adapter.
const domains = [
 {id:'membership', title:'멤버십', intro:'멤버십 인증서와 공유코드, 나를 초대한 공유인 등록 화면입니다.', board:membershipBoard, rootClass:'og-membership', states:[
  ['basic','기본 상태',{}], ['registered','공유인을 등록한 상태 · 아래 등록 영역',{referral:'AB5678',view:'registration'}], ['no-code','내 공유 코드가 없을 때',{code:'',count:0}], ['share','공유하기 · 열린 상태',{shareOpen:true}]
 ]},
 {id:'settings', title:'설정', intro:'알림·권한·보안과 연결·약관, 회원 설정을 확인하는 화면입니다.', board:settingsBoard, rootClass:'og-settings', states:[
  ['basic','기본 · 알림 설정'], ['permissions','아래 항목 · 권한과 보안'], ['lower','아래 항목 · 연결과 약관, 기타'], ['no-password','패스워드가 없을 때'], ['logged-out','로그인하지 않았을 때'], ['kakao','카카오채널 알림 · 확인창']
 ]},
 {id:'password', title:'패스워드', intro:'현재 암호 확인과 새 비밀번호 입력·재입력 상태를 확인하는 화면입니다.', board:passwordBoard, rootClass:'og-password', states:[
  ['auth','현재 암호 확인'], ['create','새 비밀번호 입력'], ['confirm','비밀번호 재입력'], ['confirm-error','재입력한 비밀번호가 다를 때'], ['auth-error','현재 암호가 다를 때']
 ]},
 {id:'account', title:'내 회원 정보', intro:'가입 정보와 프로필·초대 정보, 기존 회원 탈퇴 절차를 확인하는 화면입니다.', board:accountBoard, rootClass:'og-account', states:[
  ['hidden','기본 · 개인정보 숨김'], ['visible','개인정보를 표시했을 때'], ['profile','프로필·초대 정보 · 아래 영역'], ['no-inviter','초대한 공유인이 없을 때'], ['withdrawal','회원 탈퇴 · 기존 인증 절차'], ['confirmed','본인 인증과 탈퇴 확인을 마쳤을 때'], ['assets','남은 자산이 있을 때 · 확인창']
 ]}
];

export function renderAccountSettingsReview() {
 return domains.map(({id, title, intro, board, rootClass, states}) => {
  const screens = extractSourceScreens(board(), rootClass);
  if (screens.length !== states.length) throw new Error(id + ' source specimens changed');
  const specimens=states.map(([key, label, props], index) => ({key, label, html:id==='membership'?renderMembershipScreen(props):id==='account'?accountSpecimen(screens[index]):screens[index]}));
  if(id==='account')specimens.push({key:'nickname',label:'닉네임 수정 · 확인창',html:nicknameSpecimen()});
  if(id==='settings')specimens.push({key:'night',label:'야간 알림 · 동의 확인',html:nightSpecimen()});
  return renderSourceGallery({id, title, intro,extraLabel:id==='membership'?'관련 상태':'다른 상태 비교', states:specimens, cssFiles:id==='membership'?[
   '/v2/my-info/character.css','/v2/my-info/membership-comparison.css'
  ]:[
   '/design-system/pages/my-info/' + id + '.css',
   '/v2/my-info/account-settings.css'
  ]});
 }).join('');
}

// V2-only changes: the original canvas fixtures and profile fields stay untouched.
function accountSpecimen(html){
 return html.replace(/2024-05-20/g,'2026-05-28').replace(/(<input\b[^>]*value="맑은 땅콩"[^>]*>)/,()=>{
  const field=html.match(/<input\b[^>]*value="맑은 땅콩"[^>]*>/)[0];
  return field+iconButton({label:'닉네임 수정',name:'edit',className:'v2-nickname-edit'});
 });
}
function nicknameSpecimen(){
 const field=renderInput({label:'닉네임',value:'맑은 땅콩',hint:'새 닉네임을 입력해 주세요.',attributes:{readonly:true}});
 const editor=dialog({title:'닉네임 수정',bodyHTML:'<div class="og-dialog-body" role="region" aria-label="닉네임 수정 내용" tabindex="0">'+field+'</div>',actions:[{label:'취소',variant:'secondary'},{label:'저장하기'}]});
 return accountSpecimen(account({view:'profile',joined:'2026-05-28'})).replace(/<\/section>$/,'<div class="og-account-overlay v2-nickname-overlay">'+editor+'</div></section>');
}
function nightSpecimen(){
 const confirmation=dialog({title:'야간 알림을 받으시겠어요?',body:'야간 시간대(21:00~08:00)에도 알림을 받습니다.',actions:[{label:'취소',variant:'secondary'},{label:'동의하기'}]});
 return settings({night:false}).replace(/<\/section>$/,'<div class="og-settings-overlay v2-night-overlay">'+confirmation+'</div></section>');
}

export function setupAccountSettingsReview(root) {
 for (const {id} of domains) setupSourceGallery(root, id);
 setupMembershipCharacters(root);
}
