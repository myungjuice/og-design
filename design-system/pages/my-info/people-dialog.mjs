import {quantity} from '../../components/quantity/render.mjs?v=20260918-pickers';
import {dialog} from '../../components/dialog/render.mjs?v=20260918-pickers';
import {escapeHTML as e} from '../../components/core.mjs';
const notices={
 reservation:['예약 시간 10분 전에 매장에 도착해 주세요.','예약 시간을 초과하면 예약이 자동 취소될 수 있습니다.','예약 시간 임박한 예약 변경은 매장에 유선으로 확인하셔야 합니다.','이린이 적용 기준은 매장마다 다를 수 있습니다.'],
 waiting:['입장 호출 시 자리에 안계신 경우, 웨이팅이 취소됩니다.','인원이 변경된 경우, 인원 변경 버튼을 눌러주세요.','웨이팅을 취소하는 경우 다른 손님을 위해 꼭 취소 버튼을 눌러주세요.','이린이 적용 기준은 매장마다 다를 수 있습니다.']
};
export function peopleDialog({type='reservation',adults=2,children=0}={}){
 if(!notices[type])throw new RangeError('Unknown people dialog type');
 const label=type==='waiting'?'웨이팅':'예약';
 const body='<div class="og-res-people">'+[['성인',adults,1],['어린이',children,0]].map(([name,value,min])=>'<div><strong>'+name+'</strong>'+quantity({label:name,value,min,max:null,unit:'명'})+'</div>').join('')+'</div><section class="og-res-people-notice"><h4>'+label+' 안내</h4><ul>'+notices[type].map(n=>'<li>'+e(n)+'</li>').join('')+'</ul></section>';
 return dialog({title:label+' 인원',bodyHTML:body,actions:[{label:'취소',variant:'secondary'},{label:'확인'}]});
}
