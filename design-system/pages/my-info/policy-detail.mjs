import {appBar} from '../../components/app-shell/render.mjs';
import {escapeHTML as e} from '../../components/core.mjs';
// Neutral document-layout specimen, not authored legal terms or fetched HTML.
const sections=[{title:'본문 소제목',paragraphs:['문서 본문이 표시되는 영역입니다. 문장의 길이에 따라 다음 줄로 이어집니다.','문단이 바뀌는 위치와 읽는 흐름을 보여주는 예시입니다.']}];
export function policyDetail({title='약관 문서 제목',sections:parts=sections}={}){
 const content=parts.map(part=>'<section><h3>'+e(part.title)+'</h3>'+part.paragraphs.map(p=>'<p>'+e(p)+'</p>').join('')+'</section>').join('');
 return '<section class="og-policy-detail" inert aria-label="약관 및 정책 상세">'+appBar({title,back:true})+'<div class="og-policy-webview-frame"><article class="og-policy-document">'+content+'</article></div></section>';
}
export function policyDetailBoard(){
 const long=Array.from({length:8},(_,i)=>({title:'본문 소제목 '+(i+1),paragraphs:['긴 문서의 문단과 줄바꿈을 확인하는 예시입니다. 내용이 길어지면 본문 안에서 아래로 이어서 읽습니다.','한 문단이 끝나면 다음 문단과 간격을 두어 구분합니다. 이 영역은 문서의 길이와 배치를 보여줍니다.']}));
 return '<div class="screen-page-content"><div class="screen-artboard">'+policyDetail()+'</div><div class="screen-design-notes"><h3>문서에 집중</h3><p>화이트 바탕에 헤더와 본문만 배치했습니다. 본문 바깥에는 16px 여백을 두었습니다.</p><h3>긴 제목과 본문</h3><p>제목은 가운데 정렬을 유지하며 다음 줄로 이어집니다. 긴 본문은 헤더 아래에서 스크롤합니다.</p></div></div><section class="history-empty-example"><h3 class="history-state-label">제목과 본문이 길 때</h3><div class="screen-page-content"><div class="screen-artboard">'+policyDetail({title:'문서 제목이 길어 여러 줄로 이어지는 경우의 표시 예시',sections:long})+'</div></div></section>';
}
