import {textField,passwordField} from '../components/input/render.mjs';
/* Input variants are additive to the existing board. Values stay in this page only. */
{
 const board=document.querySelector('#inputs');
 const variants=[
 {id:'phone',title:'전화번호',label:'휴대전화 번호',type:'tel',inputmode:'tel',placeholder:'010-0000-0000',autocomplete:'off',help:'숫자 10~11자리로 입력해 주세요. 공백과 하이픈도 사용할 수 있습니다.',note:'숫자 키패드를 사용합니다. 잘못 입력한 번호는 지우지 않고, 입력창 아래에서 수정 방법을 안내합니다.'},
 {id:'number',title:'숫자',label:'숫자 입력',type:'text',inputmode:'numeric',placeholder:'예: 1000',autocomplete:'off',help:'0 이상의 정수를 입력해 주세요.',note:'숫자 키패드를 사용합니다. 입력한 값은 그대로 유지하고, 형식이 맞지 않으면 오류 문구를 표시합니다.'},
 {id:'password',title:'비밀번호',label:'비밀번호',type:'password',inputmode:'text',placeholder:'검토용 문자열만 입력',autocomplete:'new-password',help:'실제 비밀번호를 입력하지 마세요.',note:'기본은 숨김입니다. 오른쪽 ‘표시·숨기기’ 버튼으로 입력한 내용을 확인할 수 있습니다.'}
 ];
 for(const v of variants){const section=document.createElement('section');section.id=v.id+'-specimen';section.innerHTML=`<div class="input-section-header"><h2>${v.title}</h2><button data-field-prompt="${section.id}">AI 프롬프트</button></div><div class="input-demo">${(v.id==='password'?passwordField:textField)({id:'field-'+v.id,label:v.label,type:v.type,placeholder:v.placeholder,hint:v.help,toggleId:'password-toggle',helpAttributes:{'aria-live':'polite'},attributes:{inputmode:v.inputmode,autocomplete:v.autocomplete,'aria-invalid':'false'}})}</div><p class="input-demo-note">${v.note}</p>`;board.append(section);
 }
}
