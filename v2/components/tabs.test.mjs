import test from 'node:test';
import assert from 'node:assert/strict';
import * as components from './render.mjs';
import {tabs,segment} from '../../design-system/components/tabs-chips/render.mjs';
import {reviewGroups} from '../subnavigation.mjs';
test('tabs link every control to its panel and escape visible labels',()=>{
 assert.equal(typeof components.renderTabs,'function');
 const html=components.renderTabs({id:'review-tabs',label:'내역 <보기>',items:['전체','적립','사용'],selected:1,panels:['전체 내용','적립 내용','사용 내용']});
 assert.match(html,/aria-label="내역 &lt;보기&gt;"/);
 assert.match(html,/role="tab" id="review-tabs-tab-1" aria-controls="review-tabs-panel-1" aria-selected="true" tabindex="0"/);
 assert.match(html,/id="review-tabs-panel-1"[^>]*role="tabpanel" aria-labelledby="review-tabs-tab-1"/);
 assert.match(html,/id="review-tabs-panel-0"[^>]*hidden/);
 assert.match(html,/적립 내용/);
});
test('invalid tab inputs cannot produce broken panel or selection semantics',()=>{
 assert.equal(typeof components.renderTabs,'function');
 for(const props of [{items:[]},{items:['a',' ']},{items:['a','b'],selected:2},{items:['a','b'],selected:-1},{items:['a','b'],selected:0.5},{items:['a','b'],panels:['only one']},{items:['a','b'],state:'unknown'}])assert.throws(()=>components.renderTabs(props));
});
test('disabled tabs preserve the selected panel and pending results mark only content busy',()=>{
 const disabled=components.renderTabs({id:'disabled',items:['전체','적립'],disabled:true});
 assert.match(disabled,/aria-selected="true" tabindex="0" disabled/);
 const pending=components.renderTabs({id:'pending',items:['전체','적립'],state:'loading'});
 assert.match(pending,/aria-busy="true"/);assert.match(pending,/v2-loading/);
 assert.doesNotMatch(pending,/<button[^>]*disabled/);
 const error=components.renderTabs({items:['전체','적립'],state:'error'});
 assert.match(error,/불러오지 못/);assert.match(error,/다시 시도/);
});
test('segment uses native grouped radios with isolated names and disabled choices',()=>{
 assert.equal(typeof components.renderSegment,'function');
 const html=components.renderSegment({id:'sort',label:'정렬 기준',items:['최근순',{label:'금액순',disabled:true}],selected:0});
 assert.match(html,/role="radiogroup" aria-labelledby="sort-label"/);
 assert.match(html,/id="sort-0" type="radio" name="sort" checked/);
 assert.match(html,/id="sort-1" type="radio" name="sort"[^>]*disabled/);
 assert.match(html,/금액순/);
 assert.notEqual(components.renderSegment({items:['a','b']}),components.renderSegment({items:['a','b']}),'default groups get separate ids/names');
});
test('segment rejects unsupported size or incomplete labels',()=>{
 assert.equal(typeof components.renderSegment,'function');
 for(const items of [[],['a'],['a','b','c','d'],['a',' ']])assert.throws(()=>components.renderSegment({items}));
 assert.throws(()=>components.renderSegment({items:['a','b'],selected:2}));
 assert.throws(()=>components.renderSegment({items:['a','b'],label:' '}));
});
test('disabled segments preserve distinct choice values',()=>{
 const html=components.renderSegment({items:['최근순','금액순'],disabled:true});
 assert.match(html,/value="0" disabled/);assert.match(html,/value="1" disabled/);
});
test('gallery keeps tabs and segments together with inert state examples and local demos',()=>{
 const html=components.renderComponents();
 assert.match(html,/id="tabs"/);assert.match(html,/id="segmented"/);
 assert.match(html,/data-v2-tabs/);assert.match(html,/data-v2-segment/);
 assert.match(html,/v2-tabs-stage[^>]*inert/);
 assert.deepEqual(reviewGroups('components').find(g=>g.id==='content-switching').items.map(x=>x.id),['tabs','segmented']);
});
test('legacy tab and segment markup stays separate from v2',()=>{
 assert.doesNotMatch(tabs({items:['a','b']}),/v2-/);
 assert.doesNotMatch(segment({items:[{label:'a'},{label:'b'}]}),/v2-/);
});
