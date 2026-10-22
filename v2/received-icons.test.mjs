import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {renderWorkspace} from './render.mjs';
import {applyReceivedIcons} from './received-icons.mjs';

test('current navigation keeps the Figma barcode caption and gloss across render paths',()=>{
 for(const pageId of ['home','my-info','my-land']){
  const html=renderWorkspace({pageId});
  assert.match(html,/data-figma-navigation/,pageId);
  assert.match(html,/figma-nav-label">내 바코드</,pageId);
  assert.match(html,/60fdf\.svg/,pageId);
 }
});

test('home keeps the supplied map and three received PNG pins with opt-in NEW labels and no extra marker',()=>{
 const html=renderWorkspace({pageId:'home'}).split('<section id="overview"')[1].split('</template>')[0];
 assert.match(html,/figma-home-20261020\/f196c\.png/);
 assert.equal((html.match(/data-received-icon="pin-on"/g)||[]).length,1);
 assert.equal((html.match(/data-received-icon="pin-off"/g)||[]).length,2);
 assert.match(html,/30e02\.svg/);
 assert.equal((html.match(/class="home-store-label"/g)||[]).length,3);
 assert.equal((html.match(/class="home-new-badge"/g)||[]).length,2);
 assert.doesNotMatch(html,/home-current-pin|data-category="전체"/);
});

test('home uses received category, function and map-pin artwork in actual v2 screens',()=>{
 const html=renderWorkspace({pageId:'home'});
 for(const kind of ['category','navigation'])assert.match(html,new RegExp('data-received-icon="'+kind+'"'));
 assert.ok(html.includes('/assets/figma-home-20261020/adbac.svg'));
 for(const state of ['on','off'])assert.ok(html.includes('/assets/received-icons-20261022/pins/'+state+'/'),state);
 for(const file of ['aa166.svg','ae1d9.svg','d146b.svg'])assert.ok(html.includes('/assets/figma-home-20261020/'+file),file);
 assert.match(html,/data-received-category="한식"/);
 assert.match(html,/data-received-category="카페\/베이커리"/);
 assert.match(html,/data-received-category="운동\/스포츠\/레저"/);
 assert.match(html,/data-received-nav="홈"/);
 assert.match(html,/data-received-nav="마이랜드"/);
 assert.match(html,/data-received-nav="바코드"/);
 assert.match(html,/data-received-nav="오지파크"/);
 assert.match(html,/data-received-nav="내 정보"/);
});

test('received bottom navigation reaches all approved current main screens without replacing originals',()=>{
 for(const pageId of ['home','my-info','my-land']){
  const html=renderWorkspace({pageId});
  assert.match(html,/data-received-icon="navigation"/,pageId);
  assert.match(html,/received-icons\.css/,pageId);
 }
 assert.match(renderWorkspace({pageId:'my-land'}),/data-myland-feedback-screen="weekly"/,'current My Land main remains intact');
 assert.ok(renderWorkspace({pageId:'home'}).includes('class="figma-scan-surface"'),'barcode icon retains its raised circular artwork container');
 const barcode=renderWorkspace({pageId:'barcode'});
 assert.match(barcode,/barcode-code-card/);
 assert.match(barcode,/data-preview="영수증 적립"/);
 assert.match(barcode,/class="v2-barcode-map-backdrop" inert aria-hidden="true"><section class="home-test"/,'the shared map navigation stays in the inert backdrop, not in the barcode sheet');
 assert.doesNotMatch(barcode.match(/<section class="barcode-sheet"[\s\S]*/)?.[0]||'',/data-figma-navigation/);
});

test('recent visits use matching industry icons rather than one generic utensils image',()=>{
 const html=renderWorkspace({pageId:'my-info'}).split('<section id="overview"')[1].split('</template>')[0];
 for(const name of ['일식','헤어/뷰티','한식'])assert.match(html,new RegExp('data-received-category="'+name+'"'));
 assert.doesNotMatch(html,/recent-utensils\.svg/);
});

test('received artwork references are local SVG files present in the site',()=>{
 const html=['home','my-info','barcode','my-land'].map(pageId=>renderWorkspace({pageId})).join('');
 const paths=[...new Set([...html.matchAll(/src="(\/assets\/(?:received-icons-20261017|received-icons-20261022|figma-home-20261020)\/[^\"]+\.svg)"/g)].map(m=>decodeURIComponent(m[1])))];
 assert.ok(paths.length>=35,'actual renders reference the delivered artwork set');
 for(const path of paths){
  const file=new URL('..'+path,import.meta.url);
  assert.ok(existsSync(file),path+' exists');
  assert.match(readFileSync(file,'utf8'),/<svg\b/,path+' is SVG');
 }
});

test('current-app capture review is unchanged by received icon integration',()=>{
 const html=renderWorkspace({pageId:'icon-review'});
 assert.doesNotMatch(html,/data-received-icon=/);
 assert.match(html,/app-04-redacted\.png/);
});

test('received quick-earn artwork uses the current 바로적립 name in the visible label and action',()=>{
 const html=renderWorkspace({pageId:'home'});
 assert.ok(html.includes('data-preview="바로적립"'));
 assert.ok(html.includes('aria-label="바로적립"'));
 assert.ok(html.includes('figma-quick-glyph'),'original artwork includes its own 바로적립 lettering');
});

test('composing received-icon adapters does not duplicate stylesheet links or artwork',()=>{
 const html=renderWorkspace({pageId:'home'});
 const once=applyReceivedIcons(html);
 assert.equal(applyReceivedIcons(once),once);
});
