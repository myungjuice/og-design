import {escapeHTML as e} from '../../design-system/components/core.mjs';
import {menuArt} from '../../screens/my-info-3d-test/render.mjs';

const base='/assets/icon-review-20261016/';
const figma='/screens/my-info-3d-test/media/figma/';
const image=(file,alt,cls='')=>`<img class="${cls}" src="${base+encodeURIComponent(file)}" alt="${e(alt)}" loading="lazy">`;
const route=(href,label)=>`<a class="ir-source-link" href="${href}" target="_blank" rel="noopener">${label} ↗</a>`;
const section=(id,title,body)=>`<section id="${id}" class="ir-section" data-review-screen hidden><h2>${title}</h2>${body}</section>`;
const status=label=>`<span class="ir-status" data-status="${e(label)}">${e(label)}</span>`;
// Reference assets from app develop 4d8ca33; these are not device screenshots.
const rows=[
 [0,'M 적립 로고','mileageLogo.png','제작 유지','현재 앱의 컬러 M과 리뉴얼의 대표 M 모두 임시 이미지입니다. 다소님이 최종 M 아이콘을 새로 제작해야 합니다.','/v2/barcode/'],
 [1,'마일리지 코인 ON/OFF','mileage_on.svg','제작 제외','구 마일리지 코인은 재제작하지 않습니다. 마일리지 보유·표시 기능은 유지합니다.','/v2/my-info/'],
 [2,'페이 코인 ON/OFF','pay_on.svg','제작 제외','구 페이 코인은 재제작하지 않습니다. 사용 가능 마일리지와 사용 기능은 유지합니다.','/v2/my-info/'],
 [3,'도움말','', '제작 유지','마일리지 안내·도움말에 필요합니다. 기존 그림을 유지하는 것이 아니라 새 아이콘으로 교체합니다.','/v2/my-info/#support'],
 [4,'포인트 코인 ON/OFF','point_on.svg','제작 제외','별도 포인트 기능을 사용하지 않아 포인트 코인 제작은 제외합니다.','/v2/my-info/#mileage-history'],
 [5,'하단 홈','bottom_home_on.svg','수령 완료','새 홈 ON/OFF SVG 수령 완료. 사이트·앱에 교체 적용할 작업이 남아 있습니다.','/v2/home/'],
 [6,'하단 마일리지','bottom_mileage_on.svg','수령 완료','마이랜드 공통 하단 메뉴 ON/OFF SVG 수령 완료. 교체 적용이 남아 있으며 마이랜드 본문은 이번 대조에서 제외합니다.','/v2/home/'],
 [7,'하단 핫플','bottom_hot_on.svg','수령 완료','오지파크 공통 하단 메뉴 ON/OFF SVG 수령 완료. 교체 적용이 남아 있으며 오지파크 본문은 이번 대조에서 제외합니다.','/v2/home/'],
 [8,'하단 My OG','bottom_my_on.svg','수령 완료','내 정보 ON/OFF SVG 수령 완료. 메뉴 명칭·아이콘의 교체 적용이 남아 있습니다.','/v2/my-info/'],
 [9,'OG박스','box_on.svg','제작 유지','현재 메인에서는 잠시 숨겨져 있지만 이벤트 재사용을 고려해 제작 유지합니다. 신청·신청내역·푸시 관련 코드가 남아 있습니다.',''],
 [10,'본인 인증·탈퇴 확인','checkbox_on.png','제외 검토','Flutter 기본 컴포넌트로 구현할 수 있으나 제외 확정 전까지 제작 대상 유지입니다. 현재 앱은 PNG로 인증·탈퇴 조건의 상태 표시를 하며, 직접 누르는 체크박스가 아닙니다.','/v2/my-info/#account'],
 [11,'Q오더 진입','qorder_button.png','제작 제외','사라진 Q오더 홈 버튼 그림은 제작 제외합니다. Q오더 기능은 유지되며 이용내역·주문 상세는 남습니다.','/v2/my-info/#order-detail'],
 [12,'최근 방문 원형 테두리','recent_border.png','카테고리 재사용','기존 핀 모양 테두리는 별도 제작하지 않습니다. 수령한 카테고리 아이콘을 매장 업종에 맞춰 재사용하도록 개발합니다.','/v2/my-info/'],
 [13,'알림','notification.png','제작 유지','상단의 작은 알림과 큰 공지·알림 메뉴 아이콘을 새로 제작합니다. 의미는 하나이며 크기·스타일별 표현이 필요합니다.','/v2/my-info/#notices'],
 [14,'설정','settings.png','제작 유지','상단의 작은 설정과 큰 설정 메뉴 아이콘을 새로 제작합니다. 현재 시안의 그림은 최종 수령 에셋이 아닙니다.','/v2/my-info/#settings'],
 [15,'아바타 수정 연필','edit.png','제작 유지','수정 연필을 새로 제작해 후기 작성·닉네임 수정·의견보내기 등에 재사용합니다.','/v2/my-info/#review-write'],
 [16,'매장 검색','검색.svg','수령 완료','새 검색 SVG 수령 완료. 교체 적용이 남아 있으며 검색·빈 검색결과에서 재사용할 수 있습니다.','/v2/home/#search'],
 [17,'좋아요 하트','heart_on.png','제작 유지','현재 앱·리뉴얼에 찜 기능이 있습니다. 선택·미선택 아이콘을 새로 제작합니다.','/v2/home/#store'],
 [18,'주소','', '제작 유지','매장 주소·위치찾기 아이콘을 새로 제작합니다. 현위치 버튼의 타깃 심볼과는 구분합니다.','/v2/home/#store-info'],
 [19,'영업시간 시계','', '제작 유지','시계 아이콘을 새로 제작하고 영업시간·검색 기록·영업종료 등에 재사용합니다. 재사용해도 제작 의뢰는 유지합니다.','/v2/home/#store-info'],
 [20,'전화','', '제작 유지','전화번호가 등록된 매장과 고객센터에서 쓸 전화 아이콘을 새로 제작합니다.','/v2/home/#store-info'],
 [21,'매장 사이트','', '제작 유지','홈페이지가 등록된 매장에서 쓸 웹 아이콘을 새로 제작합니다.','/v2/home/#store-info'],
 [22,'인스타그램','', '제작 유지','등록된 링크에 표시할 아이콘의 교체 제작을 유지합니다. 브랜드 식별성은 살리되 기존 자산 그대로 사용으로 제외하지 않습니다.','/v2/home/#store-info'],
 [23,'페이스북','', '제작 유지','등록된 링크에 표시할 아이콘의 교체 제작을 유지합니다. 브랜드 식별성은 살리되 기존 자산 그대로 사용으로 제외하지 않습니다.','/v2/home/#store-info'],
 [24,'카카오톡','', '제작 유지','매장 채널·공유에 쓸 아이콘의 교체 제작을 유지합니다. 문의 말풍선과 카카오 로고는 구분합니다.','/v2/home/#store-share'],
 [25,'임시휴무','', '제작 유지','휴무 달력 아이콘의 제작을 유지합니다. 정기휴무와 최종 그림을 공유할 수 있으나 자동으로 제작 제외하지 않습니다.','/v2/home/#store'],
 [26,'정기휴무','', '제작 유지','정기휴무 아이콘의 제작을 유지합니다. 임시휴무와 최종 그림을 공유하고 문구로 상태를 구분할 수 있습니다.','/v2/home/#store'],
 [27,'영업종료','', '제작 유지','영업종료 아이콘의 제작을 유지합니다. NO 19의 새 시계 아이콘을 재사용할 수 있으며 영업종료 상태도 유지합니다.','/v2/home/#store']
];
const contact={18:'address',20:'phone',21:'homepage',22:'instagram',23:'facebook',24:'kakao'};
const clock='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></svg>';
const calendar='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6M17 2v6M3 11h18m-6 3-6 5m0-5 6 5"/></svg>';
function renewed(no){
 const supplied={5:'홈600.svg',6:'마이랜드600.svg',7:'오지파크600.svg',8:'내 정보600.svg',16:'검색.svg'};
 if(supplied[no])return '<div class="ir-old-art">'+image(supplied[no],'수령한 리뉴얼 아이콘')+'</div>';
 if(no===12)return `<div class="ir-old-art"><img src="/assets/designer-20261013/${encodeURIComponent('한식.svg')}" alt="수령한 한식 카테고리 아이콘 재사용 예시"></div><span class="ir-renewed-text">업종별 카테고리 재사용 예시</span>`;
 const asset={0:'mileage-m.png',13:'header-bell.svg',14:'header-settings.svg',15:'review-pencil.svg'};
 if(asset[no])return `<div class="ir-old-art"><img src="${figma+asset[no]}" alt="임시 시안 예시: 최종 아이콘 제작 필요"></div><span class="ir-renewed-text">시안 예시 · 최종 제작 필요</span>`;
 const text={1:'총 보유 마일리지 · 텍스트',2:'사용 가능한 OG 마일리지 · 텍스트',3:'도움말 새 제작',4:'별도 탭 없음',9:'이벤트용 새 제작',10:'기본 컴포넌트 대체 검토',11:'Q오더 · 텍스트 탭',17:'하트 선택·미선택 새 제작',18:'주소 새 제작',19:'새 시계 재사용',20:'전화 새 제작',21:'웹 새 제작',22:'브랜드 아이콘 새 제작',23:'브랜드 아이콘 새 제작',24:'브랜드 아이콘 새 제작',25:'새 휴무 달력',26:'새 휴무 달력',27:'새 시계 재사용'};
 return `<span class="ir-renewed-text">${text[no]}</span>`;
}
function reference(no,file){
 if(file)return image(file,'참고 아이콘: '+rows[no][1]);
 if(contact[no])return `<img src="/design-system/pages/home/media/contact/contact_${contact[no]}.png" alt="기존 매장 정보 아이콘">`;
 return no===19||no===27?clock:no===25||no===26?calendar:'<span class="ir-symbol-text">?</span>';
}
const captures=[
 ['My OG 상단','보유 마일리지의 금색 코인과 사용 가능 마일리지의 파란색 코인, 알림·설정·프로필 수정이 보입니다.',826,1311],
 ['My OG 하단','Q오더 내역과 고객지원은 텍스트 메뉴입니다. 리뉴얼의 큰 메뉴 이미지와 비교할 수 있습니다.',826,1310],
 ['마일리지 내역','사용 가능 마일리지와 기간 선택·적립 내역이 보입니다. 이 캡처에는 구 코인 선택 탭이 없습니다.',821,1302],
 ['내 바코드','기존 컬러 M 로고와 영수증 적립·마일리지 사용 버튼입니다. 바코드·회원번호는 가렸습니다.',824,1307],
 ['홈 지도','Q 모양 퀵적립과 기존 홈·마일리지·핫플·My OG 하단 메뉴가 보입니다.',826,1306],
 ['고궁 · 상세 첫 화면','상단 위치·공유·찜과 영업 중 표시, 매장 탭을 확인할 수 있습니다.',823,1302],
 ['고궁 · 소개·주요 메뉴','소개 펼치기와 주요 메뉴 목록입니다. 별도 기능 아이콘이 없는 텍스트 중심 영역입니다.',831,1298],
 ['고궁 · 메뉴·칭찬·리뷰','칭찬 항목별 아이콘과 첫 리뷰 안내가 보입니다. 조이바 제작 목록은 이번 대조에서 제외합니다.',821,1286],
 ['고궁 · 매장 상세정보','주소·영업시간·전화의 공통 아이콘이 실제 화면에 표시됩니다.',821,1235],
 ['소해피 · 상세 첫 화면','다른 매장에서도 위치·공유·찜과 영업 중 표시가 같은 구조입니다.',825,1302],
 ['소해피 · 소개·주요 메뉴','펼친 소개와 사진이 있는 주요 메뉴입니다. 고궁과 데이터 유무에 따른 차이를 보여 줍니다.',824,1287],
 ['소해피 · 전체 메뉴','사진·이름·가격 중심의 메뉴 목록과 칭찬 영역 진입 부분입니다.',828,1307],
 ['소해피 · 칭찬·리뷰','칭찬 항목별 심볼과 작성된 리뷰가 보입니다. 조이바 신규 의뢰 판단에는 포함하지 않습니다.',827,1306],
 ['소해피 · 매장 상세정보','주소·영업시간·전화 아이콘이 고궁과 동일합니다. 웹·SNS 링크나 휴무 상태는 이 두 매장 캡처에서 확인되지 않습니다.',826,1278]
];
function capture(no){
 const [title,copy,width,height]=captures[no-1],file=`app-${String(no).padStart(2,'0')}${no===4?'-redacted':''}.png`;
 const target={1:'/v2/my-info/',2:'/v2/my-info/',3:'/v2/my-info/#mileage-history',4:'/v2/barcode/',5:'/v2/home/',6:'/v2/home/#store',7:'/v2/home/#main-menu',8:'/v2/home/#store-reviews',9:'/v2/home/#store-info',10:'/v2/home/#store',11:'/v2/home/#main-menu',12:'/v2/home/#full-menu',13:'/v2/home/#store-reviews',14:'/v2/home/#store-info'};
 return `<figure class="ir-device-capture" data-capture-no="${no}"><figcaption><h3>${no}. ${e(title)}</h3><p>${e(copy)}</p></figcaption><a class="ir-screen-link" href="${base+file}" target="_blank" rel="noopener" aria-label="${e(title)} 캡처 크게 보기"><img class="ir-screen-shot" src="${base+file}" width="${width}" height="${height}" alt="2026년 10월 16일 실제 앱 캡처: ${e(title)}" loading="lazy"></a>${route(target[no],'리뉴얼 화면 보기')}</figure>`;
}
export function renderIconReview(){
 const intro='<p class="ir-intro">안 만들어도 되는 것, 새로 만들 것, 재사용할 것, 결정할 것만 정리했습니다. 마이랜드·오지파크 본문은 이번 검토에서 제외합니다.</p>';
 const focused=rows.filter(row=>['제작 제외','카테고리 재사용','제외 검토'].includes(row[3]));
 const menus=[['이용내역','receipt'],['멤버십','membership'],['문의하기','support'],['내 정보','account']];
 const summary=[
  ['제작 제외',4,'마일리지 코인 · 페이 코인 · 포인트 코인 · Q오더 홈 버튼'],
  ['신규 제작',menus.length,menus.map(([label])=>label).join(' · ')],
  ['카테고리 재사용',1,'최근 방문 → 받은 업종별 카테고리 아이콘 적용'],
  ['제외 검토',1,'체크박스 → 기본 컴포넌트 대체 가능, 제외 미확정']
 ].map(([label,count,copy])=>`<li>${status(label)}<strong>${count}항목</strong><span>${copy}</span></li>`).join('');
 const decisions=section('icon-decisions','제작 변경 요약',`
 <ul class="ir-summary" aria-label="제외·신규·재사용·검토 항목 요약">${summary}</ul>
 <p class="ir-caption">기존 교체 제작과 수령 완료 항목은 생략했습니다. 아래 NO는 엑셀 원본 번호이며, 숫자는 항목 기준입니다.</p>
 <h3>기존 목록에서 달라지는 항목</h3>
 <div class="ir-table-wrap" role="region" aria-label="제외·재사용·검토 아이콘 6항목 비교표" tabindex="0"><table class="ir-table"><thead><tr><th>엑셀 NO · 항목</th><th>참고 아이콘</th><th>리뉴얼 표시</th><th>판단</th><th>처리 내용</th></tr></thead><tbody>${focused.map(([no,title,file,label,copy,href])=>`<tr data-baseline-no="${no}"><th scope="row"><small>NO ${no}</small>${title}</th><td><div class="ir-old-art">${reference(no,file)}</div></td><td>${renewed(no)}</td><td>${status(label)}</td><td><p>${copy}</p>${href?route(href,'관련 시안 보기'):''}</td></tr>`).join('')}</tbody></table></div>
 <p class="ir-caption">참고 그림은 현재 앱 원본 아이콘과 수령한 카테고리 SVG입니다. 제작 제외는 해당 기능의 삭제를 의미하지 않습니다.</p>
 <a class="ir-source-link" href="#icon-additions">신규 4종 예시 보기 →</a>`);
 const comparison=section('mileage-compare','기존 앱 ↔ 리뉴얼 비교',`
 <p class="ir-lead">실제 앱 캡처와 리뉴얼 내정보 시안을 나란히 비교합니다. 제작 변경 요약과는 별도의 참고 화면입니다.</p>
 <div class="ir-comparison"><article class="ir-panel"><h3>현재 앱</h3><p class="ir-caption">현재 앱 원본 아이콘 · 코드에서 확인</p>
 <div class="ir-asset-rows"><div>${image('mileage_on.svg','현재 앱의 금색 마일리지 코인')}<div><strong>보유 마일리지</strong><p>금색 마일리지 코인</p></div></div><div>${image('pay_on.svg','현재 앱의 파란색 페이 코인')}<div><strong>사용 가능 마일리지</strong><p>파란색 페이 코인</p></div></div></div>
 <p>현재 앱의 보유·사용 가능 마일리지 표시를 아래 실제 캡처에서 확인할 수 있습니다.</p>${capture(1)}</article>
 <article class="ir-panel"><h3>리뉴얼 시안</h3><div class="ir-m-definition"><img src="${figma}mileage-m.png" alt="임시 리뉴얼 대표 M: 최종 아이콘으로 교체 예정"><div><strong>대표 M · 임시 예시</strong><p>M은 기존 의뢰 NO 0에 포함됩니다. 최종 아이콘으로 교체하되 신규 항목으로 중복 계산하지 않습니다.</p></div></div>
 <a class="ir-screen-link" href="/v2/my-info/" target="_blank" rel="noopener">${image('renewal-my-info.png','리뉴얼 내정보 전체 화면: 마일리지 카드·최근 방문·메뉴 6개','ir-screen-shot')}</a>
 ${route('/v2/my-info/','내정보 시안 열기')} ${route('/v2/barcode/','바코드 시안 열기')}</article></div>
 <div class="ir-conclusion"><h3>비교할 부분</h3><p>구 마일리지·페이 코인은 제작 제외지만 보유·사용 기능은 유지합니다. 내정보의 큰 메뉴 그림은 6종이며, 이용내역·멤버십·문의하기·내 정보 4종만 기존 목록에 없는 신규 항목입니다. 공지·알림과 설정은 기존 의뢰 NO 13·14에 연결합니다.</p></div>
 <div class="ir-split"><article class="ir-panel">${capture(3)}</article><article class="ir-panel">${capture(4)}</article></div>
 <p class="ir-caption">폴드8 캡처와 일반 폰 시안은 원본 비율을 각각 유지했습니다. 아이콘·메뉴 구성 비교용이며 화면 높이의 일치 여부를 판단하는 자료는 아닙니다.</p>`);
 const additions=section('icon-additions','신규 제작 · 4종',`
 <p class="ir-lead">기존 목록에 없던 내정보 메뉴 4종을 추가합니다. 아래는 임시 예시이며, 최종 아이콘은 3D·그라데이션 스타일로 제작합니다.</p>
 <div class="ir-menu-grid">${menus.map(([label,name])=>`<figure class="ir-tile" data-commission="final-artwork-required">${menuArt(name,figma)}<figcaption><strong>${label}</strong>${status('신규 제작')}<span>임시 예시 · 최종 제작 필요</span></figcaption></figure>`).join('')}</div>
 ${route('/v2/my-info/','내정보 적용 위치 보기')}`);
 const guide=section('capture-guide','실제 앱 캡처 · 14장',`<p class="ir-lead">2026-10-16 전달받은 폴드8 캡처입니다. 원본 비율을 유지하며, 이미지를 누르면 크게 볼 수 있습니다. 바코드·회원번호는 가렸습니다.</p>
 <div class="ir-capture-group"><h3>My OG · 마일리지 · 바코드 · 홈</h3><div class="ir-capture-gallery">${[1,2,3,4,5].map(capture).join('')}</div></div>
 <div class="ir-capture-group"><h3>고궁 · 매장 상세 4장</h3><div class="ir-capture-gallery">${[6,7,8,9].map(capture).join('')}</div></div>
 <div class="ir-capture-group"><h3>소해피 · 매장 상세 5장</h3><div class="ir-capture-gallery">${[10,11,12,13,14].map(capture).join('')}</div></div>
 <p class="ir-caption">폴드8과 일반 폰 시안의 비율 차이는 그대로 유지했습니다. 아이콘·메뉴 구성의 참고 자료이며, 설치 앱의 빌드 버전은 미확인입니다.</p>`);
 return intro+decisions+comparison+additions+guide+'<footer class="ir-evidence">2026-10-16 검토 · 오지고랜드 시트 기준 변경 항목만 표시. 엑셀 파일은 수정하지 않았습니다. 사이트·앱의 실제 아이콘 교체나 배포는 별도입니다.</footer>';
}
