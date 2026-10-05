import test from 'node:test';
import assert from 'node:assert/strict';
import {renderWorkspace} from '../render.mjs';
import {reviewGroups} from '../subnavigation.mjs';
const gallery=()=>renderWorkspace({pageId:'home'}).split('<section id="news-list"')[1]||'';
const frame=state=>gallery().match(new RegExp(`data-news-list-state="${state}"([\\s\\S]*?)<\\/template>`))?.[1]||'';

test('full news list is reachable beside store updates with deferred comparisons',()=>{
 assert.ok(reviewGroups('home').find(group=>group.id==='store-updates')?.items.some(item=>item.id==='news-list'));
 for(const state of ['registered','photo-mix','empty'])assert.ok(frame(state),state);
 assert.doesNotMatch(gallery(),/<details[^>]*\bopen\b/);assert.match(gallery(),/실제 등록 건수가 아닙니다/);
});

test('registered full list preserves its real record and three-row photo comparison is explicitly separate',()=>{
 const html=frame('registered'),mix=frame('photo-mix');
 assert.match(gallery(),/육감만족/);assert.match(html,/우리 가게 소식/);assert.match(html,/포장할인 5000원/);assert.match(html,/6\.26\(금\)/);
 assert.equal([...html.matchAll(/class="og-update-row"/g)].length,1);
 assert.match(html,/news_image\/FS9184178497\/1782477996607\.jpg/);
 assert.equal([...mix.matchAll(/class="og-update-row"/g)].length,3);assert.equal([...mix.matchAll(/news_image\//g)].length,2);
 assert.equal([...mix.matchAll(/6\.26\(금\)/g)].length,3);
});

test('empty list preserves corrected source explanation and decorative 150px asset without invented actions',()=>{
 const html=frame('empty');assert.match(html,/등록된 데이터가 없어요\./);
 assert.match(html,/ogapp\/empty_event\.png/);assert.match(html,/data-fit="contain"/);assert.match(html,/aria-hidden="true"/);
 assert.doesNotMatch(html,/og-update-row|등톡|검색|정렬|작성|다시 시도/);
 assert.equal([...html.matchAll(/<button\b/g)].length,1);
});

test('full list adapter does not cap or sort entries, preserves escaping and keeps the body readable',async()=>{
 assert.ok(gallery(),'full news list must exist');
 const {renderHomeNewsListScreen:screen}=await import('./news-list.mjs');
 const items=[{title:'<script>alert(1)</script>',date:'오늘. 9.19(토)'},{title:'두번째',date:'어제. 9.18(금)'},{title:'세번째',date:'9.12(토)'},{title:'네번째',date:'9.1(화)'}];
 const before=JSON.stringify(items),html=screen({items});
 assert.equal([...html.matchAll(/class="og-update-row"/g)].length,4);assert.match(html,/&lt;script&gt;alert\(1\)&lt;\/script&gt;/);assert.doesNotMatch(html,/<script/);
 assert.ok(html.indexOf('오늘. 9.19(토)')<html.indexOf('어제. 9.18(금)'));assert.ok(html.indexOf('세번째')<html.indexOf('네번째'));
 assert.equal(JSON.stringify(items),before);assert.doesNotMatch(html,/v2-thumbnail|사진 없음 표시/);
 assert.match(html,/role="region" tabindex="0" aria-label="전체 소식 목록"/);assert.doesNotMatch(html,/material-icons|class="og-news-page" inert/);
 assert.ok([...html.matchAll(/<button\b[^>]*>/g)].every(([tag])=>/\binert\b/.test(tag)));
 assert.throws(()=>screen({state:'unknown'}),RangeError);
});
