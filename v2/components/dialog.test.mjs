import test from 'node:test';
import assert from 'node:assert/strict';
import * as components from './render.mjs';
import {dialog} from '../../design-system/components/dialog/render.mjs';
const render=props=>{assert.equal(typeof components.renderDialog,'function','shared v2 dialog exists');return components.renderDialog(props);};
test('native dialog associates escaped title and body and safe explicit actions',()=>{
 const html=render({id:'confirm-demo',modal:true,title:'<script>확인',body:'<img> & 내용',actions:[{label:'계속 작성',variant:'secondary',result:'cancel'},{label:'나가기',variant:'primary',result:'confirm'}]});
 assert.match(html,/<dialog[^>]*id="confirm-demo"[^>]*aria-labelledby="confirm-demo-title"[^>]*aria-describedby="confirm-demo-body"/);
 assert.match(html,/id="confirm-demo-title"/);assert.match(html,/id="confirm-demo-body"/);
 assert.match(html,/&lt;script&gt;확인/);assert.match(html,/&lt;img&gt; &amp; 내용/);assert.doesNotMatch(html,/<script|<img/);
 assert.match(html,/class="og-button v2-button" data-variant="secondary"/);
 assert.match(html,/data-dialog-result="cancel"/);assert.match(html,/data-dialog-result="confirm"/);
});
test('static dialog previews are inert and destructive actions retain their semantic variant',()=>{
 const html=render({title:'리뷰를 삭제하시겠어요?',body:'다시 복구할 수 없습니다.',actions:[{label:'취소',variant:'secondary',result:'cancel'},{label:'삭제',variant:'danger',result:'confirm'}]});
 assert.match(html,/<div[^>]*class="v2-dialog-static"[^>]* inert/);assert.doesNotMatch(html,/<dialog/);
 assert.match(html,/data-variant="danger"/);assert.match(html,/>삭제<\/button>/);
});
test('dialog rejects unnamed titles, ambiguous actions and unsupported variants',()=>{
 assert.throws(()=>render({title:' '}),TypeError);
 for(const actions of [[],[{label:'확인'},{label:'취소'},{label:'다음'}]])assert.throws(()=>render({title:'안내',actions}),RangeError);
 assert.throws(()=>render({title:'안내',actions:[{label:' ',result:'confirm'}]}),TypeError);
 assert.throws(()=>render({title:'안내',actions:[{label:'확인',variant:'weird'}]}),RangeError);
});
test('legacy dialog still renders the original panel and buttons',()=>{
 const html=dialog({title:'안내',body:'본문',actions:[{label:'확인'}]});
 assert.match(html,/class="og-dialog-panel"/);assert.doesNotMatch(html,/v2-dialog|v2-button|data-dialog-result/);
});
