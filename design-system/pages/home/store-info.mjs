import {escapeHTML as e,icon} from '../../components/core.mjs';
import {textButton} from '../../components/button/render.mjs';
import {surface} from '../../components/surfaces/render.mjs';
import {storeScreen} from './store.mjs';
const media=(folder,file)=>new URL('./media/'+folder+'/'+file,import.meta.url).href;
const contactIcon=name=>'<img src="'+media('contact','contact_'+name+'.png')+'" alt="" width="18" height="18">';
const contactRow=(name,text)=>'<div class="og-store-contact-row">'+contactIcon(name)+'<span>'+e(text)+'</span></div>';
// hours/breakTime are the display rows produced by the app's existing schedule formatter.
export function storeInfoSection({streetAddress='',detailAddress='',hours=[],breakTime=[],closeDay=[],tempCloseDay=[],phone='',homepage='',instagram='',facebook='',kakao=''}={}){
 const schedule=(label,values,clock=false)=>values.length?'<div class="og-store-hours-row">'+(clock?icon('access_time'): '<span class="og-store-hours-spacer"></span>')+(label?'<strong>'+label+'</strong>':'')+'<div>'+values.map(v=>'<p>'+e(v)+'</p>').join('')+'</div></div>':'';
 const address='<div class="og-store-info-address">'+contactRow('address',(streetAddress+' '+detailAddress).trim())+textButton({label:'위치찾기'})+'</div>';
 const hoursHTML=schedule('',hours,true)+schedule('브레이크타임',breakTime)+schedule('정기 휴무일',closeDay)+schedule('임시 휴무일',tempCloseDay);
 const contacts=[['phone',phone],['homepage',homepage],['instagram',instagram],['facebook',facebook],['kakao',kakao]].filter(([,v])=>v).map(([type,value])=>contactRow(type,value)).join('');
 return '<section class="og-store-info">'+surface({className:'og-store-info-card',contentHTML:address+(hoursHTML?'<div class="og-store-hours">'+hoursHTML+'</div>':'')+(contacts?'<div class="og-store-contacts">'+contacts+'</div>':'')})+'</section>';
}
export function locationSheet({name='회원점명',localAddress='서울특별시 성동구 지번 주소',detailAddress='2층'}={}){
 const providers=[['kakaomap','카카오'],['navermap','네이버'],['tmap','티맵']];
 return surface({className:'og-navigation-sheet',contentHTML:'<h3>'+e(name)+'</h3><div class="og-navigation-address"><p>'+e((localAddress+' '+detailAddress).trim())+'</p>'+textButton({label:'복사'})+'</div><div class="og-navigation-providers">'+providers.map(([file,label])=>'<div class="og-navigation-provider"><img src="'+media('nav',file+'.png')+'" alt="" width="24" height="24"><span>'+label+'</span></div>').join('')+'</div>'});
}
const full={streetAddress:'서울특별시 성동구 도로명 주소',detailAddress:'2층',hours:['월~금요일 10:00 ~ 21:00','토~일요일 11:00 ~ 20:00'],breakTime:['매일 15:00 ~ 16:00'],closeDay:['매월 첫째 월요일'],tempCloseDay:['2026.9.20'],phone:'02-000-0000',homepage:'https://example.com',instagram:'https://instagram.com/example',facebook:'https://facebook.com/example',kakao:'https://pf.kakao.com/example'};
export function storeInfoScreen({minimal=false,location=false,store={},info:registeredInfo,locationData}={}){
 const source=registeredInfo??full;
 const info=minimal?{streetAddress:source.streetAddress,detailAddress:source.detailAddress,phone:source.phone}:source;
 const screen=storeScreen({...store,selectedSection:2,contentHTML:storeInfoSection(info)});
 return '<div class="og-store-info-screen" inert>'+screen+(location?'<div class="og-location-overlay">'+locationSheet(locationData)+'</div>':'')+'</div>';
}
export function storeInfoBoard(kind,{store={},info,location}={}){
 const states=kind==='info'?[[info?'등록된 매장 정보':'정보가 모두 있을 때',{}],['일부 정보만 있을 때',{minimal:true}]]:[['길찾기 앱 선택',{location:true}]];
 return '<div class="screen-page-content"><div>'+states.map(([title,props])=>'<section class="screen-state-example"><h3>'+title+'</h3><div class="screen-artboard">'+storeInfoScreen({...props,store,info,locationData:location})+'</div></section>').join('')+'</div><div class="screen-design-notes">'+(kind==='info'?'<h3>매장 정보</h3><p>주소와 위치찾기를 나란히 배치하고, 영업시간과 연락처를 아래에 모았습니다.</p><h3>간결한 목록</h3><p>등록된 정보만 보여줍니다. 아이콘과 본문의 시작 위치를 맞춰 읽기 쉽게 정리했습니다.</p>':'<h3>길찾기 선택</h3><p>매장명과 주소 아래에 세 가지 길찾기 앱을 나란히 배치합니다.</p><h3>열린 시트</h3><p>뒤쪽 화면을 어둡게 하고, 흰색 시트에 부드러운 그림자를 더했습니다.</p>')+'</div></div>';
}
export const storeInfoPrompt='매장 상세정보/위치찾기 정적 시안에 기존 기능과 문구를 유지하고 스타일만 적용하세요. shop_panel_items/shop_contents.dart의 buildShopMarketingInfo, _getItem, _getRunTimeItemList, _getCloseDayItemList, _getTempCloseDayItemList 기준입니다. 주소는 streetAddress+detailAddress이며 행을 누르면 복사, 옆 위치찾기는 onNaviTap입니다. businessDayHours/breakTime/closeDay/tempCloseDay는 있을 때만 순서대로 표시합니다. 영업시간은 시계 아이콘, 브레이크타임/정기 휴무일/임시 휴무일은 원래 제목입니다. 시간표의 첫값0/1/2 메타값 제거, 요일별2는 기존 condenseSchedule 적용, ※ 안내 문구와 정기/임시휴무 원문을 보존합니다. 이 렌더러 hours/breakTime은 해당 포맷팅 이후 표시용 행을 받습니다. 전화→홈페이지→인스타그램→페이스북→카카오톡은 값이 있을 때만 원래 contact 이미지와 값을 표시합니다. 전화 연결, URL 열기, 카카오 채널 확인창은 기존 동작을 유지하며 시안에 새 버튼/라벨을 만들지 않습니다. 위치찾기는 shop_panel.dart의 _showNavSearchButton/_naviWidget입니다. 독립 지도 페이지가 아닙니다. 매장명, localAddress+detailAddress(본문 streetAddress와 다름), 복사, 카카오·네이버·티맵 원래 아이콘/순서를 유지합니다. 위도33~43/경도124~132 범위검사와 오류문구 및 앱 미설치시 설치화면 분기는 기존대로 유지합니다. 닫기/확인/지도보기 버튼은 추가하지 않습니다. 공통 storeScreen/surface/textButton/icon 및 OG 토큰을 재사용합니다. 렌더러 design-system/pages/home/store-info.mjs, CSS store-info.css, 이미지 media/contact 및 media/nav는 기존 앱에서 복사한 리소스입니다. 예시주소·URL·시간표는 배치용입니다. 실제 복사/전화/앱열기 동작은 캔버스에 구현하지 않습니다.';
