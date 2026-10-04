import test from 'node:test';
import assert from 'node:assert/strict';
import {renderMileageCard as sharedCard} from '../../screens/my-info-3d-test/mileage-card.mjs';
import {renderComponents} from './render.mjs';
import {renderSubnavigation} from '../subnavigation.mjs';
import {renderMileage} from './mileage.mjs';

test('shared mileage card accepts a sharing count without changing legacy defaults',()=>{
 assert.match(sharedCard({sharedCount:0,shared:0}),/공유인 0명/);
 assert.match(sharedCard({sharedCount:7}),/공유인 7명/);
 assert.match(sharedCard(),/공유인 3명/);
});
test('shared card resolves original assets from a different route and escapes path attributes',()=>{
 const html=sharedCard({assetBase:'/screens/my-info-3d-test/media/figma/',className:'v2-mileage'});
 assert.match(html,/class="og-surface mileage-card v2-mileage"/);
 const paths=[...html.matchAll(/src="([^"]+)"/g)].map(m=>m[1]);
 assert.ok(paths.length>=5);
 assert.ok(paths.every(p=>p.startsWith('/screens/my-info-3d-test/media/figma/')));
 assert.match(sharedCard({assetBase:'" onerror="bad/'}),/src="&quot; onerror=&quot;bad\/mileage-m.png"/);
});
test('gallery renders four independently labelled balance cases using resolved original assets',()=>{
 const html=renderComponents().match(/<section[^>]*id="mileage"[\s\S]*?<\/section>/)[0];
 assert.match(renderSubnavigation({pageId:'components',label:'공통 컴포넌트'}),/href="#mileage"/);
 assert.equal((html.match(/class="og-surface mileage-card v2-mileage"/g)||[]).length,4);
 for(const label of ['기본 잔액','사용 가능 금액 없음','잔액 0','진행바 상한'])assert.ok(html.includes(label));
 assert.match(html,/공유인 0/);
 assert.match(html,/2,400 M/);
 assert.doesNotMatch(html,/role="slider"|type="range"/);
 assert.match(html,/표시용/);
});
test('custom display range clamps the graphic but retains the actual balance as text',()=>{
 const html=sharedCard({available:5000,total:12500,rangeMin:0,rangeMax:10000});
 assert.match(html,/aria-valuemin="0" aria-valuemax="10000" aria-valuenow="10000" aria-valuetext="12,500 M"/);
 assert.match(html,/class="graph-available" style="--progress:50%/);
 assert.match(html,/class="graph-held" style="--progress:100%/);
 assert.match(html,/<span>5,000M<\/span>/);
 assert.throws(()=>sharedCard({rangeMin:10,rangeMax:10}),RangeError);
});
test('v2 mileage rejects invalid balances before emitting NaN or misleading amounts',()=>{
 for(const props of [{available:-1},{total:NaN},{shared:Infinity},{sharedCount:1.5},{available:17000,total:16000},{total:Number.MAX_SAFE_INTEGER+1}]){
  assert.throws(()=>renderMileage(props),RangeError,JSON.stringify(props));
 }
 const html=renderMileage({available:0,total:0,shared:0,sharedCount:0});
 assert.match(html,/공유인 0/);assert.doesNotMatch(html,/NaN|Infinity/);
});
