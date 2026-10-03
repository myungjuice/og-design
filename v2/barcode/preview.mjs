import {setupScreenPreview} from '../components/screen-preview.mjs';

export function setupBarcodePreview(root){
 setupScreenPreview(root,{onClick(event){
  const action=event.target.closest('[data-barcode-sheet]');
  if(!action)return false;
  const frame=action.closest('.barcode-test'),sheet=frame.querySelector('.barcode-sheet'),reopen=frame.querySelector('.barcode-reopen');
  const closed=action.dataset.barcodeSheet==='close';
  sheet.hidden=closed;frame.querySelector('.barcode-sheet-scrim').hidden=closed;reopen.hidden=!closed;
  (closed?reopen:frame.querySelector('.barcode-close')).focus({preventScroll:true});
  return true;
 }});
}
