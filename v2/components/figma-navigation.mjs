// Figma 144:2083 / TapIcon 214:2078. The 56px scan surface and 40px glyph are separate layers.
const assets='/assets/figma-home-20261020/';
const items=[['홈','15ba5.svg','bf844.svg'],['마이랜드','2e976.svg','e283b.svg'],['바코드','60d55.svg','0a2e8.svg'],['오지파크','6cd8b.svg','770e1.svg'],['내 정보','66ab4.svg','558f2.svg']];
const image=(file,cls,width,height=width,extra='')=>`<img class="${cls}" src="${assets+file}" width="${width}" height="${height}" alt="" aria-hidden="true" ${extra}>`;

export function renderFigmaNavigation({active='홈',family='bottom-navigation'}={}){
 return `<nav class="${family}" data-figma-navigation aria-label="주 메뉴">${items.map(([name,idle,on],i)=>{
  const current=name===active,scan=i===2;
  const art=scan?`<span class="figma-scan-surface">${image('8f648.svg','figma-scan-glyph',40)}${image('60fdf.svg','figma-scan-gloss',45.2667,39.3891)}</span>`:
   `<span class="figma-nav-art" data-received-icon="navigation" data-received-nav="${name}">${image(idle,'figma-nav-glyph',24,24,'data-received-state="idle"')}${image(on,'figma-nav-glyph',24,24,'data-received-state="active"')}</span>`;
  return `<button type="button" class="nav-item figma-nav-item${scan?' nav-barcode figma-nav-scan':''}${current?' is-selected':''}" data-preview="${name}"${current?' aria-current="page"':''}><span class="nav-face figma-nav-face"${scan?' data-received-icon="navigation" data-received-nav="바코드"':''}>${art}</span><span class="figma-nav-label">${scan?'내 바코드':name}</span></button>`;
 }).join('')}</nav>`;
}
