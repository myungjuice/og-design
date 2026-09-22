import test from 'node:test';
import assert from 'node:assert/strict';
import {services,servicesBoard} from './services.mjs';
test('service sheet reuses four existing history destinations in source order',()=>{
 const html=services();const labels=['내 예약 보기','내 웨이팅 보기','내 Q오더 보기','내 리뷰 관리'];
 assert.equal((html.match(/class="og-menu-tile/g)||[]).length,10);
 let prev=-1;for(const label of labels){const pos=html.indexOf(label);assert.ok(pos>prev);prev=pos;}
 assert.match(html,/aria-label="서비스"/);assert.match(html,/inert/);
});
test('guest state omits member history entries without inventing login guidance',()=>{
 const html=services({loggedIn:false});for(const label of ['내 예약 보기','내 웨이팅 보기','내 Q오더 보기','내 리뷰 관리'])assert.ok(!html.includes(label));
 assert.doesNotMatch(html,/서비스를 이용하려면|로그인하기/);
 assert.equal((servicesBoard().match(/class="og-history-screen og-services"/g)||[]).length,2);
});
