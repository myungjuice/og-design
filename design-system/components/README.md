# 공통 컴포넌트 사용법

캔버스와 새 HTML 화면은 같은 `render.mjs`와 CSS를 사용합니다.
컴포넌트 HTML을 복사하지 않고, 문구·값·상태를 전달해 배치합니다.

## 파일 역할

```text
design-system/
  foundations/app-tokens.css     색상·타이포·여백·입체감
  components/
    index.mjs                   공통 함수 가져오기
    index.css                   토큰·폰트·컴포넌트 스타일 가져오기
    core.mjs                    글자/속성 이스케이프, 기본 ID, 아이콘
    button/
      render.mjs                버튼 HTML 원본
      button.css                버튼 스타일 원본
    input/
      render.mjs                입력·여러 줄 입력·비밀번호 원본
      input.css
      variants.css
    ...                         나머지 종류도 같은 구성
  canvas/
    buttons.js                  공통 버튼으로 만드는 상태 예시·설명
    static-specimens.js         예시 복제·정적 상태 배치
    *.css                       캔버스 설명·비교 배치만 담당
screens/                        새 페이지: 컴포넌트를 가져와 조합
```

스타일 수정은 해당 컴포넌트 CSS, 구조 수정은 해당 `render.mjs`에서 합니다.
화면 CSS에는 화면 배치만 작성합니다. 버튼 색·높이 등을 화면에서 다시 정의하지 않습니다.
토큰을 바꾸면 해당 토큰을 사용하는 모든 컴포넌트에 반영됩니다.

## 페이지에서 사용하기

아래는 사용법입니다. 새 페이지 시안을 미리 만든 것은 아닙니다.

```html
<link rel="stylesheet" href="/design-system/components/index.css">
<main id="screen" inert></main>
<script type="module">
  import {
    surface, sectionHeading, textField, button
  } from '/design-system/components/index.mjs';

  document.querySelector('#screen').innerHTML = surface({
    contentHTML:
      sectionHeading({ title: '닉네임 변경' }) +
      textField({
        label: '닉네임',
        value: '맑은 땅콩',
        placeholder: '닉네임 입력',
        hint: '사용할 닉네임을 입력해 주세요.'
      }) +
      button({ label: '저장' })
  });
</script>
```

`inert`는 정적 디자인 예시의 조작을 막습니다. 디자인의 비활성 상태는 `disabled`로 별도 지정합니다.
캔버스 이동·확대·AI 프롬프트는 컴포넌트 외부 도구이므로 그대로 작동합니다.
모든 렌더러는 HTML 문자열만 반환합니다. API·타이머·파일 업로드·팝업 열기를 실행하지 않습니다.

## 기본 컴포넌트 25종

| 그룹 | 공통 함수 | 주요 입력 |
| --- | --- | --- |
| 01 버튼 | button | label, variant, size, state, disabled, busy, className |
| 02 아이콘 버튼 | iconButton, textButton, favorite | label, name, info, expanded / selected |
| 03 한 줄 입력 | textField, passwordField | label, value, hint, type, placeholder / visible |
| 04 여러 줄 입력 | textarea | label, value, maxLength, hint |
| 05 검색창 | searchField | label, value, hint, submit |
| 06 체크박스 | checkbox | label, checked, disabled, description |
| 07 라디오 | radio | label, name, checked, disabled |
| 08 스위치 | toggle | label, checked, disabled, description |
| 09 탭·분할 선택 | tabs, tabPanel, segment | id, items, selected |
| 10 칩 | chip, radioChip | label, selected / checked, name |
| 11 배지 | badge, countBadge, unreadDot | label, tone / count / visible |
| 12 프로필·썸네일 | avatar, thumbnail | size / src, alt, state |
| 13 카드·구분선 | surface, menuTile, divider | contentHTML, depth / label, iconHTML / inset, vertical |
| 14 목록 행 | listRow | title, description, leading, iconHTML, value, interactive |
| 15 섹션 제목 | sectionHeading | title, description, action, infoButton, helpId |
| 16 진행 바·게이지 | progress, mileage | value, label / available, total, max, shared |
| 17 로딩·스켈레톤 | loading, loadingRow, loadingCard | label, size / busy, title, subtitle |
| 18 빈 화면·오류·안내 | feedback, notice | symbol, title, body, action / tone |
| 19 툴팁·팝오버 | tooltip, popover | id, message / title, body |
| 20 수량 조절 | quantity | value, min, max, locked |
| 21 바텀시트 | bottomSheet, sheetContent | title, bodyHTML, action, size |
| 22 다이얼로그 | dialog | title, body, actions |
| 23 스낵바 | snackbar | message, action |
| 24 날짜·시간 | calendar, timePicker | year, month, selected, today, disabled / selected, period, hour, minute |
| 25 이미지 보기·첨부 | imageViewer, attachments | src, alt, mode / state, progress |

버튼 variant: primary / secondary / text / icon / danger.
강제 상태 표현은 className: is-hover / is-focus / is-active(버튼) / is-pressed(텍스트 버튼·메뉴 등)를 사용합니다.
배지 tone: brand / neutral / info / success / warning / error.
썸네일 state: ready / loading / empty / error.
첨부 state: empty / ready / uploading / error / removed.
이미지 보기 mode: fit / zoom / error.

## 조합 규칙

- 다이얼로그·바텀시트·날짜 선택의 동작 버튼은 공통 button을 사용합니다.
- 정보 아이콘은 iconButton({ info: true })로 만들며 파란 사각 배경을 추가하지 않습니다.
- 카드 안의 콘텐츠는 contentHTML, 시트 본문은 bodyHTML로 조합합니다.
- 바텀시트의 높이·화면 하단 위치·뒤 화면의 딤 처리는 페이지 배치에서 지정합니다. size는 표시 구분값이며 높이를 자동 계산하지 않습니다.
- tooltip/popover는 안내 면만 만듭니다. 화면 안의 위치는 해당 화면의 앵커 영역에서 배치합니다.
- tabs의 id와 tabPanel의 id를 같게 지정합니다. index는 패널 순서, selected는 선택한 순서입니다.
- calendar의 month는 1~12입니다. selected/today/disabled에는 해당 월의 날짜 숫자를 전달합니다.
- mileage에는 사용 가능·총 보유·표시 끝값을 직접 전달합니다. 렌더러가 서비스 정책으로 잔액을 계산하지 않습니다.
- 문자열·속성값은 이스케이프합니다. contentHTML, bodyHTML, iconHTML, labelHTML, trailingHTML은 개발자가 작성한 마크업 전용입니다. 사용자 입력을 넣지 않습니다.
- id를 생략할 수 있는 함수는 고유 ID를 만듭니다. 직접 지정하는 id는 페이지 안에서 중복되지 않게 합니다.
- CSS 선택자는 .og- 접두사로 구분합니다. 별도 페이지에서 canvas.css나 static-specimens.css를 불러오지 않습니다.
- 예시 이미지 생성은 canvas/specimen-media.mjs에만 있습니다. 일반 화면은 자기 src/alt를 전달합니다.

## 수정 후 확인

```sh
node --test design-system/components/reuse.test.mjs
node design-system/components/reuse.browser.test.cjs
node --test --test-concurrency=2 design-system/canvas/*.test.cjs
```

브라우저 검사는 localhost:4173 서버와 Playwright/Chrome을 사용합니다.
Playwright가 전역 설치가 아니라면 PLAYWRIGHT_PATH에 설치 경로를 지정합니다.

reuse.browser.test.cjs는 공통 버튼 원본의 출력에 시험 표식을 넣어 캔버스·다이얼로그·시트·별도 페이지로 전달되는지 검증합니다.
별도 페이지는 공통 CSS만 로드해 버튼 스타일, ID, 수량 경계, 320/375/414/768 너비를 확인합니다.

## 기존 파일과의 관계

- concepts/my-info는 이전 비교 시안으로 유지합니다. 이번 공통 원본에 자동 연결된 페이지로 보지 않습니다.
- components/help/help.js, quantity/quantity.js, sheet/sheet.js는 이전 동작 실험용 파일입니다. 새 디자인 페이지에서는 가져오지 않습니다.
- canvas의 설명·그룹 배치·상태 비교는 재사용 컴포넌트에 포함하지 않습니다.
