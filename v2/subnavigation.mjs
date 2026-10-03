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
  if(pageId==='my-info')groups.push(
   pending('history-reservations','내역·예약',['이용내역','예약 상세','예약 변경']),
   pending('inquiries','문의',['문의하기','자주 묻는 질문','고객센터']),
   pending('account-settings','계정·설정',['설정','비밀번호 변경','가입 정보'])
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
  return `<div data-review-group="${group.id}">${ready?`<a class="v2-group-link" href="#group-${group.id}" data-group-link="${group.id}">${e(group.label)}</a>`:`<p class="v2-group-label">${e(group.label)}<span>이관 예정</span></p>`}
  <div class="v2-subnav-children">${group.items.map(item=>item.pending?`<span class="v2-subnav-pending" aria-disabled="true">${e(item.label)}</span>`:`<a href="#${item.id}" data-view-link="${item.id}" aria-controls="${item.id}">${e(item.label)}</a>`).join('')}</div></div>`;
 }).join('')}</nav>${groups.length?'':'<p class="v2-subnav-empty">하위 화면 준비 중</p>'}</details></aside>`;
}
export function renderReviewPicker(pageId){
 const groups=reviewGroups(pageId).filter(group=>group.items.some(item=>!item.pending));
 if(groups.length<2)return '';
 return `<div class="v2-review-picker"><label for="review-picker">화면 그룹 선택</label><select id="review-picker">${groups.map(group=>`<option value="${group.id}">${e(group.label)}</option>`).join('')}</select></div>`;
}
