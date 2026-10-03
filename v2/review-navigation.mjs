import {reviewGroups} from './subnavigation.mjs';
export function setupReviewNavigation(root,pageId){
 const groups=reviewGroups(pageId).filter(group=>group.items.some(item=>!item.pending));
 const sections=[...root.querySelectorAll('.v2-component-section,[data-foundation],[data-review-screen]')];
 const links=[...root.querySelectorAll('[data-view-link]')];
 const groupLinks=[...root.querySelectorAll('[data-group-link]')];
 const search=root.querySelector('#review-filter'),picker=root.querySelector('#review-picker');
 const status=root.querySelector('.v2-subnav-status'),menu=root.querySelector('.v2-submenu');
 const main=root.querySelector('main'),homeStatus=root.querySelector('.v2-home-component-status');
 for(const comparison of root.querySelectorAll('.v2-state-comparison'))comparison.open=false;
 for(const section of sections)(section.querySelector('h2')||section).tabIndex=-1;
 root.querySelector('.v2-skip').addEventListener('click',event=>{
  if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  event.preventDefault();main.focus({preventScroll:true});main.scrollIntoView({block:'start',behavior:'instant'});
 });
 if(!groups.length)return;
 const revealCurrentLink=()=>{
  const link=links.find(link=>link.hasAttribute('aria-current')&&!link.hidden);
  if(!link)return;
  const nav=link.closest('nav'),item=link.getBoundingClientRect(),view=nav.getBoundingClientRect();
  if(!view.height)return;
  if(item.bottom>view.bottom)nav.scrollTop+=item.bottom-view.bottom;
  else if(item.top<view.top)nav.scrollTop+=item.top-view.top;
 };
 const select=(requested,{write=false,fromMenu=false,scroll=false}={})=>{
  const group=groups.find(group=>requested==='group-'+group.id||group.items.some(item=>!item.pending&&item.id===requested))||groups[0];
  const ready=group.items.filter(item=>!item.pending);
  const id=ready.some(item=>item.id===requested)?requested:ready[0].id;
  const selected=sections.find(section=>section.id===id);
  for(const section of sections)section.hidden=!ready.some(item=>item.id===section.id);
  for(const link of links){
   if(link.dataset.viewLink===id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');
  }
  for(const link of groupLinks){
   if(link.dataset.groupLink===group.id)link.setAttribute('aria-current','true');else link.removeAttribute('aria-current');
  }
  if(picker)picker.value=group.id;
  revealCurrentLink();
  if(homeStatus)homeStatus.hidden=!ready.some(item=>['search','categories','navigation'].includes(item.id));
  if(write&&location.hash!=='#'+requested)history.pushState(null,'','#'+requested);
  if(fromMenu&&!window.matchMedia('(min-width:1024px)').matches){
   menu.open=false;(selected?.querySelector('h2')||selected||main).focus({preventScroll:true});
  }
  if(scroll){
   const target=requested.startsWith('group-')?main:selected||main;
   target.scrollIntoView({block:'start',behavior:'instant'});
  }
 };
 const sync=()=>{
  let id='';try{id=decodeURIComponent(location.hash.slice(1));}catch{}
  select(id,{scroll:!!id});
 };
 if(search){
  const filter=()=>{
   const query=search.value.trim().replace(/\s+/g,' ').toLocaleLowerCase();let count=0;
   for(const group of root.querySelectorAll('[data-review-group]')){
    const groupMatches=(group.querySelector('.v2-group-link,.v2-group-label')?.textContent||'').toLocaleLowerCase().includes(query);
    for(const link of group.querySelectorAll('[data-view-link],.v2-subnav-pending')){
     link.hidden=!groupMatches&&!link.textContent.toLocaleLowerCase().includes(query);if(!link.hidden)count++;
    }
    group.hidden=![...group.querySelectorAll('[data-view-link],.v2-subnav-pending')].some(link=>!link.hidden);
   }
   status.hidden=!query;status.textContent=count?`${count}개 항목`:'검색 결과가 없습니다. 다른 이름을 검색하거나 검색을 지워보세요.';
   revealCurrentLink();
  };
  const clear=()=>{search.value='';filter();search.focus();};
  search.addEventListener('input',filter);
  root.querySelector('[data-clear-review-filter]').addEventListener('click',clear);
  search.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();event.stopPropagation();clear();}});
 }
 for(const link of [...links,...groupLinks])link.addEventListener('click',event=>{
  if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  event.preventDefault();select(link.dataset.viewLink||'group-'+link.dataset.groupLink,{write:true,fromMenu:true,scroll:true});
 });
 picker?.addEventListener('change',()=>select('group-'+picker.value,{write:true,scroll:true}));
 window.addEventListener('hashchange',sync);window.addEventListener('popstate',sync);sync();
}
