import test from 'node:test';
import assert from 'node:assert/strict';
import {serviceBoard} from './store-services.mjs';
test('service examples share supplied store identity while preserving five static states',()=>{
 for(const kind of ['reservation','waiting']){const html=serviceBoard(kind,{store:{name:'실제 매장',category:'카페',address:'등록 주소'}});assert.equal((html.match(/<h2>실제 매장<\/h2>/g)||[]).length,5);assert.equal((html.match(/상태 예시 · /g)||[]).length,5);assert.ok(html.includes('등록 주소'));assert.ok(html.includes(kind==='reservation'?'예약 시간 경과':'매장의 웨이팅정보가 없습니다.'));}
});
