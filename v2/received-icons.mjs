import {escapeHTML as e} from '../design-system/components/core.mjs';
import {categoryItems} from '../design-system/pages/home/category-assets.mjs';

const base='/assets/received-icons-20261017/';
const aliases={'아시안':'아시안/세계음식','술집':'야식/술집/포차','패스트푸드':'패스트푸드/도시락','뷰티':'헤어/뷰티','운동/헬스':'운동/스포츠/레저','레저':'운동/스포츠/레저'};
const categoryFile=name=>(aliases[name]||name).replaceAll('/','-')+'.svg';
const url=file=>base+file.split('/').map(encodeURIComponent).join('/');
const picture=(kind,file,extra='',size=24)=>`<img class="received-icon" data-received-icon="${kind}" src="${url(file)}" width="${size}" height="${size}" alt="" aria-hidden="true" decoding="async" ${extra}>`;
const categoryPicture=(name,size=24)=>picture('category','categories/'+categoryFile(name),`data-received-category="${e(aliases[name]||name)}"`,size);
const functions={search:'검색.svg',target:'현위치.svg',quick:'바로적립100.svg'};
const navigationFiles={'홈':'홈','마이랜드':'마이랜드','바코드':'바코드','내 바코드':'바코드','오지파크':'오지파크','내 정보':'내 정보'};
function navigationArt(label){
 const name=navigationFiles[label];
 if(!name)return '';
 return `<span class="${name==='바코드'?'barcode-art ':''}received-nav-art" data-received-icon="navigation" data-received-nav="${e(name)}">`+
  picture('navigation-idle','functions/'+name+'100.svg','data-received-state="idle"')+
  picture('navigation-active','functions/'+name+'600.svg','data-received-state="active"')+'</span>';
}

// Adapt only the v2 rendering boundary. Original screen renderers, supplied files
// and historical v1/v2 MyLand frames stay unchanged.
export function applyReceivedIcons(source){
 let html=source;
 html=html.replace(/<button\b[^>]*class="[^"]*\bhome-store-pin\b[^"]*"[^>]*>[\s\S]*?<\/button>/g,button=>{
  const name=button.match(/data-preview="([^"]+)"/)?.[1];
  const category=({'오시 망원본점':'일식','밀랍(MILLAB)':'카페/베이커리','육감만족':'한식'})[name];
  if(!category)return button;
  const state=button.includes('v2-home-cafe-pin')?'on':'off';
  let art=picture('pin-'+state,'pins/'+state+'/'+categoryFile(category),`data-received-category="${e(category)}"`,40);
  if(state==='on')art=art.replace('class="received-icon"','class="v2-home-cafe-pin"');
  return button.replace(/<span class="home-art [^"]*"[^>]*>[\s\S]*?<\/span>|<img class="v2-home-cafe-pin"[^>]*>/,art);
 });
 html=html.replace(/<span class="home-art home-art-(search|target|quick|utensils|rice|dumpling|sushi)"[^>]*>[\s\S]*?<\/span>/g,(_,name)=>{
  if(functions[name])return picture(name,'functions/'+functions[name]);
  return categoryPicture(({utensils:'전체',rice:'한식',dumpling:'중식',sushi:'일식'})[name]);
 });
 html=html.replace(/<nav class="bottom-navigation"[^>]*>[\s\S]*?<\/nav>/g,nav=>nav.replace(/<span class="nav-face">[\s\S]*?<\/span><span>([^<]+)<\/span>/g,(_,label)=>`<span class="nav-face">${navigationArt(label)}</span><span>${label}</span>`));
 html=html.replace(/<nav class="bottom-nav"[^>]*>[\s\S]*?<\/nav>/g,nav=>nav.replace(/<span>[\s\S]*?<\/span><small>([^<]+)<\/small>/g,(_,label)=>`<span>${navigationArt(label)}</span><small>${label}</small>`));
 html=html.replace(/<button\b[^>]*data-category-id="([^"]+)"[^>]*>[\s\S]*?<\/button>/g,(button,id)=>{
  const name=categoryItems.find(item=>item.id===id)?.name;
  return name?button.replace(/<img\b[^>]*>/,categoryPicture(name,20)):button;
 });
 // Existing selected cafe chip already contains a standalone image.
 html=html.replace(/<button\b[^>]*data-category="카페\/베이커리"[^>]*>[\s\S]*?<\/button>/g,button=>button.replace(/<img\b[^>]*>/,categoryPicture('카페/베이커리')));
 html=html.replace(/<img\b[^>]*src="\/assets\/designer-20261013\/([^"/]+\.svg)"[^>]*>/g,(image,file)=>{
  const replacements={'adbac.svg':['search','functions/검색.svg'],'2e216.svg':['search','functions/검색.svg'],'7e775.svg':['target','functions/현위치.svg'],'363ea.svg':['quick','functions/바로적립100.svg']};
  if(replacements[file])return picture(...replacements[file]);
  if(/^[0-9a-f]+\.svg$/.test(file))return image;
  return categoryPicture(file.replace(/\.svg$/,'').replaceAll('-','/'));
 });
 html=html.replace(/<li><span class="visit-symbol">[\s\S]*?<\/span><div class="visit-copy"><strong>([^<]+)<\/strong>/g,(row,name)=>{
  const category=({'스시산원 반주헌':'일식','준오헤어 용산아이파크몰':'헤어/뷰티','석암생소금구이 종로익선점':'한식'})[name];
  return category?row.replace(/<span class="visit-symbol">[\s\S]*?<\/span>/,`<span class="visit-symbol">${categoryPicture(category,32)}</span>`):row;
 });
 return html.replaceAll('퀵적립','바로적립').replace(/(?:<link rel="stylesheet" href="\/v2\/received-icons\.css">)*<\/template>/g,'<link rel="stylesheet" href="/v2/received-icons.css"></template>');
}
