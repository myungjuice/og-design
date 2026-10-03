import {escapeHTML as e} from '../../design-system/components/core.mjs';
import {searchField} from '../../design-system/components/search/render.mjs';
import {publicStoreData} from '../../design-system/pages/home/public-store-data.mjs';
import {publicServicesData} from '../../design-system/pages/home/public-services-data.mjs';
import {publicPostsData} from '../../design-system/pages/home/public-posts-data.mjs';
import {homeArt} from './home-art.mjs';
import {renderBottomNavigation} from './navigation.mjs';
import {renderStatusBar,renderHomeIndicator} from './mobile-chrome.mjs';
const mapImage=new URL('../../design-system/pages/home/media/naver-mangwon.png',import.meta.url).href;
const stores=[
 {name:publicStoreData.store.name,art:'dining',x:30,y:26},
 {name:publicServicesData.store.name,art:'coffee',x:70,y:47},
 {name:publicPostsData.store.name,art:'dining',x:32,y:73},
];
export function renderHomeTest(){
 const search=searchField({id:'home-store-search',label:'매장 검색',placeholder:'매장명으로 검색해 주세요.',className:'home-search',attributes:{'aria-label':'매장 검색'}});
 const categories=[['전체','utensils'],['한식','rice'],['중식','dumpling'],['일식','sushi']];
 return '<section class="home-test" aria-label="홈 디자인 테스트">'+renderStatusBar()+'<div class="home-map"><img class="home-map-ground" src="'+e(mapImage)+'" width="1674" height="2000" alt="망원동 네이버지도 정적 배경" decoding="async" draggable="false"><div class="home-map-controls"><form class="home-search-form" role="search">'+homeArt('search')+search+'<button type="submit" class="home-search-submit" aria-label="매장 검색 실행">'+homeArt('location',{width:24})+'</button></form><div class="home-categories" aria-label="매장 업종">'+categories.map(([label,art],index)=>'<button type="button" class="home-category" data-category="'+label+'" aria-pressed="'+(index===0)+'">'+homeArt(art,{width:22})+'<span>'+label+'</span></button>').join('')+'<button type="button" class="home-category home-category-more" data-preview="업종 더 보기">+ 더 보기</button></div></div><div class="home-map-pins">'+stores.map(store=>'<button type="button" class="home-store-pin" data-preview="'+e(store.name)+'" aria-label="'+e(store.name)+' 매장 보기" style="--pin-x:'+store.x+'%;--pin-y:'+store.y+'%">'+homeArt(store.art,{width:26})+'<span class="home-store-name">'+e(store.name)+'</span></button>').join('')+'<span class="home-current-pin" role="img" aria-label="현 위치 표시 예시">'+homeArt('current',{width:40})+'</span></div><div class="home-map-actions"><button type="button" class="home-locate" data-preview="현 위치" aria-label="현 위치">'+homeArt('target',{width:28})+'</button><button type="button" class="home-quick" data-preview="퀵적립" aria-label="퀵적립">'+homeArt('quick',{width:30})+'<span>퀵적립</span></button></div><button type="button" class="home-explore" data-preview="현 지도 위치 둘러보기" aria-label="현 지도 위치 둘러보기">'+homeArt('search',{width:22})+'<span>현 지도 위치 둘러보기</span></button><small class="home-map-credit">© NAVER Corp.</small></div>'+renderBottomNavigation({active:'홈',home:true})+renderHomeIndicator()+'</section>';
}
