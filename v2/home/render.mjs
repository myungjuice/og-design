import {renderHomeTest} from '../../screens/my-info-3d-test/home.mjs';
import {previewDialog} from '../components/screen-preview.mjs';

export function renderHomePreview(){
 return `<p class="v2-intro">지도에서 주변 매장을 찾고, 업종별로 탐색하는 화면입니다.</p>
 <div class="v2-screen-stage"><div class="v2-screen-host"><template data-screen-template>
 <link rel="stylesheet" href="/screens/my-info-3d-test/styles.css">
 <link rel="stylesheet" href="/screens/my-info-3d-test/home.css">
 <link rel="stylesheet" href="/v2/home/screen.css">
 <link rel="stylesheet" href="/v2/components/bottom-navigation.css">
 ${renderHomeTest({assetBase:'/screens/my-info-3d-test/media/figma/'})}${previewDialog}
 </template></div></div>`;
}
