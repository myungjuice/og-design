import {searchField} from '../../design-system/components/search/render.mjs';
import {renderFigmaNavigation} from '../components/figma-navigation.mjs';
const assets='/assets/figma-home-20261020/';
const image=(file,cls='',width,height=width,extra='')=>`<img class="${cls}" src="${assets+file}"${width?` width="${width}" height="${height}"`:''} alt="" aria-hidden="true" ${extra}>`;
const categories=[['한식','2f4c8.svg'],['중식','7ac3e.svg'],['일식','af4e4.svg'],['양식','e55cc.svg'],['카페/베이커리','e2ad3.svg']];
function pin(file,mask,cls){return `<span class="figma-pin-layer ${cls}"><span class="figma-pin-mask" style="--figma-pin-mask:url('${assets+mask}')">${image(file)}</span></span>`;}

export function renderFigmaHomeSearch({id='home-store-search'}={}){
 const field=searchField({id,label:'매장 검색',placeholder:'매장명으로 검색해 주세요.',className:'home-search',attributes:{'aria-label':'매장 검색'}});
 return `<form class="home-search-form" role="search">${image('adbac.svg','figma-search-icon',20)}${field}<button type="button" class="home-search-submit" data-preview="현 위치" aria-label="현 위치">${image('30e02.svg','figma-search-location',24)}</button></form>`;
}
export function renderFigmaHomeCategories(){
 return `<div class="v2-home-category-row"><div class="home-categories" aria-label="매장 업종">${categories.map(([name,file])=>`<button type="button" class="home-category" data-category="${name}" aria-pressed="false"><span class="figma-category-art">${image(file,'',20)}</span><span>${name}</span></button>`).join('')}</div><button type="button" class="home-category home-category-more" data-preview="업종 더 보기">+ 더보기</button></div>`;
}
export const figmaHomeStyles=['/screens/my-info-3d-test/styles.css','/screens/my-info-3d-test/home.css','/v2/home/screen.css','/v2/components/bottom-navigation.css','/v2/home/figma-home.css'];
export function renderFigmaHome(){
 return `<section class="home-test" data-figma-home aria-label="홈 디자인 시안"><div class="home-map">${image('f196c.png','home-map-ground',390,846)}<div class="home-map-controls">${renderFigmaHomeSearch()}${renderFigmaHomeCategories()}</div><div class="home-map-pins"><button type="button" class="figma-map-pin figma-map-pin-selected" data-preview="파샤도 망원" aria-label="선택한 매장 보기">${pin('55e99.svg','149e5.svg','figma-pin-on')}</button><button type="button" class="figma-map-pin figma-map-pin-first" data-preview="세븐일레븐" aria-label="매장 위치 보기">${pin('3679c.svg','b53b1.svg','figma-pin-off-first')}</button><button type="button" class="figma-map-pin figma-map-pin-second" data-preview="삼호가든" aria-label="매장 위치 보기">${pin('e20b7.svg','b53b1.svg','figma-pin-off-second')}</button></div><div class="home-map-actions"><button type="button" class="home-locate" data-preview="현 위치" aria-label="현 위치">${image('aa166.svg','',24)}</button><button type="button" class="home-quick" data-preview="바로적립" aria-label="바로적립">${image('ae1d9.svg','figma-quick-glyph',32)}${image('d146b.svg','figma-quick-gloss',40.1906,38.9596)}</button></div><button type="button" class="home-explore" data-preview="현 지도 위치 둘러보기">${image('2e216.svg','',16)}<span>현 지도 위치 둘러보기</span></button></div>${renderFigmaNavigation({active:'홈'})}</section>`;
}
