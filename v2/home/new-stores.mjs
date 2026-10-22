import {renderFigmaHome,figmaHomeStyles,renderHomeNewStoreMark} from './figma-home.mjs';
import {pinArtwork} from '../category-artwork.mjs';

// Visual-review fixtures, not claims about when these stores joined.
export const homeNewStoreExamples=['파샤도 망원','세븐일레븐'];
const treatments=[['sprout','새싹','핀 위에 작은 새싹이 돋아난 모습'],['ribbon','환영 리본','핀 뒤에 짧은 리본을 걸어 환영하는 모습'],['paper','등장 핀','지도 틈에서 핀이 막 올라온 모습']];

function detail(style){
 return `<div class="home-new-detail-row" aria-label="핀 2배 확대">${[['off',24,'미선택'],['on',33.6,'선택']].map(([state,size,label])=>`<div class="home-new-detail-item"><span class="home-new-detail-pin home-new-pin ${state==='on'?'is-selected':''}" aria-hidden="true">${pinArtwork('한식',state,size)}${renderHomeNewStoreMark(style)}</span><span>${label} · 2×</span></div>`).join('')}</div>`;
}

function specimen(style,theme){
 let html=renderFigmaHome({newStores:homeNewStoreExamples,showStoreLabels:true,newStoreStyle:style});
 if(theme==='dark')html=html.replace('data-figma-home','data-figma-home data-home-theme="dark"');
 html=html.replace('<div class="home-map-actions">',`<div class="home-new-legend">${renderHomeNewStoreMark(style)}<span>새로 들어온 회원점</span></div><div class="home-map-actions">`);
 return `<div class="home-new-host"><template data-home-new-variant="${style}" data-home-new-theme="${theme}">${[...figmaHomeStyles,'/v2/home/appearance.css'].map(href=>`<link rel="stylesheet" href="${href}">`).join('')}<div class="home-appearance-canvas" inert>${html}</div></template></div>`;
}

export function renderHomeNewStoresReview(){
 const examples=[['light','라이트'],['dark','다크']];
 return `<section id="home-new-stores" class="home-new-review" data-review-screen hidden aria-labelledby="home-new-stores-title"><link rel="stylesheet" href="/v2/home/new-stores.css"><h2 id="home-new-stores-title">신규 회원점 표시 비교</h2><p class="v2-intro">같은 매장에 세 가지 표현을 적용했습니다. 핀 원본·선택 크기·채도는 동일하며, 장식과 범례로 신규 회원점을 구분합니다.</p><div class="home-new-treatments">${treatments.map(([style,title,description],index)=>`<article class="home-new-treatment" data-new-treatment="${style}"><h3>${index+1}. ${title}</h3><p>${description}</p>${detail(style)}</article>`).join('')}</div>${examples.map(([theme,title])=>`<h3 class="home-new-theme-title">${title}</h3><div class="home-new-treatments">${treatments.map(([style,name])=>`<figure class="home-new-figure"><figcaption><h4>${name}</h4></figcaption>${specimen(style,theme)}</figure>`).join('')}</div>`).join('')}<p class="v2-intro">장식이 붙은 매장은 검토용 예시입니다. 실제 신규 여부·노출 기간은 정하지 않았습니다. 애니메이션 없이 정지 화면으로 비교합니다.</p><h3 class="home-new-theme-title">이전 NEW 배지안</h3><div class="home-new-grid">${examples.map(([theme,title])=>{
  let html=renderFigmaHome({newStores:homeNewStoreExamples,showStoreLabels:true});
  if(theme==='dark')html=html.replace('data-figma-home','data-figma-home data-home-theme="dark"');
  return `<figure class="home-new-figure"><figcaption><h3>${title}</h3></figcaption><div class="home-new-host"><template data-home-new-theme="${theme}">${[...figmaHomeStyles,'/v2/home/appearance.css'].map(href=>`<link rel="stylesheet" href="${href}">`).join('')}<div class="home-appearance-canvas" inert>${html}</div></template></div></figure>`;
 }).join('')}</div><p class="v2-intro">NEW가 붙은 매장은 표시 방식 검토용 예시입니다. 실제 신규 여부·노출 기간은 이 시안에서 정하지 않습니다.</p></section>`;
}

export function setupHomeNewStoresReview(root){
 const section=root.querySelector('#home-new-stores');if(!section)return;
 const mount=()=>{
  if(section.hidden)return;
  for(const host of section.querySelectorAll('.home-new-host')){
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
