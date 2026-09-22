import {bottomSheet,surface,sectionHeading,listRow,toggle,textButton,dialog} from '../../components/index.mjs';
import {myInfo} from './render.mjs';
const group=(title,content)=>surface({className:'og-settings-group',contentHTML:sectionHeading({title})+content});
export function settings({loggedIn=true,hasPassword=true,push=false,event=false,location=false,useAuth=true,useBioAuth=false,kakaoOpen=false}={}){
 const notifications=group('알림과 약관',toggle({label:'적립/사용 내역 알림',checked:loggedIn&&push})+toggle({label:'이벤트/홍보 알림',checked:loggedIn&&event})+listRow({title:'카카오채널 알림'})+'<div class="og-settings-location">'+toggle({label:'위치정보 약관 동의',checked:loggedIn&&location})+textButton({label:'약관보기'})+'</div>');
 const security=group('보안 설정',toggle({label:'패스워드 사용',checked:useAuth})+(hasPassword?listRow({title:'패스워드 변경'})+toggle({label:'지문/얼굴인식 사용',checked:useBioAuth}):'')+listRow({title:loggedIn?'로그아웃':'로그인 또는 가입하기',className:loggedIn?'':'og-settings-login'}));
 const members=group('회원',listRow({title:'회원 정보'}));
 const overlay=kakaoOpen?'<div class="og-settings-overlay">'+dialog({title:'카카오 채널 알림',body:'카카오 채널 알림에 동의 하면, OG PAY 카카오 채널에 친구 등록이 됩니다.',actions:[{label:'취소',variant:'secondary'},{label:'확인'}]})+'</div>':'';
 return '<section class="og-history-screen og-settings" inert aria-label="설정"><div class="og-history-backdrop" aria-hidden="true">'+myInfo()+'</div><div class="og-history-scrim"></div>'+bottomSheet({title:'설정',bodyHTML:'<div class="og-settings-groups">'+notifications+security+members+'</div>'})+overlay+'</section>';
}
export function settingsBoard(){
 const states=[['패스워드가 등록되어 있을 때',{}],['패스워드가 없을 때',{hasPassword:false,useAuth:false,push:true}],['로그인하지 않았을 때',{loggedIn:false,hasPassword:false,useAuth:false}],['카카오채널 알림 · 확인창',{kakaoOpen:true}]];
 return states.map(([label,props],i)=>'<section class="'+(i?'history-empty-example':'')+'"><h3 class="history-state-label">'+label+'</h3><div class="screen-page-content"><div class="screen-artboard">'+settings(props)+'</div>'+(i===0?'<div class="screen-design-notes"><h3>설정별로 구분</h3><p>알림과 약관·보안 설정·회원 정보를 각각 화이트 카드에 담았습니다. 스위치와 이동 화살표는 오른쪽에 정렬했습니다.</p><h3>약관보기</h3><p>위치정보 항목 아래에 링크를 두어 스위치와 구분했습니다.</p></div>':'')+'</div></section>').join('');
}
