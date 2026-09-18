/* Hallmark · foundation rules · existing brand · P4 H4 E4 S5 R5 V4 */
{
 const styles=getComputedStyle(document.documentElement);
 const value=k=>styles.getPropertyValue(k).trim();
 const table=rows=>'<div class="rule-table">'+rows.map(([name,token,use])=>'<div data-token="'+token+'"><strong>'+name+'</strong><code>'+token+'<br>'+value(token)+'</code><p>'+use+'</p></div>').join('')+'</div>';
 const title=(name,copy)=>'<div class="board-heading"><span>FOUNDATIONS / 기본 스타일</span><h1>'+name+'</h1><p>'+copy+'</p></div>';
 const note=t=>'<p class="note">'+t+'</p>';
 const add=(id,name,content)=>{
  const board=document.createElement('section');board.id=id;board.className='board';board.innerHTML=content;
  document.querySelector('#world').append(board);
  const button=document.createElement('button');button.dataset.board=id;button.textContent=name;document.querySelector('aside nav').append(button);
  const option=document.createElement('option');option.value=id;option.textContent=name;document.querySelector('#board-picker').append(option);
 };
 add('system','토큰 사용 기준',title('공통 스타일 사용법','같은 역할에는 같은 색상과 크기를 사용합니다.')+
 '<div class="token-flow"><div><strong>기본값</strong><code>primary06 · gray07</code></div><span>→</span><div><strong>역할</strong><code>app-action · app-text-secondary</code></div><span>→</span><div><strong>컴포넌트</strong><code>버튼 · 입력 · 카드</code></div></div>'+
 table([
 ['주요 액션','--app-action','주요 버튼에는 공통 색상 app-action을 사용합니다.'],
 ['본문','--app-text-primary','제목·금액·본문에서 같은 의미를 유지합니다.'],
 ['보조 문구','--app-text-secondary','같은 역할의 문구에는 같은 색상을 사용합니다.'],
 ['기본 컨트롤 높이','--app-control-height','입력과 인접 버튼의 기준 높이를 통일합니다.'],
 ['기본 카드 안쪽','--app-card-inset','카드 안쪽 여백은 16px로 맞춥니다.']
 ])+
 '<h2>적용 방법</h2><ul class="rules-list"><li>기본 팔레트에서 용도에 맞는 색을 선택합니다.</li><li>버튼·입력창·카드에 공통 크기와 간격을 적용합니다.</li><li>스타일을 바꿀 때는 같은 역할의 요소도 함께 맞춥니다.</li></ul>'+
 '');

 document.querySelector('#space').insertAdjacentHTML('beforeend','<h2>간격의 역할</h2>'+table([
 ['화면 좌우 / 카드 안쪽','--app-page-inset','기본 16. 화면 폭이 달라도 최소 여백은 유지. 카드 안쪽은 app-card-inset 참조.'],
 ['섹션 사이','--app-section-gap','서로 다른 정보 묶음 사이.'],
 ['같은 묶음 안','--app-stack-gap','카드 내부의 짧은 정보 그룹 사이.'],
 ['아이콘과 문구','--app-inline-gap','가로로 연결된 정보.'],
 ['레이블과 입력','--app-label-gap','입력값과 레이블을 구별하면서 하나의 묶음으로 유지.'],
 ['입력과 도움말','--app-helper-gap','도움말·오류 메시지 자리.'],
 ['필드와 다음 필드','--app-field-gap','입력 묶음 사이. 오류가 여러 줄이면 높이를 늘림.']
 ])+'<h2>컨트롤 크기</h2><div class="size-demo"><span style="min-height:var(--app-control-sm)">Small 40</span><span style="min-height:var(--app-control-md)">Medium 48</span><span style="min-height:var(--app-control-lg)">Large 56</span></div>'+table([
 ['Small','--app-control-sm','밀도 높은 보조 액션. 터치 영역은 별도로 48 이상 확보.'],
 ['Medium','--app-control-md','입력창·일반 버튼 기본.'],
 ['Large','--app-control-lg','화면 하단 주요 동작.'],
 ['최소 터치 영역','--app-touch-min','시각 크기와 분리. 주변 터치 영역과 겹치지 않게 배치.']
 ])+note('컨트롤 높이는 기본 최소값입니다. 글자 확대 시 고정 높이로 자르지 않습니다. 20·40·64 간격도 사용 가능하며, 모든 간격을 화면마다 새로 만들지 않습니다.'));

 document.querySelector('#depth').insertAdjacentHTML('beforeend','<h2>모서리 단계</h2><div class="radius-demo">'+[
 ['xs','작은 표시'],['sm','작은 배경 영역'],['md','컨트롤·메뉴'],['lg','작은 카드'],['xl','기본 카드'],['2xl','시트'],['pill','알약형']
 ].map(([size,use])=>'<div data-token="--app-radius-'+size+'"><i style="border-radius:var(--app-radius-'+size+')"></i><strong>'+size+'</strong><code>'+value('--app-radius-'+size)+'</code><small>'+use+'</small></div>').join('')+'</div>'+
 '<h2>경계와 포커스</h2>'+table([
 ['일반 경계','--app-border-width','카드: app-edge / 입력: app-control-border.'],
 ['포커스 두께','--app-focus-width','선택·오류에도 border 두께는 유지. 포커스는 외곽선으로 표시.'],
 ['포커스 바깥 간격','--app-focus-gap','컬러 면과 분리. 공간 변화 없이 표시.'],
 ['메뉴 하단 두께','--app-menu-edge-width','부드러운 두께 표현. 모든 카드에 반복 적용하지 않음.']
 ])+'<h2>그림자 규격</h2>'+table([
 ['평면','--app-shadow-none','목록 구분·내용 묶음. 선과 간격으로 구분.'],
 ['카드','--app-shadow-card','정보 카드. 밝은 윗면과 짧고 부드러운 그림자.'],
 ['메뉴','--app-shadow-menu','누를 수 있는 메뉴 타일.'],
 ['시트','--app-shadow-sheet','배경 위에 떠 있는 영역. 뒤 화면을 어둡게 처리합니다.'],
 ['눌림','--app-shadow-pressed','눌리는 타일에만 적용. 일반 텍스트 버튼에는 불필요.']
 ])+note('평면·카드·메뉴는 서로 다른 역할이며 무조건 단계가 높을수록 중요한 것은 아닙니다. 앱바·본문·모든 목록에 그림자를 붙이지 않습니다.'));

 const symbol='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 11 12 4l8 7v9h-6v-6h-4v6H4z"/></svg>';
 add('icons','아이콘',title('아이콘의 크기와 정렬','아이콘의 크기와 글자 사이 간격을 일정하게 맞춥니다.')+
 '<div class="icon-sizes">'+[['xs','16 · 보조'],['sm','20 · 인라인'],['md','24 · 기본'],['lg','28 · 메뉴'],['xl','32 · 강조']].map(([size,label])=>'<div data-token="--app-icon-'+size+'"><span style="width:var(--app-icon-'+size+');height:var(--app-icon-'+size+')">'+symbol+'</span><strong>'+label+'</strong><code>--app-icon-'+size+'</code></div>').join('')+'</div>'+
 '<h2>모양과 터치 영역은 별개</h2><div class="icon-alignment"><span class="icon-hit">'+symbol+'</span><div><strong>홈</strong><p>그림 24 · 터치 영역 48 · 글자와 간격 8</p></div></div>'+
 table([['기본 크기','--app-icon-size','글자와 중앙 정렬한 뒤, 아이콘 모양에 따라 위치를 미세 조정합니다.'],['터치 영역','--app-icon-touch','화면상 그림이 작아도 충분한 터치 공간 확보.'],['선 두께','--app-icon-stroke','24px 선형 아이콘은 같은 선 두께로 맞춥니다.']])+
 '<ul class="rules-list"><li>동일 역할에서는 선형·채움형을 섞지 않습니다. 선택 상태에 채움형을 쓸 경우 같은 계열의 짝을 사용합니다.</li><li>뒤로·닫기·정보 등 기본 액션과 카테고리 일러스트는 별도 세트로 관리합니다.</li><li>아이콘만 있는 버튼에는 기능 이름을 제공합니다. 글자와 중복된 장식 아이콘은 읽지 않게 처리합니다.</li><li>아이콘의 원래 비율과 선 두께를 유지합니다.</li></ul>'+
 '');

 add('layout','레이아웃',title('화면 배치와 여백','고정 요소가 본문을 가리지 않도록 합니다.')+
 '<div class="layout-examples"><div class="layout-diagram"><div class="safe-band">상단 안전 영역 · 기기값</div><div class="header-band">앱바 · 최소 56</div><div class="content-band"><strong>스크롤 콘텐츠</strong><p>좌우 16<br>정보 그룹 사이 24<br>본문 높이는 내용에 따라 증가</p></div><div class="action-band">하단 액션 · 48 또는 56</div><div class="safe-band">하단 안전 영역 · 기기값</div></div><div class="layout-copy"><h3>기본 화면</h3><p>기준 폭 375 / 최소 검토 폭 320.</p><p>콘텐츠는 가용 폭을 사용하고 넓은 화면에서는 최대 480으로 가운데 정렬합니다.</p><p>본문 아래에 고정 액션의 실제 높이 + 안전 영역만큼 공간을 확보합니다.</p></div></div>'+
 table([['기준 폭','--app-layout-reference','기본 화면 폭. 화면 크기에 맞춰 늘어나거나 줄어듭니다.'],['최소 검토 폭','--app-layout-min','좁은 화면 검토. 375·414·768에서도 확인.'],['콘텐츠 최대 폭','--app-content-max','입력·정보 화면에 적용합니다. 지도·미디어는 전체 폭을 사용합니다.'],['앱바','--app-header-height','글자 확대 시 늘어날 수 있는 최소 높이.'],['하단 내부 여백','--app-bottom-action-gap','안전 영역과 별도.'],['상단 안전 영역','--app-safe-top','기기에서 전달받는 값. 고정 숫자를 복제하지 않음.'],['하단 안전 영역','--app-safe-bottom','하단 액션에 한 번만 적용. 중복 패딩 금지.']])+
 '<h2>키보드가 열렸을 때</h2><ul class="rules-list"><li>입력값과 오류 문구를 볼 수 있도록 본문 스크롤 영역이 줄어듭니다.</li><li>폼 제출 버튼은 키보드 위 가용 영역에 배치합니다. 바텀 내비게이션 노출은 화면별로 결정합니다.</li><li>키보드 높이와 하단 안전 여백을 중복으로 더하지 않습니다.</li><li>시트 내부도 스크롤을 허용하고 닫기·확인 동작에 도달할 수 있게 합니다.</li></ul>'+
 '');

 add('motion','상태와 모션',title('상태는 명확하게, 움직임은 짧게','공통 표현을 정하고 컴포넌트별로 필요한 상태만 적용합니다.')+
 '<div class="state-grid">'+[
 ['default','기본','현재 가능한 동작'],['hover','마우스 오버','마우스에서만'],['pressed','누름','진한 색 또는 짧은 눌림'],['selected','선택','체크 + 면 변화'],['focus','포커스','즉시 나타나는 외곽선'],['disabled','비활성','사용할 수 없는 이유 안내'],['loading','처리 중','중복 제출 방지'],['error','오류','원인 + 복구 방법'],['success','완료','결과를 짧게 안내']
 ].map(([state,name,copy])=>'<div class="state-example '+state+'"><strong>'+name+'</strong><span>'+copy+'</span></div>').join('')+'</div>'+
 table([['누름색','--app-action-pressed','버튼을 누르면 색상을 진하게 바꾸고 크기는 유지합니다.'],['마우스를 올렸을 때의 배경색','--app-state-hover','마우스를 올리면 배경색을 바꿉니다.'],['누름 피드백','--app-motion-feedback','색상·투명도·미세 이동.'],['내용 전환','--app-motion-content','내용 등장·교체.'],['시트 전환','--app-motion-overlay','한 번의 진입·종료. 반복 부유 효과 없음.'],['등장 곡선','--app-ease-out','끝으로 갈수록 감속.'],['전환 곡선','--app-ease-in-out','상태 간 부드러운 변화.']])+
 '<h2>움직임 예시</h2><button id="motion-toggle" aria-expanded="false" aria-controls="motion-sample">전환 예시 열기</button><div class="motion-stage"><div id="motion-sample" aria-hidden="true"><strong>내용 영역</strong><p>투명도와 8px 이동만 사용합니다.</p></div></div>'+
 '<ul class="rules-list"><li>키보드 포커스는 지연 없이 표시합니다.</li><li>오류 메시지는 색만 바꾸지 않고 이유를 함께 표시합니다.</li><li>로딩은 같은 자리를 사용해 레이아웃을 흔들지 않습니다.</li><li>모션 줄이기 설정에서는 이동을 없앱니다. 이 예시는 즉시 전환합니다.</li><li>성공·오류가 의미 없는 컴포넌트에 장식 상태를 만들지 않습니다.</li></ul>');

 add('layers','겹침 순서',title('화면의 겹침 순서','팝업이 열리면 뒤 화면은 어둡게 표시하고 조작을 막습니다.')+
 '<div class="layer-stack">'+[
 ['본문','--app-z-content'],['고정 앱바·하단 액션','--app-z-sticky'],['시트 Dim','--app-z-scrim'],['바텀시트','--app-z-sheet'],['대화상자 Dim','--app-z-dialog-scrim'],['대화상자','--app-z-dialog'],['팝오버','--app-z-popover'],['짧은 결과 알림','--app-z-notice']
 ].map(([name,t])=>'<div data-token="'+t+'"><strong>'+name+'</strong><code>'+t+'</code><span>'+value(t)+'</span></div>').join('')+'</div>'+
 table([['배경 Dim','--app-scrim','시트 또는 대화상자가 활성일 때 뒤 내용을 구분하는 면.']])+
 '<h2>함께 적용할 동작</h2><ul class="rules-list"><li>모달이 열리면 뒤 화면의 클릭·스크롤·키보드 접근을 막습니다.</li><li>닫은 뒤에는 열었던 버튼으로 포커스를 돌려줍니다.</li><li>뒤 화면의 팝오버는 먼저 닫습니다. 숫자가 높다는 이유로 모달 위에 남기지 않습니다.</li><li>시트 위 확인 대화상자가 필요하면 시트 조작도 잠급니다.</li><li>팝업이 겹쳐도 배경이 지나치게 어두워지지 않게 합니다.</li></ul>'+
 '');

}
