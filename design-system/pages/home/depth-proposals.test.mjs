import test from 'node:test';
import assert from 'node:assert/strict';
import {homeScreen} from './render.mjs';
import {storeScreen} from './store.mjs';
test('depth proposals reuse original screens without changing their content',async()=>{
 const {depthProposal:render}=await import('./depth-proposals.mjs');
 const normalize=s=>s.replace(/(search|tabs)-\d+/g,'$1-ID');
 const depthProposal=(...args)=>normalize(render(...args));
 assert.ok(depthProposal('home').includes(normalize(homeScreen())));
 assert.ok(depthProposal('store','photo').includes(normalize(storeScreen({images:['photo','photo'],logo:'photo',menu:true,reserve:true,wait:true,news:true,event:true}))));
 assert.match(depthProposal('home'),/review-home-depth-proposal/);
 assert.match(depthProposal('store'),/review-store-depth-proposal/);
});
