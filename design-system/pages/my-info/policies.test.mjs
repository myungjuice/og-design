import test from 'node:test';import assert from 'node:assert/strict';
test('policy rows preserve caller order, title and omit unused type',async()=>{
 const {policies}=await import('./policies.mjs');const h=policies({items:[{title:'두 번째 문서',type:'미표시유형',link:'/two'},{title:'첫 번째 문서',type:'미표시유형',link:'/one'}]});
 assert.ok(h.includes('약관 및 정책'));assert.ok(h.indexOf('두 번째 문서')<h.indexOf('첫 번째 문서'));assert.equal((h.match(/class="og-list-row/g)||[]).length,2);assert.ok(!h.includes('미표시유형'));assert.ok(!h.includes('checkbox'));assert.ok(h.includes('inert'));
});
test('empty policies do not invent a notice and titles are escaped',async()=>{
 const {policies,policiesBoard}=await import('./policies.mjs');assert.ok(!policies({items:[]}).includes('og-list-row'));assert.ok(policies({items:[{title:'<문서>'}]}).includes('&lt;문서&gt;'));assert.equal((policiesBoard().match(/class="og-policies"/g)||[]).length,2);
});
