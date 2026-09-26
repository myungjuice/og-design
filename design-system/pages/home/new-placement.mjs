import {publicStoreData} from './public-store-data.mjs';
import {publicServicesData} from './public-services-data.mjs';
import {publicPostsData} from './public-posts-data.mjs';
import {escapeHTML} from '../../components/core.mjs';
import {homeScreen} from './render.mjs';
export function newPlacementScreen(placement='pin'){
 const badge='<span class="og-map-new">NEW</span>';
 let screen=homeScreen({state:'new'});
 const names=[publicStoreData.store.name,publicServicesData.store.name,publicPostsData.store.name];let index=0;
 screen=screen.replace(/(<span class="og-map-name">)[^<]+/g,(_,start)=>start+escapeHTML(names[index++]));
 const besideName=placement==='name'||placement==='name-ko';
 if(besideName)screen=screen.replace(badge,'').replace('<span class="og-map-name">','<span class="og-map-name">'+(placement==='name-ko'?badge.replace('NEW','신규'):badge));
 return '<div class="og-depth-subtle og-new-gradient og-new-placement-'+(besideName?'name':'pin')+'">'+screen+'</div>';
}
export function newPlacementBoard(){
 return '<p class="new-placement-intro">같은 지도·핀·그라디언트로 위치와 문구를 비교합니다. A/B는 유지하고 C는 B의 NEW만 신규로 바꿨습니다.</p><div class="new-placement-pair">'+[['pin','A · 핀 위'],['name','B · 매장명 옆'],['name-ko','C · 매장명 옆 · 신규']].map(([kind,title])=>'<section><h3>'+title+'</h3>'+newPlacementScreen(kind)+'</section>').join('')+'</div><p class="new-placement-intro">B/C는 신규 정보를 매장 이름과 묶는 제안입니다. C의 신규는 기획의 NEW 문구를 한글로 바꾼 비교 제안이며, 등록 30일 이내 조건은 유지합니다. 가게명은 개발 DB 공개 스냅샷이며 지도 위치·업종 핀·신규 여부는 배치 예시입니다.</p>';
}
