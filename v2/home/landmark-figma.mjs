// Figma 306:3424, retrieved 2026-10-28. Both pins and both crowns are supplied assets.
import {renderApprovedStoreMap} from './store-markers.mjs';
import {figmaHomeStyles} from './figma-home.mjs';
const base='/assets/figma-landmark-20261028/';
const image=(file,cls,width,height=width)=>`<img class="approved-static ${cls}" src="${base+file}" width="${width}" height="${height}" alt="" aria-hidden="true">`;

function neonArtwork(position,width,height,crownStyle='neon'){
 // Match the visible stroke bounds, not the SVG's transparent 40×36 canvas.
 // The unblurred 2.5px stroke occupies x=4.45..35.45, y=5.25..31.65.
 const src=crownStyle==='gold-neon'?'/assets/review-20261029/neon-crown-gold.svg':'/assets/review-20261028/neon-crown.svg';
 return `<span class="landmark-neon-ink landmark-neon-${position}" style="--neon-scale-x:${width/31};--neon-scale-y:${height/26.4}"><img class="approved-static landmark-neon-art" src="${src}" width="40" height="36" alt="" aria-hidden="true"></span>`;
}

export function renderLatestLandmarkMap({crownStyle='solid'}={}){
 const gold=crownStyle==='gold-neon',neon=crownStyle==='neon'||gold;
 const firstCrown=neon?neonArtwork('first',36.1506,29.4796):`<span class="landmark-figma-crown-shadow">${image('be24c.svg','',35.4285,14.76)}</span>${[['67330.svg',31.551,4.0844],['610e6.svg',36.1506,29.4796],['3d817.svg',6.4573,6.4573],['4b933.svg',20.67,3.8758]].map(([file,w,h],i)=>image(file,'landmark-figma-crown-layer layer-'+i,w,h)).join('')}`;
 const secondCrown=neon?neonArtwork('second',38.264,25.012,crownStyle):image('1a885.svg','',38.264,25.012);
 const markers=`<div class="home-map-pins"><span class="landmark-figma-pin landmark-figma-pin-first" role="img" aria-label="랜드마크 매장 핀">${image('ba601.png','',60)}</span>${gold?`<span class="landmark-figma-tilted-crown landmark-gold-crown-first" aria-hidden="true" data-neon-crown="first"><span>${secondCrown}</span></span>`:`<span class="landmark-figma-crown" aria-hidden="true"${neon?' data-neon-crown="first"':''}>${firstCrown}</span>`}<span class="landmark-figma-tilted-crown" aria-hidden="true"${neon?' data-neon-crown="second"':''}><span>${secondCrown}</span></span><span class="landmark-figma-pin landmark-figma-pin-second" role="img" aria-label="랜드마크 매장 핀">${image('ba601.png','',60)}</span></div><div class="home-map-actions">`;
 return renderApprovedStoreMap('best')
  .replace('data-figma-node="267:2494"',`data-landmark-comparison="${crownStyle}" ${neon?`data-review-crown="${crownStyle}" data-landmark-reference="306:3424"`:'data-figma-node="306:3424"'}`)
  .replace(/<div class="home-map-pins">[\s\S]*?<\/div><div class="home-map-actions">/,markers)
  .replaceAll('/assets/figma-store-markers-20261026/',base);
}

export function renderLatestLandmarkReview({crownStyle='solid'}={}){
 const gold=crownStyle==='gold-neon',neon=crownStyle==='neon';
 const styles=[...figmaHomeStyles.filter(href=>!['/v2/home/new-stores.css','/v2/home/landmarks.css'].includes(href)),'/v2/home/store-markers.css','/v2/home/landmark-figma.css'];
 return `<figure class="approved-store-figure"><figcaption>${gold?'2차 피드백 반영안 · 노란색 네온 왕관':neon?'이전 시안 · 보라색 네온 왕관':'피그마 왕관 시안 · 10/28'}</figcaption><div class="approved-store-host"><template data-approved-store-map="${gold?'best-neon-yellow':neon?'best-neon-matched':'best-figma-20261028'}">${styles.map(href=>`<link rel="stylesheet" href="${href}">`).join('')}<div class="approved-store-canvas" inert>${renderLatestLandmarkMap({crownStyle})}</div></template></div></figure>`;
}

// Exact state composition from the previous PDF, before the final placement feedback.
export function renderPreviousLandmarkReview(){
 const scale=1/1.4,size=60*scale;
 const originalPin=`<span class="landmark-figma-pin landmark-figma-pin-first" role="img" aria-label="랜드마크 매장 핀">${image('ba601.png','',60)}</span>`;
 const idlePin=`<span class="landmark-figma-pin landmark-figma-pin-first" role="img" aria-label="랜드마크 매장 · 미선택" style="left:${118+(60-size)/2}px;top:${263+(60-size)/2}px;width:${size}px;height:${size}px"><img class="approved-static" src="/assets/received-icons-20261022/pins/off/${encodeURIComponent('반려동물-동물병원')}.png" width="${size}" height="${size}" alt=""></span>`;
 return renderLatestLandmarkReview({crownStyle:'gold-neon'})
  .replace('2차 피드백 반영안 · 노란색 네온 왕관','이전 시안 · 미선택 / 선택')
  .replace(originalPin,idlePin)
  .replace('class="landmark-figma-tilted-crown landmark-gold-crown-first"',`class="landmark-figma-tilted-crown landmark-gold-crown-first" style="left:${118+(60-size)/2+14*scale}px;top:${263+(60-size)/2-29*scale}px;transform:scale(${scale});transform-origin:0 0"`);
}
