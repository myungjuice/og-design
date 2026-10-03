import {setupHomeControlSamples} from './home-controls.mjs';
import {setupComponentExplorer} from './explorer.mjs';
import {setupSectionHeadingSamples} from './section-heading.mjs';
import {setupSelectionSamples} from './selection.mjs';
import {setupInputSamples} from './input.mjs';
import {setupDialogSamples} from './dialog.mjs';
export function setupComponentPreview(root){
 setupHomeControlSamples(root);
 setupComponentExplorer(root);
 setupSectionHeadingSamples(root);
 setupSelectionSamples(root);
 setupInputSamples(root);
 setupDialogSamples(root);
 root.addEventListener('click',event=>{
  const row=event.target.closest('[data-preview-row]');
  if(row&&!row.disabled){
   root.querySelector('.v2-list-feedback').textContent=row.dataset.previewRow+' 동작 위치입니다. 실제 조회나 화면 이동은 진행되지 않습니다.';
   return;
  }
  const mileage=event.target.closest('.v2-mileage [data-preview]');
  if(mileage){
   root.querySelector('.v2-mileage-feedback').textContent=mileage.dataset.preview==='마일리지 안내'
    ?'밝은 구간과 흰 원은 사용 가능 금액, 짙은 보라 구간은 총 보유 금액입니다. 진행바는 표시용이며 조작하지 않습니다.'
    :'마일리지 내역보기 동작 위치입니다. 실제 내역 화면 연결은 다음 화면 작업에서 진행합니다.';
   return;
  }
  const target=event.target.closest('[data-preview-action]');
  if(!target||target.disabled)return;
  const status=root.querySelector('.v2-preview-status');
  if(target.dataset.previewAction==='tile'){
   const selected=target.getAttribute('aria-pressed')!=='true';
   target.setAttribute('aria-pressed',String(selected));
   status.textContent=selected?'이용내역 타일 선택됨.':'이용내역 타일 선택 해제됨.';
  }else status.textContent='버튼 눌림을 확인했습니다. 실제 마일리지 사용은 진행되지 않습니다.';
 });
}
