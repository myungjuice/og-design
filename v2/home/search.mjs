import {searchScreen,searchStates} from '../../design-system/pages/home/search.mjs';
import {renderHomeTest} from '../../screens/my-info-3d-test/home.mjs';
import {renderHomeSearch} from '../../screens/my-info-3d-test/home-controls.mjs';
import {escapeHTML as e} from '../../design-system/components/core.mjs';

const line=(path)=>`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${path}"/></svg>`;
const close=line('M6 6l12 12M18 6 6 18');
// Ordinary line icons sit on the same quiet material as reservation empty states.
function emptyPanel(state){
 const history=state==='empty-history';
 const art=`<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${history?'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>':'<circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/>'}</svg>`;
 return `<div class="og-home-search-panel v2-search-empty-panel" role="region" tabindex="0" aria-label="검색 내용"><div class="v2-search-empty"><div class="v2-search-empty-visual v2-empty-icon ${history?'is-history':'is-search'}" aria-hidden="true">${art}</div><h3>${history?'최근 검색 기록이 없어요.':'검색 결과가 없어요.'}</h3>${history?'': '<p>다른 매장명이나 지역으로 검색해 주세요.</p>'}</div></div>`;
}
const reviewSearchStates=searchStates.map(([state,title,copy])=>[state,title,['empty-history','empty-results'].includes(state)?'기본 아이콘과 한글 문구로 빈 상태를 안내합니다.':copy]);
// Extract only the trusted source panel; do not carry over its old map or controls.
function sourcePanel(state){
 if(['empty-history','empty-results'].includes(state))return emptyPanel(state);
 const html=searchScreen({state}),start=html.indexOf('<div class="og-home-search-panel">');
 if(start<0)throw new Error('Missing source search panel: '+state);
 let depth=0,end=-1;
 for(const tag of html.slice(start).matchAll(/<\/?div\b[^>]*>/g)){
  depth+=tag[0].startsWith('</')?-1:1;
  if(depth===0){end=start+tag.index+tag[0].length;break;}
 }
 if(end<0)throw new Error('Unclosed source search panel: '+state);
 return html.slice(start,end)
  .replace('class="og-home-search-panel"','class="og-home-search-panel" role="region" tabindex="0" aria-label="검색 내용"')
  .replaceAll('<h4>','<h3>').replaceAll('</h4>','</h3>')
  .replace(/<span[^>]*class="material-icons"[^>]*>(close|expand_less)<\/span>/g,(_,name)=>name==='close'?close:line('m6 15 6-6 6 6'))
  .replace(/<button\b/g,'<button inert');
}
function frame(state,title){
 const query=['history','empty-history'].includes(state)?'':'성수';
 let search=renderHomeSearch({assetBase:'/screens/my-info-3d-test/media/figma/',id:'search-'+state});
 search=search.replace('value=""',`value="${query}"`).replace(/<input\b/g,'<input readonly inert')
  .replace(/<button[\s\S]*?<\/button>/,query?`<button inert type="button" class="home-search-submit" aria-label="검색어 지우기">${close}</button>`:'<span class="v2-home-search-spacer" aria-hidden="true"></span>');
 return `<div class="v2-home-search-frame" data-search-state="${state}" aria-label="${e(title)}">
 <div class="v2-home-search-backdrop" inert aria-hidden="true">${renderHomeTest({assetBase:'/screens/my-info-3d-test/media/figma/'})}</div>
 <div class="v2-home-search-overlay"><div class="v2-home-search-header"><button inert type="button" class="v2-home-search-back" aria-label="검색 닫기">${line('M19 12H5m7-7-7 7 7 7')}</button>${search}</div>${sourcePanel(state)}</div></div>`;
}
const styles=['/screens/my-info-3d-test/styles.css','/screens/my-info-3d-test/home.css','/v2/components/screen.css','/v2/components/bottom-navigation.css','/v2/components/empty-icon.css','/v2/home/search.css'];
function example([state,title,copy]){
 return `<figure class="v2-home-search-example"><figcaption><h3>${e(title)}</h3><p>${e(copy)}</p></figcaption><div class="v2-home-search-host"><template data-search-template>${styles.map(href=>`<link rel="stylesheet" href="${href}">`).join('')}${frame(state,title)}</template></div></figure>`;
}
export function renderHomeSearchReview(){
 return `<section id="search" data-review-screen hidden aria-labelledby="search-title"><h2 id="search-title">매장 검색·검색 결과</h2><p class="v2-intro">지도 위 검색 패널에서 최근 검색어와 매장·지역 결과를 확인하는 화면입니다. 검색과 항목 선택은 실행하지 않는 시안입니다.</p>${example(reviewSearchStates[0])}<details class="v2-home-search-extra"><summary>다른 상태 비교 · 5개</summary><div class="v2-home-search-grid">${reviewSearchStates.slice(1).map(example).join('')}</div></details></section>`;
}
export function setupHomeSearchReview(root){
 const section=root.querySelector('#search');if(!section)return;
 const extra=section.querySelector('details');
 const mount=hosts=>{
  for(const host of hosts){
   if(host.shadowRoot)continue;
   const template=host.querySelector('template'),shadow=host.attachShadow({mode:'open'});
   shadow.append(template.content.cloneNode(true));template.remove();
   shadow.querySelector('form').addEventListener('submit',event=>event.preventDefault());
  }
 };
 const mountExtra=()=>mount(extra.querySelectorAll('.v2-home-search-host'));
 const activate=()=>{if(section.hidden)return;mount([section.querySelector('.v2-home-search-host')]);if(extra.open)mountExtra();};
 new MutationObserver(activate).observe(section,{attributes:true,attributeFilter:['hidden']});
 extra.addEventListener('toggle',()=>{if(extra.open&&!section.hidden)mountExtra();});
 activate();
}
