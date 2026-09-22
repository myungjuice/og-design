import test from 'node:test';
import assert from 'node:assert/strict';
import {updatesBoard} from './store-updates.mjs';
import {newsPagesBoard} from './news-pages.mjs';
import {eventPagesBoard} from './event-pages.mjs';
const record={title:'등록된 제목',contents:'원문 첫줄\n둘째줄',image:'https://example.com/post.jpg',registered:'2026.6.26 21.43',date:'6.26(금)',start:'2026-06-26',end:'2026-08-31'};
const publicData={store:{name:'등록 매장',category:'한식',address:'등록 주소'},news:[record],events:[record],today:'2026-09-20'};
test('registered posts are rendered first under their own store, retaining illustrative states',()=>{
 for(const kind of ['news','event']){const html=updatesBoard(kind,{publicData});assert.match(html,/등록 매장/);assert.match(html,/등록된 제목/);assert.doesNotMatch(html,/회원점명/);assert.match(html,/상태별 배치 예시/);if(kind==='event')assert.match(html,/종료된 이벤트/);}
});
test('registered lists and details retain body, date, image and separate old examples',()=>{
 for(const board of [newsPagesBoard,eventPagesBoard])for(const kind of ['list','detail']){const html=board(kind,{publicData});assert.match(html,/등록된 제목/);assert.match(html,/post.jpg/);if(kind==='detail'){assert.match(html,/원문 첫줄\n둘째줄/);assert.match(html,/2026.6.26 21.43/);}}
});
