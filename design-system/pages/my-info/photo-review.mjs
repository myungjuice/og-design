import {surface,button,thumbnail,feedback,dialog} from '../../components/index.mjs';
import {appBar} from '../../components/app-shell/render.mjs';
import {escapeHTML as e,icon} from '../../components/core.mjs';
import {reviewMenu} from './use-history.mjs?v=20260918-review-history';
const samples=imageSrc=>[{date:'어제. 9.18(금)',amount:24000,hasReview:false},{date:'9.12(토)',amount:18000,hasReview:true,text:'편하게 이용했어요.',photos:[imageSrc,imageSrc]}];
export function photoReview({storeName='회원점명',logo='',visitCount=2,lastVisit='1일 전',items,imageSrc='',menuIndex=-1,deleteOpen=false}={}){
 const entries=items??samples(imageSrc);
 const profile='<div class="og-photo-profile"><div class="og-photo-store">'+(logo?thumbnail({src:logo,alt:storeName}):'<span class="og-photo-store-icon" aria-hidden="true">'+icon('storefront')+'</span>')+'<h3>'+e(storeName)+'</h3></div><div class="og-photo-counts"><strong>내 리뷰: '+entries.filter(item=>item.hasReview).length+'회</strong><p>'+e(entries.length?visitCount+'번 방문. 마지막 방문 '+lastVisit:'방문 전')+'</p></div></div>';
 const rows=entries.map((item,index)=>{
  const action=button({variant:'text',className:'og-photo-action',iconHTML:icon(item.hasReview?'check':'photo_camera')+'<span>'+ (item.hasReview?'리뷰 완료':'포토 리뷰 작성')+'</span>'+(item.hasReview?icon('more_vert'):'')});
  const preview=item.hasReview?'<div class="og-photo-preview"><p>'+e(item.text??'')+'</p>'+((item.photos??[]).length?'<div class="og-photo-images" aria-label="리뷰 사진">'+item.photos.map((src,i)=>thumbnail({src,alt:'리뷰 사진 '+(i+1),state:src?'ready':'empty'})).join('')+'</div>':'')+'</div>':'';
  return surface({className:'og-photo-entry',contentHTML:'<div class="og-photo-entry-heading"><div class="og-photo-transaction"><strong>'+e(item.date)+'</strong><p>'+e(Number(item.amount).toLocaleString('ko-KR'))+'원 사용</p></div>'+action+'</div>'+preview+(menuIndex===index&&item.hasReview?'<div class="og-photo-menu">'+reviewMenu()+'</div>':'')});
 }).join('');
 const body=entries.length?rows:feedback({symbol:'loyalty',title:'이 매장에 아직 적립 내역이 없습니다.',body:'매장을 이용 후 포토 리뷰를 작성할 수 있어요.'});
 const overlay=deleteOpen?'<div class="og-photo-overlay">'+dialog({title:'확인',body:'리뷰를 삭제하시겠습니까?',actions:[{label:'취소',variant:'secondary'},{label:'확인'}]})+'</div>':'';
 return '<section class="og-photo-review" inert aria-label="포토 리뷰">'+appBar({title:'포토 리뷰',back:true})+profile+'<div class="og-photo-body'+(entries.length?'':' is-empty')+'">'+body+'</div>'+overlay+'</section>';
}
export function photoReviewBoard({imageSrc=''}={}){
 const states=[['작성할 내역과 작성한 리뷰',{}],['사진 없는 리뷰',{items:[{date:'9.12(토)',amount:18000,hasReview:true,text:'편하게 이용했어요.',photos:[]}]}],['적립 내역이 없을 때',{items:[]}],['리뷰 관리 · 열린 상태',{menuIndex:1}],['리뷰 삭제 확인',{deleteOpen:true}]];
 return states.map(([label,props],i)=>'<section class="'+(i?'history-empty-example':'')+'"><h3 class="history-state-label">'+label+'</h3><div class="screen-page-content"><div class="screen-artboard">'+photoReview({imageSrc,...props})+'</div>'+(i===0?'<div class="screen-design-notes"><h3>내역별로 구분</h3><p>날짜와 사용 금액은 왼쪽, 리뷰 작성과 관리 버튼은 오른쪽에 맞췄습니다.</p><h3>작성한 리뷰</h3><p>본문과 사진을 같은 카드 안에 담았습니다. 카드의 그림자는 옅게, 본문 영역은 평평하게 표현했습니다.</p></div>':'')+'</div></section>').join('');
}
