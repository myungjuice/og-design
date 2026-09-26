import test from 'node:test';
import assert from 'node:assert/strict';
import * as shapes from './new-shapes.mjs';
test('both badge comparisons retain three legacy pins and a single NEW label',()=>{
 assert.equal(typeof shapes.newShapeBoard,'function');
 for(const kind of ['tab','sticker']){
  const html=shapes.newShapeBoard(kind);
  assert.equal((html.match(/class="og-map-pin"/g)||[]).length,3);
  assert.equal((html.match(/class="og-map-new"/g)||[]).length,1);
  assert.ok(html.includes('og-new-'+kind));
  assert.ok(html.includes('© NAVER Corp.'));
 }
});
