import {searchField} from '../../design-system/components/search/render.mjs';
import {renderFigmaNavigation} from '../components/figma-navigation.mjs';
import {categoryArtwork,pinArtwork} from '../category-artwork.mjs';
import {escapeHTML as e} from '../../design-system/components/core.mjs';
import {renderLandmarkPart} from './landmark-art.mjs';
const assets='/assets/figma-home-20261020/';
const image=(file,cls='',width,height=width,extra='')=>`<img class="${cls}" src="${assets+file}"${width?` width="${width}" height="${height}"`:''} alt="" aria-hidden="true" ${extra}>`;
const categories=['한식','중식','일식','양식','카페/베이커리'];

export function renderFigmaHomeSearch({id='home-store-search'}={}){
 const field=searchField({id,label:'매장 검색',placeholder:'매장명으로 검색해 주세요.',className:'home-search',attributes:{'aria-label':'매장 검색'}});
 return `<form class="home-search-form" role="search">${image('adbac.svg','figma-search-icon',20)}${field}<button type="button" class="home-search-submit" data-preview="현 위치" aria-label="현 위치">${image('30e02.svg','figma-search-location',24)}</button></form>`;
}
export function renderFigmaHomeCategories(){
 return `<div class="v2-home-category-row"><div class="home-categories" aria-label="매장 업종">${categories.map(name=>`<button type="button" class="home-category" data-category="${name}" aria-pressed="false"><span class="figma-category-art">${categoryArtwork(name,20)}</span><span>${name}</span></button>`).join('')}</div><button type="button" class="home-category home-category-more" data-preview="업종 더 보기">+ 더보기</button></div>`;
}
export const figmaHomeStyles=['/screens/my-info-3d-test/styles.css','/screens/my-info-3d-test/home.css','/v2/home/screen.css','/v2/components/bottom-navigation.css','/v2/home/figma-home.css','/v2/home/new-stores.css','/v2/home/landmarks.css'];
export function renderHomeNewStoreMark(style){
 if(!['sprout','ribbon','paper'].includes(style))return '';
 return `<span class="home-new-mark home-new-${style}" data-home-new-mark="${style}" aria-hidden="true"><i></i><i></i><i></i></span>`;
}
export function renderFigmaHome({newStores=[],showStoreLabels=false,newStoreStyle='badge',landmarkStores=[],landmarkStyle='crown'}={}){
 const html=`<section class="home-test" data-figma-home aria-label="홈 디자인 시안"><div class="home-map">${image('f196c.png','home-map-ground',390,846)}<div class="home-map-controls">${renderFigmaHomeSearch()}${renderFigmaHomeCategories()}</div><div class="home-map-pins"><button type="button" class="figma-map-pin figma-map-pin-selected" data-preview="파샤도 망원" aria-label="선택한 매장 보기">${pinArtwork('한식','on',33.6)}</button><button type="button" class="figma-map-pin figma-map-pin-first" data-preview="세븐일레븐" aria-label="매장 위치 보기">${pinArtwork('한식','off',24)}</button><button type="button" class="figma-map-pin figma-map-pin-second" data-preview="삼호가든" aria-label="매장 위치 보기">${pinArtwork('한식','off',24)}</button></div><div class="home-map-actions"><button type="button" class="home-locate" data-preview="현 위치" aria-label="현 위치">${image('aa166.svg','',24)}</button><button type="button" class="home-quick" data-preview="바로적립" aria-label="바로적립">${image('ae1d9.svg','figma-quick-glyph',32)}${image('d146b.svg','figma-quick-gloss',40.1906,38.9596)}</button></div><button type="button" class="home-explore" data-preview="현 지도 위치 둘러보기">${image('2e216.svg','',16)}<span>현 지도 위치 둘러보기</span></button></div>${renderFigmaNavigation({active:'홈'})}</section>`;
 if(!newStores.length&&!landmarkStores.length&&!showStoreLabels)return html;
 return html.replace('data-figma-home','data-figma-home data-home-new-stores').replace(/(<button\b[^>]*class="figma-map-pin[^"]*"[^>]*>)([\s\S]*?)(<\/button>)/g,(_,opening,art,closing)=>{
  const name=opening.match(/data-preview="([^"]+)"/)[1],isNew=newStores.includes(name),isLandmark=landmarkStores.includes(name);
  const mark=isNew?renderHomeNewStoreMark(newStoreStyle):'';
  const landmark=isLandmark?renderLandmarkPart(landmarkStyle)||renderLandmarkPart('crown'):'';
  const label=showStoreLabels||isNew||isLandmark?`<span class="home-store-label" aria-hidden="true"><span class="home-store-name">${e(name)}</span>${isNew&&!mark?'<span class="home-new-badge">NEW</span>':''}</span>`:'';
  const accessibleName=label?`${name}${isNew?' · 신규 회원점':''}${isLandmark?' · 랜드마크 매장':''} 보기`:null;
  const button=opening.replace('class="figma-map-pin',`class="figma-map-pin${mark?' home-new-pin':''}${landmark?' home-landmark-pin':''}`);
  return (accessibleName?button.replace(/aria-label="[^"]+"/,`aria-label="${e(accessibleName)}"`):button)+art+mark+landmark+label+closing;
 });
}
