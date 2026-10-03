import {setupNavigationComparisons} from './navigation-comparisons.mjs';

export function setupMyInfoPreview(root){
 const host=root.querySelector('.v2-screen-host'),template=host.querySelector('template');
 const screen=host.attachShadow({mode:'open'});
 screen.append(template.content.cloneNode(true));template.remove();
 const dialog=screen.querySelector('dialog');
 screen.addEventListener('click',event=>{
  const target=event.target.closest('[data-preview]');
  if(!target||target.disabled)return;
  screen.querySelector('#preview-title').textContent=target.dataset.preview;
  screen.querySelector('#preview-copy').textContent=target.dataset.preview==='마일리지 안내'
   ?'밝은 구간과 흰 원은 사용 가능 마일리지, 짙은 보라 구간은 총 보유 마일리지입니다. 금액은 검토용 예시이며 진행바는 조작하지 않습니다.'
   :`${target.dataset.preview} 동작 위치를 확인하는 검토 화면입니다. 실제 회원 정보 조회나 서비스 이용은 진행되지 않습니다.`;
  dialog.showModal();
 });
 dialog.addEventListener('click',event=>{
  if(event.target!==dialog)return;
  const r=dialog.getBoundingClientRect();
  if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();
 });
 setupNavigationComparisons(root);
}
