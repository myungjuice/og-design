import test from 'node:test';
import assert from 'node:assert/strict';
import * as components from './render.mjs';
import {chip,radioChip} from '../../design-system/components/tabs-chips/render.mjs';
import {reviewGroups} from '../subnavigation.mjs';

test('single choice chips use labelled native radios with one selection and separate names',()=>{
 assert.equal(typeof components.renderChipGroup,'function');
 const html=components.renderChipGroup({id:'one',type:'single',label:'내역 <종류>',items:['전체','적립',{label:'사용',disabled:true}],selected:[1]});
 assert.match(html,/role="radiogroup" aria-labelledby="one-label"/);
 assert.match(html,/내역 &lt;종류&gt;/);
 assert.match(html,/id="one-1" type="radio" name="one" checked/);
 assert.match(html,/id="one-2" type="radio" name="one"[^>]*disabled/);
 assert.equal((html.match(/ checked/g)||[]).length,1);
 assert.notEqual(components.renderChipGroup({type:'single'}),components.renderChipGroup({type:'single'}));
});
test('multiple chips preserve visible labels and selection independently of execution state',()=>{
 assert.equal(typeof components.renderChip,'function');
 const html=components.renderChip({label:'카페 & 디저트',selected:true,state:'loading'});
 assert.match(html,/aria-pressed="true"/);assert.match(html,/disabled/);assert.match(html,/aria-busy="true"/);
 assert.match(html,/카페 &amp; 디저트/);assert.doesNotMatch(html,/처리 중…<\/span>/);
 const selected=components.renderChipGroup({items:['한식','중식','일식'],selected:[0,2],max:3});
 assert.equal((selected.match(/aria-pressed="true"/g)||[]).length,2);
 assert.match(selected,/data-chip-max="3"/);
});
test('removal chips describe the action without pretending to be selectable toggles',()=>{
 const html=components.renderChip({label:'한식',removable:true});
 assert.match(html,/aria-label="한식 필터 해제"/);assert.match(html,/data-chip-remove/);
 assert.doesNotMatch(html,/aria-pressed/);assert.match(html,/v2-chip-cross/);
});
test('caller attributes cannot enable a disabled chip or override its selected state',()=>{
 const html=components.renderChip({state:'disabled',selected:true,attributes:{disabled:false,'aria-pressed':'false'}});
 assert.match(html,/aria-pressed="true" disabled/);
});
test('chip inputs reject broken selection, groups and invalid limits',()=>{
 assert.equal(typeof components.renderChipGroup,'function');
 for(const props of [{items:[]},{items:[' ']},{label:' '},{type:'other'},{selected:[0,0]},{selected:[-1]},{selected:[0.5]},{selected:[9]},{type:'single',selected:[]},{type:'single',selected:[0,1]},{max:0},{max:1.5},{max:1,selected:[0,1]},{items:[{label:'한식',disabled:true}],selected:[0]}])assert.throws(()=>components.renderChipGroup(props));
 assert.throws(()=>components.renderChip({label:' '}));assert.throws(()=>components.renderChip({state:'other'}));
});
test('busy and disabled chip groups preserve selection and make every control unavailable',()=>{
 for(const type of ['single','multiple','remove']){
  const html=components.renderChipGroup({type,items:['한식','중식'],selected:type==='remove'?[]:[1],state:'loading'});
  assert.match(html,/aria-busy="true"/);assert.equal((html.match(/ disabled/g)||[]).length,type==='remove'?3:2);assert.match(html,/v2-loading/);
 }
 const html=components.renderChipGroup({items:['한식','중식'],selected:[1],state:'disabled'});
 assert.match(html,/aria-pressed="true" disabled/);
});
test('chip gallery groups related examples and keeps zero/two/three selected comparisons inert',()=>{
 const html=components.renderComponents();
 for(const id of ['chip-single','chip-multiple','chip-filters'])assert.match(html,new RegExp('id="'+id+'"'));
 assert.deepEqual(reviewGroups('components').find(g=>g.id==='chips').items.map(x=>x.id),['chip-single','chip-multiple','chip-filters']);
 assert.match(html,/선택 0개/);assert.match(html,/선택 2개/);assert.match(html,/선택 3개/);assert.match(html,/v2-chip-stage[^>]*inert/);
});
test('original chip and radio chip output remains separate from v2',()=>{
 assert.doesNotMatch(chip({label:'한식'}),/v2-/);assert.doesNotMatch(radioChip({label:'한식'}),/v2-/);
});
test('dollar replacement tokens in chip labels remain escaped literal text',()=>{
 const label="가격 $& $$ $' $`",expected="<span class=\"v2-chip-label\">가격 $&amp; $$ $&#39; $`</span>";
 assert.ok(components.renderChip({label}).includes(expected));
 assert.ok(components.renderChipGroup({type:'single',items:[label]}).includes(expected));
});
