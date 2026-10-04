import test from 'node:test';
import assert from 'node:assert/strict';
import * as components from './render.mjs';
import {favorite,iconButton} from '../../design-system/components/button/render.mjs';
import {reviewGroups} from '../subnavigation.mjs';
test('icon buttons require a supported kind, face, state and accessible name',()=>{
 assert.equal(typeof components.renderIconButton,'function');
 const html=components.renderIconButton({kind:'info',label:'<마일리지 안내>',attributes:{id:'a"b'}});
 assert.match(html,/aria-label="&lt;마일리지 안내&gt;"/);assert.match(html,/id="a&quot;b"/);
 assert.match(html,/data-face="plain"/);assert.match(html,/<svg[^>]*aria-hidden="true"/);
 assert.doesNotMatch(html,/material-icons|aria-pressed/);
 for(const props of [{kind:'invalid'},{face:'invalid'},{state:'invalid'},{label:' '}])assert.throws(()=>components.renderIconButton(props));
});
test('favorite retains the original heart and exposes selection separately from action state',()=>{
 const html=components.renderIconButton({kind:'favorite',selected:true,state:'error'});
 assert.match(html,/og-button og-favorite v2-icon-button/);assert.match(html,/aria-pressed="true"/);
 assert.match(html,/data-state="error"/);assert.match(html,/aria-label="즐겨찾기"/);
 const original=favorite({selected:true});
 assert.equal(html.match(/<svg[\s\S]*?<\/svg>/)[0],original.match(/<svg[\s\S]*?<\/svg>/)[0]);
 assert.match(components.renderIconButton({kind:'favorite'}),/aria-pressed="false"/);
});
test('pending and disabled controls cannot be reenabled by caller attributes',()=>{
 for(const state of ['disabled','loading']){
  const html=components.renderIconButton({kind:'favorite',state,attributes:{disabled:false,'aria-busy':'false'}});
  assert.match(html,/<button[^>]*disabled/);
  if(state==='loading')assert.match(html,/aria-busy="true"/);
 }
 assert.doesNotMatch(components.renderIconButton({kind:'close'}),/disabled|aria-busy="true"/);
});
test('gallery groups icon buttons with existing buttons and keeps static samples inert',()=>{
 const html=components.renderComponents().match(/<section[^>]*id="icon-buttons"[\s\S]*?<\/section>/)?.[0];
 assert.ok(html);assert.match(html,/class="v2-icon-stage" inert/);
 assert.match(html,/data-icon-favorite/);assert.match(html,/data-icon-feedback[^>]*role="status"/);
 assert.deepEqual(reviewGroups('components').find(g=>g.id==='buttons').items.map(i=>i.id),['primary','secondary','review','icon-buttons']);
});
test('original icon button and favorite markup remain unchanged',()=>{
 assert.match(iconButton({label:'안내'}),/class="og-icon-button" aria-label="안내"/);
 assert.match(favorite({selected:true}),/class="og-button og-favorite"/);
 assert.doesNotMatch(favorite({selected:true}),/v2-icon-button/);
});
