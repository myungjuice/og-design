import test from 'node:test';
import assert from 'node:assert/strict';
import {renderWorkspace} from '../render.mjs';
import {reviewGroups} from '../subnavigation.mjs';

test('remaining twelve bodies and all fifty-seven source states are integrated once',()=>{
 const html=renderWorkspace({pageId:'my-info'});
 const counts={membership:4,settings:7,password:5,account:8,support:5,faq:4,opinion:7,'customer-center':1,policies:2,'policy-detail':2,'photo-review':5,'review-write':7};
 for(const [id,count] of Object.entries(counts)){
  assert.equal((html.match(new RegExp('id="'+id+'" data-review-screen','g'))||[]).length,1,id);
  assert.equal((html.match(new RegExp('data-source-domain="'+id+'"','g'))||[]).length,count,id);
 }
 assert.equal((html.match(/data-source-domain=/g)||[]).length,57);
});
test('related body groups include the new views while explicitly held work stays non-navigable',()=>{
 const groups=reviewGroups('my-info'),ready=groups.flatMap(g=>g.items.filter(i=>!i.pending));
 assert.equal(ready.length,26);
 assert.deepEqual(groups.find(g=>g.id==='history-reviews').items.map(i=>i.id),['review-history','photo-review','review-write']);
 assert.deepEqual(groups.find(g=>g.id==='inquiries').items.map(i=>i.id),['support','faq','opinion','customer-center']);
 assert.deepEqual(groups.find(g=>g.id==='documents').items.map(i=>i.id),['policies','policy-detail']);
 assert.deepEqual(groups.filter(g=>g.id==='held').flatMap(g=>g.items.map(i=>i.label)),['캐릭터 파츠 꾸미기']);
});
