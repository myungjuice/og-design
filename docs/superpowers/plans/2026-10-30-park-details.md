# 오지파크 세부시안 Implementation Plan

**Goal:** 기획서의 본사 이벤트·공모전·커뮤니티를 기존 사이트에 정적 검토 시안으로 추가한다.
**Architecture:** 기존 OG 토큰·버튼·상태 배지·하단 메뉴·수령 업종 아이콘을 공유한다. 기능별 순수 렌더러를 작은 파일로 나누고, 기존 오지파크 리뷰 메뉴에 연결한다.
**Tech Stack:** ES modules, HTML/CSS, Node test runner, Playwright.
**Spec:** OGGO_유저앱_UI개편_화면시안_260904.pptx 실제 슬라이드 12–14 및 2026-10-30 사용자 승인.

## Global Constraints
- 2026-10-30 15:15 KST 이후 작업은 사용자 검토 대기. 검토 완료 전 승인된 시안으로 취급하지 않는다.
- 기존 로컬 4차 피드백 시안과 과거 비교안은 보존한다. 커밋·푸시·배포·Figma 수정 없음.
- 정적 시안. 슬라이드·게임·실참여·실게시 기능을 구현하지 않는다. 상태는 갤러리에 함께 노출한다.
- 기본 적립 3%와 이벤트 추가 혜택은 분리. 보상액·날짜·개수는 예시이며 검토 설명에 명시한다.
- 미확정 출품 입력 폼과 커뮤니티 글쓰기/상세 폼은 만들지 않는다.
- 기획서의 24개 업종과 수령본의 실제 업종 수를 혼동하지 않는다. 수령된 실제 업종만 사용한다.

## Review Focus
- 매장 이벤트와 본사 이벤트의 제목·참여 대상 구분.
- 심사 중/종료된 공모전에서 출품 CTA가 활성화된 것처럼 보이지 않을 것.
- 관심 업종 최대 3개, 건너뛰기 및 선택 전/선택 후 표시.
- 긴 한국어 업종명과 좁은 검토 화면에서 가로 넘침·CTA 겹침이 없을 것.
- 새 경로 모두 직접 링크로 열리고 기존 최신/이전 비교 경로도 유지될 것.

## Tasks
- [x] 1. 연결·상태 의미를 검증하는 실패 테스트와 검토 목록을 만든다.
- [x] 2. 공유 프레임/리뷰 갤러리와 본사 이벤트 5상태를 만든다.
- [x] 3. 공모전 목록·상세·심사·결과 4상태를 만든다.
- [x] 4. 관심 업종 선택 3상태와 커뮤니티 목록 3상태를 만든다.
- [x] 5. 서브메뉴·렌더러·페이지 설정을 연결하고 빌드 및 기존 관련 테스트를 실행한다.
- [x] 6. 브라우저에서 전 화면·좁은 뷰포트·이미지·이전 시안 보존을 검증하고 검토 문서를 갱신한다.

## Files and interfaces
- `v2/og-park/details-shared.mjs`, `details.css`: 공통 정적 프레임, 헤더, 버튼, 사진, 갤러리.
- `v2/og-park/events.mjs`: `renderOfficialEventList()` / `renderOfficialEventDetail(state)`.
- `v2/og-park/contests.mjs`: `renderContestScreen(state)`.
- `v2/og-park/community.mjs`: `interestCategories`, `renderInterestSelection(state)` / `renderCommunityFeed(state)`.
- `v2/og-park/details.mjs`: `parkDetailGroups`, `renderParkDetailsReview()` / `setupParkDetails(root)`.
- Modify `v2/render.mjs`, `v2/page.mjs`, `v2/subnavigation.mjs` only for new route integration.
- Test `v2/og-park/details.test.mjs` and `details.browser.test.cjs`.
- Review ledger `docs/planning/2026-10-30-park-details-review.md`.

## Execution ledger
- Baseline: 14 relevant tests passed; eight pre-existing modified files and existing 4th-feedback assets preserved.
- Ruling: approved local-site continuation uses the existing checkout so the user's pending changes remain visible on the current preview; no Git branch/commit mutation.
- Ruling: existing OG system and planning reference determine the design; no new theme/package needed.
- Pre-flight: events/contests/community consume shared frames and gallery; details exports groups to submenu and render/setup to workspace. No circular dependencies.

- Verification: Node unit suite 513/513 passed. Browser 2/2 passed, covering all 15 specimens at 375/768/1440px, direct anchors, menu/back navigation, asset loading, horizontal overflow, scaled host height and footer overlap.
- Build: 915 static files. Initial full-suite attempt hit sandbox EPERM in build.test; rerun with permitted repository write access passed without code changes.
- Preservation: SHA-256 confirms the seven pre-existing landmark/park renderer and styling files unchanged since 15:15 baseline. Only existing submenu receives additive route integration.
- User review: all 8 destinations / 15 specimens remain pending. Commit/push/deploy/Figma unchanged.

- Final read-only review found one state-data inconsistency: the same contest entry had different photo/like counts across judging and result. Added a failing regression test, shared the entry data, verified it passes; full suite now 513/513.
- Browser settling: a 768px assertion sampled before ResizeObserver applied the new host height. The test now waits for the actual height alignment (5-second timeout, original geometry assertions retained); browser 2/2 passed. No production layout change was needed.

- Follow-up authorization: user requested commit, push and production deployment after local implementation. Include existing 4th-feedback changes; keep all new user-review statuses pending. Initial no-publish constraints above describe the original local-only task.
