import test from 'node:test';
import assert from 'node:assert/strict';
test('menu detail preserves conditional photo/options and price text priority',async()=>{
 const {menuDetailScreen,menuDetailBoard}=await import('./menu-detail.mjs');
 const plain=menuDetailScreen({name:'<메뉴>',description:'첫줄\n둘째줄\r끝',price:12000});
 assert.match(plain,/&lt;메뉴&gt;/);assert.match(plain,/첫줄 둘째줄 끝/);
 assert.match(plain,/12,000 원/);assert.match(plain,/type="radio"[^>]*checked/);
 assert.doesNotMatch(plain,/og-menu-detail-photo|type="checkbox"|>추가<|SOLD OUT|장바구니|주문하기/);
 const selected=menuDetailScreen({imageSrc:'sample.png',price:12000,priceText:'시가',options:[{name:'옵션',price:1000,selected:true}]});
 assert.match(selected,/og-menu-detail-photo/);assert.match(selected,/시가/);assert.doesNotMatch(selected,/12,000|시가 원/);
 assert.match(selected,/type="checkbox"[^>]*checked/);assert.match(selected,/\+1,000 원/);
 const scroll=menuDetailScreen({imageSrc:'sample.png',scrolled:true});assert.doesNotMatch(scroll,/og-menu-detail-photo/);
 assert.equal((menuDetailBoard().match(/class="screen-artboard"/g)||[]).length,3);
});
