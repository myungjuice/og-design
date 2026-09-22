import {bottomSheet,tabs,tabPanel,surface,iconButton,textButton,checkbox,dialog} from '../../components/index.mjs';
import {escapeHTML as e,uid,icon} from '../../components/core.mjs';
import {myInfo} from './render.mjs';
// Placeholder content for design review; labels and action rules follow the existing app.
const announcementExamples=[{type:'공지',date:'26.09.18 10:00',title:'공지 제목'},{type:'안내',date:'26.09.16 09:00',title:'공지 제목이 길어질 때의 줄바꿈 예시'}];
const notificationExamples=[{title:'알림 제목',body:'수신된 알림 내용이 표시됩니다.',date:'2026-09-18 10:00:00',read:false},{title:'알림 제목',body:'알림 내용이 길어질 때는 다음 줄로 이어서 표시됩니다.',date:'2026-09-17 09:00:00',read:true}];
export function notices({selected=0,empty=false,editing=false,selectedIndices=[0],overlay='',announcements=announcementExamples,notifications=notificationExamples}={}){
 if(![0,1].includes(selected))throw new RangeError('Unknown notice tab');
 const id=uid('notices');const hasNotifications=!empty&&notifications.length>0;
 const toolbar=selected===1?'<div class="og-notification-toolbar">'+(hasNotifications?iconButton({label:editing?'알림 관리 끝내기':'알림 관리',name:editing?'edit_off':'delete_outline'}):'')+iconButton({label:'알림 설정',name:'settings'})+'</div>':'';
 const edit=selected===1&&editing&&hasNotifications?'<div class="og-notification-edit">'+textButton({label:'전체 삭제',className:'og-notice-danger'})+textButton({label:'선택 삭제'})+textButton({label:'닫기'})+'</div>':'';
 let content='';
 if(selected===0){
  content=empty||!announcements.length?'<div class="og-notice-empty"><img src="https://og-familystore-image.s3.ap-northeast-2.amazonaws.com/ogapp/empty_event.png" alt="" aria-label="기존 공지 빈 목록 이미지"></div>':surface({className:'og-announcement-list',contentHTML:announcements.map(a=>'<div class="og-announcement-row"><div class="og-announcement-meta"><span>['+e(a.type)+']</span><time>'+e(a.date)+'</time></div><h3>'+e(a.title)+'</h3></div>').join('')});
 }else{
  content=!hasNotifications?'<div class="og-notice-empty">'+icon('notifications_off')+'<p>수신된 푸시 알림이 없습니다.</p></div>':surface({className:'og-notification-list',contentHTML:notifications.map((n,i)=>'<div class="og-notification-row" data-read="'+!!n.read+'">'+(editing?checkbox({label:'',checked:selectedIndices.includes(i),attributes:{'aria-label':n.title+' 선택'}}):'')+'<div class="og-notification-copy"><div class="og-notification-meta"><h3>'+e(n.title)+'</h3><time>'+e(n.date)+'</time></div><p>'+e(n.body)+'</p></div>'+(!editing?iconButton({label:'알림 더보기',name:'more_vert'}):'')+'</div>').join('')});
 }
 const body=tabs({id,label:'공지·내 알림',items:['공지','내 알림'],selected,className:'og-notice-tabs'})+toolbar+edit+[0,1].map(index=>tabPanel({id,index,selected,contentHTML:index===selected?content:''})).join('');
 let popup='';
 if(overlay==='all'||overlay==='selected')popup='<div class="og-notice-overlay">'+dialog({body:overlay==='all'?'모든 알림 내역을 완전히 삭제할까요?':'선택한 알림 내역을 삭제할까요?',actions:[{label:'취소',variant:'secondary'},{label:'삭제',variant:'danger'}]})+'</div>';
 if(overlay==='item')popup='<div class="og-notice-overlay og-notice-item-overlay">'+surface({className:'og-notice-item-menu',contentHTML:textButton({label:'이 알림 삭제',className:'og-notice-danger'})+textButton({label:'닫기'})})+'</div>';
 return '<section class="og-history-screen og-notices" inert aria-label="공지·내 알림 '+(selected?'내 알림':'공지')+'"><div class="og-history-backdrop" aria-hidden="true">'+myInfo()+'</div><div class="og-history-scrim"></div>'+bottomSheet({title:'공지·내 알림',bodyHTML:body})+popup+'</section>';
}
export function noticesBoard(){
 const states=[['공지 탭',{}],['내 알림 · 읽기 전과 읽은 뒤',{selected:1}],['공지가 없을 때',{empty:true}],['알림이 없을 때',{selected:1,empty:true}],['알림 관리 · 선택한 상태',{selected:1,editing:true}],['알림 관리 · 선택하지 않은 상태',{selected:1,editing:true,selectedIndices:[]}],['개별 알림 메뉴',{selected:1,overlay:'item'}],['선택 삭제 확인',{selected:1,editing:true,overlay:'selected'}],['전체 삭제 확인',{selected:1,editing:true,overlay:'all'}]];
 return states.map(([title,props],i)=>'<section class="'+(i?'history-empty-example':'')+'"><h3 class="history-state-label">'+title+'</h3><div class="screen-page-content"><div class="screen-artboard">'+notices(props)+'</div>'+(i===0?'<div class="screen-design-notes"><h3>두 탭으로 구분</h3><p>공지와 내 알림을 한 시트에서 확인합니다.</p><h3>차분한 목록</h3><p>화이트 카드 안에 항목을 모으고 얇은 선으로 구분했습니다. 유형과 날짜는 작게, 제목은 또렷하게 표시했습니다.</p></div>':i===1?'<div class="screen-design-notes"><h3>읽음 표시</h3><p>읽기 전에는 연한 블루 배경을, 읽은 뒤에는 차분한 글자색을 사용했습니다.</p><h3>알림 관리</h3><p>삭제와 설정은 탭 아래 오른쪽에 모았습니다.</p></div>':'')+'</div></section>').join('');
}
