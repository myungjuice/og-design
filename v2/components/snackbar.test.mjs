import test from 'node:test';
import assert from 'node:assert/strict';
import * as components from './render.mjs';
import {snackbar} from '../../design-system/components/snackbar/render.mjs';
import {reviewGroups} from '../subnavigation.mjs';
const render=props=>{assert.equal(typeof components.renderSnackbar,'function');return components.renderSnackbar(props);};
test('snackbar escapes message/action and static output does not announce itself',()=>{
 const html=render({message:'<저장 결과>',action:'<다시 시도>',id:'a"b'});
 assert.match(html,/og-snackbar v2-snackbar/);assert.match(html,/&lt;저장 결과&gt;/);assert.match(html,/&lt;다시 시도&gt;/);
 assert.match(html,/id="a&quot;b"/);assert.doesNotMatch(html,/role="status"|role="alert"/);
 assert.match(render({message:'완료',live:true}),/role="status"/);
 assert.throws(()=>render({message:' '}),TypeError);assert.throws(()=>render({message:'결과',state:'invalid'}),RangeError);
});
test('pending/disabled snackbar actions cannot run twice while retaining their visible labels',()=>{
 for(const state of ['loading','disabled']){
  const html=render({message:'처리 안내',action:'다시 시도',state});
  assert.match(html,/<button[^>]*disabled/);assert.match(html,/다시 시도/);
  if(state==='loading')assert.match(html,/aria-busy="true"/);
 }
 assert.doesNotMatch(render({message:'저장했습니다.'}),/og-snackbar-action/);
 assert.doesNotMatch(render({message:'실패',action:'다시 시도',state:'error'}),/<button[^>]*disabled/);
});
test('gallery groups three original snackbar use cases with a contained non-service preview',()=>{
 const html=components.renderComponents().match(/<section[^>]*id="snackbar"[\s\S]*?<\/section>/)?.[0];
 assert.ok(html,'snackbar is included in the actual gallery');
 assert.match(html,/<h2 id="snackbar-title">토스트·스낵바<\/h2>/);
 assert.equal(reviewGroups('components').find(g=>g.id==='feedback').items.find(i=>i.id==='snackbar').label,'토스트·스낵바');
 for(const kind of ['saved','undo','retry'])assert.match(html,new RegExp('data-snackbar-example="'+kind+'"'));
 assert.match(html,/data-snackbar-host/);assert.match(html,/data-snackbar-announcement[^>]*role="status"/);
 assert.match(html,/data-snackbar-close[^>]*disabled/);
 assert.ok(reviewGroups('components').find(g=>g.id==='feedback').items.some(i=>i.id==='snackbar'));
});
test('original canvas snackbar output stays unchanged',()=>{
 assert.equal(snackbar({message:'저장했습니다.',action:'실행 취소'}),'<div class="og-snackbar"><p class="og-snackbar-message">저장했습니다.</p><button type="button" class="og-snackbar-action">실행 취소</button></div>');
});
