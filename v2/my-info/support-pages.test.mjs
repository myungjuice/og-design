import test from 'node:test';
import assert from 'node:assert/strict';

const module=()=>import('./support-pages.mjs').catch(()=>({}));
const ids=['support','faq','opinion','customer-center','policies','policy-detail'];
async function review(){
 const {renderSupportPagesReview,setupSupportPagesReview}=await module();
 assert.equal(typeof renderSupportPagesReview,'function','support domain renders its approved source galleries');
 assert.equal(typeof setupSupportPagesReview,'function','support domain mounts static galleries');
 return renderSupportPagesReview();
}
const gallery=(html,id)=>html.split('<section id="'+id+'"')[1]?.split('<section id="')[0]||'';
const screens=html=>[...html.matchAll(/<template>([\s\S]*?)<\/template>/g)].map(match=>match[1]);

test('support domain retains original states plus permissions in six independent galleries',async()=>{
 const html=await review();
 for(const [id,count] of [['support',5],['faq',4],['opinion',7],['customer-center',1],['policies',2],['policy-detail',2]]){
  const body=gallery(html,id);
  assert.ok(body,id+' has a review section');
  assert.equal(screens(body).length,count,id+' source board states are retained');
  if(count>1)assert.match(body,/<details\b/,'secondary states are disclosed');
  assert.doesNotMatch(body,/<details\b[^>]*\bopen(?:\s|>|=)/,'comparisons begin folded');
 }
 assert.equal(screens(html).length,21);
});

test('support retains guest menu visibility, inquiry count and original contact confirmation',async()=>{
 const specimens=screens(gallery(await review(),'support'));
 assert.equal(specimens.length,5);
 const [basic,notification,guest,confirm]=specimens;
 for(const name of ['자주 묻는 질문','1:1 문의하기','의견보내기','고객 센터','약관 및 정책','접근 권한 안내'])assert.ok(basic.includes(name));
 assert.doesNotMatch(guest,/1:1 문의하기|의견보내기/);
 assert.match(guest,/접근 권한 안내/);
 assert.doesNotMatch(basic,/og-support-notification/);
 assert.match(notification,/1:1 문의 알림 1건/);
 assert.doesNotMatch(guest,/og-support-notification|og-support-overlay/);
 for(const specimen of specimens){assert.match(specimen,/02-6949-2587/);assert.match(specimen,/운영시간 —/);}
 assert.match(confirm,/카카오톡 앱으로 이동하시겠습니까\?/);
 assert.match(confirm,/카카오 채널/);
 assert.match(confirm,/og-support-overlay/);
});

test('FAQ source answers appear only for their selected best or category state',async()=>{
 const [basic,best,category,answer]=screens(gallery(await review(),'faq'));
 assert.match(basic,/자주 찾는 질문 제목 4/);
 assert.doesNotMatch(basic,/선택한 도움말의 답변 내용|선택한 분류의 질문 제목/);
 assert.match(best,/선택한 도움말의 답변 내용입니다\./);
 assert.doesNotMatch(best,/선택한 분류의 질문 제목/);
 assert.match(category,/선택한 분류의 질문 제목 3/);
 assert.doesNotMatch(category,/질문에 대한 답변 내용입니다\./);
 assert.match(answer,/질문에 대한 답변 내용입니다\./);
 assert.doesNotMatch(answer,/선택한 도움말의 답변 내용입니다\./);
 assert.match(answer,/aria-expanded="true"/);
});

test('opinion keeps unlimited content, conditional submit, attachments and status-dependent answers',async()=>{
 const specimens=screens(gallery(await review(),'opinion'));
 const [empty,filled,photos,records,answered,processing,noRecords]=specimens;
 assert.doesNotMatch(empty,/og-opinion-submit/);
 assert.match(filled,/og-opinion-submit/);
 assert.match(filled,/제목 지우기/);
 assert.match(filled,/내용 지우기/);
 for(const specimen of specimens)assert.doesNotMatch(specimen,/maxlength=|og-field-count|200자/);
 assert.match(empty,/첨부파일은 최대 2개, 10MB까지 등록 가능합니다\./);
 assert.equal((photos.match(/class="[^"]*og-attachment-item/g)||[]).length,2,'photo state actually contains both attachments');
 assert.doesNotMatch(records,/og-opinion-answer/);
 assert.match(answered,/등록된 답변 내용이 표시되는 영역입니다\./);
 assert.match(answered,/26\.09\.17 11:00:00/);
 assert.doesNotMatch(answered,/처리 중입니다\./);
 assert.match(processing,/처리 중입니다\./);
 assert.match(processing,/문의하신 내용이 정상적으로 접수되었습니다\./);
 assert.doesNotMatch(processing,/등록된 답변 내용이 표시되는 영역입니다\./);
 assert.match(noRecords,/현재 문의 중인 내용이 없습니다\./);
 assert.doesNotMatch(noRecords,/og-opinion-record-heading|og-opinion-submit/);
 for(const text of ['고객의 소리 민원 처리를 위해','관계 법령에 저촉되거나','공정거래위원회에서 고사한 소비자분쟁해결기준'])assert.ok(empty.includes(text),'source notice is retained');
});

test('customer center and policy documents preserve authored specimens without invented data',async()=>{
 const html=await review(),customer=screens(gallery(html,'customer-center'))[0];
 for(const text of ['(주)제비그룹','김도현','123-86-50879','서울특별시 성동구 왕십리로 58, 3층 310호(성수동1가, FORHU)','02-6949-2587','jbgroup0501@gmail.com','위치 지도 배치 예시'])assert.ok(customer.includes(text));
 const [basic,long]=screens(gallery(html,'policies'));
 assert.match(basic,/약관 문서 제목/);
 assert.match(long,/문서 제목이 길어 두 줄 이상으로 이어지는 경우의 표시 예시/);
 const [document,longDocument]=screens(gallery(html,'policy-detail'));
 assert.match(document,/문서 본문이 표시되는 영역입니다\./);
 assert.equal((longDocument.match(/<h3>본문 소제목 \d<\/h3>/g)||[]).length,8,'nested document sections are not truncated');
 assert.match(longDocument,/문서 제목이 길어 여러 줄로 이어지는 경우의 표시 예시/);
});

test('source service controls are individually inert while reading screens remain available',async()=>{
 const html=await review();
 for(const id of ids)for(const screen of screens(gallery(html,id))){
  for(const control of screen.matchAll(/<(?:button|input|textarea|select|a)\b[^>]*>/g))assert.match(control[0],/\binert(?:\s|>|=)/,id+' service control is inert');
  assert.doesNotMatch(screen,/<section[^>]*class="[^"]*(?:og-faq|og-opinion|og-customer-center|og-policies|og-policy-detail|og-support)\b[^"]*"[^>]*\binert(?:\s|>|=)/,id+' reading frame is not inert');
 }
 assert.match(gallery(html,'policy-detail'),/<article class="og-policy-document[^"]*"[^>]*tabindex="0"/,'the actual document scroll region can be reached by keyboard');
 assert.match(gallery(html,'opinion'),/<div class="og-opinion-scroll[^"]*"[^>]*tabindex="0"/,'the actual opinion scroll region can be reached by keyboard');
});
