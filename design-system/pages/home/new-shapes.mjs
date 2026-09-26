import {homeScreen} from './render.mjs';
export function newShapeBoard(kind='tab'){
 const tab=kind==='tab',name=tab?'작은 탭형':'입체 스티커형';
 return '<section class="og-home-example"><h3>신규 회원점 · '+name+'</h3><div class="screen-page-content"><div class="screen-artboard og-depth-subtle og-new-'+(tab?'tab':'sticker')+'">'+homeScreen({state:'new'})+'</div><div class="screen-design-notes"><h3>'+name+'</h3><p>'+(tab?'작고 각진 이름표 형태와 짧은 연결부로 핀에 붙은 느낌을 줍니다.':'흰 가장자리와 짧은 아래쪽 두께, 살짝 기울어진 형태로 붙인 스티커의 입체감을 줍니다.')+'</p><h3>기존 화면 보존</h3><p>동일한 지도·핀·브랜드 그라디언트로 형태만 비교합니다. 신규 기준은 기획 4페이지(표기03)의 등록 30일 이내입니다.</p></div></div></section>';
}
