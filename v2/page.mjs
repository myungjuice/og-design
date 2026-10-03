import {renderWorkspace} from './render.mjs';
import {setupReviewNavigation} from './review-navigation.mjs';
export function setupResponsiveMenu(root) {
 const desktop=window.matchMedia('(min-width: 1024px)');
 const picker=root.querySelector('#review-picker');
 const responsiveControls=[...root.querySelectorAll('.v2-menu > summary,.v2-submenu > summary'),picker].filter(Boolean);
 let focusedControl=document.activeElement;
 root.addEventListener('focusin',event=>{focusedControl=event.target;});
 root.addEventListener('focusout',event=>{
  // Hiding a mobile control can blur it before the media-query event fires.
  if(!event.relatedTarget&&desktop.matches&&responsiveControls.includes(event.target))return;
  focusedControl=event.relatedTarget;
 });
 const focusDestination=menu=>{
  const visible=[...menu.querySelectorAll('a')].filter(link=>link.getClientRects().length);
  const current=visible.find(link=>link.getAttribute('aria-current')==='location')||visible.find(link=>link.getAttribute('aria-current')==='page');
  (current||visible[0]||root.querySelector('main')).focus({preventScroll:true});
 };
 for(const menu of root.querySelectorAll('.v2-menu,.v2-submenu')){
  const summary=menu.querySelector(':scope > summary');
  const sync=()=>{
   const restore=desktop.matches&&focusedControl===summary;
   if(!desktop.matches&&menu.contains(document.activeElement))summary.focus();
   menu.open=desktop.matches;
   if(restore)focusDestination(menu);
  };
  sync();
  desktop.addEventListener('change',sync);
  menu.addEventListener('keydown',event=>{
   if(event.key==='Escape'&&!desktop.matches&&menu.open){
    event.preventDefault();summary.focus();menu.open=false;
   }
  });
 }
 desktop.addEventListener('change',()=>{
  if(picker&&desktop.matches&&focusedControl===picker){
   focusDestination(root.querySelector('.v2-subnav'));
  }
 });
}
const root=document.querySelector('#v2-root');
root.innerHTML=renderWorkspace({pageId:document.body.dataset.page});
setupResponsiveMenu(root);
if(document.body.dataset.page!=='components')setupReviewNavigation(root,document.body.dataset.page);
if(document.body.dataset.page==='design-system'){
 const {setupColorValues}=await import('./design-system/color-values.mjs');
 setupColorValues(root);
}
if(document.body.dataset.page==='components'){
 const {setupComponentPreview}=await import('./components/preview.mjs');
 setupComponentPreview(root);
}
if(document.body.dataset.page==='my-info'){
 const {setupMyInfoPreview}=await import('./my-info/preview.mjs');
 setupMyInfoPreview(root);
}
if(document.body.dataset.page==='barcode'){
 const {setupBarcodePreview}=await import('./barcode/preview.mjs');
 setupBarcodePreview(root);
}
if(document.body.dataset.page==='home'){
 const {setupHomePreview}=await import('./home/preview.mjs');
 setupHomePreview(root);
}
