import {appBar} from '../../components/app-shell/render.mjs';
import {pinPad} from '../../components/pin-pad/render.mjs';
import {textButton} from '../../components/button/render.mjs';
import {dialog} from '../../components/dialog/render.mjs';
import {snackbar} from '../../components/snackbar/render.mjs';
import {icon} from '../../components/core.mjs';
export function password({stage='create',entered=0,lastDigit='',error=false,bioRetry=false}={}){
 const auth=stage==='auth',confirm=stage==='confirm';
 const heading=auth?'암호를 입력해주세요.':confirm?'비밀번호 확인':'비밀번호 변경';
 const help=confirm?textButton({label:'비밀번호 다시 만들기',className:'og-password-restart'}):auth?'':'<p>새로운 비밀번호를 6글자로 입력하세요.</p>';
 const errorView=error?(auth?'<div class="og-password-snack">'+snackbar({message:'비밀번호가 일치하지 않습니다. 다시 입력해주세요.'})+'</div>':'<div class="og-password-overlay">'+dialog({title:'에러',body:'비밀번호가 맞지 않습니다.',actions:[{label:'확인'}]})+'</div>'):'';
 return '<section class="og-password" inert aria-label="'+heading+'">'+appBar({back:true})+'<div class="og-password-content"><div class="og-password-heading"><h2>'+heading+'</h2>'+help+'</div><div class="og-password-space">'+(auth?icon('lock_person'):'')+'</div>'+pinPad({entered:auth&&error?0:entered,lastDigit:auth&&error?'':lastDigit})+(auth?(bioRetry?textButton({label:'다시 시도하기',className:'og-password-retry'}):''):'<div class="og-pin-steps" aria-label="'+(confirm?'2':'1')+' / 2 단계"><span'+(!confirm?' class="is-current"':'')+'></span><span'+(confirm?' class="is-current"':'')+'></span></div>')+'</div>'+errorView+'</section>';
}
export function passwordBoard(){
 const states=[['현재 암호 확인',{stage:'auth'}],['새 비밀번호 입력',{entered:3,lastDigit:'3'}],['비밀번호 재입력',{stage:'confirm'}],['재입력한 비밀번호가 다를 때',{stage:'confirm',entered:6,lastDigit:'6',error:true}],['현재 암호가 다를 때',{stage:'auth',error:true}]];
 return states.map(([label,props],i)=>'<section class="'+(i?'history-empty-example':'')+'"><h3 class="history-state-label">'+label+'</h3><div class="screen-page-content"><div class="screen-artboard">'+password(props)+'</div>'+(i===0?'<div class="screen-design-notes"><h3>같은 숫자 키패드</h3><p>인증과 비밀번호 변경에 같은 키패드를 사용했습니다. 밝은 키 표면과 옅은 그림자로 눌리는 영역을 구분했습니다.</p><h3>입력 상태</h3><p>입력한 자리만 표시하고, 마지막 숫자는 기존 방식대로 보여줍니다.</p></div>':'')+'</div></section>').join('');
}
