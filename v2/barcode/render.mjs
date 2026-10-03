import {renderBarcodeTest} from '../../screens/my-info-3d-test/barcode.mjs';
import {renderMileage} from '../components/mileage.mjs';
import {previewDialog} from '../components/screen-preview.mjs';

export function renderBarcodeScreen(props={}){
 return renderBarcodeTest({...props,renderBalance:renderMileage});
}
export function renderBarcodePreview(){
 return `<p class="v2-intro">마일리지 잔액과 회원 바코드를 확인하고, 적립·사용 메뉴로 이어지는 화면입니다.</p>
 <div class="v2-screen-stage"><div class="v2-screen-host"><template data-screen-template>
 <link rel="stylesheet" href="/screens/my-info-3d-test/styles.css">
 <link rel="stylesheet" href="/screens/my-info-3d-test/barcode.css">
 <link rel="stylesheet" href="/v2/components/mileage.css">
 <link rel="stylesheet" href="/v2/barcode/screen.css">
 ${renderBarcodeScreen()}${previewDialog}
 </template></div></div>`;
}
