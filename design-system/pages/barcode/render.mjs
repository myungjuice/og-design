import {bottomSheet,surface,mileage,button,textButton,sectionHeading} from '../../components/index.mjs';
import {homeScreen} from '../home/render.mjs';
// Non-scannable specimen: no real member identifier or transaction code is exposed.
const specimen='<div class="og-barcode-bars" role="img" aria-label="스캔할 수 없는 바코드 디자인 예시"></div>';
export function barcodeScreen({total=12400,available=10000,loggedIn=true}={}){
 const balance=loggedIn?surface({className:'og-barcode-balance',contentHTML:mileage({total,available,max:Math.max(total+5000,5000),density:'payment'})}):'';
 const code=loggedIn?specimen+'<div class="og-barcode-number"><span>오지고랜드 회원 번호</span><strong>OG 0000 0000 0000 0000</strong></div>':'<div class="og-barcode-guest"><div aria-hidden="true" class="og-barcode-obscured">'+specimen+'</div><p>로그인 또는 회원 가입 후에 적립 가능합니다.</p>'+button({label:'로그인 또는 가입하러 가기'})+'</div>';
 const card=surface({className:'og-barcode-card',contentHTML:sectionHeading({title:'내 바코드'})+code+(loggedIn?'<div class="og-barcode-actions">'+button({label:'영수증 적립',variant:'secondary'})+button({label:'마일리지 사용'})+'</div>':'')});
 const body='<div class="og-barcode-content">'+balance+card+textButton({label:'마일리지 적립/사용 안내',className:'og-barcode-guide'})+'</div>';
 return '<section class="og-barcode-screen" inert aria-label="바코드 화면"><div class="og-barcode-backdrop" aria-hidden="true">'+homeScreen()+'</div><div class="og-barcode-scrim"></div>'+bottomSheet({title:'',headerAttributes:{'aria-label':'바코드'},bodyHTML:body,actions:[]})+'</section>';
}
export function barcodeBoard(){
 return [
 ['기본 · 보유 12,400 M / 사용 가능 10,000 M',{}],
 ['5,000 M 미만 · 보유 2,400 M',{total:2400,available:0}],
 ['보유 마일리지가 없을 때',{total:0,available:0}],
 ['로그인하지 않았을 때',{loggedIn:false}]
 ].map(([title,props],i)=>'<section class="og-barcode-example"><h3 class="history-state-label">'+title+'</h3><div class="screen-page-content"><div class="screen-artboard">'+barcodeScreen(props)+'</div>'+(i===0?'<div class="screen-design-notes"><h3>사용 가능 금액부터</h3><p>보유 잔액과 실제 사용 가능 금액을 분리하고, 사용 가능 금액을 크게 표시했습니다.</p><h3>다음 사용 단위까지</h3><p>12,400 M 예시는 다음 15,000 M까지 2,600 M가 필요합니다. 구간 진행률은 48%입니다.</p><h3>기존 동선 유지</h3><p>영수증 적립·마일리지 사용·안내를 유지합니다. 바코드는 스캔되지 않는 디자인 예시입니다.</p></div>':'')+'</div></section>').join('');
}
