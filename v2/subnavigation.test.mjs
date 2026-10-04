import test from 'node:test';
import assert from 'node:assert/strict';
import {componentItems} from './components/catalog.mjs';
import {reviewGroups,renderSubnavigation,renderReviewPicker} from './subnavigation.mjs';
import {renderWorkspace} from './render.mjs';

test('all component entries belong to one related preview group',()=>{
 const groups=reviewGroups('components');
 assert.deepEqual(groups.map(g=>g.items.map(item=>item.id)),[
  ['primary','secondary','review'],['cards','mileage','section-heading'],['list-row'],['checkbox','radio','switch'],['search','text-input','password-input','phone-input','numeric-input','multiline-input'],['dialogs','notices','empty-feedback','snackbar','help'],['loading'],['categories'],['navigation'],['try']
 ]);
 assert.deepEqual(groups.flatMap(g=>g.items.map(item=>item.id)).sort(),componentItems.map(item=>item.id).sort());
});
test('foundations group related visual rules without dropping sections',()=>{
 assert.deepEqual(reviewGroups('design-system').map(g=>g.items.map(item=>item.id)),[
  ['colors'],['typography','spacing'],['radius','materials']
 ]);
});
test('every destination separates primary destinations from secondary items',()=>{
 for(const id of ['design-system','components','home','my-land','barcode','og-park','my-info']){
  const html=renderWorkspace({pageId:id});
  assert.equal((html.match(/<aside\b/g)||[]).length,2);
  const primary=html.match(/<aside class="v2-sidebar">([\s\S]*?)<\/aside>/)[1];
  assert.doesNotMatch(primary,/data-view-link|data-group-link/);
 }
});
test('unported screens are non-links and excluded from the ready group picker',()=>{
 const html=renderSubnavigation({pageId:'my-info',label:'내정보'});
 assert.match(html,/이관 예정/);
 assert.equal((html.match(/data-view-link=/g)||[]).length,1);
 assert.equal((html.match(/aria-disabled="true"/g)||[]).length,9);
 assert.equal(renderReviewPicker('my-info'),'');
 for(const id of ['my-land','og-park']){
  assert.deepEqual(reviewGroups(id),[]);
  assert.doesNotMatch(renderSubnavigation({pageId:id,label:id}),/<a\b/);
 }
});
