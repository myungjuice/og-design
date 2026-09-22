import test from 'node:test';import assert from 'node:assert/strict';
test('opinion submit only appears for category and nonblank title/body',async()=>{
 const {opinion}=await import('./opinion.mjs');
 for(const props of [{},{category:0,title:'제목',body:' '},{category:-1,title:'제목',body:'내용'},{category:0,title:' ',body:'내용'}])assert.ok(!opinion(props).includes('og-opinion-submit'));
 const h=opinion({category:0,title:'제목',body:'내용'});assert.ok(h.includes('og-opinion-submit'));assert.ok(!h.includes('maxlength='));assert.ok(!h.includes('200자'));assert.ok(h.includes('제목 지우기'));assert.ok(h.includes('내용 지우기'));
});
test('answers keep legacy status-dependent response and empty copy',async()=>{
 const {opinion}=await import('./opinion.mjs');
 const base={title:'문의 제목',body:'작성한 내용',status:'요청',date:'26.09.18 10:00:00',answerTitle:'답변 제목',answerBody:'답변 본문',answerDate:'26.09.19 10:00:00',photos:[]};
 const closed=opinion({tab:1,records:[base]});assert.ok(!closed.includes('작성한 내용'));assert.ok(!closed.includes('og-opinion-submit'));
 const pending=opinion({tab:1,records:[base],expanded:0});assert.ok(pending.includes('처리 중입니다.'));assert.ok(!pending.includes('답변 본문'));
 for(const status of ['확인중','완료']){const h=opinion({tab:1,records:[{...base,status}],expanded:0});assert.ok(h.includes('답변 본문'));assert.ok(!h.includes('처리 중입니다.'));}
 assert.ok(opinion({tab:1,records:[]}).includes('현재 문의 중인 내용이 없습니다.'));
});
test('unlimited textarea does not impose a new content limit, defaults stay intact',async()=>{
 const {textarea}=await import('../../components/input/render.mjs');
 assert.ok(textarea().includes('maxlength="200"'));
 const h=textarea({maxLength:null,trailingHTML:'<button>지우기</button>'});assert.ok(!h.includes('maxlength='));assert.ok(!h.includes('og-field-count'));assert.ok(h.includes('<button>지우기</button>'));
});
