import {bottomSheet,tabs,tabPanel,surface,badge,textButton,thumbnail,toggle,iconButton} from '../../components/index.mjs';
import {escapeHTML as e,uid,icon} from '../../components/core.mjs';
import {myInfo} from './render.mjs';
const labels=['예약','웨이팅','Q오더','리뷰'];
// Design fixtures only. Information and action visibility follow the legacy history views.
// Fixed reference day: 2026-09-18. Dates and labels mirror Flutter formatters.
const examples=[
 [{state:'확정',tone:'info',title:'회원점명',meta:'음식점 • 지역명',lines:[['@date','오늘. 9.18(금) 오후 6:00'],['@people','']],requested:'어제. 9.17(목)',action:'예약 상세 보기'},
  {state:'입장',tone:'neutral',title:'회원점명',meta:'음식점 • 지역명',lines:[['@date','9.12(토) 오후 12:00'],['@people','']],requested:'9.11(금)'}],
 [{state:'대기중',tone:'info',title:'회원점명',meta:'음식점 · 지역명',lines:[['@date','오늘. 9.18(금)'],['등록시간:','오후 12:10'],['@people',''],['대기시간:','25분']],started:'오늘. 9.18(금) 오후 12:10',action:'실시간 웨이팅 보기'},
  {state:'입장완료',tone:'neutral',title:'회원점명',meta:'음식점 · 지역명',lines:[['@date','9.12(토)'],['등록시간:','오후 12:00'],['입장시간:','오후 12:25'],['@people','']],started:'9.12(토) 오후 12:00'}],
 [{state:'접수',tone:'info',title:'회원점명',date:'2026-09-18 12:10:00',menu:'메뉴명 2개',amount:'18,000 원',action:'주문상세'},
  {state:'완료',tone:'neutral',title:'회원점명',date:'2026-09-12 12:00:00',menu:'메뉴명 1개',amount:'9,000 원',action:'주문상세'}],
 [{title:'회원점명',meta:'음식점 · 지역명',date:'2026. 9. 18',review:'매장이 깔끔하고 편하게 이용했어요.'}]
];
const cancelled={state:'매장 취소',tone:'neutral',title:'회원점명',meta:'음식점 • 지역명',lines:[['@date','9.12(토) 오후 6:00'],['@people',''],['@reason','매장 사정으로 취소']],requested:'9.11(금)'};
function storeHeader(item,imageSrc,review=false){
 return '<div class="og-use-store">'+(review&&!imageSrc?'':thumbnail({src:imageSrc,alt:'매장 썸네일',state:imageSrc?'ready':'empty'}))+'<div class="og-use-store-copy"><div class="og-use-store-title"><h3>'+e(item.title)+'</h3>'+(!review?badge({label:item.state,tone:item.tone}):'')+'</div>'+(item.meta?'<p>'+e(item.meta)+'</p>':'')+(review?'<p>'+e(item.date)+'</p>':'')+'</div>'+(review?iconButton({label:'리뷰 관리',name:'more_vert'}):'')+'</div>';
}
function details(lines){
 return '<dl>'+lines.map(([label,value])=>{
  if(label==='@people')return '<div class="og-use-icon-row"><dt>'+icon('people')+'</dt><dd>2명</dd><dt>'+icon('child_care')+'</dt><dd>0명</dd></div>';
  if(label.startsWith('@'))return '<div class="og-use-icon-row"><dt>'+icon(label==='@date'?'calendar_today':'info_outline')+'</dt><dd>'+e(value)+'</dd></div>';
  return '<div><dt>'+e(label)+'</dt><dd>'+e(value)+'</dd></div>';
 }).join('')+'</dl>';
}
function recordCard(item,selected,imageSrc){
 let content='';
 if(selected===2){
  content='<div class="og-use-order-date"><span>'+e(item.date)+'</span>'+badge({label:item.state,tone:item.tone})+'</div><div class="og-use-store">'+thumbnail({src:imageSrc,alt:'매장 썸네일',state:imageSrc?'ready':'empty'})+'<div class="og-use-store-copy"><h3>'+e(item.title)+'</h3><p>'+e(item.menu)+'</p><strong class="og-use-order-amount">'+e(item.amount)+'</strong></div></div><div class="og-use-record-action">'+textButton({label:item.action})+'</div>';
 }else if(selected===3){
  const photos=item.photos??['','',''];
  content=storeHeader(item,imageSrc,true)+(photos.length?'<div class="og-use-review-photos" role="group" aria-label="리뷰 사진">'+photos.map((src,i)=>src?'<img class="og-use-review-photo" src="'+e(src)+'" alt="리뷰 사진 '+(i+1)+'">':'<div class="og-use-review-photo" role="img" aria-label="리뷰 사진 '+(i+1)+'">리뷰 사진 '+(i+1)+'</div>').join('')+'</div>':'')+'<p class="og-use-review">'+e(item.review)+'</p>';
 }else{
  content=storeHeader(item,imageSrc)+details(item.lines)+(item.requested?'<p class="og-use-requested">신청일: '+e(item.requested)+'</p>':'')+(item.started?'<p class="og-use-requested">대기 시작: '+e(item.started)+'</p>':'')+(item.action?'<div class="og-use-record-action">'+textButton({label:item.action})+'</div>':'');
 }
 return surface({className:'og-use-record',attributes:{'data-history-kind':labels[selected]},contentHTML:content});
}
export function reviewCards({imageSrc='',items=examples[3]}={}){return '<div class="og-use-records">'+items.map(item=>recordCard(item,3,imageSrc)).join('')+'</div>';}
export function reviewMenu(){return surface({className:'og-use-review-menu',contentHTML:textButton({label:'수정'})+textButton({label:'삭제',className:'og-use-delete'})});}
export function useHistory({selected=0,empty=false,imageSrc='',showPast=false}={}){
 if(!Number.isInteger(selected)||selected<0||selected>3)throw new RangeError('Unknown history tab');
 const id=uid('use-history');
 const past=selected<3?toggle({label:'과거 내역 보기',checked:showPast,className:'og-use-past'}):'';
 const content=past+(empty?(selected===3?'<p class="og-use-empty">리뷰 내역이 없습니다.</p>':'<div class="og-use-empty"><img src="https://og-familystore-image.s3.ap-northeast-2.amazonaws.com/ogapp/no_search.png" alt="" aria-label="기존 앱의 빈 내역 이미지"></div>'):selected===3?reviewCards({imageSrc}):'<div class="og-use-records">'+(showPast||selected===3?examples[selected]:examples[selected].slice(0,1)).map(item=>recordCard(item,selected,imageSrc)).join('')+'</div>');
 const body=tabs({id,label:'이용내역 종류',items:labels,selected,className:'og-use-tabs'})+labels.map((_,index)=>tabPanel({id,index,selected,contentHTML:index===selected?content:''})).join('');
 return '<div class="og-use-history og-history-screen" inert aria-label="이용내역 '+labels[selected]+(empty?' 빈 상태':'')+'"><div class="og-history-backdrop" aria-hidden="true">'+myInfo()+'</div><div class="og-history-scrim"></div>'+bottomSheet({title:'이용내역',bodyHTML:body})+'</div>';
}
function supplementary(selected,imageSrc){
 let content='',label='';
 if(selected===0){label='매장 취소 · 취소';content=recordCard(cancelled,0,imageSrc)+recordCard({...cancelled,state:'취소',lines:cancelled.lines.filter(([key])=>key!=='@reason')},0,imageSrc);}
 if(selected===1){label='호출 · 취소';content=recordCard({state:'호출됨',tone:'info',title:'회원점명',meta:'음식점 · 지역명',lines:[['@date','오늘. 9.18(금)'],['등록시간:','오후 12:10'],['@people',''],['대기시간:','5분']],started:'오늘. 9.18(금) 오후 12:10',action:'실시간 웨이팅 보기'},1,imageSrc)+recordCard({state:'매장 취소',tone:'neutral',title:'회원점명',meta:'음식점 · 지역명',lines:[['@date','9.12(토)'],['등록시간:','오후 12:00'],['@people',''],['취소시간:','오후 12:15']],started:'9.12(토) 오후 12:00'},1,imageSrc);}
 if(selected===3){label='리뷰 관리 · 열린 상태';content=reviewMenu();}
 return content?'<div class="og-use-state-example" inert><h3 class="history-state-label">'+label+'</h3><div class="og-use-records">'+content+'</div></div>':'';
}
export function useHistoryBoard({imageSrc=''}={}){
 const notes=[
  '<h3>매장부터 확인</h3><p>썸네일과 매장명, 업종·지역을 함께 보여줍니다. 예약일시와 인원은 바로 아래에 모았습니다.</p><h3>진행 중인 예약</h3><p>상세 버튼은 진행 중인 예약에만 표시합니다. 취소된 예약에는 취소 사유를 보여줍니다.</p>',
  '<h3>등록부터 입장까지</h3><p>등록시간과 인원을 기본으로 보여주고, 대기·호출 중에는 경과시간, 입장 후에는 입장시간을 표시합니다.</p><h3>상태별 안내</h3><p>대기·호출 중에는 실시간 웨이팅으로 이동하는 버튼을 표시합니다.</p>',
  '<h3>메뉴와 금액을 한눈에</h3><p>주문일시와 상태 아래에 매장 사진, 메뉴명, 주문금액을 모았습니다. 완료된 주문도 상세를 볼 수 있습니다.</p>',
  '<h3>사진과 내용 함께 보기</h3><p>매장 정보와 작성일 아래에 리뷰 사진과 본문을 표시합니다.</p><h3>리뷰 관리</h3><p>더보기 메뉴에서 수정과 삭제를 선택합니다. 열린 메뉴는 아래에 따로 배치했습니다.</p>',
  '<h3>기록이 없을 때</h3><p>탭과 과거 내역 설정을 유지하고, 선택한 항목의 내역이 없음을 안내합니다.</p>'
 ];
 return [...labels.map((label,selected)=>({label:label+' 탭',selected})),{label:'내역이 없는 상태',selected:0,empty:true}].map((state,i)=>'<section class="'+(i?'history-empty-example':'')+'"><div class="screen-page-content"><div class="screen-artboard"><h3 class="history-state-label">'+state.label+'</h3>'+useHistory({...state,imageSrc})+(!state.empty?supplementary(state.selected,imageSrc):'')+'</div><div class="screen-design-notes">'+notes[i]+'</div></div></section>').join('')+labels.slice(0,3).map((label,selected)=>'<section class="history-empty-example"><h3 class="history-state-label">'+label+' · 과거 내역 보기 켜짐</h3><div class="screen-artboard">'+useHistory({selected,showPast:true,imageSrc})+'</div></section>').join('');
}
