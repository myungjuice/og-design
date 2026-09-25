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
test('account escapes user content and renders four static examples including assets warning',()=>{
 assert.doesNotMatch(account({name:'<img src=x>',visible:true}),/<img src=x>/);
 const board=accountBoard();assert.equal((board.match(/class="og-history-screen og-account"/g)||[]).length,4);
 assert.match(board,/자산 소멸 확인/);assert.match(board,/마일리지 등 남은 자산/);
});
