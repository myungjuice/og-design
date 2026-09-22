import {appBar} from '../../components/app-shell/render.mjs';
import {surface} from '../../components/surfaces/render.mjs';
import {sectionHeading} from '../../components/section-heading/render.mjs';
import {textButton} from '../../components/button/render.mjs';
import {escapeHTML as e,icon} from '../../components/core.mjs';
// Existing CustomerCenterModel.empty() values; no new company/contact information.
export function customerCenter({companyName='(주)제비그룹',ceoName='김도현',bizNo='123-86-50879',address='서울특별시 성동구 왕십리로 58, 3층 310호(성수동1가, FORHU)',phone='02-6949-2587',email='jbgroup0501@gmail.com',mapSrc=''}={}){
 const contacts=surface({className:'og-customer-card',contentHTML:sectionHeading({title:'고객 문의'})+'<div class="og-customer-contact"><p>Phone. '+e(phone)+'</p>'+textButton({label:'전화하기'})+'</div><div class="og-customer-contact"><p>E-mail. '+e(email)+'</p>'+textButton({label:'복사하기'})+'</div>'});
 const map=surface({className:'og-customer-card',contentHTML:sectionHeading({title:'위치'})+'<div class="og-customer-map" role="img" aria-label="위치 지도 배치 예시">'+(mapSrc?'<img src="'+e(mapSrc)+'" alt="위치 지도">':icon('location_on')+'<span>지도</span>')+'</div>'});
 const company='<div class="og-customer-company"><strong>'+e(companyName)+'</strong><p>대표이사 '+e(ceoName)+' | 사업자등록번호 '+e(bizNo)+'</p><p>'+e(address)+'</p><p>'+e(email)+' | '+e(phone)+'</p></div>';
 return '<section class="og-customer-center" inert aria-label="고객 센터">'+appBar({title:'고객 센터',back:true})+'<div class="og-customer-scroll">'+contacts+map+company+'</div></section>';
}
export function customerCenterBoard(){return '<div class="screen-page-content"><div class="screen-artboard">'+customerCenter()+'</div><div class="screen-design-notes"><h3>연락처를 먼저</h3><p>전화번호와 이메일을 위에 두고, 오른쪽에 전화·복사 버튼을 정렬했습니다.</p><h3>정보별로 구분</h3><p>고객 문의와 위치는 화이트 카드로, 회사 정보는 배경 위에 담았습니다. 지도는 위치와 크기를 보여주는 영역으로 표시했습니다.</p></div></div>';}
