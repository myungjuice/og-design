import {dialog} from '../components/dialog/render.mjs';
{
 const board=document.createElement('section');board.id='dialogs';board.className='board';board.dataset.component='dialog';
 const cases=[
 ['notice','안내','알림을 켜 주세요','새 소식을 받으려면 기기 설정에서 알림을 허용해 주세요.',[['확인','primary']],'한 가지 안내와 확인 버튼만 표시합니다.'],
 ['confirm','일반 확인','작성을 그만두시겠어요?','작성 중인 내용은 저장되지 않습니다.',[['계속 작성','secondary'],['나가기','primary']],'왼쪽에는 현재 작업을 이어가는 버튼, 오른쪽에는 나가기 버튼을 배치합니다.'],
 ['delete','삭제 확인','리뷰를 삭제하시겠어요?','삭제한 리뷰는 다시 복구할 수 없습니다.',[['취소','secondary'],['삭제','danger']],'삭제 버튼만 붉은색으로 강조하고, 제목과 본문은 기본 글자색을 사용합니다.']
 ];
 board.innerHTML='<div class="board-heading"><span>COMPONENTS / DIALOG</span><h1>다이얼로그</h1><p>짧은 안내나 중요한 선택을 화면 중앙에서 보여줍니다.</p></div>'+
 cases.map(([id,name,title,body,actions,note])=>'<section id="dialog-'+id+'-specimen" class="dialog-section"><div class="dialog-heading"><h2>'+name+'</h2><button data-field-prompt="dialog-'+id+'-specimen">AI 프롬프트</button></div><div class="dialog-stage">'+dialog({title,body,actions:actions.map(([label,variant])=>({label,variant}))})+'</div><p class="dialog-note">'+note+'</p></section>').join('')+
 '<h2>표현 기준</h2><ul class="rules-list"><li>화이트 표면과 부드러운 그림자로 뒤 화면과 구분합니다. 배경은 어둡게 눌러 안내에 시선이 머물게 합니다.</li><li>제목과 본문은 왼쪽 정렬합니다. 본문에 같은 질문을 반복하지 않습니다.</li><li>너비 최대 320 · 안쪽 여백 24 · 제목과 본문 간격 12 · 버튼 위 간격 24 · 버튼 사이 간격 8.</li><li>버튼은 최대 두 개로 구성합니다. 문구가 길거나 글자가 커지면 세로로 배치합니다.</li><li>삭제·나가기처럼 결과가 달라지는 동작은 버튼에 직접 적습니다.</li></ul>';
 document.querySelector('#world').append(board);
 const nav=document.createElement('button');nav.dataset.board='dialogs';nav.textContent='다이얼로그';document.querySelector('aside nav').append(nav);document.querySelector('#board-picker').append(new Option('다이얼로그','dialogs'));
}
