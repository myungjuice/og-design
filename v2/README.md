# 3D컨셉 디자인 v2

확인 주소: http://127.0.0.1:4173/v2/design-system/

홈 상단의 `3D컨셉 디자인 v2` 링크로 들어갑니다. `/v2/`는 디자인 시스템으로 이동합니다. 기존 캔버스와 `/screens/my-info-3d-test/`는 그대로 유지합니다.

## 현재 범위

- 좌측 7개 메뉴와 독립 HTML 주소: 디자인 시스템, 공통 컴포넌트, 홈화면, 마이랜드, 바코드, 오지파크, 내정보.
- 디자인 시스템: 컬러, 타이포, 여백, 곡률, 3D 재질의 시각 규칙 검토용 샘플.
- 눈부심을 줄인 다크 그레이 검토 배경과 흰 컴포넌트 표면. 검토용 `--v2-workspace-*` 토큰은 앱 토큰과 분리합니다. 하늘색 배경, 별 장식, OS 표시선은 추가하지 않습니다.
- 컬러의 RGB 값은 실제 CSS 스와치를 sRGB로 변환합니다. CSS 토큰 변경 후 새로고침 또는 루트의 스타일·클래스 변경 시 갱신됩니다.
- `/v2/components/`: 3D 주요·보조·후기 버튼 3종의 8개 상태, 비상호작용 정보 카드, 메뉴 타일의 8개 상태와 선택 상태, 키보드·터치 조작 예시.
- 기존 공통 `button`, `surface`, `menuTile` 렌더러를 사용합니다. v2 외형은 `components/styles.css`, v2 래퍼는 `components/render.mjs`에서 한 번만 관리합니다. 기존 CSS를 전역 수정하지 않습니다.
- 글꼴은 기존 Pretendard Regular 400 / Bold 700 에셋을 읽기 전용으로 참조합니다.
- 마이랜드·오지파크는 제목만 표시합니다. 홈화면·바코드·내정보는 연결 예정 안내와 현재 3D 테스트 페이지 링크만 제공합니다.

대표 화면 전환은 아직 포함하지 않습니다. 다음은 공통 마일리지 카드·진행바 정리이며, 승인 후 내정보 → 바코드 → 홈 순서로 전환합니다. 화면을 복사해 각각 별도 스타일로 관리하지 않습니다.

## 로컬 검증

```sh
node scripts/build-preview.mjs
node --test v2/render.test.mjs v2/build.test.mjs
PLAYWRIGHT_PATH=/Users/mj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright node v2/navigation.browser.test.cjs
PLAYWRIGHT_PATH=/Users/mj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright node v2/foundations.browser.test.cjs
PLAYWRIGHT_PATH=/Users/mj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright node v2/components/components.browser.test.cjs
```

기존 `scripts/serve-preview.py`로 `dist/`만 제공합니다. 켜진 서버가 있으면 중복 실행하지 않습니다. 브라우저 테스트 주소는 `V2_BASE_URL`로 바꿀 수 있습니다. 테스트는 로컬 Chrome을 사용합니다.

320, 375, 390, 414, 768, 1440px에서 직접 진입·새로고침·뒤로 가기, 메뉴 키보드 조작·리사이즈, 가로 넘침, 글꼴과 대비를 확인합니다. 긴 한글 제목 및 글꼴 다운로드 실패도 검사합니다. 공개 빌드는 테스트·Markdown·숨김 파일을 제외합니다.

이 단계에서는 새 패키지, Figma 쓰기, 라이브 API 연결, 푸시 또는 배포를 하지 않습니다.
