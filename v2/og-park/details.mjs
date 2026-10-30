import {reviewSection} from './details-shared.mjs';
import {renderOfficialEventList,renderOfficialEventDetail} from './events.mjs';
import {renderContestScreen} from './contests.mjs';
import {renderInterestSelection,renderCommunityFeed} from './community.mjs';
export const parkDetailGroups=[
 {id:'park-events-group',label:'본사 이벤트 · 검토 대기',items:[{id:'park-events',label:'공식 이벤트 목록'},{id:'park-event-detail',label:'참여 방식·종료'}]},
 {id:'park-contests-group',label:'공모전 · 검토 대기',items:[{id:'park-contests',label:'공모전 목록'},{id:'park-contest-detail',label:'상세·참여 안내'},{id:'park-contest-judging',label:'심사 중·내 출품작'},{id:'park-contest-result',label:'수상 결과'}]},
 {id:'park-community-group',label:'커뮤니티 · 검토 대기',items:[{id:'park-community-interests',label:'관심 업종 선택'},{id:'park-community-feed',label:'게시글 목록'}]}
];
export function renderParkDetailsReview(){
 return '<link rel="stylesheet" href="/v2/og-park/details-review.css">'+[
  reviewSection('park-events','본사 이벤트 · 목록','매장별 이벤트와 구분한 공식 이벤트입니다. 기간·금액·참여 수는 화면 검토용 예시입니다.',[['events-list','공식 이벤트 목록',renderOfficialEventList()]]),
  reviewSection('park-event-detail','본사 이벤트 · 참여 방식','적립형 자동 참여·응모형·방문형·종료 상태를 함께 확인합니다. 방문 인증 세부 조건은 추후 확정합니다.',[['event-automatic','적립형 · 자동 참여 중',renderOfficialEventDetail('automatic')],['event-draw','응모형 · 참여 전',renderOfficialEventDetail('draw')],['event-visit','방문형 · 인증 전',renderOfficialEventDetail('visit')],['event-closed','이벤트 종료',renderOfficialEventDetail('closed')]]),
  reviewSection('park-contests','공모전 · 목록','사진·영상·그림 형식과 진행·심사·종료 분류를 보여줍니다. 날짜·보상·참여 수는 예시입니다.',[['contests-list','진행 중 · 공모전 목록',renderContestScreen('list')]]),
  reviewSection('park-contest-detail','공모전 · 상세','상품·참여 안내·출품작을 확인하는 화면입니다. 출품 입력 폼과 심사·저작권 세부 정책은 별도 확인이 필요합니다.',[['contest-detail','진행 중 · 출품 안내',renderContestScreen('detail')]]),
  reviewSection('park-contest-judging','공모전 · 심사 중','내 출품작을 상단에 표시하고, 출품 마감·심사·결과 발표 단계를 구분합니다.',[['contest-judging','심사 중 · 내 출품작',renderContestScreen('judging')]]),
  reviewSection('park-contest-result','공모전 · 수상 결과','내 수상 결과와 마일리지, 수상작을 보여줍니다. 수상 등수·금액은 예시입니다.',[['contest-result','종료 · 2등 수상 예시',renderContestScreen('result')]]),
  reviewSection('park-community-interests','커뮤니티 · 관심 업종 선택','수령한 업종 아이콘 23개를 사용했습니다. 기획서의 24개와 차이가 있어 나머지 업종은 확인이 필요합니다.',[['interest-empty','선택 전 · 건너뛰기 가능',renderInterestSelection('empty')],['interest-selected','3개 선택 · 한식·카페·헤어',renderInterestSelection('selected')],['interest-search','업종 검색 · 카페',renderInterestSelection('search')]]),
  reviewSection('park-community-feed','커뮤니티 · 게시글 목록','선택 업종 3개 탭·5km 범위·최신/인기 정렬과 회원점/일반 매장 태그를 확인합니다. 게시글 작성·상세는 이번 범위에 포함하지 않았습니다.',[['community-latest','최신순 · 회원점/일반 매장',renderCommunityFeed('latest')],['community-popular','인기순 · 정렬 비교',renderCommunityFeed('popular')],['community-empty','게시글 없는 상태',renderCommunityFeed('empty')]])
 ].join('');
}
export function setupParkDetails(root){
 for(const host of root.querySelectorAll('[data-park-detail-screen]')){
  if(host.shadowRoot)continue;
  const template=host.querySelector('template'),shadow=host.attachShadow({mode:'open'});shadow.append(template.content.cloneNode(true));template.remove();
  const screen=shadow.querySelector('.pd-screen');
  const resize=()=>{const scale=Math.min(1,host.clientWidth/390);screen.style.zoom=scale;host.style.height=Math.ceil(screen.offsetHeight*scale)+'px';};
  new ResizeObserver(resize).observe(host);new ResizeObserver(resize).observe(screen);
  for(const image of shadow.querySelectorAll('img'))if(!image.complete)image.addEventListener('load',resize,{once:true});
  resize();
 }
}
