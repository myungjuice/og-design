import {dialog} from '../../design-system/components/dialog/render.mjs';
import {button} from '../../design-system/components/button/render.mjs';
import {escapeHTML as e,attributes as attrs,uid} from '../../design-system/components/core.mjs';

export function renderDialog({id=uid('v2-dialog'),title='',body='',actions=[{label:'확인'}],modal=false}={}){
 if(!title.trim())throw new TypeError('Dialog requires a visible title');
 if(!Array.isArray(actions)||actions.length<1||actions.length>2)throw new RangeError('Dialog requires one or two actions');
 const mapped=actions.map(({label='',variant='primary',result=variant==='secondary'?'cancel':'confirm'})=>{
  if(!label.trim()||typeof result!=='string'||!result.trim())throw new TypeError('Dialog actions require a label and result');
  if(!['primary','secondary','danger'].includes(variant))throw new RangeError('Unsupported dialog action variant');
  return {label,variant,className:'v2-button',attributes:{'data-dialog-result':result}};
 });
 const panel=dialog({title,body,actions:mapped})
  .replace('class="og-dialog-panel"','class="og-dialog-panel v2-dialog-panel"')
  .replace('<h3 class="og-dialog-title">','<h3 class="og-dialog-title"'+attrs({id:id+'-title',tabindex:'-1'})+'>')
  .replace('<p class="og-dialog-body">','<p class="og-dialog-body"'+attrs({id:id+'-body'})+'>');
 return modal?'<dialog class="v2-dialog"'+attrs({id,'aria-labelledby':id+'-title','aria-describedby':id+'-body'})+'>'+panel+'</dialog>'
  :'<div class="v2-dialog-static"'+attrs({id,inert:true})+'>'+panel+'</div>';
}
const cases=[
 {key:'notice',name:'안내',title:'알림을 켜 주세요',body:'새 소식을 받으려면 기기 설정에서 알림을 허용해 주세요.',actions:[{label:'확인'}]},
 {key:'confirm',name:'일반 확인',title:'작성을 그만두시겠어요?',body:'작성 중인 내용은 저장되지 않습니다.',actions:[{label:'계속 작성',variant:'secondary'},{label:'나가기'}]},
 {key:'delete',name:'삭제 확인',title:'리뷰를 삭제하시겠어요?',body:'삭제한 리뷰는 다시 복구할 수 없습니다.',actions:[{label:'취소',variant:'secondary'},{label:'삭제',variant:'danger'}]}
];
export function renderDialogSamples(){
 return '<section class="v2-component-section" id="dialogs" aria-labelledby="dialogs-title" hidden><h2 id="dialogs-title">확인창</h2><p>짧은 안내나 중요한 선택을 화면 중앙에서 보여줍니다. 흰 표면에 얕은 입체감을 주고, 제목과 본문은 담백하게 유지합니다.</p><div class="v2-dialog-grid">'+cases.map(item=>
  '<figure class="v2-component-sample"><figcaption><strong>'+e(item.name)+'</strong></figcaption><div class="v2-dialog-stage">'+renderDialog({...item,id:'dialog-static-'+item.key})+'</div>'+
  button({label:item.name+' 열어보기',variant:'secondary',className:'v2-button',attributes:{'data-dialog-open':'v2-dialog-'+item.key}})+'</figure>').join('')+
 '</div><p class="v2-dialog-note">확인창은 중요한 선택이 필요할 때만 사용합니다. 버튼은 최대 두 개로 구성합니다. 주요 행동은 Fill, 취소는 Line으로 구분하고 삭제 여부는 제목과 버튼명으로 명확하게 안내합니다.</p><p id="dialog-feedback" class="v2-dialog-note" role="status" aria-live="polite">열어보기에서 동작을 확인할 수 있습니다. 실제 설정 변경이나 삭제는 하지 않습니다.</p>'+cases.map(item=>renderDialog({...item,id:'v2-dialog-'+item.key,modal:true})).join('')+'</section>';
}
export function setupDialogSamples(root){
 const dialogs=new Map();
 root.querySelectorAll('dialog.v2-dialog').forEach(modal=>{
  let opener=null,previousOverflow=null;
  const finish=(label='')=>{
   if(previousOverflow===null)return;
   root.ownerDocument.body.style.overflow=previousOverflow;previousOverflow=null;
   const status=root.querySelector('#dialog-feedback');if(status)status.textContent=(label?label+' 동작을 확인했습니다.':'확인창을 닫았습니다.')+' 실제 설정 변경이나 삭제는 하지 않습니다.';
   if(opener?.isConnected)opener.focus({preventScroll:true});opener=null;
  };
  const close=(result,label='')=>{modal.close(result);finish(label);};
  const outside=event=>{const r=modal.getBoundingClientRect();return event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom;};
  let backdropStart=false;
  dialogs.set(modal.id,trigger=>{
   if(modal.open)return;
   opener=trigger;modal.returnValue='';previousOverflow=root.ownerDocument.body.style.overflow;
   root.ownerDocument.body.style.overflow='hidden';modal.showModal();
   const initial=modal.scrollHeight>modal.clientHeight?modal.querySelector('.og-dialog-title')
    :modal.querySelector('[data-dialog-result="cancel"]')||modal.querySelector('button');
   modal.scrollTop=0;initial?.focus({preventScroll:true});
  });
  modal.addEventListener('pointerdown',event=>{backdropStart=event.target===modal&&outside(event);});
  modal.addEventListener('click',event=>{
   const action=event.target.closest('[data-dialog-result]');
   if(action&&modal.contains(action)&&!action.disabled)close(action.dataset.dialogResult,action.textContent);
   else if(backdropStart&&event.target===modal&&outside(event))close('cancel');
   backdropStart=false;
  });
  modal.addEventListener('cancel',event=>{event.preventDefault();close('cancel');});
  modal.addEventListener('keydown',event=>{
   if(event.key!=='Tab')return;
   const items=[...modal.querySelectorAll('button:not(:disabled)')].filter(n=>n.getClientRects().length),first=items[0],last=items.at(-1);
   if(!first)return;
   const active=root.ownerDocument.activeElement;
   if(event.shiftKey&&(active===first||!items.includes(active))){event.preventDefault();last.focus();}
   else if(!event.shiftKey&&(active===last||!items.includes(active))){event.preventDefault();first.focus();}
  });
  modal.addEventListener('close',()=>{if(!modal.open)finish();});
 });
 root.addEventListener('click',event=>{
  const trigger=event.target.closest('[data-dialog-open]');if(trigger&&!trigger.disabled)dialogs.get(trigger.dataset.dialogOpen)?.(trigger);
 });
}
