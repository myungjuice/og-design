// Native top-layer dialogs supply background inertness; this controller owns
// scroll restoration and the matching pointer gesture used for backdrop close.
const controllers=new WeakMap();
export function setupOverlay(dialog,{initial,onClose=()=>{}}={}){
 if(controllers.has(dialog))return controllers.get(dialog);
 const doc=dialog.ownerDocument,win=doc.defaultView;
 let session=null,outside=false,handledCloses=0;
 const resize=()=>{
  dialog.style.setProperty('--v2-overlay-height',(win.visualViewport?.height||win.innerHeight)+'px');
  dialog.style.setProperty('--v2-overlay-bottom',Math.max(0,win.innerHeight-(win.visualViewport?.height||win.innerHeight)-(win.visualViewport?.offsetTop||0))+'px');
 };
 const finish=(value)=>{
  const closing=session;if(!closing)return;session=null;outside=false;
  doc.body.style.overflow=closing.overflow;
  win.visualViewport?.removeEventListener('resize',resize);win.visualViewport?.removeEventListener('scroll',resize);
  onClose(value);if(closing.opener?.isConnected&&!dialog.open)closing.opener.focus({preventScroll:true});
 };
 const close=(value='cancel')=>{if(dialog.open){handledCloses++;dialog.close(value);finish(value);}};
 const api={open(trigger){
  if(dialog.open)return;
  // An external native close may be queued; settle its old session first.
  if(session){handledCloses++;finish(dialog.returnValue);}
  session={opener:trigger||doc.activeElement,overflow:doc.body.style.overflow};
  dialog.showModal();doc.body.style.overflow='hidden';resize();
  win.visualViewport?.addEventListener('resize',resize);win.visualViewport?.addEventListener('scroll',resize);
  const target=typeof initial==='function'?initial():dialog.querySelector(initial||'button:not(:disabled),input:not(:disabled),select:not(:disabled)');
  (target||dialog).focus({preventScroll:true});
 },close};
 dialog.addEventListener('cancel',event=>{event.preventDefault();close();});
 dialog.addEventListener('close',()=>{
  if(handledCloses){handledCloses--;return;}finish(dialog.returnValue);
 });
 const isOutside=event=>{const r=dialog.getBoundingClientRect();return event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom;};
 dialog.addEventListener('pointerdown',event=>{outside=event.target===dialog&&isOutside(event);});
 dialog.addEventListener('click',event=>{if(outside&&event.target===dialog&&isOutside(event))close();outside=false;});
 dialog.addEventListener('keydown',event=>{
  if(event.key!=='Tab')return;
  const controls=[...dialog.querySelectorAll('button,input,select,textarea,a[href],[tabindex="0"]')].filter(node=>!node.disabled&&node.tabIndex>=0&&node.getClientRects().length);
  if(!controls.length){event.preventDefault();dialog.focus();return;}
  if(event.shiftKey&&doc.activeElement===controls[0]){event.preventDefault();controls.at(-1).focus();}
  else if(!event.shiftKey&&doc.activeElement===controls.at(-1)){event.preventDefault();controls[0].focus();}
 });
 controllers.set(dialog,api);return api;
}
