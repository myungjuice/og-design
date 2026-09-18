import {escapeHTML as e,icon} from '../core.mjs';
import {button,iconButton,textButton} from '../button/render.mjs';
export const attachmentAdd=()=>'<button type="button" class="og-attachment-add">'+icon('add_photo_alternate')+'사진 추가</button>';
export const attachmentItem=({src='',alt='',remove=true}={})=>'<div class="og-attachment-item"><img src="'+e(src)+'" alt="'+e(alt)+'">'+(remove?'<button type="button" class="og-attachment-remove" aria-label="첨부 이미지 삭제">'+icon('close')+'</button>':'')+'</div>';
export function attachments({src='',alt='첨부 이미지',state='empty',progress=40}={}) {
 if(!Number.isFinite(progress)||progress<0||progress>100)throw new RangeError('Invalid progress');
 let content=attachmentAdd();
 if(state==='ready')content=attachmentItem({src,alt})+content;
 if(state==='uploading')content=attachmentItem({src,alt,remove:false})+'<div class="og-attachment-status"><p>업로드 중 · '+progress+'%</p><div class="og-attachment-track"><span style="width:'+progress+'%"></span></div><div class="og-attachment-actions">'+textButton({label:'취소'})+'</div></div>';
 if(state==='error')content=attachmentItem({src,alt})+'<div class="og-attachment-status" data-state="error"><p>업로드하지 못했습니다.</p><div class="og-attachment-actions">'+textButton({label:'다시 시도'})+'</div></div>';
 return '<div class="og-attachment-box">'+content+'</div>';
}
export function imageViewer({src='',alt='이미지',mode='fit',position='1 / 1'}={}) {
 return '<div class="og-image-viewer" data-view="'+e(mode)+'"><div class="og-viewer-header"><span>'+e(position)+'</span>'+iconButton({label:'이미지 보기 닫기',name:'close'})+'</div><div class="og-viewer-image">'+(mode==='error'?'<div class="og-viewer-error"><p>이미지를 불러오지 못했습니다.</p>'+button({label:'다시 시도',variant:'secondary',className:'og-viewer-retry'})+'</div>':'<img src="'+e(src)+'" alt="'+e(alt)+'">')+'</div></div>';
}
