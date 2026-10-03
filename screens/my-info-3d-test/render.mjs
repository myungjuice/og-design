import {escapeHTML as e} from '../../design-system/components/core.mjs';
import {surface,menuTile} from '../../design-system/components/surfaces/render.mjs';
import {renderBottomNavigation} from './navigation.mjs';
import {renderHomeTest} from './home.mjs';
import {renderMileageCard} from './mileage-card.mjs';
import {renderBarcodeTest} from './barcode.mjs';
export {renderBarcodeTest};
const menus=[['이용내역','receipt'],['공지·알림','bell'],['멤버십','membership'],['문의하기','support'],['설정','settings'],['내 정보','account']];
// Crop positions exported by Figma from the shared, unmodified 384×256 menu sheet.
const menuRegions={receipt:['-2.16%','-7.31%'],bell:['-93.39%','-7.31%'],membership:['-196.02%','-8.56%'],support:['-3.71%','-96.78%'],settings:['-100.34%','-96.47%'],account:['-196.54%','-96.99%']};
const menuArt=name=>'<span class="service-face"><span class="service-art" data-art="'+name+'" style="--art-left:'+menuRegions[name][0]+';--art-top:'+menuRegions[name][1]+'"><img src="./media/figma/menu-icons.png" width="384" height="256" alt="" decoding="async"></span></span>';
const figmaIcon=(name,width,height=width)=>'<img src="./media/figma/'+name+'.svg" width="'+width+'" height="'+height+'" alt="" decoding="async">';
const exampleVisits=[{name:'스시산원 반주헌',date:'09.24 목',reviewed:false},{name:'준오헤어 용산아이파크몰',date:'09.11 금',reviewed:true},{name:'석암생소금구이 종로익선점',date:'05.30 토',reviewed:true}];
export function renderMyInfoTest({available=15000,total=16000,shared=1250,visits=exampleVisits}={}){
 const balance=renderMileageCard({available,total,shared});
 const recent=surface({className:'recent-card',contentHTML:'<div class="recent-heading"><h2>최근 방문</h2><button class="icon-button" data-preview="최근 방문 전체보기" aria-label="최근 방문 전체보기">'+figmaIcon('recent-chevron',20)+'</button></div><ul class="visit-list">'+visits.map(v=>'<li><span class="visit-symbol"><img src="./media/figma/recent-utensils.svg" width="32" height="32" alt="" decoding="async"></span><div class="visit-copy"><strong>'+e(v.name)+'</strong><span>'+e(v.date)+'</span></div><button class="review-button'+(!v.reviewed?' review-write':'')+'" data-preview="'+(v.reviewed?'내 리뷰':'후기 작성')+'" aria-label="'+e(v.name)+' '+(v.reviewed?'내 리뷰':'후기 작성')+'">'+(v.reviewed?'내 리뷰':'<img src="./media/figma/review-pencil.svg" width="16" height="16" alt="" decoding="async">')+'</button></li>').join('')+'</ul>'});
 return '<section class="my-info-test"><header class="profile-header"><div class="header-actions"><button class="icon-button" data-preview="알림" aria-label="알림">'+figmaIcon('header-bell',20)+'</button><button class="icon-button" data-preview="설정" aria-label="설정">'+figmaIcon('header-settings',20)+'</button></div><div class="profile-row"><span class="profile-avatar" role="img" aria-label="프로필 캐릭터"><span class="avatar-layer avatar-base"><img src="./media/figma/profile-base.png" width="1536" height="1024" alt="" decoding="async"></span><span class="avatar-layer avatar-overlay"><img src="./media/figma/profile-overlay.png" width="324" height="573" alt="" decoding="async"></span></span><div><h1>맑은 땅콩 님</h1><button class="profile-edit" data-preview="프로필 수정">수정하기 '+figmaIcon('profile-chevron',14)+'</button></div></div></header><div class="page-content">'+balance+recent+'<nav class="service-menu" aria-label="내 정보 메뉴">'+menus.map(([label,name])=>menuTile({label,className:'service-tile',attributes:{'data-preview':label},iconHTML:menuArt(name)})).join('')+'</nav></div>'+renderBottomNavigation()+'</section>';
}
export function renderTestPair(){
 return '<div class="test-screen-pair"><div class="test-screen"><h2 class="test-screen-label">내 정보</h2>'+renderMyInfoTest()+'</div><div class="test-screen"><h2 class="test-screen-label">홈</h2>'+renderHomeTest()+'<p class="test-screen-note">지도는 네이버 지도 정적 배경입니다. 가게 이름은 기존 공개 데이터이며, 핀 위치는 배치 예시입니다. 검색·위치 조회·적립은 실제 서비스에 연결되지 않았습니다.</p></div><div class="test-screen"><h2 class="test-screen-label">바코드</h2>'+renderBarcodeTest()+'<p class="test-screen-note">금액·회원번호·바코드는 디자인 확인용 예시이며 실제 적립이나 결제에 사용할 수 없습니다.</p></div></div>';
}
