import {bottomSheet,surface,sectionHeading,listRow,toggle,textButton,dialog} from '../../components/index.mjs';
import {myInfo} from './render.mjs';
const group=(title,content)=>surface({className:'og-settings-group',contentHTML:sectionHeading({title})+content});
export function settings({loggedIn=true,hasPassword=true,push=false,event=false,location=false,useAuth=true,useBioAuth=false,kakaoOpen=false,attendance=false,community=false,night=false,view='all'}={}){
 const notifications=group('알림',[
 ['적립·사용 알림','적립되거나 사용했을 때',push],
 ['출석 알림','출석 시간을 알려드려요',attendance],
 ['이벤트 알림','새 이벤트와 공모전 소식',event],
 ['커뮤니티 알림','내 글에 댓글이 달렸을 때',community],
 ['야간 알림','21시 - 08시에도 알림 받기',night]
 ].map(([label,description,checked])=>toggle({label,description,checked:loggedIn&&checked})).join(''));
 const permissions=group('권한',listRow({title:'위치',description:'주변 회원점을 찾을 때 사용해요',value:'허용됨'})+listRow({title:'카메라',description:'영수증 촬영에 사용해요',value:'허용됨'})+listRow({title:'알림',value:'설정에서 변경'}));
 const terms=group('연결과 약관',listRow({title:'카카오채널 알림'})+'<div class="og-settings-location">'+toggle({label:'위치정보 약관 동의',checked:loggedIn&&location})+textButton({label:'약관보기'})+'</div>');
 const security=group('보안 설정',toggle({label:'패스워드 사용',checked:useAuth})+(hasPassword?listRow({title:'패스워드 변경'})+toggle({label:'지문/얼굴인식 사용',checked:useBioAuth}):''));
 const members=group('기타',listRow({title:'앱 버전',value:'—',interactive:false})+listRow({title:'캐시 삭제',value:'—'})+listRow({title:'회원 정보'})+listRow({title:loggedIn?'로그아웃':'로그인 또는 가입하기',className:loggedIn?'':'og-settings-login'})+(loggedIn?listRow({title:'회원 탈퇴'}):''));
 const overlay=kakaoOpen?'<div class="og-settings-overlay">'+dialog({title:'카카오 채널 알림',body:'카카오 채널 알림에 동의 하면, 카카오 채널에 친구 등록이 됩니다.',actions:[{label:'취소',variant:'secondary'},{label:'확인'}]})+'</div>':'';
 return '<section class="og-history-screen og-settings" inert aria-label="설정"><div class="og-history-backdrop" aria-hidden="true">'+myInfo()+'</div><div class="og-history-scrim"></div>'+bottomSheet({title:'설정',bodyHTML:'<div class="og-settings-groups">'+(view==='permissions'?permissions+security:view==='lower'?terms+members:notifications+permissions+security+terms+members)+'</div>'})+overlay+'</section>';
}
export function settingsBoard(){
 const states=[['기본 · 알림 설정',{}],['아래 항목 · 권한과 보안',{view:'permissions'}],['아래 항목 · 연결과 약관, 기타',{view:'lower'}],['패스워드가 없을 때',{hasPassword:false,useAuth:false,push:true}],['로그인하지 않았을 때',{loggedIn:false,hasPassword:false,useAuth:false}],['카카오채널 알림 · 확인창',{kakaoOpen:true}]];
 return states.map(([label,props],i)=>'<section class="'+(i?'history-empty-example':'')+'"><h3 class="history-state-label">'+label+'</h3><div class="screen-page-content"><div class="screen-artboard">'+settings(props)+'</div>'+(i===0?'<div class="screen-design-notes"><h3>설정별로 구분</h3><p>기획의 알림 5종·권한·기타 항목을 공통 카드로 구분하고 기존 보안·약관 기능은 유지했습니다. 아래 항목은 별도 예시로 나누어 보여줍니다. 스위치와 이동 화살표는 오른쪽에 정렬했습니다.</p><h3>약관보기</h3><p>OS 권한과 위치정보 약관 동의는 다른 항목입니다. 권한의 허용됨은 예시이며 앱 버전·캐시 용량은 실제 값 연결 전이라 —로 표시합니다.</p></div>':'')+'</div></section>').join('');
}
