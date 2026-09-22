import {avatar,dialog} from '../../components/index.mjs';
import {appBar} from '../../components/app-shell/render.mjs?v=20260918-review-history';
import {reviewCards,reviewMenu} from './use-history.mjs?v=20260918-review-history';
export function reviewHistory({empty=false,imageSrc='',items}={}){
 return '<section class="og-review-history og-use-history" inert aria-label="리뷰 내역">'+appBar({title:'리뷰 내역',back:true,trailingHTML:avatar({size:'small',label:'내 프로필'})})+'<div class="og-review-history-body">'+(empty?'<p class="og-use-empty">리뷰 내역이 없습니다.</p>':reviewCards({imageSrc,items}))+'</div></section>';
}
export function reviewHistoryBoard({imageSrc=''}={}){
 const screen=props=>'<div class="screen-artboard">'+reviewHistory({imageSrc,...props})+'</div>';
 return '<div class="screen-page-content">'+screen({})+'<div class="screen-design-notes"><h3>리뷰를 한곳에</h3><p>매장 정보와 작성일 아래에 사진과 본문을 배치했습니다. 이용내역의 리뷰 탭과 같은 카드를 사용합니다.</p><h3>내 프로필</h3><p>화면 제목 오른쪽에 프로필을 표시했습니다.</p></div></div><section class="history-empty-example"><h3 class="history-state-label">리뷰가 없을 때</h3>'+screen({empty:true})+'</section><section class="history-empty-example"><h3 class="history-state-label">사진 없는 리뷰</h3>'+screen({items:[{title:'회원점명',meta:'음식점 · 지역명',date:'2026. 9. 18',review:'편하게 이용했어요.',photos:[]}]})+'</section><section class="history-empty-example"><h3 class="history-state-label">리뷰 관리 · 열린 상태</h3><div class="screen-artboard og-review-overlay-screen" inert>'+reviewHistory({imageSrc})+'<div class="og-review-menu-preview">'+reviewMenu()+'</div></div></section><section class="history-empty-example"><h3 class="history-state-label">리뷰 삭제 확인</h3><div class="screen-artboard og-review-overlay-screen" inert>'+reviewHistory({imageSrc})+'<div class="og-review-dialog-preview">'+dialog({title:'확인',body:'리뷰를 삭제하시겠습니까?',actions:[{label:'취소',variant:'secondary'},{label:'확인'}]})+'</div></div></section>';
}
