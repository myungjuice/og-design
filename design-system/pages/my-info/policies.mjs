import {appBar} from '../../components/app-shell/render.mjs';
import {surface} from '../../components/surfaces/render.mjs';
import {listRow} from '../../components/list-row/render.mjs';
// Titles are neutral specimens; the legacy policy API owns names and order.
const items=[{title:'약관 문서 제목'},{title:'정책 문서 제목'},{title:'정책 문서 제목'}];
export function policies({items:rows=items}={}){
 return '<section class="og-policies" inert aria-label="약관 및 정책">'+appBar({title:'약관 및 정책',back:true})+'<div class="og-policies-scroll">'+(rows.length?surface({className:'og-policies-list',contentHTML:rows.map(row=>listRow({title:row.title,className:'og-policy-row'})).join('')}):'')+'</div></section>';
}
export function policiesBoard(){
 return '<div class="screen-page-content"><div class="screen-artboard">'+policies()+'</div><div class="screen-design-notes"><h3>간결한 문서 목록</h3><p>문서명과 이동 화살표만 표시했습니다. 항목 사이는 얇은 선으로 나누고, 목록 전체에 은은한 입체감을 주었습니다.</p><h3>긴 제목 정렬</h3><p>제목은 다음 줄로 이어지고, 화살표는 오른쪽 같은 자리에 맞췄습니다.</p></div></div><section class="history-empty-example"><h3 class="history-state-label">문서명이 길 때</h3><div class="screen-page-content"><div class="screen-artboard">'+policies({items:[{title:'문서 제목이 길어 두 줄 이상으로 이어지는 경우의 표시 예시'},{title:'정책 문서 제목'},{title:'추가 안내가 포함된 약관 문서 제목의 줄바꿈 예시'}]})+'</div></div></section>';
}
