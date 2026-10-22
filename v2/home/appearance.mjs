import {renderFigmaHome,figmaHomeStyles} from './figma-home.mjs';
import {escapeHTML as e} from '../../design-system/components/core.mjs';

const specimens=[
 ['original','기존 홈'],
 ['light-large','라이트'],
 ['dark-large','다크']
];
function screen(id){
 let html=renderFigmaHome();
 const original=id==='original';
 if(!original)html=html.replace('data-figma-home',`data-figma-home data-home-labels="large"${id==='dark-large'?' data-home-theme="dark"':''}`);
 return html.replace(/(<button\b[^>]*class="figma-map-pin[^\"]*"[^>]*>)([\s\S]*?)(<\/button>)/g,(_,opening,art,closing)=>{
  const name=opening.match(/data-preview="([^"]+)"/)[1];
  if(original)return opening+art+closing;
  return opening.replace(/aria-label="[^"]+"/,`aria-label="${e(name)} 보기"`)+art+`<span class="home-store-label" aria-hidden="true">${e(name)}</span>`+closing;
 });
}
export function renderHomeAppearanceReview(){
 return `<section id="home-appearance" data-review-screen hidden aria-labelledby="home-appearance-title"><link rel="stylesheet" href="/v2/home/appearance.css"><h2 id="home-appearance-title">홈 비교</h2><div class="home-appearance-grid">${specimens.map(([id,title])=>`<figure class="home-appearance-figure"><figcaption><h3>${title}</h3></figcaption><div class="home-appearance-host"><template data-home-appearance="${id}">${[...figmaHomeStyles,'/v2/home/appearance.css'].map(href=>`<link rel="stylesheet" href="${href}">`).join('')}<div class="home-appearance-canvas" inert>${screen(id)}</div></template></div></figure>`).join('')}</div><p class="v2-intro">지도 색감은 참고용입니다.</p></section>`;
}
export function setupHomeAppearanceReview(root){
 const section=root.querySelector('#home-appearance');if(!section)return;
 const mount=()=>{
  if(section.hidden)return;
  for(const host of section.querySelectorAll('.home-appearance-host')){
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
