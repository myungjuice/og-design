import {feedback} from '../../design-system/components/feedback/render.mjs';
import {button} from '../../design-system/components/button/render.mjs';
import {icon,uid} from '../../design-system/components/core.mjs';
const meanings={
 history:{symbol:'storefront',title:'아직 방문 내역이 없어요',body:'방문한 매장이 생기면 여기에 표시됩니다.',shape:'<path d="M4 10v11h16V10M3 10l2-7h14l2 7M3 10q2 4 4.5 0 2.3 4 4.5 0 2.3 4 4.5 0 2.5 4 4.5 0M9 21v-7h6v7"/>'},
 search:{symbol:'search',title:'검색 결과가 없어요',body:'다른 매장명이나 업종으로 검색해 보세요.',shape:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/>'},
 error:{symbol:'cloud_off',title:'불러오지 못했어요',body:'잠시 후 다시 시도해 주세요.',shape:'<path d="M7 18H6a4 4 0 0 1-1-7.9 7 7 0 0 1 13-1.5A5 5 0 0 1 18 18h-1M12 10v4M12 17v1"/>'}
};
export function renderFeedback({kind='history',title,body,id=uid('v2-feedback'),busy=false}={}){
 if(!Object.hasOwn(meanings,kind))throw new RangeError('Unsupported feedback kind: '+kind);
 const item=meanings[kind];title??=item.title;body??=item.body;
 if(!title.trim())throw new TypeError('Feedback requires a visible title');
 if(busy&&kind!=='error')throw new RangeError('Only retry feedback can be busy');
 const visual='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+item.shape+'</svg>';
 return feedback({symbol:item.symbol,title,body,state:busy?'loading':kind,busy,
  ids:{root:id,title:id+'-title',body:id+'-body'},
  action:kind==='error'?{label:busy?'처리 중…':'다시 시도',className:'v2-button',size:'regular',state:busy?'loading':'default',disabled:busy,busy,attributes:{'data-feedback-retry':true,'aria-describedby':id+'-body'}}:undefined})
  .replace('class="og-feedback"','class="og-feedback v2-feedback"')
  .replace(icon(item.symbol),visual);
}
export function renderFeedbackSamples(){
 return '<section class="v2-component-section" id="empty-feedback" aria-labelledby="empty-feedback-title" hidden><h2 id="empty-feedback-title">빈 화면·불러오기 오류</h2><p>내용이 없는 경우와 불러오지 못한 경우를 구분합니다. 작은 아이콘 받침만 입체적으로 표현하고, 안내와 다음 행동은 간결하게 보여줍니다.</p>'+
 '<div class="v2-feedback-grid">'+['history','search'].map(kind=>'<figure class="v2-component-sample"><figcaption><strong>'+(kind==='history'?'방문 내역 없음':'검색 결과 없음')+'</strong></figcaption>'+renderFeedback({kind})+'</figure>').join('')+'</div>'+
 '<div class="v2-feedback-demo" data-feedback-demo><h3>불러오기 오류 · 재시도</h3><p>실제 조회 없이 결과별 흐름을 확인합니다.</p><div class="v2-feedback-tools"><label>재시도 결과<select data-feedback-result><option value="success">내용 표시</option><option value="empty">내역 없음</option><option value="error">오류 유지</option></select></label>'+button({label:'오류 다시 보기',variant:'secondary',className:'v2-button',attributes:{'data-feedback-reset':true}})+'</div>'+
 '<div class="v2-feedback-result" data-feedback-area>'+renderFeedback({kind:'error',id:'v2-feedback-live'})+'</div><p class="v2-feedback-status" data-feedback-status role="status" aria-live="polite" aria-atomic="true"></p></div>'+
 '<ul class="v2-feedback-rules"><li>빈 상태는 오류가 아닙니다. 검색 조건과 입력은 유지하고, 의미 없는 버튼은 추가하지 않습니다.</li><li>오류 원인을 단정하지 않습니다. 재시도 중에는 버튼 위치를 유지하고 중복 실행을 막습니다.</li><li>재시도 결과는 같은 영역에 표시합니다. 화면을 가리는 확인창을 열지 않습니다.</li></ul></section>';
}
export function setupFeedbackSamples(root){
 const demo=root.querySelector('[data-feedback-demo]');if(!demo||demo.dataset.ready)return;
 demo.dataset.ready='true';
 const area=demo.querySelector('[data-feedback-area]'),result=demo.querySelector('[data-feedback-result]'),status=demo.querySelector('[data-feedback-status]');
 let timer;
 const restore=()=>{clearTimeout(timer);timer=undefined;area.innerHTML=renderFeedback({kind:'error',id:'v2-feedback-live'});};
 demo.addEventListener('click',event=>{
  if(event.target.closest('[data-feedback-reset]')){restore();status.textContent='불러오기 오류 예시를 다시 표시합니다.';return;}
  const retry=event.target.closest('[data-feedback-retry]');if(!retry||retry.disabled||timer!==undefined)return;
  const outcome=result.value,wasFocused=demo.ownerDocument.activeElement===retry;
  retry.disabled=true;retry.dataset.state='loading';retry.setAttribute('aria-busy','true');retry.textContent='처리 중…';
  const panel=retry.closest('.v2-feedback');panel.setAttribute('aria-busy','true');panel.dataset.state='loading';
  status.textContent='다시 불러오는 중입니다.';
  // Bounded preview only: no API, persistent storage or application state changes.
  timer=setTimeout(()=>{
   timer=undefined;
   const current=demo.ownerDocument.activeElement;
   const keepFocus=wasFocused&&(current===retry||current===demo.ownerDocument.body);
   if(outcome==='error'){
    retry.disabled=false;retry.dataset.state='default';retry.removeAttribute('aria-busy');retry.textContent='다시 시도';panel.setAttribute('aria-busy','false');panel.dataset.state='error';
    status.textContent='불러오지 못했어요. 다시 시도해 주세요.';
    if(keepFocus)retry.focus({preventScroll:true});
   }else{
    area.innerHTML=outcome==='empty'?renderFeedback({kind:'history',id:'v2-feedback-live'}):'<div class="v2-feedback-content"><h3 tabindex="-1">최근 방문</h3><ul><li><strong>스시샤워 반주헌</strong><span>09.24 목</span></li><li><strong>준오헤어 용산아이파크몰</strong><span>09.11 금</span></li></ul></div>';
    status.textContent=outcome==='empty'?'방문 내역이 없어요.':'방문 내역 예시를 표시했습니다.';
    if(keepFocus)area.querySelector('h3').focus({preventScroll:true});
   }
  },500);
 });
}
