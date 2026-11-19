import {surface} from '../../design-system/components/surfaces/render.mjs';
const cautionList='<section class="og-full-menu-caution"><h5>안내 제목</h5><ul><li>안내 본문 1</li><li>안내 본문 2</li></ul></section>';
import {renderHomeStoreReservationSection} from '../home/store-reservation.mjs';

const styles=['home/full-menu','home/store-reservation','components/surfaces','components/section-heading','components/notice'];
const links=styles.map(path=>`<link rel="stylesheet" href="/v2/${path}.css">`).join('');
function specimen(label,html){
 return `<figure class="v2-component-sample"><figcaption><strong>${label}</strong></figcaption><div class="v2-notice-specimen"><template>${links}<div class="v2-full-menu">${html}</div></template></div></figure>`;
}
export function storeNoticeComparison(renderNotice){
 const menuInfo=renderNotice({tone:'info',title:'안내 제목',body:'안내 본문 1 · 안내 본문 2'});
 const reservationWarning=renderNotice({tone:'warning',title:'주의 제목',body:'주의 본문'});
 return '<div data-notice-comparison><h3>메뉴 유의사항</h3><div class="v2-notice-grid">'+
  specimen('현행 · 유의사항 목록',cautionList)+specimen('비교안 · 정보 안내',menuInfo)+'</div>'+
  '<h3>예약 접수 중지</h3><div class="v2-notice-grid">'+
  specimen('현행 · 예약 상태 카드',renderHomeStoreReservationSection({open:false,closedNoticeHTML:surface({className:'og-store-service-card',contentHTML:'<p>주의 본문</p>'})}))+
  specimen('비교안 · 주의 안내',renderHomeStoreReservationSection({open:false,closedNoticeHTML:reservationWarning}))+'</div></div>';
}
export function mountStoreNoticeComparison(root){
 for(const host of root.querySelectorAll('.v2-notice-specimen')){
  if(host.shadowRoot)continue;
  host.attachShadow({mode:'open'}).append(host.querySelector('template').content.cloneNode(true));
 }
}
