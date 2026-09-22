import test from 'node:test';import assert from 'node:assert/strict';
test('policy detail uses supplied document title without new actions',async()=>{
 const {policyDetail}=await import('./policy-detail.mjs');const h=policyDetail({title:'<문서 제목>'});assert.ok(h.includes('&lt;문서 제목&gt;'));assert.ok(h.includes('뒤로가기'));assert.ok(h.includes('inert'));assert.ok(!h.includes('동의'));assert.ok(!h.includes('시행일'));assert.ok(!h.includes('iframe'));
});
test('policy detail preview includes basic and long document layouts',async()=>{
 const {policyDetailBoard}=await import('./policy-detail.mjs');const h=policyDetailBoard();assert.equal((h.match(/class="og-policy-detail"/g)||[]).length,2);assert.ok(h.includes('문단'));assert.ok(!h.includes('제1조'));
});
