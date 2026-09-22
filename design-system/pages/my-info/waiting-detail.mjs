import {peopleDialog} from './people-dialog.mjs';
import {dialog} from '../../components/dialog/render.mjs?v=20260918-pickers';
import {surface,badge,button} from '../../components/index.mjs';
import {appBar} from '../../components/app-shell/render.mjs?v=20260918-waiting';
import {escapeHTML as e,icon} from '../../components/core.mjs';
const waitingNotice=['입장 호출 시 자리에 안계신 경우, 웨이팅이 취소됩니다.','인원이 변경된 경우, 인원 변경 버튼을 눌러주세요.','이린이 적용 기준은 매장마다 다를 수 있습니다.'];
const cancelNotice=['웨이팅 취소는 언제든지 가능합니다.','취소 후 재웨이팅은 새로운 번호로만 가능합니다.','무단 노쇼 시 향후 웨이팅에 제한이 있을 수 있습니다.'];
const notice=(title,items,name)=>surface({className:'og-reservation-notice',contentHTML:'<h3>'+icon(name)+e(title)+'</h3><ul>'+items.map(item=>'<li>'+e(item)+'</li>').join('')+'</ul>'});
export function waitingDetail({number=27,position=4,storeName='회원점명',phone='02-000-0000',adults=2,children=0,time='오후 5:30'}={}){
 const header=surface({className:'og-reservation-store',contentHTML:'<span class="og-reservation-store-icon">'+icon('store')+'</span><div><div class="og-reservation-store-title"><h3>'+e(storeName)+'</h3>'+badge({label:'웨이팅 중',tone:'info'})+'</div><span class="og-reservation-phone">'+icon('phone')+e(phone)+'</span></div>'});
 const ticket=surface({className:'og-wait-ticket',contentHTML:'<h3>'+e(storeName)+'</h3><p class="og-wait-label">현재 내 순서</p><div class="og-wait-numbers"><span><strong>'+e(number)+'</strong> 번</span><span><strong>'+e(position)+'</strong> 번째</span></div><div class="og-wait-people"><span>'+icon('people')+'성인: <strong>'+e(adults)+'명</strong></span><span>'+icon('child_care')+'어린이: <strong>'+e(children)+'명</strong></span></div><p class="og-wait-time">웨이팅 신청:  '+e(time)+'</p>'});
 return '<section class="og-reservation-detail og-wait-detail" inert aria-label="웨이팅 현황">'+appBar({title:'웨이팅 현황',back:true,refresh:true})+'<div class="og-reservation-body">'+header+ticket+notice('웨이팅 안내',waitingNotice,'info_outline')+notice('취소 안내',cancelNotice,'cancel')+'</div><div class="og-reservation-actions">'+button({label:'웨이팅 취소하기',variant:'secondary'})+button({label:'인원 변경'})+'</div></section>';
}
export function waitingDialog(type='people'){
 const content=type==='people'?peopleDialog({type:'waiting'}):dialog({title:'확인',body:'웨이팅 취소를 하시겠습니까?',actions:[{label:'취소',variant:'secondary'},{label:'확인'}]});
 return '<section class="og-res-picker-screen og-wait-dialog-screen" inert aria-label="'+(type==='people'?'웨이팅 인원 변경':'웨이팅 취소 확인')+'"><div class="og-res-picker-backdrop" aria-hidden="true">'+waitingDetail()+'</div><div class="og-res-picker-overlay">'+content+'</div></section>';
}
export function waitingDetailBoard(){
 return '<div class="screen-page-content"><div class="screen-artboard">'+waitingDetail()+'</div><div class="screen-design-notes"><h3>번호와 순서 구분</h3><p>웨이팅 번호 옆에 현재 순서를 더 크게 표시했습니다. 인원과 신청 시간은 아래에 모았습니다.</p><h3>연한 블루와 부드러운 입체감</h3><p>대기표는 옅은 블루로 구분하고, 얇은 테두리와 부드러운 그림자를 적용했습니다.</p><h3>안내와 하단 버튼</h3><p>웨이팅·취소 안내를 나누고, 취소하기와 인원 변경 버튼은 나란히 배치했습니다.</p></div></div>'+['웨이팅 인원 변경','웨이팅 취소 확인'].map((title,i)=>'<section id="review-waiting-'+(i?'cancel':'people')+'" class="history-empty-example"><h3 class="history-state-label">'+title+' '+badge({label:'New',tone:'info'})+'</h3><div class="screen-page-content"><div class="screen-artboard">'+waitingDialog(i?'cancel':'people')+'</div><div class="screen-design-notes"><h3>'+(i?'취소 전 확인':'인원 조절')+'</h3><p>'+(i?'웨이팅 현황 위에 확인창을 띄우고, 취소와 확인 버튼을 나란히 배치했습니다.':'성인과 어린이를 나누고, 인원 조절 아래에 웨이팅 안내를 모았습니다. 예약 인원 선택창과 같은 구성입니다.')+'</p></div></div></section>').join('');
}
