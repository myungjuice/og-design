import {fit} from './canvas.js?v=20260918-reuse';
/* Independent foundation and component boundaries; board offsets remain canvas-relative. */
{
 const area=document.querySelector('#world');
 const makeRegion=(id,title,copy)=>{
  const region=document.createElement('section');region.id=id;region.className='system-region';
  region.setAttribute('aria-label',title);
  region.innerHTML='<header class="system-area-heading"><h2>'+title+'</h2><p>'+copy+'</p></header>';
  area.prepend(region);return region;
 };
 const foundations=makeRegion('foundation-region','기본 스타일','오지고랜드 디자인시스템');
 const components=makeRegion('component-region','컴포넌트','공통 UI · 상태별 예시');
 const boards=[...area.querySelectorAll('.board')];
 function arrange(){
  const foundationBoards=boards.filter(b=>!['buttons','inputs','selection','tabs-chips','search','badges','avatar','surfaces','list-row','section-heading','progress','loading','feedback','help','quantity','sheet','dialogs','snackbar','date-time','attachments'].includes(b.id));
  const componentBoards=boards.filter(b=>['buttons','inputs','selection','tabs-chips','search','badges','avatar','surfaces','list-row','section-heading','progress','loading','feedback','help','quantity','sheet','dialogs','snackbar','date-time','attachments'].includes(b.id));
  const bottoms=[136,136,136,136];
  for(const board of [...foundationBoards].sort((a,b)=>b.offsetHeight-a.offsetHeight)){
   const column=bottoms.indexOf(Math.min(...bottoms));
   board.style.left=(48+column*808)+'px';board.style.top=bottoms[column]+'px';
   bottoms[column]+=board.offsetHeight+40;
  }
  const foundationHeight=Math.max(...bottoms)+8;
  const componentBottoms=[136,136,136,136,136,136,136];
  for(const board of [...componentBoards].sort((a,b)=>b.offsetHeight-a.offsetHeight)){
   const column=componentBottoms.indexOf(Math.min(...componentBottoms));
   board.style.left=(3432+column*808)+'px';board.style.top=componentBottoms[column]+'px';
   componentBottoms[column]+=board.offsetHeight+40;
  }
  const componentBottom=Math.max(...componentBottoms);
  // Derive region bounds from the same positioned boards; CSS cannot lag behind column changes.
  const right=items=>Math.max(...items.map(b=>b.offsetLeft+b.offsetWidth))+48;
  foundations.style.width=(right(foundationBoards)-foundations.offsetLeft)+'px';
  components.style.width=(right(componentBoards)-components.offsetLeft)+'px';
  area.style.width=Math.max(right(foundationBoards),right(componentBoards))+'px';
  foundations.style.height=foundationHeight+'px';
  components.style.height=(componentBottom+8)+'px';
  area.style.height=Math.max(foundationHeight,componentBottom+8)+'px';
 }
 let pending=0;
 const observer=new ResizeObserver(()=>{cancelAnimationFrame(pending);pending=requestAnimationFrame(arrange);});
 boards.forEach(board=>observer.observe(board));
 arrange();
 window.addEventListener('load',async()=>{await document.fonts.ready;arrange();fit();},{once:true});
}
