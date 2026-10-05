import test from 'node:test';
import assert from 'node:assert/strict';
import {renderWorkspace} from '../render.mjs';
import {reviewGroups} from '../subnavigation.mjs';
const ids=['store-reviews','review-list','review-photo','store-info','store-location'];
const gallery=id=>renderWorkspace({pageId:'home'}).split(`<section id="${id}"`)[1]?.split('<section id="')[0]||'';
const frame=(id,state)=>gallery(id).match(new RegExp(`data-${id}-state="${state}"([\\s\\S]*?)<\\/template>`))?.[1]||'';
// Catch missing gallery wiring and eager mounting, not private helper structure.
test('all five remaining home boards are reachable through related groups and deferred templates',()=>{
 const groups=reviewGroups('home');
 assert.deepEqual(groups.find(group=>group.id==='store-reviews')?.items.map(item=>item.id),['store-reviews','praise-write','review-list','review-photo']);
 assert.deepEqual(groups.find(group=>group.id==='store-information')?.items.map(item=>item.id),ids.slice(3));
 for(const id of ids){assert.ok(gallery(id),id);assert.match(gallery(id),/<template/);assert.doesNotMatch(gallery(id),/<details[^>]*\bopen\b/);}
});
test('store reviews preserve praise order, five/seven rows and at most two registered reviews',()=>{
 const html=frame('store-reviews','registered');assert.ok(html,'review body must exist');
 assert.equal((html.match(/class="og-praise-row"/g)||[]).length,5);
 assert.equal((frame('store-reviews','expanded').match(/class="og-praise-row"/g)||[]).length,7);
 assert.equal((html.match(/class="og-surface og-store-review-card/g)||[]).length,2);
 assert.match(html,/재료가 신선해요/);assert.match(html,/인테리어가 멋져요/);assert.match(html,/주차하기 편해요/);
 assert.match(html,/하남에 오면 자주 오는곳입니다/);assert.doesNotMatch(html,/방문자 3|별점|>좋아요<|>신고</);
 assert.match(frame('store-reviews','expanded'),/줄이기/);assert.match(html,/더 보기/);
});
test('empty store reviews preserve eligibility-specific copy and writing availability',()=>{
 for(const state of ['empty-eligible','empty-ineligible']){const html=frame('store-reviews',state);assert.ok(html,state);assert.match(html,/아직 리뷰가 없어요/);assert.doesNotMatch(html,/og-praise-row|og-store-review-card|리뷰 사진/);}
 assert.match(frame('store-reviews','empty-eligible'),/이 매장의 첫 번째 리뷰어가 되어 주세요/);
 assert.match(frame('store-reviews','empty-eligible'),/리뷰 작성/);
 assert.match(frame('store-reviews','empty-ineligible'),/이 매장을 방문하고/);
 assert.doesNotMatch(frame('store-reviews','empty-ineligible'),/리뷰 작성/);
});
test('photo review list preserves all three anonymous reviews, three photos, brand and expand actions',()=>{
 const html=frame('review-list','registered');assert.ok(html,'review list must exist');
 assert.match(html,/<h4>포토 리뷰<\/h4>/);assert.match(html,/오형제황제누룽지탕/);assert.match(html,/한식/);
 for(const name of ['방문자 1','방문자 2','방문자 3'])assert.match(html,new RegExp(name));
 assert.equal((html.match(/data-v2-media="thumbnail"/g)||[]).length,4); // brand fallback plus 3 photos
 assert.equal((html.match(/>더보기<\/button>/g)||[]).length,3);
 assert.match(frame('review-list','expanded'),/is-expanded/);assert.match(frame('review-list','expanded'),/>접기<\/button>/);
 assert.doesNotMatch(html,/리뷰 작성|별점|좋아요|필터/);
});
test('review photo uses original author/date, cover/contain and first/last arrow boundaries',()=>{
 const first=frame('review-photo','registered'),last=frame('review-photo','last');assert.ok(first,'photo detail must exist');
 assert.match(first,/방문자 1/);assert.match(first,/26\.7\.25 15:28/);assert.match(first,/1784960925529\.jpg/);
 assert.doesNotMatch(first,/aria-label="이전 사진"/);assert.match(first,/aria-label="다음 사진"/);
 assert.match(last,/방문자 2/);assert.match(last,/1784627310169\.jpg/);assert.match(last,/aria-label="이전 사진"/);assert.doesNotMatch(last,/aria-label="다음 사진"/);
 assert.match(first,/data-fit="cover"/);assert.match(frame('review-photo','contain'),/data-fit="contain"/);
 assert.match(frame('review-photo','expanded'),/og-review-photo-shade/);assert.doesNotMatch(first,/저장|공유|사진번호/);
});
test('registered store information shows only registered address and hours without fictitious contacts',()=>{
 const html=frame('store-info','registered');assert.ok(html,'store info must exist');
 assert.match(html,/서울 마포구 월드컵로17길 48 지하1층/);assert.match(html,/매일 오후 12:00 ~ 오후 10:30/);assert.match(html,/위치찾기/);
 assert.doesNotMatch(html,/브레이크타임|정기 휴무일|임시 휴무일|og-store-contacts|example\.com|02-000/);
 assert.match(frame('store-info','minimal'),/월드컵로17길/);assert.doesNotMatch(frame('store-info','minimal'),/og-store-hours/);
});
test('location is an existing app-choice sheet, with cadastral address and provider order',()=>{
 const html=frame('store-location','registered');assert.ok(html,'location sheet must exist');
 assert.match(html,/서울 마포구 망원동 57-119 지하1층/);assert.match(html,/복사/);
 assert.ok(html.indexOf('>카카오<')<html.indexOf('>네이버<')&&html.indexOf('>네이버<')<html.indexOf('>티맵<'));
 assert.equal((html.match(/class="og-navigation-provider"/g)||[]).length,3);
 assert.doesNotMatch(html,/닫기|확인|지도보기|iframe|maps\.google/);
});
test('five adapters retain safe escaping, input immutability and individually inert service controls',async()=>{
 assert.ok(gallery('review-list'),'adapters must be wired');
 const {renderHomeStoreReviewsScreen:reviews,renderHomeReviewListScreen:list,renderHomeReviewPhotoScreen:photo}=await import('./reviews.mjs');
 const {renderHomeStoreInfoScreen:info,renderHomeStoreLocationScreen:location}=await import('./information.mjs');
 const data={store:{name:'<store> $&',category:'한식',address:'주소',logo:''},praise:[],items:[{name:'<name> $&',date:'2026. 1. 2',photoDate:'26.1.2 10:00',text:'첫 줄\n\n<script>x</script> $&',images:[]}]};
 const before=JSON.stringify(data);
 for(const html of [reviews({data}),list({data})]){assert.match(html,/&lt;store&gt; \$&amp;/);assert.match(html,/&lt;script&gt;x&lt;\/script&gt; \$&amp;/);assert.doesNotMatch(html,/<script|material-icons/);assert.ok([...html.matchAll(/<button\b[^>]*>/g)].every(([tag])=>/\binert\b/.test(tag)));}
 assert.equal(JSON.stringify(data),before);
 for(const fn of [reviews,list,photo,info,location])assert.throws(()=>fn({state:'unknown'}),RangeError);
 for(const id of ids){const html=frame(id,'registered');assert.ok([...html.matchAll(/<button\b[^>]*>/g)].every(([tag])=>/\binert\b/.test(tag)),id);assert.doesNotMatch(html,/material-icons/,id);}
});
