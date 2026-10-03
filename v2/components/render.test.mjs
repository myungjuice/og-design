import test from 'node:test';
import assert from 'node:assert/strict';
import {renderButton,renderCard,renderMenuTile,renderComponents} from './render.mjs';
test('3D buttons retain native disabling and busy semantics',()=>{
 for(const state of ['disabled','loading']){
  const html=renderButton({state,label:'후기 작성'});
  assert.match(html,/<button type="button"/);
  assert.match(html,/ disabled/);
  if(state==='loading'){assert.match(html,/aria-busy="true"/);assert.match(html,/처리 중/);}
 }
 assert.doesNotMatch(renderButton({label:'후기 작성'}),/ disabled/);
 assert.match(renderButton({label:'<img onerror=bad>'}),/&lt;img onerror=bad&gt;/);
});
test('informational cards do not pretend to be interactive',()=>{
 const html=renderCard({title:'최근 방문',description:'방문 내역을 확인하세요.'});
 assert.match(html,/class="og-surface v2-card/);
 assert.doesNotMatch(html,/<button|tabindex|role="button"|data-state/);
});
test('tiles expose selection and block loading/disabled interaction',()=>{
 assert.match(renderMenuTile({selected:true}),/aria-pressed="true"/);
 for(const state of ['loading','disabled'])assert.match(renderMenuTile({state}),/ disabled/);
 assert.match(renderMenuTile({state:'loading'}),/aria-busy="true"/);
});
test('gallery covers three button roles, two card roles and readable state explanations',()=>{
 const html=renderComponents();
 for(const id of ['primary','secondary','review','cards'])assert.match(html,new RegExp(`id="${id}"`));
 assert.equal((html.match(/data-component="button"/g)||[]).length,18);
 assert.doesNotMatch(html,/data-state="(?:hover|focus)"/);
 for(const state of ['default','active','disabled','loading','error','success'])assert.match(html,new RegExp(`data-state="${state}"`));
 assert.match(html,/<details class="v2-accessibility-check"><summary>접근성 점검<\/summary>/);
 assert.match(html,/실제 마일리지를 사용하지 않습니다/);
 assert.match(html,/사용 가능한 마일리지가 없을 때/);
 assert.match(html,/다시 시도/);assert.match(html,/완료/);
});
