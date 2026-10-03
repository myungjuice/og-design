import test from 'node:test';
import assert from 'node:assert/strict';
import * as components from './render.mjs';
import {choice,toggle} from '../../design-system/components/selection/render.mjs';
import {renderSubnavigation,reviewGroups} from '../subnavigation.mjs';
const render=options=>{
 assert.equal(typeof components.renderSelection,'function','v2 exports a shared selection wrapper');
 return components.renderSelection(options);
};
test('selection wrappers keep native input semantics and decorative marks unnamed',()=>{
 for(const [kind,type,role] of [['checkbox','checkbox',''],['radio','radio',''],['switch','checkbox','switch']]){
  const html=render({kind,label:'소식 알림',checked:true,name:'news'});
  assert.match(html,new RegExp(`type="${type}"`));assert.match(html,/ checked/);
  if(role)assert.match(html,/role="switch"/);
  assert.match(html,/class="v2-selection-mark" aria-hidden="true"/);
  assert.match(html,/for="[^"]+"/);assert.doesNotMatch(html,/<button/);
  assert.match(html,/name="news"/);
 }
});
test('external help references survive and merge with generated selection descriptions',()=>{
 const plain=render({label:'소식',attributes:{'aria-describedby':'external-help'}});
 assert.match(plain,/aria-describedby="external-help"/);
 const described=render({label:'소식',description:'설명',state:'error',attributes:{'aria-describedby':'external-help other-help'}});
 const ids=described.match(/aria-describedby="([^"]+)"/)[1].split(' ');
 assert.deepEqual(ids.slice(0,2),['external-help','other-help']);assert.equal(ids.length,4);
 for(const id of ids.slice(2))assert.match(described,new RegExp(`id="${id}"`));
});
test('selection explanations connect to their own inputs and escape visible text',()=>{
 const a=render({label:'<script>bad</script>',description:'<img onerror=bad>'}),b=render({label:'이메일',description:'알림을 받아요.'});
 assert.doesNotMatch(a,/<script|<img/);
 const help=a.match(/aria-describedby="([^"]+)"/)[1];
 assert.match(a,new RegExp(`id="${help}"`));assert.doesNotMatch(b,new RegExp(`id="${help}"`));
 assert.match(a,/&lt;img onerror=bad&gt;/);
});
test('partial selection is reserved for checkboxes and invalid kinds/states fail',()=>{
 assert.match(render({label:'전체 선택',partial:true}),/data-indeterminate="true"/);
 assert.throws(()=>render({kind:'radio',label:'이메일',partial:true}),RangeError);
 assert.throws(()=>render({kind:'switch',label:'알림',partial:true}),RangeError);
 assert.throws(()=>render({kind:'slider',label:'값'}),RangeError);
 assert.throws(()=>render({state:'unknown',label:'항목'}),RangeError);
 assert.throws(()=>render({label:' '}),TypeError);
});
test('unavailable and processing controls preserve choice but block changes',()=>{
 for(const kind of ['checkbox','radio','switch'])for(const state of ['disabled','loading']){
  const html=render({kind,label:'소식 알림',state,checked:true});
  assert.match(html,/<input[^>]* checked[^>]* disabled/);
  if(state==='loading')assert.match(html,/<input[^>]*aria-busy="true"/);
  assert.match(html,/aria-describedby=/);
 }
});
test('custom sample attributes cannot override blocked-state or selected semantics',()=>{
 const html=render({kind:'switch',label:'소식 알림',checked:true,state:'loading',attributes:{disabled:false,checked:false,'aria-busy':'false'}});
 assert.match(html,/<input[^>]* checked[^>]* disabled[^>]*aria-busy="true"/);
});
test('operation outcomes use readable feedback without replacing choice symbols',()=>{
 const error=render({label:'소식 알림',checked:true,state:'error'}),success=render({label:'소식 알림',checked:true,state:'success'});
 assert.match(error,/저장하지 못/);assert.match(success,/저장했습니다/);
 assert.match(error,/<input[^>]* checked/);assert.match(success,/<input[^>]* checked/);
 assert.doesNotMatch(error,/aria-invalid="true"/,'save failure is not an invalid selection');
});
test('selection gallery groups three related controls with collapsed states',()=>{
 const html=components.renderComponents();
 for(const id of ['checkbox','radio','switch']){
  assert.match(html,new RegExp(`id="${id}"`));assert.match(renderSubnavigation({pageId:'components',label:'공통 컴포넌트'}),new RegExp(`href="#${id}"`));
 }
 assert.deepEqual(reviewGroups('components').find(g=>g.id==='selection').items.map(i=>i.id),['checkbox','radio','switch']);
 assert.match(html,/id="checkbox-live"/);assert.match(html,/id="radio-live"/);assert.match(html,/id="switch-live"/);
});
test('legacy selection markup is preserved when no optional v2 props are supplied',()=>{
 assert.equal(choice({id:'legacy-check',label:'동의',description:'선택 안내',checked:true}),'<label class="og-choice " for="legacy-check"><input id="legacy-check" type="checkbox" checked><span class="og-choice-copy">동의<small>선택 안내</small></span></label>');
 assert.equal(toggle({id:'legacy-switch',label:'알림',description:'설정 안내',checked:true}),'<label class="og-choice og-switch " for="legacy-switch"><span class="og-choice-copy">알림<small>설정 안내</small></span><input id="legacy-switch" type="checkbox" role="switch" checked></label>');
});
