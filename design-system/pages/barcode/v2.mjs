import {barcodeScreen} from './render.mjs';
// Reuse the exact original content and components; scope all visual changes to V2.
export function barcodeV2Board(){
 const screen=barcodeScreen().replace('class="og-barcode-screen"','class="og-barcode-screen og-barcode-v2"');
 return '<section class="og-barcode-example"><h3 class="history-state-label">V2 · 기본 상태</h3><div class="screen-page-content"><div class="screen-artboard">'+screen+'</div><div class="screen-design-notes"><h3>마일리지와 바코드의 역할 구분</h3><p>상단은 내 정보의 옅은 블루, 아래는 밝은 바코드 카드로 구분합니다.</p><h3>높아진 바코드</h3><p>바 높이 112px. 코드는 흰 바탕과 짙은 단색을 유지합니다.</p><h3>기존 구성 유지</h3><p>보유·사용 가능 금액, 진행바, 적립·사용 버튼과 안내는 원본과 같습니다. 숫자와 코드는 실제 회원 정보가 아닌 예시입니다.</p></div></div></section>';
}
