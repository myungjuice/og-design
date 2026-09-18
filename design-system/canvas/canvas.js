const viewport = document.querySelector('#viewport');
const world = document.querySelector('#world');
const output = document.querySelector('#zoom-value');
let x = 32, y = 32, scale = 1, drag = null;
const rootStyle = getComputedStyle(document.documentElement);
for (const n of [1,2,3,4,5,6,8,10,12,16]) {
 const row = document.createElement('div'); row.className='space-row';
 const label = document.createElement('code'); label.textContent='app-space-'+n+' / '+n*4;
 const bar = document.createElement('i'); bar.style.width='var(--app-space-'+n+')';
 row.append(label,bar); document.querySelector('#spacing').append(row);
}
function render() {
 world.style.transform='translate('+x+'px,'+y+'px) scale('+scale+')';
 output.textContent=Math.round(scale*100)+'%';
 document.querySelector('#minus').disabled=scale<=.05;
 document.querySelector('#plus').disabled=scale>=2;
}
function zoom(next, px=viewport.clientWidth/2, py=viewport.clientHeight/2) {
 next=Math.max(.05,Math.min(2,next));
 x=px-(px-x)*next/scale; y=py-(py-y)*next/scale; scale=next; render();
}
export function fit() {
 scale=Math.min(1,(viewport.clientWidth-48)/world.offsetWidth,(viewport.clientHeight-48)/world.offsetHeight);
 scale=Math.max(.05,scale); x=(viewport.clientWidth-world.offsetWidth*scale)/2; y=24; render();
}
document.querySelector('#plus').onclick=()=>zoom(scale*1.2);
document.querySelector('#minus').onclick=()=>zoom(scale/1.2);
document.querySelector('#actual').onclick=()=>{scale=1;x=32;y=32;render();};
document.querySelector('#fit').onclick=fit;
function focusBoard(id){
 const board=document.getElementById(id);
 scale=Math.min(1,(viewport.clientWidth-48)/board.offsetWidth);
 x=24-board.offsetLeft*scale;y=24-board.offsetTop*scale;render();
 document.querySelector('#board-picker').value=id;
}
for(const button of document.querySelectorAll('[data-board]'))button.onclick=()=>focusBoard(button.dataset.board);
document.querySelector('#board-picker').onchange=e=>focusBoard(e.target.value);
viewport.addEventListener('pointerdown', e=>{
 if(e.button!==0) return;
 const control=e.target.closest('button,input,textarea,select,a,summary,[contenteditable="true"]');
 if(control&&!control.closest('[inert]'))return;
 e.preventDefault();
 drag={id:e.pointerId,x:e.clientX,y:e.clientY};viewport.setPointerCapture(e.pointerId);viewport.classList.add('dragging');
});
viewport.addEventListener('pointermove',e=>{
 if(!drag || drag.id!==e.pointerId)return;
 x+=e.clientX-drag.x;y+=e.clientY-drag.y;drag.x=e.clientX;drag.y=e.clientY;render();
});
function end(){drag=null;viewport.classList.remove('dragging');}
viewport.addEventListener('pointerup',end);viewport.addEventListener('pointercancel',end);
viewport.addEventListener('wheel',e=>{
 e.preventDefault();
 if(e.ctrlKey||e.metaKey){const rect=viewport.getBoundingClientRect();zoom(scale*Math.exp(-e.deltaY*.008),e.clientX-rect.left,e.clientY-rect.top);}
 else{x-=e.deltaX;y-=e.deltaY;render();}
},{passive:false});
viewport.addEventListener('keydown',e=>{
 if(e.target.closest('button,input,textarea,select,a'))return;
 const deltas={ArrowLeft:[40,0],ArrowRight:[-40,0],ArrowUp:[0,40],ArrowDown:[0,-40]};
 if(deltas[e.key]){e.preventDefault();x+=deltas[e.key][0];y+=deltas[e.key][1];render();}
 if(e.key==='+'||e.key==='='){e.preventDefault();zoom(scale*1.2);}
 if(e.key==='-'){e.preventDefault();zoom(scale/1.2);}
});
focusBoard('color');
