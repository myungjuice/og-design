# 3D컨셉 디자인 v2

확인 주소: http://127.0.0.1:4173/v2/design-system/

홈 상단의 `3D컨셉 디자인 v2` 링크로 들어갑니다. `/v2/`는 디자인 시스템으로 이동합니다. 기존 캔버스와 `/screens/my-info-3d-test/`는 그대로 유지합니다.

## 현재 범위

- 좌측 7개 메뉴와 독립 HTML 주소: 디자인 시스템, 공통 컴포넌트, 홈화면, 마이랜드, 바코드, 오지파크, 내정보.
- 디자인 시스템: 컬러, 타이포, 여백, 곡률, 3D 재질의 시각 규칙 검토용 샘플.
- 눈부심을 줄인 다크 그레이 검토 배경과 흰 컴포넌트 표면. 검토용 `--v2-workspace-*` 토큰은 앱 토큰과 분리합니다. 앱 대표 화면 안의 승인된 배경은 유지하고, 검토 영역에는 하늘색 배경·별 장식·OS 표시선을 추가하지 않습니다.
- 컬러의 RGB 값은 실제 CSS 스와치를 sRGB로 변환합니다. CSS 토큰 변경 후 새로고침 또는 루트의 스타일·클래스 변경 시 갱신됩니다.
- `/v2/components/`: 3D 주요·보조·후기 버튼 3종의 앱 기준 6개 상태(기본·눌림·비활성·처리 중·오류·성공), 비상호작용 정보 카드, 메뉴 타일의 6개 상태와 선택 상태. 마우스 올림·키보드 포커스 비교 시안은 제외하고 실제 웹 키보드 조작과 포커스 기능은 유지합니다. 점검 안내는 접힌 ‘접근성 점검’에 분리합니다.
- 공통 컴포넌트의 검토 화면은 선택형 탐색입니다. 기존 7개 메뉴 아래에 분류된 하위 목록과 이름 검색을 제공하며, 우측에는 선택한 컴포넌트만 표시합니다. 검색은 하위 목록만 걸러 현재 미리보기를 유지합니다. 결과 없음 안내·검색 지우기·Escape 지우기를 지원합니다. 컴포넌트 이름과 분류는 `components/catalog.mjs`, 선택·검색은 `components/explorer.mjs`, 검토 화면 외형은 `components/explorer.css`에서 관리합니다.
- 기본 형태를 먼저 보여주고 동작 상태는 ‘상태 비교’, 마일리지의 다른 잔액은 ‘잔액별 비교’를 펼쳐 확인합니다. 선택은 기존 `#primary`, `#mileage`, `#list-row` 등의 URL로 공유·새로고침·뒤로/앞으로 가기를 지원합니다. 알 수 없는 항목은 주요 버튼을 표시합니다. 데스크톱 좌측 메뉴는 고정 위치에서 스크롤하며, 768px 미만에서는 본문의 네이티브 선택 드롭다운도 제공합니다. 검토 화면 변경이며 앱 시안과 실제 공통 컴포넌트의 외형은 변경하지 않습니다.
- 기존 공통 `button`, `surface`, `menuTile` 렌더러를 사용합니다. v2 외형은 `components/styles.css`, v2 래퍼는 `components/render.mjs`에서 한 번만 관리합니다. 기존 CSS를 전역 수정하지 않습니다.
- 공통 마일리지 카드·진행바: `/v2/components/#mileage`에서 기본·사용 가능 0·잔액 0·상한 4가지 검토용 잔액을 비교합니다. 기존 내정보·바코드의 `screens/my-info-3d-test/mileage-card.mjs`를 그대로 호출하며 원본 Figma M·원형 표시점 에셋을 참조합니다. `components/mileage.mjs`는 v2 경로·데이터 검증, `components/mileage.css`는 v2 재질만 담당합니다.
- 마일리지 입력은 `available`, `total`, `shared`, `sharedCount`로 나눕니다. 진행바는 표시용 meter이며 슬라이더가 아닙니다. `rangeMin`/`rangeMax`는 시각적 표시 범위만 정하고 실제 잔액이나 사용 가능 금액을 계산하지 않습니다. 범위 초과 시 그래픽만 제한하고 실제 금액 텍스트는 유지합니다. 안내·내역보기 버튼은 검토용 안내만 표시하며 실제 API에 연결하지 않습니다.
- 공통 목록 행: `/v2/components/#list-row`에 기본·설명형, 3D 아이콘형, 우측 정보형과 긴 내용 예시를 제공합니다. 기존 `listRow`, `surface`, `divider` 렌더러와 내정보의 `menuArt`·디자이너 에셋을 재사용합니다. `components/list-row.mjs`와 `components/list-row.css`에서 v2 조합과 재질을 관리하며 카드 가장자리만 입체적으로, 각 행의 글자·금액·화살표는 평면으로 표현합니다. 정보 행은 버튼이 아니며 이동 화살표·눌림 효과가 없습니다.
- 목록 행의 6개 상태는 기본·누르는 중·비활성·처리 중·오류·성공입니다. 처리 중과 비활성은 네이티브 버튼을 비활성화하고, 처리 중에는 `aria-busy`를 표시합니다. 오류·성공은 문구와 색을 함께 표시합니다. 클릭·키보드·터치는 검토용 상태 문구만 갱신하며 실제 조회나 화면 이동은 하지 않습니다.
- 글꼴은 기존 Pretendard Regular 400 / Bold 700 에셋을 읽기 전용으로 참조합니다.
- `/v2/my-info/`: 내정보 대표 화면을 연결했습니다. 기존 렌더러의 에셋 경로 옵션과 v2 공통 마일리지 카드를 사용합니다. 기존 화면 CSS는 열린 Shadow DOM 안에서 읽기 전용으로 재사용하여 검토 메뉴와 배경에 영향을 주지 않습니다. iframe·스크린샷으로 화면을 대체하지 않습니다. 상단에는 화면 기능에 대한 짧은 설명만 표시합니다.
- 내정보는 390 × 996을 기준으로 프로필·최근 방문·6개 메뉴·하단 네비게이션의 기존 크기와 위치를 유지합니다. 앱 배경은 Figma 35:76의 흰색→연한 파랑(RGB 222, 233, 249), 155.7683도 그라데이션이며 `--v2-screen-top`/`--v2-screen-bottom`으로 관리합니다. 하단 현재 메뉴에는 작은 연보라색 선택 배경(`--v2-nav-selected-surface`)과 진한 보라색·700 굵기 글자를 적용합니다. 기존 26px 3D 아이콘과 중앙 바코드 에셋은 유지하며 발광·애니메이션은 추가하지 않습니다. 토큰 별칭으로 v2 공통 컬러와 글꼴을 연결합니다. 버튼은 시안 확인용 안내창만 열고 실제 서비스에 연결하지 않습니다.
- `/v2/barcode/`: 390 × 846 지도 위 시트 형태를 유지합니다. 기존 바코드 렌더러에 선택적 `renderBalance`를 추가해 내정보와 동일한 v2 공통 마일리지 카드·원본 M 에셋을 사용합니다. 기존 기본 렌더링은 유지합니다. 스캔 영역은 96px이며 바에는 입체 효과를 적용하지 않습니다. 사용 가능 금액이 0이면 사용 버튼만 비활성화하고 적립 버튼과 이유 설명은 유지합니다. 시트 닫기·다시 보기와 검토용 안내창을 제공하며 실제 회원 조회·적립·사용 API는 호출하지 않습니다. 시트 안에는 하단 내비게이션을 중복 추가하지 않습니다.
- `/v2/home/`: 390 × 846 지도 탐색 화면을 연결했습니다. 네이버 지도 정적 배경과 Figma 원본 검색·카테고리·핀·하단 메뉴 에셋을 유지합니다. 검색바는 상단 24px, 업종 칩은 기존 76/72/64 × 38px, 하단 메뉴는 바닥에서 20px 띄우고 C안 선택 받침·밑줄을 적용합니다. 검색은 검토 안내만 열고 업종은 선택 표시만 전환합니다. 실제 지도 API·위치·검색·적립 호출은 하지 않습니다. 하단 옅은 파랑 처리는 기존 시안을 재사용합니다.
- 화면 토큰 별칭(`components/screen.css`), 검토 레이아웃(`components/screen-stage.css`), Shadow DOM과 안내창(`components/screen-preview.mjs`)은 홈·내정보·바코드에서 함께 사용합니다. 공통 안내창은 검색 폼에서도 같은 `showPreview`를 사용합니다.
- 마이랜드·오지파크는 제목만 표시합니다.

하단 내비게이션의 선택 표시는 승인된 C안으로 통일합니다. `components/bottom-navigation.css`에서 기존 연보라색 받침과 아이콘 색감을 유지하고 현재 메뉴명 아래에 20×2px 밑줄을 표시합니다. 중앙 바코드 버튼에는 밑줄을 붙이지 않습니다. 내정보는 기존 공통 렌더러와 이 스타일을 연결하며, 우측 A/B/C 비교 영역과 비교 전용 코드·스타일은 제거했습니다. 현재 메뉴는 `aria-current="page"`와 기존 `is-selected`로 지정하며 다른 메뉴를 눌러도 검토 안내만 열고 현재 화면의 선택 표시는 유지합니다. 확인 주소: `/v2/my-info/`.

공통 컴포넌트 페이지에는 `#search` 검색바, `#categories` 업종 칩, `#navigation` 하단 메뉴를 독립 샘플로 제공합니다. 검색바·업종 칩은 실제 홈의 `screens/my-info-3d-test/home-controls.mjs`, 하단 메뉴는 기존 `navigation.mjs`를 호출합니다. 원본 CSS와 에셋은 열린 Shadow DOM 안에서 재사용하며, 샘플만의 배치 외에 스타일을 복제하지 않습니다. 검색은 확인 문구만 표시하고, 업종·하단 메뉴 선택은 샘플 안에서만 변경됩니다. 기존 대표 화면에는 영향을 주지 않습니다. 업종 칩은 38px 시각 높이와 44px 터치 영역을 유지합니다.

다음 후보는 캔버스의 공통 ‘섹션 제목’입니다. 제목·설명은 선명하게 유지하고 우측 액션 등에 입체감을 제한해 검토합니다. 이후 선택 컨트롤과 내정보 하위 화면의 기획 대조를 별도 승인 후 진행합니다.

## 로컬 검증

```sh
node scripts/build-preview.mjs
node --test v2/render.test.mjs v2/build.test.mjs
PLAYWRIGHT_PATH=/Users/mj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright node v2/navigation.browser.test.cjs
PLAYWRIGHT_PATH=/Users/mj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright node v2/foundations.browser.test.cjs
PLAYWRIGHT_PATH=/Users/mj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright node v2/components/components.browser.test.cjs
PLAYWRIGHT_PATH=/Users/mj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright node v2/components/explorer.browser.test.cjs
PLAYWRIGHT_PATH=/Users/mj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright node v2/components/home-controls.browser.test.cjs
PLAYWRIGHT_PATH=/Users/mj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright node v2/components/list-row.browser.test.cjs
PLAYWRIGHT_PATH=/Users/mj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright node v2/components/mileage.browser.test.cjs
PLAYWRIGHT_PATH=/Users/mj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright node v2/my-info/my-info.browser.test.cjs
PLAYWRIGHT_PATH=/Users/mj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright node v2/barcode/barcode.browser.test.cjs
PLAYWRIGHT_PATH=/Users/mj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright node v2/home/home.browser.test.cjs
```

기존 `scripts/serve-preview.py`로 `dist/`만 제공합니다. 켜진 서버가 있으면 중복 실행하지 않습니다. 브라우저 테스트 주소는 `V2_BASE_URL`로 바꿀 수 있습니다. 테스트는 로컬 Chrome을 사용합니다.

320, 375, 390, 414, 768, 1440px에서 직접 진입·새로고침·뒤로 가기, 메뉴 키보드 조작·리사이즈, 가로 넘침, 글꼴과 대비를 확인합니다. 긴 한글 제목 및 글꼴 다운로드 실패도 검사합니다. 공개 빌드는 테스트·Markdown·숨김 파일을 제외합니다.

이 단계에서는 새 패키지, Figma 쓰기, 라이브 API 연결, 푸시 또는 배포를 하지 않습니다.
