import test from 'node:test';
import assert from 'node:assert/strict';
import {renderWorkspace} from '../render.mjs';
import {reviewGroups} from '../subnavigation.mjs';
const gallery=()=>renderWorkspace({pageId:'home'}).split('<section id="news-detail"')[1]||'';
const frame=state=>gallery().match(new RegExp(`data-news-detail-state="${state}"([\\s\\S]*?)<\\/template>`))?.[1]||'';

test('news detail is reachable in the updates group with deferred photo comparisons',()=>{
 assert.ok(reviewGroups('home').find(group=>group.id==='store-updates')?.items.some(item=>item.id==='news-detail'));
 for(const state of ['registered','photo','no-photo'])assert.ok(frame(state),state);
 assert.doesNotMatch(gallery(),/<details[^>]*\bopen\b/);
 assert.match(gallery(),/사진 배치/);assert.match(gallery(),/최신 소식이나 혜택을 뜻하지 않습니다/);
});

test('registered detail retains the source date, title, line breaks and bottom attachment',()=>{
 const html=frame('registered');assert.ok(html,'news detail must exist');
 assert.match(html,/<h4>매장 소식<\/h4>/);assert.match(html,/등록일 : 2026\.6\.26 21\.43/);
 assert.match(html,/<h5>포장할인 5000원<\/h5>/);
 assert.match(html,/대표메뉴 주문시 5000원\n포장 할인 됩니다\.\n많이 이용해 주세요♡♡/);
 assert.match(html,/news_image\/FS9184178497\/1782477996607\.jpg/);assert.match(html,/data-fit="contain"/);
 const date=html.indexOf('class="og-news-registered"'),title=html.indexOf('<h5>'),body=html.indexOf('class="og-news-contents"'),photo=html.indexOf('class="og-thumbnail v2-thumbnail"');
 assert.ok(date<title&&title<body&&body<photo);
 assert.equal([...html.matchAll(/<button\b/g)].length,1);
 assert.doesNotMatch(html,/댓글|좋아요|공유하기|정렬|작성하기|og-reading-period/);
});

test('no-photo detail retains the same text without an empty image slot',()=>{
 const html=frame('no-photo');assert.ok(html,'no-photo comparison must exist');
 assert.match(html,/포장할인 5000원/);assert.match(html,/대표메뉴 주문시 5000원\n포장 할인 됩니다\./);
 assert.match(frame('photo'),/news_image\//);
 assert.doesNotMatch(html,/v2-thumbnail|<img|이미지 없음|사진 없음 표시/);
});

test('news detail adapter escapes text without mutation and leaves reading scrollable but actions inert',async()=>{
 assert.ok(gallery(),'news detail must exist');
 const {renderHomeNewsDetailScreen:screen}=await import('./news-detail.mjs');
 const record={title:'<title> $&',contents:'첫 줄\n\n<script>alert(1)</script> $&',registered:'<date>',image:''};
 const before=JSON.stringify(record),html=screen({record});
 assert.match(html,/&lt;title&gt; \$&amp;/);assert.match(html,/첫 줄\n\n&lt;script&gt;alert\(1\)&lt;\/script&gt; \$&amp;/);
 assert.match(html,/등록일 : &lt;date&gt;/);assert.doesNotMatch(html,/<script|<title>|material-icons|og-reading-period|v2-thumbnail/);
 assert.equal(JSON.stringify(record),before);
 assert.match(html,/role="region" tabindex="0" aria-label="소식 본문"/);assert.doesNotMatch(html,/class="og-news-page og-reading-page" inert/);
 assert.ok([...html.matchAll(/<button\b[^>]*>/g)].every(([tag])=>/\binert\b/.test(tag)));
 assert.throws(()=>screen({state:'unknown'}),RangeError);
});
