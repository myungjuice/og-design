import test from 'node:test';
import assert from 'node:assert/strict';
import * as components from './render.mjs';
import {textField,passwordField} from '../../design-system/components/input/render.mjs';
import {reviewGroups} from '../subnavigation.mjs';
const render=props=>{assert.equal(typeof components.renderInput,'function','shared v2 input wrapper exists');return components.renderInput(props);};
test('input renders escaped values with a persistent associated label and help',()=>{
 const html=render({id:'name-test',label:'닉네임',value:'<script>',hint:'<img>',attributes:{'aria-describedby':'external-help'}});
 assert.match(html,/<label for="name-test">닉네임<\/label>/);assert.match(html,/value="&lt;script&gt;"/);
 assert.match(html,/aria-describedby="name-test-help external-help"/);assert.match(html,/id="name-test-help"/);
 assert.doesNotMatch(html,/<script|<img/);assert.equal((html.match(/aria-describedby=/g)||[]).length,1);
});
test('password uses native hidden input and associated visibility button',()=>{
 const html=render({type:'password',label:'비밀번호',id:'password-test',value:'test-only'});
 assert.match(html,/type="password"/);assert.match(html,/aria-controls="password-test"/);assert.match(html,/aria-pressed="false"/);
 assert.match(html,/비밀번호 표시/);
});
test('disabled passwords block both editing and visibility while readonly stays copyable',()=>{
 const disabled=render({type:'password',label:'비밀번호',state:'disabled',value:'demo'});
 assert.match(disabled,/<input[^>]* disabled/);assert.match(disabled,/<button[^>]* disabled/);
 const readonly=render({label:'회원 구분',state:'readonly',value:'일반 회원'});
 assert.match(readonly,/<input[^>]* readonly/);assert.doesNotMatch(readonly,/<input[^>]* disabled/);
});
test('checking preserves editable value and cannot be overridden by custom attributes',()=>{
 const html=render({label:'닉네임',state:'loading',value:'맑은 땅콩',attributes:{'aria-busy':'false',disabled:true}});
 assert.match(html,/aria-busy="true"/);assert.match(html,/value="맑은 땅콩"/);assert.doesNotMatch(html,/<input[^>]* disabled/);
});
test('error and success have readable instructions and correct native semantics',()=>{
 assert.match(render({label:'닉네임',state:'error',hint:'닉네임이 비어 있습니다. 사용할 이름을 입력해 주세요.'}),/aria-invalid="true"/);
 assert.match(render({label:'닉네임',state:'success'}),/확인/);
 assert.doesNotMatch(render({label:'닉네임',state:'success'}),/aria-invalid="true"/);
});
test('input errors retain invalid semantics and inline instructions without an exclamation decoration',()=>{
 const html=render({label:'닉네임',state:'error',hint:'닉네임을 입력해 주세요.'});
 assert.match(html,/aria-invalid="true"/);assert.match(html,/닉네임을 입력해 주세요/);
 assert.doesNotMatch(html,/og-field-slot/);
});
test('unsupported input kinds and missing labels fail explicitly',()=>{
 assert.throws(()=>render({type:'range',label:'금액'}),RangeError);
 assert.throws(()=>render({state:'missing',label:'닉네임'}),RangeError);
 assert.throws(()=>render({label:' '}),TypeError);
});
test('home search, text and password belong to one input group with live previews',()=>{
 assert.deepEqual(reviewGroups('components').find(g=>g.id==='inputs')?.items.map(i=>i.id),['search','text-input','password-input','phone-input','numeric-input','multiline-input']);
 const html=components.renderComponents();assert.match(html,/id="text-input-live"/);assert.match(html,/id="password-input-live"/);
 assert.match(html,/실제 비밀번호/);
});
test('legacy text and password default markup remains unchanged',()=>{
 assert.equal(textField({id:'legacy',label:'닉네임',value:'맑은 땅콩',hint:'안내'}),'<div class="og-field "><label for="legacy">닉네임</label><div class="og-field-control"><input id="legacy" type="text" value="맑은 땅콩" placeholder="" aria-describedby="legacy-help"></div><p id="legacy-help" class="og-field-help">안내</p></div>');
 assert.equal(passwordField({id:'legacy-pass',label:'비밀번호'}),'<div class="og-field "><label for="legacy-pass">비밀번호</label><div class="og-field-control"><input id="legacy-pass" type="password" value="" placeholder="" aria-describedby="legacy-pass-help" class="og-password-input"><button type="button" class="og-password-toggle" id="legacy-pass-toggle" aria-label="비밀번호 표시" aria-pressed="false" aria-controls="legacy-pass">표시</button></div><p id="legacy-pass-help" class="og-field-help"></p></div>');
});
