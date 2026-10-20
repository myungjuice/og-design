import {renderFigmaHome,figmaHomeStyles} from './figma-home.mjs';
import {escapeHTML as e} from '../../design-system/components/core.mjs';

const specimens=[
 ['original','기존 홈 · 원본 유지','현재 확정 시안 그대로 비교합니다.'],
 ['light-large','라이트 · 매장명 확대','매장명 14px 확대 · 원형 핀 통일 · 채도 20% 낮춤'],
 ['dark-large','다크 · 매장명 확대','밝은 검색 아이콘 · 라이트안과 동일한 원형 핀']
];
const pinRasters={
 '55e99.svg':['pin-circle-large@4x.png',44],
 '3679c.svg':['pin-idle-circle@4x.png',28],
 'e20b7.svg':['pin-idle-circle@4x.png',28]
};
function screen(id){
 let html=renderFigmaHome();
 if(id==='original')return html;
 html=html.replace('data-figma-home',`data-figma-home data-home-labels="large"${id==='dark-large'?' data-home-theme="dark"':''}`);
 return html.replace(/(<button\b[^>]*class="figma-map-pin[^\"]*"[^>]*>)([\s\S]*?)(<\/button>)/g,(_,opening,art,closing)=>{
  const name=opening.match(/data-preview="([^"]+)"/)[1];
  const source=art.match(/src="[^\"]*\/([^/\"]+)"/)[1], [file,size]=pinRasters[source];
  const pin=`<img class="home-review-pin-art" src="/assets/home-appearance-20261020/${file}" width="${size}" height="${size}" alt="" aria-hidden="true">`;
  return opening.replace(/aria-label="[^"]+"/,`aria-label="${e(name)} 보기"`)+pin+`<span class="home-store-label" aria-hidden="true">${e(name)}</span>`+closing;
 });
}
export function renderHomeAppearanceReview(){
 return `<section id="home-appearance" data-review-screen hidden aria-labelledby="home-appearance-title"><link rel="stylesheet" href="/v2/home/appearance.css"><h2 id="home-appearance-title">홈 · 다크모드와 매장명 비교</h2><p class="v2-intro">기존 홈은 유지하고, 매장명 확대 라이트안과 다크안을 나란히 비교합니다. 비교안의 핀은 원형으로 통일하고 채도만 20% 낮췄습니다. 버튼·핀의 크기와 위치는 유지합니다.</p><div class="home-appearance-grid">${specimens.map(([id,title,description])=>`<figure class="home-appearance-figure"><figcaption><h3>${title}</h3><p>${description}</p></figcaption><div class="home-appearance-host"><template data-home-appearance="${id}">${[...figmaHomeStyles,'/v2/home/appearance.css'].map(href=>`<link rel="stylesheet" href="${href}">`).join('')}<div class="home-appearance-canvas" inert>${screen(id)}</div></template></div></figure>`).join('')}</div><p class="v2-intro">정적 지도 이미지 기반의 색감 검토용입니다. 확대 대상은 핀 3곳의 표시명이며, 지도 서비스의 도로명·기본 지명은 그대로입니다. 다크 지도는 검토용 색상 처리로, 실제 지도 SDK의 야간 스타일을 구현한 결과는 아닙니다.</p></section>`;
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
