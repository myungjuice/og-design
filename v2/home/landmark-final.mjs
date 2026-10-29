import {renderLatestLandmarkMap} from './landmark-figma.mjs';
import {figmaHomeStyles} from './figma-home.mjs';
const assets='/assets/received-icons-20261022/pins/';

export function renderFinalLandmarkPin(selected){
 const scale=selected?1:1/1.4,size=60*scale;
 return `<span class="landmark-final-marker" data-landmark-state="${selected?'on':'off'}" role="img" aria-label="랜드마크 매장 · ${selected?'선택':'미선택'}" style="width:${size}px;height:${size}px"><span class="landmark-final-unit" style="transform:scale(${scale})"><img class="landmark-final-pin" src="${assets+(selected?'on':'off')}/${encodeURIComponent('반려동물-동물병원')}.png" width="60" height="60" alt=""><img class="landmark-final-crown" src="/assets/review-20261029/neon-crown-gold.svg" width="40" height="36" alt=""></span></span>`;
}

export function renderFinalLandmarkMap(){
 const markers=`<div class="home-map-pins"><div class="landmark-final-first">${renderFinalLandmarkPin(false)}</div><div class="landmark-final-second">${renderFinalLandmarkPin(true)}</div></div><div class="home-map-actions">`;
 return renderLatestLandmarkMap({crownStyle:'gold-neon'})
  .replace('data-landmark-comparison="gold-neon"','data-landmark-comparison="final"')
  .replace(/<div class="home-map-pins">[\s\S]*?<\/div><div class="home-map-actions">/,markers);
}

export function renderFinalLandmarkReview(){
 const styles=[...figmaHomeStyles.filter(href=>!['/v2/home/new-stores.css','/v2/home/landmarks.css'].includes(href)),'/v2/home/store-markers.css','/v2/home/landmark-figma.css','/v2/home/landmark-final.css'];
 return `<figure class="approved-store-figure"><figcaption>최종 피드백 반영안 · 미선택 / 선택</figcaption><div class="approved-store-host"><template data-approved-store-map="best-final">${styles.map(href=>`<link rel="stylesheet" href="${href}">`).join('')}<div class="approved-store-canvas" inert>${renderFinalLandmarkMap()}</div></template></div></figure>`;
}
