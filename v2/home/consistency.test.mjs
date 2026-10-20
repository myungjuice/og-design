import test from 'node:test';
import assert from 'node:assert/strict';
import {renderFigmaHome} from './figma-home.mjs';
import {renderHomeSearchReview} from './search.mjs';
import {renderHomeNearbyScreen} from './nearby.mjs';
import {renderHomeCategoryScreen} from './category.mjs';
import {renderDesignerScreen} from '../designer-20261013.mjs';
import {renderBarcodeScreen} from '../barcode/render.mjs';
import {renderHomeControlSamples} from '../components/home-controls.mjs';

test('every current map backdrop shares the same controls, pins and navigation',()=>{
 const home=renderFigmaHome();
 const examples=[renderHomeSearchReview(),renderHomeNearbyScreen(),renderHomeCategoryScreen({state:'selected'}),renderDesignerScreen('home'),renderDesignerScreen('category-before'),renderBarcodeScreen()];
 for(const html of examples){
  assert.ok(html.includes(home),'A map specimen diverged from the canonical home');
  assert.doesNotMatch(html,/naver-mangwon\.png|class="map-actions"|class="explore"/);
 }
});

test('component specimens and full screens use the same search and category geometry hooks',()=>{
 const html=renderHomeControlSamples();
 assert.match(html,/data-figma-home/);
 assert.match(html,/figma-home\.css/);
 assert.match(html,/v2-home-category-row/);
 assert.match(html,/figma-search-location/);
 assert.doesNotMatch(html,/data-category="전체"/);
});

test('category filters isolate the inactive map and retain a keyboard-scrollable list',()=>{
 for(const state of ['open','selected']){
  const html=renderHomeCategoryScreen({state});
  assert.match(html,/<div class="screen home" inert aria-hidden="true">/);
  assert.match(html,/class="category-content" role="region" tabindex="0"/);
 }
});
