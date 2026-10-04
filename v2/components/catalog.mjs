export const componentItems=[
 {id:'primary',label:'주요 버튼',group:'버튼'},
 {id:'secondary',label:'보조 버튼',group:'버튼'},
 {id:'review',label:'후기 버튼',group:'버튼'},
 {id:'cards',label:'카드·메뉴 타일',group:'카드·정보'},
 {id:'mileage',label:'마일리지 카드·진행바',group:'카드·정보'},
 {id:'section-heading',label:'섹션 제목·우측 액션',group:'카드·정보'},
 {id:'list-row',label:'목록 행',group:'목록'},
 {id:'checkbox',label:'체크박스',group:'선택 요소'},
 {id:'radio',label:'라디오',group:'선택 요소'},
 {id:'switch',label:'토글·스위치',group:'선택 요소'},
 {id:'search',label:'매장 검색바',group:'입력'},
 {id:'text-input',label:'텍스트 입력',group:'입력'},
 {id:'password-input',label:'비밀번호 입력',group:'입력'},
 {id:'multiline-input',label:'여러 줄 입력',group:'입력'},
 {id:'dialogs',label:'확인창',group:'안내·확인'},
 {id:'notices',label:'영역 안 안내',group:'안내·확인'},
 {id:'empty-feedback',label:'빈 화면·불러오기 오류',group:'안내·확인'},
 {id:'snackbar',label:'스낵바',group:'안내·확인'},
 {id:'loading',label:'로딩·스켈레톤',group:'로딩'},
 {id:'categories',label:'업종 카테고리',group:'지도 탐색'},
 {id:'navigation',label:'하단 메뉴',group:'내비게이션'},
 {id:'try',label:'직접 눌러보기',group:'동작 확인'}
];
export const componentGroups=[['buttons','버튼'],['cards-information','카드·정보'],['lists','목록'],['selection','선택 요소'],['inputs','입력'],['feedback','안내·확인'],['loading','로딩'],['map-exploration','지도 탐색'],['navigation','내비게이션'],['preview','동작 확인']].map(([id,label])=>({id,label,items:componentItems.filter(item=>item.group===label)}));
export const stateComparison=(content,label='상태 비교')=>`<details class="v2-state-comparison"><summary>${label}</summary>${content}</details>`;
