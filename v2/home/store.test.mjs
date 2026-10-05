import test from 'node:test';
import assert from 'node:assert/strict';
import {renderWorkspace} from '../render.mjs';
import {reviewGroups} from '../subnavigation.mjs';
import {renderHomeStoreContent,renderHomeStoreScreen} from './store.mjs';
import {publicStoreData} from '../../design-system/pages/home/public-store-data.mjs';
const frame=(html,state)=>html.match(new RegExp(`data-store-state="${state}"([\\s\\S]*?)<\\/template>`))?.[1]||'';

// Catches an unreachable destination, missing comparison branch, or eagerly open gallery.
test('store review retains its three primary states and adds bounded source comparisons',()=>{
 const html=renderWorkspace({pageId:'home'});
 assert.ok(reviewGroups('home').some(group=>group.items.some(item=>item.id==='store'&&!item.pending)));
 assert.match(html,/<section id="store"[^>]*data-review-screen/);
 assert.deepEqual([...html.matchAll(/data-store-state="([^"]+)"/g)].map(m=>m[1]),['basic','limited','no-photo','promotion-expanded','bookmarked','closed','break-time','before-open','opening-soon','temporary-holiday','regular-holiday','holiday']);
 assert.equal((html.match(/data-store-template/g)||[]).length,12);
 assert.match(html,/다른 상태 비교 · 11개/);
 assert.doesNotMatch(html,/<details[^>]*v2-home-store-extra[^>]*\bopen\b/);
});

// Catches omitted detail addresses, fallback loss, and stringified missing fields.
test('shared store identity combines public street and optional detail addresses',()=>{
 assert.match(renderHomeStoreScreen(),/<p>서울 마포구 월드컵로17길 48 지하1층<\/p>/);
 for(const [info,expected] of [
  [{streetAddress:'별도 도로',detailAddress:'2층'},'별도 도로 2층'],
  [{streetAddress:'별도 도로'},'별도 도로'],
  [{detailAddress:''},'기존 주소'],
  [null,'기존 주소']
 ]){
  const html=renderHomeStoreContent({store:{name:'이름',address:'기존 주소'},info});
  assert.ok(html.includes('<p>'+expected+'</p>'));assert.doesNotMatch(html,/undefined|null/);
 }
});

// Catches false favorite selection or hiding the source promotion affordance.
test('store favorite selection and collapsed or expanded promotion follow supplied specimen state',()=>{
 for(const bookmarked of [false,true]){
  const html=renderHomeStoreContent({store:{...publicStoreData.store,bookmarked}});
  assert.match(html,new RegExp('aria-pressed="'+bookmarked+'"'));
 }
 const collapsed=renderHomeStoreScreen(),expanded=renderHomeStoreScreen({state:'promotion-expanded'});
 assert.match(collapsed,/data-promotion-expanded="false"/);assert.match(collapsed,/aria-expanded="false"/);assert.match(collapsed,/>더 보기</);
 assert.match(expanded,/data-promotion-expanded="true"/);assert.match(expanded,/aria-label="매장 소개 접기"[^>]*aria-expanded="true"|aria-expanded="true"[^>]*aria-label="매장 소개 접기"/);
 assert.ok(expanded.includes('고객분들에게 전하는 약속입니다.'));
 assert.match(renderHomeStoreScreen({state:'bookmarked'}),/aria-pressed="true"/);
});

// Catches mapping an open status to a closed hero or losing source labels/subtexts.
test('closed store specimens decorate only the hero and keep the body readable',()=>{
 for(const [state,label,subtext,identitySub] of [
  ['closed','영업 종료','지금은 영업 시간이 아니에요',''],
  ['break-time','브레이크 타임','지금은 영업 시간이 아니에요','17:00에 영업 시작'],
  ['before-open','영업 전','지금은 영업 시간이 아니에요','12:00에 영업 시작'],
  ['opening-soon','곧 영업 시작','지금은 영업 시간이 아니에요','12:00에 영업 시작'],
  ['temporary-holiday','임시 휴일','오늘은 쉬어가요',''],
  ['regular-holiday','정기 휴일','오늘은 쉬어가요',''],
  ['holiday','공휴일','오늘은 쉬어가요','']
 ]){
  const html=renderHomeStoreScreen({state});
  const photo=html.match(/<div class="og-store-photo[^>]*>[\s\S]*?<\/section>/)?.[0]||'';
  assert.match(photo,/data-store-hero-closed="true"/);assert.ok(photo.includes(label));assert.ok(photo.includes(subtext));
  if(identitySub)assert.ok(html.includes(identitySub));
  assert.match(html,/class="og-store-body" role="region" tabindex="0"/);assert.doesNotMatch(html,/class="og-store" inert|og-store-body[^>]*inert/);
 }
 for(const status of [null,{runtimeStatus:'open',isOpen:true,label:'영업 중'}, {runtimeStatus:'breakPreparing',isOpen:true,label:'곧 브레이크 타임'},{runtimeStatus:'closePreparing',isOpen:true,label:'곧 영업 종료'}]){
  const html=renderHomeStoreContent({runtimeStatus:status});assert.doesNotMatch(html,/data-store-hero-closed|v2-store-hero-status/);
 }
});

// Catches fake identity/copy or changing absent-photo and counter semantics.
test('store first screens retain public identity and original photo branches',()=>{
 const html=renderWorkspace({pageId:'home'});
 for(const state of ['basic','limited','no-photo']){
  const screen=frame(html,state);
  assert.match(screen,/오시 망원본점/);assert.match(screen,/서울 마포구 월드컵로17길 48/);
  assert.match(screen,/최애가 되기위해 탄생한 오꼬노미야끼/);
  assert.match(screen,/한국인 취향을 반영한 맛과 개성/);
  assert.match(screen,/brand_logo\/FS3627025392\/1705305529208\.jpg/);
  assert.match(screen,/v2-thumbnail/);
 }
 assert.match(frame(html,'basic'),/>1 · 10<\/span>/);
 assert.match(frame(html,'limited'),/>1 · 1<\/span>/);
 assert.match(frame(html,'basic'),/store_photo\/FS3627025392\/1710146278412\.jpg/);
 assert.match(frame(html,'no-photo'),/ogapp\/no_image\.png/);
 assert.doesNotMatch(frame(html,'no-photo'),/og-store-count|store_photo\/FS3627025392/);
});

// Catches leaking unavailable section shortcuts or turning section navigation into content tabs.
test('store section shortcuts preserve original availability conditions and source order',()=>{
 const html=renderWorkspace({pageId:'home'});
 for(const [state,expected] of [
  ['basic',['홈','메뉴','예약/웨이팅','소식/이벤트','리뷰','매장 상세정보','위치찾기']],
  ['limited',['홈','리뷰','매장 상세정보','위치찾기']],
  ['no-photo',['홈','예약','리뷰','매장 상세정보','위치찾기']]
 ]){
  const nav=frame(html,state).match(/<nav[^>]*aria-label="매장 내용 이동"[\s\S]*?<\/nav>/)?.[0]||'';
  assert.deepEqual([...nav.matchAll(/<button[^>]*>([^<]+)<\/button>/g)].map(m=>m[1]),expected);
  assert.match(nav,/aria-current="location"/);
  assert.doesNotMatch(nav,/role="tab|aria-controls|tabpanel/);
 }
 assert.match(frame(html,'basic'),/>EVENT<\/span>/);
 assert.doesNotMatch(frame(html,'limited'),/og-store-event/);
});

// Catches whole-frame inert disabling reading, service actions becoming live, or missing accessible controls.
test('store reading stays scrollable while all service shortcuts remain static',()=>{
 const html=renderWorkspace({pageId:'home'});
 for(const state of ['basic','limited','no-photo']){
  const screen=frame(html,state);
  assert.match(screen,/class="og-store-body"[^>]*role="region"[^>]*tabindex="0"/);
  assert.doesNotMatch(screen,/class="og-store" inert|material-icons|aria-controls/);
  for(const label of ['뒤로가기','길찾기','공유','찜'])assert.match(screen,new RegExp(`aria-label="${label}"`));
  assert.match(screen,/v2-icon-button/);assert.match(screen,/aria-pressed="false"/);
  assert.doesNotMatch(screen,/bottom-navigation|home-map-ground/);
 }
});
