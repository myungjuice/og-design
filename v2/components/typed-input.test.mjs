import test from 'node:test';
import assert from 'node:assert/strict';
import * as input from './input.mjs';
import * as components from './render.mjs';
import {reviewGroups} from '../subnavigation.mjs';
test('phone uses the common input with a tel keyboard without reformatting or truncating its value',()=>{
 assert.equal(typeof components.renderPhoneInput,'function');
 const html=components.renderPhoneInput({id:'phone-test',value:'010 0000-0000',attributes:{inputmode:'text',type:'number'}});
 assert.match(html,/<label for="phone-test">휴대전화 번호<\/label>/);
 assert.match(html,/og-field v2-input v2-input-tel/);assert.match(html,/type="tel"/);assert.match(html,/inputmode="tel"/);
 assert.match(html,/value="010 0000-0000"/);assert.doesNotMatch(html,/maxlength=|type="number"/);
 assert.match(html,/aria-describedby="phone-test-help"/);
});
test('numeric input preserves leading zeros and arbitrarily long integers rather than coercing to Number',()=>{
 assert.equal(typeof components.renderNumericInput,'function');
 const html=components.renderNumericInput({value:'00090071992547409931234567890'});
 assert.match(html,/type="text"/);assert.match(html,/inputmode="numeric"/);
 assert.match(html,/value="00090071992547409931234567890"/);assert.doesNotMatch(html,/type="number"|maxlength=|max=/);
});
test('typed validation distinguishes empty, format and incomplete input without changing strings',()=>{
 assert.equal(typeof input.inputValidationMessage,'function');
 const validate=input.inputValidationMessage;
 for(const kind of ['phone','numeric']){
  assert.equal(validate({kind,value:'',required:false}),'');
  assert.match(validate({kind,value:' ',required:true}),/비어.*입력/);
 }
 for(const value of ['010-0000-0000','010 000 0000','01000000000'])assert.equal(validate({kind:'phone',value}),'');
 for(const value of ['010','010000000000','010-ABCD-0000','01000000000x','01000000000\n'])assert.notEqual(validate({kind:'phone',value}),'');
 for(const value of ['0','000123','90071992547409931234567890'])assert.equal(validate({kind:'numeric',value}),'');
 for(const value of ['-1','1.5','1e3','12가','1,000','100\n'])assert.notEqual(validate({kind:'numeric',value}),'');
 assert.equal(validate({kind:'text',value:'맑은 땅콩'}),'');
});
test('phone and numeric live specimens and state comparisons are reachable in the existing input group',()=>{
 const group=reviewGroups('components').find(g=>g.id==='inputs').items.map(i=>i.id);
 assert.ok(group.includes('phone-input'));assert.ok(group.includes('numeric-input'));
 const html=components.renderComponents();
 for(const kind of ['phone','numeric']){
  assert.match(html,new RegExp('id="'+kind+'-input-live"'));
  for(const state of ['default','filled','active','disabled','readonly','loading','error','success'])assert.match(html,new RegExp('id="'+kind+'-input-state-'+state+'"'));
 }
});
