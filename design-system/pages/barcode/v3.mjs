import {barcodeScreen} from './render.mjs';
export function barcodeV3Board(){
 const screen=barcodeScreen().replace('class="og-barcode-screen"','class="og-barcode-screen og-barcode-v3"');
 return '<section class="og-barcode-example"><h3 class="history-state-label">V3 · 기본 상태</h3><div class="screen-page-content"><div class="screen-artboard">'+screen+'</div><div class="screen-design-notes"><h3>내 정보의 본문 마감</h3><p>파란 상단 없이 밝은 회색 배경과 공통 흰 카드를 사용합니다. 경계·모서리·그림자는 내 정보와 같습니다.</p><h3>그라디언트 유지</h3><p>사용 가능 금액과 진행바에만 기존 브랜드 그라디언트를 유지합니다.</p><h3>높아진 바코드</h3><p>112px 높이와 넉넉한 스캔 영역. 기획 10페이지의 두 카드 구성을 유지하며 금액과 코드는 예시입니다.</p></div></div></section>';
}
