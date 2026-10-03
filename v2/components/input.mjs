import {textField,passwordField} from '../../design-system/components/input/render.mjs';
import {surface} from '../../design-system/components/surfaces/render.mjs';
import {escapeHTML as e,uid} from '../../design-system/components/core.mjs';
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
const stage=body=>surface({className:'v2-input-stage',contentHTML:body});
function comparisons(type,id){
 const label=type==='password'?'비밀번호':'닉네임';
 const cases=[['default','기본',{}],['filled','입력 완료',{value:type==='password'?'test-only':'맑은 땅콩'}],['active','입력 중',{state:'active',value:type==='password'?'test':'맑은'}],['disabled','비활성',{state:'disabled',value:'검토용 값'}],['readonly','읽기 전용',{state:'readonly',value:'검토용 값'}],['loading','확인 중',{state:'loading',value:'검토용 값'}],['error','오류',{state:'error',hint:'입력값이 비어 있습니다. 검토용 값을 입력해 주세요.'}],['success','확인 완료',{state:'success',value:'검토용 값'}]];
 return stateComparison(`<p class="v2-input-note">확인 중·오류·완료는 상태 예시입니다. 실제 계정 조회나 저장은 하지 않습니다.</p><div class="v2-input-grid">${cases.map(([key,title,props])=>`<figure class="v2-component-sample" id="${id}-state-${key}"><figcaption><strong>${title}</strong></figcaption>${stage(renderInput({type,label,...props}))}</figure>`).join('')}</div>`);
}
export function renderInputSamples(){
 return `<section class="v2-component-section" id="text-input" aria-labelledby="text-input-title" hidden><h2 id="text-input-title">텍스트 입력</h2><p>입력 면은 얕게 파인 느낌으로 표현합니다. 라벨·입력값·안내 문구는 평면으로 유지합니다.</p><div id="text-input-live" data-input-live>${stage(renderInput({label:'닉네임',placeholder:'예: 맑은 땅콩',required:true,attributes:{autocomplete:'off'}}))}</div><p class="v2-input-note">입력창을 벗어난 뒤 빈 값만 안내하는 검토용 예시입니다. 실제 닉네임 규칙을 정하지 않습니다.</p>${comparisons('text','text-input')}</section>
 <section class="v2-component-section" id="password-input" aria-labelledby="password-input-title" hidden><h2 id="password-input-title">비밀번호 입력</h2><p>오른쪽 표시·숨기기로 내용을 확인합니다. 입력값과 버튼 위치는 그대로 유지합니다.</p><div id="password-input-live" data-input-live>${stage(renderInput({type:'password',label:'비밀번호',placeholder:'test-only',hint:'실제 비밀번호를 입력하지 마세요. 검토용 문자열만 사용합니다.',required:true,attributes:{autocomplete:'off',spellcheck:'false'}}))}</div>${comparisons('password','password-input')}</section>`;
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
  const field=event.target.closest('.v2-input');if(!field?.closest('[data-input-live]')||field.contains(event.relatedTarget)||field===pointerField)return;
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
}
