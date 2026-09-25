import test from 'node:test';
import assert from 'node:assert/strict';
import * as proposal from './new-gradient.mjs';
test('comparison contains a single NEW marker without replacing the map or legacy pins',()=>{
 assert.equal(typeof proposal.newGradientBoard,'function');
 const html=proposal.newGradientBoard();
 assert.equal((html.match(/class="og-map-new"/g)||[]).length,1);
 assert.equal((html.match(/class="og-map-pin"/g)||[]).length,3);
 assert.ok(html.includes('© NAVER Corp.'));
 assert.ok(html.includes('og-new-gradient'));
});
