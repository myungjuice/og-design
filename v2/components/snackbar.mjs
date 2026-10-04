import {snackbar} from '../../design-system/components/snackbar/render.mjs';
import {attributes as attrs,escapeHTML as e,uid} from '../../design-system/components/core.mjs';
import {stateComparison} from './catalog.mjs';

export function renderSnackbar({message='',action='',state='default',live=false,id=uid('v2-snackbar')}={}){
 if(!message.trim())throw new TypeError('Snackbar requires a visible message');
 if(!['default','disabled','loading','error','success'].includes(state))throw new RangeError('Unsupported snackbar state');
 const disabled=state==='disabled'||state==='loading',messageId=id+'-message';
 return snackbar({message,action})
  .replace('class="og-snackbar"','class="og-snackbar v2-snackbar"'+attrs({id,'data-state':state,role:live?'status':undefined,'aria-atomic':live?'true':undefined}))
  .replace('class="og-snackbar-message"','class="og-snackbar-message"'+attrs({id:messageId}))
  .replace('class="og-snackbar-action"','class="og-snackbar-action"'+attrs({disabled,'aria-busy':state==='loading'?'true':undefined,'aria-describedby':messageId}));
}
const examples={
 saved:{label:'완료 안내',message:'저장했습니다.',state:'success',note:'결과가 화면에 바로 드러나지 않을 때 짧게 안내합니다.'},
 undo:{label:'실행 취소',message:'즐겨찾기에서 해제했습니다.',action:'실행 취소',note:'되돌릴 수 있는 동작에는 실행 취소를 함께 제공합니다.'},
 retry:{label:'재시도 안내',message:'저장하지 못했습니다.',action:'다시 시도',state:'error',note:'중요한 오류는 관련 본문에도 유지합니다. 입력 오류는 해당 입력란 아래에 표시합니다.'}
};
const sample=(kind,props)=>'<figure class="v2-component-sample" data-snackbar-example="'+kind+'"><figcaption><strong>'+e(props.label)+'</strong><span>'+e(props.note)+'</span></figcaption><div class="v2-snackbar-stage" inert>'+renderSnackbar(props)+'</div></figure>';
export function renderSnackbarSamples(){
 return '<section class="v2-component-section" id="snackbar" aria-labelledby="snackbar-title" hidden><h2 id="snackbar-title">토스트·스낵바</h2><p>방금 한 동작의 결과를 짧게 알려줍니다. 짙은 표면과 흰 글자로 구분하고, 표면 가장자리에만 얕은 입체감을 줍니다.</p><div class="v2-snackbar-grid">'+Object.entries(examples).map(([kind,props])=>sample(kind,props)).join('')+'</div>'+
 stateComparison('<div class="v2-snackbar-grid">'+sample('pending',{label:'처리 중',note:'동작 버튼의 문구를 남겨둔 채 중복 실행을 막습니다.',message:'다시 시도하고 있습니다.',action:'다시 시도',state:'loading'})+sample('disabled',{label:'비활성',note:'동작을 실행할 수 없는 이유를 메시지로 함께 안내합니다.',message:'연결을 확인한 뒤 다시 시도해 주세요.',action:'다시 시도',state:'disabled'})+'</div>')+
 '<div class="v2-snackbar-demo"><h3>열어보기</h3><p>검토용 동작입니다. 자동으로 닫지 않으며 실제 저장·즐겨찾기 변경·재조회는 하지 않습니다.</p><div class="v2-snackbar-tools"><label>안내 유형<select data-snackbar-kind>'+Object.entries(examples).map(([kind,p])=>'<option value="'+kind+'">'+e(p.label)+'</option>').join('')+'</select></label><button type="button" class="v2-snackbar-tool" data-snackbar-show>알림 열기</button><button type="button" class="v2-snackbar-tool" data-snackbar-close disabled>알림 닫기</button></div><div class="v2-snackbar-preview"><p>알림은 이 영역 하단에 표시됩니다.</p><div class="v2-snackbar-host" data-snackbar-host></div></div><p class="v2-snackbar-announcement" data-snackbar-announcement role="status" aria-live="polite" aria-atomic="true"></p></div>'+
 '<ul class="v2-snackbar-rules"><li>한 번에 하나만 표시하고 같은 안내를 중복해서 쌓지 않습니다.</li><li>하단 메뉴·고정 버튼·키보드 위에 배치하고 화면 가장자리와 16px 이상 띄웁니다.</li><li>긴 문장은 줄바꿈하며, 공간이 부족하면 동작 버튼을 다음 줄로 내립니다.</li><li>실제 앱에서는 단순 결과만 자동으로 닫을 수 있습니다. 동작 버튼이 있거나 시간이 더 필요한 사용자는 충분히 읽고 조작할 수 있어야 합니다.</li><li>포커스를 강제로 가져가지 않습니다. 중요한 경고는 스낵바만으로 전달하지 않습니다.</li></ul></section>';
}

export function setupSnackbarSamples(root){
 const section=root.querySelector('#snackbar'),show=section?.querySelector('[data-snackbar-show]');
 if(!show||show.dataset.ready)return;show.dataset.ready='true';
 const select=section.querySelector('[data-snackbar-kind]'),close=section.querySelector('[data-snackbar-close]'),host=section.querySelector('[data-snackbar-host]'),status=section.querySelector('[data-snackbar-announcement]');
 let current='';
 show.addEventListener('click',()=>{
  const kind=select.value,props=examples[kind];
  if(!props||current===kind)return;
  host.innerHTML=renderSnackbar(props);current=kind;close.disabled=false;status.textContent=props.message;
 });
 host.addEventListener('click',event=>{
  const action=event.target.closest('.og-snackbar-action');
  if(!action||action.disabled)return;
  const focused=host.contains(document.activeElement),message=current==='undo'?'실행 취소 동작 예시입니다.':'다시 시도 동작 예시입니다.';
  host.innerHTML=renderSnackbar({message});current+='-done';status.textContent=message;
  if(focused)show.focus({preventScroll:true});
 });
 close.addEventListener('click',()=>{
  const focused=host.contains(document.activeElement)||document.activeElement===close;
  host.replaceChildren();current='';close.disabled=true;status.textContent='알림을 닫았습니다.';
  if(focused)show.focus({preventScroll:true});
 });
}
