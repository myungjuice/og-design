import test from 'node:test';
import assert from 'node:assert/strict';
import {renderFigmaHome} from './figma-home.mjs';
import {renderWorkspace} from '../render.mjs';
import {reviewGroups} from '../subnavigation.mjs';

const pins=html=>[...html.matchAll(/<button\b[^>]*class="figma-map-pin[^\"]*"[^>]*>[\s\S]*?<\/button>/g)].map(m=>m[0]);

test('landmark decoration is explicit and independent of selected ON/OFF state',()=>{
 const original=pins(renderFigmaHome()).map(pin=>pin.match(/<img[^>]*>/)[0]);
 for(const style of ['crown','medal','laurel','castle']){
  const markers=pins(renderFigmaHome({landmarkStores:['파샤도 망원','세븐일레븐'],landmarkStyle:style,showStoreLabels:true}));
  for(const i of [0,1]){
   assert.match(markers[i],new RegExp(`data-home-landmark="${style}"`));
   assert.match(markers[i],/· 랜드마크 매장 보기/);
   assert.match(markers[i],/data-home-landmark="[^"]+" aria-hidden="true"/);
  }
  assert.doesNotMatch(markers[2],/data-home-landmark|랜드마크 매장/);
  for(let i=0;i<3;i++)assert.equal(markers[i].match(/<img[^>]*>/)[0],original[i]);
  assert.doesNotMatch(markers.join(''),/home-new-badge|data-home-new-mark/);
 }
});

test('new membership and landmark decorations coexist without losing their accessible meanings',()=>{
 const markers=pins(renderFigmaHome({newStores:['세븐일레븐'],newStoreStyle:'ribbon',landmarkStores:['파샤도 망원','세븐일레븐'],landmarkStyle:'crown'}));
 assert.match(markers[0],/data-home-landmark="crown"/);
 assert.doesNotMatch(markers[0],/data-home-new-mark/);
 assert.match(markers[1],/data-home-landmark="crown"/);
 assert.match(markers[1],/data-home-new-mark="ribbon"/);
 assert.match(markers[1],/aria-label="세븐일레븐 · 신규 회원점 · 랜드마크 매장 보기"/);
 assert.doesNotMatch(renderFigmaHome(),/data-home-landmark/);
 assert.doesNotMatch(renderFigmaHome({landmarkStores:['없는 매장']}),/data-home-landmark/);
});

test('landmark review contains only the confirmed wrapped neon crown',()=>{
 const html=renderWorkspace({pageId:'home'});
 assert.ok(reviewGroups('home').some(g=>g.items.some(i=>i.id==='home-landmarks')));
 assert.match(html,/<section id="home-landmarks"[^>]*data-review-screen hidden/);
 const section=html.split('<section id="home-landmarks"')[1].split('</section>')[0];
 assert.equal((section.match(/<template/g)||[]).length,1);
 assert.match(section,/data-approved-store-map="best-fourth"/);
 assert.match(section,/landmark-crown-back/);
 assert.match(section,/landmark-crown-front/);
 assert.doesNotMatch(section,/이전 시안|이전 왕관|data-approved-store-map="best"|best-final|best-figma/);
 assert.doesNotMatch(html,/id="home-new-stores"/);
 assert.match(html,/id="home-appearance"/);
 for(const pageId of ['my-land','my-info','og-park','barcode'])assert.doesNotMatch(renderWorkspace({pageId}),/id="home-landmarks"|data-home-landmark=/);
});
