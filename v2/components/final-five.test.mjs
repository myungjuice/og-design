import test from 'node:test';
import assert from 'node:assert/strict';
import {renderComponents} from './render.mjs';
import {componentItems} from './catalog.mjs';
test('all five bundles are registered once and initially hidden behind their related groups',()=>{
 const html=renderComponents();assert.equal(componentItems.length,44);
 for(const id of ['surfaces','dividers','quantity','bottom-sheet','date-picker','range-picker','time-picker','attachment-picker','image-viewer']){
  assert.equal(componentItems.filter(item=>item.id===id).length,1);
  assert.equal((html.match(new RegExp('<section[^>]* id="'+id+'"','g'))||[]).length,1);
  assert.match(html,new RegExp('<section[^>]* id="'+id+'"[^>]* hidden'));
 }
});
