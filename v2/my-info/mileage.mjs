import {historyExamples} from '../../design-system/pages/my-info/mileage-history.mjs';
import {renderMyInfoTest} from '../../screens/my-info-3d-test/render.mjs';
import {escapeHTML as e,uid} from '../../design-system/components/core.mjs';
import {renderSheet} from '../components/sheet.mjs';
import {renderChip} from '../components/chips.mjs';
import {renderListRow} from '../components/list-row.mjs';
import {renderDatePicker} from '../components/date-time.mjs';

// Existing dates/amounts are design fixtures, never account records or a new policy.
const stores=['오시 망원본점','밀랍(MILLAB)','스시산원 반주헌'];
const records=historyExamples.map((entry,index)=>({...entry,title:stores[index]}));
const assetBase='/screens/my-info-3d-test/media/figma/';
export function renderMileageHistory({id=uid('v2-mileage-history'),empty=false,periodOpen=false,entries=records}={}){
 const profile=renderMyInfoTest({assetBase}).match(/<header class="profile-header">[\s\S]*?<\/header>/)[0];
 const balance='<div class="v2-history-balance"><span>사용 가능한 OG 마일리지</span><strong>15,000 M</strong></div>';
 const periods='<div class="v2-history-periods" role="group" aria-label="조회 기간">'+['1개월','3개월','6개월','직접입력'].map((label,index)=>renderChip({label,selected:index===(periodOpen?3:0)})).join('')+'</div>';
 const content=empty?'<div class="v2-history-empty"><p>조회한 기간의 내역이 없습니다.</p></div>':'<div class="v2-history-records">'+entries.map(entry=>'<section class="v2-history-record" data-record-direction="'+(entry.amount.startsWith('+')?'earned':'spent')+'"><h3>'+e(entry.date)+'</h3>'+renderListRow({title:entry.title||'지급 정보 없음',value:entry.amount,interactive:false})+'</section>').join('')+'</div>';
 // Static service controls must not prevent scrolling through the preview.
 const sheet=renderSheet({id:id+'-sheet',title:'마일리지 내역',size:'long',bodyHTML:balance+periods+'<p class="v2-history-range">'+(periodOpen?'2026-09-04 – 2026-09-18':'2026-08-18 – 2026-09-18')+'</p>'+content})
  .replace('class="v2-sheet-static" inert',periodOpen?'class="v2-sheet-static" inert aria-hidden="true"':'class="v2-sheet-static"')
  .replace('class="og-sheet-body"','class="og-sheet-body" role="region" aria-label="마일리지 내역 · 정적 시안" tabindex="0"');
 const picker=periodOpen?'<div class="v2-history-period-overlay"><section class="v2-history-period-panel" aria-labelledby="'+e(id)+'-period-title"><h2 id="'+e(id)+'-period-title">조회 기간 선택</h2>'+renderDatePicker({id:id+'-calendar',year:2026,month:9,range:{start:'2026-09-04',end:'2026-09-18'}})+'</section></div>':'';
 return ('<div class="v2-mileage-history-frame" aria-label="마일리지 내역 '+(empty?'내역 없음':periodOpen?'직접 기간 선택':'기본')+'"><div class="v2-mileage-backdrop" inert aria-hidden="true">'+profile+'</div><div class="v2-history-scrim" aria-hidden="true"></div>'+sheet+picker+'</div>')
  .replace(/<button\b/g,'<button inert').replace(/<input\b/g,'<input inert');
}
const cssFiles=['/screens/my-info-3d-test/styles.css','/v2/components/button.css','/v2/components/icon-button.css','/v2/components/sheet.css','/v2/components/chips.css','/v2/components/list-row.css','/v2/components/date-time.css','/v2/my-info/mileage.css'];
// The planning deck's screenshot is a separate candidate, not a replacement for
// the four-tab usage history or the original period-based mileage specimens.
export function renderMonthlyMileageHistory(){
 const profile=renderMyInfoTest({assetBase}).match(/<header class="profile-header">[\s\S]*?<\/header>/)[0];
 const arrow=forward=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="'+(forward?'m9 6 6 6-6 6':'m15 6-6 6 6 6')+'"/></svg>';
 const month='<div class="v2-monthly-month"><button type="button" aria-label="이전 달">'+arrow(false)+'</button><strong>2026년 9월</strong><button type="button" aria-label="다음 달">'+arrow(true)+'</button><button type="button" class="v2-monthly-filter" aria-label="유형 필터"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4"/></svg></button></div>';
 const summary='<dl class="v2-monthly-summary" aria-label="월별 마일리지 합계">'+[['적립','+2,840 M'],['사용','-5,000 M'],['게임','+320 M']].map(([label,value])=>'<div><dt>'+label+'</dt><dd>'+value+'</dd></div>').join('')+'</dl>';
 const filters='<div class="v2-monthly-types" role="group" aria-label="내역 유형">'+['전체','적립','사용','게임','공유'].map((label,i)=>renderChip({label,selected:i===0})).join('')+'</div>';
 const groups=[['09월 12일',[
  ['오형제황제누룽지탕','적립 · 14:32','+960 M','12,400 M','earned'],['룰렛 당첨','게임 · 09:15','+50 M','11,440 M','game']
 ]],['09월 10일',[
  ['카페 온도 화곡점','사용 · 18:40','-5,000 M','11,390 M','spent'],['출석 7일 달성','이벤트 · 06:02','+50 M','16,390 M','event']
 ]],['09월 08일',[
  ['윤*환님 적립','공유 · 12:20','+12 M','16,340 M','shared'],['피자쿼터','적립 · 19:05','+540 M','16,328 M','earned']
 ]]];
 const paths={earned:'M3 9h18M5 9V4h14v5M5 9v12h14V9M9 21v-7h6v7',game:'M12 3v18M3 12h18M6 6l12 12M18 6 6 18',spent:'M3 5h18v14H3ZM3 10h18',event:'M3 9h18v4H3ZM5 13v8h14v-8M12 9v12M12 9C4 9 6 1 10 5l2 4c8 0 6-8 2-4Z',shared:'M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8M4 21v-2a8 8 0 0 1 16 0v2'};
 const list='<div class="v2-monthly-records" role="region" aria-label="월별 마일리지 내역" tabindex="0">'+groups.map(([date,rows])=>'<section><h3>'+date+'</h3><ul>'+rows.map(([title,meta,amount,balance,type])=>'<li data-mileage-type="'+type+'"><span class="v2-monthly-symbol" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="'+paths[type]+'"/></svg></span><div class="v2-monthly-copy"><strong>'+e(title)+'</strong><span>'+meta+'</span></div><div class="v2-monthly-value"><strong>'+amount+'</strong><span>잔액 '+balance+'</span></div></li>').join('')+'</ul></section>').join('')+'</div>';
 const sheet=renderSheet({id:'v2-monthly-sheet',title:'마일리지 내역',size:'long',bodyHTML:'<div class="v2-monthly-controls">'+month+summary+filters+'</div>'+list,actions:[]}).replace('class="v2-sheet-static" inert','class="v2-sheet-static"');
 return ('<div class="v2-mileage-history-frame v2-monthly-frame" aria-label="월별 마일리지 내역"><div class="v2-mileage-backdrop" inert aria-hidden="true">'+profile+'</div><div class="v2-history-scrim" aria-hidden="true"></div>'+sheet+'</div>').replace(/<button\b/g,'<button inert');
}
function monthlyReview(){
 return '<section id="mileage-monthly" data-review-screen aria-labelledby="mileage-monthly-title" hidden><h2 id="mileage-monthly-title">월별 마일리지 · 기획 캡처 비교안</h2><p class="v2-intro">월별 합계와 유형별 적립·사용 내역을 빠르게 확인하는 화면입니다.</p><div class="v2-mileage-review-grid"><figure class="v2-mileage-review-sample"><figcaption>월 이동 · 합계 · 유형 필터</figcaption><div class="v2-mileage-history-host"><template data-mileage-template>'+cssFiles.map(href=>'<link rel="stylesheet" href="'+href+'">').join('')+renderMonthlyMileageHistory()+'</template></div></figure></div></section>';
}
export function renderMileageHistoryReview(){
 const states=[['basic','기본 내역',{}],['empty','내역이 없을 때',{empty:true}],['period','직접 기간 선택',{periodOpen:true}]];
 return '<section id="mileage-history" data-review-screen aria-labelledby="mileage-history-title" hidden><h2 id="mileage-history-title">마일리지 내역</h2><p class="v2-intro">사용 가능한 마일리지와 기간별 적립·사용 내역을 확인하는 화면입니다.</p><div class="v2-mileage-review-grid">'+states.map(([state,title,props])=>'<figure class="v2-mileage-review-sample" data-mileage-state="'+state+'"><figcaption>'+title+'</figcaption><div class="v2-mileage-history-host"><template data-mileage-template>'+cssFiles.map(href=>'<link rel="stylesheet" href="'+href+'">').join('')+renderMileageHistory({id:'v2-history-'+state,...props})+'</template></div></figure>').join('')+'</div><p class="v2-intro">금액·매장·날짜는 배치 확인용 예시입니다. 기간 선택과 조회·닫기 버튼은 정적 시안이며 실제 내역을 조회하지 않습니다.</p><details class="v2-mileage-extra"><summary>취소 내역 · 금액 감소와 증가</summary><div class="v2-mileage-history-host"><template data-mileage-template>'+cssFiles.map(href=>'<link rel="stylesheet" href="'+href+'">').join('')+renderMileageHistory({id:'v2-history-cancellation',entries:[{date:'2026-09-18',title:'오시 망원본점',amount:'-1,000 M'},{date:'2026-09-18',title:'',amount:'+5,000 M'}]})+'</template></div></details></section>'+monthlyReview();
}
export function setupMileageHistoryReview(root){
 for(const host of root.querySelectorAll('.v2-mileage-history-host')){
  if(host.shadowRoot)continue;
  const template=host.querySelector('template');
  const screen=host.attachShadow({mode:'open'});screen.append(template.content.cloneNode(true));template.remove();
 }
}
