import test from 'node:test';
import assert from 'node:assert/strict';
import {account} from './account.mjs';
import {settings} from './settings.mjs';
import {opinion} from './opinion.mjs';
test('planning mileage name replaces PAY without summing legacy balances',()=>{
 const html=account({mileage:16000,pay:7000});
 assert.ok(html.includes('16,000 M'));
 assert.ok(!html.includes('23,000'));
 for(const view of [html,account({assetsOpen:true}),settings({kakaoOpen:true}),opinion()])assert.doesNotMatch(view,/PAY|페이/);
 const options=opinion().match(/<option[^>]*>[^<]*<\/option>/g);
 assert.equal(options.filter(x=>x.includes('마일리지')).length,1);
});
test('night consent is independent and lower settings specimen is available',()=>{
 const html=settings({event:true});
 assert.match(html,/야간 알림[\s\S]*?role="switch">/);
 const lower=settings({view:'lower'});
 for(const label of ['앱 버전','캐시 삭제','회원 탈퇴'])assert.ok(lower.includes(label));
 assert.ok(!settings({loggedIn:false}).includes('회원 탈퇴'));
});
