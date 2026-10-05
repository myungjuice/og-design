import {renderHomeTest} from '../../screens/my-info-3d-test/home.mjs';
import {categoryItems,cafePin} from '../../design-system/pages/home/category-assets.mjs';
import {bottomSheet} from '../../design-system/components/sheet/render.mjs';
import {renderChip} from '../components/chips.mjs';
import {escapeHTML as e} from '../../design-system/components/core.mjs';

const close='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>';
const states=[['open','업종 선택창','전체를 포함한 13개 업종을 기존 순서로 표시합니다.'],['selected','카페/베이커리 선택 후','선택한 업종을 네 번째 칩에 표시합니다. 지도와 매장 위치는 배치 예시입니다.']];
function categoryChoice(item){
 return renderChip({label:item.name,attributes:{'data-category-id':item.id}})
  .replace(/<svg class="v2-chip-mark v2-chip-check"[\s\S]*?<\/svg>/,'')
  .replace('<span class="v2-chip-label">',`<img src="${e(item.image)}" width="16" height="16" alt=""><span class="v2-chip-label">`)
  .replace('<button','<button inert');
}
function sheet(){
 return bottomSheet({id:'home-category-sheet',title:'업종 선택',bodyHTML:`<div class="v2-home-category-options">${categoryItems.map(categoryChoice).join('')}</div>`,actions:[]})
  .replace('class="og-sheet-panel"','class="og-sheet-panel v2-sheet-panel"')
  .replace('<div class="og-sheet-header">','<div class="v2-home-category-handle" aria-hidden="true"></div><div class="og-sheet-header">')
  .replace('<h2 ','<h3 ').replace('</h2>','</h3>')
  .replace('class="og-sheet-body"','class="og-sheet-body" role="region" tabindex="0" aria-label="업종 목록"')
  .replace(/<span class="material-icons"[^>]*>close<\/span>/,close)
  .replace('og-sheet-close','og-sheet-close v2-icon-button')
  .replace(/<button(?! inert)\b/g,'<button inert');
}
export function renderHomeCategoryScreen({state='open'}={}){
 if(!states.some(([id])=>id===state))throw new RangeError('Unsupported home category state');
 let home=renderHomeTest({assetBase:'/screens/my-info-3d-test/media/figma/'});
 if(state==='selected'){
  const cafe=categoryItems.find(item=>item.id==='CI1006');
  home=home.replace(/data-category="전체" aria-pressed="true"/,'data-category="전체" aria-pressed="false"')
   .replace(/<button[^>]*data-category="일식"[\s\S]*?<\/button>/,`<button type="button" class="home-category v2-home-category-selected" data-category="${e(cafe.name)}" aria-pressed="true"><img src="${e(cafe.image)}" width="22" height="22" alt=""><span>${e(cafe.name)}</span></button>`)
   .replace(/<button[^>]*class="home-store-pin"[\s\S]*?<\/button>/g,pin=>pin.includes('home-art-coffee')?pin.replace(/<span class="home-art home-art-coffee"[\s\S]*?<\/span>/,`<img class="v2-home-cafe-pin" src="${e(cafePin)}" width="40" height="50" alt="">`):'');
 }
 home=home.replace(/<button\b/g,'<button inert').replace(/<input\b/g,'<input readonly inert');
 return `<div class="v2-home-category-frame" data-home-category-state="${state}" aria-label="${e(states.find(([id])=>id===state)[1])}">${state==='open'?`<div class="v2-home-category-backdrop" inert aria-hidden="true">${home}</div><div class="v2-home-category-overlay"><div class="v2-home-category-scrim" aria-hidden="true"></div>${sheet()}</div>`:home}</div>`;
}
const styles=['/screens/my-info-3d-test/styles.css','/screens/my-info-3d-test/home.css','/v2/home/screen.css','/v2/components/bottom-navigation.css','/v2/components/sheet.css','/v2/components/chips.css','/v2/components/icon-button.css','/v2/home/category.css'];
function example([state,title,copy]){
 return `<figure class="v2-home-search-example"><figcaption><h3>${e(title)}</h3><p>${e(copy)}</p></figcaption><div class="v2-home-search-host v2-home-category-host"><template data-category-template>${styles.map(href=>`<link rel="stylesheet" href="${href}">`).join('')}${renderHomeCategoryScreen({state})}</template></div></figure>`;
}
export function renderHomeCategoryReview(){
 return `<section id="category" data-review-screen hidden aria-labelledby="category-title"><h2 id="category-title">업종 선택</h2><p class="v2-intro">지도에서 탐색할 업종을 선택하는 화면입니다. 단일 선택 후 지도로 돌아오는 기존 흐름을 표현하며 실제 필터·닫기는 실행하지 않습니다.</p>${example(states[0])}<details class="v2-home-search-extra v2-home-category-extra"><summary>선택 후 비교 · 1개</summary>${example(states[1])}</details></section>`;
}
export function setupHomeCategoryReview(root){
 const section=root.querySelector('#category');if(!section)return;
 const extra=section.querySelector('details');
 const mount=hosts=>{
  for(const host of hosts){
   if(host.shadowRoot)continue;
   const template=host.querySelector('template'),shadow=host.attachShadow({mode:'open'});
   shadow.append(template.content.cloneNode(true));template.remove();
   shadow.querySelector('form').addEventListener('submit',event=>event.preventDefault());
   const rail=shadow.querySelector('.home-categories'),more=rail.querySelector('.home-category-more');
   const row=document.createElement('div');row.className='v2-home-category-row';rail.before(row);row.append(rail,more);
   if(shadow.querySelector('[data-home-category-state="selected"]')){
    rail.setAttribute('role','region');rail.setAttribute('tabindex','0');
    const reveal=()=>{if(rail.clientWidth)rail.scrollTo({left:rail.scrollWidth,behavior:'instant'});};
    new ResizeObserver(reveal).observe(rail);
    const links=[...shadow.querySelectorAll('link')];
    Promise.all(links.map(link=>link.sheet?Promise.resolve():new Promise(resolve=>{link.addEventListener('load',resolve,{once:true});link.addEventListener('error',resolve,{once:true});}))).then(()=>document.fonts.ready).then(reveal);
   }
  }
 };
 const activate=()=>{if(section.hidden)return;mount([section.querySelector('.v2-home-category-host')]);if(extra.open)mount(extra.querySelectorAll('.v2-home-category-host'));};
 new MutationObserver(activate).observe(section,{attributes:true,attributeFilter:['hidden']});
 extra.addEventListener('toggle',activate);activate();
}
