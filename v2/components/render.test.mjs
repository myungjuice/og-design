import test from 'node:test';
import assert from 'node:assert/strict';
import {renderButton,renderCard,renderMenuTile,renderComponents} from './render.mjs';
import * as components from './render.mjs';
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
test('gallery isolates real home controls without embedding a map or full screen',()=>{
 const html=renderComponents();
 for(const id of ['search','categories','navigation']){
  assert.match(html,new RegExp(`id="${id}"`));
  assert.match(html,new RegExp(`data-home-component="${id}"`));
 }
 assert.match(html,/id="component-store-search"/);
 assert.match(html,/data-category="전체" aria-pressed="true"/);
 assert.match(html,/aria-current="page"/);
 assert.match(html,/\/screens\/my-info-3d-test\/media\/figma\/bottom-navigation-source.png/);
 assert.doesNotMatch(html,/class="home-map"|class="home-test"|<iframe/);
});
test('gallery exposes basic, icon and non-interactive information list rows',()=>{
 const html=renderComponents();
 assert.match(html,/id="list-row"/);
 for(const id of ['list-row-basic','list-row-icons','list-row-information'])assert.match(html,new RegExp(`id="${id}"`));
 assert.match(html,/class="og-list-row v2-list-row"/);
 assert.match(html,/role="status"[^>]*>[^<]*목록/);
});
test('v2 list rows preserve information semantics and escape visible data',()=>{
 assert.equal(typeof components.renderListRow,'function');
 const html=components.renderListRow({title:'<img onerror=bad>',value:'16,000 M',interactive:false});
 assert.match(html,/^<div /);assert.doesNotMatch(html,/<button|og-row-chevron|data-preview-row|aria-busy|disabled/);
 assert.match(html,/&lt;img onerror=bad&gt;/);assert.match(html,/16,000 M/);
});
test('list processing and disabled states block actions without lying about loading results',()=>{
 assert.equal(typeof components.renderListRow,'function');
 for(const state of ['loading','disabled']){
  const html=components.renderListRow({title:'이용내역',state,art:'receipt'});
  assert.match(html,/<button type="button"/);assert.match(html,/ disabled/);
  if(state==='loading')assert.match(html,/aria-busy="true"/);
 }
 const html=components.renderListRow({title:'공지사항',art:'bell'});
 assert.match(html,/menu-icons.png/);assert.match(html,/data-art="bell"/);
 assert.doesNotMatch(html,/ disabled/);
 assert.throws(()=>components.renderListRow({state:'unknown'}),RangeError);
 assert.throws(()=>components.renderListRow({art:'unknown'}),RangeError);
});
