import test from 'node:test';
import assert from 'node:assert/strict';
import * as components from './render.mjs';
import {feedback} from '../../design-system/components/feedback/render.mjs';
import {reviewGroups} from '../subnavigation.mjs';
const render=props=>{assert.equal(typeof components.renderFeedback,'function','shared v2 feedback exists');return components.renderFeedback(props);};
test('empty history and search keep distinct explanations and do not invent actions',()=>{
 for(const [kind,title,body] of [['history','아직 방문 내역이 없어요','방문한 매장이 생기면 여기에 표시됩니다.'],['search','검색 결과가 없어요','다른 매장명이나 업종으로 검색해 보세요.']]){
  const html=render({kind});
  assert.match(html,/class="og-feedback v2-feedback"/);assert.ok(html.includes(title)&&html.includes(body));
  assert.match(html,/<svg[^>]*aria-hidden="true"/);assert.doesNotMatch(html,/<button|role="alert"|material-icons/);
 }
});
test('load error reuses the v2 retry button and loading blocks duplicate requests',()=>{
 const error=render({kind:'error',id:'retry-demo'}),loading=render({kind:'error',busy:true});
 assert.match(error,/불러오지 못했어요/);assert.match(error,/og-button v2-button/);assert.match(error,/data-feedback-retry/);
 assert.match(error,/다시 시도/);assert.match(loading,/disabled[^>]*aria-busy="true"/);assert.match(loading,/처리 중…/);
 assert.doesNotMatch(error,/role="alert"|aria-live/);
});
test('feedback rejects unknown meaning and escapes custom copy and identifiers',()=>{
 assert.throws(()=>render({kind:'unknown'}),RangeError);
 assert.throws(()=>render({title:' '}),TypeError);
 const html=render({title:'<img onerror=bad>',body:'<script> & 내용',id:'a"b'});
 assert.match(html,/&lt;img onerror=bad&gt;/);assert.match(html,/&lt;script&gt; &amp; 내용/);assert.match(html,/id="a&quot;b"/);
 assert.doesNotMatch(html,/<img|<script/);
});
test('related empty/error specimens stay together with feedback navigation',()=>{
 const html=components.renderComponents();
 assert.match(html,/id="empty-feedback" aria-labelledby="empty-feedback-title" hidden/);
 assert.match(html,/data-feedback-demo/);assert.match(html,/data-feedback-result/);assert.match(html,/data-feedback-status[^>]*role="status"/);
 assert.deepEqual(reviewGroups('components').find(g=>g.id==='feedback').items.map(i=>i.id),['dialogs','notices','empty-feedback','snackbar']);
});
test('legacy feedback is not modified by v2 rendering',()=>{
 const html=feedback({title:'원본',symbol:'search'});
 assert.match(html,/class="og-feedback"/);assert.match(html,/material-icons/);assert.doesNotMatch(html,/v2-feedback/);
});
