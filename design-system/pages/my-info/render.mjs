import {avatar,surface,menuTile,sectionHeading,mileage,textButton,thumbnail} from '../../components/index.mjs';
import {escapeHTML as e,icon} from '../../components/core.mjs';
import {appBar,bottomNavigation} from '../../components/app-shell/render.mjs';
const exampleVisits=[{brandName:'회원점명',visitDate:'09/18'}];
// Caller supplies recent-first visits, matching the reversed VisitStoreBox order.
export function recentVisits({visits=exampleVisits,loggedIn=true}={}){
 const heading=sectionHeading({title:'최근 방문',action:loggedIn?'내 리뷰':''});
 const body=!loggedIn||!visits.length
  ?'<div class="og-my-visit-empty">'+icon('storefront')+'<p>'+(!loggedIn?'로그인 후 내 방문 내역을 확인해보세요':'아직 방문한 상점이 없으시네요')+'</p></div>'
  :'<div class="og-my-visits">'+visits.map(visit=>{
   const src=visit.brandLogo||visit.brandThumbnail||'';
   return '<div class="og-my-visit"><div class="og-my-store-link">'+thumbnail({src,alt:visit.brandName,state:src?'ready':'empty'})+'<div class="og-my-visit-copy"><strong>'+e(visit.brandName)+'</strong><span>'+e(visit.visitDate)+'</span></div></div>'+textButton({label:'후기 작성'})+'</div>';
  }).join('')+'</div>';
 return surface({className:'og-my-recent',contentHTML:heading+body});
}
export function recentVisitExamples(){
 return '<section class="screen-mileage-help" inert aria-label="최근 방문 상태 예시"><h3>최근 방문 · 상태별 모습</h3>'+[
  ['방문 내역이 없을 때',{visits:[]}],
  ['로그인하지 않았을 때',{loggedIn:false}],
  ['여러 매장에 방문했을 때',{visits:[...exampleVisits,{brandName:'다른 회원점',visitDate:'09/17'}]}]
 ].map(([label,props])=>'<div class="og-my-recent-example"><h3 class="history-state-label">'+label+'</h3><div class="screen-artboard">'+recentVisits(props)+'</div></div>').join('')+'</section>';
}
export function myInfo({name='맑은 땅콩',available=15000,total=16000,max=20000,visits=exampleVisits}={}) {
 const profile=surface({className:'og-my-profile',contentHTML:avatar({size:'large'})+'<div class="og-my-profile-copy"><strong>'+e(name)+' 님</strong><span>프로필 캐릭터 선택</span></div>'+icon('chevron_right')});
 const balance=surface({className:'og-my-balance',contentHTML:sectionHeading({title:'마일리지',infoButton:true,action:'내역 보기'})+mileage({available,total,max,density:'compact'})});
 const visit=recentVisits({visits});
 const menus=[['이용 내역','receipt_long'],['공지·알림','campaign'],['멤버십','qr_code_2'],['문의하기','support_agent'],['설정','settings'],['내 정보','manage_accounts']];
 return '<section class="og-my-info" aria-label="내 정보 화면" inert><div class="og-my-header">'+appBar({title:'내 정보',notification:true})+'<div class="og-my-profile-wrap">'+profile+'</div></div><div class="og-my-body">'+balance+visit+'<div class="og-my-menu">'+menus.map(([label,name])=>menuTile({label,iconHTML:icon(name)})).join('')+'</div></div>'+bottomNavigation({active:'내 정보'})+'</section>';
}
