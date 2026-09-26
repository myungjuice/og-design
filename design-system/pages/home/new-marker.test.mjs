import test from 'node:test';
import assert from 'node:assert/strict';
import {homeScreen} from './render.mjs';
test('new stores use the adopted Korean badge beside their real name',()=>{
 const html=homeScreen({state:'new'});
 assert.ok(html.includes('<span class="og-map-name"><span class="og-map-new">신규</span>오시 망원본점</span>'));
 assert.equal((html.match(/class="og-map-new"/g)||[]).length,1);
 assert.equal((html.match(/class="og-map-pin"/g)||[]).length,3);
 assert.ok(!html.includes('>NEW<'));
 assert.ok(!homeScreen().includes('og-map-new'));
});
