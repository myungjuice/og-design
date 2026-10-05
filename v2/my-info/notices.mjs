import {notices} from '../../design-system/pages/my-info/notices.mjs';
import {renderMyInfoTest} from '../../screens/my-info-3d-test/render.mjs';
import {escapeHTML as e,icon,uid} from '../../design-system/components/core.mjs';
import {button} from '../../design-system/components/button/render.mjs';
import {renderSheet} from '../components/sheet.mjs';
import {renderDialog} from '../components/dialog.mjs';
import {renderUnreadDot} from '../components/badges.mjs';
import {renderFeedback} from '../components/feedback.mjs';
import {renderSurface} from '../components/surfaces.mjs';

const shapes={
 delete_outline:'<path d="M4 6h16M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7m4-7v7"/>',
 edit_off:'<path d="m3 3 18 18M5 14l-1 6 6-1m2-9 5-5 3 3-5 5"/>',
 settings:'<path d="m10 3-.5 2.5-2 1.2L5 6l-2 3 2 1.7v2.6L3 15l2 3 2.5-.7 2 1.2L10 21h4l.5-2.5 2-1.2L19 18l2-3-2-1.7v-2.6L21 9l-2-3-2.5.7-2-1.2L14 3Z"/><circle cx="12" cy="12" r="3"/>',
 more_vert:'<circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>',
 storefront:'<path d="M4 10v11h16V10M3 10l2-7h14l2 7M3 10q2 4 4.5 0 2.3 4 4.5 0 2.3 4 4.5 0 2.5 4 4.5 0M9 21v-7h6v7"/>',
 card_giftcard:'<rect x="3" y="8" width="18" height="13" rx="2"/><path d="M3 12h18M12 8v13M12 8H8a3 3 0 1 1 3-3Zm0 0h4a3 3 0 1 0-3-3Z"/>',
 sports_esports:'<path d="M8 7h8a5 5 0 0 1 5 5l1 6c0 3-3 4-5 1l-2-2H9l-2 2c-2 3-5 2-5-1l1-6a5 5 0 0 1 5-5ZM6 11v4m-2-2h4m8-1h.1m2 2h.1"/>',
 campaign:'<path d="M4 9v6h5l11 5V4L9 9ZM9 9v6m-3 0 1 6h4l-2-6"/>',
 notifications:'<path d="M5 17h14l-2-3V9a5 5 0 0 0-10 0v5ZM10 21h4"/>',
 notifications_off:'<path d="m3 3 18 18M7 7a5 5 0 0 0 0 2v5l-2 3h12M11 4a5 5 0 0 1 6 5v4M10 21h4"/>'
};
const art=name=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+shapes[name]+'</svg>';
// Planning p17 examples, not new notification preferences or reward policies.
const planningNotifications=[
 {type:'적립',title:'오형제황제누룽지탕 적립 완료',body:'960 M가 적립되었어요.',date:'2026-09-18 10:00',read:false},
 {type:'이벤트',title:'출석 7일 달성 보상',body:'티켓 3장과 50 M를 받았어요.',date:'2026-09-17 09:00',read:false},
 {type:'게임',title:'룰렛 당첨 · 50 M',body:'당첨 마일리지가 적립되었어요.',date:'2026-09-12 12:00',read:true},
 {type:'공지',title:'9월 더블 적립 이벤트 안내',body:'이벤트 내용을 확인해 주세요.',date:'2026-09-01 09:00',read:true}
];
const emptyFeedback=(id,selected)=>renderFeedback({id,kind:'history',title:selected?'수신된 푸시 알림이 없습니다.':'공지 내역이 없습니다.',body:''}).replace(/<svg[\s\S]*?<\/svg>/,()=>art(selected?'notifications_off':'campaign'));
export function renderNotices({id=uid('v2-notices'),selected=0,overlay='',...options}={}){
 if(!['','all','selected','item'].includes(overlay))throw new RangeError('Unknown notice overlay');
 // The original owns unread/empty/edit conditions, fields, selection and action copy.
 const source=notices({selected,overlay,notifications:planningNotifications,...options});
 let body=source.match(/<div class="og-sheet-body">([\s\S]*?)<\/div><div class="og-sheet-footer">/)?.[1];
 if(body===undefined)throw new Error('Notice source body is missing');
 body=body.replace(/<button\b[^>]*aria-label="알림 관리 끝내기"[^>]*>[\s\S]*?<\/button>/,'<button type="button" class="og-text-button" aria-label="알림 관리 끝내기">완료</button>');
 body=body.replace('og-tabs og-notice-tabs','og-tabs og-notice-tabs v2-tabs')
  .replaceAll('class="og-tab-panel"','class="og-tab-panel v2-tabs-panel"')
  .replaceAll('class="og-badge"','class="og-badge v2-badge" data-variant="soft"')
  .replace(/class="og-surface (og-announcement-list|og-notification-list)"/g,(_,name)=>'class="og-surface v2-surface '+name+'" data-depth="flat"')
  .replaceAll('class="og-icon-button"','class="og-icon-button v2-icon-button" data-face="plain"')
  .replace(/class="og-text-button([^\"]*)"/g,(_,rest)=>'class="og-text-button v2-notice-text'+rest+'"')
  .replace(/<label class="og-choice "([\s\S]*?)<\/label>/g,(_,inner)=>'<label class="og-choice v2-selection v2-selection-checkbox"'+inner.replace(/(<input[^>]+>)/,()=>inner.match(/<input[^>]+>/)[0]+'<span class="v2-selection-mark" aria-hidden="true"></span>')+'</label>')
  .replace(/<div class="og-notice-empty">[\s\S]*?<\/div>/g,()=>emptyFeedback(id+'-empty',selected));
 // The tab already names its unread meaning; do not announce the decorative dot twice.
 body=body.replace(/(<button[^>]*data-unread="true"[^>]*>내 알림)(<\/button>)/,(_,start,end)=>start+renderUnreadDot().replace(/ role="img"[^>]*>/,' aria-hidden="true">')+end);
 for(const name of Object.keys(shapes))body=body.replaceAll(icon(name),art(name));
 const sheet=renderSheet({id:id+'-sheet',title:'공지·내 알림',bodyHTML:body,size:'long'})
  .replace('class="v2-sheet-static" inert','class="v2-sheet-static"')
  .replace('class="og-sheet-body"','class="og-sheet-body" role="region" aria-label="'+(selected?'내 알림':'공지')+' 내용 · 정적 시안" tabindex="0"');
 const profile=renderMyInfoTest({assetBase:'/screens/my-info-3d-test/media/figma/'}).match(/<header class="profile-header">[\s\S]*?<\/header>/)[0];
 let popup='';
 if(overlay==='item')popup='<div class="v2-notice-overlay v2-notice-item-overlay">'+renderSurface({depth:'raised',contentHTML:button({label:'이 알림 삭제',variant:'danger',className:'v2-button'})+button({label:'닫기',variant:'secondary',className:'v2-button'})}).replace('class="og-surface v2-surface"','class="og-surface v2-surface v2-notice-item-menu"')+'</div>';
 else if(overlay){
  const copy=source.match(/<p class="og-dialog-body">([^<]+)<\/p>/)?.[1];if(!copy)throw new Error('Notice confirmation body is missing');
  popup='<div class="v2-notice-overlay">'+renderDialog({id:id+'-confirm',title:overlay==='all'?'전체 삭제':'선택 삭제',body:copy,actions:[{label:'취소',variant:'secondary'},{label:'삭제',variant:'danger'}]})+'</div>';
 }
 return ('<section class="v2-use-history-frame v2-notices-frame" aria-label="공지·내 알림 '+(selected?'내 알림':'공지')+'"><div class="v2-notices-base"'+(overlay?' inert aria-hidden="true"':'')+'><div class="v2-use-backdrop" inert aria-hidden="true">'+profile+'</div><div class="v2-use-scrim" aria-hidden="true"></div>'+sheet+'</div>'+popup+'</section>')
  .replace(/<button(?! inert)\b/g,'<button inert').replace(/<input(?! inert)\b/g,'<input inert');
}
const cssFiles=['/screens/my-info-3d-test/styles.css',...['button','icon-button','sheet','tabs','selection','badges','surfaces','feedback','dialog'].map(name=>'/v2/components/'+name+'.css'),'/v2/my-info/use-history.css','/v2/my-info/notices.css'];
const sample=(key,label,options)=>'<figure class="v2-reservation-review-sample" data-notice-state="'+key+'"><figcaption>'+e(label)+'</figcaption><div class="v2-notices-history-host"><template>'+cssFiles.map(href=>'<link rel="stylesheet" href="'+href+'">').join('')+renderNotices({id:'v2-notices-'+key,...options})+'</template></div></figure>';
const grid=html=>'<div class="v2-reservation-review-grid v2-notices-review-grid">'+html+'</div>';
export function renderNoticesReview(){
 const states=[['all-read','모두 읽은 뒤',{selected:1,allRead:true}],['empty-notices','공지 없음',{empty:true}],['empty-notifications','알림 없음',{selected:1,empty:true}],['editing','알림 관리 · 선택',{selected:1,editing:true}],['editing-none','알림 관리 · 미선택',{selected:1,editing:true,selectedIndices:[]}],['item','개별 알림 메뉴',{selected:1,overlay:'item'}],['selected-delete','선택 삭제 확인',{selected:1,editing:true,overlay:'selected'}],['all-delete','전체 삭제 확인',{selected:1,editing:true,overlay:'all'}]];
 return '<section id="notices" data-review-screen aria-labelledby="notices-title" hidden><h2 id="notices-title">공지·내 알림</h2><p class="v2-intro">서비스 공지와 수신한 알림을 구분해 확인하고 읽음 상태와 관리 메뉴를 살펴보는 화면입니다.</p>'+grid(sample('announcements','공지 탭',{selected:0})+sample('notifications','내 알림 · 읽기 전과 읽은 뒤',{selected:1}))+'<details class="v2-reservation-extra v2-notices-extra"><summary>읽음·빈 목록 비교</summary>'+grid(states.slice(0,3).map(([key,label,options])=>sample(key,label,options)).join(''))+'</details><details class="v2-reservation-extra v2-notices-extra"><summary>알림 관리·삭제 비교</summary>'+grid(states.slice(3).map(([key,label,options])=>sample(key,label,options)).join(''))+'</details><p class="v2-intro">제목·날짜·알림 내용은 배치 확인용 예시입니다. 탭 전환·모두 읽음·선택·삭제·설정·닫기는 실행되지 않습니다.</p></section>';
}
export function setupNoticesReview(root){
 const section=root.querySelector('#notices');if(!section||section.dataset.noticesReady)return;
 const mount=scope=>{for(const host of scope.querySelectorAll('.v2-notices-history-host')){if(host.shadowRoot)continue;const template=host.querySelector('template');host.attachShadow({mode:'open'}).append(template.content.cloneNode(true));template.remove();}};
 section.dataset.noticesReady='true';mount(section.querySelector('.v2-notices-review-grid'));
 for(const details of section.querySelectorAll('.v2-notices-extra')){if(details.open)mount(details);details.addEventListener('toggle',()=>{if(details.open)mount(details);});}
}
