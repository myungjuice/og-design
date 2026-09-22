import {activeCanvas} from './session.mjs';
import {viewStorageKey as storageKeyForCanvas} from './catalog.mjs';
const viewport = document.querySelector('#viewport');
const world = document.querySelector('#world');
const output = document.querySelector('#zoom-value');
// A sibling hit surface avoids inherited cursor/user-select changes across every board.
const dragLayer=document.createElement('div');dragLayer.id='canvas-drag-layer';dragLayer.hidden=true;dragLayer.setAttribute('aria-hidden','true');viewport.append(dragLayer);
let x = 32, y = 32, scale = 1, drag = null;
const viewStorageKey=storageKeyForCanvas(activeCanvas);
let persistenceReady=false,saveTimer=0;
function saveView(){
 clearTimeout(saveTimer);saveTimer=0;
 if(!persistenceReady)return;
 try{localStorage.setItem(viewStorageKey,JSON.stringify({x,y,scale,hash:location.hash}));}catch{}
}
function queueSave(){if(!persistenceReady)return;clearTimeout(saveTimer);saveTimer=setTimeout(saveView,250);}
export function restoreView(){
 let saved;
 try{saved=JSON.parse(localStorage.getItem(viewStorageKey));}catch{}
 persistenceReady=true;
 if(!saved||![saved.x,saved.y,saved.scale].every(Number.isFinite)||saved.scale<.01||saved.scale>2)return false;
 if(location.hash&&location.hash!==saved.hash)return false;
 x=saved.x;y=saved.y;scale=saved.scale;render();return true;
}
window.addEventListener('pagehide',saveView);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')saveView();});
const minus=document.querySelector('#minus'),plus=document.querySelector('#plus');
let pendingFrame=0,renderedScale=null,boardBounds=[],viewWidth=viewport.clientWidth,viewHeight=viewport.clientHeight;
// Keep layout dimensions intact: only skip painting boards outside the viewport.
function updateVisibility(){
 const margin=320;
 for(const b of boardBounds){
  const hidden=x+(b.left+b.width)*scale < -margin || x+b.left*scale > viewWidth+margin ||
   y+(b.top+b.height)*scale < -margin || y+b.top*scale > viewHeight+margin;
  if(hidden!==b.hidden){b.node.classList.toggle('canvas-offscreen',hidden);b.hidden=hidden;}
 }
}
export function refreshBoardBounds(){
 viewWidth=viewport.clientWidth;viewHeight=viewport.clientHeight;
 const nodes=[...world.querySelectorAll('.board,.screen-page,.mileage-variant-page')];
 // Reveal only for this synchronous measurement pass, before the browser paints.
 // This lets late fonts/images and review controls update the natural board height.
 nodes.forEach(node=>node.classList.remove('canvas-offscreen'));
 boardBounds=nodes.map(node=>{
  const css=getComputedStyle(node);
  const padding=parseFloat(css.paddingTop)+parseFloat(css.paddingBottom);
  const border=parseFloat(css.borderTopWidth)+parseFloat(css.borderBottomWidth);
  const height=parseFloat(css.height);
  return {node,left:node.offsetLeft,top:node.offsetTop,width:node.offsetWidth,height:node.offsetHeight,
   contentHeight:Math.max(0,height-(css.boxSizing==='border-box'?padding+border:0)),hidden:false};
 });
 // Freeze only the skipped content's intrinsic height, never the actual page height.
 for(const b of boardBounds)b.node.style.setProperty('--canvas-content-height',b.contentHeight+'px');
 updateVisibility();
}
new ResizeObserver(()=>{viewWidth=viewport.clientWidth;viewHeight=viewport.clientHeight;scheduleRender();}).observe(viewport);
function scheduleRender(){if(!pendingFrame)pendingFrame=requestAnimationFrame(()=>{pendingFrame=0;render();});}
for (const n of [1,2,3,4,5,6,8,10,12,16]) {
 const row = document.createElement('div'); row.className='space-row';
 const label = document.createElement('code'); label.textContent='app-space-'+n+' / '+n*4;
 const bar = document.createElement('i'); bar.style.width='var(--app-space-'+n+')';
 row.append(label,bar); document.querySelector('#spacing')?.append(row);
}
function render() {
 if(pendingFrame){cancelAnimationFrame(pendingFrame);pendingFrame=0;}
 world.style.transform='translate('+x+'px,'+y+'px) scale('+scale+')';
 if(renderedScale!==scale){
  output.textContent=Math.round(scale*100)+'%';
  minus.disabled=scale<=.01;plus.disabled=scale>=2;renderedScale=scale;
 }
 updateVisibility();queueSave();
}
function zoom(next, px=viewport.clientWidth/2, py=viewport.clientHeight/2, deferred=false) {
 next=Math.max(.01,Math.min(2,next));
 x=px-(px-x)*next/scale; y=py-(py-y)*next/scale; scale=next; if(deferred)scheduleRender();else render();
}
export function fit() {
 const minX=Number(world.dataset.minX||0),width=world.offsetWidth-minX;
 scale=Math.min(1,(viewport.clientWidth-48)/width,(viewport.clientHeight-48)/world.offsetHeight);
 scale=Math.max(.01,scale); x=(viewport.clientWidth-width*scale)/2-minX*scale; y=24; render();
}
document.querySelector('#plus').onclick=()=>zoom(scale*1.2);
document.querySelector('#minus').onclick=()=>zoom(scale/1.2);
document.querySelector('#actual').onclick=()=>{scale=1;x=32;y=32;render();};
document.querySelector('#fit').onclick=fit;
export function focusBoard(id){
 const board=document.getElementById(id);
 scale=Math.min(1,(viewport.clientWidth-48)/board.offsetWidth);
 x=24-board.offsetLeft*scale;y=24-board.offsetTop*scale;render();
 document.querySelector('#board-picker').value=id;
}
export function focusReview(id){
 const target=document.getElementById(id);if(!target)return;
 let left=0,top=0,node=target;
 while(node&&node!==world){left+=node.offsetLeft;top+=node.offsetTop;node=node.offsetParent;}
 scale=Math.max(.01,Math.min(1,(viewport.clientWidth-48)/target.offsetWidth,(viewport.clientHeight-64)/target.offsetHeight));
 x=24-left*scale;y=24-top*scale;render();
 viewport.focus({preventScroll:true});
}
document.querySelector('aside').addEventListener('click',event=>{const button=event.target.closest('[data-board]');if(button)focusBoard(button.dataset.board);});
document.querySelector('#board-picker').onchange=e=>focusBoard(e.target.value);
viewport.addEventListener('pointerdown', e=>{
 if(e.button!==0 || viewport.getAttribute('aria-busy')==='true') return;
 const control=e.target.closest('button,input,textarea,select,a,summary,[contenteditable="true"]');
 if(control&&!control.closest('[inert]'))return;
 e.preventDefault();
 // Promote only while dragging: pan can reuse rasterized pages without a permanent giant layer.
 world.style.willChange='transform';
 drag={id:e.pointerId,x:e.clientX,y:e.clientY};dragLayer.hidden=false;dragLayer.setPointerCapture(e.pointerId);
});
viewport.addEventListener('pointermove',e=>{
 if(!drag || drag.id!==e.pointerId)return;
 x+=e.clientX-drag.x;y+=e.clientY-drag.y;drag.x=e.clientX;drag.y=e.clientY;scheduleRender();
});
function end(){if(!drag)return;const id=drag.id;drag=null;world.style.removeProperty('will-change');if(dragLayer.hasPointerCapture(id))dragLayer.releasePointerCapture(id);dragLayer.hidden=true;}
viewport.addEventListener('pointerup',end);viewport.addEventListener('pointercancel',end);viewport.addEventListener('lostpointercapture',end);
viewport.addEventListener('wheel',e=>{
 e.preventDefault();
 if(e.ctrlKey||e.metaKey){const rect=viewport.getBoundingClientRect();zoom(scale*Math.exp(-e.deltaY*.008),e.clientX-rect.left,e.clientY-rect.top,true);}
 else{x-=e.deltaX;y-=e.deltaY;scheduleRender();}
},{passive:false});
viewport.addEventListener('keydown',e=>{
 if(e.target.closest('button,input,textarea,select,a'))return;
 const deltas={ArrowLeft:[40,0],ArrowRight:[-40,0],ArrowUp:[0,40],ArrowDown:[0,-40]};
 if(deltas[e.key]){e.preventDefault();x+=deltas[e.key][0];y+=deltas[e.key][1];render();}
 if(e.key==='+'||e.key==='='){e.preventDefault();zoom(scale*1.2);}
 if(e.key==='-'){e.preventDefault();zoom(scale/1.2);}
});
