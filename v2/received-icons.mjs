import {renderFigmaNavigation} from './components/figma-navigation.mjs';
import {categoryItems} from '../design-system/pages/home/category-assets.mjs';
import {categoryArtwork,pinArtwork,categoryName} from './category-artwork.mjs';

const base='/assets/received-icons-20261017/';
const url=file=>base+file.split('/').map(encodeURIComponent).join('/');
const picture=(kind,file,extra='',size=24)=>`<img class="received-icon" data-received-icon="${kind}" src="${url(file)}" width="${size}" height="${size}" alt="" aria-hidden="true" decoding="async" ${extra}>`;
const categoryPicture=categoryArtwork;
const functions={search:'검색.svg',target:'현위치.svg',quick:'바로적립100.svg'};

// Adapt only the v2 rendering boundary. Original screen renderers, supplied files
// and historical v1/v2 MyLand frames stay unchanged.
export function applyReceivedIcons(source){
 let html=source;
 html=html.replace(/<button\b[^>]*class="[^"]*\bhome-store-pin\b[^"]*"[^>]*>[\s\S]*?<\/button>/g,button=>{
  const name=button.match(/data-preview="([^"]+)"/)?.[1];
  const category=({'오시 망원본점':'일식','밀랍(MILLAB)':'카페/베이커리','육감만족':'한식'})[name];
  if(!category)return button;
  const state=button.includes('v2-home-cafe-pin')?'on':'off';
  const art=pinArtwork(category,state,40,state==='on'?'v2-home-cafe-pin':'received-icon');
  return button.replace(/<span class="home-art [^"]*"[^>]*>[\s\S]*?<\/span>|<img class="v2-home-cafe-pin"[^>]*>/,art);
 });
 html=html.replace(/<span class="home-art home-art-(search|target|quick|utensils|rice|dumpling|sushi)"[^>]*>[\s\S]*?<\/span>/g,(_,name)=>{
  if(functions[name])return picture(name,'functions/'+functions[name]);
  return categoryPicture(({utensils:'전체',rice:'한식',dumpling:'중식',sushi:'일식'})[name]);
 });
 html=html.replace(/<nav class="(bottom-navigation|bottom-nav)"[^>]*>[\s\S]*?<\/nav>/g,(nav,family)=>{
  if(nav.includes('data-figma-navigation'))return nav;
  const selected=[...nav.matchAll(/<(?:button|div)\b([^>]*\bclass="[^"]*\bnav-item\b[^"]*"[^>]*)>([\s\S]*?)<\/(?:button|div)>/g)].find(item=>/\bis-selected\b|\bactive\b|aria-current="page"/.test(item[1]));
  const active=selected?.[2].match(/(?:<span>|<small>)([^<]+)<\/(?:span|small)>$/)?.[1]||'홈';
  const result=renderFigmaNavigation({active:active==='내 바코드'?'바코드':active,family});
  return nav.includes('<button inert')?result.replace('<nav ','<nav inert '):result;
 });
 html=html.replace(/<button\b[^>]*data-category-id="([^"]+)"[^>]*>[\s\S]*?<\/button>/g,(button,id)=>{
  const name=categoryItems.find(item=>item.id===id)?.name;
  return name?button.replace(/<img\b[^>]*>/,categoryPicture(name,20)):button;
 });
 // 칩·선택 시트·공통 샘플의 모든 업종을 같은 수령 SVG로 연결한다.
 html=html.replace(/<button\b[^>]*data-category="([^"]+)"[^>]*>[\s\S]*?<\/button>/g,(button,name)=>button.replace(/<img\b[^>]*>/,categoryPicture(categoryName(name),button.includes('figma-category-art')?20:24)));
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
 const figma='/assets/figma-home-20261020/';
 html=html.replace(/<span class="home-art home-art-location"[^>]*>[\s\S]*?<\/span>/g,'<img class="figma-search-location" src="'+figma+'30e02.svg" width="24" height="24" alt="">');
 html=html.replace(/(<button\b[^>]*class="home-search-submit"[^>]*)(>)/g,(_,head,end)=>head.replace('type="submit"','type="button"').replace('aria-label="매장 검색 실행"','aria-label="현 위치"')+(head.includes('data-preview=')?'':' data-preview="현 위치"')+end);
 const quickArt='<img class="figma-quick-glyph" src="'+figma+'ae1d9.svg" width="32" height="32" alt=""><img class="figma-quick-gloss" src="'+figma+'d146b.svg" width="40.1906" height="38.9596" alt="">';
 html=html.replace(/(<button\b[^>]*class="home-quick"[^>]*>)[\s\S]*?<\/button>/g,'$1'+quickArt+'</button>');
 html=html.replace(/<span class="quick">[\s\S]*?<\/span>/g,'<span class="quick" role="img" aria-label="바로적립">'+quickArt+'</span>');
 html=html.replace(/(<(?:button|span)\b[^>]*class="(?:home-locate|gps)"[^>]*>)[\s\S]*?<\/(button|span)>/g,'$1<img class="figma-location-glyph" src="'+figma+'aa166.svg" width="24" height="24" alt=""></$2>');
 return html.replaceAll('퀵적립','바로적립').replace(/(?:<link rel="stylesheet" href="\/v2\/received-icons\.css">)*<\/template>/g,'<link rel="stylesheet" href="/v2/received-icons.css"></template>');
}
