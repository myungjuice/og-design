import {waitingDialog} from '../../design-system/pages/my-info/waiting-detail.mjs';
import {escapeHTML as e,uid} from '../../design-system/components/core.mjs';
import {renderDialog} from '../components/dialog.mjs';
import {renderQuantity} from '../components/quantity.mjs';
import {renderWaitingDetail} from './waiting-detail.mjs';

const types=[['people','인원 변경'],['cancel','취소 확인']];
export function renderWaitingDialog({id=uid('v2-waiting-dialog'),type='people'}={}){
 if(!types.some(([key])=>key===type))throw new RangeError('Unknown waiting dialog');
 // Source owns bounds/notices; v2 clarifies cancellation roles and one copy typo.
 const source=waitingDialog(type).match(/<div class="og-res-picker-overlay"><div class="og-dialog-panel"><h3 class="og-dialog-title">([^<]+)<\/h3>([\s\S]*?)<div class="og-dialog-actions">/);
 if(!source)throw new Error('Waiting dialog source body is missing');
 const title=source[1];let body=source[2];
 body=body.replaceAll('<li>이린이 적용 기준은 매장마다 다를 수 있습니다.</li>','<li>어린이 적용 기준은 매장마다 다를 수 있습니다.</li>');
 body=body.replace(/<div id="[^"]+" class="og-quantity"[^>]*>[\s\S]*?<\/div>/g,markup=>{
  const label=markup.match(/aria-label="([^"]+)"/)[1],value=Number(markup.match(/data-value="(\d+)"/)[1]),min=Number(markup.match(/data-min="(\d+)"/)[1]);
  const max=markup.match(/data-max="(\d+)"/);
  return renderQuantity({id:id+'-'+(label==='성인'?'adults':'children'),label,value,min,max:max?Number(max[1]):null})
   .replace('<span class="og-quantity-unit">개</span>','<span class="og-quantity-unit">명</span>');
 });
 const actions=type==='cancel'?[{label:'돌아가기',variant:'secondary'},{label:'웨이팅 취소',variant:'danger'}]:[{label:'취소',variant:'secondary'},{label:'확인'}];
 const dialog=renderDialog({id,title,body:'',actions}).replace(' inert','')
  .replace('class="v2-dialog-static"','class="v2-dialog-static v2-picker-dialog v2-waiting-dialog"')
  .replace(/<p class="og-dialog-body"[^>]*><\/p>/,()=>'<div class="v2-picker-body" role="region" aria-label="'+e(title)+' 내용 · 정적 시안" tabindex="0">'+body+'</div>');
 return ('<section class="v2-picker-frame v2-waiting-dialog-frame" aria-label="'+(type==='people'?'웨이팅 인원 변경':'웨이팅 취소 확인')+'"><div class="v2-picker-backdrop" inert aria-hidden="true">'+renderWaitingDetail({id:id+'-detail'})+'</div><div class="v2-picker-overlay">'+dialog+'</div></section>')
  .replace(/<button(?! inert)\b/g,'<button inert');
}
const cssFiles=['button','icon-button','badges','surfaces','dialog','quantity'].map(name=>'/v2/components/'+name+'.css')
 .concat('/v2/my-info/reservation-detail.css','/v2/my-info/waiting-detail.css','/v2/my-info/reservation-pickers.css','/v2/my-info/waiting-dialogs.css');
export function renderWaitingDialogsReview(){
 return '<section id="waiting-dialogs" data-review-screen aria-labelledby="waiting-dialogs-title" hidden><h2 id="waiting-dialogs-title">웨이팅 인원 변경·취소 확인</h2><p class="v2-intro">웨이팅 신청 인원을 조절하거나 취소 전 의사를 확인하는 팝업입니다.</p><div class="v2-reservation-review-grid v2-waiting-dialogs-review-grid">'+types.map(([type,title])=>'<figure class="v2-reservation-review-sample" data-waiting-dialog="'+type+'"><figcaption>'+e(title)+'</figcaption><div class="v2-waiting-dialog-history-host"><template>'+cssFiles.map(href=>'<link rel="stylesheet" href="'+href+'">').join('')+renderWaitingDialog({id:'v2-waiting-dialog-'+type,type})+'</template></div></figure>').join('')+'</div><p class="v2-intro">인원과 웨이팅 번호는 검토용 예시이며 실제 인원 변경·취소·확인은 실행되지 않습니다.</p></section>';
}
export function setupWaitingDialogsReview(root){
 for(const host of root.querySelectorAll('.v2-waiting-dialog-history-host')){
  if(host.shadowRoot)continue;
  const template=host.querySelector('template');host.attachShadow({mode:'open'}).append(template.content.cloneNode(true));template.remove();
 }
}
