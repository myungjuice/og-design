import {appBar} from '../../components/app-shell/render.mjs';
import {escapeHTML as e} from '../../components/core.mjs';
// bodyHTML accepts authored specimen markup only, never an untrusted server response.
export function noticeDetail({title='공지 제목',created='2026-09-18 10:00:00',modified='',bodyHTML='<p>공지 본문이 표시되는 영역입니다.</p><p>문단 사이에 간격을 두어 내용을 구분합니다.</p>'}={}){
 return '<section class="og-notice-detail" inert aria-label="공지 상세"><div class="og-notice-detail-header">'+appBar({title,back:true})+'<div class="og-notice-dates"><p>작성일: '+e(created)+'</p>'+(modified&&modified!==created?'<p>수정일: '+e(modified)+'</p>':'')+'</div></div><article class="og-notice-article">'+bodyHTML+'</article></section>';
}
export function noticeDetailBoard(){
 const rich='<h3>본문 소제목</h3><p>제목과 본문의 크기를 구분하고, 문단이 바뀌는 곳에 간격을 둡니다. 긴 공지에서도 내용을 따라 읽기 편하게 표시합니다.</p><ul><li>목록의 첫 번째 항목입니다.</li><li>긴 항목은 같은 들여쓰기 안에서 다음 줄로 이어집니다.</li></ul><p><strong>중요한 내용은 굵게 표시합니다.</strong></p><p><a href="https://example.com">본문 링크 예시</a></p>'+Array.from({length:6},()=>'<p>긴 본문의 줄바꿈과 문단 간격을 확인하는 예시입니다. 내용이 길어지면 본문 영역을 아래로 스크롤하며 읽습니다.</p>').join('');
 const states=[['기본 상태',{}],['수정일이 있는 공지',{modified:'2026-09-19 09:30:00'}],['긴 제목과 본문',{title:'공지 제목이 여러 줄로 이어질 때의 표시 예시',bodyHTML:rich}]];
 return states.map(([label,props],i)=>'<section class="'+(i?'history-empty-example':'')+'"><h3 class="history-state-label">'+label+'</h3><div class="screen-page-content"><div class="screen-artboard">'+noticeDetail(props)+'</div>'+(i===0?'<div class="screen-design-notes"><h3>제목과 날짜</h3><p>뒤로가기 옆에 공지 제목을 두고, 날짜는 아래쪽 오른편에 정렬했습니다.</p><h3>본문에 집중</h3><p>화이트 바탕에 본문을 담고, 헤더 아래 얇은 선으로 영역을 나눴습니다. 목록 화면보다 장식을 줄였습니다.</p></div>':'')+'</div></section>').join('');
}
