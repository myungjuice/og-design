import {bottomSheet,surface,sectionHeading,listRow,iconButton,textField,button,dialog} from '../../components/index.mjs';
import {icon} from '../../components/core.mjs';
import {myInfo} from './render.mjs';
const maskedName=name=>{const n=name.trim();return n.length<2?n:n.length===2?n[0]+'*':n[0]+'*'.repeat(n.length-2)+n.at(-1);};
const maskedPhone=phone=>{if(phone.length<7)return phone;const p=phone.split('-');return p.length>=3?p[0]+'-****-'+p[2]:phone.length===11?phone.slice(0,3)+'-****-'+phone.slice(7):phone;};
const status=(label,checked)=>'<span class="og-account-status'+(checked?' is-checked':'')+'">'+icon(checked?'check_box':'check_box_outline_blank')+'<span>'+label+'</span></span>';
export function account({name='홍길동',phone='010-1234-5678',joined='2024-05-20',mileage=16000,visible=false,authenticated=false,confirmation='',assetsOpen=false}={}){
 const confirmed=confirmation==='회원탈퇴';
 const info='<div class="og-account-heading">'+sectionHeading({title:'가입 정보'})+iconButton({label:visible?'개인정보 숨기기':'개인정보 표시',name:visible?'visibility':'visibility_off'})+'</div>'+[['이름',visible?name:maskedName(name)],['전화번호',visible?phone:maskedPhone(phone)],['가입일',joined.slice(0,10)],['보유 마일리지',Number(mileage).toLocaleString('ko-KR')+' M']].map(([title,value])=>listRow({title,value,interactive:false})).join('');
 const withdrawal=sectionHeading({title:'회원 탈퇴'})+'<div class="og-account-auth">'+status('본인 인증',authenticated)+button({label:'인증하기',variant:'secondary',size:'small'})+'</div>'+textField({labelHTML:status('탈퇴 확인',confirmed),value:confirmation,placeholder:'회원탈퇴',hint:'확인을 위해 "회원탈퇴"라고 입력해주세요',attributes:{readonly:true}})+button({label:'오지고랜드 회원 탈퇴하기',variant:'secondary',className:'og-account-withdraw'+(confirmed?' is-confirmed':'')});
 const overlay=assetsOpen?'<div class="og-account-overlay">'+dialog({title:'자산 소멸 확인',body:'마일리지 등 남은 자산이 남아 있습니다. 회원 탈퇴시 모든 자산은 소멸됩니다.\n\n회원 탈퇴를 진행하시겠습니까?',actions:[{label:'취소',variant:'secondary'},{label:'확인'}]})+'</div>':'';
 return '<section class="og-history-screen og-account" inert aria-label="내 회원 정보"><div class="og-history-backdrop" aria-hidden="true">'+myInfo()+'</div><div class="og-history-scrim"></div>'+bottomSheet({title:'내 회원 정보',bodyHTML:'<div class="og-account-groups" data-authenticated="'+authenticated+'" data-confirmed="'+confirmed+'">'+surface({className:'og-account-info',contentHTML:info})+surface({className:'og-account-withdrawal',contentHTML:withdrawal})+'</div>'})+overlay+'</section>';
}
export function accountBoard(){
 const states=[['기본 · 개인정보 숨김',{}],['개인정보를 표시했을 때',{visible:true}],['본인 인증과 탈퇴 확인을 마쳤을 때',{authenticated:true,confirmation:'회원탈퇴'}],['남은 자산이 있을 때 · 확인창',{authenticated:true,confirmation:'회원탈퇴',assetsOpen:true}]];
 return states.map(([label,props],i)=>'<section class="'+(i?'history-empty-example':'')+'"><h3 class="history-state-label">'+label+'</h3><div class="screen-page-content"><div class="screen-artboard">'+account(props)+'</div>'+(i===0?'<div class="screen-design-notes"><h3>가입 정보와 회원 탈퇴</h3><p>두 영역을 화이트 카드로 나눴습니다. 항목명은 왼쪽, 정보는 오른쪽에 맞췄습니다.</p><h3>인증과 확인</h3><p>체크 표시는 인증·입력 상태를 보여줍니다. 안내문은 입력칸 바로 아래에 배치했습니다.</p></div>':'')+'</div></section>').join('');
}
