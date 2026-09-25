# 홈 시안

작성: 홈 17페이지 / 지도3 + 검색6 + 업종2 + 근처보기3 + 상세첫화면3 + 주요메뉴1 + 전체메뉴3 + 메뉴상세3 + 매장예약5 + 매장웨이팅5 + 매장소식2 + 매장이벤트2 + 소식목록2 + 소식상세2 + 이벤트목록2 + 이벤트상세2 + 매장리뷰4 = 50상태.
다음: 매장 리뷰 전체 목록·사진 상세의 기존 구현 확인. 홈 전체 상세 화면 수는 기존 앱 대조 후 집계합니다.

## 근거

- 기획: [UI 개편 화면시안](https://docs.google.com/presentation/d/1nyXwHG533BPOnDzfNqvnqlscMzOz5iw3/edit), 표기03페이지 / 슬라이드4.
- 기존: `og-platform-legacy-app/SOURCE/jbmembersapp/lib/0_pages/01_home/home.dart`, `my_navermap.dart`, `ted_cluster/ted_render/ted_renderer.dart`.
- 카테고리: `lib/7_constants/store_category.dart`의 첫4개와 더보기.
- 지도 핀: 원본 `assets/markers/MCI1000.png`, `MCI1001.png`, `MCI1002.png`를 변경 없이 `legacy-markers.mjs`에 포함.
- 아이콘 디자이너: `유저앱_아이콘 시안 제작_260810.pdf`, 1페이지 지도 방향 참고. 신규 핀3안은 선택하지 않았습니다. 2페이지 조이바는 후속 매장 상세 검토 범위입니다.

## 재사용

`render.mjs`의 `homeScreen({state})`와 `homeBoard()`를 사용합니다. 공통 searchField, chip, iconButton, button, bottomNavigation을 재사용합니다. CSS는 `home.css`, 토큰은 기존 `foundations/app-tokens.css`입니다.

지도 SVG는 배치용 모식도이며 지리정보가 아닙니다. 앱 구현에서 대체 지도나 지도 타일로 사용하지 않습니다. 회원점명·숫자·위치는 예시입니다. 기존 NaverMap과 검색·클러스터·현위치 동작을 유지합니다.

NEW는 기획상 등록30일 이내에 표시합니다. 이번 시안에는 개별 핀의 NEW만 표현하며 묶음의 신규 표시 여부는 검토 메모에 남깁니다. 새 데이터필드나 즐겨찾기 기능을 만들지 않습니다.

캔버스 연결: `canvas/home.js`. 검토 메모: `canvas/review-notes.mjs`의 `board-home-main`. 사용자 검토완료 상태는 변경하지 않습니다.

## 확인

`node --test design-system/pages/home/home.test.mjs`

`PLAYWRIGHT_PATH=… node design-system/canvas/home.test.cjs`

브라우저 검사는 헤드리스로 실행하며 캔버스 영역 포함·프롬프트·검토 등록·320/375/414/768px의 세 상태를 확인합니다.

## 검색

`search.mjs`/`search.css`는 기존 FloatingSearchBar를 지도 위에 표현합니다. 최근검색·양쪽 결과·매장만·지역만·기록없음·전체결과없음 6상태이며 기존 image_urls.dart의 이미지를 사용합니다. 상세 검색은 기획에 별도 변경 지시가 없어 기존 구현을 유지했습니다. 검토키는 `board-home-search`입니다.

## 업종 선택

`category.mjs`/`category.css`: 기존13개 순서·아이콘, 시트40%·단일즉시선택 유지. 선택 후 네번째 칩 교체와 카페 핀을 정적으로 표현합니다. 기획 상세언급 없음(상위 홈 표기03/PPT4), 기존 category_selection.dart/my_navermap.dart 참조. 검토키 `board-home-category`.

## 근처 보기

`nearby.mjs`/`nearby.css`: 목록·사진없음·빈목록3상태. 기존 near_panel.dart/StoreImageView의 사진350·매장명·방문하기·소개문구 및 빈 문구를 유지합니다. 사진은 기존 캔버스 샘플 이미지이며 등록사진으로 간주하지 않습니다. 기획표기03/PPT4의 오픈일·리뷰키워드 권장은 미적용입니다. 검토키 `board-home-nearby`.

## 매장 상세 첫 화면

`store.mjs`/`store.css`: 기본·조건부항목없음·사진없음3상태. 기존 ShopPanel 독립 진입의 상단을 표현합니다. 하단본문은 미작업이며 삭제가 아닙니다. 가로탐색은 스크롤앵커, 상태와 항목조건은 기존 shop_contents.dart를 따릅니다. 검토키 `board-home-store`. PDF조이바 제안은 미적용.

## 주요 메뉴

`main-menu.mjs`/`main-menu.css`: 상세영역 1상태에 최대4개와 사진·설명·가격문구 조건을 비교합니다. 공통 storeScreen의 contentHTML 슬롯과 selectedSection을 사용합니다. 기존코드 _getMainMenuItemList/_getMenuItemNative 기준, 주문연결 추가없음. 검토키 `board-home-main-menu`.

## 전체 메뉴
`full-menu.mjs`/`full-menu.css`: 기본·스크롤 후·검색 결과3상태. 기존 store_menu.dart의 구성/문구/가격단위 차이/품절을 유지합니다. menuItem을 대표카드·일반목록·검색결과가 공유합니다. 검토키 `board-home-full-menu`.

## 메뉴 상세
`menu-detail.mjs`/`menu-detail.css`: 기본·스크롤 후 옵션선택·사진/옵션없음3상태. 기존 StoreMenuDetail 구성과 가격·옵션 조건을 유지합니다. 공통 라디오·체크박스·배지·썸네일·아이콘버튼 재사용. 검토키 `board-home-menu-detail`.

## 매장 예약·웨이팅
`store-services.mjs`/`store-services.css`: 기존 본문영역을 각각5상태로 표시합니다. 접수/기존내역 우선순위, 예상시간null, 정보없음 조건 유지. 검토키 `board-home-store-reservation`, `board-home-store-waiting`. 기존 연결 선택창/상세시안은 중복 생성하지 않습니다.

## 매장 소식·이벤트
`store-updates.mjs`/`store-updates.css`: 각 최대2개인 본문영역. 소식 사진유무2상태, 이벤트 기간상태를2화면으로 비교. 공통 updateItem/sectionHeading/thumbnail/storeScreen 사용. 검토키 `board-home-store-news`, `board-home-store-event`.

## 소식 목록·상세
`news-pages.mjs`/`news-pages.css`: 목록2상태·상세2상태. 목록은 updateItem을 재사용하되2개제한 없음. 빈목록 오타는 승인에 따라 등록된 데이터가 없어요.로 수정. 상세는 기존 등록일/제목/본문/사진 순서 유지. 검토키 `board-home-news-list`, `board-home-news-detail`.

## 이벤트 목록·상세
`event-pages.mjs`/`event-pages.css`: 목록2·상세2상태. StoreEventUtil 정렬, 항상표시 매장로고/이름 유지. updateItem과 readingScreen을 소식/이벤트가 공유합니다. 빈목록 등톡된 오타는 승인수정. 검토키 `board-home-event-list`, `board-home-event-detail`.

## 매장 리뷰
`store-reviews.mjs`/`store-reviews.css`: 칭찬기본/펼침/빈리뷰작성가능/불가4상태. reviewCard/praiseSection 재사용, 기존작성조건 차이는 검토메모. 검토키 `board-home-store-reviews`.
