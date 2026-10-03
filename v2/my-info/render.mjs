import {renderMyInfoTest} from '../../screens/my-info-3d-test/render.mjs';
import {renderMileage} from '../components/mileage.mjs';

export function renderMyInfoPreview(){
 const screen=renderMyInfoTest({assetBase:'/screens/my-info-3d-test/media/figma/',renderBalance:renderMileage});
 return `<p class="v2-intro">승인된 내정보 대표 화면입니다. 금액·프로필·방문 내역은 검토용 예시이며 버튼은 실제 서비스에 연결하지 않습니다.</p>
 <div class="v2-screen-stage"><div class="v2-screen-host"><template data-screen-template>
 <link rel="stylesheet" href="/screens/my-info-3d-test/styles.css">
 <link rel="stylesheet" href="/v2/components/mileage.css">
 <link rel="stylesheet" href="/v2/my-info/screen.css">${screen}
 <dialog id="preview-dialog" aria-labelledby="preview-title"><h2 id="preview-title"></h2><p id="preview-copy"></p><form method="dialog"><button class="preview-close" autofocus>닫기</button></form></dialog>
 </template></div></div>
 <p class="v2-screen-note">390 × 996 기준 · 기존 화면의 렌더러와 에셋 재사용 · 스타일을 격리하여 검토 메뉴에 영향을 주지 않습니다.</p>`;
}
