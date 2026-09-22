import test from 'node:test';
import assert from 'node:assert/strict';
test('FAQ starts unselected and reveals only the selected answer source',async()=>{
 const {faq}=await import('./faq.mjs');
 const data={top:[{category:'분류',title:'도움말 질문',body:'도움말 답변'}],categories:['분류'],items:[{title:'목록 질문',body:'목록 답변'}]};
 const basic=faq(data);assert.ok(basic.includes('자주 찾는 도움말'));assert.ok(!basic.includes('도움말 답변'));assert.ok(!basic.includes('목록 질문'));
 const best=faq({...data,bestIndex:0});assert.ok(best.includes('도움말 답변'));assert.ok(!best.includes('목록 질문'));
 const category=faq({...data,categoryIndex:0});assert.ok(category.includes('목록 질문'));assert.ok(!category.includes('목록 답변'));
 const answer=faq({...data,categoryIndex:0,itemIndex:0});assert.ok(answer.includes('목록 답변'));assert.ok(!answer.includes('도움말 답변'));assert.ok(answer.includes('aria-expanded="true"'));
});
test('FAQ preserves odd category padding and escapes data in static specimens',async()=>{
 const {faq,faqBoard}=await import('./faq.mjs');
 const h=faq({top:[],categories:['<img src=x>'],items:[]});
 assert.ok(h.includes('&lt;img src=x&gt;'));assert.ok(h.includes('og-faq-category-blank'));assert.ok(!h.includes('<img src=x>'));assert.ok(!h.includes('og-faq-dots'));assert.ok(h.includes('inert'));
 assert.equal((faqBoard().match(/class="og-faq"/g)||[]).length,4);
});
