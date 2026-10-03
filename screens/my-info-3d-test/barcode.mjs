import {surface} from '../../design-system/components/surfaces/render.mjs';
import {button} from '../../design-system/components/button/render.mjs';
import {renderMileageCard} from './mileage-card.mjs';
import {barcodeSample} from './barcode-sample.mjs';
const mapImage=new URL('../../design-system/pages/home/media/naver-mangwon.png',import.meta.url).href;
export function renderBarcodeTest({available=15000,total=16000,shared=1250}={}){
 const empty=available<=0;
 const actions=button({label:'영수증 적립',variant:'secondary',className:'barcode-action barcode-earn',attributes:{'data-preview':'영수증 적립'}})+button({label:'마일리지 사용',className:'barcode-action barcode-use',disabled:empty,attributes:{'data-preview':'마일리지 사용','aria-describedby':empty?'barcode-empty-hint':undefined}});
 const code=surface({className:'barcode-code-card',contentHTML:'<h2>내 바코드</h2><div class="barcode-code">'+barcodeSample+'</div><p class="barcode-member-number">OG 0000 0000 0000 0000</p><div class="barcode-actions">'+actions+'</div>'+(empty?'<p class="barcode-empty-hint" id="barcode-empty-hint">사용 가능한 마일리지가 없어 지금은 적립만 가능합니다.</p>':'')});
 return '<section class="barcode-test" id="barcode-3d" aria-label="바코드 디자인 테스트"><div class="barcode-map-backdrop" aria-hidden="true"><img src="'+mapImage+'" width="1674" height="2000" alt="" decoding="async"></div><div class="barcode-sheet-scrim" aria-hidden="true"></div><button type="button" class="barcode-reopen" data-barcode-sheet="open" hidden>바코드 다시 보기</button><section class="barcode-sheet" aria-label="바코드"><header class="barcode-sheet-header"><span class="barcode-sheet-handle" aria-hidden="true"></span><button type="button" class="barcode-close icon-button" data-barcode-sheet="close" aria-label="바코드 닫기"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button></header><div class="barcode-content">'+renderMileageCard({available,total,shared})+code+'<button type="button" class="barcode-guide" data-preview="마일리지 적립/사용 안내">마일리지 적립/사용 안내 <span aria-hidden="true">›</span></button></div></section></section>';
}
