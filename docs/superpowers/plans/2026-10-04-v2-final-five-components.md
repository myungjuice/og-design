# v2 마지막 기본 컴포넌트 5묶음 이관 계획

> **For agentic workers:** Use superpowers:executing-plans for sequential inline execution. User requested all five continuously, with visual review deferred.

**Goal:** 기본 컴포넌트를 20/25에서 25/25로 정리하고 사용자가 밤에 검토할 수 있게 기록한다.
**Architecture:** 기존 순수 렌더러를 읽기 전용 재사용하고 v2 파일에서 스타일·검토용 동작을 확장한다. ES 모듈·CSS·Node tests·로컬 Chrome 검증, 새 의존성 없음.
**Spec:** `docs/planning/component-inventory.md` C13/C20/C21/C24/C25와 사용자의 이번 연속 작업 승인. 캔버스는 원본 근거이며 v2 갤러리는 기존처럼 로컬 검토 동작을 제공한다.

## Global Constraints

- OG Pretendard 400/700, 기존 보라·하늘색 토큰과 얕은 3D 재질 유지. 어두운 검토 배경과 밝은 앱 표면 분리.
- 원본 캔버스, 임시 테스트 화면, v2 홈·내정보·바코드 대표 화면 유지. 삭제·배포·커밋·푸시 없음.
- 기존 사용자 승인에 따라 현재 checkout/main에서 작업. 새 worktree로 미커밋 작업을 누락하지 않음.
- 파일은 각 모듈 mjs/css/test.mjs로 분리. 공통 catalog/render/preview/index/build tests는 순차 연결.
- 실제 서비스·네트워크 업로드·API·저장소 없이 검토용 예시만 작동.
- 상태 비교 접기, 관련 항목 그룹 보기, 모든 ID 고유, 버튼 48px, 날짜 칸 최소44px/좁을 때 달력 내부 가로 이동.
- 오류·로딩은 인접 문구로 안내, 색만으로 전달하지 않음. 웹 키보드/포커스 유지하되 앱 예시에 마우스 상태를 대문짝처럼 노출하지 않음.
- 320/375/390/414/768/1024/1440 폭, 터치·모션 줄이기·강제 색상·오류 확인. 글꼴 실패/길어진 문구/좁은 높이도 점검.

## Review Focus

- 수량 0·최대·안전 정수·상한 없음: 잘못된 값 거절, 최소에서 삭제 안 함, 경계 비활성 후 포커스 유지.
- 시트 취소: 미적용 선택 폐기, 원래 선택 유지, ESC/바깥/닫기와 포커스 복원, body overflow 복원.
- 날짜 월말·윤년·월 이동: 달력 실제 날짜 유지, 범위 역선택·교차 월 명확, 선택 불가 날짜 적용 금지.
- 첨부 취소·삭제·실패: 업로드를 가장하지 않음, 이미지 유지/복원, Object URL 생성 안 함, 로컬 샘플만 사용.
- 겹친 닫기/긴 제목/낮은 viewport: 헤더·액션 접근 가능, 내용만 스크롤, 내부 넘침 외 문서 가로 넘침 없음.

### Task 1: C13 표면·구분선

**Files:** v2/components/surfaces.mjs/css/test.mjs + 공통 연결 파일.
**Interfaces:** renderSurface({contentHTML,depth:'flat'|'raised'|'inset',id}), renderDivider({inset,vertical}), renderSurfaceSamples(). 순수 trusted HTML slots; 수동 UI 없음.
- [x] 렌더러 재사용·변형 검증·수평/세로 separator·escaped ID·갤러리 구분 테스트 작성 후 RED.
- [x] 정보 카드/평면/얕은 파임, 전체/안쪽/세로 선 이관. 정보 표면에 hover/선택/눌림을 붙이지 않음.
- [x] GREEN 및 갤러리 관련 그룹 연결. 1px 선·16px inset, 좁을 때 세로 정보 쌓기.

### Task 2: C20 수량 조절

**Files:** v2/components/quantity.mjs/css/test.mjs + 공통 연결 파일.
**Interfaces:** renderQuantity({id,value,min,max,locked,state,label}), changeQuantity(value,delta,min,max), setupQuantitySamples(root).
- [x] 안전 정수·유한/없는 상한·최소·최대·잠금·라벨/문구·markup 테스트 RED.
- [x] 기존 quantity shell+동일 SVG 계열 +/-; 가운데 숫자 tabular, 버튼48px/20px icon. 1..5는 원본 예시이지 정책 아님.
- [x] 로컬 이벤트/경계 포커스/중복 초기화 방지. 비교는 inert, 비동기 상태는 인접 안내. GREEN.

### Task 3: C21 바텀시트

**Files:** v2/components/sheet.mjs/css/test.mjs + 공통 연결 파일.
**Interfaces:** renderSheet({id,title,bodyHTML,actions,modal,size}), renderSheetSamples(), setupSheetSamples(root).
- [x] 기존 sheetContent 재사용·라벨 고유·native dialog·정적 inert·긴 본문/탭/선택 테스트 RED.
- [x] 짧은 정렬/긴 이용내역 4탭/빈 상태. 기존 selection/tabs/feedback/button 재사용, 상단32px 재질·본문16px.
- [x] showModal focus trap, Escape/바깥/닫기, 적용/취소 분리, 스크롤 복원, 85dvh/visualViewport 높이. GREEN.

### Task 4: C24 날짜·시간 선택

**Files:** v2/components/date-time.mjs/css/test.mjs + 공통 연결 파일.
**Interfaces:** renderDatePicker({id,year,month,selected,today,disabled,range,state}), renderTimePicker({id,period,hour,minute,selected,state}), parseDate/date range pure helpers, setupDateTimeSamples(root).
- [x] 실제 달력 윤년/유효 날짜·disabled·오늘/선택·교차 월 범위·시간0..59·문자 탈출 테스트 RED.
- [x] 기존 calendar/rangeCalendar/timePicker read-only 재사용, 달력 숫자는 평면, 선택 원/월이동/시간 입력에만 재질.
- [x] 명확한 선택/적용/취소 검토, 월 이동 및 방향키, 범위 시작/끝, native select 시간. 선택 불가 예시22/23일 원본 유지. GREEN.

### Task 5: C25 이미지 보기·첨부

**Files:** v2/components/attachments.mjs/css/test.mjs + 공통 연결 파일, final-five.browser.test.cjs, README.
**Interfaces:** renderAttachments({id,state,src,alt,progress}), renderImageViewer({id,src,alt,mode,modal}), setupAttachmentSamples(root).
- [x] 기존 attachment/viewer shell·이미지 유효 경로·dimensions·상태·48px 삭제/닫기·native viewer modal 테스트 RED.
- [x] 샘플 에셋 추가/삭제/복원과 업로드 상태 미리보기 분리. 실제 파일 선택/업로드 없음. 기존 이미지 없음/실패 기본 표시 재사용.
- [x] 전체 보기/확대/실패/재시도와 포커스 복원, 확대 영역 내부 이동. GREEN.
- [x] 모든 그룹 브라우저 테스트·스크린샷 확인, 전체 unit/build/diff 검사와 기존 explorer/대표 화면 회귀 확인. 새 맥락 코드 리뷰 후 수정.
- [x] README 25/25, 메뉴 개수, 검토 대기7건(C11/C12+이번5), 검증 URL/명령, 후속 앱 전용 조합 검토 추천 기록. 배포 안 함.

## Execution ledger

- 2026-10-04: User approved continuous execution of remaining five, visual review deferred. Native inline selected to keep shared gallery wiring sequential. No additional approval pauses inside scope.
- Pre-flight: All tasks share catalog/render/preview/index; sequential registration prevents conflicting edits. Shared button/selection/tabs/media interfaces already exist; reuse without modifying representative consumers.
- Plan self-review: Each inventory row covered; no new business policy, no external side effect, no dependencies. Existing C10–C12 dirty work preserved.
- All five renderer modules and nine gallery entries implemented; focused render/integration tests 18/18 pass; public static build includes all modules. Original screen/canvas files untouched.
- Task verification: final-five browser checks cover seven widths 320–1440, unique IDs, quantity boundary focus, sort apply/cancel, history tabs, date/range/time, attachment restore/cancel, viewer zoom, low viewport, reduced motion and forced colors. Explorer regression passed.
- No commits: user authorized local work only; task ledger records unchanged BASE..HEAD and source files, not a commit delivery. Retain internal workspace until a later authorized integration.
- Final review: fresh-context review_final_five; no Critical, four Important, two Minor, Declined to judge empty.
- Final: regraded viewer retry focus loss as Important: removing the focused retry button without a usable destination interrupts keyboard operation in the modal. Included in one fix pass.
- Final: fixed safe integer plus boundary — renderQuantity MAX_SAFE_INTEGER markup RED→GREEN.
- Final: fixed long-title sheet action clipping — long sheet title at 390×400 browser RED→GREEN; heading is bounded and internally scrollable.
- Final: fixed close/open race — reopened modal scroll lock browser RED→GREEN; close cleanup owns its session and ignores already-handled native events.
- Final: fixed attachment image failure — aborted asset and restored retry browser RED→GREEN; source and delete/restore preserved.
- Final: fixed viewer retry focus — stable close-control browser RED→GREEN.
- Final: visual check found calendar header/footer clipped at 320px; regression reproduced RED, date-grid-only scroll keeps month navigation and apply visible. Preserve 44px day targets.
- Final: minor (deferred): responsive divider's visual orientation changes to horizontal at narrow width while aria-orientation remains vertical. Correct visual separator preserved; accessibility direction metadata requires follow-up.
- Final verification: 287/287 full Node tests; build 378 static files; final-five browser seven widths + content contrast/touch/font fallback/forced colors/reduced motion/no writes; five dedicated regression scenarios passed. Explorer and Home/Barcode/MyInfo representative regressions passed. git diff --check passed; original canvas and representative source paths unchanged. Local server remains 127.0.0.1:4173; no deployment/commit/push.
- Hallmark component-scope check: existing token palette/font preserved by user constraint; no new motion, fake chrome, invented metrics, external icon library, or interactive passive surfaces. Responsive visual QA reviewed. Separate accessibility-direction minor remains explicitly deferred, not silently declared approved.
