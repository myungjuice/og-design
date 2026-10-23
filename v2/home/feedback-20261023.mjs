import {renderFigmaHome,figmaHomeStyles} from './figma-home.mjs';

// Display fixtures only: no new membership period or user-count policy is implied.
const stores=['파샤도 망원','세븐일레븐'];
const stylesheet='/v2/home/feedback-20261023.css';
function map(kind){
 const isNew=kind.startsWith('new-');
 let html=renderFigmaHome({showStoreLabels:true,...(isNew?{newStores:stores,newStoreStyle:kind==='new-n'?'badge':'sprout'}:{landmarkStores:stores,landmarkStyle:'crown'})});
 const extra=kind==='new-sprout'?'gasong-centered-sprout':kind==='best-crown'?'gasong-worn-crown':kind==='best-gold'?'gasong-gold-pins':'';
 if(extra)html=html.replace('class="home-test"',`class="home-test ${extra}"`);
 if(kind==='new-n'){
  html=html.replaceAll('<span class="home-new-badge">NEW</span>','');
  html=html.replace(/(<button\b[^>]*aria-label="[^"]*신규 회원점[^"]*"[^>]*>)/g,'$1<span class="gasong-new-n" aria-hidden="true">N</span>');
 }
 if(kind==='best-crown')html=html.replace(/(<span class="home-landmark-part[^>]*>[\s\S]*?)(<\/svg>)/g,'$1<path class="gasong-crown-gem" d="m16 8 2.3 3.3-2.3 3.3-2.3-3.3Z"/>$2');
 if(kind==='best-gold'){
  html=html.replace(/<span class="home-landmark-part[^>]*>[\s\S]*?<\/span>/g,'');
  html=html.replace(/(<button\b[^>]*aria-label="[^"]*랜드마크 매장[^"]*"[^>]*>)/g,'$1<span class="gasong-gold-hook" data-feedback-gold="true" hidden></span>');
 }
 html=html.replace('<div class="home-map-actions">',`<div class="gasong-map-legend">${isNew?'신규 회원점 표시 방식 검토':'BEST · 유저 100명 이상 표시 방식 검토'}</div><div class="home-map-actions">`);
 return `<div class="gasong-map-host"><template data-gasong-map="${kind}">${[...figmaHomeStyles,'/v2/home/appearance.css',stylesheet].map(href=>`<link rel="stylesheet" href="${href}">`).join('')}<div class="home-appearance-canvas" inert>${html}</div></template></div>`;
}
function comparison(kind,title,options){
 return `<div class="gasong-feedback-block" data-gasong-comparison="${kind}"><link rel="stylesheet" href="${stylesheet}"><h3>${title} · 10/23 피드백 반영 비교</h3><p class="v2-intro">가송님 요청안 두 가지만 라이트 모드로 비교합니다. 매장 상태는 검토용 예시입니다.</p><div class="gasong-feedback-grid">${options.map(([id,name,copy])=>`<figure class="gasong-feedback-figure"><figcaption><h4>${name}</h4><p>${copy}</p></figcaption>${map(id)}</figure>`).join('')}</div></div>`;
}
export function renderNewStoreFeedbackComparison(){
 return comparison('new','신규 회원점',[
  ['new-sprout','반영안 A · 중앙 새싹','핀 중앙에 좌우 대칭 새싹'],
  ['new-n','반영안 B · 빨간 N','핀 오른쪽 위에 작은 원형 N 배지']
 ]);
}
export function renderBestStoreFeedbackComparison(){
 return comparison('best','BEST 매장',[
  ['best-crown','반영안 A · 밀착 왕관','핀에 내려쓴 왕관 · 진한 노랑 띠'],
  ['best-gold','반영안 B · 황금색 핀','별도 장식 없이 핀 전체를 금빛으로']
 ]);
}
export function setupGasongMapComparisons(root){
 for(const section of root.querySelectorAll('#home-new-stores,#home-landmarks')){
  const mount=()=>{
   if(section.hidden)return;
   for(const host of section.querySelectorAll('.gasong-map-host')){
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
}
