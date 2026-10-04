# 3D컨셉 디자인 v2

확인 주소: http://127.0.0.1:4173/v2/design-system/

홈 상단의 `3D컨셉 디자인 v2` 링크로 들어갑니다. `/v2/`는 디자인 시스템으로 이동합니다. 기존 캔버스와 `/screens/my-info-3d-test/`는 그대로 유지합니다.

## 현재 범위

- 좌측 7개 메뉴와 독립 HTML 주소: 디자인 시스템, 공통 컴포넌트, 홈화면, 마이랜드, 바코드, 오지파크, 내정보.
- 디자인 시스템: 컬러, 타이포, 여백, 곡률, 3D 재질의 시각 규칙 검토용 샘플. 실제 화면을 기준으로 앱 카드 제목(16/22), 마일리지 제목(12/16), 금액(28/38), 매장명·메뉴명(14/19)을 공통 제목·본문과 구분합니다. 카드 간격 12px, 방문 행 간격 16px, 아이콘과 이름의 예외 간격 6px을 안내합니다. 시트 상단과 떠 있는 하단 메뉴 곡률은 32px입니다. 검색·입력의 밝은 돌출, 흰 카드, 아이콘 받침, 얕은 주요 버튼, 깊은 마일리지 카드 재질을 구분하고 실제 대표 화면과 계산된 스타일을 비교 검증합니다. 이 샘플은 완성 컴포넌트가 아니며 앱 화면 자체를 변경하지 않습니다.
- 눈부심을 줄인 다크 그레이 검토 배경과 흰 컴포넌트 표면. 검토용 `--v2-workspace-*` 토큰은 앱 토큰과 분리합니다. 앱 대표 화면 안의 승인된 배경은 유지하고, 검토 영역에는 하늘색 배경·별 장식·OS 표시선을 추가하지 않습니다.
- 컬러의 RGB 값은 실제 CSS 스와치를 sRGB로 변환합니다. CSS 토큰 변경 후 새로고침 또는 루트의 스타일·클래스 변경 시 갱신됩니다.
- `/v2/components/`: 3D 주요·보조·후기 버튼 3종의 앱 기준 6개 상태(기본·눌림·비활성·처리 중·오류·성공), 비상호작용 정보 카드, 메뉴 타일의 6개 상태와 선택 상태. 마우스 올림·키보드 포커스 비교 시안은 제외하고 실제 웹 키보드 조작과 포커스 기능은 유지합니다. 점검 안내는 접힌 ‘접근성 점검’에 분리합니다.
- 모든 v2 페이지는 ‘주 메뉴 / 보조 메뉴 / 본문’의 2단 사이드바를 공유합니다. 주 메뉴에는 7개 목적지만, 보조 메뉴에는 현재 페이지의 그룹과 들여쓴 하위 항목을 표시합니다. 그룹을 선택하면 연관 시안을 함께 표시하고, 하위 항목을 누르면 같은 그룹을 유지한 채 해당 위치로 이동합니다. 공통 컴포넌트는 버튼 3종, 카드·마일리지·섹션 제목, 목록, 선택 요소, 입력(매장 검색·텍스트·비밀번호·전화번호·숫자·여러 줄 입력), 지도 탐색(업종 카테고리), 내비게이션, 동작 확인으로 묶습니다. 디자인 시스템은 컬러, 타이포·여백, 곡률·3D 재질로 묶습니다.
- 보조 메뉴 검색은 하위 목록만 걸러 현재 미리보기를 유지합니다. 그룹명 검색·결과 없음 안내·검색 지우기·Escape 지우기를 지원합니다. 분류는 `subnavigation.mjs`와 `components/catalog.mjs`, 그룹 선택·검색·이동은 `review-navigation.mjs`, 공통 탐색 외형은 `shell.css`에서 관리합니다. `components/explorer.mjs`는 공통 탐색 연결만 담당합니다.
- 기본 형태를 먼저 보여주고 동작 상태는 ‘상태 비교’, 마일리지의 다른 잔액은 ‘잔액별 비교’를 펼쳐 확인합니다. 기존 `#primary`, `#mileage`, `#list-row`와 새 `#group-buttons` 같은 그룹 URL은 공유·새로고침·뒤로/앞으로 가기를 지원합니다. 알 수 없는 항목은 첫 그룹을 표시합니다. 데스크톱 두 메뉴는 고정 위치에서 독립적으로 스크롤하며, 1024px 미만에서는 접이식 메뉴와 네이티브 그룹 선택을 제공합니다. 검토 화면 변경이며 앱 시안과 실제 공통 컴포넌트의 외형은 변경하지 않습니다.
- 내정보는 현재 메인만 연결되어 있습니다. 내역·예약, 문의, 계정·설정의 하위 화면은 ‘이관 예정’으로 표시하며 클릭 링크나 빈 시안을 만들지 않습니다. 이번 탐색 구조 변경에서는 기존 캔버스의 하위 화면을 이관하지 않습니다. 마이랜드·오지파크에도 가짜 하위 화면을 만들지 않습니다.
- 기존 공통 `button`, `surface`, `menuTile` 렌더러를 사용합니다. v2 외형은 `components/styles.css`와 역할별 CSS에서, v2 래퍼는 `components/render.mjs`에서 관리합니다. 버튼은 `components/button.css`, 아이콘 메뉴 받침은 `components/menu-tile.css`로 대표 화면과 공유합니다. 기존 CSS를 전역 수정하지 않습니다.
- 공통 마일리지 카드·진행바: `/v2/components/#mileage`에서 기본·사용 가능 0·잔액 0·상한 4가지 검토용 잔액을 비교합니다. 기존 내정보·바코드의 `screens/my-info-3d-test/mileage-card.mjs`를 그대로 호출하며 원본 Figma M·원형 표시점 에셋을 참조합니다. `components/mileage.mjs`는 v2 경로·데이터 검증, `components/mileage.css`는 v2 재질만 담당합니다.
- 마일리지 입력은 `available`, `total`, `shared`, `sharedCount`로 나눕니다. 진행바는 표시용 meter이며 슬라이더가 아닙니다. `rangeMin`/`rangeMax`는 시각적 표시 범위만 정하고 실제 잔액이나 사용 가능 금액을 계산하지 않습니다. 범위 초과 시 그래픽만 제한하고 실제 금액 텍스트는 유지합니다. 안내·내역보기 버튼은 검토용 안내만 표시하며 실제 API에 연결하지 않습니다.
- 공통 목록 행: `/v2/components/#list-row`에 기본·설명형, 3D 아이콘형, 우측 정보형과 긴 내용 예시를 제공합니다. 기존 `listRow`, `surface`, `divider` 렌더러와 내정보의 `menuArt`·디자이너 에셋을 재사용합니다. `components/list-row.mjs`와 `components/list-row.css`에서 v2 조합과 재질을 관리하며 카드 가장자리만 입체적으로, 각 행의 글자·금액·화살표는 평면으로 표현합니다. 정보 행은 버튼이 아니며 이동 화살표·눌림 효과가 없습니다.
- 목록 행의 6개 상태는 기본·누르는 중·비활성·처리 중·오류·성공입니다. 처리 중과 비활성은 네이티브 버튼을 비활성화하고, 처리 중에는 `aria-busy`를 표시합니다. 오류·성공은 문구와 색을 함께 표시합니다. 클릭·키보드·터치는 검토용 상태 문구만 갱신하며 실제 조회나 화면 이동은 하지 않습니다.
- 공통 섹션 제목·우측 액션: `/v2/components/#section-heading`에 기본형·설명형·우측 액션형·정보 안내형·긴 제목 5개 예시를 제공합니다. 기존 `sectionHeading`, `textButton`, `iconButton`, `surface` 렌더러를 재사용하고 기본 출력은 유지합니다. 제목·설명·정보 아이콘은 평면이며 우측 ‘전체보기’ 액션도 회색 글자·화살표로 차분하게 표시합니다. 후기작성 등 주요 행동과 위계를 구분하고 터치 영역은 유지합니다. 긴 제목은 생략하지 않고 줄바꿈하며 좁은 폭에서는 액션을 다음 줄로 배치합니다.
- 정보 버튼은 독립된 48px 터치 영역이며 `aria-controls`·`aria-expanded`와 인라인 안내를 연결합니다. 우측 액션의 6개 상태는 ‘상태 비교’에서 확인합니다. 비활성·처리 중은 네이티브 버튼을 비활성화하며 처리 중에는 `aria-busy`를 표시합니다. 샘플 동작은 검토용 문구만 갱신하며 실제 내역을 조회하지 않습니다. `components/section-heading.mjs`와 `.css`에서 조합·외형을 관리하며 이번 단계에는 앱 대표 화면에 적용하지 않습니다.
- 공통 선택 요소: `/v2/components/#group-selection`에 체크박스·라디오·토글을 함께 표시합니다. 기존 `choice`·`toggle` 렌더러와 네이티브 입력을 재사용하며 기본 출력은 유지합니다. 체크박스 사각형·라디오 중앙 점·토글 손잡이에만 낮은 입체감을 주고 글자·설명은 평면으로 유지합니다. 전체 행은 최소 48px 터치 영역이며 외형과 조합은 `components/selection.css`·`.mjs`에서 관리합니다.
- 공통 입력: `/v2/components/#group-inputs`에 실제 홈의 매장 검색바·텍스트·비밀번호를 함께 표시합니다. 기존 `textField`·`passwordField` 렌더러와 네이티브 입력을 재사용하며 기본 출력은 유지합니다. v2 조합과 외형은 `components/input.mjs`·`.css`에서 관리합니다. 텍스트·비밀번호 입력은 `tokens.css`의 `--v2-input-*` 별칭으로 실제 홈의 연한 하늘색 그라데이션·부드러운 raised 그림자·캡슐 곡률을 공유합니다. 홈 자체는 수정하지 않습니다. 48px 높이, 16px 입력 글자, 16px 좌우 여백, 모든 상태의 1px 테두리를 유지하며 라벨·입력값·도움말에는 입체 효과를 넣지 않습니다. 입력 중은 눌린 마감, 비활성·읽기 전용은 평면 중립 표면으로 구분합니다.
- 비밀번호 표시·숨기기는 입력값과 레이아웃을 유지하며 버튼의 접근성 이름·선택 상태를 함께 갱신합니다. 비활성은 입력과 표시 버튼을 모두 막고, 읽기 전용은 조회·복사를 유지합니다. 확인 중은 입력을 막지 않으며 수정하면 이전 확인 중·오류·완료 표시를 해제합니다. 상태 비교는 접어서 제공하고 실제 웹 포커스·터치 동작은 유지합니다. 원본 캔버스·홈·내정보·바코드 대표 화면에는 적용하지 않습니다.
- 라이브 입력 예시는 입력 영역을 벗어난 뒤 필수 항목의 빈 값만 안내하며, 표시·숨기기 버튼으로 이동하는 것은 입력 영역을 벗어난 것으로 보지 않습니다. 최초 입력부터 오류를 표시하거나 닉네임·비밀번호 길이 규칙을 임의로 만들지 않습니다. 오류는 도움말 위치에서 원인·수정 방법과 `aria-invalid`로 표시합니다. 실제 비밀번호를 입력하지 않도록 안내하며 계정 조회·API·저장소·로그 전송을 사용하지 않습니다.
- 전체 선택은 선택 가능한 체크박스만 묶고 일부 선택을 네이티브 `indeterminate`로 표시합니다. 라디오는 그룹당 하나만 선택하며 토글은 샘플 내 켜짐·꺼짐 안내만 갱신합니다. 미선택·선택·부분 선택 및 앱 동작 상태는 접힌 ‘상태 비교’에서 확인합니다. 비활성·처리 중은 기존 선택 값을 유지한 채 변경을 막습니다. 저장 오류·완료 문구는 선택 여부와 분리된 예시이며 실제 API·설정 저장·브라우저 저장소를 사용하지 않습니다. 마우스 올림·포커스 비교 패널은 만들지 않지만 실제 키보드·터치·강제 색상 기능은 유지합니다. 원본 캔버스와 앱 대표 화면에는 적용하지 않습니다.
- 글꼴은 기존 Pretendard Regular 400 / Bold 700 에셋을 읽기 전용으로 참조합니다.
- `/v2/my-info/`: 내정보 대표 화면을 연결했습니다. 기존 렌더러의 에셋 경로 옵션과 v2 공통 마일리지 카드를 사용합니다. 기존 화면 CSS는 열린 Shadow DOM 안에서 읽기 전용으로 재사용하여 검토 메뉴와 배경에 영향을 주지 않습니다. iframe·스크린샷으로 화면을 대체하지 않습니다. 상단에는 화면 기능에 대한 짧은 설명만 표시합니다.
- 내정보는 390 × 996을 기준으로 프로필·최근 방문·6개 메뉴·하단 네비게이션의 기존 크기와 위치를 유지합니다. 앱 배경은 Figma 35:76의 흰색→연한 파랑(RGB 222, 233, 249), 155.7683도 그라데이션이며 `--v2-screen-top`/`--v2-screen-bottom`으로 관리합니다. 하단 현재 메뉴에는 작은 연보라색 선택 배경(`--v2-nav-selected-surface`)과 진한 보라색·700 굵기 글자를 적용합니다. 기존 26px 3D 아이콘과 중앙 바코드 에셋은 유지하며 발광·애니메이션은 추가하지 않습니다. 토큰 별칭으로 v2 공통 컬러와 글꼴을 연결합니다. 버튼은 시안 확인용 안내창만 열고 실제 서비스에 연결하지 않습니다.
- `/v2/barcode/`: 390 × 846 지도 위 시트 형태를 유지합니다. 기존 바코드 렌더러에 선택적 `renderBalance`를 추가해 내정보와 동일한 v2 공통 마일리지 카드·원본 M 에셋을 사용합니다. 기존 기본 렌더링은 유지합니다. 스캔 영역은 96px이며 바에는 입체 효과를 적용하지 않습니다. 사용 가능 금액이 0이면 사용 버튼만 비활성화하고 적립 버튼과 이유 설명은 유지합니다. 시트 닫기·다시 보기와 검토용 안내창을 제공하며 실제 회원 조회·적립·사용 API는 호출하지 않습니다. 시트 안에는 하단 내비게이션을 중복 추가하지 않습니다.
- `/v2/home/`: 390 × 846 지도 탐색 화면을 연결했습니다. 네이버 지도 정적 배경과 Figma 원본 검색·카테고리·핀·하단 메뉴 에셋을 유지합니다. 검색바는 상단 24px, 업종 칩은 기존 76/72/64 × 38px, 하단 메뉴는 바닥에서 20px 띄우고 C안 선택 받침·밑줄을 적용합니다. 검색은 검토 안내만 열고 업종은 선택 표시만 전환합니다. 실제 지도 API·위치·검색·적립 호출은 하지 않습니다. 하단 옅은 파랑 처리는 기존 시안을 재사용합니다.
- 화면 토큰 별칭(`components/screen.css`), 검토 레이아웃(`components/screen-stage.css`), Shadow DOM과 안내창(`components/screen-preview.mjs`)은 홈·내정보·바코드에서 함께 사용합니다. 공통 안내창은 검색 폼에서도 같은 `showPreview`를 사용합니다.
- 마이랜드·오지파크는 제목만 표시합니다.

하단 내비게이션의 선택 표시는 승인된 C안으로 통일합니다. `components/bottom-navigation.css`에서 기존 연보라색 받침과 아이콘 색감을 유지하고 현재 메뉴명 아래에 20×2px 밑줄을 표시합니다. 중앙 바코드 버튼에는 밑줄을 붙이지 않습니다. 내정보는 기존 공통 렌더러와 이 스타일을 연결하며, 우측 A/B/C 비교 영역과 비교 전용 코드·스타일은 제거했습니다. 현재 메뉴는 `aria-current="page"`와 기존 `is-selected`로 지정하며 다른 메뉴를 눌러도 검토 안내만 열고 현재 화면의 선택 표시는 유지합니다. 확인 주소: `/v2/my-info/`.

공통 컴포넌트 페이지에는 `#search` 검색바, `#categories` 업종 칩, `#navigation` 하단 메뉴를 독립 샘플로 제공합니다. 검색바·업종 칩은 실제 홈의 `screens/my-info-3d-test/home-controls.mjs`, 하단 메뉴는 기존 `navigation.mjs`를 호출합니다. 원본 CSS와 에셋은 열린 Shadow DOM 안에서 재사용하며, 샘플만의 배치 외에 스타일을 복제하지 않습니다. 검색은 확인 문구만 표시하고, 업종·하단 메뉴 선택은 샘플 안에서만 변경됩니다. 기존 대표 화면에는 영향을 주지 않습니다. 업종 칩은 38px 시각 높이와 44px 터치 영역을 유지합니다.

여러 줄 입력은 `/v2/components/#multiline-input`에 추가했습니다. 기존 `textarea` 렌더러를 읽기 전용으로 재사용하고 `components/input.mjs`·`.css`에서 한 줄 입력과 같은 재질·글꼴·상태 규칙을 공유합니다. 16px 곡률, 기본 최소 높이 144px, 세로 크기 조절(최대 320px), 아래쪽 안내·카운터를 제공합니다. 기본은 `maxLength:null`이며 제한·카운터가 없습니다. 선택형 200자 예시는 기존 공통 textarea의 기본 제한을 보여줄 뿐 실제 문의 정책을 바꾸지 않습니다. 카운터는 브라우저 maxlength와 같은 UTF-16 단위이며 이모지 등은 2자 이상으로 계산될 수 있습니다. 한글 조합 중 내용을 다시 쓰거나 자르지 않으며 오류 재검증은 조합 완료 후 진행합니다. 비활성·읽기 전용은 값을 유지하고, 확인 중은 계속 작성할 수 있습니다. 입력값은 API·로그·저장소에 전송하지 않습니다. 원본 의견보내기의 제한·카운터 없음은 유지합니다.

확인창은 `/v2/components/#dialogs`의 ‘안내·확인’ 그룹에 추가했습니다. 기존 `dialog`와 `button` 렌더러는 수정하지 않고 재사용하며, 안내·일반 확인·삭제 확인 3종을 함께 보여줍니다. 너비 최대 320px, 안쪽 여백 24px, 곡률 20px와 얕은 흰 표면 재질을 사용합니다. 주요·보조 버튼은 기존 v2 마감, 삭제 버튼은 붉은색으로 구분합니다. 정적 예시는 `inert`이고 ‘열어보기’는 네이티브 `dialog`로 열립니다. 짧은 내용은 취소 버튼 우선 포커스, 긴 내용은 제목부터 읽도록 초기 포커스와 스크롤을 맞춥니다. Escape·취소·확인·배경 클릭으로 닫고 호출 버튼으로 포커스를 돌려줍니다. 결과는 예시 안내만 갱신하고 실제 설정·리뷰·데이터는 변경하지 않습니다. 원본 캔버스와 대표 화면의 검토용 안내창은 유지합니다.

영역 안 안내는 `/v2/components/#notices`의 ‘안내·확인’ 그룹에 추가했습니다. 기존 `notice` 렌더러를 읽기 전용으로 재사용하며 정보·주의·오류·완료 4종을 함께 보여줍니다. 16px 안쪽 여백·12px 간격·12px 곡률·20px 아이콘을 유지합니다. 옅은 상태색 표면은 평면이며 32px 아이콘 받침에만 얕은 입체감을 줍니다. 문구와 아이콘으로도 상태를 구분하고 안내 전체를 버튼처럼 만들지 않습니다. 기존 아이콘과 같은 1.75px 선 굵기의 SVG를 사용하므로 아이콘 글꼴 다운로드에 의존하지 않습니다. `components/notice.mjs`·`.css`와 `tokens.css`의 전용 별칭에서 관리합니다.

기본 출력과 정적 예시는 live region이 아닙니다. 실제 동작 이후 갱신 안내가 필요할 때만 `renderNotice({live:true})`로 오류는 `alert`, 나머지는 `status`를 지정할 수 있습니다. 안내를 자동으로 닫거나 포커스를 이동하지 않습니다. 실제 앱 저장·사진 선택·네트워크와 연결하지 않으며 원본 캔버스와 홈·바코드·내정보 대표 화면은 변경하지 않습니다.

빈 화면·불러오기 오류는 `/v2/components/#empty-feedback`에 함께 추가했습니다. 원본 공통 `feedback`·`button` 렌더러를 변경하지 않고 재사용하며, 방문 내역 없음과 검색 결과 없음의 문구를 구분합니다. 390px 이내의 흰 표면, 20px 곡률, 56px 아이콘 받침과 24px SVG를 사용합니다. 3D 효과는 작은 아이콘 받침과 기존 주요 버튼에만 적용하고 본문과 표면은 평면으로 유지합니다. 빈 상태에는 의미 없는 새 버튼을 추가하지 않습니다.

‘다시 시도’는 실제 조회가 아닌 500ms 검토용 전환입니다. 처리 중에는 버튼 위치·영역 높이를 유지하고 중복 실행을 막으며, 내용 표시·내역 없음·오류 유지 결과를 같은 영역에 보여줍니다. 초기 예시는 자동으로 읽지 않고 동작 후 안내만 `status`로 갱신합니다. 오류가 유지되면 원래 버튼으로, 버튼이 사라지면 결과 제목으로 키보드 포커스를 이어 줍니다. 다른 컨트롤로 이동한 사용자의 포커스를 빼앗지 않습니다. ‘오류 다시 보기’는 대기 중 결과도 취소합니다. API·저장소·실제 앱 데이터에는 접근하지 않습니다.

로딩·스켈레톤은 `/v2/components/#loading`의 별도 ‘로딩’ 그룹에 추가했습니다. 기존 `loading`·`skeletonRow` 렌더러를 읽기 전용으로 재사용하며 24px·16px 표시와 프로필 요약·방문 내역·마일리지 예시를 함께 보여줍니다. 목록은 현재 공통 목록 행을, 마일리지는 현재 공통 카드의 렌더러·에셋·구조를 그대로 사용합니다. 별도 마일리지 디자인을 만들지 않고 불러오기 전후 카드 크기를 유지합니다. 3D 재질은 바깥 표면에만 남기고 임시 면은 평면으로 표현합니다.

‘표시 상태’에서 불러오는 중과 내용 표시를 전환합니다. 대기 중 값과 컨트롤은 `aria-hidden`·`inert`로 제외하고, 내용을 표시하면 금액은 읽을 수 있으며 연결되지 않은 비교용 버튼만 비활성으로 유지합니다. 포커스를 이동하지 않으며 API·저장소·실제 앱 데이터에는 접근하지 않습니다. 움직임 줄이기 설정에서는 정지하고 고대비 모드에서도 복제된 금액이 다시 보이지 않도록 마스킹합니다. 원본 캔버스와 대표 화면은 변경하지 않습니다.

스낵바는 `/v2/components/#snackbar`의 ‘안내·확인’ 그룹에 추가했습니다. 기존 `snackbar` 렌더러를 읽기 전용으로 재사용하며 완료 안내·실행 취소·재시도 3종을 함께 보여줍니다. 짙은 표면·흰 글자·밑줄 동작 버튼과 16px 가로/12px 세로 여백·12px 곡률을 유지하고, 얕은 입체감은 표면 가장자리에만 적용합니다. 긴 문장은 줄바꿈하고 좁은 곳에서는 44px 동작 버튼을 다음 줄로 배치합니다. 처리 중·비활성 비교는 접힌 ‘상태 비교’에 분리했습니다.

‘열어보기’는 검토 영역 안에서만 한 개씩 표시하고 동일 안내를 중복해서 만들지 않습니다. 검토용 알림은 자동으로 닫지 않으며 실행 취소·재시도는 예시 문구만 표시합니다. 초기 시안은 `inert`이고 자동으로 읽지 않으며, 사용자가 동작한 뒤에만 별도 `status`로 안내합니다. 알림을 열 때 포커스를 가져가지 않고 포커스된 버튼이 사라지면 ‘알림 열기’로 이어 줍니다. 실제 API·저장소·앱 데이터에 접근하지 않습니다. 원본 캔버스와 대표 화면은 유지합니다.

전화번호·숫자 입력은 `/v2/components/#phone-input`과 `#numeric-input`의 기존 ‘입력’ 그룹에 추가했습니다. 기존 입력 렌더러와 홈 검색바의 표면·입체감·48px 높이를 그대로 재사용하며 전용 CSS나 별도 색상을 만들지 않습니다. 전화번호는 `tel`/`inputmode=tel`, 숫자는 `text`/`inputmode=numeric`을 사용합니다. 공백·하이픈을 허용한 숫자 10~11자리와 0 이상의 정수는 원본 캔버스의 검토용 규칙이며 실제 앱 인증·금액 정책을 새로 정하지 않습니다.

처음에는 오류를 표시하지 않고 입력창을 벗어난 뒤 형식을 안내합니다. 이후 수정하면 다시 검사하되 한글 조합 중에는 안내를 갱신하지 않습니다. 자동 포맷·값 삭제·숫자 변환·고정 길이 제한 없이 앞자리 0과 긴 문자열도 유지합니다. 기본·입력 중·입력 완료·비활성·읽기 전용·확인 중·오류·완료는 접힌 상태 비교에서 확인하며 실제 인증·저장·API·저장소에 연결하지 않습니다. 원본 캔버스와 대표 화면은 유지합니다.

v2 홈 검색바와 텍스트·비밀번호·전화번호·숫자·여러 줄 입력의 placeholder는 별도 `--v2-input-placeholder` 토큰의 연한 중립 회색으로 통일합니다. 사용자가 더 연한 표시를 승인한 검토용 변형이며 placeholder만 배경 대비 3:1 이상을 확인합니다. 일반 크기 텍스트의 WCAG AA 4.5:1을 충족하는 안은 아니므로 실제 앱 적용 전 재검토가 필요합니다. 실제 입력값·항목명·도움말·오류 안내는 기존 색상과 4.5:1 검증을 유지합니다. 원본 캔버스와 기존 `/screens/my-info-3d-test/` 화면은 변경하지 않습니다.

다음 후보는 도움말·툴팁입니다. 마일리지 설명과 연결할 수 있는 공통 패턴부터 검토합니다. 내정보 하위 화면의 기획 대조도 별도 승인 후 진행합니다.

## 로컬 검증

```sh
node scripts/build-preview.mjs
node --test v2/render.test.mjs v2/build.test.mjs
PLAYWRIGHT_PATH=/Users/mj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright node v2/navigation.browser.test.cjs
PLAYWRIGHT_PATH=/Users/mj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright node v2/subnavigation.browser.test.cjs
PLAYWRIGHT_PATH=/Users/mj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright node v2/foundations.browser.test.cjs
PLAYWRIGHT_PATH=/Users/mj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright node v2/design-system/foundation-parity.browser.test.cjs
PLAYWRIGHT_PATH=/Users/mj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright node v2/components/style-parity.browser.test.cjs
PLAYWRIGHT_PATH=/Users/mj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright node v2/components/components.browser.test.cjs
PLAYWRIGHT_PATH=/Users/mj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright node v2/components/explorer.browser.test.cjs
PLAYWRIGHT_PATH=/Users/mj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright node v2/components/home-controls.browser.test.cjs
PLAYWRIGHT_PATH=/Users/mj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright node v2/components/list-row.browser.test.cjs
PLAYWRIGHT_PATH=/Users/mj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright node v2/components/section-heading.browser.test.cjs
PLAYWRIGHT_PATH=/Users/mj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright node v2/components/selection.browser.test.cjs
PLAYWRIGHT_PATH=/Users/mj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright node v2/components/input.browser.test.cjs
PLAYWRIGHT_PATH=/Users/mj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright node v2/components/typed-input.browser.test.cjs
PLAYWRIGHT_PATH=/Users/mj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright node v2/components/placeholder.browser.test.cjs
PLAYWRIGHT_PATH=/Users/mj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright node v2/components/multiline.browser.test.cjs
PLAYWRIGHT_PATH=/Users/mj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright node v2/components/dialog.browser.test.cjs
PLAYWRIGHT_PATH=/Users/mj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright node v2/components/notice.browser.test.cjs
PLAYWRIGHT_PATH=/Users/mj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright node v2/components/feedback.browser.test.cjs
PLAYWRIGHT_PATH=/Users/mj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright node v2/components/loading.browser.test.cjs
PLAYWRIGHT_PATH=/Users/mj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright node v2/components/snackbar.browser.test.cjs
PLAYWRIGHT_PATH=/Users/mj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright node v2/components/mileage.browser.test.cjs
PLAYWRIGHT_PATH=/Users/mj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright node v2/my-info/my-info.browser.test.cjs
PLAYWRIGHT_PATH=/Users/mj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright node v2/barcode/barcode.browser.test.cjs
PLAYWRIGHT_PATH=/Users/mj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright node v2/home/home.browser.test.cjs
```

기존 `scripts/serve-preview.py`로 `dist/`만 제공합니다. 켜진 서버가 있으면 중복 실행하지 않습니다. 브라우저 테스트 주소는 `V2_BASE_URL`로 바꿀 수 있습니다. 테스트는 로컬 Chrome을 사용합니다.

320, 375, 390, 414, 768, 1024, 1440px에서 직접 진입·새로고침·뒤로 가기, 그룹 유지·하위 항목 이동, 메뉴 키보드 조작·리사이즈, 가로 넘침, 글꼴과 대비를 확인합니다. 긴 한글 제목 및 글꼴 다운로드 실패도 검사합니다. 공개 빌드는 테스트·Markdown·숨김 파일을 제외합니다.

이 단계에서는 새 패키지, Figma 쓰기, 라이브 API 연결, 푸시 또는 배포를 하지 않습니다.
