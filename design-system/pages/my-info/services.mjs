import {bottomSheet,menuTile} from '../../components/index.mjs';
import {appBar} from '../../components/app-shell/render.mjs';
import {icon} from '../../components/core.mjs';
import {myInfo} from './render.mjs';
const destinations=[['내 예약 보기','event_available'],['내 웨이팅 보기','groups'],['내 Q오더 보기','receipt_long'],['내 리뷰 관리','rate_review']];
export function services({loggedIn=true}={}){
 const body=loggedIn?'<div class="og-services-grid">'+destinations.map(([label,name])=>menuTile({label,iconHTML:icon(name)})).join('')+'</div>':'';
 return '<section class="og-history-screen og-services" inert aria-label="서비스"><div class="og-history-backdrop" aria-hidden="true">'+(loggedIn?myInfo():appBar({title:'내 정보',notification:true}))+'</div><div class="og-history-scrim"></div>'+bottomSheet({title:'서비스',bodyHTML:body})+'</section>';
}
export function servicesBoard(){
 return [['기본 상태',{}],['비로그인 · 회원 전용 항목 숨김',{loggedIn:false}]].map(([label,props],i)=>'<section class="'+(i?'history-empty-example':'')+'"><h3 class="history-state-label">'+label+'</h3><div class="screen-page-content"><div class="screen-artboard">'+services(props)+'</div>'+(i===0?'<div class="screen-design-notes"><h3>네 가지 내역</h3><p>같은 크기의 메뉴를 2행 2열로 배치했습니다. 공통 메뉴 타일의 밝은 윗면과 얇은 밑면을 유지했습니다.</p></div>':'')+'</div></section>').join('');
}
