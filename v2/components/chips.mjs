import {chip,radioChip} from '../../design-system/components/tabs-chips/render.mjs';
import {button} from '../../design-system/components/button/render.mjs';
import {escapeHTML as e,attributes as attrs,uid} from '../../design-system/components/core.mjs';
import {renderLoading} from './loading.mjs';
import {stateComparison} from './catalog.mjs';
const states=['default','active','disabled','loading','error','success'];
const mark=(cross=false)=>'<svg class="v2-chip-mark '+(cross?'v2-chip-cross':'v2-chip-check')+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="'+(cross?'m6 6 12 12M18 6 6 18':'m5 12 4 4 10-10')+'"/></svg>';
const validLabel=label=>{if(typeof label!=='string'||!label.trim())throw new TypeError('Chip requires a visible label');};
const validState=state=>{if(!states.includes(state))throw new RangeError('Unsupported chip state');};
export function renderChip({label='한식',selected=false,disabled=false,state='default',removable=false,attributes={}}={}){
 validLabel(label);validState(state);
 const values={...attributes,disabled:disabled||['disabled','loading'].includes(state),'aria-pressed':removable?undefined:String(selected),'data-state':state,'data-chip-remove':removable?true:undefined,'data-chip-toggle':removable?undefined:true,
  'aria-label':removable?label+' 필터 해제':label,'aria-busy':state==='loading'?'true':undefined};
 const markup=chip({label,selected,disabled:disabled||['disabled','loading'].includes(state),className:'v2-chip'+(removable?' v2-chip-removal':''),attributes:values})
  .replace('>'+e(label)+'</button>',()=>'>'+(!removable?mark():'')+'<span class="v2-chip-label">'+e(label)+'</span>'+(removable?mark(true):'')+'</button>');
 return removable?markup.replace(/ aria-pressed="[^"]*"/,''):markup;
}
export function renderChipGroup({id=uid('v2-chips'),type='multiple',label='관심 업종',items=['한식','중식','일식'],selected=type==='single'?[0]:[],max=null,state='default'}={}){
 validLabel(label);validState(state);
 if(!['single','multiple','remove'].includes(type))throw new RangeError('Unsupported chip group');
 if(!Array.isArray(items)||!items.length)throw new TypeError('Chip group needs choices');
 const values=items.map(item=>{const data=typeof item==='string'?{label:item}:item;validLabel(data?.label);return {label:data.label,disabled:Boolean(data.disabled)};});
 if(!Array.isArray(selected)||new Set(selected).size!==selected.length||selected.some(i=>!Number.isInteger(i)||i<0||i>=values.length))throw new RangeError('Invalid chip selection');
 if(type==='single'&&selected.length!==1)throw new RangeError('Single choice needs one selection');
 if(type==='remove'&&selected.length)throw new RangeError('Removal chips do not take a selection');
 if(max!==null&&(!Number.isInteger(max)||max<1||type!=='multiple'||selected.length>max))throw new RangeError('Invalid chip limit');
 const unavailable=['disabled','loading'].includes(state);
 if(!unavailable&&selected.some(i=>values[i].disabled))throw new RangeError('Selected choice must be available');
 const controls=values.map((item,index)=>{
  if(type!=='single')return renderChip({label:item.label,selected:selected.includes(index),removable:type==='remove',state,disabled:item.disabled,attributes:{'data-chip-index':index}});
  return radioChip({id:id+'-'+index,label:item.label,name:id,checked:selected.includes(index)})
   .replace('class="og-chip-radio"','class="og-chip-radio v2-chip-radio"')
   .replace(/<input[^>]*>/,tag=>tag.slice(0,-1)+attrs({value:index,disabled:unavailable||item.disabled,'data-state':state})+'>')
   .replace('<span>'+e(item.label)+'</span>',()=>'<span class="v2-chip">'+mark()+'<span class="v2-chip-label">'+e(item.label)+'</span></span>');
 }).join('');
 const message=state==='error'?'선택을 적용하지 못했습니다. 이전 선택을 확인한 뒤 다시 선택해 주세요.':state==='success'?'선택 결과를 표시했습니다.':state==='disabled'?'현재 선택을 변경할 수 없는 예시입니다.':'';
 return '<div class="v2-chip-widget"'+attrs({id,'data-v2-chips':type,'data-chip-max':max,'data-state':state,'aria-busy':state==='loading'?'true':undefined})+'><p class="v2-chip-group-label" id="'+e(id)+'-label">'+e(label)+'</p>'+
 '<div class="v2-chip-rail"'+attrs({role:type==='single'?'radiogroup':'group','aria-labelledby':id+'-label','aria-describedby':id+'-hint'})+'>'+controls+'</div>'+
 '<p class="v2-chip-hint" id="'+e(id)+'-hint">'+(type==='single'?'하나를 선택합니다.':type==='remove'?'×를 누르면 해당 필터를 해제합니다.':max?'최대 '+max+'개까지 선택할 수 있습니다.':'여러 항목을 선택할 수 있습니다.')+'</p>'+
 (type==='remove'?button({label:'필터 예시 복원',variant:'secondary',className:'v2-button v2-chip-reset',disabled:unavailable,attributes:{'data-chip-reset':true}}):'')+
 '<div class="v2-chip-message"'+attrs({'data-chip-message':true,'data-tone':state,role:'status','aria-live':'polite','aria-atomic':'true'})+'>'+(state==='loading'?renderLoading({label:'선택 적용 중',size:'small'}):e(message))+'</div></div>';
}
const stage=(content,inert=false)=>'<div class="v2-chip-stage"'+attrs({inert})+'>'+content+'</div>';
const sample=(title,note,props)=>'<figure class="v2-component-sample"><figcaption><strong>'+e(title)+'</strong><span>'+e(note)+'</span></figcaption>'+stage(renderChipGroup(props),true)+'</figure>';
const choices=['한식','중식','일식','양식','카페·디저트'];
export function renderChipSamples(){
 const section=(id,title,note,html,comparison='')=>'<section class="v2-component-section" id="'+id+'" aria-labelledby="'+id+'-title" hidden><h2 id="'+id+'-title">'+title+'</h2><p>'+note+'</p>'+html+(comparison?stateComparison('<div class="v2-chip-grid">'+comparison+'</div>'):'')+'</section>';
 const examples=[['active','누르는 중','선택 여부는 유지하고 면만 얕게 눌립니다.'],['disabled','비활성','기존 선택을 유지한 채 변경을 막습니다.'],['loading','적용 중','이름과 선택은 유지하고 아래에서 진행을 안내합니다.'],['error','적용 실패','선택 여부와 오류 안내를 구분합니다.'],['success','적용 완료','선택 결과는 유지하며 성공 장식을 반복하지 않습니다.']];
 return section('chip-single','단일 선택 칩','기간·내역 종류처럼 하나만 고릅니다. 홈 카테고리의 밝은 면과 보라색 선택 재질을 공유하고 체크로 선택을 구분합니다.',stage(renderChipGroup({id:'v2-chip-single',type:'single',label:'내역 종류',items:['전체','적립','사용',{label:'직접 선택',disabled:true}]})))+
 section('chip-multiple','복수 선택 칩','관심 업종처럼 여러 항목을 고릅니다. 아래 3개 제한은 기존 캔버스의 검토 예시이며 모든 칩에 적용되는 정책은 아닙니다.',stage(renderChipGroup({id:'v2-chip-multiple',items:choices,max:3,selected:[0,2]})),
 [[],[0,2],[0,1,2]].map(selected=>sample('선택 '+selected.length+'개','선택 개수와 관계없이 각 칩의 크기는 같습니다.',{items:choices,max:3,selected})).join('')+examples.map(([state,title,note])=>sample(title,note,{items:choices,max:3,selected:[0,2],state})).join(''))+
 section('chip-filters','적용된 필터','선택을 바꾸는 체크 칩과 구분해 ×를 표시합니다. 하나씩 해제하며 필터 이름 전체가 터치 영역입니다.',stage(renderChipGroup({id:'v2-chip-filters',type:'remove',label:'적용된 필터',items:['한식','영업 중','망원동']}))+
 '<p class="v2-chip-review-note">선택·필터 해제는 이 검토 화면에서만 바뀌며 실제 매장 조회나 관심 업종 저장은 하지 않습니다.</p>');
}
export function setupChips(root){
 for(const widget of root.querySelectorAll('[data-v2-chips]')){
  if(widget.dataset.chipsReady||widget.closest('[inert]'))continue;widget.dataset.chipsReady='true';
  const rail=widget.querySelector(':scope > .v2-chip-rail'),message=widget.querySelector(':scope > [data-chip-message]'),initial=rail.innerHTML;
  const own=target=>target.closest('[data-v2-chips]')===widget;
  const feedback=(text,error=false)=>{message.textContent=text;message.dataset.tone=error?'error':'default';};
  widget.addEventListener('change',event=>{
   const input=event.target;if(!own(input)||!input.matches('input[type="radio"]')||input.disabled||!input.checked)return;
   feedback(input.nextElementSibling.textContent+' 선택');
  });
  widget.addEventListener('click',event=>{
   const control=event.target.closest('button');if(!control||!own(control)||control.disabled)return;
   if(control.hasAttribute('data-chip-reset')){rail.innerHTML=initial;feedback('필터 예시를 복원했습니다.');return;}
   if(control.hasAttribute('data-chip-remove')){
    const buttons=[...rail.querySelectorAll(':scope > button')],index=buttons.indexOf(control),label=control.querySelector('.v2-chip-label').textContent;
    if(index<0)return;control.remove();
    const next=buttons.slice(index+1).find(button=>!button.disabled)||buttons.slice(0,index).reverse().find(button=>!button.disabled)||widget.querySelector('[data-chip-reset]');
    next?.focus({preventScroll:true});feedback(label+' 필터 해제'+(rail.children.length?'':' · 적용된 필터가 없습니다.'));return;
   }
   if(!control.hasAttribute('data-chip-toggle')||control.parentElement!==rail)return;
   const selected=control.getAttribute('aria-pressed')==='true',count=rail.querySelectorAll(':scope > button[aria-pressed="true"]').length,max=Number(widget.dataset.chipMax)||Infinity;
   if(!selected&&count>=max){feedback('최대 '+max+'개까지 선택할 수 있습니다. 선택한 항목을 해제한 뒤 다시 선택해 주세요.',true);return;}
   control.setAttribute('aria-pressed',String(!selected));feedback('선택 '+(count+(selected?-1:1))+'개');
  });
 }
}
