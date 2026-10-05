import {renderMyInfoTest} from '../../screens/my-info-3d-test/render.mjs';
import {escapeHTML as e,uid} from '../../design-system/components/core.mjs';
import {button,iconButton} from '../../design-system/components/button/render.mjs';
import {renderSheet} from '../components/sheet.mjs';
import {renderTabs} from '../components/tabs.mjs';
import {renderSelection} from '../components/selection.mjs';
import {renderBadge} from '../components/badges.mjs';
import {renderThumbnail} from '../components/media.mjs';
import {renderSurface} from '../components/surfaces.mjs';
import {renderFeedback} from '../components/feedback.mjs';

const labels=['예약','웨이팅','Q오더','리뷰'];
// Read-only design fixtures: dates/statuses/actions mirror the original use-history.
// Concrete store names are layout samples, not actual reservations or transactions.
const reservation={title:'오시 망원본점',meta:'음식점 · 망원동',state:'확정',tone:'info',lines:[['예약일시','오늘. 9.18(금) 오후 6:00'],['인원','2명 · 어린이 0명']],requested:'어제. 9.17(목)',action:'예약 상세 보기'};
const waiting={title:'밀랍(MILLAB)',meta:'카페 · 망원동',state:'대기중',tone:'info',lines:[['방문일','오늘. 9.18(금)'],['등록시간','오후 12:10'],['인원','2명 · 어린이 0명'],['대기시간','25분']],started:'오늘. 9.18(금) 오후 12:10',action:'실시간 웨이팅 보기'};
const examples=[
 [reservation,{...reservation,state:'입장',tone:'neutral',lines:[['예약일시','9.12(토) 오후 12:00'],['인원','2명 · 어린이 0명']],requested:'9.11(금)',action:''}],
 [waiting,{...waiting,state:'입장완료',tone:'neutral',lines:[['방문일','9.12(토)'],['등록시간','오후 12:00'],['입장시간','오후 12:25'],['인원','2명 · 어린이 0명']],started:'9.12(토) 오후 12:00',action:''}],
 [{title:'스시산원 반주헌',state:'접수',tone:'info',date:'2026-09-18 12:10:00',menu:'메뉴명 2개',amount:'18,000 원',action:'주문상세'},
  {title:'스시산원 반주헌',state:'완료',tone:'neutral',date:'2026-09-12 12:00:00',menu:'메뉴명 1개',amount:'9,000 원',action:'주문상세'}],
 [{title:'오시 망원본점',meta:'음식점 · 망원동',date:'2026. 9. 18',review:'매장이 깔끔하고 편하게 이용했어요.'}]
];
const cancelled={...reservation,state:'매장 취소',tone:'neutral',lines:[['예약일시','9.12(토) 오후 6:00'],['인원','2명 · 어린이 0명'],['취소 사유','매장 사정으로 취소']],requested:'9.11(금)',action:''};
const extras=[
 [cancelled,{...cancelled,state:'취소',lines:cancelled.lines.slice(0,2)}],
 [{...waiting,state:'호출됨',lines:[['방문일','오늘. 9.18(금)'],['등록시간','오후 12:10'],['인원','2명 · 어린이 0명'],['대기시간','5분']]},
  {...waiting,state:'매장 취소',tone:'neutral',lines:[['방문일','9.12(토)'],['등록시간','오후 12:00'],['인원','2명 · 어린이 0명'],['취소시간','오후 12:15']],started:'9.12(토) 오후 12:00',action:''}]
];
const more='<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="5" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="12" cy="19" r="1.8"/></svg>';
function record(item,selected,menuOpen=false,imageSrc=''){
 const badge=item.state?renderBadge({label:item.state,tone:item.tone}):'';
 const header='<div class="v2-use-store">'+(selected===3&&!imageSrc?'':renderThumbnail({alt:item.title+' 매장 사진',src:imageSrc,state:imageSrc?'ready':'empty'}))+'<div class="v2-use-store-copy"><h3>'+e(item.title)+'</h3>'+(item.meta?'<p>'+e(item.meta)+'</p>':'')+(item.date?'<p>'+e(item.date)+'</p>':'')+'</div>'+(selected===3?iconButton({label:'리뷰 관리',iconHTML:more,className:'v2-icon-button',attributes:{'data-face':'plain'}}):badge)+'</div>';
 const details=item.lines?'<dl class="v2-use-details">'+item.lines.map(([label,value])=>'<div><dt>'+e(label)+'</dt><dd>'+e(value)+'</dd></div>').join('')+'</dl>':'';
 const photos=item.photos??['','',''];
 const photo=selected===3?(photos.length?'<div class="v2-use-review-photos" role="group" aria-label="리뷰 사진">'+photos.map((src,index)=>renderThumbnail({alt:'리뷰 사진 '+(index+1),src,state:src?'ready':'empty'})).join('')+'</div>':'')+'<p class="v2-use-review-text">'+e(item.review)+'</p>':'';
 const order=selected===2?'<div class="v2-use-order-summary"><span>'+e(item.menu)+'</span><strong>'+e(item.amount)+'</strong></div>':'';
 const menu=menuOpen?'<div class="v2-use-review-menu" aria-label="리뷰 관리 메뉴">'+button({label:'수정',variant:'secondary',className:'v2-button'})+button({label:'삭제',variant:'danger',className:'v2-button'})+'</div>':'';
 const action=item.action?'<div class="v2-use-action">'+button({label:item.action,variant:'secondary',className:'v2-button'})+'</div>':'';
 const stamp=item.requested?'<p class="v2-use-stamp">신청일: '+e(item.requested)+'</p>':item.started?'<p class="v2-use-stamp">대기 시작: '+e(item.started)+'</p>':'';
 return '<article data-use-record="'+e(item.state||'리뷰')+'">'+renderSurface({depth:'flat',contentHTML:header+details+stamp+order+photo+menu+action})+'</article>';
}
export function renderReviewRecords({items=examples[3],imageSrc=''}={}){
 return '<div class="v2-use-records">'+items.map(item=>record(item,3,false,imageSrc)).join('')+'</div>';
}
export function renderUseHistory({id=uid('v2-use-history'),selected=0,empty=false,showPast=false,state='basic'}={}){
 if(!Number.isInteger(selected)||selected<0||selected>3)throw new RangeError('Unknown history tab');
 if(!['basic','supplementary'].includes(state)||state==='supplementary'&&selected===2)throw new RangeError('Unknown history state');
 const profile=renderMyInfoTest({assetBase:'/screens/my-info-3d-test/media/figma/'}).match(/<header class="profile-header">[\s\S]*?<\/header>/)[0];
 const items=state==='supplementary'&&selected<2?extras[selected]:showPast?examples[selected]:examples[selected].slice(0,1);
 const past=selected<3?renderSelection({kind:'switch',label:'과거 내역 보기',checked:showPast}):'';
 const content=past+(empty?renderFeedback({id:id+'-empty',kind:'history',title:labels[selected]+' 내역이 없습니다.',body:''}):'<div class="v2-use-records">'+items.map(item=>record(item,selected,state==='supplementary'&&selected===3)).join('')+'</div>');
 const tabs=renderTabs({id:id+'-tabs',label:'이용내역 종류',items:labels,selected,panels:labels.map((_,index)=>index===selected?content:'')});
 // Keep the shell scrollable; inert controls alone prevent service-like actions.
 // Inert on either the frame or static-sheet wrapper would block wheel/touch scroll.
 const sheet=renderSheet({id:id+'-sheet',title:'이용내역',size:'long',bodyHTML:tabs})
  .replace('class="v2-sheet-static" inert','class="v2-sheet-static"')
  .replace('class="og-sheet-body"','class="og-sheet-body" role="region" aria-label="'+labels[selected]+' 내역 · 정적 시안" tabindex="0"');
 return ('<div class="v2-use-history-frame" aria-label="이용내역 '+labels[selected]+(empty?' 빈 상태':showPast?' 과거 내역':'')+'"><div class="v2-use-backdrop" inert aria-hidden="true">'+profile+'</div><div class="v2-use-scrim" aria-hidden="true"></div>'+sheet+'</div>')
  .replace(/<button\b/g,'<button inert').replace(/<input\b/g,'<input inert');
}
const cssFiles=['/screens/my-info-3d-test/styles.css',...['button','icon-button','sheet','tabs','selection','badges','media','surfaces','feedback'].map(name=>'/v2/components/'+name+'.css'),'/v2/my-info/use-history.css'];
const sample=(key,title,options)=>'<figure class="v2-use-review-sample" data-use-state="'+key+'"><figcaption>'+e(title)+'</figcaption><div class="v2-use-history-host"><template>'+cssFiles.map(href=>'<link rel="stylesheet" href="'+href+'">').join('')+renderUseHistory({id:'v2-use-'+key,...options})+'</template></div></figure>';
const grid=html=>'<div class="v2-use-review-grid">'+html+'</div>';
export function renderUseHistoryReview(){
 return '<section id="use-history" data-review-screen aria-labelledby="use-history-title" hidden><h2 id="use-history-title">이용내역</h2><p class="v2-intro">예약·웨이팅·Q오더·리뷰를 구분해 이용 기록과 진행 상태를 확인하는 화면입니다.</p>'+grid(labels.map((label,selected)=>sample('basic-'+selected,label,{selected})).join(''))+
 '<p class="v2-intro">각 탭을 따로 보여주는 정적 시안입니다. 매장·날짜·금액은 배치 확인용 예시이며 조회·탭 전환·상세 이동·수정·삭제·닫기는 실행되지 않습니다.</p>'+
 '<details class="v2-use-extra"><summary>과거 내역 보기 · 예약·웨이팅·Q오더</summary>'+grid(labels.slice(0,3).map((label,selected)=>sample('past-'+selected,label+' · 과거 내역 포함',{selected,showPast:true})).join(''))+'</details>'+
 '<details class="v2-use-extra"><summary>내역이 없는 상태 · 4개 탭</summary>'+grid(labels.map((label,selected)=>sample('empty-'+selected,label+' · 내역 없음',{selected,empty:true})).join(''))+'</details>'+
 '<details class="v2-use-extra"><summary>예약 취소 · 웨이팅 호출/취소 · 리뷰 관리</summary>'+grid([[0,'예약 · 매장 취소/취소'],[1,'웨이팅 · 호출/매장 취소'],[3,'리뷰 · 관리 메뉴']].map(([selected,title])=>sample('extra-'+selected,title,{selected,state:'supplementary'})).join(''))+'</details></section>';
}
export function setupUseHistoryReview(root){
 const mount=scope=>{
  for(const host of scope.querySelectorAll('.v2-use-history-host')){
   if(host.shadowRoot)continue;
   const template=host.querySelector('template');
   host.attachShadow({mode:'open'}).append(template.content.cloneNode(true));template.remove();
  }
 };
 const section=root.querySelector('#use-history');if(!section||section.dataset.useReady)return;
 section.dataset.useReady='true';mount(section.querySelector('.v2-use-review-grid'));
 for(const details of section.querySelectorAll('.v2-use-extra')){
  if(details.open)mount(details);
  details.addEventListener('toggle',()=>{if(details.open)mount(details);});
 }
}
