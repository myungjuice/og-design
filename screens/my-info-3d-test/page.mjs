import {renderTestPair} from './render.mjs';
document.querySelector('#app').innerHTML=renderTestPair();
const dialog=document.querySelector('#preview-dialog');
function showPreview(action){
 document.querySelector('#preview-title').textContent=action;
 document.querySelector('#preview-copy').textContent=action==='마일리지 안내'?'사용 가능 마일리지와 총 보유 마일리지를 함께 보여주는 디자인 예시입니다. 금액과 방문 내역은 시안용 데이터입니다.':'현재는 홈·내 정보·바코드 디자인을 확인하는 테스트 페이지입니다. '+action+' 기능은 실제 서비스에 연결되지 않았습니다.';
 dialog.showModal();
}
document.querySelector('#app').addEventListener('click',event=>{
 const sheetAction=event.target.closest('[data-barcode-sheet]');
 if(sheetAction){
  const frame=sheetAction.closest('.barcode-test'),sheet=frame.querySelector('.barcode-sheet'),reopen=frame.querySelector('.barcode-reopen');
  const closed=sheetAction.dataset.barcodeSheet==='close';
  sheet.hidden=closed;frame.querySelector('.barcode-sheet-scrim').hidden=closed;reopen.hidden=!closed;
  (closed?reopen:frame.querySelector('.barcode-close')).focus({preventScroll:true});
  return;
 }
 const category=event.target.closest('[data-category]');
 if(category){
  document.querySelectorAll('[data-category]').forEach(button=>button.setAttribute('aria-pressed',String(button===category)));
  return;
 }
 const target=event.target.closest('[data-preview]');
 if(!target||target.disabled)return;
 showPreview(target.dataset.preview);
});
document.querySelector('.home-search-form').addEventListener('submit',event=>{
 event.preventDefault();showPreview('매장 검색');
});
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()}});
