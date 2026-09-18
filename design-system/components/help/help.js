/* Anchored top-layer help; canvas callers may provide clipped bounds and a transformed ancestor. */
window.ogAttachHelp=function(trigger,panel,{tooltip=false,boundsElement=null,observeElement=null}={}){
 let showTimer,hideTimer,frame;
 const opened=()=>panel.matches(':popover-open');
 const position=()=>{
  if(!opened())return;
  const r=trigger.getBoundingClientRect(),clip=boundsElement?.getBoundingClientRect();
  const left=Math.max(0,clip?.left??0),right=Math.min(innerWidth,clip?.right??innerWidth),top=Math.max(0,clip?.top??0),bottom=Math.min(innerHeight,clip?.bottom??innerHeight);
  if(r.bottom<=top||r.top>=bottom||r.right<=left||r.left>=right){hide();return;}
  const gap=8,inset=12;
  panel.style.maxWidth=Math.max(0,right-left-inset*2)+'px';panel.style.maxHeight=Math.max(0,bottom-top-inset*2)+'px';
  const size=panel.getBoundingClientRect();let y=r.bottom+gap;
  if(y+size.height>bottom-inset&&r.top-gap-size.height>=top+inset)y=r.top-gap-size.height;
  panel.style.left=Math.max(left+inset,Math.min(r.left,right-inset-size.width))+'px';
  panel.style.top=Math.max(top+inset,Math.min(y,bottom-inset-size.height))+'px';
 };
 function hide(){clearTimeout(showTimer);clearTimeout(hideTimer);if(opened())panel.hidePopover();if(!tooltip)trigger.setAttribute('aria-expanded','false');}
 function show(){clearTimeout(showTimer);clearTimeout(hideTimer);if(trigger.disabled)return;if(!opened())panel.showPopover();if(!tooltip)trigger.setAttribute('aria-expanded','true');position();}
 const schedule=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(position);};
 if(tooltip){
  trigger.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){clearTimeout(hideTimer);showTimer=setTimeout(show,800);}});
  const delayedHide=()=>{clearTimeout(showTimer);hideTimer=setTimeout(()=>{if(!trigger.matches(':hover')&&!panel.matches(':hover')&&document.activeElement!==trigger)hide();},160);};
  trigger.addEventListener('pointerleave',delayedHide);trigger.addEventListener('blur',delayedHide);
  trigger.addEventListener('focus',show);trigger.addEventListener('click',show);
  panel.addEventListener('pointerenter',()=>clearTimeout(hideTimer));panel.addEventListener('pointerleave',delayedHide);
 }else{
  trigger.addEventListener('click',()=>{if(opened())hide();else{show();panel.querySelector('[data-help-close]')?.focus({preventScroll:true});}});
  panel.querySelector('[data-help-close]')?.addEventListener('click',()=>{hide();trigger.focus({preventScroll:true});});
 }
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&opened()){e.preventDefault();e.stopPropagation();const restore=!tooltip&&panel.contains(document.activeElement);hide();if(restore)trigger.focus({preventScroll:true});}},true);
 panel.addEventListener('toggle',()=>{if(!tooltip)trigger.setAttribute('aria-expanded',String(opened()));});
 window.addEventListener('resize',schedule);window.addEventListener('scroll',schedule,true);
 if(observeElement)new MutationObserver(schedule).observe(observeElement,{attributes:true,attributeFilter:['style']});
 const observer=new ResizeObserver(schedule);observer.observe(trigger);observer.observe(panel);
 return {show,hide};
};
