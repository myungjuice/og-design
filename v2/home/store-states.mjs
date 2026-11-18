import {publicStoreData} from '../../design-system/pages/home/public-store-data.mjs';
import {renderSnackbar} from '../components/snackbar.mjs';
import {renderFeedback} from '../components/feedback.mjs';
import {renderLoadingFrame} from '../components/loading.mjs';
import {renderHomeStoreContent} from './store.mjs';
import {renderHomeStoreReservationSection} from './store-reservation.mjs';
import {renderHomeStoreWaitingSection} from './store-waiting.mjs';
import {renderHomeStoreInfoScreen} from './information.mjs';
import {remainingGallery} from './remaining-gallery.mjs';

function receipt(screen,message,action=''){
 return screen+'<div class="v2-store-receipt" inert>'+renderSnackbar({message,action,state:action?'default':'success'})+'</div>';
}

function bookmark(selected){
 const store={...publicStoreData.store,bookmarked:selected};
 return receipt(renderHomeStoreContent({store,info:publicStoreData.info}),selected?'찜에 추가했어요.':'찜을 해제했어요.',selected?'':'실행 취소');
}

const loading=()=>renderLoadingFrame({
 label:'매장 사진과 소개 불러오는 중',
 className:'v2-store-loading',
 skeletonHTML:'<div class="og-skeleton" data-shape="photo"></div><div class="og-skeleton" data-shape="title"></div><div class="og-skeleton" data-shape="text"></div>'
});

const examples=[
 ['favorite','찜 추가',()=>bookmark(true)],
 ['unfavorite','찜 해제 · 실행 취소',()=>bookmark(false)],
 ['link','매장 링크 복사 완료',()=>receipt(renderHomeStoreContent(),'매장 링크를 복사했어요.')],
 ['address','주소 복사 완료',()=>receipt(renderHomeStoreInfoScreen(),'주소를 복사했어요.')],
 ['reservation','예약 처리 중',()=>renderHomeStoreContent({availability:{reserve:true,wait:true,menu:true},selectedSection:2,contentHTML:renderHomeStoreReservationSection({busy:true}),bodyLabel:'예약 처리 중'})],
 ['waiting','웨이팅 등록 중',()=>renderHomeStoreContent({availability:{reserve:true,wait:true,menu:true},selectedSection:2,contentHTML:renderHomeStoreWaitingSection({busy:true}),bodyLabel:'웨이팅 등록 중'})],
 ['loading','매장 상세 불러오는 중',()=>renderHomeStoreContent({contentHTML:loading(),bodyLabel:'매장 사진과 소개 불러오는 중'})],
 ['error','매장 상세 불러오기 실패',()=>renderHomeStoreContent({contentHTML:renderFeedback({kind:'error'}).replace('<button ','<button inert '),bodyLabel:'매장 상세 오류 안내'})]
];

export function renderStoreStatesReview(){
 return remainingGallery({
  id:'store-states',title:'동작 후 상태 예시',copy:'매장 상세에서 찜·복사·접수 후의 안내와 사진·소개를 불러올 때의 화면을 비교합니다.',
  states:examples,
  screen:({state})=>`<div class="v2-home-store-frame v2-store-state-example" data-example="${state}">${examples.find(([id])=>id===state)[2]()}</div>`,
  styles:['icon-button','media','snackbar','button','feedback','loading','surfaces','section-heading'].map(name=>'/v2/components/'+name+'.css').concat(['/v2/home/store.css','/v2/home/information.css','/v2/home/store-reservation.css','/v2/home/store-waiting.css','/v2/home/store-states.css'])
 });
}
