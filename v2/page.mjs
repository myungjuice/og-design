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
