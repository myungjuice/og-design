import test from 'node:test';
import assert from 'node:assert/strict';
import * as page from './render.mjs';
test('Barcode includes four states',()=>{
 assert.equal((page.barcodeBoard().match(/class="og-barcode-screen"/g)||[]).length,4);
});
test('Barcode disables use based on available amount, not total; receipt stays enabled',()=>{
 assert.equal(typeof page.barcodeScreen,'function');
 for(const total of [0,2400,12400]){
  const html=page.barcodeScreen({total,available:0});
  assert.match(html,/<button[^>]* disabled[^>]*>마일리지 사용<\/button>/);
  assert.match(html,/<button(?![^>]*disabled)[^>]*>영수증 적립<\/button>/);
 }
 assert.match(page.barcodeScreen({total:12400,available:10000}),/<button(?![^>]*disabled)[^>]*>마일리지 사용<\/button>/);
});
test('Barcode guest hides balance and transaction controls',()=>{
 assert.equal(typeof page.barcodeScreen,'function');
 const html=page.barcodeScreen({loggedIn:false});
 assert.ok(html.includes('로그인 또는 가입하러 가기'));
 for(const text of ['보유 마일리지','영수증 적립','>마일리지 사용<','OG 0000'])assert.ok(!html.includes(text));
});
