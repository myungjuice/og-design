import test from 'node:test';
import assert from 'node:assert/strict';
import {renderWorkspace} from '../render.mjs';
import {reviewGroups} from '../subnavigation.mjs';
import {renderHomeNearbyScreen} from './nearby.mjs';

// Catches an ambiguous slashed/search-off mark instead of a complete magnifier.
test('nearby empty state pairs a simple magnifier with the existing distance message',()=>{
 const html=renderHomeNearbyScreen({state:'empty'});
 assert.match(html,/og-nearby-empty[\s\S]*<circle cx="10" cy="10" r="6"/);
 assert.match(html,/2Km 이내에 매장이 없습니다\./);
 assert.doesNotMatch(html,/M5 5l14 14/);
});

// Catches a missing destination, lost source state, or eagerly expanded comparisons.
test('nearby review exposes the three source branches in a dedicated exploration group',()=>{
 const html=renderWorkspace({pageId:'home'});
 assert.ok(reviewGroups('home').some(group=>group.items.some(item=>item.id==='nearby'&&!item.pending)));
 assert.match(html,/<section id="nearby"[^>]*data-review-screen/);
 assert.deepEqual([...html.matchAll(/data-nearby-state="([^"]+)"/g)].map(m=>m[1]),['list','no-photo','empty']);
 assert.equal((html.match(/data-nearby-template/g)||[]).length,3);
 assert.doesNotMatch(html,/<details[^>]*v2-home-nearby-extra[^>]*\bopen\b/);
});

// Catches fictional content, photo/count disagreement, and dropping absent-photo behavior.
test('nearby photo cards retain the public store introduction and photo counter semantics',()=>{
 const html=renderWorkspace({pageId:'home'});
 const list=html.match(/data-nearby-state="list"([\s\S]*?)<\/template>/)?.[1]||'';
 const noPhoto=html.match(/data-nearby-state="no-photo"([\s\S]*?)<\/template>/)?.[1]||'';
 for(const card of [list,noPhoto]){
  assert.match(card,/오시 망원본점/);
  assert.match(card,/최애가 되기위해 탄생한 오꼬노미야끼\n오시노미야끼입니다\./);
  assert.match(card,/>방문하기<\/button>/);
  assert.match(card,/v2-thumbnail/);
 }
 assert.match(list,/store_photo\/FS3627025392\/1710146278412\.jpg/);
 assert.match(list,/>1 · 10<\/span>/);
 assert.match(noPhoto,/ogapp\/no_image\.png/);
 assert.match(noPhoto,/>0 · 0<\/span>/);
 assert.doesNotMatch(noPhoto,/store_photo\/FS3627025392/);
});

// Catches accidental generic-modal controls, invented empty CTA, or disabling scroll itself.
test('nearby stays a static scrollable map panel without close, completion, or a scrim',()=>{
 const html=renderWorkspace({pageId:'home'});
 for(const state of ['list','no-photo','empty']){
  const frame=html.match(new RegExp(`data-nearby-state="${state}"([\\s\\S]*?)<\\/template>`))?.[1]||'';
  assert.match(frame,/망원동 근처 보기/);
  assert.match(frame,/class="og-sheet-body"[^>]*role="region"[^>]*tabindex="0"/);
  assert.match(frame,/naver-mangwon\.png/);
  assert.doesNotMatch(frame,/og-sheet-close|og-sheet-footer|data-sheet-close|material-icons|v2-home-nearby-scrim/);
 }
 const empty=html.match(/data-nearby-state="empty"([\s\S]*?)<\/template>/)?.[1]||'';
 assert.match(empty,/2Km 이내에 매장이 없습니다\./);
 assert.doesNotMatch(empty,/og-nearby-card|방문하기/);
});
