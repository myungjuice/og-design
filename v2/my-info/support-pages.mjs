import {support,supportBoard} from '../../design-system/pages/my-info/support.mjs';
import {dialog} from '../../design-system/components/index.mjs';
import {icon} from '../../design-system/components/core.mjs';
import {faqBoard} from '../../design-system/pages/my-info/faq.mjs';
import {opinionBoard} from '../../design-system/pages/my-info/opinion.mjs';
import {customerCenterBoard} from '../../design-system/pages/my-info/customer-center.mjs';
import {policiesBoard} from '../../design-system/pages/my-info/policies.mjs';
import {policyDetailBoard} from '../../design-system/pages/my-info/policy-detail.mjs';
import {renderThumbnail} from '../components/media.mjs';
import {extractSourceScreens,renderSourceGallery,setupSourceGallery} from './source-review.mjs';

// The source board owns every menu, field, condition and document specimen.
// A labelled empty thumbnail makes the two-attachment state visible without a photo request.
function opinionSource(){
 const placeholder='v2-opinion-attachment-placeholder';
 return opinionBoard({imageSrc:placeholder}).replace(
  /<img src="v2-opinion-attachment-placeholder" alt="첨부 이미지 예시">/g,
  ()=>renderThumbnail({state:'empty',ratio:'wide',alt:'첨부 이미지 예시'})
 );
}
const pages=[
 {id:'support',title:'문의하기',intro:'문의 메뉴와 전화 안내, 로그인 여부에 따른 메뉴를 확인합니다.',board:supportBoard,rootClass:'og-support',
  states:[['basic','기본 상태'],['notification','문의 알림 배지가 있을 때'],['guest','로그인하지 않았을 때'],['confirm','1:1 상담 문의 · 이동 확인']]},
 {id:'faq',title:'자주 묻는 질문',intro:'자주 찾는 도움말과 분류별 질문, 펼쳐진 답변을 확인합니다.',board:faqBoard,rootClass:'og-faq',
  states:[['basic','기본 상태'],['best','도움말을 선택했을 때'],['category','카테고리를 선택했을 때'],['answer','답변을 펼쳤을 때']]},
 {id:'opinion',title:'의견보내기',intro:'의견 입력과 사진 첨부, 문의 내역과 답변을 확인합니다.',board:opinionSource,rootClass:'og-opinion',
  states:[['empty','입력 전'],['filled','입력 완료'],['photos','사진을 첨부했을 때'],['records','답변 목록'],['answered','답변을 펼쳤을 때'],['processing','처리 중인 문의를 펼쳤을 때'],['no-records','문의 내역이 없을 때']]},
 {id:'customer-center',title:'고객 센터',intro:'전화번호와 이메일, 위치 안내와 회사 정보를 확인합니다.',board:customerCenterBoard,rootClass:'og-customer-center',
  states:[['basic','기본 상태']]},
 {id:'policies',title:'약관 및 정책',intro:'문서 목록과 긴 문서명의 줄바꿈을 확인합니다.',board:policiesBoard,rootClass:'og-policies',
  states:[['basic','기본 상태'],['long','문서명이 길 때']]},
 {id:'policy-detail',title:'약관 및 정책 상세',intro:'문서 제목과 본문, 긴 문서의 읽기 흐름을 확인합니다.',board:policyDetailBoard,rootClass:'og-policy-detail',
  states:[['basic','기본 상태'],['long','제목과 본문이 길 때']]}
];

export function renderSupportPagesReview(){
 return pages.map(({id,title,intro,board,rootClass,states})=>{
  const screens=extractSourceScreens(board(),rootClass);
  if(screens.length!==states.length)throw new Error(id+' source specimens changed: '+screens.length);
  const specimens=states.map(([key,label],index)=>({key,label,html:screens[index].replace(/카카로 앱/g,'카카오톡 앱')}));
  if(id==='support')specimens.push({key:'access',label:'접근 권한 안내 · 확인창',html:accessSpecimen()});
  return renderSourceGallery({id,title,intro,states:specimens,
   cssFiles:['/design-system/pages/my-info/'+id+'.css','/v2/my-info/support-pages.css']});
 }).join('');
}
function accessSpecimen(){
 const items=[['photo_camera','카메라/갤러리','리뷰 등록·고객 문의 시 사진 첨부'],['location_on','위치','내 위치 기반 지도 조회'],['notifications_none','알림','적립·사용 및 기타 안내 알림']];
 const body='<div class="og-dialog-body v2-access-body" role="region" aria-label="접근 권한 안내 내용" tabindex="0"><p>서비스 제공에 사용하는 접근 권한을 안내합니다.</p><ul>'+items.map(([name,title,text])=>'<li>'+icon(name)+'<div><strong>'+title+' <span>(선택)</span></strong><p>'+text+'</p></div></li>').join('')+'</ul><p class="v2-access-note">권한 동의는 해당 기능을 사용할 때 확인합니다. 허용하지 않아도 앱의 다른 기능은 이용할 수 있습니다.</p></div>';
 const panel=dialog({title:'접근 권한 안내',bodyHTML:body,actions:[{label:'확인'}]});
 return support().replace(/<\/section>$/,'<div class="og-support-overlay v2-access-overlay">'+panel+'</div></section>');
}
export function setupSupportPagesReview(root){
 for(const {id} of pages)setupSourceGallery(root,id);
}
