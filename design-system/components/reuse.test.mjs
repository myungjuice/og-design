import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
const entry = new URL('./index.mjs', import.meta.url);
test('shared renderers work without a canvas DOM', async () => {
  assert.ok(existsSync(entry), 'public component entry must exist');
  const ui = await import(entry);
  assert.match(ui.button({label:'저장'}), /class="og-button/);
  assert.match(ui.button({label:'<script>alert(1)</script>'}), /&lt;script&gt;/);
  const a=ui.textField({label:'이름'}), b=ui.textField({label:'이름'});
  const id=a.match(/<input id="([^"]+)"/)[1];
  assert.match(a,new RegExp('for="'+id+'"'));
  assert.notEqual(id,b.match(/<input id="([^"]+)"/)[1]);
  assert.match(ui.textField({label:'이름',value:'"><img src=x>'}), /&quot;&gt;&lt;img/);
  assert.match(ui.textarea({label:'내용',value:'<b>안내</b>'}), /&lt;b&gt;/);
  assert.match(ui.checkbox({label:'동의',checked:true}), /checked/);
  assert.match(ui.radio({label:'선택',name:'group'}), /type="radio"/);
  assert.match(ui.toggle({label:'알림',checked:true}), /role="switch"/);
});
test('composites reuse button markup and quantity expresses bounds itself',async()=>{
  assert.ok(existsSync(entry),'public component entry must exist');
  const ui=await import(entry);
  const action=ui.button({label:'확인',variant:'primary'});
  assert.ok(ui.dialog({title:'안내',body:'본문',actions:[{label:'확인',variant:'primary'}]}).includes(action));
  const min=ui.quantity({value:1,min:1,max:5});
  assert.match(min, /data-quantity-minus[^>]*disabled/);
  const max=ui.quantity({value:5,min:1,max:5});
  assert.match(max, /data-quantity-plus[^>]*disabled/);
  assert.throws(()=>ui.quantity({value:6,min:1,max:5}),RangeError);
});

test('content primitives render caller data and guard progress bounds',async()=>{
 const ui=await import(entry);
 assert.equal(typeof ui.badge,'function');
 assert.match(ui.badge({label:'<NEW>'}), /&lt;NEW&gt;/);
 assert.match(ui.listRow({title:'회원점',description:'서울',value:'1,000 M',interactive:false}), /<div class="og-list-row/);
 assert.match(ui.sectionHeading({title:'최근 방문',action:'전체 보기'}), /og-text-button og-heading-action/);
 assert.match(ui.surface({contentHTML:'<p>본문</p>'}), /<p>본문<\/p>/);
 assert.match(ui.progress({value:40,label:'진행 중'}), /aria-valuenow="40"/);
 assert.throws(()=>ui.progress({value:150}),RangeError);
 assert.match(ui.notice({title:'<안내>',body:'설명',tone:'info'}), /&lt;안내&gt;/);
 assert.match(ui.snackbar({message:'저장했습니다.',action:'실행 취소'}), /og-snackbar-action/);
});

test('media, navigation and overlays render without any specimen DOM',async()=>{
 const ui=await import(entry);
 assert.equal(typeof ui.avatar,'function');
 assert.match(ui.avatar({size:'large'}), /data-size="large"/);
 assert.match(ui.thumbnail({src:'store.png',alt:'회원점'}), /src="store.png"/);
 assert.match(ui.loading({label:'처리 중'}), /role="status"/);
 assert.match(ui.tabs({id:'a',items:['전체','사용'],selected:1}), /id="a-tab-1"[^>]*aria-selected="true"/);
 assert.match(ui.chip({label:'카페',selected:true}), /aria-pressed="true"/);
 assert.match(ui.searchField({id:'find',label:'검색',value:'커피'}), /value="커피"/);
 assert.match(ui.tooltip({message:'<설명>'}), /&lt;설명&gt;/);
 assert.match(ui.popover({title:'안내',body:'본문'}), /og-popover-header/);
 assert.match(ui.bottomSheet({title:'정렬',bodyHTML:'<p>최신순</p>',action:'적용'}), /og-sheet-panel/);
 assert.match(ui.calendar({year:2024,month:2,selected:29}), /2월 29일/);
 assert.doesNotMatch(ui.calendar({year:2024,month:2}), /2월 30일/);
 assert.match(ui.timePicker({period:'오후',hour:'02',minute:'15',selected:true}), /오후 02:15/);
 assert.match(ui.attachments({src:'x.png',state:'ready'}), /og-attachment-remove/);
 assert.match(ui.imageViewer({src:'x.png',mode:'error'}), /불러오지 못했습니다/);
});

test('passwords and loading states do not rely on canvas postprocessing',async()=>{
 const ui=await import(entry);
 assert.equal(typeof ui.passwordField,'function');
 assert.match(ui.passwordField({id:'pass',value:'123',visible:true}),/type="text"/);
 assert.match(ui.passwordField({id:'pass',value:'123',visible:false}),/type="password"/);
 assert.match(ui.loadingRow({busy:false}),/data-skeleton[^>]*hidden/);
 assert.equal(typeof ui.mileage,'function');
 assert.match(ui.mileage({available:15000,total:16000,max:20000}),/--progress-held:5%/);
 assert.throws(()=>ui.mileage({available:17000,total:16000,max:20000}),RangeError);
});

test('ARIA and data booleans remain values; native booleans stay presence attributes',async()=>{
 const {attributes}=await import('./core.mjs');
 assert.equal(attributes({'aria-invalid':true,'aria-pressed':false,'data-open':false,disabled:true,checked:false}),' aria-invalid="true" aria-pressed="false" data-open="false" disabled');
 const {textField}=await import(entry);
 assert.match(textField({attributes:{'aria-invalid':true}}),/aria-invalid="true"/);
});
