import {renderLatestLandmarkMap} from './landmark-figma.mjs';
import {figmaHomeStyles} from './figma-home.mjs';
const assets='/assets/received-icons-20261022/pins/';

export function renderFinalLandmarkPin(selected,{wrapped=false}={}){
 const scale=selected?1:1/1.4,size=60*scale;
 const crown=(layer)=>`<img class="landmark-final-crown landmark-crown-${layer}" src="/assets/review-20261030/neon-crown-gold-${layer}.svg" width="40" height="36" alt="">`;
 return `<span class="landmark-final-marker${wrapped?' landmark-wrapped':''}" data-landmark-state="${selected?'on':'off'}" role="img" aria-label="랜드마크 매장 · ${selected?'선택':'미선택'}" style="width:${size}px;height:${size}px"><span class="landmark-final-unit" style="transform:scale(${scale})">${wrapped?crown('back'):''}<img class="landmark-final-pin" src="${assets+(selected?'on':'off')}/${encodeURIComponent('반려동물-동물병원')}.png" width="60" height="60" alt="">${wrapped?crown('front'):'<img class="landmark-final-crown" src="/assets/review-20261029/neon-crown-gold.svg" width="40" height="36" alt="">'}</span></span>`;
}

export function renderFinalLandmarkMap({wrapped=false}={}){
 const markers=`<div class="home-map-pins"><div class="landmark-final-first">${renderFinalLandmarkPin(false,{wrapped})}</div><div class="landmark-final-second">${renderFinalLandmarkPin(true,{wrapped})}</div></div><div class="home-map-actions">`;
 return renderLatestLandmarkMap({crownStyle:'gold-neon'})
  .replace('data-landmark-comparison="gold-neon"',`data-landmark-comparison="${wrapped?'fourth':'final'}"`)
  .replace(/<div class="home-map-pins">[\s\S]*?<\/div><div class="home-map-actions">/,markers);
}

export function renderFinalLandmarkReview({wrapped=false}={}){
 const styles=[...figmaHomeStyles.filter(href=>!['/v2/home/new-stores.css','/v2/home/landmarks.css'].includes(href)),'/v2/home/store-markers.css','/v2/home/landmark-figma.css','/v2/home/landmark-final.css'];
 return `<figure class="approved-store-figure"><figcaption>${wrapped?'4차 피드백 반영안 · 링 앞뒤 분리':'이전 시안 · 왕관 전체 앞 레이어'}</figcaption><div class="approved-store-host"><template data-approved-store-map="${wrapped?'best-fourth':'best-final'}">${styles.map(href=>`<link rel="stylesheet" href="${href}">`).join('')}<div class="approved-store-canvas" inert>${renderFinalLandmarkMap({wrapped})}</div></template></div></figure>`;
}
