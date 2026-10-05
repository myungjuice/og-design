import test from 'node:test';
import assert from 'node:assert/strict';
import * as components from './render.mjs';
import {badge,countBadge,unreadDot} from '../../design-system/components/badges/render.mjs';
import {reviewGroups} from '../subnavigation.mjs';

test('status labels keep visible escaped meaning without button or selected semantics',()=>{
 assert.equal(typeof components.renderBadge,'function');
 for(const tone of ['neutral','brand','info','success','warning','error']){
  const html=components.renderBadge({label:'사진 <확인> & 영상',tone});
  assert.match(html,/class="og-badge v2-badge"/);assert.ok(html.includes('사진 &lt;확인&gt; &amp; 영상'));
  assert.match(html,new RegExp('data-tone="'+tone+'"'));assert.doesNotMatch(html,/<button|tabindex|aria-pressed|role="button"/);
 }
});
test('compact new labels preserve the Korean label and solid material independently of standard sizes',()=>{
 assert.equal(typeof components.renderBadge,'function');
 const html=components.renderBadge({label:'신규',tone:'brand',size:'compact',variant:'solid'});
 assert.match(html,/data-size="compact"/);assert.match(html,/data-variant="solid"/);assert.match(html,/>신규<\/span>/);
 for(const size of ['small','medium'])assert.ok(components.renderBadge({label:'심사 중',size}).includes('data-size="'+size+'"'));
});
test('invalid badge inputs reject blank meaning and unsupported presentation',()=>{
 assert.equal(typeof components.renderBadge,'function');
 for(const props of [{label:''},{label:' '},{label:null},{tone:'unknown'},{size:'unknown'},{variant:'unknown'},{tone:'error',variant:'solid'}])assert.throws(()=>components.renderBadge(props));
 const label="가격 $& $$ $' $`";assert.ok(components.renderBadge({label}).includes("가격 $&amp; $$ $&#39; $`"));
});
test('notification count hides zero and abbreviates only visible numbers while preserving the real count name',()=>{
 assert.equal(typeof components.renderCountBadge,'function');
 for(const [count,text] of [[1,'1'],[9,'9'],[99,'99'],[100,'99+'],[128,'99+']]){
  const html=components.renderCountBadge({count,id:'count-demo'});
  assert.match(html,/role="img"/);assert.ok(html.includes('aria-label="읽지 않은 알림 '+count+'개"'));assert.ok(html.includes('aria-hidden="true">'+text+'</span>'));assert.doesNotMatch(html,/ hidden/);
 }
 assert.match(components.renderCountBadge({count:0}),/ hidden/);
 for(const count of [-1,1.5,NaN,Infinity,'3',Number.MAX_SAFE_INTEGER+1])assert.throws(()=>components.renderCountBadge({count}));
});
test('unread indicators retain a descriptive accessible name and disappear when not visible',()=>{
 assert.equal(typeof components.renderUnreadDot,'function');
 const html=components.renderUnreadDot({label:'새 공지 <있음>'});assert.match(html,/class="og-unread-dot v2-unread-dot"/);assert.match(html,/aria-label="새 공지 &lt;있음&gt;"/);
 assert.match(components.renderUnreadDot({visible:false}),/ hidden/);
 for(const props of [{visible:'false'},{label:' '}])assert.throws(()=>components.renderUnreadDot(props));
});
test('missing or unknown notification counts are not treated as zero',()=>{
 assert.equal(typeof components.renderCountBadge,'function');
 for(const props of [undefined,{}, {count:undefined},{count:null}])assert.throws(()=>components.renderCountBadge(props),RangeError);
});
test('badge gallery groups purpose and notification examples with a native local count preview',()=>{
 const html=components.renderComponents();
 assert.deepEqual(reviewGroups('components').find(g=>g.id==='badges')?.items.map(x=>x.id),['badges','notification-badges']);
 for(const label of ['신규','심사 중','회원점','일반 매장','사진','영상','그림'])assert.ok(html.includes(label));
 assert.match(html,/id="notification-badges"/);assert.match(html,/data-badge-preview/);assert.match(html,/<select[^>]+data-badge-count/);
 assert.match(html,/value="128"/);assert.match(html,/aria-live="polite"/);
});
test('legacy badge output stays separate from v2',()=>{
 assert.doesNotMatch(badge({label:'진행 중'}),/v2-/);assert.doesNotMatch(countBadge({count:3}),/v2-/);assert.doesNotMatch(unreadDot(),/v2-/);
});
