export const foundationGroups=[
 {id:'colors',title:'컬러'}, {id:'typography',title:'타이포'}, {id:'spacing',title:'여백'},
 {id:'radius',title:'곡률'}, {id:'materials',title:'3D 재질'}
];
const colors=[
 ['text','본문','주요 정보와 매장명'],['text-muted','보조 본문','날짜와 안내 문구'],
 ['page','페이지','기본 배경은 흰색'],['surface','표면','카드와 메뉴 타일'],
 ['muted-surface','구분 표면','옅은 중립 회색'],['action','주요 액션','선택 상태와 주요 동작'],
 ['on-action','액션 위 글자','보라색 표면 위 흰 글자'],['edge','경계','영역 구분용, 글자에 사용하지 않음'],
 ['disabled','비활성','사용 불가 상태의 표면'],['error','오류','실패와 오류 안내'],
 ['success','성공','처리 완료 안내'],['warning','주의','확인이 필요한 안내'],['info','정보','추가 정보 안내']
];
const types=[
 ['page-title','페이지 제목','디자인 시스템','24 / 32 · 700'],
 ['card-title','카드 제목','최근 방문','20 / 28 · 700'],
 ['amount','금액','15,000 M','28 / 38 · 700'],
 ['body','본문','사용 가능한 OG 마일리지','16 / 24 · 400'],
 ['secondary','보조 본문','방문 내역과 안내 문구','14 / 22 · 400'],
 ['caption','캡션','09.24 목','12 / 18 · 400']
];
const section=(id,description,body)=>`<section class="v2-foundation" id="${id}" data-foundation="${id}" aria-labelledby="${id}-title"><h2 id="${id}-title">${foundationGroups.find(g=>g.id===id).title}</h2><p class="v2-section-copy">${description}</p>${body}</section>`;
export function renderFoundations(){
 return `<p class="v2-intro">현재 3D 시안을 기준으로 기본 스타일을 정리합니다. 버튼·카드 등 공통 컴포넌트는 이 기준을 검토한 뒤 연결합니다.</p>
 <nav class="v2-section-nav" aria-label="기본 스타일 항목">${foundationGroups.map(g=>`<a href="#${g.id}">${g.title}</a>`).join('')}</nav>
 ${section('colors','보라색은 주요 액션에, 흰색은 기본 표면에 사용합니다. 상태 색은 이름과 함께 구분합니다.',`<dl class="v2-colors">${colors.map(([role,label,desc])=>`<div class="v2-color-row" data-sample><dt><span class="v2-swatch v2-color-${role}" aria-hidden="true"></span><span>${label}</span></dt><dd>${desc}<code>--v2-${role}</code></dd></div>`).join('')}</dl>`)}
 ${section('typography','Pretendard · 실제 제공 파일의 Regular 400과 Bold 700만 사용합니다.',`<div class="v2-types">${types.map(([id,label,text,meta])=>`<div class="v2-type-row" data-sample><div class="v2-type-meta">${label}<span>${meta}</span></div><div class="v2-type-${id}" data-type="${id}" data-contrast="${id}"${id==='amount'?' data-large="true"':''}>${text}</div></div>`).join('')}</div>`)}
 ${section('spacing','4px 단위로 맞춥니다. 카드 내부 20px, 목록 간격 12px, 섹션 간격 24~32px를 출발점으로 검토합니다.',`<div class="v2-spacing-list">${[4,8,12,16,20,24,32,48].map(n=>`<div class="v2-space-row" data-sample><span>${n}px</span><div class="v2-space-bar" style="--sample-space:${n}px" aria-hidden="true"></div></div>`).join('')}</div>`)}
 ${section('radius','작은 동작과 큰 표면의 곡률을 구분합니다. 바텀시트 상단도 카드 기준 20px에서 검토합니다.',`<div class="v2-radius-list">${[['card','카드 · 20px'],['tile','메뉴 타일 · 16px'],['button','버튼 · 12px'],['chip','칩 · pill']].map(([id,label])=>`<figure data-sample><div class="v2-radius-shape v2-radius-${id}" aria-hidden="true"></div><figcaption>${label}</figcaption></figure>`).join('')}</div>`)}
 ${section('materials','좌상단 빛과 하단 두께, 접촉 그림자로 깊이를 만듭니다. 본문과 바코드 막대에는 장식 그림자를 적용하지 않습니다.',`<p class="v2-specimen-note">시각 규칙 검토용 · 동작과 상태를 갖춘 완성 컴포넌트가 아닙니다.</p><div class="v2-material-list">
 <figure data-sample><div class="v2-material v2-material-flat" data-contrast="flat"><strong>최근 방문</strong><span>정보를 선명하게 읽는 기본 표면</span></div><figcaption>평면 <span>목록 · 안내 영역</span></figcaption></figure>
 <figure data-sample><div class="v2-material v2-material-inset" data-contrast="inset"><strong>매장명으로 검색</strong><span>안쪽으로 얕게 들어간 표면</span></div><figcaption>얕은 홈 <span>입력 · 진행바 바탕 검토</span></figcaption></figure>
 <figure data-sample><div class="v2-material v2-material-raised" data-contrast="raised"><strong>이용내역</strong><span>흰 표면의 낮은 돌출과 하단 마감</span></div><figcaption>약한 돌출 <span>흰 카드 · 메뉴 타일</span></figcaption></figure>
 <figure data-sample><div class="v2-material v2-material-primary" data-contrast="primary"><span>사용 가능한 OG 마일리지</span><strong class="v2-material-amount">15,000 M</strong><span>주요 정보에 한정한 보라색 입체 표면</span></div><figcaption>주요 돌출 <span>마일리지 카드 · 주요 액션</span></figcaption></figure>
 </div>`)}
 <p class="v2-foundation-end">다음 검토: 공통 버튼·카드의 기본, 선택, 눌림, 포커스, 비활성 상태</p>`;
}
