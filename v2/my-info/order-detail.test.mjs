import test from 'node:test';
import assert from 'node:assert/strict';
import {renderWorkspace} from '../render.mjs';
import {reviewGroups} from '../subnavigation.mjs';
const module=()=>import('./order-detail.mjs').catch(()=>({}));

test('Qorder detail is reachable from its own group instead of the held list',()=>{
 const group=reviewGroups('my-info').find(g=>g.id==='history-orders');
 assert.deepEqual(group?.items.map(i=>[i.id,!!i.pending]),[['order-detail',false]]);
 const html=renderWorkspace({pageId:'my-info'});
 assert.equal((html.match(/<section id="order-detail" data-review-screen/g)||[]).length,1);
 assert.ok(!reviewGroups('my-info').find(g=>g.id==='held').items.some(i=>i.label.includes('Q오더')));
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(ids.length,new Set(ids).size);
});
test('Qorder cancellation appears only on a current requested order',async()=>{
 const {renderOrderDetail:render}=await module();assert.equal(typeof render,'function');
 for(const [status,old,label,cancel] of [['requested',false,'주문',true],['confirmed',false,'접수',false],['completed',false,'완료',false],['cancelled',false,'취소',false],['selfCancelled',false,'취소',false],['requested',true,'시간 경과',false],['confirmed',true,'시간 경과',false]]){
  const html=render({id:'order-'+status+'-'+old,status,old});
  assert.ok(html.includes('>'+label+'</span>'),status);
  assert.equal(html.includes('주문 취소하기'),cancel,status+' '+old);
  assert.doesNotMatch(html,/<button(?! inert)|material-icons/);
  assert.match(html,/class="og-order-body" role="region"[^>]*tabindex="0"/);
  assert.doesNotMatch(html,/<section[^>]* inert/);
 }
 assert.throws(()=>render({status:'unknown'}),RangeError);
 assert.throws(()=>render({old:'false'}),TypeError);
});
test('Qorder retains supplied menu prices and optional images without treating values as markup',async()=>{
 const {renderOrderDetail:render}=await module();assert.equal(typeof render,'function');
 const html=render({brandName:'매장 <A>',amount:22000,menus:[{name:'메뉴 <A>',price:8000,total:18000,count:2,options:[{name:'추가 옵션',total:2000}],imageSrc:'/v2/home/media/kakao-share.png'},{name:'메뉴 B',price:4000,total:4000,count:1,priceText:'소 4,000 원'}]});
 for(const value of ['매장 &lt;A&gt;','메뉴 &lt;A&gt;','추가 옵션(2,000원)','기본 8,000 원','22,000','18,000 원','X 2','소 4,000 원'])assert.ok(html.includes(value),value);
 assert.equal((html.match(/class="og-order-menu-image"/g)||[]).length,1);
 assert.doesNotMatch(html,/수수료|환불|재주문|결제하기/);
});
test('Qorder cancellation confirmation is a static Fill/Line dialog over an inert dimmed detail',async()=>{
 const {renderOrderCancellation:render}=await module();assert.equal(typeof render,'function');
 const html=render({id:'order-cancel'}),overlay=html.slice(html.indexOf('class="v2-picker-overlay"'));
 assert.match(html,/class="v2-picker-backdrop" inert aria-hidden="true"/);
 assert.match(overlay,/주문을 취소하시겠습니까\?/);
 assert.match(overlay,/<button inert[^>]*data-variant="secondary"[^>]*>돌아가기<\/button>/);
 assert.match(overlay,/<button inert[^>]*data-variant="danger"[^>]*>주문 취소<\/button>/);
 assert.doesNotMatch(overlay,/수수료|환불|<button(?! inert)/);
});
