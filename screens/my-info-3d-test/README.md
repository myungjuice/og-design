# 홈 · 내 정보 · 3D 디자인 테스트

독립 확인 URL: `http://127.0.0.1:4173/screens/my-info-3d-test/`

## 홈 화면 추가 (2026-10-03)

- 같은 URL에서 기존 내 정보를 왼쪽, 홈을 오른쪽에 표시합니다. 900px 미만에서는 세로로 배치하며, 좁은 화면의 업종 버튼은 가로 스크롤할 수 있습니다.
- Figma `35:39`는 전체가 한 장의 원본 이미지입니다. 기존 `bottom-navigation-source.png`와 같은 이미지 채움이며, 검색·업종·핀·현 위치·퀵적립·홈 하단 아이콘을 `home-art.mjs`의 CSS 창으로 표시합니다. 원본 PNG는 수정하지 않았으며 캡처 이미지나 생성 이미지로 대체하지 않습니다. 배경이 합쳐진 에셋이라 일부 가장자리에는 원본 배경색이 남습니다. 개별 투명 에셋이 제공되면 교체 가능합니다.
- 지도는 기존 `design-system/pages/home/media/naver-mangwon.png`를 그대로 재사용하고 `© NAVER Corp.` 표기를 유지합니다. 실제 지도 API, 3D 지도 렌더링, 실시간 위치 조회는 추가하지 않습니다.
- 기존 공개 스냅샷의 오시 망원본점 / 밀랍(MILLAB) / 육감만족 이름을 사용합니다. 핀 위치는 실제 가게 좌표가 아닌 화면 배치 예시임을 페이지에 표시합니다.
- 기존 `searchField`, 글꼴·여백 토큰을 사용합니다. 하단 내비게이션은 `navigation.mjs`로 분리해 두 화면에서 중앙 바코드 원본 에셋과 메뉴 명칭을 공유합니다. 기존 내정보 렌더링은 유지합니다.
- 업종 선택은 선택 상태만 보여줍니다(정적 지도에 필터를 적용하지 않음). 검색 제출·핀·현 위치·둘러보기·퀵적립은 기존 테스트 안내창만 엽니다. 실제 서비스 기능이 아닙니다.
- Figma의 OS 상태 표시줄·구름·나무 장식 및 예전 메뉴 명칭은 복제하지 않습니다. 맵 배경 외 검색·카테고리·위치 핀·지도 액션·하단 내비게이션의 3D 재질과 원본 아이콘을 반영합니다. 글꼴은 기존 Pretendard, 메뉴는 홈 / 마이랜드 / 바코드 / 오지파크 / 내 정보입니다.
- Hallmark 검토는 공급된 디자인의 위계·여백·크롭 마감·포커스·반응형에 한정합니다. 새로운 테마나 디자인 구조로 교체하지 않습니다. 기존 캔버스와 전역 스타일은 변경하지 않습니다.
- 작은 흰색 버튼 글자의 가독성을 위해 선택 업종/퀵적립의 밝은 그라디언트 끝을 낮춰 텍스트 대비를 4.5:1 이상으로 검증합니다. 검색·업종·퀵적립·핀 글자는 이미지에 굽지 않고 HTML로 표시합니다.
- 추가 검증: `PLAYWRIGHT_PATH=<playwright module path> node screens/my-info-3d-test/home.browser.test.cjs`. 320 / 375 / 390 / 414 / 768 / 1100px 배치, 원본 이미지 로드, 44px 터치 대상, 선택 상태, 검색 및 안내창 포커스를 검사합니다.

- 기존 HTML 캔버스와 원본 시안은 변경하지 않습니다.
- 사용자가 제공한 내 정보 캡처의 구성을 참고했습니다. M 표시, 숟가락·포크, 연필, 메뉴 이미지 6개는 디자이너의 Figma 원본 에셋을 사용합니다.
- 2026-10-03 요청에 따라 최신 Figma의 프로필 캐릭터를 적용했습니다. 원본 이미지 2장의 레이어·잘라내기 비율과 60px 원형 테두리를 그대로 사용합니다.
- 금액, 공유인 수, 방문 내역은 캡처를 바탕으로 한 시안용 예시입니다. 실제 회원 데이터가 아닙니다.
- 버튼은 테스트 안내만 보여주며 실제 서비스 기능을 실행하지 않습니다.
- 바텀 메뉴 명칭은 현재 프로젝트 기준인 홈 / 마이랜드 / 바코드 / 오지파크 / 내 정보를 유지합니다.
- Surface와 MenuTile 렌더러, 색상·여백·타이포 토큰은 기존 공통 시스템을 활용합니다. 새로운 외형은 이 경로의 토큰과 스타일에 격리했습니다.

## 현재 연결된 Figma 에셋

출처: Figma 파일 `A633JxBlHU0GoJyC3zI3Oz`, 내 정보 화면 `35:76`. 원본 파일은 변경하지 않았습니다. 에셋은 외부 만료 URL에 의존하지 않도록 `media/figma/`에 보관했습니다.

| 파일 | 출처 / 표시 방식 |
| --- | --- |
| `media/figma/mileage-m.png` | 노드 `35:187`의 48×48 PNG 내보내기. 원본 글꼴·그라디언트를 포함합니다. |
| `media/figma/recent-utensils.svg` | 노드 `35:291`의 32×32 SVG. 배경까지 포함한 원본 그대로 표시합니다. |
| `media/figma/review-pencil.svg` | 노드 `35:350`의 16×16 SVG. 후기 작성 버튼 안에 표시합니다. |
| `media/figma/menu-icons.png` | 메뉴 그룹 `35:482`의 384×256 원본 이미지. 동일 파일을 Figma의 개별 잘라내기 위치로 표시합니다. |
| `media/figma/profile-base.png`, `profile-overlay.png` | 노드 `35:355`의 원본 이미지 2장. CSS 레이어 크롭으로 합성하며 비트맵을 재생성하지 않습니다. |
| `media/figma/header-bell.svg`, `header-settings.svg`, `profile-chevron.svg` | 상단 20px 아이콘과 프로필 14px 화살표. |
| `media/figma/mileage-info.svg`, `mileage-chevron.svg`, `mileage-marker.svg`, `mileage-divider.svg` | 마일리지 영역의 안내 10px, 화살표 14px, 흰색 표시점 20px, 구분선 310×1px 원본. |
| `media/figma/recent-chevron.svg` | 최근 방문 전체보기의 20px 원본 화살표. |

메뉴는 80×80(좁은 화면 72×72) 영역에서 원본 이미지를 너비 300.68%, 높이 200.45%로 표시합니다. 개별 위치는 `render.mjs`의 `menuRegions`에 정리되어 있습니다. PNG를 재생성하거나 자르지 않았습니다. M 내보내기에 포함된 원형 바깥 배경은 CSS의 원형 마스크로 가립니다.

글꼴은 기존 Pretendard를 유지합니다(Figma는 Noto Sans). 하단 메뉴 전체 이미지는 예전 명칭과 선택 상태가 합쳐져 있어 그대로 연결하지 않습니다. 단, 중앙 바코드 버튼은 그 이미지의 원본 부분만 CSS로 잘라 표시합니다. 그래프의 P 표기는 프로젝트의 M으로 유지합니다. 이 의도적인 차이 때문에 전체 화면의 픽셀 단위 복제는 아닙니다.

## 중앙 바코드 버튼 원본 적용 (2026-10-03)

- 노드 `35:477` / 이미지 채움 `I35:477;35:460`의 원본 PNG를 `media/figma/bottom-navigation-source.png`에 변경 없이 보관합니다. 원본은 851×1847이며 문양·광택·얇은 테두리가 이미지에 포함되어 있습니다.
- 이미지는 390px 너비로 비율을 유지해 표시하고, 원본 중심 `(425.5, 1697.5)`을 60×60px 원형 창의 중심에 배치합니다. 잘라내기는 CSS로만 처리합니다. 기존 64px 레이아웃 슬롯과 클릭 동작은 유지합니다.
- 이전의 대체 SVG, 임의 그라디언트와 3px 테두리는 제거했습니다. 바깥 접촉 그림자만 전용 토큰을 사용하므로 마일리지 색상 토큰이 바뀌어도 버튼 외형은 변하지 않습니다.
- 메뉴 명칭, 내 정보 선택 상태, 다른 바텀 아이콘과 캔버스는 변경하지 않습니다. 향후 디자이너가 분리된 투명 버튼 에셋을 제공하면 원본 전체 이미지 대신 연결할 수 있습니다.

## 최신 Figma 대조 및 3D 마감 보정 (2026-10-03)

- 마일리지 배경을 임의의 세로 그라디언트에서 원본 단색 `#5251E3`로 변경했습니다. 원본의 안쪽 그림자 `0 4 12 #9AA8FF`, `-4 -8 14 #333295`와 외부 그림자를 토큰으로 적용했습니다. 색상은 동일 sRGB 값의 OKLCH 변환값입니다.
- 390px 화면 기준 카드 350×228px, 상단 위치 156px, 안쪽 여백 20px, 둥글기 20px을 검증합니다.
- 제목 12px/16px, 금액 28px/38px을 간격 없이 배치합니다. 안내 아이콘은 10px, M 원본은 48px입니다.
- 그래프는 높이 20px, 바탕 `#25266A`, 총 보유 막대 `#333295`, 사용 가능 막대는 `#E4F2FF → #67B5FF`의 좌→우 그라디언트와 안쪽 흰색 그림자입니다.
- 기본값에서 총 보유/사용 가능 막대는 189/164px, 흰색 표시점은 20px입니다. 값의 중심 위치는 금액으로 계산하고, 둥근 시각적 끝부분만 3/9px 연장해 원본 형태를 맞춥니다. 표시점은 드래그 컨트롤이 아닙니다.
- 빈 금액에는 채움과 표시점을 숨기며, 아주 작은 양수에는 표시점이 잘리지 않도록 최소 20px의 둥근 채움 끝을 유지합니다. 최대 금액에서는 트랙 너비를 넘지 않습니다.
- 구분선·금액 행 간격과 공유인 구분 기호를 원본에 맞췄습니다.
- 최근 방문의 원본 아이콘·매장명·행 간격·작은 후기 버튼·안쪽 그림자를 맞췄습니다. 원본의 '석암생소금구기' 오기는 '석암생소금구이'로 표시했습니다.
- 메뉴 타일은 원본 이미지 크롭을 그대로 유지하고, 별도의 안쪽 그림자 레이어로 둥근 입체 테두리를 표현합니다.
- 재질과 그림자는 이 페이지의 `tokens.css`에 공통 역할로 정리했습니다. 전역 디자인 토큰은 변경하지 않습니다.
- 최근 방문 행의 시각적 높이는 35px, 행 간격은 원본의 16px입니다.
- 후기 버튼과 최근 방문 전체보기 버튼은 보이는 크기를 유지하고, 주변을 포함해 최소 44×44px 터치 영역을 갖습니다.
- 동작은 기존 테스트 안내창만 유지하며 새 페이지나 실제 서비스 기능은 추가하지 않습니다.
- Hallmark 검토는 기존 시안의 위계·재질·토큰·모바일·접근성 마감에 한정했습니다. 원본의 흰색 표면, 보라색 카드, 3열 메뉴는 요청된 디자인이므로 새로운 테마로 대체하지 않습니다.

## 이전 생성 에셋 (현재 미사용)

이전에 Codex 내장 imagegen으로 만든 메뉴 PNG 6개는 `media/`에 남겨두었으나 화면에는 연결하지 않습니다. 아래는 생성 당시 기록입니다. 바텀 메뉴의 SVG 구현은 계속 사용합니다.

공통 프롬프트:

> Use case: stylized-concept. Asset type: one small 3D icon for a Korean membership mobile app. Polished restrained toy-like product render, cobalt blue and soft periwinkle accent palette, satin polymer and porcelain with gentle gloss. Soft broad light from upper left, slight front-three-quarter view, readable thick rounded silhouette, simple geometry, not cluttered. One isolated object centered, occupies 78% of square, full silhouette visible, ample transparent margin. Genuinely transparent background, no white plate, no pedestal, no square background, no text, no letters, no watermarks. Fine ambient contact shadow confined immediately beneath object. Keep visual weight consistent with a 64px UI icon.

위 공통 프롬프트에 다음 개별 대상을 추가했습니다.

| 파일 | 개별 대상 |
| --- | --- |
| `media/receipt.png` | Curling ivory receipt, three embossed blue strokes, small gold coin without lettering, curled top and zigzag bottom. |
| `media/bell.png` | Tilted cobalt bell, blue clapper and coral notification dot on the upper right. |
| `media/membership.png` | Tilted thick cobalt membership card with rounded corners, lavender edge, tiny white sparkle and pale blue circle, without lettering. |
| `media/support.png` | Cobalt front speech bubble with a white question mark and a smaller lavender rear speech bubble. |
| `media/settings.png` | Larger cobalt gear and smaller lavender gear with circular holes and plausible rounded teeth. |
| `media/account.png` | Cobalt and periwinkle profile medallion with an ivory abstract bust and a small check badge on the lower right; no facial features. |

글꼴은 프로젝트와 같은 Pretendard를 사용합니다. 로컬 WOFF2를 포함해 외부 폰트 연결 없이 표시합니다. Pretendard는 SIL Open Font License 1.1로 배포됩니다. `media/font-license.html`에 공식 저작권·라이선스 문구를 포함했습니다.

## 모바일 프레임과 시안 비율 보정 (2026-10-03)

- 홈은 Figma `35:39`의 390×846px, 내정보는 `35:76`의 390×996px를 기준으로 표시합니다. 브라우저 창 높이로 늘어나지 않으며 내정보 내용을 압축하거나 내부 스크롤을 추가하지 않습니다.
- 내정보의 마일리지 카드는 기존 350×228px와 상단 156px를 유지합니다. 최근 방문은 350×219px, 메뉴 아이콘은 80×80px, 메뉴 라벨 간격은 6px, 두 메뉴 행 간격은 16px로 원본 좌표에 맞췄습니다.
- 공통 하단 내비게이션은 높이 72px, 아래 여백 20px입니다. 상단 시간·네트워크·와이파이·배터리와 하단 홈 표시선은 사용자 피드백에 따라 제거했습니다. 중앙 바코드는 원본 그림만 표시하고 접근성 이름은 유지합니다.
- 홈 하단 140px에는 투명에서 연한 하늘색으로 이어지는 배경을 추가했습니다. 네이버 지도 원본과 버튼·내비게이션 위치는 유지하며 장식 배경은 터치를 가로채지 않습니다.
- 상태 표시 제거 후 홈 검색바의 상단 여백을 58px에서 24px로 줄였습니다. 카테고리도 함께 34px 올라가며 버튼 크기와 검색바·카테고리 사이 간격은 유지합니다.
- 홈 카테고리는 전체 76×38px, 업종 72×38px, 더 보기 64×38px입니다. 주변을 포함한 44px 터치 높이와 좁은 화면의 가로 스크롤을 유지합니다. 단일 이미지인 홈 시안에서 측정한 근사 치수이며 편집 가능한 Figma 버튼 노드 수치가 아닙니다.
- 네이버 지도 배경, 기존 원본 에셋, OG 메뉴 명칭과 Pretendard는 유지합니다. 캔버스나 공유 토큰은 변경하지 않습니다.

## 바코드 3D 비교 화면 (2026-10-03)

- 기존 캔버스는 변경하지 않고 테스트 페이지에 내정보 → 홈 → 바코드 순서로 대표 화면 하나를 추가했습니다. 1312px 이상에서는 세 화면이 나란히, 중간 폭에서는 두 열, 모바일에서는 한 열로 표시됩니다.
- 기획서 PPT 10번째(하단 09)의 잔액·5,000 M 단위 진행 표시·제목/닉네임 삭제·광고 미노출을 확인했습니다. 기존 바텀시트 흐름과 영수증 적립 / 마일리지 사용 / 안내 구성을 유지합니다.
- 마일리지 카드는 `mileage-card.mjs`의 같은 렌더 함수를 내정보와 바코드가 함께 사용합니다. 기본 금액은 기존 내정보와 같은 15,000 / 16,000 / 공유 적립 1,250 M 예시이며 카드의 M 에셋·그래프·228px 높이·그림자·반응형 여백이 동일합니다. 분리 전후 내정보 HTML은 변경되지 않았습니다.
- 바코드는 기존 패턴을 디자인 예시로 보관한 SVG이며 실제 회원 자격 증명이 아닙니다. 128px 높이, 양옆 흰 여백, 필터 없는 바를 사용하고 카드·버튼에만 입체 마감을 적용합니다.
- 사용 가능 금액이 0이면 마일리지 사용을 비활성화하고 이유를 표시합니다. 영수증 적립은 유지합니다. 실제 적립·결제에는 연결하지 않았습니다. 닫기 / 다시 보기와 안내창은 테스트용 동작입니다.
- 시간·네트워크·홈 표시선은 추가하지 않습니다. 배포나 푸시 없이 로컬에서 검토합니다.

## 검증 명령

`node --test screens/my-info-3d-test/render.test.mjs`

`PLAYWRIGHT_PATH=<playwright module path> node screens/my-info-3d-test/preview.browser.test.cjs`

`PLAYWRIGHT_PATH=<playwright module path> node screens/my-info-3d-test/home.browser.test.cjs`

`PLAYWRIGHT_PATH=<playwright module path> node screens/my-info-3d-test/geometry.browser.test.cjs`

`PLAYWRIGHT_PATH=<playwright module path> node screens/my-info-3d-test/barcode.browser.test.cjs`

브라우저 검증은 로컬 서버가 켜진 상태에서 실행합니다. 320 / 375 / 390 / 414 / 768px 가로폭, 카드 치수와 그래프 방향·흰색 표시점 포함, 원본 프로필 이미지 로딩, 텍스트 겹침, 내비게이션 줄바꿈, 안내창과 포커스 복귀를 검사합니다.
