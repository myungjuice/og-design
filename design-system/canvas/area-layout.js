import {activeCanvas} from './session.mjs';
import {canvases} from './catalog.mjs';
import {initializeReview} from './review.js?v=20260922-touch2';
import {fit,focusBoard,focusReview,refreshBoardBounds,revealBoardForMeasurement,restoreView} from './canvas.js?v=20260922-touch2';
const area=document.querySelector('#world');
const pageGrid=['explore','store','my-info','my-land','barcode'].includes(activeCanvas);
let pages=[],region,comparisons=[],comparisonRegion;
if(activeCanvas==='my-info'){
 const screens=await import('./screens.js?v=20260922-touch2');pages=screens.screenPages;region=screens.screenRegion;
 const feedback=await import('./my-info-feedback.js?v=20260928');pages.splice(1,0,...feedback.createMyInfoFeedbackPages());
 const variants=await import('./mileage-variants.js?v=20260922-touch2');comparisons=variants.comparisonPages;comparisonRegion=variants.comparisonRegion;
}else if(activeCanvas==='barcode'){
 const barcode=await import('./barcode.js?v=20260925-barcode');pages=barcode.barcodePages;region=barcode.barcodeRegion;
}else if(activeCanvas==='my-land'){
 const land=await import('./my-land.js?v=20260922-touch2');pages=land.myLandPages;region=land.myLandRegion;
}else if(['explore','store'].includes(activeCanvas)){
 const home=await import('./home.js?v=20260926-new-placement');pages=home.homePages;region=home.homeRegion;
}else{
 pages=[...area.querySelectorAll('.board')];
 region=document.createElement('section');region.id=activeCanvas==='foundations'?'foundation-region':'component-region';region.className='system-region';
 region.innerHTML='<header class="system-area-heading"><h2>'+canvases.find(c=>c.id===activeCanvas).title+'</h2></header>';area.prepend(region);
}
const allPages=[...pages,...comparisons],sizes=new Map(),dirty=new Set(allPages);
function arrange(){
 // Measure changed pages only. Never reveal every page on each image/resize event.
 const changed=new Set(dirty);dirty.clear();
 for(const page of changed)revealBoardForMeasurement(page);
 for(const page of changed)sizes.set(page,{width:page.offsetWidth,height:page.offsetHeight});
 const columns=activeCanvas==='components'?7:activeCanvas==='my-land'?8:4;
 const bottoms=Array(columns).fill(136);
 const layout=[];
 const place=(node,left,top)=>layout.push({node,left,top,...sizes.get(node)});
 // Hallmark: preserve page contents and reading order; align the tops of each row.
 if(pageGrid){
  let top=136;
  for(let i=0;i<pages.length;i+=columns){
   const row=pages.slice(i,i+columns);
   row.forEach((page,col)=>place(page,48+col*808,top));
   top+=Math.max(...row.map(page=>sizes.get(page).height))+40;
  }
  bottoms.fill(top);
 }else{
  const ordered=[...pages].sort((a,b)=>sizes.get(b).height-sizes.get(a).height);
  for(const page of ordered){const col=bottoms.indexOf(Math.min(...bottoms));place(page,48+col*808,bottoms[col]);bottoms[col]+=sizes.get(page).height+40;}
 }
 const right=Math.max(...layout.map(p=>p.left+p.width))+48;
 const bottom=Math.max(...bottoms)+8;
 region.style.left='0px';region.style.top='0px';
 region.style.width=right+'px';region.style.height=bottom+'px';
 let comparisonBottom=0;
 if(comparisonRegion){
  comparisonRegion.style.left='-1536px';comparisonRegion.style.top='0px';comparisonRegion.style.width='1488px';
  comparisons.forEach((p,i)=>place(p,-1488+i*464,136));
  comparisonBottom=184+Math.max(...comparisons.map(p=>sizes.get(p).height));comparisonRegion.style.height=comparisonBottom+'px';
 }
 for(const {node,left,top} of layout){node.style.left=left+'px';node.style.top=top+'px';}
 area.dataset.minX=comparisonRegion?'-1536':'0';area.style.width=right+'px';area.style.height=Math.max(bottom,comparisonBottom)+'px';
 refreshBoardBounds(layout,changed);
}
let pending=0,layoutReady=false;
function scheduleArrange(){if(layoutReady&&!pending)pending=requestAnimationFrame(()=>{pending=0;if(dirty.size)arrange();});}
const observer=new ResizeObserver(entries=>{
 for(const entry of entries){
  const box=entry.borderBoxSize[0],old=sizes.get(entry.target);
  if(!old||Math.abs(box.inlineSize-old.width)>.5||Math.abs(box.blockSize-old.height)>.5)dirty.add(entry.target);
 }
 if(dirty.size)scheduleArrange();
});
allPages.forEach(p=>observer.observe(p));
// Images without fixed dimensions can finish loading inside a skipped case.
// Refresh that page before it comes into view, retaining every other page's cache.
area.addEventListener('load',event=>{if(event.target instanceof HTMLImageElement){const page=event.target.closest('.board,.screen-page');if(page&&sizes.has(page)){dirty.add(page);scheduleArrange();}}},true);
const initialize=async()=>{
 await document.fonts.ready;initializeReview();
 await new Promise(requestAnimationFrame);layoutReady=true;arrange();
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
