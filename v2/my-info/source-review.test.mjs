import test from 'node:test';import assert from 'node:assert/strict';
const mod=()=>import('./source-review.mjs').catch(()=>({}));
test('source extraction retains nested sections and finds each root specimen once',async()=>{
 const {extractSourceScreens:f}=await mod();assert.equal(typeof f,'function');
 assert.deepEqual(f('<div><section class="og-sample" inert><section><p>첫 화면</p></section></section></div><section class="other"></section><section class="og-sample"><p>둘째</p></section>','og-sample'),['<section class="og-sample" inert><section><p>첫 화면</p></section></section>','<section class="og-sample"><p>둘째</p></section>']);
});
test('source adapter keeps values and disabled conditions but isolates service controls',async()=>{
 const {adaptSourceScreen:f}=await mod();assert.equal(typeof f,'function');
 const html=f('<section class="og-sample" inert aria-label="시안"><button class="og-button" disabled>저장</button><input value="001" disabled><textarea readonly>본문</textarea><a href="https://example.com">링크</a><div class="og-sheet-body">읽는 내용</div><span class="material-icons" aria-hidden="true">arrow_back</span></section>');
 assert.match(html,/v2-source-frame/);assert.doesNotMatch(html,/og-sample[^>]* inert|material-icons/);
 assert.match(html,/<button inert [^>]*disabled/);assert.match(html,/<input inert value="001" disabled/);assert.match(html,/<textarea inert readonly>본문/);assert.match(html,/<a inert href=/);
 assert.match(html,/og-sheet-body[^>]*tabindex="0"/);assert.match(html,/<svg /);
});
test('gallery initially keeps source specimens in templates for scoped lazy mounting',async()=>{
 const {renderSourceGallery:f}=await mod();assert.equal(typeof f,'function');
 const html=f({id:'sample',title:'제목',intro:'설명',states:[{key:'basic',label:'기본',html:'<section class="sample" inert>첫째</section>'},{key:'empty',label:'비었을 때',html:'<section class="sample" inert>둘째</section>'}],cssFiles:[]});
 assert.match(html,/<section id="sample" data-review-screen/);assert.equal((html.match(/data-source-state=/g)||[]).length,2);assert.match(html,/<details[^>]*>.*data-source-state="empty"/s);assert.equal((html.match(/<template>/g)||[]).length,2);
});
test('horizontal FAQ help cards remain a keyboard-readable region',async()=>{
 const {adaptSourceScreen:f}=await mod();
 assert.match(f('<section class="og-faq" inert><div class="og-faq-carousel"><button>도움말</button></div></section>'),/og-faq-carousel[^>]*role="region"[^>]*tabindex="0"/);
});
test('native labels cannot activate inert service controls',async()=>{
 const {adaptSourceScreen:f}=await mod();
 const html=f('<section class="og-settings" inert><label class="og-choice"><input type="checkbox">알림</label><label for="name">이름</label><input id="name"></section>');
 assert.equal((html.match(/<label inert /g)||[]).length,2);
});
test('privacy eyes retain the filled legacy Material appearance without changing other icons',async()=>{
 const {adaptSourceScreen:f}=await mod();
 for(const name of ['visibility','visibility_off']){
  const html=f('<section class="og-account" inert><button aria-label="개인정보 표시"><span class="material-icons">'+name+'</span></button></section>');
  assert.match(html,/viewBox="0 0 24 24" fill="currentColor" stroke="none"/);
  assert.match(html,new RegExp('data-source-icon="'+name+'"'));
  assert.match(html,/aria-label="개인정보 표시"/);
  assert.doesNotMatch(html,/material-icons/);
 }
 assert.match(f('<section><span class="material-icons">close</span></section>'),/fill="none" stroke="currentColor"/);
});
