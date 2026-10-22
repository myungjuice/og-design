import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {renderWorkspace} from './render.mjs';
import {renderFigmaHome} from './home/figma-home.mjs';
import {renderCharacterMain} from './my-info/character.mjs';
import {renderMyLandDesignerReview,categoryRows} from './designer-20261013.mjs';
import {categoryArtworkURL,pinArtworkURL} from './category-artwork.mjs';
import {renderHomeCategoryScreen} from './home/category.mjs';

const base='/assets/received-icons-20261022/';
const imageSources=html=>[...html.matchAll(/<img\b[^>]*>/g)].map(([tag])=>({tag,src:decodeURIComponent(tag.match(/src="([^"]+)"/)?.[1]||'')}));

test('all three category selection specimens include the received accessories industry once',()=>{
 const states=[renderHomeCategoryScreen({state:'open'}),renderHomeCategoryScreen({state:'selected'})];
 const workspace=renderWorkspace({pageId:'home'});
 states.push(workspace.split('data-designer-screen="category-full"')[1].split('</template>')[0]);
 for(const html of states){
  const panel=html.split('<section class="filter-panel">')[1];
  const choices=[...panel.matchAll(/data-category="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(choices.length,23);
  assert.equal(choices.filter(name=>name==='액세서리/잡화').length,1);
 }
});

test('every current home specimen displays selected pins at 1.4 times the idle size',()=>{
 for(const pageId of ['home','barcode']){
  const html=renderWorkspace({pageId});
  const pins=[...html.matchAll(/<button\b[^>]*class="figma-map-pin ([^\"]+)"[^>]*>([\s\S]*?)<\/button>/g)];
  const selected=pins.filter(m=>m[1].includes('selected'));
  const idle=pins.filter(m=>!m[1].includes('selected'));
  assert.ok(selected.length>0&&idle.length>0);
  const dimension=pin=>Number(pin[2].match(/<img\b[^>]*width="([\d.]+)"/)[1]);
  for(const pin of selected)assert.ok(Math.abs(dimension(pin)/dimension(idle[0])-1.4)<1e-9,pageId);
 }
});

test('legacy sports labels and the supplied ON filename typo resolve to one sports/leisure artwork',()=>{
 for(const label of ['운동/헬스','레저','운동-서비스-레저','운동-스포츠-레저']){
  assert.equal(decodeURIComponent(categoryArtworkURL(label)),base+'categories/운동-스포츠-레저.svg');
  assert.equal(decodeURIComponent(pinArtworkURL(label,'on')),base+'pins/on/운동-스포츠-레저.png');
  assert.equal(decodeURIComponent(pinArtworkURL(label,'off')),base+'pins/off/운동-스포츠-레저.png');
 }
 assert.throws(()=>pinArtworkURL('한식','unknown'),RangeError);
});

test('shared home uses delivered outlined ON/OFF PNGs without clipping their transparent edges',()=>{
 const html=renderFigmaHome();
 const pins=[...html.matchAll(/<button\b[^>]*class="figma-map-pin[^\"]*"[^>]*>([\s\S]*?)<\/button>/g)].map(m=>m[1]);
 assert.equal(pins.length,3);
 assert.deepEqual(pins.map(pin=>imageSources(pin)[0]?.src),[
  base+'pins/on/한식.png',base+'pins/off/한식.png',base+'pins/off/한식.png'
 ]);
 for(const pin of pins)assert.doesNotMatch(pin,/figma-pin-mask|figma-pin-layer/);
});

test('all current map backdrops and three comparison options use the new PNG set',()=>{
 for(const pageId of ['home','barcode']){
  const html=renderWorkspace({pageId});
  const mapButtons=[...html.matchAll(/<button\b[^>]*class="(?:figma-map-pin|home-store-pin)[^\"]*"[^>]*>([\s\S]*?)<\/button>/g)];
  assert.ok(mapButtons.length>=3,pageId+' has map samples');
  for(const [,pin] of mapButtons){
   const sources=imageSources(pin).filter(({src})=>src.endsWith('.png')||src.endsWith('.svg'));
   assert.ok(sources.some(({src})=>src.startsWith(base+'pins/')),pageId+' uses delivered PNGs');
  }
 }
});

test('every current category consumer resolves the new SVG set including runtime character previews',()=>{
 const outputs=['home','my-info','barcode','components','my-land','og-park'].map(pageId=>[pageId,renderWorkspace({pageId})]);
 outputs.push(...[null,'bear','penguin','raccoon'].map(selected=>['character '+selected,renderCharacterMain({selected})]));
 let total=0;
 for(const [name,html] of outputs){
  for(const {tag,src} of imageSources(html).filter(({tag})=>tag.includes('data-received-icon="category"'))){
   assert.ok(src.startsWith(base+'categories/'),name+' '+src);
   assert.ok(existsSync(new URL('..'+src,import.meta.url)),src+' exists');
   assert.ok(!tag.includes('운동-서비스-레저'));
   total++;
  }
 }
 assert.ok(total>50,'covers chips, full category selection, recent visits and shared samples');
 const home=renderWorkspace({pageId:'home'});
 for(const name of categoryRows.flat())assert.ok(imageSources(home).some(({src})=>src===base+'categories/'+name.replaceAll('/','-')+'.svg'),name);
});

test('all 23 industries have intact 160px RGBA ON/OFF images using the same canonical filename',()=>{
 for(const name of categoryRows.flat()){
  for(const state of ['on','off']){
   const path=base+'pins/'+state+'/'+name.replaceAll('/','-')+'.png';
   assert.ok(existsSync(new URL('..'+path,import.meta.url)),path+' exists');
   const bytes=readFileSync(new URL('..'+path,import.meta.url));
   assert.equal(bytes.subarray(1,4).toString(),'PNG');
   assert.equal(bytes.readUInt32BE(16),160);assert.equal(bytes.readUInt32BE(20),160);
   assert.equal(bytes[25],6,'transparent RGBA artwork is preserved');
  }
 }
});

test('icon reuse example is current while app captures and historical My Land frames stay untouched',()=>{
 const html=renderWorkspace({pageId:'icon-review'});
 assert.ok(imageSources(html).some(({src})=>src===base+'categories/한식.svg'));
 assert.match(html,/app-04-redacted\.png/);
 assert.ok(renderWorkspace({pageId:'my-land'}).includes(renderMyLandDesignerReview()));
});
