import test from 'node:test';
import assert from 'node:assert/strict';
import {account,accountBoard} from './account.mjs';
test('private fields are masked until the visible specimen is requested',()=>{
 const hidden=account({name:'홍길동',phone:'01012345678'});
 assert.match(hidden,/홍\*동/);assert.match(hidden,/010-\*\*\*\*-5678/);assert.doesNotMatch(hidden,/01012345678/);
 const visible=account({name:'홍길동',phone:'01012345678',visible:true});assert.match(visible,/홍길동/);assert.match(visible,/01012345678/);
});
test('withdrawal statuses derive separately from authentication and exact confirmation text',()=>{
 assert.match(account({authenticated:true,confirmation:'회원탈퇴 '}),/data-authenticated="true" data-confirmed="false"/);
 assert.match(account({confirmation:'회원탈퇴'}),/data-authenticated="false" data-confirmed="true"/);
 assert.doesNotMatch(account(),/disabled/);
});
test('account escapes user content and renders seven static examples including assets warning',()=>{
 assert.doesNotMatch(account({name:'<img src=x>',visible:true}),/<img src=x>/);
 const board=accountBoard();assert.equal((board.match(/class="og-history-screen og-account"/g)||[]).length,7);
 assert.match(board,/자산 소멸 확인/);assert.match(board,/마일리지 등 남은 자산/);
});

test('planning profile values render safely with a separate inviter card and save action',()=>{
 const html=account({nickname:'<새이름>',birthday:'1995-04-12',gender:'여',inviter:{name:'윤지환',date:'2026-05-28'}});
 for(const label of ['닉네임','생일','성별','나를 초대한 공유인','저장하기'])assert.ok(html.includes(label),label);
 assert.ok(html.includes('&lt;새이름&gt;'));assert.ok(html.includes('1995-04-12'));assert.ok(html.includes('윤*환'));assert.ok(html.includes('2026-05-28'));
 assert.ok(!html.includes('공유코드'));assert.ok(!html.includes('QR코드'));
});
test('missing inviter does not fabricate identity and withdrawal has no save action',()=>{
 const html=account({inviter:null,view:'profile'});assert.ok(html.includes('등록된 공유인이 없습니다.'));assert.ok(!html.includes('윤*환'));
 const withdrawal=account({view:'withdrawal'});assert.ok(withdrawal.includes('인증하기'));assert.ok(!withdrawal.includes('저장하기'));
});
