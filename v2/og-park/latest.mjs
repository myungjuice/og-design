// Figma 304:2931, retrieved 2026-10-28. Asset names are the supplied exports.
const base='/assets/figma-ogpark-20261028/';
const image=(file,cls,width,height=width)=>`<img class="${cls}" src="${base+file}" width="${width}" height="${height}" alt="" aria-hidden="true">`;
const categories=[
 ['한식','a7e68.png','27352.svg','357'],
 ['카페/베이커리','0366b.png','deec4.svg','163'],
 ['헤어/뷰티','f968b.png','59657.svg','15'],
 ['부동산/인테리어','eff87.png','9c92e.svg','4']
];

export function renderLatestParkInterests(){
 return `<section class="park-interests park-interests-latest"><header><h4>내 관심 업종</h4><span>수정하기${image('2cfce.svg','',18)}</span></header><div class="park-interest-grid">${categories.map(([label,photo,icon,count])=>`<article class="park-interest-card" aria-label="${label} · 매장 ${count}개">${image(photo,'park-interest-photo',171,180)}<div class="park-interest-caption"><span class="park-interest-symbol">${image(icon,'',24)}</span><div><div class="park-interest-name"><strong>${label}</strong>${image('a1e02.svg','',20)}</div><div class="park-interest-count"><span class="park-interest-count-pin">${image('14604.svg','',9.35,10.934)}</span><span>${count}</span></div></div></div></article>`).join('')}</div></section>`;
}

export function useLatestParkAssets(html){
 html=html.replace('커뮤니티 ›',`커뮤니티${image('3e9b0.svg','park-community-arrow',20)}`);
 html=html.replace(/(<img\b[^>]*class="park-community-art"[^>]*>)/,'$1$1');
 // Reuse the existing banner/contest/navigation composition, using this frame's exports.
 const files=['b5b7b.png','c528d.png','cb206.png','70193.png','e859d.png','ca749.png','e7ad9.png','5e49f.png','1e15d.svg','822bc.svg','ac0f4.png'];
 for(const file of files)html=html.replaceAll('/assets/figma-ogpark-20261021/'+file,base+file);
 html=html.replaceAll('/assets/gasong-feedback-20261023/park-gift.png',base+'c256d.png');
 const sparkles={'073f1.svg':'0db39.png','542c7.svg':'888f6.png','1bd7e.svg':'dbe6e.png','b674a.svg':'5a10c.png','cfcaa.svg':'3ca52.png'};
 for(const [old,file] of Object.entries(sparkles))html=html.replaceAll('/assets/figma-ogpark-20261021/'+old,base+file);
 const navigation={'15ba5.svg':'15ba5.svg','2e976.svg':'0a150.svg','770e1.svg':'88266.svg','66ab4.svg':'a066d.svg','8f648.svg':'8f648.svg','60fdf.svg':'60fdf.svg'};
 for(const [old,file] of Object.entries(navigation))html=html.replaceAll('/assets/figma-home-20261020/'+old,base+file);
 return html;
}
