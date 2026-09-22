import {storeScreen} from './store.mjs';
import {escapeHTML as e,icon} from '../../components/core.mjs';
import {sectionHeading} from '../../components/section-heading/render.mjs';
import {thumbnail} from '../../components/avatar/render.mjs';
const day=value=>Date.parse(value+'T00:00:00Z')/86400000;
// Dates are date-only specimen values. Runtime integration retains the app's local-day logic.
export function eventStatus(start,end,today){
 if(day(end)<day(today))return {kind:'ended',label:'',remaining:'종료된 이벤트'};
 if(day(start)>day(today))return {kind:'upcoming',label:'',remaining:'D-'+(day(start)-day(today))};
 const left=day(end)-day(today);return {kind:'active',label:'진행 중',remaining:left===0?'오늘 종료':left+'일 남음'};
}
export function updateItem(kind,item,today='2026-09-19'){
 const status=kind==='event'?eventStatus(item.start,item.end,today):null;
 const text=kind==='news'?'<p class="og-update-date">'+e(item.date)+'</p><h4>'+e(item.title)+'</h4>':'<div class="og-update-title">'+icon(status.kind==='active'?'star':'star_border')+'<h4>'+e(item.title)+'</h4></div><div class="og-update-event-copy"><p class="og-update-status">'+(status.label?'<strong>'+e(status.label)+'</strong> ':'')+e(status.remaining)+'</p><p class="og-update-date">'+e(item.periodLabel||item.start+' ~ '+item.end)+'</p></div>';
 return '<article class="og-update-row"'+(status?' data-status="'+status.kind+'"':'')+'><div class="og-update-copy">'+text+'</div>'+(item.image?thumbnail({src:item.image,alt:item.title+' 이미지'}):'')+'</article>';
}
export function updatesSection(kind,items=[],today='2026-09-19'){
 if(!items.length)return '';
 return '<section class="og-store-updates" data-kind="'+e(kind)+'">'+sectionHeading({title:kind==='news'?'소식':'이벤트',action:'더보기'})+items.slice(0,2).map(item=>updateItem(kind,item,today)).join('')+'</section>';
}
export function updatesScreen(kind,{imageSrc='',alternate=false,publicData}={}){
 const items=kind==='news'?[
 {title:'회원점 소식 제목',date:'오늘(토)',image:alternate?'':imageSrc},
 {title:'사진 없이 등록한 소식 제목',date:'9.18(금)'}
 ]:alternate?[
 {title:'시작 예정 이벤트',start:'2026-09-22',end:'2026-09-30',image:imageSrc},
 {title:'종료된 이벤트',start:'2026-09-01',end:'2026-09-18'}
 ]:[{title:'진행 중인 이벤트',start:'2026-09-01',end:'2026-09-21',image:imageSrc},{title:'오늘 종료되는 이벤트',start:'2026-09-01',end:'2026-09-19'}];
 const mapped=publicData?items.map((sample,i)=>{const source=(kind==='news'?publicData.news:publicData.events)[i%(kind==='news'?publicData.news:publicData.events).length];return {...sample,title:source.title,image:sample.image?source.image:'',...(kind==='news'?{date:source.date}:{})};}):items;
 return storeScreen({...publicData?.store,news:kind==='news',event:kind==='event',selectedSection:1,contentHTML:updatesSection(kind,mapped)});
}
export function updatesBoard(kind,{imageSrc='',publicData}={}){
 const registered=publicData?'<section class="screen-state-example"><h3>'+e(publicData.store.name)+' · 등록된 '+(kind==='news'?'소식':'이벤트')+'</h3><div class="screen-artboard">'+storeScreen({...publicData.store,news:kind==='news',event:kind==='event',selectedSection:1,contentHTML:updatesSection(kind,kind==='news'?publicData.news:publicData.events,publicData.today)})+'</div></section><h3>상태별 배치 예시</h3>':'';
 return '<div class="screen-page-content"><div>'+registered+[false,true].map(alternate=>'<section class="screen-state-example"><h3>'+(kind==='news'?(alternate?'사진이 없는 소식':'사진이 있는 소식과 없는 소식'):(alternate?'시작 예정 · 종료':'진행 중 · 오늘 종료'))+'</h3><div class="screen-artboard">'+updatesScreen(kind,{imageSrc:publicData?(kind==='news'?publicData.news[0].image:publicData.events[0].image):imageSrc,alternate,publicData})+'</div></section>').join('')+'</div><div class="screen-design-notes"><h3>두 개씩 미리보기</h3><p>목록은 두 개까지 보여주고, 제목 옆 더보기로 전체 목록을 확인합니다.</p><h3>사진이 없을 때</h3><p>이미지 자리를 비워두지 않고 제목과 날짜 영역을 넓힙니다.</p>'+(kind==='event'?'<h3>기간 구분</h3><p>진행 중인 이벤트는 채운 별로, 예정·종료는 윤곽선 별로 표시합니다. 종료된 항목은 글자를 흐리게 표현합니다.</p>':'')+'</div></div>';
}
export const updatesPrompt='기존 매장 상세 소식·이벤트 본문을 첨부 캡처와 CSS로 구현하세요. 기존 lib/0_pages/01_home/shop_panel_items/shop_contents.dart의 _getNewsAndEvent/_getNews/_getEvent/_getNewsItem/_getEventItem 기준으로 스타일만 변경합니다. newsList/eventList가 없으면 각각 섹션과 탐색항목을 숨기고, 둘다 있으면 소식/이벤트 탐색 아래 소식→이벤트 순서입니다. 각 목록은 기존순서 최대2개이며 시안 상태비교를 실제 재정렬 기준으로 사용하지 않습니다. 소식은 formatDateWithDay(registerDate): 오늘(요일) 또는 월.일(요일), 제목, 있을 때만 오른쪽80x80사진입니다. 이벤트는 제목·별아이콘·진행상태·남은기간·yyyy-MM-dd ~ yyyy-MM-dd 기간·선택사진입니다. 기존 getGroup은 당일 로컬자정 기준으로 endDate<오늘이면 종료, startDate>오늘이면 예정, 나머지는 진행중입니다. 진행중은 채운별과 진행 중/N일 남음, 종료일까지0일은 오늘 종료, 예정은 윤곽별과 D-N, 종료는 윤곽별과 종료된 이벤트 및 회색글자입니다. 예정이라는 별도 상태문구나 신규 배지를 추가하지 않습니다. 이미지없음은 대체사진 없이 생략합니다. 더보기는 StoreNews/StoreEvent(storeData), 행선택은 StoreNewsDetail(news)/StoreEventDetail(event) 기존페이지로 이동합니다. 실제이동은 정적 캔버스에 구현하지 않습니다. 공통 storeScreen/sectionHeading/thumbnail/icon 및 OG토큰을 재사용하세요. 이번시안은 본문영역이며 전체목록/상세페이지가 아니고 앞뒤본문을 삭제하지 않습니다. 샘플 기준일2026-09-19와 제목·사진은 상태 비교용입니다. 렌더러 design-system/pages/home/store-updates.mjs, CSS store-updates.css.';
