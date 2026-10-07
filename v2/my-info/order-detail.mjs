import {orderDetail} from '../../design-system/pages/my-info/order-detail.mjs';
import {thumbnail} from '../../design-system/components/avatar/render.mjs';
import {escapeHTML as e,icon,uid} from '../../design-system/components/core.mjs';
import {renderBadge} from '../components/badges.mjs';
import {renderThumbnail,setupMedia} from '../components/media.mjs';
import {renderDialog} from '../components/dialog.mjs';

const labels={requested:'주문',confirmed:'접수',completed:'완료',cancelled:'취소',selfCancelled:'취소',empty:''};
// 기존 이용내역 Q오더 탭과 같은 배치 확인용 예시이며 실제 주문 데이터가 아닙니다.
const fields={brandName:'스시산원 반주헌',time:'26.09.18 12:10:00',amount:18000,menus:[{name:'메뉴명',price:8000,total:18000,count:2,options:[{name:'추가 옵션',total:2000}]}]};
const back='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m14 5-7 7 7 7M7 12h14"/></svg>';
export function renderOrderDetail({id=uid('v2-order'),status='requested',old=false,...supplied}={}){
 if(!Object.hasOwn(labels,status))throw new RangeError('Unknown Qorder status');
 if(typeof old!=='boolean')throw new TypeError('Elapsed order state must be boolean');
 const options={...fields,imageSrc:'',...supplied};
 // 원본이 정보와 취소 노출 조건을 소유하고, v2는 외형과 스크롤만 보완합니다.
 let html=orderDetail({...options,status,old})
  .replace('class="og-order-detail" inert','class="og-order-detail v2-order-detail"')
  .replace('<h2>주문내역 상세보기</h2>',()=>'<h2 id="'+e(id)+'-title">주문내역 상세보기</h2>')
  .replace('class="og-order-body"','class="og-order-body" role="region" aria-label="주문 상세 내용 · 정적 시안" tabindex="0"')
  .replace(/class="og-surface (og-order-summary|og-order-menus)"/g,(_,name)=>'class="og-surface v2-surface '+name+'" data-depth="'+(name==='og-order-summary'?'raised':'flat')+'"')
  .replace(/<span class="og-badge" data-tone="([^"]+)" data-size="small">([^<]*)<\/span>/g,(_,tone,label)=>label?renderBadge({tone,label}):'')
  .replaceAll('class="og-button"','class="og-button v2-button"')
  .replaceAll('class="og-icon-button"','class="og-icon-button v2-icon-button" data-face="plain"')
  .replaceAll(icon('arrow_back'),back);
 const image=options.imageSrc;
 html=html.replace(thumbnail({src:image,alt:options.brandName,state:image?'ready':'empty',attributes:{'data-ratio':'wide'}}),()=>renderThumbnail({src:image,alt:options.brandName+' 매장 사진',state:image?'ready':'empty',ratio:'wide'}));
 for(const menu of options.menus){
  if(menu.imageSrc)html=html.replace(thumbnail({src:menu.imageSrc,alt:menu.name}),()=>renderThumbnail({src:menu.imageSrc,alt:menu.name+' 메뉴 사진'}));
 }
 return html.replace(/<button\b/g,'<button inert');
}
export function renderOrderCancellation({id=uid('v2-order-cancel')}={}){
 const dialog=renderDialog({id,title:'확인',body:'주문을 취소하시겠습니까?',actions:[{label:'돌아가기',variant:'secondary'},{label:'주문 취소',variant:'danger'}]})
  .replace('class="v2-dialog-static"','class="v2-dialog-static v2-picker-dialog"');
 return ('<section class="v2-picker-frame v2-order-cancel-frame" aria-label="주문 취소 확인"><div class="v2-picker-backdrop" inert aria-hidden="true">'+renderOrderDetail({id:id+'-detail'})+'</div><div class="v2-picker-overlay">'+dialog+'</div></section>').replace(/<button(?! inert)\b/g,'<button inert');
}
const cssFiles=['button','icon-button','badges','surfaces','media','dialog'].map(name=>'/v2/components/'+name+'.css').concat('/v2/my-info/order-detail.css','/v2/my-info/reservation-pickers.css');
const sample=(key,title,options={},cancel=false)=>'<figure class="v2-reservation-review-sample" data-order-state="'+key+'"><figcaption>'+e(title)+'</figcaption><div class="v2-order-history-host"><template>'+cssFiles.map(href=>'<link rel="stylesheet" href="'+href+'">').join('')+(cancel?renderOrderCancellation({id:'v2-order-'+key}):renderOrderDetail({id:'v2-order-'+key,...options}))+'</template></div></figure>';
export function renderOrderDetailReview(){
 return '<section id="order-detail" data-review-screen aria-labelledby="order-detail-title" hidden><h2 id="order-detail-title">Q오더 상세</h2><p class="v2-intro">주문 상태·시간·금액과 메뉴별 옵션·수량을 확인하는 화면입니다.</p><div class="v2-reservation-review-grid">'+['requested','confirmed','completed'].map(status=>sample(status,labels[status],{status})).join('')+'</div><p class="v2-intro">매장·메뉴·금액은 기존 이용내역과 같은 배치 예시입니다. 당일 주문 요청 상태에서만 취소 버튼이 표시되며 실제 조회·주문 취소·뒤로가기는 실행되지 않습니다.</p><details class="v2-order-extra"><summary>취소·시간 경과·긴 메뉴 비교</summary><div class="v2-reservation-review-grid">'+sample('cancelled','매장 취소',{status:'cancelled'})+sample('selfCancelled','직접 취소',{status:'selfCancelled'})+['requested','confirmed'].map(status=>sample('old-'+status,labels[status]+' · 시간 경과',{status,old:true,time:'26.09.17 12:10:00'})).join('')+sample('cancel-confirm','주문 취소 확인',{},true)+sample('long-menus','긴 메뉴·옵션 · 본문 스크롤',{amount:32000,menus:Array.from({length:8},(_,i)=>({name:'긴 메뉴명과 옵션을 함께 표시하는 예시 '+(i+1),price:4000,total:4000,count:1,options:[]}))})+'</div></details></section>';
}
export function setupOrderDetailReview(root){
 const section=root.querySelector('#order-detail');if(!section||section.dataset.orderReady)return;
 const mount=scope=>{for(const host of scope.querySelectorAll('.v2-order-history-host')){
  if(host.shadowRoot)continue;
  const template=host.querySelector('template');host.attachShadow({mode:'open'}).append(template.content.cloneNode(true));template.remove();setupMedia(host.shadowRoot);
 }};
 section.dataset.orderReady='true';mount(section.querySelector('.v2-reservation-review-grid'));
 const extra=section.querySelector('.v2-order-extra');
 if(extra.open)mount(extra);
 extra.addEventListener('toggle',()=>{if(extra.open)mount(extra);});
}
