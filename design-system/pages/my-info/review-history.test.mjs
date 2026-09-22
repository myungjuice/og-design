import test from 'node:test';
import assert from 'node:assert/strict';
test('standalone review history preserves header, avatar and shared review cards',async()=>{
 const {reviewHistory}=await import('./review-history.mjs');
 const {reviewCards}=await import('./use-history.mjs');
 const html=reviewHistory();
 assert.ok(html.includes('>리뷰 내역</h2>'));assert.ok(html.includes('og-avatar'));
 assert.ok(html.includes(reviewCards()));assert.ok(html.includes('inert'));
 assert.ok(!html.includes('role="tab"'));assert.ok(!html.includes('>닫기<'));
});
test('empty review screen retains header and legacy empty text, omits cards',async()=>{
 const {reviewHistory}=await import('./review-history.mjs');
 const html=reviewHistory({empty:true});
 assert.ok(html.includes('리뷰 내역이 없습니다.'));assert.ok(html.includes('>리뷰 내역</h2>'));
 assert.ok(!html.includes('data-history-kind="리뷰"'));
});
test('review cards omit photos when the source has none',async()=>{
 const {reviewCards}=await import('./use-history.mjs');
 const html=reviewCards({items:[{title:'매장',meta:'음식점',date:'2026. 9. 18',review:'사진 없는 후기',photos:[]}]});
 assert.ok(html.includes('사진 없는 후기'));assert.ok(!html.includes('og-use-review-photos'));
 assert.ok(!html.includes('og-thumbnail'));assert.ok(html.includes('리뷰 관리'));
});
