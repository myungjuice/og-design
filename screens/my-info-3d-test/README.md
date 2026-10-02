# 내 정보 · 3D 디자인 테스트

독립 확인 URL: `http://127.0.0.1:4173/screens/my-info-3d-test/`

- 기존 HTML 캔버스와 원본 시안은 변경하지 않습니다.
- 사용자가 제공한 내 정보 캡처의 구성을 참고했습니다. M 표시, 숟가락·포크, 연필, 메뉴 이미지 6개는 디자이너의 Figma 원본 에셋을 사용합니다.
- 프로필 캐릭터는 제외하고 중립적인 사람 윤곽으로 표시했습니다.
- 금액, 공유인 수, 방문 내역은 캡처를 바탕으로 한 시안용 예시입니다. 실제 회원 데이터가 아닙니다.
- 버튼은 테스트 안내만 보여주며 실제 서비스 기능을 실행하지 않습니다.
- 바텀 메뉴 명칭은 현재 프로젝트 기준인 홈 / 마이랜드 / 바코드 / 오지파크 / 내 정보를 유지합니다.
- Surface와 MenuTile 렌더러, 색상·여백·타이포 토큰은 기존 공통 시스템을 활용합니다. 새로운 외형은 이 경로의 토큰과 스타일에 격리했습니다.

## 현재 연결된 Figma 에셋

출처: Figma 파일 `A633JxBlHU0GoJyC3zI3Oz`, 내 정보 화면 `35:76`. 원본 파일은 변경하지 않았습니다. 에셋은 외부 만료 URL에 의존하지 않도록 `media/figma/`에 보관했습니다.

| 파일 | 출처 / 표시 방식 |
| --- | --- |
| `media/figma/mileage-m.png` | 노드 `35:187`의 48×48 PNG 내보내기. 원본 글꼴·그라디언트를 포함합니다. |
| `media/figma/recent-utensils.svg` | 노드 `35:291`의 32×32 SVG. 배경까지 포함한 원본 그대로 표시합니다. |
| `media/figma/review-pencil.svg` | 노드 `35:350`의 16×16 SVG. 후기 작성 버튼 안에 표시합니다. |
| `media/figma/menu-icons.png` | 메뉴 그룹 `35:482`의 384×256 원본 이미지. 동일 파일을 Figma의 개별 잘라내기 위치로 표시합니다. |

메뉴는 80×80(좁은 화면 72×72) 영역에서 원본 이미지를 너비 300.68%, 높이 200.45%로 표시합니다. 개별 위치는 `render.mjs`의 `menuRegions`에 정리되어 있습니다. PNG를 재생성하거나 자르지 않았습니다. M 내보내기에 포함된 원형 바깥 배경은 CSS의 원형 마스크로 가립니다.

색상·글꼴·여백과 하단 메뉴는 기존 테스트 페이지를 유지했습니다. 하단 메뉴는 원본 에셋에 예전 명칭과 선택 상태가 합쳐져 있으므로 연결하지 않았습니다. 이는 Figma 전체 화면의 픽셀 단위 복제가 아닙니다.

## 이전 생성 에셋 (현재 미사용)

이전에 Codex 내장 imagegen으로 만든 메뉴 PNG 6개는 `media/`에 남겨두었으나 화면에는 연결하지 않습니다. 아래는 생성 당시 기록입니다. 바텀 메뉴의 SVG 구현은 계속 사용합니다.

공통 프롬프트:

> Use case: stylized-concept. Asset type: one small 3D icon for a Korean membership mobile app. Polished restrained toy-like product render, cobalt blue and soft periwinkle accent palette, satin polymer and porcelain with gentle gloss. Soft broad light from upper left, slight front-three-quarter view, readable thick rounded silhouette, simple geometry, not cluttered. One isolated object centered, occupies 78% of square, full silhouette visible, ample transparent margin. Genuinely transparent background, no white plate, no pedestal, no square background, no text, no letters, no watermarks. Fine ambient contact shadow confined immediately beneath object. Keep visual weight consistent with a 64px UI icon.

위 공통 프롬프트에 다음 개별 대상을 추가했습니다.

| 파일 | 개별 대상 |
| --- | --- |
| `media/receipt.png` | Curling ivory receipt, three embossed blue strokes, small gold coin without lettering, curled top and zigzag bottom. |
| `media/bell.png` | Tilted cobalt bell, blue clapper and coral notification dot on the upper right. |
| `media/membership.png` | Tilted thick cobalt membership card with rounded corners, lavender edge, tiny white sparkle and pale blue circle, without lettering. |
| `media/support.png` | Cobalt front speech bubble with a white question mark and a smaller lavender rear speech bubble. |
| `media/settings.png` | Larger cobalt gear and smaller lavender gear with circular holes and plausible rounded teeth. |
| `media/account.png` | Cobalt and periwinkle profile medallion with an ivory abstract bust and a small check badge on the lower right; no facial features. |

글꼴은 프로젝트와 같은 Pretendard를 사용합니다. 로컬 WOFF2를 포함해 외부 폰트 연결 없이 표시합니다. Pretendard는 SIL Open Font License 1.1로 배포됩니다. `media/font-license.html`에 공식 저작권·라이선스 문구를 포함했습니다.

## 검증

`node --test screens/my-info-3d-test/render.test.mjs`

`PLAYWRIGHT_PATH=<playwright module path> node screens/my-info-3d-test/preview.browser.test.cjs`

브라우저 검증은 로컬 서버가 켜진 상태에서 실행합니다. 320 / 375 / 414 / 768px 가로폭, 이미지 로딩, 텍스트 겹침, 내비게이션 줄바꿈, 안내창과 포커스 복귀를 검사합니다.
