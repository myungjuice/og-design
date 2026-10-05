# 캐릭터 투명 배경 에셋

기획서 캡처 `character-reference.png`를 참고하여 내장 `image_gen`으로 배경 제거를 요청한 AI 편집 이미지입니다. CLI는 사용하지 않았습니다. 원본 캡처는 수정하지 않았습니다. 의상·포즈를 참고한 편집 결과이며 원본 픽셀과 완전히 동일한 단순 잘라내기는 아닙니다.

## 저장 파일

- `bear-cutout-v2.png` — 1137 × 1383, PNG alpha
- `penguin-cutout-v2.png` — 1211 × 1299, PNG alpha
- `raccoon-cutout-v2.png` — 1199 × 1312, PNG alpha

위 파일은 이 README와 같은 `v2/my-info/media/` 폴더에 저장됩니다. `character.css`에서 캐릭터 선택·검토용 아바타에 사용하고, `membership-comparison.css`에서 v2 멤버십 회원증에 재사용합니다. v2 회원증의 관련 상태는 이 디자인으로 통일했으며 기존 내정보 메인 프로필·이전 캔버스 회원증은 보존합니다. 화면에서의 투명 여백·크기·위치는 CSS로 조절합니다.

원본 생성 해상도를 유지해 총 약 3.9 MB입니다. 실제 서비스 적용 시에는 작은 렌더링 크기에 맞춘 별도 전달용 이미지 최적화를 검토해야 합니다.

## 최종 프롬프트 세트

각 요청의 전체 프롬프트는 아래 공통 문장에서 `[description]`을 해당 캐릭터의 설명으로 대체한 것입니다. 입력 이미지는 세 요청 모두 `character-reference.png`, `transparent_background: true`입니다.

```text
Use case: background-extraction. Asset type: transparent PNG mascot cutout for an HTML mobile app. Input image 1 is the EDIT TARGET: a planning screenshot containing three character cards. Extract ONLY [description]. Preserve that character's identity, exact clothing colors, face, full-body pose, proportions and existing polished 3D lighting/materials. Remove all screenshot background, card background, text, radios, borders and floor shadows. Output a SINGLE isolated full-body character on a genuinely transparent alpha background, no white matte and no checkerboard pixels. Keep all limbs, shoes and tail complete. Center and tightly frame the character with a small even transparent margin on every side. Do not add any other character, prop, badge, text or decorative effect. This is clean background removal, NOT a redesign or reimagining.
```

곰:

```text
the top-card gray bear wearing green sunglasses on its head, blue floral shirt, yellow undershirt, coral red shorts and green sandals, waving its left hand
```

펭귄:

```text
the middle-card penguin wearing a navy backward cap, yellow hoodie, dark blue shorts and white sneakers, both flippers raised
```

너구리:

```text
the bottom-card brown raccoon wearing a red plaid scarf, tan explorer vest and trousers, brown boots, with its striped tail visible
```
