import test from 'node:test';
import assert from 'node:assert/strict';
import {renderWorkspace} from '../render.mjs';
import {reviewGroups} from '../subnavigation.mjs';
import {renderHomeCategoryScreen} from './category.mjs';
import {renderDesignerScreen,categoryRows} from '../designer-20261013.mjs';

test('home categories exposes the shared before and after selection specimens',()=>{
 const html=renderWorkspace({pageId:'home'});
 assert.ok(reviewGroups('home').some(group=>group.items.some(item=>item.id==='search')&&group.items.some(item=>item.id==='category'&&!item.pending)));
 assert.deepEqual([...html.matchAll(/data-home-category-state="([^"]+)"/g)].map(m=>m[1]),['open','selected']);
 assert.equal((html.match(/data-category-template/g)||[]).length,2);
 for(const [state,name] of [['open','category-before'],['selected','category-after']])assert.ok(renderHomeCategoryScreen({state}).includes(renderDesignerScreen(name)));
});

test('current category list contains the same 22 supplied choices, reset and browse actions',()=>{
 for(const state of ['open','selected']){
  const html=renderHomeCategoryScreen({state}).split('<section class="filter-panel">')[1];
  assert.deepEqual([...html.matchAll(/data-category="([^"]+)"/g)].map(m=>m[1]),categoryRows.flat());
  assert.equal((html.match(/aria-pressed="true"/g)||[]).length,state==='open'?0:4);
  assert.match(html,/data-reset/);assert.match(html,/data-browse/);
  assert.doesNotMatch(html,/data-category="전체"|data-category-id="CI1000"/);
 }
 assert.throws(()=>renderHomeCategoryScreen({state:'unknown'}),RangeError);
});
