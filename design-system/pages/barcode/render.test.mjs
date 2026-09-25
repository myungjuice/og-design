import test from 'node:test';
import assert from 'node:assert/strict';
import {mileage} from '../../components/progress/render.mjs';
test('payment balance shows 48 percent toward next 5000 M',()=>{
 const h=mileage({total:12400,available:10000,max:15000,density:'payment'});
 assert.match(h,/보유 마일리지/);assert.match(h,/2,600 M/);assert.match(h,/aria-valuenow="48"/);
 assert.ok(!h.includes('공유 적립'));
});
test('milestone resets at exact multiples and handles zero',()=>{
 for(const total of [0,5000]){const h=mileage({total,available:total,max:total+5000,density:'payment'});assert.match(h,/aria-valuenow="0"/);assert.match(h,/5,000 M 더 모으면/);}
});
test('barcode guest hides balance and actions without removing login or guide',async()=>{
 const {barcodeScreen}=await import('./render.mjs');const h=barcodeScreen({loggedIn:false});
 assert.ok(h.includes('로그인 또는 가입하러 가기'));assert.ok(h.includes('마일리지 적립/사용 안내'));
 assert.ok(!h.includes('영수증 적립'));assert.ok(!h.includes('OG 0000'));assert.ok(!h.includes('12,400 M'));
});
test('barcode retains legacy actions even below use threshold',async()=>{
 const {barcodeScreen}=await import('./render.mjs');const h=barcodeScreen({total:2400,available:0});
 for(const label of ['영수증 적립','마일리지 사용','마일리지 적립/사용 안내','보유 마일리지','내 바코드'])assert.ok(h.includes(label));
 assert.ok(!h.includes('OG PAY'));assert.ok(h.includes('inert'));
});

test('payment and compact use the same amount styling and brand progress',()=>{
 for(const density of ['payment','compact']){
  const html=mileage({total:12400,available:10000,max:15000,density});
  assert.ok(html.includes('og-mileage-values'));
  assert.ok(html.includes('data-tone="brand"'));
 }
});
test('barcode does not introduce a member-number label',async()=>{
 const {barcodeScreen}=await import('./render.mjs');
 assert.ok(!barcodeScreen().includes('오지고랜드 회원 번호'));
});
