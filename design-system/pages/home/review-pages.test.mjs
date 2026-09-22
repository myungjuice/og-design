import test from 'node:test';
import assert from 'node:assert/strict';
import {reviewCard} from './store-reviews.mjs';
test('list expansion preserves paragraphs and adds collapse without changing embedded cards',()=>{
 const expanded=reviewCard({text:'첫 문단\n\n두 번째',expandable:true,expanded:true});
 assert.match(expanded,/첫 문단\n\n두 번째/);
 assert.match(expanded,/접기/);
 assert.match(reviewCard({text:'본문',expandable:true}),/더보기/);
 assert.doesNotMatch(reviewCard({text:'본문'}),/더보기|접기/);
});
test('full list keeps all reviews and expands only selected entry',async()=>{
 const {reviewListScreen}=await import('./review-pages.mjs');
 const html=reviewListScreen({items:[{text:'첫째'},{text:'둘째'},{text:'셋째'}],expandedIndex:1});
 assert.equal((html.match(/og-store-review-card/g)||[]).length,3);
 assert.equal((html.match(/>접기</g)||[]).length,1);
 assert.equal((html.match(/>더보기</g)||[]).length,2);
 assert.doesNotMatch(html,/리뷰 작성|별점/);
 assert.match(html,/inert/);
});
test('photo viewer uses cover by default, contain for whole image and boundary arrows',async()=>{
 const {reviewPhotoScreen}=await import('./review-pages.mjs');
 const first=reviewPhotoScreen({imageSrc:'test.png',index:0,total:3});
 assert.doesNotMatch(first,/이전 사진/);assert.match(first,/다음 사진/);
 const last=reviewPhotoScreen({imageSrc:'test.png',index:2,total:3,fit:'contain',expanded:true});
 assert.match(last,/이전 사진/);assert.doesNotMatch(last,/다음 사진/);
 assert.match(last,/data-fit="contain"/);assert.match(last,/is-expanded/);
 assert.doesNotMatch(reviewPhotoScreen({total:1}),/이전 사진|다음 사진/);
});
test('review screens escape user content and boards expose five static states',async()=>{
 const {reviewListScreen,reviewPhotoScreen,reviewPagesBoard}=await import('./review-pages.mjs');
 for(const html of [reviewListScreen({name:'<script>',items:[{text:'<script>'}]}),reviewPhotoScreen({text:'<script>',name:'<script>'})]){
  assert.doesNotMatch(html,/<script>/);assert.match(html,/&lt;script&gt;/);
 }
 assert.equal((reviewPagesBoard('list').match(/class="screen-artboard"/g)||[]).length,2);
 assert.equal((reviewPagesBoard('photo').match(/class="screen-artboard"/g)||[]).length,3);
});
