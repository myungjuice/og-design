import test from 'node:test';
import assert from 'node:assert/strict';
import {updatesBoard} from './store-updates.mjs';
import {newsPagesBoard} from './news-pages.mjs';
import {eventPagesBoard} from './event-pages.mjs';
import {storeReviewsBoard} from './store-reviews.mjs';
import {reviewPagesBoard} from './review-pages.mjs';
import {menuDetailBoard} from './menu-detail.mjs';
import {publicPostsData} from './public-posts-data.mjs';
import {publicReviewsData} from './public-reviews-data.mjs';
import {publicStoreData} from './public-store-data.mjs';
test('all public-data state examples replace generic store and post content, not just the first example',()=>{
 const html=[updatesBoard('news',{publicData:publicPostsData}),updatesBoard('event',{publicData:publicPostsData}),newsPagesBoard('list',{publicData:publicPostsData}),newsPagesBoard('detail',{publicData:publicPostsData}),eventPagesBoard('list',{publicData:publicPostsData}),eventPagesBoard('detail',{publicData:publicPostsData}),storeReviewsBoard({publicData:publicReviewsData}),reviewPagesBoard('list',{publicData:publicReviewsData}),reviewPagesBoard('photo',{publicData:publicReviewsData}),menuDetailBoard({item:publicStoreData.items[0]})].join('');
 assert.doesNotMatch(html,/회원점명|회원점 소식 제목|회원점 이벤트 제목|회원 닉네임|회원이 작성한 리뷰 내용|메뉴에 대한 설명|<h2>메뉴명/);
 assert.match(html,/data-status="active"/);assert.match(html,/data-status="upcoming"/);assert.match(html,/data-status="ended"/);
});
