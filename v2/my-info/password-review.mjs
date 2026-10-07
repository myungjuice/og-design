import {button,textButton} from '../../design-system/components/button/render.mjs';

// Figma layout applied only to V2 specimens. No credentials or input handlers.
export function adaptPasswordSpecimen(source,state){
 const auth=state.startsWith('auth'),confirm=state.startsWith('confirm');
 const entered=state==='create'?3:state==='confirm-error'?6:0;
 const title=auth?'현재 비밀번호를 입력해주세요':confirm?'새로운 비밀번호를 다시 입력해주세요':'새로운 비밀번호를 입력해주세요';
 const dots='<div class="og-pin-display" role="img" aria-label="'+entered+'자리 입력됨">'+Array.from({length:6},(_,i)=>'<span class="og-pin-dot'+(i<entered?' is-filled':'')+'" aria-hidden="true"></span>').join('')+'</div>';
 const reset=auth?textButton({label:'비밀번호 재설정',className:'v2-password-reset',suffixHTML:'<img src="/v2/my-info/assets/password-chevron.svg" alt="" aria-hidden="true">'}):confirm?textButton({label:'비밀번호 다시 만들기',className:'og-password-restart'}):'';
 let html=source.replace(/<div class="og-pin-display" role="img" aria-label="\d자리 입력됨">[\s\S]*?<\/div>/,'');
 html=html.replace(/<div class="og-password-heading">[\s\S]*?<\/div>/,'<div class="og-password-heading"><h2>'+title+'</h2>'+dots+reset+'</div>');
 html=html.replace(/<div class="og-password-space">[\s\S]*?<\/div>/,'');
 html=html.replace(/<button\b[^>]*data-pin-key="clear"[^>]*>[\s\S]*?<\/button>/,'<span class="v2-pin-empty" aria-hidden="true"></span>');
 html=html.replace(/<button\b[^>]*data-pin-key="backspace"[^>]*>[\s\S]*?<\/button>/,()=>button({label:'',variant:'secondary',className:'og-pin-key',iconHTML:'<img src="/v2/my-info/assets/password-backspace.svg" alt="" aria-hidden="true">',attributes:{'data-pin-key':'backspace','aria-label':'한 자리 지우기'}}));
 if(state==='create')html=html.replace('data-pin-key="2"','data-pin-key="2" data-state="active"');
 return html;
}
