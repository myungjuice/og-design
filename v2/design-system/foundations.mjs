export const foundationGroups=[
 {id:'colors',title:'컬러'}, {id:'typography',title:'타이포'}, {id:'spacing',title:'여백'},
 {id:'radius',title:'곡률'}, {id:'materials',title:'3D 재질'}
];
const colors=[
 ['text','본문','주요 정보와 매장명'],['text-muted','보조 본문','날짜와 안내 문구'],
 ['page','기본 배경','일반 영역의 밝은 회색'],['surface','표면','카드와 메뉴 타일의 흰 표면'],
 ['screen-top','화면 배경 · 위','내정보·바코드 배경 그라데이션의 시작'],['screen-bottom','화면 배경 · 아래','아래로 갈수록 옅은 하늘색으로 전환'],
 ['muted-surface','구분 표면','옅은 중립 회색'],['action','마일리지 표면','마일리지 카드와 브랜드 강조'],
 ['button-light','주요 버튼 · 빛','주요 버튼 그라데이션의 밝은 쪽'],['button-face','주요 버튼 · 면','주요 버튼 그라데이션의 진한 쪽'],
 ['input-ink','입력 글자','검색·입력 표면의 짙은 푸른 글자'],['input-muted','입력 안내','검색 힌트와 입력 안내 글자'],
 ['on-action','액션 위 글자','보라색 표면 위 흰 글자'],['edge','경계','영역 구분용, 글자에 사용하지 않음'],
 ['disabled','비활성','사용 불가 상태의 표면'],['error','오류','실패와 오류 안내'],
 ['success','성공','처리 완료 안내'],['warning','주의','확인이 필요한 안내'],['info','정보','추가 정보 안내']
];
const types=[
 ['page-title','페이지 제목','디자인 시스템','24 / 32 · 700'],
 ['card-title','공통 섹션 제목','마일리지 안내','20 / 28 · 700'],
 ['app-heading','앱 카드 제목','최근 방문','16 / 22 · 700'],
 ['amount','금액','15,000 M','28 / 38 · 700'],
 ['body','본문·입력값','매장명을 입력해 주세요.','16 / 24 · 400'],
 ['mileage-title','마일리지 제목','사용 가능한 OG 마일리지','12 / 16 · 400'],
 ['store-name','방문 매장명','스시샤워 반주헌','14 / 19 · 700'],
 ['menu-caption','메뉴 이름','이용내역','14 / 19 · 400'],
 ['button-label','주요 버튼 글자','마일리지 사용','14 / 20 · 700'],
 ['secondary','보조 본문','방문 내역과 안내 문구','14 / 22 · 400'],
 ['caption','일반 캡션','마일리지 적립 안내','12 / 18 · 400'],
 ['visit-date','방문 날짜·그래프 눈금','09.24 목','12 / 16 · 400'],
 ['nav-label','하단 메뉴 이름','마이랜드','10 / 16 · 400 · 선택 시 700']
];
const section=(id,description,body)=>`<section class="v2-foundation" id="${id}" data-foundation="${id}" aria-labelledby="${id}-title"><h2 id="${id}-title">${foundationGroups.find(g=>g.id===id).title}</h2><p class="v2-section-copy">${description}</p>${body}</section>`;
export function renderFoundations(){
 return `<p class="v2-intro">현재 3D 시안을 기준으로 기본 스타일을 정리합니다. 버튼·카드의 실제 형태와 상태는 공통 컴포넌트 페이지에서 확인합니다.</p>
 ${section('colors','아래는 앱에 사용하는 색상입니다. 다크 그레이 검토 배경은 앱 색상과 별도로 관리합니다. RGB 값은 실제 토큰을 sRGB로 변환해 표시합니다.',`<dl class="v2-colors">${colors.map(([role,label,desc])=>`<div class="v2-color-row" data-sample><dt><span class="v2-swatch v2-color-${role}" aria-hidden="true"></span><span>${label}</span></dt><dd>${desc}<code>--v2-${role}</code><span class="v2-color-value" data-color-token="--v2-${role}">RGB 확인 중</span></dd></div>`).join('')}</dl>`)}
 ${section('typography','Pretendard · Regular 400과 Bold 700만 사용합니다. 공통 제목과 실제 앱 카드 제목을 구분합니다. 금액은 390px 화면 기준이며 좁은 카드에서는 줄여 표시합니다.',`<div class="v2-types">${types.map(([id,label,text,meta])=>`<div class="v2-type-row" data-sample><div class="v2-type-meta">${label}<span>${meta}</span></div><div class="v2-type-${id}" data-type="${id}" data-contrast="${id}"${id==='amount'?' data-large="true"':''}>${text}</div></div>`).join('')}</div>`)}
 ${section('spacing','4px 단위를 기본으로 사용하되, 시안의 아이콘과 글자 사이 6px 간격은 유지합니다. 같은 크기도 용도에 따라 구분합니다.',`<div class="v2-spacing-list">${[4,8,12,16,20,24,32,48].map(n=>`<div class="v2-space-row" data-sample><span>${n}px</span><div class="v2-space-bar" style="--sample-space:${n}px" aria-hidden="true"></div></div>`).join('')}</div><dl class="v2-spacing-usage">
 <div><dt>카드 내부</dt><dd>20px · 좁은 화면에서는 좌우 16px</dd></div>
 <div><dt>내정보 카드 사이</dt><dd>12px</dd></div>
 <div><dt>최근 방문 행·메뉴 행 사이</dt><dd>16px</dd></div>
 <div><dt>마일리지 상세 행 사이</dt><dd>8px</dd></div>
 <div><dt>메뉴 아이콘과 이름 사이</dt><dd>6px · 시안 기준 예외</dd></div>
 <div><dt>하단 메뉴와 화면 끝</dt><dd>20px · 떠 있는 바텀 메뉴</dd></div></dl>`)}
 ${section('radius','카드와 버튼, 시트를 구분합니다. 바코드 시트는 위쪽만 32px, 떠 있는 하단 메뉴는 네 모서리 모두 32px입니다.',`<div class="v2-radius-list">${[['card','카드 · 20px'],['tile','메뉴 타일 · 16px'],['button','버튼 · 12px'],['chip','검색·칩 · pill'],['sheet','바코드 시트 · 위 32px'],['navigation','하단 메뉴 · 32px']].map(([id,label])=>`<figure data-sample><div class="v2-radius-shape v2-radius-${id}" aria-hidden="true"></div><figcaption>${label}</figcaption></figure>`).join('')}</div>`)}
 ${section('materials','좌상단 빛과 하단 두께, 접촉 그림자로 깊이를 만듭니다. 본문과 바코드 막대에는 장식 그림자를 적용하지 않습니다.',`<p class="v2-specimen-note">시각 규칙 검토용 · 동작과 상태를 갖춘 완성 컴포넌트가 아닙니다.</p><div class="v2-material-list">
 <figure data-sample><div class="v2-material-stage"><div class="v2-material v2-material-flat" data-contrast="flat"><strong>마일리지 적립 안내</strong><span>글자와 바코드 막대는 평면으로 선명하게</span></div></div><figcaption>평면 <span>본문 · 안내 · 바코드 막대</span></figcaption></figure>
 <figure data-sample><div class="v2-material-stage"><div class="v2-material v2-material-input" data-contrast="input">매장명으로 검색해 주세요.</div></div><figcaption>밝은 입력 표면 <span>홈 검색창 · 공통 입력 · 좌상단 빛과 얕은 접촉 그림자</span></figcaption></figure>
 <figure data-sample><div class="v2-material-stage"><div class="v2-material v2-material-panel" data-contrast="panel"><strong>최근 방문</strong><span>아래쪽 마감과 부드러운 접촉 그림자</span></div></div><figcaption>흰 정보 카드 <span>최근 방문 · 바코드 카드 · 기본 내부 여백 20px</span></figcaption></figure>
 <figure data-sample><div class="v2-material-stage"><div class="v2-material v2-material-tile" aria-hidden="true"></div></div><figcaption>아이콘 받침 <span>80 × 80px · 흰 면의 얕은 두께 · 이름은 받침 밖에 배치</span></figcaption></figure>
 <figure data-sample><div class="v2-material-stage"><div class="v2-material v2-material-action" data-contrast="action">마일리지 사용</div></div><figcaption>주요 버튼 <span>52px 높이 · 보라색 평면 Fill · 카드와 위계 구분</span></figcaption></figure>
 <figure data-sample><div class="v2-material-stage"><div class="v2-material v2-material-inset" data-contrast="inset">누른 상태</div></div><figcaption>얕은 홈 <span>입체 입력을 누르는 동안의 피드백 · 평면 버튼에는 사용하지 않음</span></figcaption></figure>
 <figure data-sample><div class="v2-material-stage"><div class="v2-material v2-material-primary" data-contrast="primary"><span class="v2-material-mileage-title">사용 가능한 OG 마일리지</span><strong class="v2-material-amount">15,000 M</strong><span>강한 입체감은 핵심 금액 영역에 집중</span></div></div><figcaption>마일리지 카드 <span>보라색 표면 · 깊은 하단 마감 · 주요 버튼 재질과 구분</span></figcaption></figure>
 </div>`)}
 <p class="v2-foundation-end"><a href="/v2/components/">공통 버튼·카드의 형태와 상태 검토하기</a></p>`;
}
