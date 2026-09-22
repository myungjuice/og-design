import test from 'node:test';
import assert from 'node:assert/strict';
import {useHistory,useHistoryBoard} from './use-history.mjs';
test('four static tabs share sheet, tabs, cards and navigation links',()=>{
 for(let selected=0;selected<4;selected++){
 const html=useHistory({selected});
 assert.match(html,/inert/);assert.match(html,/og-sheet-panel/);assert.equal((html.match(/role="tab"/g)||[]).length,4);
 assert.match(html,/og-surface/);if(selected<3)assert.match(html,/og-badge/);
 }
});
test('board separates default and past-history states',()=>{
 const html=useHistoryBoard();
 assert.equal((html.match(/class="og-use-history og-history-screen"/g)||[]).length,8);
 assert.match(html,/no_search.png/);
 assert.throws(()=>useHistory({selected:4}),RangeError);
});

test('history preserves store thumbnails and past-record controls',()=>{
 for(let selected=0;selected<4;selected++){
  const html=useHistory({selected});
  assert.match(html,/og-thumbnail/);
  if(selected<3)assert.match(html,/과거 내역 보기/);
 }
});
test('finished reservations and waiting do not invent detail actions',()=>{
 assert.equal((useHistory({selected:0}).match(/>예약 상세 보기</g)||[]).length,1);
 assert.doesNotMatch(useHistory({selected:1}),/>웨이팅 상세 보기</);
});
test('reviews retain photo content and edit-delete affordances',()=>{
 const html=useHistory({selected:3});
 assert.match(html,/리뷰 사진/);
 assert.match(html,/리뷰 관리/);
 assert.doesNotMatch(html,/>리뷰 보기</);
});

test('legacy copy and default past filter are preserved',()=>{
 const reservation=useHistory({selected:0});
 assert.match(reservation,/>확정</);
 assert.doesNotMatch(reservation,/>예약 확정<|>이용 완료<|role="switch" checked/);
 const waiting=useHistory({selected:1});
 assert.match(waiting,/>대기중</);
 assert.match(waiting,/대기시간:/);
 assert.match(useHistory({selected:2}),/>주문상세</);
 const board=useHistoryBoard();
 assert.match(board,/>입장</);assert.match(board,/>입장완료</);
 assert.match(board,/>매장 취소</);assert.match(board,/>취소</);
 assert.doesNotMatch(board,/25분 대기|호출시간|신청일 ·/);
});
test('past records require the explicit past specimen',()=>{
 assert.doesNotMatch(useHistory({selected:0}),/>입장</);
 assert.match(useHistory({selected:0,showPast:true}),/>입장</);
 assert.match(useHistory({selected:0,showPast:true}),/role="switch" checked/);
});
test('empty history preserves legacy text rather than invented helper copy',()=>{
 assert.match(useHistory({selected:0,empty:true}),/no_search.png/);
 assert.match(useHistory({selected:3,empty:true}),/리뷰 내역이 없습니다\./);
 assert.doesNotMatch(useHistory({empty:true}),/아직 이용내역|생기면 여기에/);
});

test('recent visits preserve legacy fields and only planned review CTA',async()=>{
 const {myInfo}=await import('./render.mjs');
 const html=myInfo();
 assert.match(html,/>내 리뷰</);
 assert.match(html,/>09\/18</);
 assert.match(html,/>후기 작성</);
 assert.doesNotMatch(html,/>전체 보기<|최근 방문 매장 예시/);
});
test('recent states preserve legacy empty copy and login visibility',async()=>{
 const {recentVisits}=await import('./render.mjs');
 const empty=recentVisits({visits:[]});
 assert.match(empty,/아직 방문한 상점이 없으시네요/);
 assert.match(empty,/>내 리뷰</);
 assert.doesNotMatch(empty,/>후기 작성</);
 const guest=recentVisits({loggedIn:false});
 assert.match(guest,/로그인 후 내 방문 내역을 확인해보세요/);
 assert.doesNotMatch(guest,/>내 리뷰<|>후기 작성</);
});
test('recent images prefer store logo and render every supplied visit safely',async()=>{
 const {recentVisits}=await import('./render.mjs');
 const html=recentVisits({visits:[
  {brandName:'가게 <A>',brandLogo:'/logo.png',brandThumbnail:'/photo.png',visitDate:'09/18'},
  {brandName:'가게 B',brandThumbnail:'/photo-b.png',visitDate:'09/17'}
 ]});
 assert.match(html,/src="\/logo.png"/);assert.doesNotMatch(html,/src="\/photo.png"/);
 assert.match(html,/src="\/photo-b.png"/);assert.match(html,/가게 &lt;A&gt;/);
 assert.equal((html.match(/class="og-my-visit"/g)||[]).length,2);
});

test('mileage sheet preserves legacy heading, row fields and empty presentation',async()=>{
 const {mileageHistory}=await import('./mileage-history.mjs');
 const html=mileageHistory();
 assert.match(html,/>사용 가능한 마일리지</);
 assert.doesNotMatch(html,/<span>총 보유 16,000 M<|og-row-description/);
 assert.match(html,/2026-09-18/);
 const empty=mileageHistory({empty:true});
 assert.match(empty,/>조회한 기간의 내역이 없습니다\.</);
 assert.doesNotMatch(html,/>조회한 기간의 내역이 없습니다\.</);
 const unnamed=mileageHistory({entries:[{date:'2026-09-18',title:'',type:'적립취소',amount:'-1,000 M'}]});
 assert.match(unnamed,/지급 정보 없음/);
 assert.doesNotMatch(unnamed,/og-mileage-earned/);
});
