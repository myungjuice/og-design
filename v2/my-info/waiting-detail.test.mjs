import test from 'node:test';
import assert from 'node:assert/strict';
import {renderWorkspace} from '../render.mjs';
import {reviewGroups} from '../subnavigation.mjs';
const module=()=>import('./waiting-detail.mjs').catch(()=>({}));

test('waiting detail has a ready group without merging into the reservation-only reviews',()=>{
 const html=renderWorkspace({pageId:'my-info'});
 assert.ok(html.includes('<section id="waiting-detail" data-review-screen'));
 const group=reviewGroups('my-info').find(g=>g.id==='history-waiting');assert.ok(group);
 assert.deepEqual(group.items.map(i=>[i.id,!!i.pending]),[['waiting-detail',false],['waiting-dialogs',false]]);
 assert.ok(!reviewGroups('my-info').find(g=>g.id==='history-reservations').items.some(i=>i.id==='waiting-detail'));
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);
});
test('waiting ticket retains separate queue number, current position and people/time values',async()=>{
 const {renderWaitingDetail:render}=await module();assert.equal(typeof render,'function');
 const html=render({id:'waiting-review'});
 for(const text of ['웨이팅 현황','오시 망원본점','02-000-0000','웨이팅 중','현재 내 순서','<strong>27</strong> 번','<strong>4</strong> 번째','성인: <strong>2명</strong>','어린이: <strong>0명</strong>','오후 5:30'])assert.ok(html.includes(text),text);
 const custom=render({number:105,position:1,adults:3,children:2,time:'오후 6:10',storeName:'오시 & 망원'});
 for(const text of ['<strong>105</strong> 번','<strong>1</strong> 번째','성인: <strong>3명</strong>','어린이: <strong>2명</strong>','오후 6:10','오시 &amp; 망원'])assert.ok(custom.includes(text),text);
 assert.doesNotMatch(html,/예상 대기|예약 확정|예약 신청/);
});
test('waiting guidance and action labels are preserved without service side effects',async()=>{
 const {renderWaitingDetail:render}=await module();assert.equal(typeof render,'function');
 const html=render({id:'waiting-static'});
 for(const text of ['입장 호출 시 자리에 안계신 경우, 웨이팅이 취소됩니다.','인원이 변경된 경우, 인원 변경 버튼을 눌러주세요.','어린이 적용 기준은 매장마다 다를 수 있습니다.','웨이팅 취소는 언제든지 가능합니다.','취소 후 재웨이팅은 새로운 번호로만 가능합니다.','무단 노쇼 시 향후 웨이팅에 제한이 있을 수 있습니다.','웨이팅 취소하기','인원 변경','aria-label="새로고침"','aria-label="뒤로가기"'])assert.ok(html.includes(text),text);
 assert.doesNotMatch(html,/이린이/);
 assert.match(html,/role="region" aria-label="웨이팅 현황 내용 · 정적 시안" tabindex="0"/);
 assert.doesNotMatch(html,/class="[^"]*v2-wait-detail[^"]*" inert|<button(?! inert)|href="tel:|material-icons/);
 for(const type of ['v2-surface','v2-icon-button','v2-button','v2-badge'])assert.ok(html.includes(type),type);
 assert.equal((html.match(/<button inert/g)||[]).length,4);
});
