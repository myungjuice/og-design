import {surface,badge,button,thumbnail} from '../../components/index.mjs';
import {appBar} from '../../components/app-shell/render.mjs';
import {escapeHTML as e} from '../../components/core.mjs';
const money=n=>Number(n).toLocaleString('ko-KR');
const states={requested:['주문','warning'],confirmed:['접수','info'],completed:['완료','success'],cancelled:['취소','error'],selfCancelled:['취소','error'],empty:['','neutral']};
export function orderDetail({status='requested',old=false,brandName='회원점명',imageSrc='',time='26.09.18 18:30:00',amount=22000,menus=[{name:'메뉴명',price:8000,total:18000,count:2,options:[{name:'추가 옵션',total:2000}]},{name:'다른 메뉴',price:4000,total:4000,count:1}]}={}){
 let [label,tone]=states[status]||states.empty;
 if(old){if(['requested','confirmed','empty'].includes(status))label='시간 경과';if(status!=='completed')tone='neutral';}
 const summary=surface({className:'og-order-summary',contentHTML:'<div class="og-order-heading"><h3>'+e(brandName)+'</h3>'+badge({label,tone})+'</div><dl><div><dt>주문 시간</dt><dd>'+e(time)+'</dd></div><div><dt>주문 금액</dt><dd><strong>'+money(amount)+'</strong> 원</dd></div></dl>'});
 const items=menus.map(m=>'<li class="og-order-menu">'+(m.imageSrc?'<div class="og-order-menu-image">'+thumbnail({src:m.imageSrc,alt:m.name})+'</div>':'')+'<div class="og-order-menu-copy"><h4>'+e(m.name)+'</h4>'+(m.options?.length?'<p>'+m.options.map(o=>e(o.name)+'('+money(o.total)+'원)').join(',')+'</p>':'')+'<p>'+e(m.priceText||'기본 '+money(m.price)+' 원')+'</p></div><div class="og-order-menu-total"><span>X '+e(m.count)+'</span><span>'+money(m.total)+' 원</span></div></li>').join('');
 return '<section class="og-order-detail" inert aria-label="주문내역 상세보기">'+appBar({title:'주문내역 상세보기',back:true})+'<div class="og-order-body"><div class="og-order-store-image">'+thumbnail({src:imageSrc,alt:brandName,state:imageSrc?'ready':'empty',attributes:{'data-ratio':'wide'}})+'</div>'+summary+surface({className:'og-order-menus',contentHTML:'<h3>주문 메뉴</h3><ul>'+items+'</ul>'})+'</div>'+(status==='requested'&&!old?'<div class="og-order-actions">'+button({label:'주문 취소하기',variant:'secondary'})+'</div>':'')+'</section>';
}
export function orderDetailBoard({imageSrc=''}={}){
 const menus=[{name:'메뉴명',price:8000,total:18000,count:2,options:[{name:'추가 옵션',total:2000}],imageSrc},{name:'다른 메뉴',price:4000,total:4000,count:1}];
 const sample=props=>orderDetail({imageSrc,menus,...props});
 return '<div class="screen-page-content"><div class="screen-artboard">'+sample({})+'</div><div class="screen-design-notes"><h3>매장과 주문 정보</h3><p>매장 이미지 아래에 주문 상태·시간·금액을 모았습니다.</p><h3>메뉴별 금액 구분</h3><p>메뉴명과 옵션은 왼쪽, 수량과 합계는 오른쪽에 맞췄습니다. 메뉴 사이는 얇은 선으로 나눴습니다.</p><h3>부드러운 카드</h3><p>밝은 배경 위에 화이트 카드와 옅은 그림자를 사용했습니다.</p></div></div>'+[['접수된 주문','confirmed',false],['완료된 주문','completed',false],['취소된 주문','cancelled',false],['시간이 지난 주문','requested',true]].map(([title,status,old])=>'<section class="history-empty-example"><h3 class="history-state-label">'+title+'</h3><div class="screen-artboard">'+sample({status,old,time:old?'26.09.17 18:30:00':undefined})+'</div></section>').join('');
}
