import {sheetContent} from '../../design-system/components/sheet/render.mjs';
import {button} from '../../design-system/components/button/render.mjs';
import {escapeHTML as e,attributes as attrs,uid} from '../../design-system/components/core.mjs';
import {renderIconButton} from './icon-button.mjs';
import {renderSelection} from './selection.mjs';
import {renderTabs} from './tabs.mjs';
import {renderFeedback} from './feedback.mjs';
import {setupOverlay} from './overlay.mjs';
export function renderSheet({id=uid('v2-sheet'),title='안내',bodyHTML='',actions,modal=false,size='short'}={}){
 if(typeof title!=='string'||!title.trim())throw new TypeError('Sheet needs a title');
 if(!['short','long'].includes(size))throw new RangeError('Unknown sheet size');
 if(typeof modal!=='boolean')throw new TypeError('Modal must be boolean');
 const content=sheetContent({id,title,bodyHTML,actions:actions||[{label:'닫기',className:'v2-button',attributes:{'data-sheet-close':true}}]})
  .replace(/<button[^>]*class="[^"]*og-sheet-close[^"]*"[\s\S]*?<\/button>/,()=>renderIconButton({label:'시트 닫기',face:'plain',className:'og-sheet-close',attributes:{'data-sheet-close':true}}));
 const panel='<div class="og-sheet-panel v2-sheet-panel" data-size="'+size+'">'+content+'</div>';
 return modal?'<dialog class="v2-sheet-dialog"'+attrs({id,'aria-labelledby':id+'-title'})+'>'+panel+'</dialog>':'<div class="v2-sheet-static" inert>'+panel+'</div>';
}
const trigger=(id,label)=>button({label,variant:'secondary',className:'v2-button',attributes:{'data-sheet-open':id}});
const actions=[{label:'취소',variant:'secondary',className:'v2-button',attributes:{'data-sheet-close':true}},{label:'선택 적용',className:'v2-button',attributes:{'data-sheet-apply':true}}];
export function renderSheetSamples(){
 const choices=['최근순','인기순'].map((label,index)=>renderSelection({kind:'radio',name:'v2-sheet-sort-order',label,checked:index===0,attributes:{value:String(index)}})).join('');
 const labels=['예약','웨이팅','Q오더','리뷰'];
 const history=renderTabs({id:'v2-sheet-history-tabs',label:'이용내역 종류',items:labels,panels:labels.map(label=>renderFeedback({kind:'history',title:label+' 내역이 없어요',body:'새로운 내역은 이곳에 표시됩니다.'}))});
 return '<section class="v2-component-section" id="bottom-sheet" aria-labelledby="bottom-sheet-title" hidden><h2 id="bottom-sheet-title">바텀시트</h2><p>현재 화면 위에서 선택하거나 관련 내역을 확인합니다. 둥근 상단과 가장자리에만 얕은 입체감을 주고 본문은 평면으로 유지합니다.</p><div class="v2-sheet-grid"><figure class="v2-component-sample"><figcaption><strong>짧은 선택 · 정렬</strong><span>취소하면 기존 선택을 유지합니다.</span></figcaption><div class="v2-sheet-stage">'+trigger('v2-sheet-sort','정렬 선택 열기')+'<p data-sheet-sort-result role="status">최근순 적용</p></div></figure><figure class="v2-component-sample"><figcaption><strong>이용내역 · 4개 탭</strong><span>내용만 스크롤하고 제목과 하단 버튼은 유지합니다.</span></figcaption><div class="v2-sheet-stage">'+trigger('v2-sheet-history','이용내역 열기')+'</div></figure></div><p>검토용 선택·빈 내역 예시이며 실제 정렬·내역 조회는 하지 않습니다. 시트의 내용 높이에 맞춰 표시하고 최대 화면 높이의 85%를 사용합니다.</p>'+renderSheet({id:'v2-sheet-sort',title:'정렬 기준',bodyHTML:'<fieldset><legend class="og-sr-only">정렬 기준</legend>'+choices+'</fieldset>',actions,modal:true})+renderSheet({id:'v2-sheet-history',title:'이용내역',bodyHTML:history,size:'long',modal:true})+'</section>';
}
export function setupSheetSamples(root){
 const sort=root.querySelector('#v2-sheet-sort');if(!sort||sort.dataset.sheetReady)return;
 let applied='0';
 for(const dialog of root.querySelectorAll('.v2-sheet-dialog')){
  dialog.dataset.sheetReady='true';
  const controller=setupOverlay(dialog,{initial:()=>dialog.querySelector('input:checked,[role="tab"][aria-selected="true"],h2'),onClose:value=>{
   if(dialog!==sort)return;
   if(value==='apply')applied=sort.querySelector('input:checked').value;
   sort.querySelectorAll('input[type="radio"]').forEach(input=>{input.checked=input.value===applied;});
   root.querySelector('[data-sheet-sort-result]').textContent=(applied==='0'?'최근순':'인기순')+' 적용';
  }});
  root.querySelector('[data-sheet-open="'+dialog.id+'"]').addEventListener('click',event=>controller.open(event.currentTarget));
  dialog.addEventListener('click',event=>{if(event.target.closest('[data-sheet-close]'))controller.close();else if(event.target.closest('[data-sheet-apply]'))controller.close('apply');});
 }
}
