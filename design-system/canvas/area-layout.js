import {activeCanvas} from './session.mjs';
import {canvases} from './catalog.mjs';
import {initializeReview} from './review.js?v=20260920-art-options';
import {fit,focusBoard,focusReview,refreshBoardBounds,restoreView} from './canvas.js?v=20260919-partitions';
const area=document.querySelector('#world');
const pageGrid=['explore','store','my-info','my-land'].includes(activeCanvas);
let pages=[],region,comparisons=[],comparisonRegion;
if(activeCanvas==='my-info'){
 const screens=await import('./screens.js?v=20260919-partitions');pages=screens.screenPages;region=screens.screenRegion;
 const variants=await import('./mileage-variants.js?v=20260919-partitions');comparisons=variants.comparisonPages;comparisonRegion=variants.comparisonRegion;
}else if(activeCanvas==='my-land'){
 const land=await import('./my-land.js?v=20260920-art-options');pages=land.myLandPages;region=land.myLandRegion;
}else if(['explore','store'].includes(activeCanvas)){
 const home=await import('./home.js?v=20260920-art-options');pages=home.homePages;region=home.homeRegion;
}else{
 pages=[...area.querySelectorAll('.board')];
 region=document.createElement('section');region.id=activeCanvas==='foundations'?'foundation-region':'component-region';region.className='system-region';
 region.innerHTML='<header class="system-area-heading"><h2>'+canvases.find(c=>c.id===activeCanvas).title+'</h2></header>';area.prepend(region);
}
function arrange(){
 const columns=activeCanvas==='components'?7:activeCanvas==='my-land'?8:4;
 const bottoms=Array(columns).fill(136);
 region.style.left='0px';region.style.top='0px';
 // Hallmark: preserve page contents and reading order; align the tops of each row.
 if(pageGrid){
  let top=136;
  for(let i=0;i<pages.length;i+=columns){
   const row=pages.slice(i,i+columns);
   row.forEach((page,col)=>{page.style.left=(48+col*808)+'px';page.style.top=top+'px';});
   top+=Math.max(...row.map(page=>page.offsetHeight))+40;
  }
  bottoms.fill(top);
 }else{
  const ordered=[...pages].sort((a,b)=>b.offsetHeight-a.offsetHeight);
  for(const page of ordered){const col=bottoms.indexOf(Math.min(...bottoms));page.style.left=(48+col*808)+'px';page.style.top=bottoms[col]+'px';bottoms[col]+=page.offsetHeight+40;}
 }
 const right=Math.max(...pages.map(p=>p.offsetLeft+p.offsetWidth))+48;
 const bottom=Math.max(...bottoms)+8;
 region.style.width=right+'px';region.style.height=bottom+'px';
 let comparisonBottom=0;
 if(comparisonRegion){
  comparisonRegion.style.left='-1536px';comparisonRegion.style.top='0px';comparisonRegion.style.width='1488px';
  comparisons.forEach((p,i)=>{p.style.left=(-1488+i*464)+'px';p.style.top='136px';});
  comparisonBottom=184+Math.max(...comparisons.map(p=>p.offsetHeight));comparisonRegion.style.height=comparisonBottom+'px';
 }
 area.dataset.minX=comparisonRegion?'-1536':'0';area.style.width=right+'px';area.style.height=Math.max(bottom,comparisonBottom)+'px';
 refreshBoardBounds();
}
let pending=0;
const observer=new ResizeObserver(()=>{cancelAnimationFrame(pending);pending=requestAnimationFrame(arrange);});
[...pages,...comparisons].forEach(p=>observer.observe(p));
const initialize=async()=>{
 await document.fonts.ready;initializeReview();
 await new Promise(requestAnimationFrame);arrange();
 let sameLayout=!pageGrid;
 const layoutKey='og-design:canvas-layout:'+activeCanvas;
 try{if(pageGrid)sameLayout=localStorage.getItem(layoutKey)==='main-pages-v2';}catch{}
 const restored=restoreView();
 if(!restored||!sameLayout){
  const id=location.hash.slice(1),target=document.getElementById(id);
  if(target?.matches('.screen-page,.board,.mileage-variant-page'))focusBoard(id);
  else if(target)focusReview(id);else fit();
 }
 try{if(pageGrid)localStorage.setItem(layoutKey,'main-pages-v2');}catch{}
 await new Promise(requestAnimationFrame);
 document.querySelector('#viewport').setAttribute('aria-busy','false');document.querySelector('#canvas-loading').hidden=true;
};
await initialize();
