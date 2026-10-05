import {photoReviewBoard} from '../../design-system/pages/my-info/photo-review.mjs';
import {reviewWriteBoard} from '../../design-system/pages/my-info/review-write.mjs';
import {extractSourceScreens,renderSourceGallery,setupSourceGallery} from './source-review.mjs';
import {reviewMenu} from '../../design-system/pages/my-info/use-history.mjs';
import {renderActionMenu} from '../components/help.mjs';

const domains=[
 {
  id:'photo-review',title:'포토 리뷰',rootClass:'og-photo-review',board:photoReviewBoard,
  intro:'이용 내역과 작성한 포토 리뷰를 함께 확인합니다. 매장명은 배치 예시이며 사진은 공통 빈 이미지로 표시합니다.',
  states:[['basic','작성할 내역과 작성한 리뷰'],['no-photos','사진 없는 리뷰'],['empty','적립 내역이 없을 때'],['menu','리뷰 관리 · 열린 상태'],['delete','리뷰 삭제 확인']]
 },
 {
  id:'review-write',title:'사진 리뷰 등록',rootClass:'og-review-write',board:reviewWriteBoard,
  intro:'글·사진 작성 여부, 펼친 본문, 사진 선택과 등록 안내를 확인합니다. 사진 추가·카메라·삭제·저장은 실행되지 않습니다.',
  states:[['empty','입력 전'],['composed','글과 사진을 작성했을 때'],['expanded','리뷰 내용을 펼쳤을 때'],['selected','사진을 선택했을 때'],['unchanged','기존 리뷰 · 변경 전'],['source','사진 추가 · 선택 메뉴'],['help','사진 리뷰 등록 방법']]
 }
];

// Adapt action roles for v2 only; the original board and its state conditions stay intact.
function reviewActions(html,id,key){
 if(id==='photo-review'&&key==='menu')html=html.replace(reviewMenu(),()=>renderActionMenu());
 return html.replace(/<button\b[^>]*>[\s\S]*?<\/button>/g,button=>{
  if((button.includes('og-write-inline')&&button.includes('>add</span>'))||
     (button.includes('og-photo-action')&&button.includes('>photo_camera</span>')))
   return button.replace('data-variant="text"','data-variant="secondary" data-size="compact"');
  if(id==='review-write'&&button.includes('og-write-delete'))return button.replace('>delete</span>','>close</span>');
  if(id==='photo-review'&&key==='delete'&&button.includes('data-variant="primary"')&&button.endsWith('>확인</button>'))
   return button.replace('data-variant="primary"','data-variant="danger"').replace('>확인</button>','>삭제</button>');
  return button;
 });
}

export function renderReviewWritingReview(){
 return domains.map(({id,title,rootClass,board,intro,states})=>{
  const screens=extractSourceScreens(board(),rootClass);
  if(screens.length!==states.length)throw new Error('Source state count changed for '+id);
  return renderSourceGallery({id,title,intro,
   states:states.map(([key,label],index)=>({key,label,html:reviewActions(screens[index],id,key).replaceAll('회원점명','오시 망원본점')})),
   cssFiles:['/design-system/pages/my-info/'+id+'.css','/v2/my-info/review-writing.css']
  });
 }).join('');
}

export function setupReviewWritingReview(root){
 for(const {id} of domains)setupSourceGallery(root,id);
}
