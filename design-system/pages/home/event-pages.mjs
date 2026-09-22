import {escapeHTML as e,icon} from '../../components/core.mjs';
import {appBar} from '../../components/app-shell/render.mjs';
import {surface} from '../../components/surfaces/render.mjs';
import {readingScreen} from './news-pages.mjs';
import {updateItem,eventStatus} from './store-updates.mjs';
const dotted=d=>d.split('-').map((v,i)=>i?String(Number(v)):v).join('.');
export function sortEvents(items,today='2026-09-19'){
 const group=i=>({active:0,upcoming:1,ended:2})[eventStatus(i.start,i.end,today).kind];
 const cmp=(a,b)=>String(a||'').localeCompare(String(b||''));
 return [...items].sort((a,b)=>{const g=group(a),other=group(b);if(g!==other)return g-other;
  if(g===0)return cmp(a.end,b.end)||cmp(a.start,b.start)||cmp(a.registered,b.registered);
  if(g===1)return cmp(a.start,b.start)||cmp(b.end,a.end)||cmp(a.registered,b.registered);
  return cmp(b.end,a.end)||cmp(b.start,a.start)||cmp(b.registered,a.registered);
 });
}
export function eventListScreen({items=[],name='회원점명',logo='',today='2026-09-19'}={}){
 const contents=items.length?sortEvents(items,today).map(item=>updateItem('event',{...item,periodLabel:dotted(item.start)+' ~ '+dotted(item.end)},today)).join(''):'<div class="og-news-empty"><img src="https://og-familystore-image.s3.ap-northeast-2.amazonaws.com/ogapp/empty_event.png" alt="" width="150" height="150"><p>등록된 이벤트가 없습니다.</p></div>';
 return '<div class="og-news-page og-event-page" inert>'+appBar({title:'우리 매장 이벤트',back:true})+'<div class="og-event-brand">'+(logo?'<img src="'+e(logo)+'" width="30" height="30" alt="">':icon('storefront'))+'<strong>'+e(name)+'</strong></div><div class="og-news-page-body">'+surface({className:'og-news-list',contentHTML:contents})+'</div></div>';
}
export function eventDetailScreen({title='회원점 이벤트 제목',contents='회원점에서 진행하는 이벤트입니다.\n\n이벤트의 자세한 내용을 안내합니다.',registered='2026.9.19 10.30',start='2026-09-01',end='2026-09-30',imageSrc=''}={}){
 return readingScreen({appTitle:'이벤트',period:dotted(start)+' ~ '+dotted(end),title,contents,registered,imageSrc});
}
export function eventPagesBoard(kind,{imageSrc='',publicData}={}){
 const items=[{title:'오늘 종료되는 이벤트',start:'2026-09-01',end:'2026-09-19',image:imageSrc},{title:'진행 중인 이벤트',start:'2026-09-01',end:'2026-09-21'},{title:'시작 예정 이벤트',start:'2026-09-22',end:'2026-09-30',image:imageSrc},{title:'종료된 이벤트',start:'2026-09-01',end:'2026-09-18'}];
 const record=publicData?.events[0];
 if(record)items.forEach(item=>{item.title=record.title;item.image=item.image?record.image:'';});
 const examples=kind==='list'?[['이벤트가 있을 때',eventListScreen({items,logo:imageSrc,...publicData?.store})],['이벤트가 없을 때',eventListScreen({logo:imageSrc,...publicData?.store})]]:[['사진이 있는 이벤트',eventDetailScreen(record?{...record,imageSrc:record.image}:{imageSrc})],['사진이 없는 이벤트',eventDetailScreen(record?{...record,imageSrc:''}:{})]];
 if(publicData?.events.length){const post=publicData.events[0];examples.forEach(example=>example[0]='배치 예시 · '+example[0]);examples.unshift([publicData.store.name+' · 등록된 이벤트',kind==='list'?eventListScreen({items:publicData.events,...publicData.store,today:publicData.today}):eventDetailScreen({...post,imageSrc:post.image})]);}
 return '<div class="screen-page-content"><div>'+examples.map(([title,html])=>'<section class="screen-state-example"><h3>'+title+'</h3><div class="screen-artboard">'+html+'</div></section>').join('')+'</div><div class="screen-design-notes">'+(kind==='list'?'<h3>매장과 이벤트</h3><p>매장 로고와 이름 아래에 전체 이벤트를 보여줍니다.</p><h3>기간순 정리</h3><p>진행 중, 시작 예정, 종료된 이벤트 순으로 배치합니다.</p>':'<h3>행사 기간</h3><p>제목 아래에 시작일과 종료일을 함께 표시합니다.</p><h3>본문과 이미지</h3><p>안내를 먼저 읽고, 이어서 첨부 이미지를 볼 수 있도록 배치합니다.</p>')+'</div></div>';
}
export const eventPagesPrompt='기존 매장 이벤트 목록과 상세를 캡처와 CSS로 구현하세요. lib/0_pages/01_home/store_event.dart와 store_event_detail.dart의 StoreEventUtil 기준으로 기능·문구를 유지하고 스타일만 변경합니다. 일반목록 제목 우리 매장 이벤트, 매장로고30x30/실패시storefront와 매장명은 isPreview와 무관하게 표시합니다. isPreview=true는 이벤트 목록 제목이며 이번캔버스는 일반분기입니다. 전체목록에2개제한 없음. StoreEventUtil.sortEventList: 진행중→예정→종료, 진행중은 종료일/시작일/등록일오름차순, 예정은 시작일오름/종료일내림/등록일오름, 종료는 종료일/시작일/등록일내림차순입니다. 상태는 로컬자정기준, 기존별아이콘·진행 중·N일 남음·오늘 종료·D-N·종료된 이벤트 유지. 목록기간은 yyyy.M.d ~ yyyy.M.d입니다. 썸네일은 있을때80x80. 빈목록은 기존 emptyEventsUrl와 등록된 이벤트가 없습니다.; 등톡된 오타만 승인수정입니다. 상세헤더는 이벤트, 등록일 : yyyy.M.d HH.mm 오른쪽, 제목중앙, 기간중앙, 구분선, 본문, 선택사진순서입니다. 원본비율 유지. 상세에는 참여/공유/댓글/남은일 배지없음. 기존 API·상세이동은 유지하되 정적캔버스에서는 구현하지 않습니다. readingScreen/updateItem/appBar/surface 재사용. 렌더러 design-system/pages/home/event-pages.mjs, 공통 news-pages.mjs/store-updates.mjs, CSS event-pages.css/news-pages.css/store-updates.css. 샘플데이터는 기준일2026-09-19의 상태비교용입니다.';
