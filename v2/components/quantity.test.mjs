import test from 'node:test';
import assert from 'node:assert/strict';
const module=await import('./quantity.mjs').catch(()=>({}));
test('quantity boundaries change one integer without deleting an item',()=>{
 assert.equal(typeof module.changeQuantity,'function');
 for(const [value,delta,min,max,want] of [[1,-1,1,5,1],[4,1,1,5,5],[5,1,1,5,5],[0,1,0,null,1],[999,1,0,null,1000]])assert.equal(module.changeQuantity(value,delta,min,max),want);
 for(const args of [[1,2,1,5],[1.5,1,1,5],[1,1,-1,5],[1,1,2,5],[1,1,0,Infinity],[Number.MAX_SAFE_INTEGER,1,0,null]])assert.throws(()=>module.changeQuantity(...args),RangeError);
});
test('quantity renders safe named controls and correct unavailable directions',()=>{
 assert.equal(typeof module.renderQuantity,'function');
 const min=module.renderQuantity({id:'q',value:1,label:'상품"$&'});
 assert.match(min,/og-quantity v2-quantity/);assert.match(min,/data-quantity-minus[^>]*disabled/);
 assert.doesNotMatch(min,/data-quantity-plus[^>]*disabled/);assert.match(min,/상품&quot;\$&amp;/);
 assert.doesNotMatch(min,/material-icons/);assert.equal((min.match(/<svg/g)||[]).length,2);
 const max=module.renderQuantity({value:5});assert.match(max,/data-quantity-plus[^>]*disabled/);
 const noMax=module.renderQuantity({value:99,min:0,max:null});assert.doesNotMatch(noMax,/data-max=/);
 assert.match(module.renderQuantity({value:Number.MAX_SAFE_INTEGER,min:0,max:null}),/data-quantity-plus[^>]*disabled/);
 for(const state of ['disabled','loading']){const html=module.renderQuantity({state});assert.equal((html.match(/ disabled/g)||[]).length,2);assert.match(html,/aria-describedby=/);}
 assert.match(module.renderQuantity({state:'loading'}),/aria-busy="true"/);
 assert.throws(()=>module.renderQuantity({label:''}),TypeError);
 assert.throws(()=>module.renderQuantity({state:'unknown'}),RangeError);
});
