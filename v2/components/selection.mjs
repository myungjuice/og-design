import {choice,toggle} from '../../design-system/components/selection/render.mjs';
import {surface,divider} from '../../design-system/components/surfaces/render.mjs';
import {escapeHTML as e,uid} from '../../design-system/components/core.mjs';
import {stateComparison} from './catalog.mjs';
const kinds=['checkbox','radio','switch'];
const states=['default','active','disabled','loading','error','success'];
const messages={disabled:'현재 변경할 수 없는 항목입니다.',loading:'설정을 저장하는 중입니다.',error:'설정을 저장하지 못했습니다. 다시 선택해 주세요.',success:'설정을 저장했습니다.'};
const mark='<span class="v2-selection-mark" aria-hidden="true"></span>';

export function renderSelection({kind='checkbox',label='',description='',checked=false,disabled=false,partial=false,state='default',name='',attributes={}}={}){
 if(!kinds.includes(kind))throw new RangeError('Unsupported selection kind: '+kind);
 if(!states.includes(state))throw new RangeError('Unsupported selection state: '+state);
 if(partial&&kind!=='checkbox')throw new RangeError('Only checkboxes support partial selection');
 if(!label.trim())throw new TypeError('Selection requires a visible label');
 const descriptionId=description?uid('v2-selection-description'):undefined;
 const unavailable=disabled||['disabled','loading'].includes(state);
 const message=messages[state]||(disabled&&!description?messages.disabled:'');
 const resultId=message?uid('v2-selection-result'):undefined;
 const describedBy=[attributes['aria-describedby'],descriptionId,resultId].filter(Boolean).join(' ')||undefined;
 const options={label,description,descriptionId,checked:partial?false:checked,disabled:unavailable,
  className:'v2-selection v2-selection-'+kind,controlHTML:mark,name,
  attributes:{...attributes,...(kind==='switch'&&name?{name}:{}),checked:partial?false:checked,disabled:unavailable,'data-state':state,'data-indeterminate':partial?'true':undefined,'aria-describedby':describedBy,'aria-busy':state==='loading'?'true':undefined}};
 return `<div class="v2-selection-control">${kind==='switch'?toggle(options):choice({...options,type:kind})}${message?`<p class="v2-selection-result" id="${resultId}" data-state="${disabled&&state==='default'?'disabled':state}">${e(message)}</p>`:''}</div>`;
}
const stage=(body,id='')=>surface({className:'v2-selection-stage',attributes:{id:id||undefined},contentHTML:body});
const figure=(id,label,options)=>`<figure class="v2-component-sample" id="${id}"><figcaption><strong>${e(label)}</strong></figcaption>${stage(renderSelection(options))}</figure>`;
function comparison(kind){
 const label=kind==='switch'?'소식 알림':'선택 항목';
 const items=[['default','미선택',{}],['selected','선택',{checked:true}],...(kind==='checkbox'?[['partial','부분 선택',{partial:true}]]:[]),
  ['active','누르는 중',{state:'active',checked:true}],['disabled','비활성·미선택',{state:'disabled'}],['disabled-on','비활성·선택',{state:'disabled',checked:true}],
  ['loading','처리 중',{state:'loading',checked:true}],['error','저장 오류',{state:'error',checked:true}],['success','저장 완료',{state:'success',checked:true}]];
 return stateComparison(`<p class="v2-selection-note">선택 여부와 저장 결과는 별개입니다. 처리 중·오류·완료는 예시이며 실제 저장은 하지 않습니다.</p><div class="v2-selection-grid">${items.map(([id,title,options])=>figure(kind+'-state-'+id,title,{kind,label,name:uid('v2-state-radio'),...options})).join('')}</div>`);
}
export function renderSelectionSamples(){
 const checkboxBody=`<fieldset class="v2-selection-group"><legend>관심 소식 · 복수 선택</legend>${renderSelection({label:'전체 선택',attributes:{'data-selection-all':true}})}${divider()}
 ${['이벤트 소식','마일리지 소식','서비스 소식'].map(label=>renderSelection({label,attributes:{'data-selection-child':true}})).join('')}
 ${renderSelection({label:'준비 중인 소식',disabled:true,description:'아직 선택할 수 없는 항목입니다.'})}</fieldset>`;
 const name=uid('v2-channel');
 const radioBody=`<fieldset class="v2-selection-group"><legend>안내 수단 · 단일 선택</legend>${renderSelection({kind:'radio',name,label:'앱 알림',checked:true})}${renderSelection({kind:'radio',name,label:'이메일'})}${renderSelection({kind:'radio',name,label:'문자',disabled:true,description:'현재 선택할 수 없는 항목입니다.'})}</fieldset>`;
 const switchBody=renderSelection({kind:'switch',label:'소식 알림',description:'검토 화면에서 켜고 끄기를 확인합니다.'})+divider()+renderSelection({kind:'switch',label:'변경할 수 없는 설정',checked:true,disabled:true});
 return `<section class="v2-component-section" id="checkbox" aria-labelledby="checkbox-title" hidden><h2 id="checkbox-title">체크박스</h2><p>여러 항목을 독립적으로 선택합니다. 사각형에 얕은 입체감을 주고 체크·부분 선택 표시는 평면으로 유지합니다.</p>${stage(checkboxBody,'checkbox-live')}<p id="checkbox-feedback" class="v2-selection-feedback" role="status" aria-live="polite">0 / 3개 선택 · 실제 수신 설정은 변경하지 않습니다.</p>${comparison('checkbox')}</section>
 <section class="v2-component-section" id="radio" aria-labelledby="radio-title" hidden><h2 id="radio-title">라디오</h2><p>같은 그룹에서는 하나만 선택합니다. 바깥 원은 얕게 표현하고 선택된 중앙 점에만 입체감을 줍니다.</p>${stage(radioBody,'radio-live')}<p id="radio-feedback" class="v2-selection-feedback" role="status" aria-live="polite">앱 알림 선택 · 실제 수신 설정은 변경하지 않습니다.</p>${comparison('radio')}</section>
 <section class="v2-component-section" id="switch" aria-labelledby="switch-title" hidden><h2 id="switch-title">토글·스위치</h2><p>트랙은 살짝 파인 느낌, 흰 손잡이는 둥글게 솟은 느낌으로 표현합니다. 켜짐은 오른쪽, 꺼짐은 왼쪽입니다.</p>${stage(switchBody,'switch-live')}<p id="switch-feedback" class="v2-selection-feedback" role="status" aria-live="polite">소식 알림 꺼짐 · 실제 설정은 저장하지 않습니다.</p>${comparison('switch')}</section>`;
}
export function setupSelectionSamples(root){
 root.querySelectorAll('.v2-selection input[data-indeterminate="true"]').forEach(input=>{input.indeterminate=true;});
 const checkGroup=root.querySelector('#checkbox-live');
 const all=checkGroup.querySelector('[data-selection-all]');
 const children=[...checkGroup.querySelectorAll('[data-selection-child]:not(:disabled)')];
 const sync=()=>{
  const count=children.filter(input=>input.checked).length;
  all.checked=count===children.length;all.indeterminate=count>0&&count<children.length;
  root.querySelector('#checkbox-feedback').textContent=`${count} / ${children.length}개 선택 · 실제 수신 설정은 변경하지 않습니다.`;
 };
 sync();
 checkGroup.addEventListener('change',event=>{
  if(event.target===all)children.forEach(input=>{input.checked=all.checked;});
  sync();
 });
 root.addEventListener('change',event=>{
  const input=event.target;
  if(!input.matches('.v2-selection input'))return;
  if(input.closest('#radio-live'))root.querySelector('#radio-feedback').textContent=input.closest('label').querySelector('.og-choice-copy').textContent+' 선택 · 실제 수신 설정은 변경하지 않습니다.';
  if(input.closest('#switch-live'))root.querySelector('#switch-feedback').textContent='소식 알림 '+(input.checked?'켜짐':'꺼짐')+' · 실제 설정은 저장하지 않습니다.';
  const control=input.closest('.v2-selection-control'),result=control.querySelector('.v2-selection-result');
  if(result&&['error','success'].includes(input.dataset.state)){
   input.dataset.state='default';result.textContent='선택을 변경했습니다. 실제 설정은 저장하지 않습니다.';result.dataset.state='default';
  }
 });
}
