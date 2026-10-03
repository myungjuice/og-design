export const componentItems=[
 {id:'primary',label:'주요 버튼',group:'버튼'},
 {id:'secondary',label:'보조 버튼',group:'버튼'},
 {id:'review',label:'후기 버튼',group:'버튼'},
 {id:'cards',label:'카드·메뉴 타일',group:'카드·정보'},
 {id:'mileage',label:'마일리지 카드·진행바',group:'카드·정보'},
 {id:'list-row',label:'목록 행',group:'목록'},
 {id:'search',label:'매장 검색바',group:'지도 탐색'},
 {id:'categories',label:'업종 카테고리',group:'지도 탐색'},
 {id:'navigation',label:'하단 메뉴',group:'내비게이션'},
 {id:'try',label:'직접 눌러보기',group:'동작 확인'}
];
export function renderComponentExplorer(){
 const groups=[...new Set(componentItems.map(item=>item.group))];
 return `<div class="v2-component-explorer">
 <label for="component-filter">컴포넌트 검색</label>
 <div class="v2-component-filter"><input id="component-filter" type="search" placeholder="버튼, 마일리지" autocomplete="off"><button type="button" data-clear-component-filter aria-label="검색 지우기">×</button></div>
 <p class="v2-component-search-status" role="status" aria-live="polite" hidden></p>
 <nav aria-label="컴포넌트 목록">${groups.map(group=>`<div data-component-group><p>${group}</p>${componentItems.filter(item=>item.group===group).map(item=>`<a href="#${item.id}" data-component-link="${item.id}" aria-controls="${item.id}"${item.id==='primary'?' aria-current="location"':''}>${item.label}</a>`).join('')}</div>`).join('')}</nav></div>`;
}
export function renderComponentPicker(){
 return `<div class="v2-component-picker"><label for="component-picker">컴포넌트 선택</label><select id="component-picker">${componentItems.map(item=>`<option value="${item.id}">${item.label}</option>`).join('')}</select></div>`;
}
export const stateComparison=(content,label='상태 비교')=>`<details class="v2-state-comparison"><summary>${label}</summary>${content}</details>`;
