import test from 'node:test';
import assert from 'node:assert/strict';
import {renderWorkspace} from '../render.mjs';
import {reviewGroups} from '../subnavigation.mjs';
const gallery=()=>renderWorkspace({pageId:'home'}).split('<section id="event-detail"')[1]||'';
const frame=state=>gallery().match(new RegExp(`data-event-detail-state="${state}"([\\s\\S]*?)<\\/template>`))?.[1]||'';

test('event detail is reachable beside its list and keeps photo comparisons deferred',()=>{
 assert.ok(reviewGroups('home').find(group=>group.id==='store-updates')?.items.some(item=>item.id==='event-detail'));
 for(const state of ['registered','photo','no-photo'])assert.ok(frame(state),state);
 assert.doesNotMatch(gallery(),/<details[^>]*\bopen\b/);assert.match(gallery(),/별도의 실제 이벤트가 아닙니다/);
});
test('event reading preserves date, centred title and original period before prose and optional image',()=>{
 const html=frame('registered');assert.ok(html,'event detail must exist');
 assert.match(html,/<h4>이벤트<\/h4>/);assert.match(html,/등록일 : 2026\.6\.26 21\.45/);assert.match(html,/<h5>포장할인 5000원<\/h5>/);
 assert.match(html,/2026\.6\.26 ~ 2026\.8\.31/);assert.match(html,/대표메뉴 주문시 포장\n5000원 할인 됩니다\./);
 assert.match(html,/event_banner\/FS9184178497\/1782477916274\.jpg/);assert.match(html,/data-fit="contain"/);
 const order=['class="og-news-registered"','<h5>','class="og-reading-period"','class="og-news-contents"','class="og-thumbnail v2-thumbnail"'].map(value=>html.indexOf(value));
 assert.ok(order.every((value,index)=>value>=0&&(!index||value>order[index-1])));
 assert.equal([...html.matchAll(/<button\b/g)].length,1);assert.doesNotMatch(html,/참여하기|공유하기|댓글|일 남음|진행 중/);
});
test('no-photo event retains dates and contents without reserving a missing image slot',()=>{
 const html=frame('no-photo');assert.ok(html,'comparison must exist');
 assert.match(html,/2026\.6\.26 ~ 2026\.8\.31/);assert.match(html,/대표메뉴 주문시 포장\n5000원 할인 됩니다\./);
 assert.match(frame('photo'),/event_banner\//);assert.doesNotMatch(html,/v2-thumbnail|<img|이미지 없음|사진 없음 표시/);
});
test('event detail adapter preserves escaping, dotted dates and immutable records with readable inert actions',async()=>{
 assert.ok(gallery(),'event detail must exist');const {renderHomeEventDetailScreen:screen}=await import('./event-detail.mjs');
 const record={title:'<title> $&',contents:'첫 줄\n\n<script>alert(1)</script> $&',registered:'<date>',image:'',start:'2026-01-02',end:'2026-02-03'};
 const before=JSON.stringify(record),html=screen({record});
 assert.match(html,/&lt;title&gt; \$&amp;/);assert.match(html,/첫 줄\n\n&lt;script&gt;alert\(1\)&lt;\/script&gt; \$&amp;/);
 assert.match(html,/등록일 : &lt;date&gt;/);assert.match(html,/2026\.1\.2 ~ 2026\.2\.3/);assert.doesNotMatch(html,/<script|<title>|material-icons|v2-thumbnail/);
 assert.equal(JSON.stringify(record),before);assert.match(html,/role="region" tabindex="0" aria-label="이벤트 본문"/);
 assert.ok([...html.matchAll(/<button\b[^>]*>/g)].every(([tag])=>/\binert\b/.test(tag)));assert.throws(()=>screen({state:'unknown'}),RangeError);
});
