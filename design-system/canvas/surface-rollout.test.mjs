import test from 'node:test';
import assert from 'node:assert/strict';
import {enrollSurfaceRollout} from './surface-rollout.mjs';
test('surface revision reopens changed pages only once without mutating stored decisions',()=>{
 const stored={'board-home-search':'done','board-home-menu-detail':'done'};
 const changed=enrollSurfaceRollout(stored,false);
 assert.equal(changed['board-home-search'],'pending');assert.equal(changed['board-home-menu-detail'],'done');assert.equal(stored['board-home-search'],'done');
 changed['board-home-search']='done';assert.equal(enrollSurfaceRollout(changed,true)['board-home-search'],'done');
});
