import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,statSync} from 'node:fs';
import {renderWorkspace} from '../render.mjs';
import {renderHomeNewStoresReview} from './new-stores.mjs';
import {renderHomeLandmarkReview} from './landmarks.mjs';

const pins=html=>[...html.matchAll(/<button\b[^>]*class="figma-map-pin[^\"]*"[^>]*>[\s\S]*?<\/button>/g)].map(m=>m[0]);

test('NEW route contains only the approved Figma screen and marks Samho plus the selected store',()=>{
 const html=renderHomeNewStoresReview();
 assert.equal((html.match(/<template/g)||[]).length,1);
 assert.match(html,/data-approved-store-map="new"/);
 assert.match(html,/data-figma-node="267:2353"/);
 const markers=pins(html);
 assert.equal(markers.length,3);
 assert.match(markers.find(m=>m.includes('data-preview="파샤도 망원"')),/data-approved-new="true"/);
 assert.match(markers.find(m=>m.includes('data-preview="삼호가든"')),/data-approved-new="true"/);
 assert.doesNotMatch(markers.find(m=>m.includes('data-preview="세븐일레븐"')),/data-approved-new/);
 assert.equal((html.match(/class="approved-new-badge"/g)||[]).length,2);
 assert.doesNotMatch(html,/gasong-map|새싹|new-sprout|data-home-theme="dark"|home-store-label|gasong-map-legend/);
});

test('BEST route keeps only the confirmed crown with both selection states',()=>{
 const html=renderHomeLandmarkReview();
 assert.equal((html.match(/<template/g)||[]).length,1);
 assert.match(html,/data-approved-store-map="best-fourth"/);
 assert.doesNotMatch(html,/best-figma|best-final|data-approved-store-map="best"|이전 왕관/);
 for(const state of ['off','on']){
  assert.match(html,new RegExp(`data-landmark-state="${state}"`));
  assert.match(html,new RegExp(`pins/${state}/`));
 }
 for(const layer of ['back','front']){
  assert.match(html,new RegExp(`landmark-crown-${layer}`));
  assert.ok(html.includes(`neon-crown-gold-${layer}.svg`));
 }
 assert.equal(pins(html).length,0);
 assert.doesNotMatch(html,/data-home-theme="dark"|home-store-label/);
});

test('approved screens reference nonempty local assets, shared navigation and correct review routes',()=>{
 for(const html of [renderHomeNewStoresReview(),renderHomeLandmarkReview()]){
  assert.doesNotMatch(html,/https:\/\/www\.figma\.com\/api\/mcp\/asset/);
  assert.match(html,/data-figma-navigation/);
  assert.match(html,/figma-home\.css/);
  for(const [,path] of html.matchAll(/(?:src|href)="(\/(?:assets|v2|screens)\/[^\"]+)"/g)){
   const file=new URL('../..'+path,import.meta.url);
   assert.ok(existsSync(file),path);assert.ok(statSync(file).size>0,path);
  }
 }
 const workspace=renderWorkspace({pageId:'home'});
 assert.doesNotMatch(workspace,/id="home-new-stores"/);assert.match(workspace,/id="home-landmarks"/);
 assert.doesNotMatch(workspace,/NEW · 확정 시안/);assert.match(workspace,/랜드마크 매장 · 최종 시안/);
 assert.match(workspace,/data-home-appearance="dark-large"/,'existing home light/dark review remains');
});
