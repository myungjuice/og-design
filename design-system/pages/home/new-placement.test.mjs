import test from 'node:test';
import assert from 'node:assert/strict';
import * as proposal from './new-placement.mjs';
test('placement comparison relocates NEW into the name while preserving pins',()=>{
 assert.equal(typeof proposal.newPlacementScreen,'function');
 const html=proposal.newPlacementScreen('name');
 assert.match(html,/<span class="og-map-name"><span class="og-map-new">NEW<\/span>회원점명<\/span>/);
 assert.equal((html.match(/class="og-map-new"/g)||[]).length,1);
 assert.equal((html.match(/class="og-map-pin"/g)||[]).length,3);
 const pin=proposal.newPlacementScreen('pin');
 assert.ok(!pin.includes('<span class="og-map-name"><span class="og-map-new">'));
});
