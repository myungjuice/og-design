import test from 'node:test';
import assert from 'node:assert/strict';
import {renderWorkspace} from '../render.mjs';
import {reviewGroups} from '../subnavigation.mjs';
import {renderFigmaHome} from './figma-home.mjs';
import {applyReceivedIcons} from '../received-icons.mjs';
import {readFileSync} from 'node:fs';
import {renderHomeAppearanceReview} from './appearance.mjs';

test('home appearance comparison is additive and reachable from the review menu',()=>{
 const html=renderWorkspace({pageId:'home'});
 assert.ok(reviewGroups('home').some(group=>group.items.some(item=>item.id==='home-appearance'&&!item.pending)));
 assert.match(html,/<section id="home-appearance"[^>]*data-review-screen hidden/);
 assert.deepEqual([...html.matchAll(/data-home-appearance="([^"]+)"/g)].map(m=>m[1]),['original','light-large','dark-large']);
});

test('comparison preserves original layout while rasterizing only its pin artwork',()=>{
 const html=renderWorkspace({pageId:'home'});
 const specimens=Object.fromEntries([...html.matchAll(/<template data-home-appearance="([^"]+)">([\s\S]*?)<\/template>/g)].map(m=>[m[1],m[2]]));
 const omitPinArt=markup=>markup.replace(/(<button\b[^>]*class="figma-map-pin[^\"]*"[^>]*>)[\s\S]*?(<\/button>)/g,'$1$2');
 assert.ok(omitPinArt(specimens.original).includes(omitPinArt(applyReceivedIcons(renderFigmaHome()))),'original non-pin markup and geometry must remain unchanged');
 for(const id of ['light-large','dark-large']){
  assert.equal((specimens[id]?.match(/class="home-store-label"/g)||[]).length,3);
  const withoutPins=markup=>[...markup.matchAll(/src="([^"]+)"/g)].map(m=>m[1]).filter(src=>!['55e99.svg','3679c.svg','e20b7.svg'].some(file=>src.endsWith(file))&&!src.startsWith('/assets/home-appearance-20261020/'));
  assert.deepEqual(withoutPins(specimens[id]),withoutPins(specimens.original));
 }
 assert.match(specimens['dark-large'],/data-home-theme="dark"/);
 assert.doesNotMatch(specimens.original,/data-home-theme|home-store-label/);
 assert.match(html,/지도 색감은 참고용입니다/);
 for(const pageId of ['my-info','my-land','barcode'])assert.doesNotMatch(renderWorkspace({pageId}),/data-home-appearance=/);
});

test('appearance comparison captions contain just the three option names',()=>{
 const section=renderHomeAppearanceReview();
 const captions=[...section.matchAll(/<figcaption>([\s\S]*?)<\/figcaption>/g)].map(m=>m[1]);
 assert.deepEqual(captions,['<h3>기존 홈</h3>','<h3>라이트</h3>','<h3>다크</h3>']);
 assert.doesNotMatch(section,/현재 확정 시안 그대로|원본 유지|매장명 14px|채도만 20%|SDK의 야간 스타일/);
});

test('all three comparisons use padded 4x transparent PNG pins without a second clipping mask',()=>{
 const html=renderWorkspace({pageId:'home'});
 const specimens=Object.fromEntries([...html.matchAll(/<template data-home-appearance="([^"]+)">([\s\S]*?)<\/template>/g)].map(m=>[m[1],m[2]]));
 for(const id of ['original','light-large','dark-large']){
  const pins=[...specimens[id].matchAll(/<button\b[^>]*class="figma-map-pin[^\"]*"[^>]*>([\s\S]*?)<\/button>/g)].map(m=>m[1]);
  assert.equal(pins.length,3);
  for(const [index,pin] of pins.entries()){
   const art=pin.match(/<img class="home-review-pin-art"[^>]*src="([^"]+)"/);
   assert.ok(art,`${id} pin ${index} must use PNG artwork`);
   const file=art[1];
   assert.match(file,/^\/assets\/home-appearance-20261020\/[^/]+@4x\.png$/);
   const bytes=readFileSync(new URL('../..'+file,import.meta.url));
   assert.equal(bytes.subarray(1,4).toString(),'PNG');
   const dimension=index===0?176:112; // 40px / 24px artwork + 2px transparent gutter on each side, at 4x.
   assert.equal(bytes.readUInt32BE(16),dimension);
   assert.equal(bytes.readUInt32BE(20),dimension);
   assert.equal(bytes[25],6,'RGBA PNG must preserve the transparent background');
   assert.doesNotMatch(pin,/figma-pin-mask|figma-pin-layer/,'avoid clipping an already vector-shaped pin a second time');
  }
 }
 assert.doesNotMatch(specimens.original,/figma-pin-mask/,'rasterized reference pins must not be clipped twice');
});

test('both comparison themes use circular artwork for every map pin',()=>{
 const html=renderWorkspace({pageId:'home'});
 const specimens=Object.fromEntries([...html.matchAll(/<template data-home-appearance="([^"]+)">([\s\S]*?)<\/template>/g)].map(m=>[m[1],m[2]]));
 for(const id of ['light-large','dark-large']){
  const files=[...specimens[id].matchAll(/class="home-review-pin-art" src="([^"]+)"/g)].map(m=>m[1]);
  assert.deepEqual(files,[
   '/assets/home-appearance-20261020/pin-circle-large@4x.png',
   '/assets/home-appearance-20261020/pin-idle-circle@4x.png',
   '/assets/home-appearance-20261020/pin-idle-circle@4x.png'
  ]);
 }
 const originalFiles=[...specimens.original.matchAll(/class="home-review-pin-art" src="([^"]+)"/g)].map(m=>m[1]);
 assert.deepEqual(originalFiles,[
  '/assets/home-appearance-20261020/pin-selected@4x.png',
  '/assets/home-appearance-20261020/pin-idle-circle@4x.png',
  '/assets/home-appearance-20261020/pin-idle-point@4x.png'
 ],'original ON/OFF shapes must stay unchanged');
});
