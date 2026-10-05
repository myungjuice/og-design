# 내정보 잔여 화면 이관 계획

> **For agentic workers:** Use the approved continuous migration workflow, TDD and one final read-only review. Independent domains may run in parallel; the parent owns shared adapter and integration.

**Goal:** 기존 내정보 본체 23개 중 보류한 Q오더를 제외한 화면을 v2 3D 스타일로 연결합니다.
**Architecture:** 원본 렌더러와 보드 상태를 읽기 전용으로 재사용합니다. Shadow DOM에 공통 v2 재질을 연결하고 기본 상태만 먼저 생성, 비교는 펼칠 때 생성합니다.
**Tech Stack:** Vanilla HTML/CSS/ES modules, Node tests, headless Chrome/Playwright.
**Spec:** 사용자의 “내정보화면 남은 거 쭉 이어서 진행” 및 v2/README.md 기존 스타일·정적 시안 제약.

## Constraints

- 원본 design-system/screens 수정 금지. 커밋·푸시·배포하지 않습니다.
- 기존 OG 토큰·Pretendard·흰 앱 표면·다크 검토 영역을 유지합니다.
- Q오더 상세와 23개 본체에 포함하지 않는 캐릭터 선택은 보류입니다.
- 이전 동작/내용/로그인/빈 목록/비활성 조건을 보존합니다. 서비스 버튼·입력은 inert, 읽기 본문 스크롤은 열어둡니다.
- 390×846 기준, 320px에서 너비만 축소하고 가로 넘침 방지. 원본 3D 대표 내정보는390×996 유지.
- 서비스 메뉴는 이용내역과 중복이어도 독립 원본 시안으로 이관합니다. 실제 메뉴 연결/삭제를 결정하는 변경은 하지 않습니다.
- 사용자 검토 승인과 구현 완료를 구분하여 검토 목록에 미검토로 기록합니다.

## Review focus

- 원본 사용자 상태 조건을 빠뜨리지 않음: 비로그인/등록됨/빈 목록/수정 전후.
- 폼 placeholder와 값/readonly/disabled가 혼동되지 않음.
- 팝업 배경이 클릭/읽기 노출되지 않고 패널 및 하단 액션이 화면 안에 남음.
- 긴 제목/본문/문서/연락처가 잘리지 않고 스크롤 가능함.
- 서비스 버튼 및 외부 링크/저장/공유/인증/탈퇴가 실제 실행되지 않음.

## Task 1 · 공유 정적 이관 어댑터 (parent)

Create v2/my-info/source-review.mjs, source-review.css, source-review.test.mjs.
Produces extractSourceScreens(boardHTML,rootClass), adaptSourceScreen(html), renderSourceGallery({id,title,intro,states,cssFiles}), setupSourceGallery(root,id).
- [x] 테스트 작성 및 실패 확인: 중첩 section 추출, 정적 서비스/본문 분리, 비교 지연 생성.
- [x] 기존 공통 CSS/토큰 별칭 및 동일 SVG 선 계열을 연결.
- [x] 좁은 단위 테스트 통과 확인.

## Task 2 · 계정/설정 (independent agent)

Create v2/my-info/account-settings.mjs/.css/.test.mjs.
Consumes Task1 gallery; produces renderAccountSettingsReview/setupAccountSettingsReview.
Sections: membership, settings, password, account. Source function/board state and conditions preserved.
- [x] 원본과 토큰/컴포넌트 확인, 단위 테스트 먼저 실패 확인.
- [x] 4개 섹션 이관 및 원본 데이터·입력/상태/팝업 보존.
- [x] 단위 테스트 통과 확인, 상태 수·누락 사항 보고.

## Task 3 · 문의/문서 (independent agent)

Create v2/my-info/support-pages.mjs/.css/.test.mjs.
Produces renderSupportPagesReview/setupSupportPagesReview.
Sections: support, faq, opinion, customer-center, policies, policy-detail.
- [x] 테스트 먼저 실패 확인, 원본 정책·날짜·연락처·로그인 조건 확인.
- [x] 6개 섹션 이관, 실제 법률 문구/운영시간/FAQ 내용 창작하지 않음.
- [x] 단위 테스트 통과 확인.

## Task 4 · 리뷰 작성/서비스 (independent agent)

Create v2/my-info/review-writing.mjs/.css/.test.mjs.
Produces renderReviewWritingReview/setupReviewWritingReview.
Sections: photo-review, review-write, services.
- [x] 테스트 먼저 실패 확인, 사진 유무·선택·삭제/도움말·저장 여부 조건 확인.
- [x] 3개 섹션 이관, 사진은 공통 빈 이미지, 매장명은 구체적인 배치 예시.
- [x] 단위 테스트 통과 확인.

## Task 5 · 통합/검증/기록 (parent)

Modify v2/render.mjs, my-info/render.mjs, preview.mjs, styles.css, subnavigation.mjs/tests, README.md. Add remaining.browser.test.cjs.
- [x] 메뉴와 관련 그룹 연결, 주요 진입 연결은 기존 검토 탐색 범위만.
- [x] 전체 Node tests 및 build 확인. Browser 단계와 build 병렬 실행 금지.
- [x] 각 상태 × 320/375/390/414/768/1024/1440/1920px, 비교 마운트/중복/스크롤/팝업/가로 넘침 검사.
- [x] 독립 읽기 전용 리뷰 및 기존 대표/공지/2단 메뉴 회귀 확인.
- [x] 최신 본체22/23(Q오더 보류), 공통25/25, 보완2, 검토대기30묶음 기록. 근거 상태별 확인.
- [x] 변경·제약·링크 보고 자료 정리. 실제 서비스나 배포는 하지 않음.

## Progress and rulings

- Baseline: 전체 Node323/323 (2026-10-04). 이전 사용자의 현 체크아웃 작업 동의에 따라 main에서 유지하며 변경 분리 범위를 지정합니다.
- Approval: 사용자가 잔여 화면 연속 작업을 명시적으로 승인. 화면별 재승인을 요청하지 않습니다.
- Execution: 도메인별 독립 파일로 병렬, parent가 공통 어댑터/통합 담당. 공유 파일은 자식 수정 금지.
- Domain counts: 계정/설정4개·22상태, 문의/문서6개·20상태, 리뷰/서비스3개·14상태. 합계13개·56상태.
- TDD: 공유 어댑터3개→FAQ 읽기/label 활성화 보완으로5개, 계정6개, 문의6개, 리뷰4개, 통합2개 모두 RED→GREEN. 전체 Node 최신346/346, 실패0 (2026-10-04).
- Review: 독립 읽기 전용 리뷰에서 원본 내용·조건 누락 없음. FAQ 가로 영역의 명시적 키보드 진입과 native label 활성화 확인을 권고했습니다. FAQ region 추가 후 ArrowRight 스크롤 통과; label 클릭이 체크를 바꾸는 것을 재현한 뒤 label도 inert로 차단하여 값 유지 확인했습니다.
- Visual fixes: textarea가 한 줄 입력의999px 곡률·48px 최소 높이를 상속하는 것을 재현했습니다. 공통 여러 줄 클래스 연결로16px 곡률과 원본 의견160px 최소 높이를 복원했습니다. 리뷰 입력의 데스크톱 resize 손잡이는 원본처럼 숨깁니다. 공유 아이콘의 relative 배치가 리뷰 도움말/사진 삭제의 absolute 배치를 덮는 것도 재현하여 도메인 위치 규칙을 복원했습니다.
- Harness fixes: 너비별 URL의 hash만 바꾸면 동일 문서로 이동해 비교 마운트 수가 유지됩니다. 각 너비에서 reload하여 초기13개 마운트 조건을 확인합니다. 기존 브라우저 자동favicon.ico404는 위치를 확인하여 검사에서 제외하되 실제 화면 에셋/스타일/스크립트 오류는 제외하지 않습니다.
- Regression: 대표 내정보6너비, 2단 메뉴7너비·7경로, 리뷰 내역5상태×8너비, 공지10상태×8너비, 공지 상세3상태×8너비 통과. 대표390×996와 C 선택 표시 유지. 원본 design-system/screens diff없음, git diff --check통과, HEAD52b97e6 그대로.
- Acceptance boundary: 구현과 사용자 검수는 별개입니다. 새13개는 모두 미검토이며 기존17묶음에 더해30묶음을 README에 기록했습니다. Q오더·캐릭터 선택·실제서비스/API·법률 문구 제작·서비스 메뉴 통합은 범위 밖으로 유지합니다.
- Final browser: remaining.browser.test.cjs 최종 통과. 13개 본체·56개 상태×8너비, 입력 곡률/높이, 리뷰 닫기/사진 삭제 위치, 팝업 포함, 정적 제어, lazy중복 방지, 휠/End/ArrowRight 읽기 및 메인4개 진입/뒤로 이동을 확인했습니다. 공개 프리뷰406파일 빌드이며 원본·HEAD·배포 상태는 유지합니다.
