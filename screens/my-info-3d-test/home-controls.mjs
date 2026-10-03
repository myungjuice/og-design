import {searchField} from '../../design-system/components/search/render.mjs';
import {homeArt} from './home-art.mjs';

export function renderHomeSearch({assetBase='./media/figma/',id='home-store-search'}={}){
 const art=(name,options={})=>homeArt(name,{...options,assetBase});
 const search=searchField({id,label:'매장 검색',placeholder:'매장명으로 검색해 주세요.',className:'home-search',attributes:{'aria-label':'매장 검색'}});
 return '<form class="home-search-form" role="search">'+art('search')+search+'<button type="submit" class="home-search-submit" aria-label="매장 검색 실행">'+art('location',{width:24})+'</button></form>';
}
export function renderHomeCategories({assetBase='./media/figma/',active='전체'}={}){
 const categories=[['전체','utensils'],['한식','rice'],['중식','dumpling'],['일식','sushi']];
 return '<div class="home-categories" aria-label="매장 업종">'+categories.map(([label,art])=>'<button type="button" class="home-category" data-category="'+label+'" aria-pressed="'+(label===active)+'">'+homeArt(art,{width:22,assetBase})+'<span>'+label+'</span></button>').join('')+'<button type="button" class="home-category home-category-more" data-preview="업종 더 보기">+ 더 보기</button></div>';
}
