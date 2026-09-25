import test from 'node:test';
import assert from 'node:assert/strict';
import * as v3 from './v3.mjs';
test('V3 includes four states',()=>{
 assert.equal((v3.barcodeV3Board().match(/class="og-barcode-screen /g)||[]).length,4);
});
test('V3 disables use based on available amount, not total; receipt stays enabled',()=>{
 assert.equal(typeof v3.barcodeV3Screen,'function');
 for(const total of [0,2400,12400]){
  const html=v3.barcodeV3Screen({total,available:0});
  assert.match(html,/<button[^>]* disabled[^>]*>마일리지 사용<\/button>/);
  assert.match(html,/<button(?![^>]*disabled)[^>]*>영수증 적립<\/button>/);
 }
 assert.match(v3.barcodeV3Screen({total:12400,available:10000}),/<button(?![^>]*disabled)[^>]*>마일리지 사용<\/button>/);
});
test('V3 guest hides balance and transaction controls',()=>{
 assert.equal(typeof v3.barcodeV3Screen,'function');
 const html=v3.barcodeV3Screen({loggedIn:false});
 assert.ok(html.includes('로그인 또는 가입하러 가기'));
 for(const text of ['보유 마일리지','영수증 적립','>마일리지 사용<','OG 0000'])assert.ok(!html.includes(text));
});
