import {reviewHistory} from '../../design-system/pages/my-info/review-history.mjs';
import {avatar} from '../../design-system/components/index.mjs';
import {escapeHTML as e,uid} from '../../design-system/components/core.mjs';
import {renderReviewRecords} from './use-history.mjs';
import {renderAvatar,setupMedia} from '../components/media.mjs';
import {renderFeedback} from '../components/feedback.mjs';
import {renderActionMenu} from '../components/help.mjs';
import {renderDialog} from '../components/dialog.mjs';

const back='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>';
export function renderReviewHistory({id=uid('v2-review-history'),empty=false,items,imageSrc='',state='basic'}={}){
 if(!['basic','menu','delete'].includes(state))throw new RangeError('Unknown review state');
 // The existing screen owns header/copy; the hub owns the shared review card.
 let shell=reviewHistory({empty:true}).replace('class="og-review-history og-use-history" inert','class="v2-reservation-detail v2-review-history-frame"');
 shell=shell.replace(/<span class="material-icons"[^>]*>[\s\S]*?<\/span>/,()=>back)
  .replace('class="og-icon-button','class="v2-icon-button og-icon-button')
  .replace(avatar({size:'small',label:'내 프로필'}),()=>renderAvatar({size:'small',character:true,label:'내 프로필'}));
 const content=empty?renderFeedback({id:id+'-empty',kind:'history',title:'리뷰 내역이 없습니다.',body:''}):renderReviewRecords({items,imageSrc});
 shell=shell.replace(/<div class="og-review-history-body">[\s\S]*?<\/div><\/section>/,()=>'<div class="v2-review-history-body" role="region" aria-label="리뷰 내역 · 정적 시안" tabindex="0">'+content+'</div></section>');
 if(state==='delete'){
  const dialog=renderDialog({id:id+'-delete',title:'확인',body:'리뷰를 삭제하시겠습니까?',actions:[{label:'취소',variant:'secondary'},{label:'삭제',variant:'danger'}]});
  return ('<section class="v2-picker-frame v2-review-delete-frame" aria-label="리뷰 삭제 확인"><div class="v2-picker-backdrop" inert aria-hidden="true">'+shell+'</div><div class="v2-picker-overlay">'+dialog+'</div></section>').replace(/<button(?! inert)\b/g,'<button inert');
 }
 const menu=state==='menu'?'<div class="v2-review-floating-menu">'+renderActionMenu()+'</div>':'';
 return ('<div class="v2-review-history-stage">'+shell+menu+'</div>').replace(/<button(?! inert)\b/g,'<button inert');
}
const cssFiles=['button','icon-button','badges','media','surfaces','feedback','dialog','help'].map(name=>'/v2/components/'+name+'.css').concat('/v2/my-info/use-history.css','/v2/my-info/reservation-detail.css','/v2/my-info/reservation-pickers.css','/v2/my-info/review-history.css');
const sample=(key,label,options={})=>'<figure class="v2-reservation-review-sample" data-review-history-state="'+key+'"><figcaption>'+e(label)+'</figcaption><div class="v2-review-history-host"><template>'+cssFiles.map(href=>'<link rel="stylesheet" href="'+href+'">').join('')+renderReviewHistory({id:'v2-review-'+key,...options})+'</template></div></figure>';
export function renderReviewHistoryReview(){
 return '<section id="review-history" data-review-screen aria-labelledby="review-history-title" hidden><h2 id="review-history-title">리뷰 내역</h2><p class="v2-intro">작성한 리뷰의 매장 정보와 사진, 본문을 함께 확인하는 화면입니다.</p><div class="v2-reservation-review-grid v2-review-history-grid">'+sample('basic','기본 목록')+sample('empty','리뷰 없음',{empty:true})+sample('no-photos','사진 없는 리뷰',{items:[{title:'오시 망원본점',meta:'음식점 · 망원동',date:'2026. 9. 18',review:'편하게 이용했어요.',photos:[]}]})+'</div><details class="v2-review-history-extra"><summary>리뷰 관리 · 삭제 확인</summary><div class="v2-reservation-review-grid v2-review-history-extra-grid">'+sample('menu','관리 메뉴',{state:'menu'})+sample('delete','삭제 확인',{state:'delete'})+'</div></details><p class="v2-intro">매장·날짜·본문은 배치 확인용 예시입니다. 뒤로 이동·리뷰 관리·수정·삭제·확인은 실행되지 않습니다.</p></section>';
}
export function setupReviewHistoryReview(root){
 const section=root.querySelector('#review-history');if(!section||section.dataset.reviewReady)return;
 const mount=scope=>{for(const host of scope.querySelectorAll('.v2-review-history-host')){
  if(host.shadowRoot)continue;
  const template=host.querySelector('template');host.attachShadow({mode:'open'}).append(template.content.cloneNode(true));template.remove();setupMedia(host.shadowRoot);
 }};
 section.dataset.reviewReady='true';mount(section.querySelector('.v2-reservation-review-grid'));
 for(const details of section.querySelectorAll('.v2-review-history-extra')){if(details.open)mount(details);details.addEventListener('toggle',()=>{if(details.open)mount(details);});}
}
