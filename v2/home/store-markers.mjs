import {renderFigmaHome,figmaHomeStyles} from './figma-home.mjs';

// Approved designs: NEW 267:2353 / BEST 267:2494. Figma is read-only.
const assets='/assets/figma-store-markers-20261026/';
const stylesheet='/v2/home/store-markers.css';
const image=(file,cls,width,height=width)=>`<img class="approved-static ${cls}" src="${assets+file}" width="${width}" height="${height}" alt="" aria-hidden="true">`;
const nodes={new:'267:2353',best:'267:2494'};
const categories={'한식':'2f4c8.svg','중식':'7ac3e.svg','일식':'af4e4.svg','양식':'e55cc.svg','카페/베이커리':'e2ad3.svg'};
const navigation={'2e976.svg':'0a150.svg','e283b.svg':'0a150.svg','6cd8b.svg':'07cea.svg','770e1.svg':'07cea.svg','66ab4.svg':'a066d.svg','558f2.svg':'a066d.svg'};

function pinArtwork(selected){
 return `<span class="approved-pin-mask ${selected?'approved-pin-mask-on':'approved-pin-mask-off'}"><span class="approved-pin-art">${selected?image('55e99.svg','',34.0417,39.803):image('3679c.svg','',23.6)}</span></span>`;
}
function pin(name,position,kind){
 const selected=position==='selected',isNew=kind==='new'&&position!=='first',isBest=kind==='best'&&position!=='second';
 const label=name+(isNew?' · 신규 회원점':isBest?' · 랜드마크 매장':'')+' 보기';
 return `<button type="button" class="figma-map-pin figma-map-pin-${position} approved-store-pin" data-preview="${name}" aria-label="${label}"${isNew?' data-approved-new="true"':''}${isBest?' data-approved-landmark="true"':''}>${pinArtwork(selected)}${isNew?'<span class="approved-new-badge" aria-hidden="true">N</span>':''}</button>`;
}
function crown(selected){
 const name=selected?'selected':'idle';
 const files=selected?[['3c62c.svg',21.3675,2.765],['66a13.svg',24.4825,19.9663],['9d749.svg',4.375,4.375],['7a667.svg',14,2.625]]:[['7ac27.svg',13.7363,1.7775],['a0421.svg',15.7387,12.8355],['757f5.svg',2.8125,2.8125],['83de9.svg',9,1.6875]];
 return `<span class="approved-crown approved-crown-${name}" data-approved-crown="${name}" aria-hidden="true"><span class="approved-crown-shadow">${image('15e42.svg','',24,10)}</span>${files.map(([file,w,h],i)=>image(file,'approved-crown-layer approved-crown-layer-'+i,w,h)).join('')}</span>`;
}

export function renderApprovedStoreMap(kind){
 if(!nodes[kind])throw new RangeError('Unknown approved store map: '+kind);
 // Compose the existing home/search/category/navigation components, changing only
 // these opt-in specimens. No screenshot is used as implementation artwork.
 let html=renderFigmaHome().replace('data-figma-home',`data-figma-home data-approved-store-kind="${kind}" data-figma-node="${nodes[kind]}"`);
 const pins=pin('세븐일레븐','first',kind)+pin('삼호가든','second',kind)+pin('파샤도 망원','selected',kind)+(kind==='best'?crown(true)+crown(false):'');
 html=html.replace(/<div class="home-map-pins">[\s\S]*?<\/div><div class="home-map-actions">/,`<div class="home-map-pins">${pins}</div><div class="home-map-actions">`);
 html=html.replace(/(<button\b[^>]*data-category="([^"]+)"[^>]*>)([\s\S]*?)(<\/button>)/g,(_,opening,name,body,closing)=>opening.replace('data-category=','data-approved-category=')+body.replace(/<img\b[^>]*>/,image(categories[name],'',20))+closing);
 // The authoritative Figma exports must not be remapped by the legacy icon
 // adapter at the workspace boundary. Additional classes opt these controls out.
 html=html.replace('class="home-quick"','class="home-quick approved-quick"').replace('class="home-locate"','class="home-locate approved-locate"');
 html=html.replaceAll('/assets/figma-home-20261020/',assets);
 for(const [old,file] of Object.entries(navigation))html=html.replaceAll(assets+old,assets+file);
 return html;
}

export function renderApprovedStoreReview(kind){
 const title=kind==='new'?'NEW · 확정 시안':'BEST · 확정 시안';
 return `<link rel="stylesheet" href="${stylesheet}"><figure class="approved-store-figure"><figcaption>${title}</figcaption><div class="approved-store-host"><template data-approved-store-map="${kind}">${[...figmaHomeStyles.filter(href=>!['/v2/home/new-stores.css','/v2/home/landmarks.css'].includes(href)),stylesheet].map(href=>`<link rel="stylesheet" href="${href}">`).join('')}<div class="approved-store-canvas" inert>${renderApprovedStoreMap(kind)}</div></template></div></figure>`;
}

export function setupApprovedStoreMaps(root){
 for(const section of root.querySelectorAll('#home-new-stores,#home-landmarks')){
  const mount=()=>{
   if(section.hidden)return;
   for(const host of section.querySelectorAll('.approved-store-host')){
    if(host.shadowRoot)continue;
    const template=host.querySelector('template'),shadow=host.attachShadow({mode:'open'});
    shadow.append(template.content.cloneNode(true));template.remove();
    const canvas=shadow.querySelector('.approved-store-canvas');
    const resize=()=>{const scale=Math.min(1,host.clientWidth/390);canvas.style.zoom=scale;host.style.height=846*scale+'px';};
    new ResizeObserver(resize).observe(host);resize();
   }
  };
  new MutationObserver(mount).observe(section,{attributes:true,attributeFilter:['hidden']});mount();
 }
}
