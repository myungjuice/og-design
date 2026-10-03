import {componentItems} from './catalog.mjs';
export function setupComponentExplorer(root){
 const sections=[...root.querySelectorAll('.v2-component-section')];
 const links=[...root.querySelectorAll('[data-component-link]')];
 const search=root.querySelector('#component-filter');
 const picker=root.querySelector('#component-picker');
 const status=root.querySelector('.v2-component-search-status');
 const menu=root.querySelector('.v2-menu');
 const homeStatus=root.querySelector('.v2-home-component-status');
 for(const comparison of root.querySelectorAll('.v2-state-comparison'))comparison.open=false;
 root.querySelector('.v2-skip').addEventListener('click',event=>{
  if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  event.preventDefault();
  const main=root.querySelector('main');main.focus({preventScroll:true});main.scrollIntoView({block:'start',behavior:'instant'});
 });
 const revealCurrentLink=()=>{
  const link=links.find(link=>link.hasAttribute('aria-current')&&!link.hidden);
  if(!link)return;
  const nav=link.closest('nav'),item=link.getBoundingClientRect(),view=nav.getBoundingClientRect();
  if(!view.height)return;
  if(item.bottom>view.bottom)nav.scrollTop+=item.bottom-view.bottom;
  else if(item.top<view.top)nav.scrollTop+=item.top-view.top;
 };
 const select=(requested,{write=false,fromMenu=false}={})=>{
  const id=componentItems.some(item=>item.id===requested)?requested:'primary';
  const selected=sections.find(section=>section.id===id);
  for(const section of sections)section.hidden=section!==selected;
  for(const link of links){
   if(link.dataset.componentLink===id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');
  }
  picker.value=id;
  revealCurrentLink();
  homeStatus.hidden=!['search','categories','navigation'].includes(id);
  if(write&&location.hash!=='#'+id)history.pushState(null,'','#'+id);
  if(fromMenu&&!window.matchMedia('(min-width:768px)').matches){
   menu.open=false;
   selected.querySelector('h2').focus({preventScroll:true});
  }
  if(write)root.querySelector('main').scrollIntoView({block:'start',behavior:'instant'});
 };
 const sync=()=>{
  let id='';try{id=decodeURIComponent(location.hash.slice(1));}catch{}
  select(id);
 };
 const filter=()=>{
  const query=search.value.trim().replace(/\s+/g,' ').toLocaleLowerCase();
  let count=0;
  for(const link of links){
   link.hidden=!link.textContent.toLocaleLowerCase().includes(query);
   if(!link.hidden)count++;
  }
  for(const group of root.querySelectorAll('[data-component-group]'))group.hidden=![...group.querySelectorAll('a')].some(link=>!link.hidden);
  status.hidden=!query;
  status.textContent=count?`${count}개 항목`:'검색 결과가 없습니다. 다른 이름을 검색하거나 검색을 지워보세요.';
  revealCurrentLink();
 };
 search.addEventListener('input',filter);
 const clear=()=>{search.value='';filter();search.focus();};
 root.querySelector('[data-clear-component-filter]').addEventListener('click',clear);
 search.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();event.stopPropagation();clear();}});
 for(const link of links)link.addEventListener('click',event=>{
  if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  event.preventDefault();select(link.dataset.componentLink,{write:true,fromMenu:true});
 });
 picker.addEventListener('change',()=>select(picker.value,{write:true}));
 for(const section of sections)section.querySelector('h2').tabIndex=-1;
 window.addEventListener('hashchange',sync);
 window.addEventListener('popstate',sync);
 sync();
}
