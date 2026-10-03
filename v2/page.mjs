import {renderWorkspace} from './render.mjs';
export function setupResponsiveMenu(root) {
 const menu=root.querySelector('.v2-menu');
 const summary=menu.querySelector('summary');
 const desktop=window.matchMedia('(min-width: 768px)');
 const sync=()=>{
  if(!desktop.matches&&menu.contains(document.activeElement))summary.focus();
  menu.open=desktop.matches;
 };
 sync();
 desktop.addEventListener('change',sync);
 menu.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&!desktop.matches&&menu.open){
   event.preventDefault();summary.focus();menu.open=false;
  }
 });
}
const root=document.querySelector('#v2-root');
root.innerHTML=renderWorkspace({pageId:document.body.dataset.page});
setupResponsiveMenu(root);
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
