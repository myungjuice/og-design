import test from 'node:test';
import assert from 'node:assert/strict';
import {renderWorkspace} from '../render.mjs';
import {renderHomeNewStoresReview} from './new-stores.mjs';
import {renderHomeLandmarkReview} from './landmarks.mjs';

const templates=(html,kind)=>[...html.matchAll(new RegExp(`<template data-gasong-map="(${kind}-[^\"]+)">([\\s\\S]*?)<\\/template>`,'g'))];
test('new-store review shows only the two requested light-mode feedback options',()=>{
 const html=renderWorkspace({pageId:'home'});
 const specimens=templates(html,'new');
 assert.deepEqual(specimens.map(m=>m[1]),['new-sprout','new-n']);
 for(const [,name,markup] of specimens){
  assert.doesNotMatch(markup,/data-home-theme="dark"/);
  assert.equal((markup.match(/class="home-store-label"/g)||[]).length,3);
  assert.match(markup,/pins\/on\//);assert.match(markup,/pins\/off\//);
  if(name==='new-n'){
   assert.equal((markup.match(/class="gasong-new-n"/g)||[]).length,2);
   assert.doesNotMatch(markup,/class="home-new-badge"|data-home-new-mark="sprout"/);
  }
 }
 assert.match(specimens[0][2],/gasong-centered-sprout/);
 const section=renderHomeNewStoresReview();
 assert.equal((section.match(/<template/g)||[]).length,2);
 assert.doesNotMatch(section,/data-home-theme="dark"|home-new-theme|home-new-variant|환영 리본|등장 핀|이전 NEW 배지/);
});
test('landmark review shows only worn crown and gold pins in light mode',()=>{
 const html=renderWorkspace({pageId:'home'}),specimens=templates(html,'best');
 assert.deepEqual(specimens.map(m=>m[1]),['best-crown','best-gold']);
 for(const [,name,markup] of specimens){
  assert.doesNotMatch(markup,/data-home-theme="dark"/);
  assert.match(markup,/랜드마크 매장/);
  if(name==='best-gold'){
   assert.equal((markup.match(/data-feedback-gold="true"/g)||[]).length,2);
   assert.doesNotMatch(markup,/class="home-landmark-part/,'gold pins have no added topper');
  }
 }
 assert.match(specimens[0][2],/gasong-worn-crown/);
 const section=renderHomeLandmarkReview();
 assert.equal((section.match(/<template/g)||[]).length,2);
 assert.doesNotMatch(section,/data-home-theme="dark"|data-home-landmark-combined|data-home-landmark="(?:medal|laurel|castle)"|훈장|월계관|성탑/);
});
