# 바코드 시안

- 기획: Google Drive 기획서 PPT 10번째, 슬라이드 하단 표기 09.
- 기존 구현: og-platform-legacy-app/SOURCE/jbmembersapp/lib/0_pages/03_members/barcode_page.dart.
- 기존 바텀시트 흐름을 유지한 개편이며 신규 기능이 아닙니다.
- 재사용: 내 정보와 공유하는 mileage의 payment 표시, progress, surface, bottomSheet, button, textButton, sectionHeading, 배경 homeScreen.
- 기본 / 5,000 M 미만 / 잔액 없음 / 비로그인 4상태. 스캔되지 않는 패턴과 가상 회원번호를 사용한 정적 디자인입니다.
- 보유와 사용 가능 금액은 별도 입력입니다. 실제 앱의 jbPay*1000 및 통합 보유 마일리지 매핑은 구현 시 확인합니다.
- 진행바는 보유 금액의 5,000 M 구간 잔여를 표시합니다. 12,400 M은 48%, 다음 구간까지 2,600 M. 이미지의 부정확한 길이를 그대로 복제하지 않았습니다.
- 기존 60초 결제 모드와 타이머는 주석 처리된 미사용 코드이므로 추가하지 않았습니다. 광고·닉네임·OG PAY 제목 없음.
- 영수증 적립 → ReceiptOcrUploadPage, 마일리지 사용 → QR 스캔 → MileageQrUsePage, 안내 → OGMileageNotice. 추가 흐름 화면은 이번 작업 범위가 아닙니다.
- 검토 키: board-barcode-main. 신규 항목 자동 검토 대기, 사용자 완료 상태 보존.
- 코드 검사: node --test design-system/pages/barcode/render.test.mjs
- 브라우저 검사: PLAYWRIGHT_PATH=… PREVIEW_URL=… node design-system/canvas/barcode.test.cjs (320/375/414/768px)
