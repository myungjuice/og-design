import {bottomNavigation} from '../../components/app-shell/render.mjs';
import {searchField} from '../../components/search/render.mjs';
import {chip} from '../../components/tabs-chips/render.mjs';
import {iconButton,button} from '../../components/button/render.mjs';
import {escapeHTML as e} from '../../components/core.mjs';
import {legacyMarkers} from './legacy-markers.mjs';

// Official Naver Map download, Mangwon-dong, 2026-09-20. Static design reference.
const mapImage=new URL('./media/naver-mangwon.png',import.meta.url).href;
function mapGround(){return '<img class="og-home-ground" src="'+e(mapImage)+'" alt="망원동 네이버지도" width="1674" height="2000" decoding="async" draggable="false"><span class="og-home-map-credit">© NAVER Corp.</span>';}
export function homeScreen({state='default',selectedCategory='',markerSrc=''}={}){
 const zoomed=state==='cluster';
 const markers=zoomed?[['22',27,33],['6',73,48],['3',38,69]].map(([n,x,y])=>`<span class="og-map-cluster" style="left:${x}%;top:${y}%">${n}</span>`).join(''):
 [['CI1001',28,29],['CI1002',69,40],['CI1000',36,63]].map(([id,x,y],i)=>`<div class="og-map-marker" style="left:${x}%;top:${y}%"><div class="og-map-pin"><img src="${markerSrc||legacyMarkers[id]}" alt="" width="40" height="50">${state==='new'&&i===0?'<span class="og-map-new">NEW</span>':''}</div><span class="og-map-name">${i===0?'회원점명':i===1?'다른 회원점':'회원점명'}</span></div>`).join('');
 return `<div class="og-home" data-home-state="${e(state)}" inert aria-label="홈 지도 정적 시안"><div class="og-home-map">${mapGround()}${markers}<span class="og-home-location" aria-label="현 위치"></span><div class="og-home-top">${searchField({label:'매장 검색',placeholder:'매장명으로 검색해 주세요.'})}<div class="og-home-filters">${['전체','한식','중식',selectedCategory||'일식'].map((label,i)=>chip({label,selected:selectedCategory?i===3:i===0})).join('')}${iconButton({name:'expand_more',label:'업종 더 보기'})}</div></div><div class="og-home-locate">${iconButton({name:'my_location',label:'현 위치'})}</div><div class="og-home-explore">${button({label:'현 지도 위치 둘러보기',variant:'secondary'})}</div></div>${bottomNavigation({active:'홈'})}</div>`;
}
export function homeBoard(){return [['default','기본 지도','기존 핀을 유지하고 검색창과 필터를 지도 위에 정돈했습니다.'],['cluster','지도를 축소했을 때','회원점이 모인 곳은 숫자로 묶어 표시합니다.'],['new','신규 회원점이 있을 때','NEW 배지를 핀 위에 붙여 업종 그림을 가리지 않게 했습니다.']].map(([state,title,copy])=>`<section class="og-home-example"><h3>${title}</h3><div class="screen-page-content"><div class="screen-artboard">${homeScreen({state})}</div><div class="screen-design-notes"><p>${copy}</p></div></div></section>`).join('');}
