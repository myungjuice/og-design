import test from 'node:test';
import assert from 'node:assert/strict';
import * as components from './render.mjs';
import {loading,skeletonRow} from '../../design-system/components/loading/render.mjs';
import {reviewGroups} from '../subnavigation.mjs';
const get=name=>{assert.equal(typeof components[name],'function',name+' is exported');return components[name];};
test('loading label is readable, escaped and static until live announcements are requested',()=>{
 const render=get('renderLoading');
 const html=render({label:'<불러오는 중>',size:'small'});
 assert.match(html,/og-loading v2-loading/);assert.match(html,/&lt;불러오는 중&gt;/);assert.match(html,/data-size="small"/);
 assert.doesNotMatch(html,/role="status"/);assert.match(render({live:true}),/role="status"/);
 assert.throws(()=>render({label:' '}),TypeError);assert.throws(()=>render({size:'large'}),RangeError);
});
test('busy frame hides and makes loaded controls inert without dropping their geometry markup',()=>{
 const render=get('renderLoadingFrame');
 const props={label:'마일리지',contentHTML:'<button>내역보기</button>',skeletonHTML:'<span>자리</span>',id:'a"b'};
 const busy=render(props),ready=render({...props,busy:false});
 assert.match(busy,/aria-busy="true"/);assert.match(busy,/data-content aria-hidden="true" inert/);
 assert.match(busy,/<button>내역보기<\/button>/);assert.match(busy,/data-skeleton aria-hidden="true" inert>/);
 assert.match(ready,/aria-busy="false"/);assert.match(ready,/data-content aria-hidden="false">/);
 assert.match(ready,/data-skeleton aria-hidden="true" hidden/);assert.match(busy,/id="a&quot;b"/);
 assert.throws(()=>render({...props,busy:'true'}),TypeError);assert.throws(()=>render({...props,label:' '}),TypeError);
});
test('gallery keeps shared profile/list artwork and real mileage markup rather than another card design',()=>{
 const html=components.renderComponents();
 assert.match(html,/id="loading" aria-labelledby="loading-title" hidden/);
 assert.match(html,/data-loading-state/);assert.match(html,/data-loading-status[^>]*role="status"/);
 assert.match(html,/data-loading-example="profile"/);assert.match(html,/data-loading-example="list"/);assert.match(html,/data-loading-example="mileage"/);
 assert.match(html,/og-list-row v2-list-row/);assert.match(html,/menu-icons\.png/);assert.match(html,/mileage-card v2-mileage/);assert.match(html,/mileage-m\.png/);
 assert.match(get('renderLoadingMileage')({busy:false}),/<button disabled type="button" class="mileage-info"/);
 const group=reviewGroups('components').find(g=>g.id==='loading');assert.deepEqual(group.items.map(i=>i.id),['loading']);
});
test('legacy loader and row skeleton retain their existing output contract',()=>{
 assert.match(loading(),/class="og-loading" role="status"/);
 assert.match(skeletonRow(),/data-skeleton aria-hidden="true"/);
 assert.doesNotMatch(loading(),/v2-loading/);
});
