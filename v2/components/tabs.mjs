import {tabs,tabPanel,segment} from '../../design-system/components/tabs-chips/render.mjs';
import {escapeHTML as e,attributes as attrs,uid} from '../../design-system/components/core.mjs';
import {renderLoading} from './loading.mjs';
import {renderFeedback} from './feedback.mjs';
import {stateComparison} from './catalog.mjs';
const states=['default','active','disabled','loading','error','success','empty'];
function choices(items,selected,label,state,maximum=Infinity){
 if(typeof label!=='string'||!label.trim())throw new TypeError('A visible selection label is required');
 if(!Array.isArray(items)||items.length<2||items.length>maximum)throw new RangeError('Unsupported choice count');
 if(!Number.isInteger(selected)||selected<0||selected>=items.length)throw new RangeError('Selected index is outside the choices');
 if(!states.includes(state))throw new RangeError('Unsupported content state');
 return items.map(item=>{
  const value=typeof item==='string'?{label:item}:item;
  if(!value||typeof value.label!=='string'||!value.label.trim())throw new TypeError('Each choice needs a visible label');
  return {label:value.label,disabled:Boolean(value.disabled)};
 });
}
// Content slots are trusted component markup, never user-authored HTML.
const result=(state,content)=>state==='loading'?renderLoading({label:'내역을 불러오는 중'}):state==='error'?renderFeedback({kind:'error'}):state==='empty'?renderFeedback({kind:'history'}):content;
export function renderTabs({id=uid('v2-tabs'),label='마일리지 내역',items=['전체','적립','사용'],selected=0,disabled=false,state='default',panels}={}){
 const values=choices(items,selected,label,state),unavailable=disabled||state==='disabled';
 if(!unavailable&&values[selected].disabled)throw new RangeError('The selected tab must be available');
 if(panels!==undefined&&(!Array.isArray(panels)||panels.length!==values.length||panels.some(x=>typeof x!=='string')))throw new TypeError('Every tab needs one content slot');
 return '<div class="v2-tabs-widget" data-v2-tabs data-state="'+e(state)+'">'+tabs({id,label,selected,className:'v2-tabs',items:values.map(item=>({...item,disabled:unavailable||item.disabled}))})+
 values.map((item,index)=>tabPanel({id,index,selected,className:'v2-tabs-panel',contentHTML:result(state,panels?.[index]??'<p>'+e(item.label)+' 내역을 표시하는 영역입니다.</p>')}).replace('role="tabpanel"','role="tabpanel"'+attrs({'aria-busy':state==='loading'?'true':undefined}))).join('')+'</div>';
}
export function renderSegment({id=uid('v2-segment'),label='정렬 기준',items=['최근순','금액순'],selected=0,disabled=false,state='default'}={}){
 const values=choices(items,selected,label,state,3),unavailable=disabled||state==='disabled';
 if(!unavailable&&values[selected].disabled)throw new RangeError('The selected segment must be available');
 let index=0;
 const controls=segment({id,name:id,labelledBy:id+'-label',items:values,selected})
  .replace('class="og-segment"','class="og-segment v2-segment"')
  .replace(/<input[^>]*>/g,tag=>{const current=index++;return tag.slice(0,-1)+attrs({value:current,disabled:unavailable||values[current].disabled})+'>';});
 return '<div class="v2-segment-widget" data-v2-segment data-state="'+e(state)+'"><p class="v2-segment-label" id="'+e(id)+'-label">'+e(label)+'</p>'+controls+
 '<div class="v2-segment-result"'+attrs({'aria-busy':state==='loading'?'true':undefined})+'>'+result(state,'<p data-segment-result>'+e(values[selected].label)+' 선택</p>')+'</div><p class="v2-switch-status" data-segment-feedback role="status" aria-live="polite" aria-atomic="true"></p></div>';
}
const stage=(html,inert=false)=>'<div class="v2-tabs-stage"'+attrs({inert})+'>'+html+'</div>';
const sample=(title,note,html)=>'<figure class="v2-component-sample"><figcaption><strong>'+e(title)+'</strong><span>'+e(note)+'</span></figcaption>'+stage(html,true)+'</figure>';
const results=[['active','누르는 중','선택은 유지하고 누른 면만 얕게 표현합니다.'],['disabled','비활성','현재 변경할 수 없는 선택 예시입니다.'],['loading','내용 불러오는 중','선택 이름은 유지하고 연결된 내용 영역에서 안내합니다.'],['error','불러오기 오류','선택을 잃지 않고 결과 영역에서 다시 시도를 안내합니다.'],['empty','내역 없음','빈 결과는 오류와 구분합니다.'],['success','내용 표시 · 완료','내용 자체로 완료를 보여주며 성공 장식은 반복하지 않습니다.']];
export function renderTabsSamples(){
 return '<section class="v2-component-section" id="tabs" aria-labelledby="tabs-title" hidden><h2 id="tabs-title">탭</h2><p>내용 영역을 전환합니다. 보라색 글자와 하단 선으로 선택을 구분하고 탭마다 3D 받침을 반복하지 않습니다.</p>'+stage(renderTabs({id:'v2-history-tabs',items:['전체','적립','사용',{label:'직접 선택',disabled:true}]}))+
 '<p class="v2-switch-note">아래 내용은 검토용 예시이며 실제 내역을 조회하지 않습니다.</p>'+stateComparison('<div class="v2-tabs-grid">'+results.map(([state,title,note])=>sample(title,note,renderTabs({items:['전체','적립','사용'],selected:1,state}))).join('')+'</div>')+
 '<ul class="v2-switch-rules"><li>선택은 색상과 2px 하단 선으로 구분합니다. 탭 높이는 48px이며 긴 탭 목록은 가로로 이동합니다.</li><li>웹 검토에서는 좌우 방향키·Home·End로 이동하고, 비활성 탭은 건너뜁니다. 즉시 표시할 수 있는 예시 내용은 선택과 함께 전환됩니다.</li><li>로딩·오류·빈 결과는 연결된 내용 영역에서 안내합니다. 실제 비동기 화면의 선택·재시도 정책은 화면 작업에서 연결합니다.</li></ul></section>'+
 '<section class="v2-component-section" id="segmented" aria-labelledby="segmented-title" hidden><h2 id="segmented-title">분할 선택</h2><p>같은 데이터의 보기 방식이나 정렬 기준을 고릅니다. 트랙은 얕게 파고 선택한 흰 판에만 기존 3D 입체감을 줍니다.</p><div class="v2-tabs-grid">'+
 '<figure class="v2-component-sample"><figcaption><strong>정렬 기준 · 2개</strong></figcaption>'+stage(renderSegment({id:'v2-sort-segment'}))+'</figure><figure class="v2-component-sample"><figcaption><strong>기간 · 3개</strong></figcaption>'+stage(renderSegment({id:'v2-period-segment',label:'조회 기간',items:['1개월','3개월',{label:'6개월',disabled:true}]}))+'</figure></div>'+stateComparison('<div class="v2-tabs-grid">'+results.map(([state,title,note])=>sample(title,note,renderSegment({items:['최근순','금액순'],selected:1,state}))).join('')+'</div>')+
 '<ul class="v2-switch-rules"><li>2~3개의 짧은 선택에 사용합니다. 단일 선택 라디오이며 항목마다 48px 터치 영역을 확보합니다.</li><li>입체적인 선택판과 굵은 글자로 선택을 구분합니다. 길거나 많은 선택지는 라디오 목록으로 바꿉니다.</li><li>이 검토 화면에서만 선택 표시가 바뀝니다. 실제 조회·정렬·저장은 하지 않습니다.</li></ul></section>';
}
export function setupTabs(root){
 for(const widget of root.querySelectorAll('[data-v2-tabs]')){
  if(widget.dataset.tabsReady||widget.closest('[inert]'))continue;widget.dataset.tabsReady='true';
  const list=widget.querySelector(':scope > [role="tablist"]');
  const controls=[...list.querySelectorAll(':scope > [role="tab"]')],panels=[...widget.querySelectorAll(':scope > [role="tabpanel"]')];
  const activate=(button,focus=false)=>{
   if(button.disabled)return;
   for(const tab of controls){const selected=tab===button;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;}
   for(const panel of panels)panel.hidden=panel.id!==button.getAttribute('aria-controls');
   if(focus){
    button.focus({preventScroll:true});
    // Reveal a clipped tab horizontally without moving the document vertically.
    const list=button.parentElement,tab=button.getBoundingClientRect(),rail=list.getBoundingClientRect();
    if(tab.left<rail.left)list.scrollLeft+=tab.left-rail.left;
    else if(tab.right>rail.right)list.scrollLeft+=tab.right-rail.right;
   }
  };
  widget.addEventListener('click',event=>{const button=event.target.closest('[role="tab"]');if(event.target.closest('[data-v2-tabs]')===widget&&controls.includes(button))activate(button);});
  widget.addEventListener('keydown',event=>{
   const button=event.target.closest('[role="tab"]');if(event.target.closest('[data-v2-tabs]')!==widget||!controls.includes(button)||button.disabled)return;
   const available=controls.filter(tab=>!tab.disabled),index=available.indexOf(button),rtl=getComputedStyle(widget).direction==='rtl';
   const step=event.key==='ArrowRight'?(rtl?-1:1):event.key==='ArrowLeft'?(rtl?1:-1):0;
   const next=step?available[(index+step+available.length)%available.length]:event.key==='Home'?available[0]:event.key==='End'?available.at(-1):null;
   if(next){event.preventDefault();activate(next,true);}
  });
 }
 for(const widget of root.querySelectorAll('[data-v2-segment]')){
  if(widget.dataset.segmentReady||widget.closest('[inert]'))continue;widget.dataset.segmentReady='true';
  widget.addEventListener('change',event=>{
   const input=event.target;if(input.closest('[data-v2-segment]')!==widget||!input.matches('input[type="radio"]')||input.disabled||!input.checked)return;
   const label=input.nextElementSibling.textContent;
   const result=widget.querySelector('[data-segment-result]');if(result)result.textContent=label+' 선택';
   widget.querySelector('[data-segment-feedback]').textContent=label+' 선택 예시입니다. 실제 조회·저장은 하지 않습니다.';
  });
 }
}
