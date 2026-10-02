# 내 정보 · 3D 디자인 테스트

독립 확인 URL: `http://127.0.0.1:4173/screens/my-info-3d-test/`

- 기존 HTML 캔버스와 원본 시안은 변경하지 않습니다.
- 사용자가 제공한 내 정보 캡처의 구성을 참고했습니다. Figma 원본 에셋을 내려받은 것이 아닙니다.
- 프로필 캐릭터는 제외하고 중립적인 사람 윤곽으로 표시했습니다.
- 금액, 공유인 수, 방문 내역은 캡처를 바탕으로 한 시안용 예시입니다. 실제 회원 데이터가 아닙니다.
- 버튼은 테스트 안내만 보여주며 실제 서비스 기능을 실행하지 않습니다.
- 바텀 메뉴 명칭은 현재 프로젝트 기준인 홈 / 마이랜드 / 바코드 / 오지파크 / 내 정보를 유지합니다.
- Surface와 MenuTile 렌더러, 색상·여백·타이포 토큰은 기존 공통 시스템을 활용합니다. 새로운 외형은 이 경로의 토큰과 스타일에 격리했습니다.

## 에셋 제작

메뉴 이미지 6개는 Codex 내장 imagegen으로 개별 생성했습니다. 투명 PNG 원본을 수정 없이 `media/`에 복사했습니다. M 코인, 숟가락·포크, 연필 및 바텀 메뉴는 크기 대응이 가능한 SVG로 구현했습니다.

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
