// Component preview, descriptions and contrast checks consume this registry.
export const colorSpecs = [
 {name:'기본 본문',fg:'--app-text-primary',bg:'--app-surface',sample:'마일리지 내역',use:'밝은 카드 위의 제목·본문·금액에 사용합니다.'},
 {name:'보조 본문',fg:'--app-text-secondary',bg:'--app-surface',sample:'최근 방문 매장',use:'날짜와 부연 설명에 사용합니다.'},
 {name:'페이지 위 본문',fg:'--app-text-primary',bg:'--app-background',sample:'내 정보',use:'카드 밖의 화면 제목과 본문에 사용합니다.'},
 {name:'주요 액션',fg:'--app-on-action',bg:'--app-action',sample:'확인',use:'주요 버튼의 배경색으로 사용합니다.'},
 {name:'선택 상태',fg:'--app-action',bg:'--app-selected',sample:'✓ 선택됨',use:'선택한 항목에 체크 표시와 배경색을 함께 적용합니다.'},
 {name:'입력 경계',fg:'--app-control-border',bg:'--app-surface',sample:'입력 영역',use:'입력 영역이 잘 보이도록 카드 테두리보다 진하게 표시합니다.',minimum:3},
 {name:'오류',fg:'--app-error',bg:'--app-error-surface',sample:'! 저장하지 못했습니다',use:'실패 이유와 다시 시도하는 방법을 함께 안내합니다.'},
 {name:'성공',fg:'--app-success',bg:'--app-success-surface',sample:'✓ 저장했습니다',use:'저장·처리 완료를 안내할 때 사용합니다.'},
 {name:'주의',fg:'--app-warning',bg:'--app-warning-surface',sample:'! 내용을 확인해 주세요',use:'주의가 필요한 내용은 밝은 배경과 어두운 글자로 표시합니다.'},
 {name:'안내',fg:'--app-info',bg:'--app-info-surface',sample:'ⓘ 이용 안내',use:'보충 설명에 사용하며, 버튼과 구분되도록 문장으로 표시합니다.'},
 {name:'비활성',fg:'--app-disabled-text',bg:'--app-disabled-surface',sample:'현재 이용 불가',use:'사용할 수 없는 이유를 안내하고, 글자는 읽을 수 있는 밝기로 유지합니다.'},
 {name:'키보드 포커스',fg:'--app-focus-ring',bg:'--app-surface',sample:'포커스 경계',use:'버튼과 간격을 두고 2px 외곽선을 표시합니다.',minimum:3}
];
export const typeSpecs=[
 {name:'화면 제목',size:'--app-title-1-size',line:'--app-title-1-line',weight:'--app-weight-bold',tracking:'--app-tracking-heading',sample:'내 정보',use:'화면을 대표하는 제목에 사용합니다.',rule:'긴 제목은 줄바꿈해 모두 표시합니다.'},
 {name:'카드 제목',size:'--app-title-2-size',line:'--app-title-2-line',weight:'--app-weight-bold',tracking:'--app-tracking-heading',sample:'마일리지',use:'정보를 묶는 카드 제목에 사용합니다. 관련 버튼은 오른쪽에 배치합니다.',rule:'제목 옆 정보 아이콘은 세로 중앙에 맞춥니다.'},
 {name:'핵심 금액',size:'--app-title-1-size',line:'--app-title-1-line',weight:'--app-weight-bold',tracking:'--app-tracking-number',sample:'15,000 M',use:'사용 가능 금액에 그라데이션을 적용하고, 나머지 금액은 기본 글자색으로 표시합니다.',rule:'금액과 단위는 한 줄로 표시합니다. 공간이 부족하면 항목을 세로로 배치합니다.'},
 {name:'본문',size:'--app-body-1-size',line:'--app-body-1-line',weight:'--app-weight-regular',tracking:'--app-tracking-body',sample:'차곡차곡 쌓이는 혜택',use:'설명과 상세 내용, 목록 제목에 사용합니다.',rule:'상세 내용과 오류 문구는 생략하지 않고 줄바꿈합니다.'},
 {name:'보조 본문',size:'--app-body-2-size',line:'--app-body-2-line',weight:'--app-weight-regular',tracking:'--app-tracking-body',sample:'프로필 캐릭터 선택',use:'날짜와 부연 설명에 사용합니다.',rule:'강조가 필요하면 크기를 키우기보다 굵기와 색상으로 구분합니다.'},
 {name:'레이블',size:'--app-label-size',line:'--app-label-line',weight:'--app-weight-medium',tracking:'--app-tracking-body',sample:'사용 가능 · 총 보유',use:'항목 이름과 짧은 상태 표시에 사용합니다.',rule:'항목 이름은 생략하지 않습니다. 글자를 확대하면 줄바꿈합니다.'},
 {name:'캡션',size:'--app-caption-size',line:'--app-caption-line',weight:'--app-weight-regular',tracking:'--app-tracking-body',sample:'2026.09.17',use:'날짜 등 짧은 보조 정보에 사용합니다.',rule:'주요 금액이나 필수 안내에는 더 큰 글자를 사용합니다.'}
];

export const paletteSpecs = [{"id":"primary","name":"Primary","description":"브랜드 블루 · 주요 액션과 선택 상태","uses":["배경","선택 배경","옅은 강조","보조 강조","중간 강조","브랜드 기준","진한 강조","강한 강조","가장 진한 색"]},{"id":"secondary","name":"Secondary","description":"바이올렛 · 브랜드 보조색과 그라데이션","uses":["배경","밝은 배경","보조 배경","옅은 강조","중간 강조","브랜드 기준","진한 강조","강한 강조","가장 진한 색"]},{"id":"gray","name":"Gray","description":"차가운 중립색 · 배경, 경계, 텍스트","uses":["페이지 배경","비활성 배경","구분선","옅은 경계","보조 그래픽","입력 경계","보조 본문","진한 본문","기본 본문"]}];
