import test from 'node:test';
import assert from 'node:assert/strict';
import {reviewWrite,reviewWriteBoard} from './review-write.mjs';
test('new review reveals actions only after text or photos, including untrimmed whitespace',()=>{
 assert.doesNotMatch(reviewWrite(),/변경 내용 저장/);
 assert.match(reviewWrite({body:' '}),/변경 내용 저장/);
 assert.match(reviewWrite({photos:[{id:'a',src:''}]}),/변경 내용 저장/);
 assert.doesNotMatch(reviewWrite(),/maxlength=/);
});
test('editing preserves unchanged state and detects text, deletion and reordered photos',()=>{
 const original={body:'기존 리뷰',photos:[{id:'a',src:''},{id:'b',src:''}]};
 assert.doesNotMatch(reviewWrite({...original,original}),/변경 내용 저장/);
 for(const props of [{body:'수정 리뷰'},{photos:original.photos.slice(1)},{photos:[...original.photos].reverse()},{deletedCount:1}])assert.match(reviewWrite({...original,original,...props}),/변경 내용 저장/);
});
test('selected photo alone exposes deletion and seven inert examples are rendered',()=>{
 const photos=[{id:'a',src:''},{id:'b',src:''}];
 assert.doesNotMatch(reviewWrite({photos}),/리뷰 사진 삭제/);
 assert.equal((reviewWrite({photos,selected:1}).match(/aria-label="리뷰 사진 삭제"/g)||[]).length,1);
 assert.doesNotMatch(reviewWrite({body:'<script>x</script>'}),/<script>/);
 assert.equal((reviewWriteBoard().match(/class="og-review-write"/g)||[]).length,7);
});
