import test from 'node:test';import assert from 'node:assert/strict';import {existsSync} from 'node:fs';
test('main menu limits four rows and preserves optional copy, image and price priority',async()=>{
 assert.ok(existsSync(new URL('./main-menu.mjs',import.meta.url)),'renderer exists');
 const {mainMenuSection}=await import('./main-menu.mjs');
 assert.equal(mainMenuSection({items:[]}), '');
 const html=mainMenuSection({items:[{name:'<메뉴>',description:'설명',price:12000,image:'test.png'},{name:'문구 가격',price:5000,priceText:'시가'},{name:'세번째',price:0},{name:'네번째',price:3000},{name:'다섯번째',price:4000}]});
 assert.equal((html.match(/class="og-main-menu-row"/g)||[]).length,4);assert.doesNotMatch(html,/다섯번째|5,000|주문하기|인기/);assert.match(html,/12,000/);assert.match(html,/시가/);assert.match(html,/&lt;메뉴&gt;/);assert.match(html,/더보기/);assert.equal((html.match(/class="og-thumbnail"/g)||[]).length,1);
});
