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
 {id:'search',label:'매장 검색바',group:'지도 탐색'},
 {id:'categories',label:'업종 카테고리',group:'지도 탐색'},
 {id:'navigation',label:'하단 메뉴',group:'내비게이션'},
 {id:'try',label:'직접 눌러보기',group:'동작 확인'}
];
export const componentGroups=[['buttons','버튼'],['cards-information','카드·정보'],['lists','목록'],['selection','선택 요소'],['map-exploration','지도 탐색'],['navigation','내비게이션'],['preview','동작 확인']].map(([id,label])=>({id,label,items:componentItems.filter(item=>item.group===label)}));
export const stateComparison=(content,label='상태 비교')=>`<details class="v2-state-comparison"><summary>${label}</summary>${content}</details>`;
