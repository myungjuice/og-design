import {homeScreen} from './render.mjs';
export function newGradientBoard(){
 return '<section class="og-home-example"><h3>신규 회원점 · 그라디언트 NEW</h3><div class="screen-page-content"><div class="screen-artboard og-depth-subtle og-new-gradient">'+homeScreen({state:'new'})+'</div><div class="screen-design-notes"><h3>색상만 비교</h3><p>기존 핀·배지 크기·위치·흰 테두리는 유지합니다. 내 정보의 금액 그라디언트를 배경에 적용했습니다.</p><h3>신규 표시 기준 유지</h3><p>기획 4페이지(표기03)의 등록 30일 이내 조건입니다. 지도와 회원점은 정적 예시이며 실제 판정 로직을 변경하지 않습니다.</p></div></div></section>';
}
