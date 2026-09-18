import {snackbar} from '../components/snackbar/render.mjs';
{
 const board=document.createElement('section');board.id='snackbar';board.className='board';board.dataset.component='snackbar';
 const examples=[
 ['saved','완료 안내','저장했습니다.','','동작이 끝났다는 사실만 간단히 전합니다.'],
 ['undo','실행 취소','즐겨찾기에서 해제했습니다.','실행 취소','되돌릴 수 있는 동작에는 실행 취소를 함께 표시합니다.'],
 ['retry','재시도 안내','저장하지 못했습니다.','다시 시도','같은 작업을 다시 할 수 있도록 안내합니다. 입력 오류는 해당 입력란 아래에 표시합니다.']
 ];
 board.innerHTML='<div class="board-heading"><span>COMPONENTS / SNACKBAR</span><h1>스낵바</h1><p>화면을 가리지 않고, 방금 한 동작의 결과를 짧게 알려줍니다.</p></div>'+
 examples.map(([id,title,message,action,note])=>'<section class="snackbar-section" id="snackbar-'+id+'-specimen"><div class="snackbar-heading"><h2>'+title+'</h2><button data-field-prompt="snackbar-'+id+'-specimen">AI 프롬프트</button></div><div class="snackbar-stage">'+snackbar({message,action})+'</div><p class="snackbar-note">'+note+'</p></section>').join('')+
 '<h2>표현 기준</h2><ul class="rules-list"><li>짙은 배경과 흰 글자로 밝은 화면 위에서 구분합니다. 색이나 아이콘을 여러 개 사용하지 않습니다.</li><li>좌우 여백 16 · 세로 여백 12 · 모서리 12 · 메시지와 버튼 사이 간격 16.</li><li>하단 메뉴나 고정 버튼을 가리지 않도록 그 위에 배치합니다. 화면 가장자리와는 16 이상 띄웁니다.</li><li>한 번에 하나만 표시합니다. 긴 문장은 줄바꿈하고, 공간이 부족하면 동작 버튼을 아래로 내립니다.</li><li>짧은 결과 안내에 사용합니다. 중요한 경고나 자세한 오류 설명은 다이얼로그 또는 본문에서 보여줍니다.</li></ul>';
 board.querySelectorAll('.og-snackbar').forEach(example=>{example.inert=true;});
 document.querySelector('#world').append(board);const nav=document.createElement('button');nav.dataset.board='snackbar';nav.textContent='스낵바';document.querySelector('aside nav').append(nav);document.querySelector('#board-picker').append(new Option('스낵바','snackbar'));
}
