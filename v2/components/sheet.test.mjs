import test from 'node:test';
import assert from 'node:assert/strict';
const module=await import('./sheet.mjs').catch(()=>({}));
test('sheet reuses original layout with one named native modal and SVG close',()=>{
 assert.equal(typeof module.renderSheet,'function');
 const html=module.renderSheet({id:'test-sheet',title:'긴 제목 "$&',bodyHTML:'<p>본문</p>',modal:true});
 assert.match(html,/<dialog[^>]+v2-sheet-dialog/);assert.match(html,/aria-labelledby="test-sheet-title"/);
 assert.match(html,/긴 제목 &quot;\$&amp;/);assert.match(html,/og-sheet-header/);assert.match(html,/og-sheet-body/);assert.match(html,/og-sheet-footer/);
 assert.doesNotMatch(html,/material-icons|draggable/);assert.match(html,/data-sheet-close/);
 assert.equal((html.match(/<dialog/g)||[]).length,1);
 assert.match(module.renderSheet({title:'예시'}),/ inert/);
 assert.throws(()=>module.renderSheet({title:''}),TypeError);assert.throws(()=>module.renderSheet({title:'예시',size:'huge'}),RangeError);
});
test('sheet gallery separates applied sort from pending choice and has four history tabs',()=>{
 assert.equal(typeof module.renderSheetSamples,'function');
 const html=module.renderSheetSamples();
 assert.match(html,/data-sheet-open="v2-sheet-sort"/);assert.match(html,/data-sheet-sort-result/);
 for(const label of ['예약','웨이팅','Q오더','리뷰'])assert.ok(html.includes(label));
 assert.match(html,/선택 적용/);assert.match(html,/실제/);
});
