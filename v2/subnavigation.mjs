import {componentGroups} from './components/catalog.mjs';
import {foundationGroups} from './design-system/foundations.mjs';
import {escapeHTML as e} from '../design-system/components/core.mjs';
const pending=(id,label,names)=>({id,label,items:names.map((label,index)=>({id:id+'-'+index,label,pending:true}))});
export function reviewGroups(pageId){
 if(pageId==='components')return componentGroups;
 if(pageId==='design-system')return [
  {id:'colors',label:'컬러',items:foundationGroups.filter(item=>item.id==='colors').map(({id,title})=>({id,label:title}))},
  {id:'type-space',label:'타이포·여백',items:foundationGroups.filter(item=>['typography','spacing'].includes(item.id)).map(({id,title})=>({id,label:title}))},
  {id:'shape-material',label:'곡률·3D 재질',items:foundationGroups.filter(item=>['radius','materials'].includes(item.id)).map(({id,title})=>({id,label:title}))}
 ];
 if(['home','barcode','my-info'].includes(pageId)){
  const labels={home:'홈',barcode:'바코드','my-info':'내정보 메인'};
  const groups=[{id:'overview',label:'기본 화면',items:[{id:'overview',label:labels[pageId]}]}];
  if(pageId==='home')groups.push({id:'explore',label:'검색·업종',items:[{id:'search',label:'매장 검색·검색 결과'},{id:'category',label:'업종 선택'}]});
  if(pageId==='home')groups.push({id:'nearby',label:'주변 탐색',items:[{id:'nearby',label:'근처 보기'}]});
  if(pageId==='home')groups.push({id:'store',label:'매장',items:[{id:'store',label:'매장 상세 첫 화면'},{id:'store-share',label:'매장 공유'},{id:'store-photo',label:'매장 사진 상세'},{id:'main-menu',label:'주요 메뉴'},{id:'full-menu',label:'전체 메뉴'},{id:'menu-detail',label:'메뉴 상세'}]});
  if(pageId==='home')groups.push({id:'store-services',label:'예약·웨이팅',items:[{id:'store-reservation',label:'매장 예약 영역'},{id:'store-waiting',label:'매장 웨이팅 영역'}]});
  if(pageId==='home')groups.push({id:'store-updates',label:'소식·이벤트',items:[{id:'store-news',label:'매장 소식 영역'},{id:'store-event',label:'매장 이벤트 영역'},{id:'news-list',label:'소식 전체 목록'},{id:'news-detail',label:'소식 상세'},{id:'event-list',label:'이벤트 전체 목록'},{id:'event-detail',label:'이벤트 상세'}]});
  if(pageId==='home')groups.push(
   {id:'store-reviews',label:'매장 리뷰',items:[{id:'store-reviews',label:'매장 리뷰 영역'},{id:'praise-write',label:'칭찬 대상·작성'},{id:'review-list',label:'포토 리뷰 전체 목록'},{id:'review-photo',label:'리뷰 사진 상세'}]},
   {id:'store-information',label:'매장 정보·위치',items:[{id:'store-info',label:'매장 상세정보'},{id:'store-location',label:'위치찾기'}]}
  );
  if(pageId==='my-info')groups.push(
   {id:'profile-character',label:'프로필 캐릭터',items:[{id:'profile-character',label:'미선택·캐릭터 선택'}]},
   {id:'mileage-history',label:'마일리지',items:[{id:'mileage-history',label:'내역·기간 선택'},{id:'mileage-monthly',label:'월별 내역·비교안'}]},
   {id:'history-reservations',label:'내역·예약',items:[{id:'use-history',label:'이용내역 · 4탭'},{id:'reservation-detail',label:'예약 상세'},{id:'reservation-change',label:'예약 변경'},{id:'reservation-pickers',label:'날짜·시간·인원 선택'}]},
   {id:'history-waiting',label:'웨이팅',items:[{id:'waiting-detail',label:'웨이팅 상세'},{id:'waiting-dialogs',label:'인원 변경·취소 확인'}]},
   {id:'history-orders',label:'Q오더',items:[{id:'order-detail',label:'주문 상세·취소 확인'}]},
   {id:'history-reviews',label:'리뷰',items:[{id:'review-history',label:'리뷰 내역·관리'},{id:'photo-review',label:'포토 리뷰'},{id:'review-write',label:'리뷰 작성'}]},
   {id:'notice-notifications',label:'공지·알림',items:[{id:'notices',label:'공지·내 알림'},{id:'notice-detail',label:'공지 상세'}]},
   {id:'membership',label:'멤버십',items:[{id:'membership',label:'회원증·공유'}]},
   {id:'inquiries',label:'문의',items:[{id:'support',label:'문의하기'},{id:'faq',label:'자주 묻는 질문'},{id:'opinion',label:'의견·문의 내역'},{id:'customer-center',label:'고객센터'}]},
   {id:'documents',label:'약관·정책',items:[{id:'policies',label:'약관·정책 목록'},{id:'policy-detail',label:'문서 상세'}]},
   {id:'account-settings',label:'계정·설정',items:[{id:'settings',label:'설정'},{id:'password',label:'비밀번호 변경'},{id:'account',label:'가입 정보·탈퇴'}]},
   pending('held','보류',['캐릭터 파츠 꾸미기'])
  );
  return groups;
 }
 return [];
}
export function renderSubnavigation({pageId,label}={}){
 const groups=reviewGroups(pageId),searchLabel=pageId==='components'?'컴포넌트 검색':'화면 검색';
 return `<aside class="v2-secondary-sidebar" aria-label="${e(label)} 보조 메뉴"><h2 class="v2-secondary-title">${e(label)}</h2>
 <details class="v2-submenu" open><summary>하위 메뉴</summary>
 ${groups.length>1?`<label class="v2-subnav-search-label" for="review-filter">${searchLabel}</label><div class="v2-subnav-filter"><input id="review-filter" type="search" placeholder="${pageId==='components'?'버튼, 마일리지':'화면 이름'}" autocomplete="off"><button type="button" data-clear-review-filter aria-label="검색 지우기">×</button></div><p class="v2-subnav-status" role="status" aria-live="polite" hidden></p>`:''}
 <nav class="v2-subnav" aria-label="${e(label)} 하위 메뉴">${groups.map(group=>{
  const ready=group.items.some(item=>!item.pending);
  return `<div data-review-group="${group.id}">${ready?`<a class="v2-group-link" href="#group-${group.id}" data-group-link="${group.id}">${e(group.label)}</a>`:`<p class="v2-group-label">${e(group.label)}<span>${group.id==='held'?'작업 보류':'이관 예정'}</span></p>`}
  <div class="v2-subnav-children">${group.items.map(item=>item.pending?`<span class="v2-subnav-pending" aria-disabled="true">${e(item.label)}</span>`:`<a href="#${item.id}" data-view-link="${item.id}" aria-controls="${item.id}">${e(item.label)}</a>`).join('')}</div></div>`;
 }).join('')}</nav>${groups.length?'':'<p class="v2-subnav-empty">하위 화면 준비 중</p>'}</details></aside>`;
}
export function renderReviewPicker(pageId){
 const groups=reviewGroups(pageId).filter(group=>group.items.some(item=>!item.pending));
 if(groups.length<2)return '';
 return `<div class="v2-review-picker"><label for="review-picker">화면 그룹 선택</label><select id="review-picker">${groups.map(group=>`<option value="${group.id}">${e(group.label)}</option>`).join('')}</select></div>`;
}
