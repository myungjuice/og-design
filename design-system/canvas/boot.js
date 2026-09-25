import {activeCanvas,navigateCanvas} from './session.mjs';
import {canvases} from './catalog.mjs';
const selected=canvases.find(c=>c.id===activeCanvas);
const switcher=document.createElement('div');switcher.className='canvas-switcher';
switcher.innerHTML='<p class="aside-label">캔버스</p>'+canvases.map(c=>'<a href="?canvas='+c.id+'"'+(c.id===activeCanvas?' aria-current="page"':'')+'>'+c.title+'</a>').join('');
document.querySelector('aside').prepend(switcher);
const mobile=document.createElement('select');mobile.className='canvas-select';mobile.setAttribute('aria-label','캔버스 선택');mobile.innerHTML=canvases.map(c=>'<option value="'+c.id+'">'+c.title+'</option>').join('');mobile.value=activeCanvas;mobile.onchange=()=>navigateCanvas(mobile.value);document.querySelector('.toolbar').append(mobile);
document.querySelector('aside > .aside-label').textContent=selected.title;
document.querySelector('footer span').textContent='열람 전용 · '+selected.title;
document.title=selected.title+' · 오지플랫폼 디자인 시안';
if(activeCanvas!=='foundations'){
 document.querySelectorAll('#world > .board').forEach(n=>n.remove());
 document.querySelector('aside nav').replaceChildren();document.querySelector('#board-picker').replaceChildren();
 document.querySelector('.aside-note')?.remove();document.querySelector('aside .source')?.remove();
}
try{
 const files=activeCanvas==='foundations'?['rules','foundations']:activeCanvas==='components'?['buttons','inputs','selection','tabs-chips','input-variants','search','badges','avatar','surfaces','list-row','section-heading','progress','loading','feedback','help','quantity','sheet','dialog','snackbar','date-time','attachments','static-specimens']:[];
 for(const file of files)await import('./'+file+'.js?v='+(file==='static-specimens'?'20260919-partitions':'20260918-reuse'));
 if(activeCanvas==='foundations'){
 document.querySelector('#motion-toggle')?.remove();const motion=document.querySelector('#motion-sample');motion?.classList.add('is-open');motion?.setAttribute('aria-hidden','false');
}
 if(files.length)await import('./board-prompts.js?v=20260918-reuse');
 await import('./area-layout.js?v=20260925-barcode');
}catch(error){console.error(error);const loading=document.querySelector('#canvas-loading');loading.textContent='캔버스를 불러오지 못했습니다. 새로고침해 주세요.';loading.setAttribute('role','alert');}
