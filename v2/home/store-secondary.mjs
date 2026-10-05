import {publicStoreData} from '../../design-system/pages/home/public-store-data.mjs';
import {publicReviewsData} from '../../design-system/pages/home/public-reviews-data.mjs';
import {escapeHTML as e} from '../../design-system/components/core.mjs';
import {button,iconButton} from '../../design-system/components/button/render.mjs';
import {renderSheet} from '../components/sheet.mjs';
import {renderDialog} from '../components/dialog.mjs';
import {renderChip} from '../components/chips.mjs';
import {renderThumbnail} from '../components/media.mjs';
import {renderHomeStoreContent} from './store.mjs';
import {remainingGallery,setupRemainingGallery} from './remaining-gallery.mjs';

// Provenance: legacy ShopPanel._shareStore, StorePicturePage,
// JoybarAvailablePage and JoyBarReviewPage. No APIs or service actions are bound.
const svg=path=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${path}"/></svg>`;
const art={back:svg('m14 5-7 7 7 7'),link:svg('M9 15l6-6M8 17l-1 1a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0m2-1 1-1a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0'),loyalty:svg('M3 3h9l9 9-9 9-9-9V3ZM7 7h.01m3 5 2 2 4-4'),eco:svg('M20 4C8 2 2 9 6 16c7 6 14-2 14-12ZM5 20 16 9'),home:svg('m3 11 9-8 9 8M5 10v11h14V10M9 21v-7h6v7'),group:svg('M9 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2 21v-3a7 7 0 0 1 14 0v3m0-17a3 3 0 0 1 0 6m3 4a7 7 0 0 1 3 7'),local_parking:svg('M7 21V3h6a5 5 0 0 1 0 10H7'),sentiment_satisfied:svg('M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM8 9h.01M16 9h.01M8 14q4 5 8 0'),food_bank:svg('m3 10 9-7 9 7M5 10v11h14V10M9 11v4m-2-4v2q0 2 2 2v4m7-8v8m0-8q-3 3 0 5')};
const back=(face='raised')=>iconButton({label:'뒤로가기',iconHTML:art.back,className:'v2-icon-button',attributes:{'data-face':face,inert:true}});
const header=(title,face='raised')=>`<header class="v2-secondary-appbar">${back(face)}<h4>${e(title)}</h4><span aria-hidden="true"></span></header>`;
const passive=html=>html.replace(/<button\b(?![^>]*\binert\b)/g,'<button inert');
const validateState=(state,list)=>{if(!list.includes(state))throw new RangeError('Unsupported secondary screen state');};

export function renderHomeStoreShareScreen({state='open',data=publicStoreData}={}){
 validateState(state,['open']);
 // Keep ShopPanel's actual Kakao asset and Material Icons.sms, not contact or chain icons.
 // SMS path: google/material-design-icons, src/notification/sms/materialicons/24px.svg.
 const sms='<svg data-share-icon="sms" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 11H7V9h2v2zm4 0h-2V9h2v2zm4 0h-2V9h2v2z"/></svg>';
 const choices='<div class="v2-store-share-choices"><button type="button" inert class="v2-store-share-choice"><span class="v2-store-share-icon"><img src="/v2/home/media/kakao-share.png" alt="" width="34" height="35"></span><span>카카오톡 공유</span></button><button type="button" inert class="v2-store-share-choice"><span class="v2-store-share-icon">'+sms+'</span><span>링크 공유</span></button></div>';
 const sheet=passive(renderSheet({id:'store-share-sheet',title:'오지스토어 공유',bodyHTML:choices,actions:[]}))
  .replace('class="v2-sheet-static" inert','class="v2-sheet-static"')
  .replace('<div class="og-sheet-footer"></div>','');
 return `<div class="v2-home-store-secondary-frame v2-home-store-share-frame" data-store-share-state="${state}"><div class="v2-secondary-background" inert aria-hidden="true">${renderHomeStoreContent({store:data.store})}</div><div class="v2-secondary-overlay v2-secondary-sheet-overlay">${sheet}</div></div>`;
}

export function renderHomeStorePhotoScreen({state='first',data=publicStoreData}={}){
 validateState(state,['first','last']);
 const images=data.store.images||[];if(!images.length)throw new RangeError('Store photo detail requires a registered photo');
 const index=state==='last'?images.length-1:0;
 // StorePicturePage has no photo counter or arrow buttons. Those belong to
 // StoreImageView and ReviewPicturePage respectively; do not add them here.
 return `<div class="v2-home-store-secondary-frame v2-home-store-photo-frame" data-store-photo-state="${state}"><section class="v2-store-photo-page">${header(data.store.name,'flat')}<div class="v2-store-photo-image">${renderThumbnail({src:images[index],alt:data.store.name+' 매장 사진',ratio:'wide',fit:'contain'})}</div></section></div>`;
}

// Purchase/visit counts are comparison fixtures, never fetched member history.
// The seven names come from the anonymous public review snapshot. Category
// metadata is absent there, so no invented category title is inserted.
const praiseData={store:publicReviewsData.store,visitCount:2,reviewCount:1,lastVisit:'3일 전',history:[{date:'2026-09-19 18:30',amount:25000,hasReviewed:false},{date:'2026-09-10 12:00',amount:18000,hasReviewed:true}],groups:[{name:'',items:publicReviewsData.praise.map((item,index)=>({...item,id:String(index)}))}]};
const praiseStates=[['targets','칭찬 작성 대상 · 방문 내역 예시'],['empty','방문 내역 없음'],['selection','칭찬 선택 전'],['selected','두 항목 선택 · 등록'],['edit','기존 칭찬 변경 · 수정'],['delete','기존 선택 모두 해제 · 삭제'],['limit','다섯 항목 선택 · 제한 안내']];
function praiseTargets(data,empty){
 const entries=empty?[]:data.history||[];
 const logo=renderThumbnail({src:data.store.logo||'',alt:data.store.name+' 로고',fit:'contain',decorative:true});
 const profile=`<section class="v2-praise-profile"><div>${logo}<h5>${e(data.store.name)}</h5></div><p><strong>내 리뷰: ${e(empty?0:data.reviewCount??0)}회</strong></p><p>${entries.length?e((data.visitCount??entries.length)+'번 방문. 마지막 방문 '+(data.lastVisit||'')):'방문 전'}</p></section>`;
 const rows=entries.map(entry=>`<article class="v2-praise-target"><div><strong>${e(entry.date)}</strong><p>${e(Number(entry.amount).toLocaleString('ko-KR'))}원 사용</p></div>${button({label:entry.hasReviewed?'수정':'리뷰 작성',variant:entry.hasReviewed?'secondary':'text',size:'compact',className:'v2-button',attributes:{inert:true}})}</article>`).join('');
 return `${header('리뷰')}${profile}<div class="v2-praise-targets" role="region" tabindex="0" aria-label="칭찬 작성 대상 내역">${entries.length?rows:`<div class="v2-praise-empty">${art.loyalty}<p>이 매장에 아직 적립 내역이 없습니다</p></div>`}</div>`;
}
function praiseSelection(data,selected,original){
 const groups=data.groups||praiseData.groups,available=new Set(groups.flatMap(group=>group.items.map(item=>item.id)));
 if(!Array.isArray(selected)||!Array.isArray(original)||selected.length>5||new Set(selected).size!==selected.length||selected.some(id=>!available.has(id))||original.some(id=>!available.has(id)))throw new RangeError('Invalid praise selection');
 const same=selected.length===original.length&&selected.every(id=>original.includes(id));
 const label=same?'':!original.length?selected.length+'개 등록하기':!selected.length?'리뷰 삭제하기':'리뷰 수정하기';
 const sections=groups.map(group=>`<section class="v2-praise-category">${group.name?'<h5>'+e(group.name)+'</h5>':''}<div class="v2-praise-options" role="group" aria-label="${e(group.name||'칭찬 항목')}">${group.items.map(item=>renderChip({label:item.name,selected:selected.includes(item.id),attributes:{inert:true}}).replace('<span class="v2-chip-label">',()=>`<span class="v2-praise-option-icon">${art[item.icon]||art.loyalty}</span><span class="v2-chip-label">`)).join('')}</div></section>`).join('');
 return `${header('리뷰 작성')}<p class="v2-praise-instruction">최대 5개까지 리뷰 항목을 골라주세요.</p><div class="v2-praise-selection" role="region" tabindex="0" aria-label="칭찬 선택 항목">${sections}</div>${label?'<footer class="v2-praise-save">'+button({label,className:'v2-button',attributes:{inert:true}})+'</footer>':''}`;
}
export function renderHomeStorePraiseScreen({state='targets',data=praiseData,selected,original}={}){
 validateState(state,praiseStates.map(([id])=>id));
 if(['targets','empty'].includes(state))return `<div class="v2-home-store-secondary-frame v2-home-store-praise-frame" data-praise-write-state="${state}"><section class="v2-store-praise-page">${praiseTargets(data,state==='empty')}</section></div>`;
 const ids=(data.groups||praiseData.groups).flatMap(group=>group.items.map(item=>item.id));
 const previous=original??(['edit','delete'].includes(state)?ids.slice(0,2):[]);
 const chosen=selected??(state==='limit'?ids.slice(0,5):state==='selected'?ids.slice(0,2):state==='edit'?ids.slice(1,3):[]);
 const page=`<section class="v2-store-praise-page">${praiseSelection(data,chosen,previous)}</section>`;
 const limit=state==='limit'?passive(renderDialog({id:'praise-limit-dialog',title:'알림',body:'최대 5개까지 선택이 가능합니다.',actions:[{label:'확인'}]}))
  .replace(/(<div class="v2-dialog-static"[^>]*?) inert/,'$1')
  .replace('class="v2-dialog-static"','class="v2-dialog-static" role="region" tabindex="0" aria-label="칭찬 선택 제한 안내"'):'';
 return `<div class="v2-home-store-secondary-frame v2-home-store-praise-frame" data-praise-write-state="${state}">${limit?'<div class="v2-secondary-background" inert aria-hidden="true">'+page+'</div><div class="v2-secondary-overlay v2-secondary-dialog-overlay">'+limit+'</div>':page}</div>`;
}

const styles=['button','icon-button','media','sheet','dialog','chips'].map(name=>'/v2/components/'+name+'.css').concat('/v2/home/store.css','/v2/home/store-secondary.css');
export const renderHomeStoreShareReview=()=>remainingGallery({id:'store-share',title:'매장 공유',copy:'매장을 카카오톡이나 링크로 공유하는 화면입니다. 실제 공유는 실행하지 않습니다.',states:[['open','공유 방식 선택']],screen:renderHomeStoreShareScreen,styles});
export const renderHomeStorePhotoReview=()=>remainingGallery({id:'store-photo',title:'매장 사진 상세',copy:'매장 사진을 원본 비율로 살펴보는 화면입니다. 사진 이동·확대는 실행하지 않습니다.',states:[['first','첫 번째 등록 사진'],['last','마지막 등록 사진']],screen:renderHomeStorePhotoScreen,styles});
export const renderHomeStorePraiseReview=()=>remainingGallery({id:'praise-write',title:'칭찬 작성',copy:'이용 내역에서 칭찬할 방문을 고르고, 칭찬 항목을 선택하는 화면입니다. 방문 정보는 표시 예시이며 작성·저장은 실행하지 않습니다.',states:praiseStates,screen:renderHomeStorePraiseScreen,styles});
export const setupHomeStoreShareReview=root=>setupRemainingGallery(root,'store-share');
export const setupHomeStorePhotoReview=root=>setupRemainingGallery(root,'store-photo');
export const setupHomeStorePraiseReview=root=>setupRemainingGallery(root,'praise-write');
