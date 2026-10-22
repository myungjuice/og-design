import test from 'node:test';
import assert from 'node:assert/strict';
import {renderFigmaHome} from './figma-home.mjs';
import {renderWorkspace} from '../render.mjs';
import {reviewGroups} from '../subnavigation.mjs';

const pins=html=>[...html.matchAll(/<button\b[^>]*class="figma-map-pin[^\"]*"[^>]*>[\s\S]*?<\/button>/g)].map(match=>match[0]);

test('NEW follows explicit store membership, independently of selected ON/OFF state',()=>{
 const html=renderFigmaHome({newStores:['파샤도 망원','세븐일레븐'],showStoreLabels:true});
 const markers=pins(html);
 assert.equal(markers.length,3);
 assert.match(markers[0],/class="home-new-badge"[^>]*>NEW<\/span>/);
 assert.match(markers[1],/class="home-new-badge"[^>]*>NEW<\/span>/);
 assert.doesNotMatch(markers[2],/home-new-badge/);
 assert.match(markers[0],/aria-label="파샤도 망원 · 신규 회원점 보기"/);
 assert.match(markers[1],/aria-label="세븐일레븐 · 신규 회원점 보기"/);
 assert.match(markers[2],/aria-label="삼호가든 보기"/);
 for(const marker of markers){
  assert.match(marker,/class="home-store-label" aria-hidden="true"/);
  assert.doesNotMatch(marker,/<(?:button|a)[^>]*home-new-badge|home-new-badge[^>]*tabindex=/);
 }
});

test('normal maps and non-matching stores do not gain a NEW badge or change pin artwork',()=>{
 const original=renderFigmaHome();
 const marked=renderFigmaHome({newStores:['세븐일레븐'],showStoreLabels:true});
 const artwork=html=>[...html.matchAll(/<img[^>]*class="received-pin-art"[^>]*>/g)].map(match=>match[0]);
 assert.deepEqual(artwork(marked),artwork(original));
 assert.doesNotMatch(original,/home-new-badge|data-home-new-stores/);
 assert.doesNotMatch(renderFigmaHome({newStores:['등록되지 않은 매장']}),/class="home-new-badge"/);
 assert.equal((marked.match(/class="home-new-badge"/g)||[]).length,1);
});

test('the home overview shows NEW and offers a separate light/dark review without changing old comparisons',()=>{
 const html=renderWorkspace({pageId:'home'});
 const overview=html.match(/<section id="overview"[\s\S]*?<\/template>/)[0];
 assert.equal((overview.match(/class="home-new-badge"/g)||[]).length,2);
 assert.ok(reviewGroups('home').some(group=>group.items.some(item=>item.id==='home-new-stores'&&!item.pending)));
 assert.match(html,/<section id="home-new-stores"[^>]*data-review-screen hidden/);
 const examples=[...html.matchAll(/<template data-home-new-theme="([^"]+)">([\s\S]*?)<\/template>/g)];
 assert.deepEqual(examples.map(match=>match[1]),['light','dark']);
 for(const example of examples){
  assert.equal((example[2].match(/class="home-new-badge"/g)||[]).length,2);
  assert.equal((example[2].match(/class="home-store-label"/g)||[]).length,3);
  assert.match(example[2],/new-stores\.css/);
 }
 assert.match(examples[1][2],/data-home-theme="dark"/);
 for(const example of html.matchAll(/<template data-home-appearance="[^"]+">([\s\S]*?)<\/template>/g)){
  assert.doesNotMatch(example[1],/class="home-new-badge"/,'existing comparison remains unchanged');
 }
 for(const pageId of ['my-land','my-info','og-park','barcode']){
  assert.doesNotMatch(renderWorkspace({pageId}),/data-home-new-theme=|class="home-new-badge"/);
 }
});

test('three visual treatments decorate only new stores and preserve original ON/OFF artwork',()=>{
 const original=pins(renderFigmaHome()).map(pin=>pin.match(/<img[^>]*>/)[0]);
 for(const variant of ['sprout','ribbon','paper']){
  const markers=pins(renderFigmaHome({newStores:['파샤도 망원','세븐일레븐'],showStoreLabels:true,newStoreStyle:variant}));
  assert.match(markers[0],new RegExp(`data-home-new-mark="${variant}"`));
  assert.match(markers[1],new RegExp(`data-home-new-mark="${variant}"`));
  assert.doesNotMatch(markers[2],/data-home-new-mark|home-new-badge/);
  for(let i=0;i<markers.length;i++)assert.equal(markers[i].match(/<img[^>]*>/)[0],original[i]);
  assert.doesNotMatch(markers.join(''),/class="home-new-badge"|>NEW</);
  assert.match(markers[0],/aria-label="파샤도 망원 · 신규 회원점 보기"/);
  assert.match(markers[0],/data-home-new-mark="[^"]+" aria-hidden="true"/);
 }
 assert.match(renderFigmaHome({newStores:['세븐일레븐'],newStoreStyle:'unknown'}),/class="home-new-badge"/,'unknown treatment safely falls back to existing badge');
});

test('comparison exposes all three treatments in both themes while keeping the old badge comparison',()=>{
 const html=renderWorkspace({pageId:'home'});
 const examples=[...html.matchAll(/<template data-home-new-variant="([^"]+)" data-home-new-theme="([^"]+)">([\s\S]*?)<\/template>/g)];
 assert.deepEqual(examples.map(m=>m[1]+':'+m[2]),['sprout:light','ribbon:light','paper:light','sprout:dark','ribbon:dark','paper:dark']);
 for(const [,variant,theme,markup] of examples){
  assert.equal((markup.match(new RegExp(`data-home-new-mark="${variant}"`,'g'))||[]).length,3,'legend plus selected and idle new pins');
  assert.equal((markup.match(/class="home-store-label"/g)||[]).length,3);
  assert.doesNotMatch(markup,/class="home-new-badge"/);
  assert.match(markup,/새로 들어온 회원점/);
  if(theme==='dark')assert.match(markup,/data-home-theme="dark"/);
 }
 assert.match(html,/data-home-new-theme="light"/,'previous badge specimen is retained');
 assert.match(html,/data-home-new-theme="dark"/);
});
