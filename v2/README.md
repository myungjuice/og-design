# 3D컨셉 디자인 v2

확인 주소: http://127.0.0.1:4173/v2/design-system/

홈 상단의 `3D컨셉 디자인 v2` 링크로 들어갑니다. `/v2/`는 디자인 시스템으로 이동합니다. 기존 캔버스와 `/screens/my-info-3d-test/`는 그대로 유지합니다.

## 현재 범위

- 좌측 7개 메뉴와 독립 HTML 주소: 디자인 시스템, 공통 컴포넌트, 홈화면, 마이랜드, 바코드, 오지파크, 내정보.
- 디자인 시스템: 컬러, 타이포, 여백, 곡률, 3D 재질의 시각 규칙 검토용 샘플.
- 눈부심을 줄인 다크 그레이 검토 배경과 흰 컴포넌트 표면. 검토용 `--v2-workspace-*` 토큰은 앱 토큰과 분리합니다. 앱 대표 화면 안의 승인된 배경은 유지하고, 검토 영역에는 하늘색 배경·별 장식·OS 표시선을 추가하지 않습니다.
- 컬러의 RGB 값은 실제 CSS 스와치를 sRGB로 변환합니다. CSS 토큰 변경 후 새로고침 또는 루트의 스타일·클래스 변경 시 갱신됩니다.
- `/v2/components/`: 3D 주요·보조·후기 버튼 3종의 앱 기준 6개 상태(기본·눌림·비활성·처리 중·오류·성공), 비상호작용 정보 카드, 메뉴 타일의 6개 상태와 선택 상태. 마우스 올림·키보드 포커스 비교 시안은 제외하고 실제 웹 키보드 조작과 포커스 기능은 유지합니다. 점검 안내는 접힌 ‘접근성 점검’에 분리합니다.
- 기존 공통 `button`, `surface`, `menuTile` 렌더러를 사용합니다. v2 외형은 `components/styles.css`, v2 래퍼는 `components/render.mjs`에서 한 번만 관리합니다. 기존 CSS를 전역 수정하지 않습니다.
- 공통 마일리지 카드·진행바: `/v2/components/#mileage`에서 기본·사용 가능 0·잔액 0·상한 4가지 검토용 잔액을 비교합니다. 기존 내정보·바코드의 `screens/my-info-3d-test/mileage-card.mjs`를 그대로 호출하며 원본 Figma M·원형 표시점 에셋을 참조합니다. `components/mileage.mjs`는 v2 경로·데이터 검증, `components/mileage.css`는 v2 재질만 담당합니다.
- 마일리지 입력은 `available`, `total`, `shared`, `sharedCount`로 나눕니다. 진행바는 표시용 meter이며 슬라이더가 아닙니다. `rangeMin`/`rangeMax`는 시각적 표시 범위만 정하고 실제 잔액이나 사용 가능 금액을 계산하지 않습니다. 범위 초과 시 그래픽만 제한하고 실제 금액 텍스트는 유지합니다. 안내·내역보기 버튼은 검토용 안내만 표시하며 실제 API에 연결하지 않습니다.
- 글꼴은 기존 Pretendard Regular 400 / Bold 700 에셋을 읽기 전용으로 참조합니다.
- `/v2/my-info/`: 승인된 내정보 대표 화면을 연결했습니다. 기존 렌더러의 에셋 경로 옵션과 v2 공통 마일리지 카드를 사용합니다. 기존 화면 CSS는 열린 Shadow DOM 안에서 읽기 전용으로 재사용하여 검토 메뉴와 배경에 영향을 주지 않습니다. iframe·스크린샷으로 화면을 대체하지 않습니다.
- 내정보는 390 × 996을 기준으로 프로필·최근 방문·6개 메뉴·하단 네비게이션의 기존 크기와 위치를 유지합니다. 앱 배경은 Figma 35:76의 흰색→연한 파랑(RGB 222, 233, 249), 155.7683도 그라데이션이며 `--v2-screen-top`/`--v2-screen-bottom`으로 관리합니다. 하단 현재 메뉴에는 작은 연보라색 선택 배경(`--v2-nav-selected-surface`)과 진한 보라색·700 굵기 글자를 적용합니다. 기존 26px 3D 아이콘과 중앙 바코드 에셋은 유지하며 발광·애니메이션은 추가하지 않습니다. 토큰 별칭으로 v2 공통 컬러와 글꼴을 연결합니다. 버튼은 시안 확인용 안내창만 열고 실제 서비스에 연결하지 않습니다.
- 마이랜드·오지파크는 제목만 표시합니다. 홈화면·바코드는 연결 예정 안내와 현재 3D 테스트 페이지 링크만 제공합니다.

내정보 대표 화면 우측에 하단 메뉴만 A안(짧은 밑줄형), B안(메뉴명 칩형)으로 비교합니다. 원본 대표 화면의 선택 배경·크기·스타일은 유지하며 두 안 모두 기존 26px 아이콘과 중앙 바코드 에셋을 재사용합니다. 좁은 화면에서는 비교안이 아래로 내려옵니다. 비교 메뉴는 선택 표시만 전환하며 실제 화면 이동이나 서비스 호출을 하지 않습니다. 확인 주소: `/v2/my-info/#navigation-comparisons`.

다음은 선택 표시 검토 후 승인된 안을 공통 하단 메뉴로 정리하고, 승인 후 바코드 대표 화면을 v2에 연결합니다. 화면을 복사해 각각 별도 스타일로 관리하지 않습니다.

## 로컬 검증

```sh
node scripts/build-preview.mjs
node --test v2/render.test.mjs v2/build.test.mjs
PLAYWRIGHT_PATH=/Users/mj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright node v2/navigation.browser.test.cjs
PLAYWRIGHT_PATH=/Users/mj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright node v2/foundations.browser.test.cjs
PLAYWRIGHT_PATH=/Users/mj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright node v2/components/components.browser.test.cjs
PLAYWRIGHT_PATH=/Users/mj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright node v2/components/mileage.browser.test.cjs
PLAYWRIGHT_PATH=/Users/mj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright node v2/my-info/my-info.browser.test.cjs
PLAYWRIGHT_PATH=/Users/mj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright node v2/my-info/navigation-comparisons.browser.test.cjs
```

기존 `scripts/serve-preview.py`로 `dist/`만 제공합니다. 켜진 서버가 있으면 중복 실행하지 않습니다. 브라우저 테스트 주소는 `V2_BASE_URL`로 바꿀 수 있습니다. 테스트는 로컬 Chrome을 사용합니다.

320, 375, 390, 414, 768, 1440px에서 직접 진입·새로고침·뒤로 가기, 메뉴 키보드 조작·리사이즈, 가로 넘침, 글꼴과 대비를 확인합니다. 긴 한글 제목 및 글꼴 다운로드 실패도 검사합니다. 공개 빌드는 테스트·Markdown·숨김 파일을 제외합니다.

이 단계에서는 새 패키지, Figma 쓰기, 라이브 API 연결, 푸시 또는 배포를 하지 않습니다.
