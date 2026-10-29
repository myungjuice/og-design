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

test('BEST route preserves supplied crown layers beside an isolated neon comparison',()=>{
 const html=renderHomeLandmarkReview();
 assert.equal((html.match(/<template/g)||[]).length,4);
 assert.match(html,/data-approved-store-map="best-figma-20261028"/);
 assert.match(html,/data-figma-node="306:3424"/);
 assert.match(html,/data-approved-store-map="best-neon-matched"/);
 assert.equal((html.match(/data-neon-crown=/g)||[]).length,4);
 const examples=[...html.matchAll(/<template[^>]*>([\s\S]*?)<\/template>/g)].map(m=>m[1]);
 const matchedPins=markup=>[...markup.matchAll(/<span class="landmark-figma-pin[^\"]*"[^>]*>[\s\S]*?<\/span>/g)].map(m=>m[0]);
 assert.equal(matchedPins(examples[0]).length,2);
 assert.deepEqual(matchedPins(examples[0]),matchedPins(examples[1]),'crown comparisons must use the identical supplied pin artwork and placements');
 assert.equal(pins(examples[1]).length,0,'neon comparison must not fall back to the old 24/40px home pins');
 assert.match(html,/data-approved-store-map="best"/);
 assert.match(html,/data-figma-node="267:2494"/);
 assert.equal((html.match(/data-approved-crown=/g)||[]).length,2);
 const markers=pins(html);
 assert.match(markers.find(m=>m.includes('data-preview="파샤도 망원"')),/랜드마크 매장/);
 assert.match(markers.find(m=>m.includes('data-preview="세븐일레븐"')),/랜드마크 매장/);
 assert.doesNotMatch(markers.find(m=>m.includes('data-preview="삼호가든"')),/랜드마크 매장/);
 for(const file of ['3c62c.svg','66a13.svg','9d749.svg','7a667.svg','7ac27.svg','a0421.svg','757f5.svg','83de9.svg','15e42.svg'])assert.ok(html.includes(file),file);
 assert.doesNotMatch(html,/황금색 핀|best-gold|gasong-map|data-home-theme="dark"|home-store-label/);
 assert.doesNotMatch(html.match(/<div class="home-map-pins">([\s\S]*?)<\/div><div class="home-map-actions">/)[1],/<svg/,'pin and crown artwork uses supplied files');
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
 assert.match(workspace,/id="home-new-stores"/);assert.match(workspace,/id="home-landmarks"/);
 assert.match(workspace,/NEW · 확정 시안/);assert.match(workspace,/피그마 왕관 시안 · 10\/28/);
 assert.match(workspace,/data-home-appearance="dark-large"/,'existing home light/dark review remains');
});
