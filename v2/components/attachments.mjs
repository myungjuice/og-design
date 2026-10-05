import {attachments,imageViewer} from '../../design-system/components/attachments/render.mjs';
import {button} from '../../design-system/components/button/render.mjs';
import {escapeHTML as e,attributes as attrs,icon as legacyIcon,uid} from '../../design-system/components/core.mjs';
import {iconButtonArt,renderIconButton} from './icon-button.mjs';
import {setupOverlay} from './overlay.mjs';
import {stateComparison} from './catalog.mjs';
const sampleSrc='/screens/my-info-3d-test/media/membership.png';
function source(src){if(typeof src!=='string'||src!==src.trim()||/[\\\u0000-\u001f\u007f]/.test(src)||src.startsWith('//')||/^[a-z][a-z\d+.-]*:/i.test(src)&&!/^https?:\/\/[^/]+\//i.test(src))throw new TypeError('Use a relative image path or HTTP(S) URL');}
const photo='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1.5"/><path d="m4 18 6-6 4 4 3-3 4 5"/></svg>';
export function renderAttachments({id=uid('v2-attachment'),state='empty',src='',alt='첨부 이미지',progress=40}={}){
 source(src);if(!['empty','ready','uploading','error'].includes(state)||!Number.isFinite(progress)||progress<0||progress>100)throw new RangeError('Invalid attachment state or progress');
 if(typeof alt!=='string'||!alt.trim()||state!=='empty'&&!src)throw new TypeError('Attachment needs a source and description');
 return attachments({state,src,alt,progress}).replace('class="og-attachment-box"',()=> 'class="og-attachment-box v2-attachments"'+attrs({id,'data-attachment-state':state}))
  .replace('class="og-attachment-add"','class="og-attachment-add" data-attachment-add')
  .replace(legacyIcon('add_photo_alternate'),photo).replace('사진 추가','예시 이미지 추가')
  .replace('<img ', '<img width="96" height="96" decoding="async" data-attachment-image ')
  .replace('class="og-attachment-remove"','class="og-attachment-remove" data-attachment-remove')
  .replace(legacyIcon('close'),iconButtonArt('close'))
  .replace('업로드 중 ·','업로드 중 예시 ·').replace('업로드하지 못했습니다.','업로드 실패 예시입니다.')
  .replace('class="og-attachment-track"',()=> 'class="og-attachment-track"'+attrs({role:'progressbar','aria-label':'업로드 진행 예시','aria-valuemin':0,'aria-valuemax':100,'aria-valuenow':progress}))
  .replace(/<button[^>]*>취소<\/button>/,()=>button({label:'취소',variant:'secondary',className:'v2-button',attributes:{'data-attachment-cancel':true}}))
  .replace(/<button[^>]*>다시 시도<\/button>/,()=>button({label:'다시 시도',variant:'secondary',className:'v2-button',attributes:{'data-attachment-retry':true}}))
  .replace(/<img[^>]*>/,tag=>tag+'<div class="v2-attachment-image-error" hidden><span>이미지 실패</span><button type="button" data-attachment-image-retry aria-label="첨부 이미지 다시 불러오기">다시 시도</button></div>');
}
const failure=()=>'<div class="og-viewer-error"><p>이미지를 불러오지 못했어요.</p>'+button({label:'다시 시도',variant:'secondary',className:'v2-button',attributes:{'data-viewer-retry':true}})+'</div>';
export function renderImageViewer({id=uid('v2-viewer'),src='',alt='이미지',mode='fit',modal=false}={}){
 source(src);if(!['fit','zoom','error'].includes(mode))throw new RangeError('Invalid viewer mode');
 if(typeof alt!=='string'||!alt.trim()||mode!=='error'&&!src||typeof modal!=='boolean')throw new TypeError('Viewer needs a source and description');
 let html=imageViewer({src,alt,mode}).replace('class="og-image-viewer"',()=> 'class="og-image-viewer v2-image-viewer"'+attrs({'data-viewer-src':src,'data-viewer-alt':alt}))
  .replace(/<button[^>]*>[\s\S]*?<\/button>/,()=>renderIconButton({face:'plain',label:'이미지 보기 닫기',attributes:{'data-viewer-close':true}}))
  .replace('<img ', '<img width="1280" height="1280" decoding="async" ')
  .replace('<span>1 / 1</span>',()=>'<span>1 / 1</span>'+button({label:mode==='zoom'?'전체 보기':'확대',variant:'secondary',className:'v2-button',attributes:{'data-viewer-zoom':true,'aria-pressed':String(mode==='zoom'),disabled:mode==='error'}}));
 if(mode==='error')html=html.replace(/<div class="og-viewer-image">[\s\S]*$/,()=>'<div class="og-viewer-image">'+failure()+'</div></div>');
 return modal?'<dialog class="v2-viewer-dialog"'+attrs({id,'aria-label':alt+' 이미지 보기'})+'>'+html+'</dialog>':'<div class="v2-viewer-static" inert>'+html+'</div>';
}
export function renderAttachmentSamples(){
 const stateNames={empty:'이미지 없음',ready:'첨부 완료',uploading:'업로드 중 예시',error:'실패 예시'};
 return '<section class="v2-component-section" id="attachment-picker" aria-labelledby="attachment-picker-title" hidden><h2 id="attachment-picker-title">이미지 첨부</h2><p>밝은 프레임에 이미지와 추가·삭제 버튼을 배치합니다. 사진 자체는 평면으로 유지합니다.</p><div class="v2-attachment-stage" data-attachment-demo><div data-attachment-slot>'+renderAttachments({id:'v2-attachment-live'})+'</div><div class="v2-attachment-tools">'+button({label:'삭제한 이미지 복원',variant:'secondary',className:'v2-button',disabled:true,attributes:{'data-attachment-restore':true}})+'</div><p data-attachment-message role="status">기존 멤버십 에셋으로 추가·삭제를 확인합니다. 실제 파일 선택·업로드·저장은 하지 않습니다.</p></div>'+stateComparison('<div class="v2-attachment-grid">'+['ready','uploading','error'].map(state=>'<figure class="v2-component-sample"><figcaption><strong>'+stateNames[state]+'</strong></figcaption><div class="v2-attachment-stage" inert>'+renderAttachments({state,src:sampleSrc,alt:'멤버십 에셋 · 첨부 예시'})+'</div></figure>').join('')+'</div>')+'<h3>업로드 상태 미리보기</h3><div class="v2-attachment-stage" data-attachment-state-demo><label>표시 상태<select data-attachment-preview-state>'+['ready','uploading','error'].map(state=>'<option value="'+state+'">'+stateNames[state]+'</option>').join('')+'</select></label><div data-attachment-slot>'+renderAttachments({state:'ready',src:sampleSrc,alt:'멤버십 에셋 · 상태 예시'})+'</div><p data-attachment-message role="status">실제 전송 없이 상태를 바꿔봅니다.</p></div></section><section class="v2-component-section" id="image-viewer" aria-labelledby="image-viewer-title" hidden><h2 id="image-viewer-title">이미지 전체 보기</h2><p>어두운 배경 위에 이미지를 온전히 표시합니다. 확대 시 이미지 영역 안에서 이동하고 닫으면 원래 위치로 돌아옵니다.</p><div class="v2-attachment-stage">'+button({label:'예시 이미지 전체 보기',variant:'secondary',className:'v2-button',attributes:{'data-viewer-open':true}})+'<p>멤버십 에셋을 사용한 보기 예시이며 매장 사진이 아닙니다.</p></div>'+renderImageViewer({id:'v2-image-viewer-live',src:sampleSrc,alt:'멤버십 에셋',modal:true})+'</section>';
}
export function setupAttachmentSamples(root){
 const bindImages=container=>{
  for(const img of container.querySelectorAll('[data-attachment-image]')){
   if(img.dataset.attachmentImageReady)continue;img.dataset.attachmentImageReady='true';const item=img.closest('.og-attachment-item'),fallback=item.querySelector('.v2-attachment-image-error'),demo=item.closest('[data-attachment-demo],[data-attachment-state-demo]'),message=demo?.querySelector('[data-attachment-message]');
   const error=()=>{item.dataset.imageError='true';fallback.hidden=false;if(message)message.textContent='첨부 이미지를 불러오지 못했어요. 다시 불러오거나 삭제할 수 있습니다.';};
   const loaded=()=>{delete item.dataset.imageError;fallback.hidden=true;if(message)message.textContent='첨부 이미지를 표시했습니다. 실제 업로드는 하지 않습니다.';};
   img.addEventListener('error',error);img.addEventListener('load',loaded);
   fallback.querySelector('button').addEventListener('click',()=>{const focused=fallback.contains(img.ownerDocument.activeElement);if(focused)item.querySelector('[data-attachment-remove]')?.focus({preventScroll:true});if(message)message.textContent='첨부 이미지를 다시 불러오는 중입니다.';img.src=img.getAttribute('src');});
   if(img.complete){if(img.naturalWidth)loaded();else error();}
  }
 };
 bindImages(root);
 for(const demo of root.querySelectorAll('[data-attachment-demo],[data-attachment-state-demo]')){
  if(demo.dataset.attachmentReady)continue;demo.dataset.attachmentReady='true';const slot=demo.querySelector('[data-attachment-slot]'),message=demo.querySelector('[data-attachment-message]');let removed=false;
  const paint=(state,focusSelector)=>{
   slot.innerHTML=renderAttachments({id:demo.hasAttribute('data-attachment-demo')?'v2-attachment-live':'v2-attachment-state-live',state,src:state==='empty'?'':sampleSrc,alt:'멤버십 에셋 · 첨부 예시'});
   bindImages(slot);
   const restore=demo.querySelector('[data-attachment-restore]');if(restore)restore.disabled=!removed;
   if(focusSelector)demo.querySelector(focusSelector)?.focus({preventScroll:true});
  };
  demo.addEventListener('change',event=>{if(event.target.matches('[data-attachment-preview-state]')){paint(event.target.value);message.textContent='업로드 상태 예시를 표시했습니다. 실제 전송은 하지 않습니다.';}});
  demo.addEventListener('click',event=>{
   if(event.target.closest('[data-attachment-add]')){removed=false;paint('ready','[data-attachment-remove]');message.textContent='예시 이미지를 추가했습니다.';}
   else if(event.target.closest('[data-attachment-remove]')){removed=true;paint('empty','[data-attachment-add]');message.textContent='예시 이미지를 삭제했습니다. 복원할 수 있습니다.';}
   else if(event.target.closest('[data-attachment-restore]')){removed=false;paint('ready','[data-attachment-remove]');message.textContent='예시 이미지를 복원했습니다.';}
   else if(event.target.closest('[data-attachment-cancel],[data-attachment-retry]')){paint('ready','[data-attachment-remove]');message.textContent='첨부 이미지는 유지하고 완료 예시로 돌아왔습니다. 실제 전송은 하지 않았습니다.';const select=demo.querySelector('select');if(select)select.value='ready';}
  });
 }
 const dialog=root.querySelector('#v2-image-viewer-live');if(!dialog||dialog.dataset.viewerReady)return;dialog.dataset.viewerReady='true';
 const viewer=dialog.querySelector('.v2-image-viewer'),area=dialog.querySelector('.og-viewer-image'),zoom=dialog.querySelector('[data-viewer-zoom]');
 const controller=setupOverlay(dialog,{initial:'[data-viewer-close]'});
 const load=()=>{
  area.innerHTML='<img width="1280" height="1280" decoding="async" src="'+e(viewer.dataset.viewerSrc)+'" alt="'+e(viewer.dataset.viewerAlt)+'">';
  const img=area.querySelector('img');
  const error=()=>{const focused=area.contains(dialog.ownerDocument.activeElement);area.innerHTML=failure();viewer.dataset.view='error';zoom.disabled=true;zoom.textContent='확대';zoom.setAttribute('aria-pressed','false');if(focused)area.querySelector('button').focus();};
  img.addEventListener('error',error,{once:true});img.addEventListener('load',()=>{zoom.disabled=false;viewer.dataset.view='fit';});if(img.complete&&!img.naturalWidth)error();
 };
 root.querySelector('[data-viewer-open]').addEventListener('click',event=>{viewer.dataset.view='fit';zoom.textContent='확대';zoom.setAttribute('aria-pressed','false');load();controller.open(event.currentTarget);});
 dialog.addEventListener('click',event=>{
  if(event.target.closest('[data-viewer-close]'))controller.close();
  else if(event.target.closest('[data-viewer-retry]')){dialog.querySelector('[data-viewer-close]').focus({preventScroll:true});load();}
  else if(event.target.closest('[data-viewer-zoom]')){const expanded=viewer.dataset.view!=='zoom';viewer.dataset.view=expanded?'zoom':'fit';zoom.textContent=expanded?'전체 보기':'확대';zoom.setAttribute('aria-pressed',String(expanded));area.scrollTo(0,0);}
 });
}
