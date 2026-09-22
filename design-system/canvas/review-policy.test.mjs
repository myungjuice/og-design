import test from 'node:test';
import assert from 'node:assert/strict';
test('post-review work is pending without overwriting user completion',async()=>{
 const {reviewState}=await import('./review-policy.mjs');
 for(const id of ['my-info-order-detail','my-info-review-history','my-info-notices']){
  assert.equal(reviewState({id,ready:true}), 'pending');
  assert.equal(reviewState({id,ready:true,saved:'done'}),'done');
 }
});
test('new boards and filled placeholders auto-enroll while earlier work stays unassigned',async()=>{
 const {reviewState}=await import('./review-policy.mjs');
 assert.equal(reviewState({id:'future-component',ready:true}),'pending');
 assert.equal(reviewState({id:'my-info-notice-detail',ready:false}),undefined);
 assert.equal(reviewState({id:'my-info-notice-detail',ready:true}),'pending');
 assert.equal(reviewState({id:'color',ready:true}),undefined);
 assert.equal(reviewState({id:'color',ready:true,saved:'pending'}),'pending');
 assert.equal(reviewState({id:'review-waiting-people',ready:true,initial:true}),'pending');
});
