import {renderMyInfoTest} from '../../screens/my-info-3d-test/render.mjs';
import {renderMileage} from '../components/mileage.mjs';
import {previewDialog} from '../components/screen-preview.mjs';
export {renderMileageHistoryReview} from './mileage.mjs';
export {renderUseHistoryReview} from './use-history.mjs';
export {renderReservationDetailReview} from './reservation-detail.mjs';
export {renderReservationChangeReview} from './reservation-change.mjs';
export {renderReservationPickersReview} from './reservation-pickers.mjs';
export {renderWaitingDetailReview} from './waiting-detail.mjs';
export {renderWaitingDialogsReview} from './waiting-dialogs.mjs';
export {renderReviewHistoryReview} from './review-history.mjs';
export {renderNoticesReview} from './notices.mjs';
export {renderNoticeDetailReview} from './notice-detail.mjs';
export {renderAccountSettingsReview} from './account-settings.mjs';
export {renderSupportPagesReview} from './support-pages.mjs';
export {renderReviewWritingReview} from './review-writing.mjs';
export {renderCharacterReview} from './character.mjs';

export function renderMyInfoPreview(){
 const screen=renderMyInfoTest({assetBase:'/screens/my-info-3d-test/media/figma/',renderBalance:renderMileage});
 return `<p class="v2-intro">마일리지와 최근 방문 내역, 주요 메뉴를 한눈에 확인하는 화면입니다.</p>
 <div class="v2-screen-stage"><div class="v2-screen-host"><template data-screen-template>
 <link rel="stylesheet" href="/screens/my-info-3d-test/styles.css">
 <link rel="stylesheet" href="/v2/components/mileage.css">
 <link rel="stylesheet" href="/v2/my-info/screen.css">
 <link rel="stylesheet" href="/v2/components/bottom-navigation.css">${screen}
 ${previewDialog}
 </template></div></div>`;
}
