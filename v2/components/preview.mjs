export function setupComponentPreview(root){
 root.addEventListener('click',event=>{
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
