import {homeScreen} from './render.mjs';
export function newPlacementScreen(placement='pin'){
 const badge='<span class="og-map-new">NEW</span>';
 let screen=homeScreen({state:'new'});
 if(placement==='name')screen=screen.replace(badge,'').replace('<span class="og-map-name">','<span class="og-map-name">'+badge);
 return '<div class="og-depth-subtle og-new-gradient og-new-placement-'+(placement==='name'?'name':'pin')+'">'+screen+'</div>';
}
export function newPlacementBoard(){
 return '<p class="new-placement-intro">같은 지도·핀·그라디언트로 표시 위치만 비교합니다. 기존 시안은 변경하지 않았습니다.</p><div class="new-placement-pair">'+[['pin','A · 핀 위'],['name','B · 매장명 옆']].map(([kind,title])=>'<section><h3>'+title+'</h3>'+newPlacementScreen(kind)+'</section>').join('')+'</div><p class="new-placement-intro">B는 신규 정보를 매장 이름과 묶는 제안입니다. 특정 서비스 화면을 복제한 것이 아니며, 기획의 등록 30일 이내 NEW 조건은 유지합니다.</p>';
}
