import test from 'node:test';
import assert from 'node:assert/strict';
import * as components from './render.mjs';
import {notice} from '../../design-system/components/feedback/render.mjs';
import {reviewGroups} from '../subnavigation.mjs';
const render=props=>{assert.equal(typeof components.renderNotice,'function','shared v2 notice exists');return components.renderNotice(props);};
test('inline notices distinguish four meanings without becoming clickable or auto-announcing',()=>{
 for(const tone of ['info','warning','error','success']){
  const html=render({tone,title:'상태 안내',body:'내용을 확인해 주세요.'});
  assert.match(html,new RegExp(`class="og-notice v2-notice"[^>]*data-tone="${tone}"`));
  assert.match(html,/<svg[^>]*aria-hidden="true"/);
  assert.match(html,/<strong>상태 안내<\/strong>/);
  assert.doesNotMatch(html,/<button|tabindex|role="(?:button|alert|status)"|material-icons/);
 }
});
test('notice title and body are escaped and empty or unsupported meaning is rejected',()=>{
 const html=render({title:'<img onerror=bad>',body:'<script> & "내용"',id:'notice"demo'});
 assert.match(html,/&lt;img onerror=bad&gt;/);assert.match(html,/&lt;script&gt; &amp; &quot;내용&quot;/);
 assert.match(html,/id="notice&quot;demo"/);assert.doesNotMatch(html,/<img|<script/);
 assert.throws(()=>render({title:' '}),TypeError);
 assert.throws(()=>render({tone:'unknown',title:'안내'}),RangeError);
});
test('only opt-in dynamic updates receive live-region semantics',()=>{
 assert.match(render({tone:'error',title:'저장하지 못했어요',live:true}),/role="alert"[^>]*aria-atomic="true"/);
 assert.match(render({tone:'success',title:'저장했어요',live:true}),/role="status"[^>]*aria-atomic="true"/);
 assert.doesNotMatch(render({tone:'error',title:'저장하지 못했어요'}),/role="alert"|aria-live/);
});
test('notice gallery is reachable with confirmation dialogs in the related feedback group',()=>{
 const html=components.renderComponents();
 assert.match(html,/id="notices" aria-labelledby="notices-title" hidden/);
 assert.equal((html.match(/class="og-notice v2-notice"/g)||[]).length,4);
 const feedback=reviewGroups('components').find(g=>g.id==='feedback');
 assert.deepEqual(feedback.items.map(item=>item.id),['dialogs','notices']);
});
test('original notice markup remains independent of the v2 presentation',()=>{
 const html=notice({tone:'info',title:'안내',body:'본문'});
 assert.match(html,/class="og-notice"/);assert.doesNotMatch(html,/v2-notice|<svg|role="status"/);
});
