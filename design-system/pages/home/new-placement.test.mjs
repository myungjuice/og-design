import test from 'node:test';
import assert from 'node:assert/strict';
import * as proposal from './new-placement.mjs';
test('placement comparison relocates NEW into the name while preserving pins',()=>{
 assert.equal(typeof proposal.newPlacementScreen,'function');
 const html=proposal.newPlacementScreen('name');
 assert.match(html,/<span class="og-map-name"><span class="og-map-new">NEW<\/span>오시 망원본점<\/span>/);
 assert.equal((html.match(/class="og-map-new"/g)||[]).length,1);
 assert.equal((html.match(/class="og-map-pin"/g)||[]).length,3);
 const pin=proposal.newPlacementScreen('pin');
 assert.ok(!pin.includes('<span class="og-map-name"><span class="og-map-new">'));
});

test('placement examples use snapshot names without implying real map coordinates',()=>{
 const html=proposal.newPlacementScreen('name');
 for(const name of ['오시 망원본점','밀랍(MILLAB)','육감만족'])assert.ok(html.includes(name));
 assert.ok(!html.includes('회원점명'));
 assert.ok(!html.includes('다른 회원점'));
});
