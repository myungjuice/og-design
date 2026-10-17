import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {renderWorkspace} from './render.mjs';
import {renderMyLandDesignerReview} from './designer-20261013.mjs';
import {applyReceivedIcons} from './received-icons.mjs';

test('home uses received category, function and map-pin artwork in actual v2 screens',()=>{
 const html=renderWorkspace({pageId:'home'});
 for(const kind of ['category','search','target','quick','pin-on','pin-off','navigation'])assert.match(html,new RegExp('data-received-icon="'+kind+'"'));
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
 assert.ok(renderWorkspace({pageId:'my-land'}).includes(renderMyLandDesignerReview()),'original v1/v2 markup remains intact');
 assert.ok(renderWorkspace({pageId:'home'}).includes('class="barcode-art received-nav-art"'),'barcode icon retains its raised circular artwork container');
 const barcode=renderWorkspace({pageId:'barcode'});
 assert.match(barcode,/barcode-code-card/);
 assert.match(barcode,/data-preview="영수증 적립"/);
 assert.doesNotMatch(barcode,/class="bottom-navigation"/,'barcode remains the approved sheet, not a new tab layout');
});

test('recent visits use matching industry icons rather than one generic utensils image',()=>{
 const html=renderWorkspace({pageId:'my-info'}).split('<section id="overview"')[1].split('</template>')[0];
 for(const name of ['일식','헤어/뷰티','한식'])assert.match(html,new RegExp('data-received-category="'+name+'"'));
 assert.doesNotMatch(html,/recent-utensils\.svg/);
});

test('received artwork references are local SVG files present in the site',()=>{
 const html=['home','my-info','barcode','my-land'].map(pageId=>renderWorkspace({pageId})).join('');
 const paths=[...new Set([...html.matchAll(/src="(\/assets\/received-icons-20261017\/[^\"]+)"/g)].map(m=>decodeURIComponent(m[1])))];
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
 assert.ok(html.includes('<span>바로적립</span>'));
});

test('composing received-icon adapters does not duplicate stylesheet links or artwork',()=>{
 const html=renderWorkspace({pageId:'home'});
 const once=applyReceivedIcons(html);
 assert.equal(applyReceivedIcons(once),once);
});
