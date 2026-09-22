import test from 'node:test';
import assert from 'node:assert/strict';
test('full menu keeps legacy card/row price units, sold-out and image slots',async()=>{
 const {menuItem,fullMenuScreen,fullMenuBoard}=await import('./full-menu.mjs');
 const item={name:'<메뉴>',description:'설명',price:12000,soldOut:true};
 assert.match(menuItem(item),/12,000 원/);
 assert.doesNotMatch(menuItem(item,{featured:true}),/12,000 원/);
 assert.match(menuItem(item),/SOLD OUT/);
 assert.match(menuItem(item),/&lt;메뉴&gt;/);
 assert.match(menuItem(item),/og-full-menu-image-space/);
 assert.doesNotMatch(menuItem({...item,priceText:'시가'}),/12,000|시가 원/);
 assert.match(fullMenuScreen(),/대표메뉴/);
 assert.doesNotMatch(fullMenuScreen({state:'scrolled'}),/og-full-menu-hero/);
 assert.match(fullMenuScreen({state:'search'}),/메뉴 이름으로 검색해보세요/);
 assert.equal((fullMenuBoard().match(/class="screen-artboard"/g)||[]).length,3);
 assert.doesNotMatch(fullMenuScreen(),/장바구니|주문하기/);
});
