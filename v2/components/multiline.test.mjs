import test from 'node:test';
import assert from 'node:assert/strict';
import * as multiline from './input.mjs';
import {textarea} from '../../design-system/components/input/render.mjs';
import {opinion} from '../../design-system/pages/my-info/opinion.mjs';
const render=props=>{assert.equal(typeof multiline.renderMultiline,'function','v2 multiline wrapper exists');return multiline.renderMultiline(props);};
test('multiline defaults to no limit or counter and escapes user content',()=>{
 const html=render({id:'message',label:'내용',value:'<script> & 내용',hint:'<img>'});
 assert.match(html,/<label for="message">내용<\/label>/);
 assert.match(html,/&lt;script&gt; &amp; 내용/);assert.doesNotMatch(html,/<script|<img|maxlength=|og-field-count/);
 assert.match(html,/aria-describedby="message-help"/);
});
test('optional limit associates a count using the same units as native maxlength',()=>{
 const html=render({id:'limited',label:'내용',maxLength:200,value:'가😊',attributes:{'aria-describedby':'extra-help',maxlength:1}});
 assert.match(html,/maxlength="200"/);assert.match(html,/3 \/ 200/);
 assert.match(html,/aria-describedby="limited-help limited-count extra-help"/);
 assert.equal((html.match(/aria-describedby=/g)||[]).length,1);
});
test('disabled and readonly preserve values while checking remains editable',()=>{
 for(const state of ['disabled','readonly']){
  const html=render({label:'내용',state,value:'유지할 내용'});
  assert.match(html,new RegExp('<textarea[^>]* '+(state==='readonly'?'readonly':'disabled')));
  assert.match(html,/유지할 내용/);
 }
 const html=render({label:'내용',state:'loading',attributes:{disabled:true,'aria-busy':'false'}});
 assert.match(html,/aria-busy="true"/);assert.doesNotMatch(html,/<textarea[^>]* disabled/);
});
test('multiline requires labels and rejects unsupported states and limits',()=>{
 assert.throws(()=>render({label:' '}),TypeError);
 assert.throws(()=>render({label:'내용',state:'oops'}),RangeError);
 for(const maxLength of [-1,1.5,Infinity,'200'])assert.throws(()=>render({label:'내용',maxLength}),RangeError);
});
test('legacy textarea and actual opinion keep their existing counter policy',()=>{
 const html=textarea({id:'legacy',label:'내용',value:'abc'});
 assert.match(html,/maxlength="200"/);assert.match(html,/3 \/ 200/);
 assert.doesNotMatch(opinion(),/maxlength=|og-field-count/);
});
