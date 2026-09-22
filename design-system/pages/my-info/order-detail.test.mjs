import test from 'node:test';
import assert from 'node:assert/strict';
test('order detail preserves legacy status and cancellation eligibility',async()=>{
 const {orderDetail}=await import('./order-detail.mjs');
 for(const [status,old,label,cancel] of [['requested',false,'주문',true],['confirmed',false,'접수',false],['completed',false,'완료',false],['cancelled',false,'취소',false],['selfCancelled',false,'취소',false],['requested',true,'시간 경과',false],['confirmed',true,'시간 경과',false],['empty',true,'시간 경과',false]]){
  const html=orderDetail({status,old});assert.ok(html.includes('>'+label+'</span>'));assert.equal(html.includes('주문 취소하기'),cancel);assert.ok(html.includes('inert'));
 }
});
test('order menu retains supplied prices, options, count and optional thumbnail',async()=>{
 const {orderDetail}=await import('./order-detail.mjs');
 const html=orderDetail({menus:[{name:'메뉴 <A>',price:8000,total:18000,count:2,options:[{name:'추가',total:2000}],imageSrc:'example.png'},{name:'메뉴 B',price:4000,total:4000,count:1,priceText:'소 4,000 원'}]});
 for(const value of ['메뉴 &lt;A&gt;','추가(2,000원)','기본 8,000 원','18,000 원','X 2','소 4,000 원','example.png','주문내역 상세보기','주문 시간','주문 금액','주문 메뉴'])assert.ok(html.includes(value),value);
 assert.equal((html.match(/class="og-order-menu-image"/g)||[]).length,1);
});
