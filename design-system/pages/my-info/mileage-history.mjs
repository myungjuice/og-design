import {bottomSheet,chip,listRow,rangeCalendar} from '../../components/index.mjs';
import {myInfo} from './render.mjs';
import {escapeHTML as e} from '../../components/core.mjs';
// Design examples, not account activity.
export const historyExamples=[
 {date:'2026-09-18',title:'회원점명',type:'적립',amount:'+1,000 M'},
 {date:'2026-09-16',title:'회원점명',type:'사용',amount:'-5,000 M'},
 {date:'2026-09-12',title:'회원점명',type:'적립',amount:'+5,000 M'}
];
export function mileageHistory({empty=false,entries=historyExamples,periodOpen=false}={}){
 const periods='<div class="og-mileage-periods" aria-label="조회 기간">'+['1개월','3개월','6개월','직접입력'].map((label,i)=>chip({label,selected:i===(periodOpen?3:0)})).join('')+'</div>';
 const summary='<div class="og-history-balance"><span>사용 가능한 마일리지</span><strong>15,000 M</strong></div>';
 const rows=empty?'<div class="og-mileage-empty"><p>조회한 기간의 내역이 없습니다.</p></div>':'<div class="og-mileage-entries">'+entries.map(entry=>'<section class="og-mileage-entry"><h3>'+e(entry.date)+'</h3>'+listRow({title:entry.title||'지급 정보 없음',value:entry.amount,interactive:false,className:!entry.amount.startsWith('-')?'og-mileage-earned':''})+'</section>').join('')+'</div>';
 const body=summary+periods+'<p class="og-history-range">2026-08-18 – 2026-09-18</p>'+rows;
 return '<div class="og-history-screen" inert aria-label="마일리지 내역 '+(empty?'빈 상태':'기본 상태')+'"><div class="og-history-backdrop" aria-hidden="true">'+myInfo()+'</div><div class="og-history-scrim"></div>'+bottomSheet({title:'마일리지 내역',bodyHTML:body})+(periodOpen?'<div class="og-period-overlay"><section class="og-period-dialog" aria-label="조회 기간 선택"><h3>조회 기간 선택</h3>'+rangeCalendar({year:2026,month:9,start:'2026-09-04',end:'2026-09-18'})+'</section></div>':'')+'</div>';
}
export function mileageHistoryBoard(){
 return '<div class="screen-page-content"><div class="screen-artboard"><h3 class="history-state-label">기본 상태</h3>'+mileageHistory()+'</div><div class="screen-design-notes"><h3>내 정보 위에서 확인</h3><p>배경 화면은 어둡게 낮추고 내역 시트를 올렸습니다. 닫으면 보던 내 정보 화면으로 돌아갑니다.</p><h3>금액과 기록 구분</h3><p>사용 가능 금액을 먼저 보여주고, 날짜별로 매장과 적립·사용 금액을 정리했습니다. 증가한 금액은 블루, 감소한 금액은 진한 글자로 구분했습니다.</p><h3>기간 선택</h3><p>1개월·3개월·6개월·직접입력을 같은 줄에 배치했습니다.</p></div></div><div class="history-empty-example"><h3 class="history-state-label">내역이 없는 상태</h3><div class="screen-artboard">'+mileageHistory({empty:true})+'</div></div><div class="history-empty-example"><h3 class="history-state-label">직접 입력 · 기간 선택</h3><div class="screen-artboard">'+mileageHistory({periodOpen:true})+'</div></div><div class="history-empty-example" inert><h3 class="history-state-label">취소 내역 · 금액 감소 / 증가</h3><div class="screen-artboard og-mileage-cancel-examples">'+[
 {date:'2026-09-18',title:'회원점명',amount:'-1,000 M'},
 {date:'2026-09-18',title:'',amount:'+5,000 M'}
 ].map(entry=>'<section class="og-mileage-entry"><h3>'+e(entry.date)+'</h3>'+listRow({title:entry.title||'지급 정보 없음',value:entry.amount,interactive:false,className:entry.amount.startsWith('+')?'og-mileage-earned':''})+'</section>').join('')+'</div></div>';
}
