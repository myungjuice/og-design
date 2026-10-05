# 이용내역 4탭 Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans. User approved this bounded migration with ㄱㄱ; work in place, without committing or deploying.

**Goal:** 내정보 이용내역 허브를 v2로 옮기고 예약·웨이팅·Q오더·리뷰를 함께 검토한다.
**Architecture:** 기존 이용내역의 상태와 정보 구조를 유지하는 정적 390×846 Shadow DOM 시안. 공통 시트·탭·토글·배지·썸네일·버튼을 재사용하고 비교 상태는 접어서 지연 마운트한다.
**Tech Stack:** HTML/CSS, ES modules, Node test, Playwright.
**Spec:** 사용자 승인된 대화 범위 및 `design-system/pages/my-info/use-history.mjs`.

## Global Constraints

- 기존 캔버스와 대표 화면은 보존. 상세 화면·API·배포·커밋 제외.
- 기본 4탭, 과거 3탭, 빈 상태 4탭, 예약 취소/웨이팅 호출·취소/리뷰 관리 비교 유지.
- 금액·날짜·상태는 기존 예시이며 매장명만 구체적 예시로 표시.
- 일반 공통 컴포넌트 25/25, 이관 후 내정보 3/23. 외부 일정 중 작업은 미검토로 기록.

## Review Focus

- 320px에서도 내용과 닫기 버튼이 잘리지 않는다.
- 상세 버튼은 해당 상태에서만 표시된다.
- 접힌 상태는 초기 렌더링하지 않고 펼쳤을 때 한 번만 마운트한다.
- 내정보 메뉴 진입 및 뒤로 이동은 표시 그룹과 포커스를 맞춘다.
- 각 시안의 ID는 고유하며 원본 앱/실제 거래로 오인시키지 않는다.

## Task 1: Render, navigation and review record

Create `v2/my-info/use-history.{mjs,css,test.mjs,browser.test.cjs}`; modify v2 render, my-info preview/styles, subnavigation/tests and README only.
Interfaces: `renderUseHistory({selected,empty,showPast,state})`, `renderUseHistoryReview()`, `setupUseHistoryReview(root)`.

- [x] Write and observe failing tests for reachable group, 4 tab contexts, past/action conditions, empty/supplementary states, invalid index and ID uniqueness.
- [x] Implement static previews using existing v2 controls; add main menu routing and lazy folded comparisons.
- [x] Run unit suite/build, 7-width browser checks and representative/mileage/sidebar regressions; inspect screenshots.
- [x] Read-only independent review; resolve important findings and reverify. Record night review, count 3/23, recommend reservation detail.

## Ledger

Ruling: preserve the established static review workflow rather than introducing new app behavior; tab selection is shown as four related previews, not a live service.
Ruling: existing explicit approval permits in-place main work; no Git mutations or external publication.
Final: fixed inaccessible past-record scrolling — browser wheel reproduction failed before fix, then passed at all 7 widths; full unit suite 293/293. Static shell can scroll, individual actions remain inert. Keyboard End reaches the last record.
Final: fixed review delete material mismatch — browser assertion reproduced destructive/danger mismatch; use existing danger variant, no common component mutation.
Final: scope remains static UI migration. Live service actions and connected details are intentionally deferred, not claimed complete.
Task 1: complete — unit 293/293; new hub 7 widths passed; representative main 6 widths, mileage 7 widths and two-sidebars all 7 routes passed. Build 382 static files. Original design-system/screens unchanged; diff whitespace check clean. Night queue recorded. No commit/push/deploy.
