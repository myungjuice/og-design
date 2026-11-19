export const foundationGroups=[
 {id:'colors',title:'컬러'}, {id:'typography',title:'타이포'}, {id:'spacing',title:'여백'},
 {id:'radius',title:'곡률'}, {id:'materials',title:'3D 재질'}
];
const palettes = [
 ['브랜드', [['action','강조'],['button-light','밝은 면'],['button-face','기본 면'],['on-action','강조 위 글자']]],
 ['글자', [['text','기본'],['text-muted','보조'],['input-ink','입력'],['input-muted','입력 안내']]],
 ['표면과 경계', [['surface','표면'],['page','배경'],['muted-surface','구분 면'],['screen-top','시작 면'],['screen-bottom','끝 면'],['edge','경계'],['disabled','비활성']]],
 ['상태', [['info','정보'],['success','성공'],['warning','주의'],['error','오류']]]
];
const typeGroups = [
 ['제목', [
  ['page-title','제목 1','24 / 32','Bold'], ['card-title','제목 2','20 / 28','Bold'],
  ['app-heading','제목 3','16 / 22','Bold'], ['store-name','제목 4','13 / 19','Bold']
 ]],
 ['본문', [
  ['body','본문','16 / 24','Regular'], ['secondary','본문','14 / 22','Regular'],
  ['menu-caption','본문','14 / 19','Regular']
 ]],
 ['캡션', [
  ['caption','캡션','12 / 18','Regular'], ['mileage-title','캡션','12 / 16','Regular'],
  ['visit-date','캡션','12 / 16','Regular']
 ]],
 ['숫자와 레이블', [['amount','012,345','28 / 38','Bold'], ['button-label','레이블','14 / 20','Bold'], ['nav-label','레이블','12 / 16','Regular'], ['nav-selected','레이블','12 / 16','Bold']]]
];
function paletteBoard() {
 return palettes.map(([name,swatches]) => `<section class="guide-family"><h3>${name}</h3>
 <dl class="guide-palette">${swatches.map(([id,label]) => `<div class="v2-color-row" data-sample>
 <dt><span class="v2-swatch v2-color-${id}"></span>${label}</dt>
 <dd><span data-color-token="--v2-${id}"></span></dd></div>`).join('')}</dl></section>`).join('');
}
function typeBoard() {
 const specimen = ([id,label,metrics,weight], emphasis=false) => `<figure class="guide-type" data-sample>
 <div class="v2-type-${id}"${emphasis?'':` data-type="${id}" data-contrast="${id}"`}${id==='amount'?' data-large="true"':''}>
 ${emphasis?`<strong>${label}</strong>`:label}</div>
 <figcaption>${emphasis?'Bold':weight} · ${metrics} px</figcaption></figure>`;
 return typeGroups.map(([name,samples]) => {
  const isBody=name==='본문';
  return `<section class="guide-family"><h3>${name}</h3>
  <div class="guide-scale${isBody?' guide-body-scale':''}">${samples.map(s=>specimen(s)).join('')}
  ${isBody?samples.map(s=>specimen(s,true)).join(''):''}</div></section>`;
 }).join('');
}
const section=(id,description,body)=>`<section class="v2-foundation" id="${id}" data-foundation="${id}" aria-labelledby="${id}-title"><h2 id="${id}-title">${foundationGroups.find(g=>g.id===id).title}</h2>${description ? `<p class="v2-section-copy">${description}</p>` : ''}${body}</section>`;
export function renderFoundations(){
 return `<nav class="guide-shortcuts" aria-label="자주 쓰는 컴포넌트"><a href="/v2/components/#primary">버튼</a><a href="/v2/components/#text-input">입력</a></nav>
 ${section('colors','',paletteBoard())}
 ${section('typography','Pretendard · 크기 / 행간',typeBoard())}
 ${section('spacing','기본 단위 4px · 아이콘과 레이블 사이 6px',`<div class="v2-spacing-list">${[4,6,8,12,16,20,24,32,48].map(n=>`<div class="v2-space-row" data-sample><span>${n}px</span><div class="v2-space-bar" style="--sample-space:${n}px" aria-hidden="true"></div></div>`).join('')}</div>`)}
 ${section('radius','카드와 버튼, 시트를 구분합니다. 바코드 시트는 위쪽만 32px, 하단 메뉴는 위쪽만 20px입니다.',`<div class="v2-radius-list">${[['card','카드 · 20px'],['tile','메뉴 타일 · 16px'],['button','버튼 · 12px'],['chip','검색·칩 · pill'],['sheet','바코드 시트 · 위 32px'],['navigation','하단 메뉴 · 위 20px']].map(([id,label])=>`<figure data-sample><div class="v2-radius-shape v2-radius-${id}" aria-hidden="true"></div><figcaption>${label}</figcaption></figure>`).join('')}</div>`)}
 ${section('materials','카드와 검색창은 같은 3D 재질을 사용합니다. 좌상단 빛과 하단 두께, 접촉 그림자로 깊이를 만듭니다. 본문과 바코드 막대에는 장식 그림자를 적용하지 않습니다.',`<div class="v2-material-list">
 <figure data-sample><div class="v2-material-stage"><div class="v2-material v2-material-flat" data-contrast="flat"><strong>제목</strong><span>본문</span></div></div><figcaption>평면 <span>본문 · 안내 · 바코드 막대</span></figcaption></figure>
 <figure data-sample><div class="v2-material-stage"><div class="v2-material v2-material-input" data-contrast="input">입력 안내</div></div><figcaption>검색 표면 <span>좌상단 빛 · 얕은 접촉 그림자</span></figcaption></figure>
 <figure data-sample><div class="v2-material-stage"><div class="v2-material v2-material-panel" data-contrast="panel"><strong>제목</strong><span>본문</span></div></div><figcaption>흰 정보 카드 <span>흰 표면 · 내부 여백 20px</span></figcaption></figure>
 <figure data-sample><div class="v2-material-stage"><div class="v2-material v2-material-tile" aria-hidden="true"></div></div><figcaption>아이콘 받침 <span>80 × 80px · 흰 면의 얕은 두께 · 이름은 받침 밖에 배치</span></figcaption></figure>
 <figure data-sample><div class="v2-material-stage"><div class="v2-material v2-material-action" data-contrast="action">버튼명</div></div><figcaption>주요 버튼 <span>52px 높이 · 보라색 평면 Fill · 카드와 위계 구분</span></figcaption></figure>
 <figure data-sample><div class="v2-material-stage"><div class="v2-material v2-material-inset" data-contrast="inset">누른 상태</div></div><figcaption>얕은 홈 <span>입체 입력을 누르는 동안의 피드백 · 평면 버튼에는 사용하지 않음</span></figcaption></figure>
 <figure data-sample><div class="v2-material-stage"><div class="v2-material v2-material-primary" data-contrast="primary"><span class="v2-material-mileage-title">보조 제목</span><strong class="v2-material-amount">숫자</strong><span>보조 본문</span></div></div><figcaption>마일리지 카드 <span>보라색 표면 · 깊은 하단 마감 · 주요 버튼 재질과 구분</span></figcaption></figure>
 </div>`)}
 <p class="v2-foundation-end"><a href="/v2/components/">공통 버튼·카드의 형태와 상태 검토하기</a></p>`;
}
