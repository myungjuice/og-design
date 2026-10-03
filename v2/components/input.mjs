import {textField,passwordField,textarea} from '../../design-system/components/input/render.mjs';
import {surface} from '../../design-system/components/surfaces/render.mjs';
import {escapeHTML as e,attributes as attrs,uid} from '../../design-system/components/core.mjs';
import {stateComparison} from './catalog.mjs';
const states=['default','active','filled','disabled','readonly','loading','error','success'];
const hints={disabled:'이전 단계 완료 후 입력할 수 있습니다.',readonly:'조회·복사는 가능하고 수정은 할 수 없습니다.',loading:'입력값 확인 중입니다. 내용을 수정할 수 있습니다.',error:'입력 내용을 확인해 주세요. 오류 상태의 예시입니다.',success:'입력값 확인 완료 · 검토용 예시입니다.'};
export function renderInput({id=uid('v2-input'),type='text',label='',value='',placeholder='',hint,state='default',disabled=false,readonly=false,required=false,attributes={}}={}){
 if(!['text','password'].includes(type))throw new RangeError('Unsupported input type: '+type);
 if(!states.includes(state))throw new RangeError('Unsupported input state: '+state);
 if(!label.trim())throw new TypeError('Input requires a visible label');
 const unavailable=disabled||state==='disabled',readOnly=readonly||state==='readonly';
 const {'aria-describedby':helpReferences,...extra}=attributes;
 const options={id,type,label,value,placeholder,hint:hint??hints[state]??'입력 내용을 확인합니다. 실제 설정은 변경하지 않습니다.',state,
  className:'v2-input v2-input-'+type,helpReferences,
  attributes:{...extra,disabled:unavailable,readonly:readOnly,required,'aria-required':required?'true':undefined,'aria-invalid':state==='error'?'true':'false','aria-busy':state==='loading'?'true':undefined},
  helpAttributes:{'aria-live':'polite','aria-atomic':'true'},
  slot:type==='text'?({error:'!',loading:'…',success:'✓'}[state]||''):'',
  toggleAttributes:{disabled:unavailable}};
 return type==='password'?passwordField(options):textField(options);
}
export function renderMultiline({id=uid('v2-multiline'),label='',value='',placeholder='',hint,state='default',maxLength=null,disabled=false,readonly=false,required=false,attributes={}}={}){
 if(!label.trim())throw new TypeError('Multiline input requires a visible label');
 if(!states.includes(state))throw new RangeError('Unsupported input state: '+state);
 if(maxLength!==null&&(!Number.isSafeInteger(maxLength)||maxLength<0))throw new RangeError('Invalid multiline limit');
 const {'aria-describedby':helpReferences,id:ignoredId,...extra}=attributes;
 const unavailable=disabled||state==='disabled',readOnly=readonly||state==='readonly';
 const help=hint??hints[state]??(maxLength===null?'내용을 여러 줄로 작성할 수 있습니다.':'최대 '+maxLength+'자 · 검토용 제한 예시입니다.');
 const fieldHTML=textarea({id,label,value,placeholder,hint:help,maxLength,
  attributes:{...extra,maxlength:maxLength??undefined,'aria-describedby':id+'-help'+(maxLength!==null?' '+id+'-count':'')+(helpReferences?' '+helpReferences:''),
   disabled:unavailable,readonly:readOnly,required,'aria-required':required?'true':undefined,'aria-invalid':state==='error'?'true':'false','aria-busy':state==='loading'?'true':undefined}});
 // HTML parsing discards one newline immediately after a textarea opening tag.
 // Add a sacrificial newline in this wrapper without changing the legacy renderer.
 return `<div class="v2-input v2-input-textarea"${attrs({'data-state':state})}>${fieldHTML.replace(/<textarea\b[^>]*>/,'$&\n')}</div>`;
}
const stage=body=>surface({className:'v2-input-stage',contentHTML:body});
function comparisons(type,id){
 const label=type==='password'?'비밀번호':'닉네임';
 const cases=[['default','기본',{}],['filled','입력 완료',{value:type==='password'?'test-only':'맑은 땅콩'}],['active','입력 중',{state:'active',value:type==='password'?'test':'맑은'}],['disabled','비활성',{state:'disabled',value:'검토용 값'}],['readonly','읽기 전용',{state:'readonly',value:'검토용 값'}],['loading','확인 중',{state:'loading',value:'검토용 값'}],['error','오류',{state:'error',hint:'입력값이 비어 있습니다. 검토용 값을 입력해 주세요.'}],['success','확인 완료',{state:'success',value:'검토용 값'}]];
 return stateComparison(`<p class="v2-input-note">확인 중·오류·완료는 상태 예시입니다. 실제 계정 조회나 저장은 하지 않습니다.</p><div class="v2-input-grid">${cases.map(([key,title,props])=>`<figure class="v2-component-sample" id="${id}-state-${key}"><figcaption><strong>${title}</strong></figcaption>${stage(renderInput({type,label,...props}))}</figure>`).join('')}</div>`);
}
export function renderInputSamples(){
 return `<section class="v2-component-section" id="text-input" aria-labelledby="text-input-title" hidden><h2 id="text-input-title">텍스트 입력</h2><p>홈 검색바와 같은 연한 하늘색·둥근 표면·부드러운 입체 마감을 사용합니다. 항목명과 안내 문구는 입력창 밖에 표시합니다.</p><div id="text-input-live" data-input-live>${stage(renderInput({label:'닉네임',placeholder:'예: 맑은 땅콩',required:true,attributes:{autocomplete:'off'}}))}</div><p class="v2-input-note">입력창을 벗어난 뒤 빈 값만 안내하는 검토용 예시입니다. 실제 닉네임 규칙을 정하지 않습니다.</p>${comparisons('text','text-input')}</section>
 <section class="v2-component-section" id="password-input" aria-labelledby="password-input-title" hidden><h2 id="password-input-title">비밀번호 입력</h2><p>오른쪽 표시·숨기기로 내용을 확인합니다. 입력값과 버튼 위치는 그대로 유지합니다.</p><div id="password-input-live" data-input-live>${stage(renderInput({type:'password',label:'비밀번호',placeholder:'test-only',hint:'실제 비밀번호를 입력하지 마세요. 검토용 문자열만 사용합니다.',required:true,attributes:{autocomplete:'off',spellcheck:'false'}}))}</div>${comparisons('password','password-input')}</section>
 <section class="v2-component-section" id="multiline-input" aria-labelledby="multiline-input-title" hidden><h2 id="multiline-input-title">여러 줄 입력</h2><p>기존 입력의 밝은 표면과 얕은 입체감을 유지합니다. 긴 내용은 둥근 사각형 안에, 안내와 글자 수는 입력창 아래에 표시합니다.</p>
 <div class="v2-input-grid"><figure class="v2-component-sample"><figcaption><strong>기본 · 제한 없음</strong></figcaption><div id="multiline-input-live" data-multiline-live>${stage(renderMultiline({label:'내용',placeholder:'예: 적립 내역이 보이지 않아요.',required:true,hint:'실제 개인정보 없이 검토용 내용을 입력해 주세요.'}))}</div></figure>
 <figure class="v2-component-sample"><figcaption><strong>글자 수 안내 · 선택형</strong></figcaption><div id="multiline-limit-live" data-multiline-live>${stage(renderMultiline({label:'내용',maxLength:200,placeholder:'예: 적립 내역이 보이지 않아요.'}))}</div></figure></div>
 <p class="v2-input-note">200자는 공통 컴포넌트의 제한형 예시일 뿐, 문의 화면의 정책이 아닙니다. 현재 문의 화면은 제한·카운터 없이 유지합니다. 제한형은 브라우저 maxlength 기준으로 세며 이모지 등은 2자 이상으로 계산될 수 있습니다.</p>
 ${stateComparison(`<div class="v2-input-grid">${[['filled','입력 완료'],['active','누르는 중'],['disabled','비활성'],['readonly','읽기 전용'],['loading','확인 중'],['error','오류'],['success','확인 완료']].map(([state,title])=>`<figure class="v2-component-sample" id="multiline-state-${state}"><figcaption><strong>${title}</strong></figcaption>${stage(renderMultiline({label:'내용',state,value:state==='error'?'':'검토용 내용입니다.\n두 번째 줄도 이어서 작성합니다.',hint:state==='error'?'내용이 비어 있습니다. 검토용 내용을 입력해 주세요.':undefined}))}</figure>`).join('')}</div>`)}
 </section>`;
}
export function setupInputSamples(root){
 let pointerField=null;
 const validate=field=>{
  const input=field.querySelector('input'),help=field.querySelector('.og-field-help');
  const invalid=input.required&&!input.value.trim();
  input.setAttribute('aria-invalid',String(invalid));field.dataset.state=invalid?'error':'default';
  help.textContent=invalid?'입력값이 비어 있습니다. 검토용 값을 입력해 주세요.':field.dataset.baseHint;
 };
 root.querySelectorAll('.v2-input').forEach(field=>{field.dataset.baseHint=field.querySelector('.og-field-help').textContent;});
 root.addEventListener('pointerdown',event=>{
  const button=event.target.closest('.v2-input .og-password-toggle');
  pointerField=button&&!button.disabled?button.closest('.v2-input'):null;
  if(pointerField&&pointerField.querySelector('input')===root.ownerDocument.activeElement)event.preventDefault();
 });
 for(const eventName of ['pointerup','pointercancel'])root.ownerDocument.addEventListener(eventName,()=>{pointerField=null;});
 root.addEventListener('click',event=>{
  const button=event.target.closest('.v2-input .og-password-toggle');if(!button||button.disabled)return;
  pointerField=null;
  const input=button.closest('.v2-input').querySelector('input'),visible=input.type==='password';
  input.type=visible?'text':'password';button.setAttribute('aria-pressed',String(visible));button.setAttribute('aria-label','비밀번호 '+(visible?'숨기기':'표시'));button.textContent=visible?'숨기기':'표시';
 });
 root.addEventListener('focusout',event=>{
  const field=event.target.closest('.v2-input:not(.v2-input-textarea)');if(!field?.closest('[data-input-live]')||field.contains(event.relatedTarget)||field===pointerField)return;
  field.dataset.touched='true';validate(field);
 });
 root.addEventListener('input',event=>{
  const input=event.target;if(!input.matches('.v2-input input'))return;
  const field=input.closest('.v2-input');
  if(input.disabled||input.readOnly)return;
  if(field.closest('[data-input-live]')){if(field.dataset.touched==='true')validate(field);return;}
  if(['loading','error','success'].includes(field.dataset.state)){
   field.dataset.state='default';input.removeAttribute('aria-busy');input.setAttribute('aria-invalid','false');
   field.querySelector('.og-field-help').textContent='입력 내용을 변경했습니다. 실제 설정은 저장하지 않습니다.';
   const slot=field.querySelector('.og-field-slot');if(slot)slot.textContent='';
  }
 });
 setupMultilineSamples(root);
}
function setupMultilineSamples(root){
 const updateCount=input=>{
  const count=input.closest('.v2-input-textarea').querySelector('.og-field-count');
  if(count)count.textContent=input.value.length+' / '+input.maxLength;
 };
 const validate=field=>{
  const input=field.querySelector('textarea');
  if(input.disabled||input.readOnly)return;
  const empty=input.required&&!input.value.trim(),tooLong=input.maxLength>=0&&input.value.length>input.maxLength;
  input.setAttribute('aria-invalid',String(empty||tooLong));field.dataset.state=empty||tooLong?'error':'default';
  field.querySelector('.og-field-help').textContent=empty?'내용이 비어 있습니다. 검토용 내용을 입력해 주세요.':tooLong?'제한된 글자 수를 넘었습니다. 내용을 줄여 주세요.':field.dataset.baseHint;
 };
 const changed=input=>{
  const field=input.closest('.v2-input-textarea');if(input.disabled||input.readOnly)return;
  updateCount(input);if(field.dataset.composing==='true')return;
  input.removeAttribute('aria-busy');
  if(field.closest('[data-multiline-live]')){if(field.dataset.touched==='true')validate(field);return;}
  if(['loading','error','success'].includes(field.dataset.state)){
   field.dataset.state='default';input.setAttribute('aria-invalid','false');
   field.querySelector('.og-field-help').textContent='내용을 변경했습니다. 실제 문의는 보내지 않습니다.';
  }
 };
 root.querySelectorAll('.v2-input-textarea').forEach(field=>{
  const help=field.querySelector('.og-field-help');help.setAttribute('aria-live','polite');help.setAttribute('aria-atomic','true');
  updateCount(field.querySelector('textarea'));
 });
 root.addEventListener('compositionstart',event=>{if(event.target.matches('.v2-input-textarea textarea'))event.target.closest('.v2-input-textarea').dataset.composing='true';});
 root.addEventListener('compositionend',event=>{if(!event.target.matches('.v2-input-textarea textarea'))return;delete event.target.closest('.v2-input-textarea').dataset.composing;changed(event.target);});
 root.addEventListener('input',event=>{if(event.target.matches('.v2-input-textarea textarea'))changed(event.target);});
 root.addEventListener('focusout',event=>{
  const field=event.target.closest('.v2-input-textarea');
  if(!field?.closest('[data-multiline-live]')||field.contains(event.relatedTarget))return;
  field.dataset.touched='true';if(field.dataset.composing!=='true')validate(field);
 });
}
