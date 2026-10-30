// Supplied Figma frames 336:3620 and 336:3986. These are static comparison specimens.
const old='/assets/figma-ogpark-20261028/';
const base='/assets/figma-ogpark-20261029/';
const image=(file,cls,width,height=width)=>`<img src="${file.endsWith('.png')?old:base}${file}" class="${cls}" width="${width}" height="${height}" alt="" aria-hidden="true">`;
const categories=[
 ['한식','357',['a7e68.png'],['eff87.png','0366b.png','a7e68.png']],
 ['카페/베이커리','163',['0366b.png'],['eff87.png','0366b.png']],
 ['부동산/인테리어','4',['f968b.png','eff87.png'],['eff87.png']]
];

export function renderGasongParkLower(version){
 const section=version==='gasong-section'||version==='final'||version==='feedback-4';
 const cards=categories.map(([label,count,squarePhotos,tallPhotos],i)=>{
  const photos=section?squarePhotos:tallPhotos;
  const pin=section?(i===0?'f059c.svg':'c1e20.svg'):(i===0?'774bc.svg':'4017b.svg');
  return `<article class="gasong-category" aria-label="${label} · 매장 ${count}개"><div class="gasong-photo"><div class="gasong-photo-layers">${photos.map(photo=>image(photo,'',section?120:160,section?120:200)).join('')}</div>${!section?`<h5>${label}${image('a1e02.svg','',20)}</h5>`:''}<div class="gasong-count"><span>${image(pin,'',10.199,11.928)}</span>${count}</div></div>${section?`<p class="gasong-category-label">${label}</p>`:''}</article>`;
 }).join('');
 return `<section class="gasong-lower"><div class="gasong-interests"><header><h4>내 관심 업종</h4><span>수정하기${image(section?'87c42.svg':'f5ade.svg','',18)}</span></header><div class="gasong-category-row">${cards}</div></div><div class="gasong-community">${image('822bc.svg','gasong-community-symbol',22)}<div><h4>커뮤니티${image(section?'3e9b0.svg':'f928d.svg','',20)}</h4><p>관심 업종 회원들과 이야기해요</p></div>${image('ac0f4.png','gasong-community-art',52)}${image('ac0f4.png','gasong-community-art',52)}</div></section>`;
}

export function useGasongParkAssets(html){
 // These exports belong to the new frames; leave all earlier specimens untouched.
 for(const file of ['60fdf.svg','88266.svg'])html=html.replaceAll(old+file,base+file);
 return html;
}
