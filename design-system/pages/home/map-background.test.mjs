import test from 'node:test';
import assert from 'node:assert/strict';
import {homeBoard} from './render.mjs';
import {searchBoard} from './search.mjs';
import {categoryBoard} from './category.mjs';
import {nearbyBoard} from './nearby.mjs';
test('all map specimens share the local Naver image with attribution and no live map SDK',()=>{
 for(const render of [homeBoard,searchBoard,categoryBoard,nearbyBoard]){
 const html=render();const maps=(html.match(/class="og-home-map"/g)||[]).length;
 assert.ok(maps>0);
 assert.equal((html.match(/naver-mangwon\.png/g)||[]).length,maps);
 assert.equal((html.match(/© NAVER Corp\./g)||[]).length,maps);
 assert.ok(!html.includes('<iframe')&&!html.includes('<script')&&!html.includes('map-streets'));
 }
});
