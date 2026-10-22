import {renderFigmaHome,figmaHomeStyles} from './figma-home.mjs';
import {renderLandmarkPart} from './landmark-art.mjs';
import {pinArtwork} from '../category-artwork.mjs';

// Display fixtures only, not verified user counts for these stores.
const stores=['파샤도 망원','세븐일레븐'];
const styles=[['crown','왕관','지역의 대표 매장이라는 상징이 가장 직접적인 안'],['medal','훈장','많은 유저가 모인 매장에 수여하는 인증 훈장'],['laurel','월계관','핀 위를 감싸는 잎으로 명예를 표현한 안'],['castle','미니 성탑','동네의 거점이라는 의미를 작은 성탑으로 표현한 안']];
const themes=[['light','라이트'],['dark','다크']];

function detail(style){
 return `<div class="landmark-detail-row" aria-label="핀 2배 확대">${[['off',24,'미선택'],['on',33.6,'선택']].map(([state,size,label])=>`<div class="landmark-detail-item"><span class="landmark-detail-pin home-landmark-pin ${state==='on'?'is-selected':''}" aria-hidden="true">${pinArtwork('한식',state,size)}${renderLandmarkPart(style)}</span><span>${label} · 2×</span></div>`).join('')}</div>`;
}
function specimen(style,theme,combined=false){
 let html=renderFigmaHome({landmarkStores:stores,landmarkStyle:style,showStoreLabels:true,...(combined?{newStores:['세븐일레븐'],newStoreStyle:'ribbon'}:{})});
 if(theme==='dark')html=html.replace('data-figma-home','data-figma-home data-home-theme="dark"');
 html=html.replace('<div class="home-map-actions">',`<div class="landmark-legend">${renderLandmarkPart(style)}<span>랜드마크 · 유저 100명 이상</span></div><div class="home-map-actions">`);
 const attr=combined?'data-home-landmark-combined="true"':`data-home-landmark-style="${style}"`;
 return `<div class="landmark-host"><template ${attr} data-home-landmark-theme="${theme}">${[...figmaHomeStyles,'/v2/home/appearance.css'].map(href=>`<link rel="stylesheet" href="${href}">`).join('')}<div class="home-appearance-canvas" inert>${html}</div></template></div>`;
}
export function renderHomeLandmarkReview(){
 return `<section id="home-landmarks" class="home-landmark-review" data-review-screen hidden aria-labelledby="home-landmarks-title"><link rel="stylesheet" href="/v2/home/landmarks.css"><h2 id="home-landmarks-title">랜드마크 매장 · 핀 파츠 비교</h2><p class="v2-intro">유저 100명 이상인 매장은 핀 위쪽 파츠로 구분합니다. 선택 여부는 기존 핀 크기로, 랜드마크 여부는 금빛 상징으로 표시합니다.</p><div class="landmark-grid">${styles.map(([style,title,copy],i)=>`<article class="landmark-treatment" data-landmark-treatment="${style}"><h3>${i+1}. ${title}</h3><p>${copy}</p>${detail(style)}</article>`).join('')}</div>${themes.map(([theme,title])=>`<h3 class="landmark-section-title">${title}</h3><div class="landmark-grid">${styles.map(([style,name])=>`<figure class="landmark-figure"><figcaption><h4>${name}</h4></figcaption>${specimen(style,theme)}</figure>`).join('')}</div>`).join('')}<h3 class="landmark-section-title">신규 회원점이면서 랜드마크인 경우</h3><p class="v2-intro">세븐일레븐에 위쪽 왕관과 뒤쪽 환영 리본을 함께 적용한 예시입니다. 두 상태를 별도로 보여주며, 이 조합을 최종안으로 확정한 것은 아닙니다.</p><div class="landmark-combined-grid">${themes.map(([theme,title])=>`<figure class="landmark-figure"><figcaption><h4>${title} · 왕관 + 환영 리본</h4></figcaption>${specimen('crown',theme,true)}</figure>`).join('')}</div><p class="v2-intro">매장 상태는 표시 방식 검토용 예시입니다. 실제 유저 수를 조회한 화면이 아니며, ‘유저’의 집계 방식·기간은 이 시안에서 추가로 정하지 않습니다. 기존 신규 회원점 비교안과 핀 원본은 유지했습니다.</p></section>`;
}
export function setupHomeLandmarkReview(root){
 const section=root.querySelector('#home-landmarks');if(!section)return;
 const mount=()=>{
  if(section.hidden)return;
  for(const host of section.querySelectorAll('.landmark-host')){
   if(host.shadowRoot)continue;
   const template=host.querySelector('template'),shadow=host.attachShadow({mode:'open'});
   shadow.append(template.content.cloneNode(true));template.remove();
   const canvas=shadow.querySelector('.home-appearance-canvas');
   const resize=()=>{const scale=Math.min(1,host.clientWidth/390);canvas.style.zoom=scale;host.style.height=846*scale+'px';};
   new ResizeObserver(resize).observe(host);resize();
  }
 };
 new MutationObserver(mount).observe(section,{attributes:true,attributeFilter:['hidden']});mount();
}
