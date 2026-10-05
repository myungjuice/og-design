import test from 'node:test';
import assert from 'node:assert/strict';
import {renderWorkspace} from '../render.mjs';
import {reviewGroups} from '../subnavigation.mjs';
import {waitingDialog as original} from '../../design-system/pages/my-info/waiting-detail.mjs';
const module=()=>import('./waiting-dialogs.mjs').catch(()=>({}));

test('waiting popup pair is reachable with its detail without entering the reservation group',()=>{
 const html=renderWorkspace({pageId:'my-info'});
 assert.ok(html.includes('<section id="waiting-dialogs" data-review-screen'));
 assert.deepEqual(reviewGroups('my-info').find(g=>g.id==='history-waiting').items.map(i=>[i.id,!!i.pending]),[['waiting-detail',false],['waiting-dialogs',false]]);
 assert.equal((html.match(/data-waiting-dialog="(?:people|cancel)"/g)||[]).length,2);
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);
});
test('waiting people retain source minimums, units and waiting-specific notices',async()=>{
 const {renderWaitingDialog:render}=await module();assert.equal(typeof render,'function');
 const html=render({id:'waiting-people-review',type:'people'});
 assert.match(html,/>웨이팅 인원<\/h3>/);
 assert.match(html,/class="og-quantity v2-quantity"[^>]*aria-label="성인"[^>]*data-min="1"[^>]*data-value="2"/);
 assert.match(html,/class="og-quantity v2-quantity"[^>]*aria-label="어린이"[^>]*data-min="0"[^>]*data-value="0"/);
 assert.doesNotMatch(html,/data-max="5"|예약 시간|material-icons/);
 const body=html.slice(html.indexOf('class="v2-picker-body"'));
 assert.equal((body.match(/class="og-quantity-unit">명/g)||[]).length,2);
 for(const copy of ['입장 호출 시 자리에 안계신 경우, 웨이팅이 취소됩니다.','인원이 변경된 경우, 인원 변경 버튼을 눌러주세요.','웨이팅을 취소하는 경우 다른 손님을 위해 꼭 취소 버튼을 눌러주세요.','어린이 적용 기준은 매장마다 다를 수 있습니다.'])assert.ok(body.includes(copy),copy);
 assert.doesNotMatch(body,/이린이/);
});
test('waiting cancellation distinguishes returning from the destructive queue cancellation',async()=>{
 const {renderWaitingDialog:render}=await module();assert.equal(typeof render,'function');
 const html=render({id:'waiting-cancel-review',type:'cancel'}),overlay=html.slice(html.indexOf('class="v2-picker-overlay"'));
 assert.match(overlay,/>확인<\/h3>/);assert.ok(overlay.includes('웨이팅 취소를 하시겠습니까?'));
 const buttons=[...overlay.matchAll(/<button[^>]*>([^<]+)<\/button>/g)].map(m=>m[1]);assert.deepEqual(buttons,['돌아가기','웨이팅 취소']);
 assert.match(overlay,/<button inert[^>]*data-variant="secondary"[^>]*>돌아가기<\/button>/);
 assert.match(overlay,/<button inert[^>]*data-variant="danger"[^>]*>웨이팅 취소<\/button>/);
 assert.doesNotMatch(overlay,/수수료|환불|v2-quantity/);
 const originalOverlay=original('cancel').slice(original('cancel').indexOf('class="og-res-picker-overlay"'));
 assert.match(originalOverlay,/data-variant="primary"[^>]*>확인<\/button>/,'original canvas confirmation is unchanged');
});
test('waiting popups expose scrollable content but keep service controls and backdrop inert',async()=>{
 const {renderWaitingDialog:render}=await module();assert.equal(typeof render,'function');
 for(const type of ['people','cancel']){
  const html=render({id:'waiting-static-'+type,type});
  assert.match(html,/class="v2-picker-backdrop" inert aria-hidden="true"/);
  assert.match(html,/class="v2-picker-body" role="region"[^>]*tabindex="0"/);
  assert.ok(html.includes('v2-dialog-panel'));assert.ok(html.includes('v2-wait-detail'));
  assert.doesNotMatch(html,/class="v2-picker-frame[^\"]*" inert|class="v2-dialog-static[^\"]*"[^>]*inert|<button(?! inert)|material-icons/);
 }
 assert.throws(()=>render({type:'unknown'}),RangeError);
});
