import test from 'node:test';
import assert from 'node:assert/strict';
import {renderWorkspace} from '../render.mjs';
import {reviewGroups} from '../subnavigation.mjs';
const gallery=()=>renderWorkspace({pageId:'home'}).split('<section id="store-news"')[1]||'';
const frame=state=>gallery().match(new RegExp(`data-store-news-state="${state}"([\\s\\S]*?)<\\/template>`))?.[1]||'';

test('store news is reachable in the updates group with three lazy source examples',()=>{
 assert.ok(reviewGroups('home').find(group=>group.id==='store-updates')?.items.some(item=>item.id==='store-news'));
 for(const state of ['registered','with-photo','no-photo'])assert.ok(frame(state),state);
 assert.doesNotMatch(gallery(),/<details[^>]*\bopen\b/);
 assert.match(gallery(),/사진이 없으면 빈 이미지 자리 없이/);
});

test('registered news preserves actual store, date and one item without fabricating a second',()=>{
 const html=frame('registered');assert.match(html,/육감만족/);assert.match(html,/경기 하남시 신평로55번길 22/);
 assert.match(html,/포장할인 5000원/);assert.match(html,/6\.26\(금\)/);
 assert.equal([...html.matchAll(/class="og-update-row"/g)].length,1);
 assert.match(html,/news_image\/FS9184178497\/1782477996607\.jpg/);
 assert.match(html,/data-ratio="square"/);assert.match(html,/aria-current="location">소식</);
});

test('photo comparisons keep the source two-row layout and omit empty photo slots',()=>{
 const photo=frame('with-photo'),none=frame('no-photo');
 for(const html of [photo,none]){assert.equal([...html.matchAll(/class="og-update-row"/g)].length,2);assert.equal([...html.matchAll(/6\.26\(금\)/g)].length,2);}
 assert.equal([...photo.matchAll(/news_image\//g)].length,1);assert.doesNotMatch(none,/news_image\/|사진 없음 표시/);
});

test('news adapter preserves omission, ordering, two-item limit and escaped text with static controls',async()=>{
 assert.ok(gallery(),'news review must exist');
 const {renderHomeStoreNewsSection,renderHomeStoreNewsScreen}=await import('./store-news.mjs');
 assert.equal(renderHomeStoreNewsSection([]),'');
 const html=renderHomeStoreNewsSection([{title:'<img onerror=alert(1)>',date:'오늘(월)'},{title:'두번째',date:'10.4(일)'},{title:'세번째',date:'10.3(토)'}]);
 assert.match(html,/&lt;img onerror=alert\(1\)&gt;/);assert.doesNotMatch(html,/<img|세번째/);assert.ok(html.indexOf('오늘(월)')<html.indexOf('두번째'));
 assert.match(html,/v2-section-heading/);assert.match(html,/aria-label="소식 더보기"/);
 const screen=renderHomeStoreNewsScreen();assert.match(screen,/tabindex="0" aria-label="매장 소식 안내"/);
 assert.doesNotMatch(screen,/material-icons|class="og-store" inert/);
 assert.ok([...screen.matchAll(/<button\b[^>]*>/g)].every(([tag])=>/\binert\b/.test(tag)));
 assert.throws(()=>renderHomeStoreNewsScreen({state:'unknown'}),RangeError);
});
