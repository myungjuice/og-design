import {button as renderButton,favorite as renderFavorite} from '../components/button/render.mjs';
import {specimenAttributes} from './specimen-utils.mjs';
/* Component previews are inert examples; no app data is changed. */
{
 const variants=[
  ['primary','주요 버튼','다음','한 화면의 가장 중요한 동작.'],
  ['secondary','보조 버튼','취소','취소 등 보조 동작에 사용합니다.'],
  ['text','텍스트 버튼','내역 보기','‘내역 보기’처럼 보조적인 이동에 사용합니다.'],
  ['icon','아이콘 버튼','닫기','닫기 등 간단한 기능을 아이콘으로 표시합니다.'],
  ['danger','위험 동작','삭제','복구하기 어려운 동작. 실행 전 확인 절차.']
 ];
 const button=(variant,label,extra='')=>renderButton({variant,label,attributes:{...(variant==='icon'?{'aria-label':'닫기'}:{}),...specimenAttributes(extra)}});
 const board=document.createElement('section');board.id='buttons';board.className='board';
 board.innerHTML='<div class="board-heading"><span>COMPONENTS / BUTTON</span><h1>버튼</h1><p>중요도는 색으로, 동작은 문구로 구분합니다.</p></div>'+variants.map(([id,name,label,use])=>`<div class="button-variant" data-button-variant="${id}"><div><h3>${name}</h3><p>${use}</p></div>${button(id,label)}<button class="button-prompt-open" data-prompt="${id}">AI 프롬프트</button></div>`).join('')+
 '<h2>크기</h2><div class="button-size-row">'+button('primary','Small','data-size="small"')+button('primary','Medium')+button('primary','Large','data-size="large"')+'</div><p class="button-spec">Small: 면 40 / 터치 48 · Medium: 48 · Large: 56<br>모서리 12 · 좌우 여백 20 · 글자 14 / 굵기 700<br>Small 좌우 여백 16 · Large 글자 16. 글자 확대 시 높이는 내용에 맞춰 늘어납니다.</p>'+
 '<h2>상태</h2><div class="button-states">'+[
 ['기본',button('primary','저장'),'실행 가능한 동작'],['마우스 오버',button('primary','저장',''),'마우스에서만 표시'],['포커스',button('primary','저장',''),'키보드로 선택한 버튼에 외곽선 표시'],['눌림',button('primary','저장',''),'짧게 눌리는 피드백'],['비활성',button('primary','저장','disabled'),'필수 항목 입력 후 사용할 수 있습니다.'],['처리 중',button('primary','저장 중…','disabled aria-busy="true"'),'중복 실행 차단 · 원래 너비 유지'],['오류',button('primary','다시 시도','data-state="error"'),'저장하지 못했습니다. 연결 후 다시 시도해 주세요.'],['완료',button('primary','✓ 저장 완료','data-state="success"'),'완료 문구와 체크 표시로 결과 안내']
 ].map(([name,html,copy])=>`<div class="button-state"><strong>${name}</strong>${html}<p>${copy}</p></div>`).join('')+'</div><h2>사용 기준</h2><ul class="rules-list"><li>한 동작 묶음에서 주요 버튼은 하나만 사용합니다.</li><li>브랜드 그라데이션은 금액·게이지 등 핵심 정보에 남겨 둡니다. 일반 버튼에는 반복하지 않습니다.</li><li>오류·완료는 제출 결과가 있는 경우에만 사용합니다. 이동 버튼에 붙이지 않습니다.</li><li>긴 문구는 짧게 다듬고, 좁은 화면에서 버튼을 세로로 배치합니다.</li><li>로딩 전 너비를 유지하고 결과는 상태 안내로 읽어 줍니다.</li></ul>';
 // Forced preview classes are merged, not duplicated as HTML attributes.
 board.querySelectorAll('.button-state').forEach((row,i)=>{if([1,2,3].includes(i))row.querySelector('button').classList.add(['','is-hover','is-focus','is-active'][i]);});
 const favorite=document.createElement('section');favorite.id='favorite-specimen';
 favorite.innerHTML='<div class="badge-section-heading"><h2>즐겨찾기</h2><button data-field-prompt="favorite-specimen">AI 프롬프트</button></div><div class="button-states">'+[false,true].map(selected=>'<div class="button-state"><strong>'+ (selected?'선택 후':'선택 전')+'</strong>'+renderFavorite({selected})+'<p>'+(selected?'파란색으로 채운 하트':'회색 윤곽선 하트')+'</p></div>').join('')+'</div><p class="button-spec">하트 20 · 선택 영역 48. 배경이나 그림자 없이 하트의 색과 채움으로 구분합니다.</p>';
 board.querySelector('h2').before(favorite);
 document.querySelector('#world').append(board);
 const nav=document.createElement('button');nav.dataset.board='buttons';nav.textContent='버튼';document.querySelector('aside nav').append(nav);
 const option=new Option('버튼','buttons');document.querySelector('#board-picker').append(option);
 const dialog=document.createElement('dialog');dialog.id='button-prompt-dialog';dialog.setAttribute('aria-labelledby','button-prompt-title');
 dialog.innerHTML='<h2 id="button-prompt-title">버튼 구현 프롬프트</h2><p>현재 토큰과 렌더링 값을 포함합니다. 참고 사진은 별도로 첨부해 주세요.</p><label for="button-prompt-text">복사할 내용</label><textarea id="button-prompt-text" readonly></textarea><p id="button-prompt-status" role="status"></p><div class="button-dialog-actions"><button id="button-prompt-close">닫기</button><button id="button-prompt-copy">프롬프트 복사</button></div>';
 document.body.append(dialog);
 const text=dialog.querySelector('textarea'),status=dialog.querySelector('[role="status"]');let opener;
 board.addEventListener('click',e=>{
  const trigger=e.target.closest('[data-prompt]');if(!trigger)return;opener=trigger;
  const [id,name,label,use]=variants.find(v=>v[0]===trigger.dataset.prompt);
  const sample=trigger.parentElement.querySelector('.og-button'),s=getComputedStyle(sample),tokens=getComputedStyle(document.documentElement);
  const names=['--app-action','--app-on-action','--app-action-pressed','--app-state-hover','--app-control-border','--app-focus-ring','--app-focus-width','--app-focus-gap','--app-disabled-surface','--app-disabled-text','--app-error','--app-error-surface','--app-success','--app-success-surface','--app-radius-md','--app-touch-min','--app-control-sm','--app-control-md','--app-control-lg','--app-inline-gap','--app-motion-feedback','--app-ease-out'];
  text.value=`오지고랜드 Flutter 앱의 ${name}을 구현해 주세요.\n사진은 별도 첨부합니다. 이 프롬프트에는 이미지가 포함되지 않습니다.\n\n역할: ${use}\n예시 문구: ${label}\n변형: ${id}\n\n현재 렌더링 CSS\n${['backgroundColor','color','border','borderRadius','minHeight','padding','fontFamily','fontSize','fontWeight','lineHeight','gap'].map(k=>k+': '+s[k]).join('\n')}\n\n공통 토큰\n${names.map(k=>k+': '+tokens.getPropertyValue(k).trim()).join('\n')}\n\n구현 규칙\n- 기본·hover·focus·pressed·disabled·loading 상태를 구분합니다. 오류와 완료는 제출 결과에만 적용합니다.\n- 터치 영역 최소 48 logical pixels. Small 면 40 / 터치 48, 기본 48, Large 56. 글자 확대에 따라 높이를 늘립니다.\n- 라벨은 한 줄, 좁은 화면의 여러 버튼은 세로 배치. 아이콘 20, 텍스트와 간격 8.\n- 비활성·로딩에서 중복 실행을 막고 로딩 전 너비를 유지합니다. 상태 결과는 Semantics liveRegion으로 알립니다.\n- 아이콘 전용 버튼에는 기능 이름을 제공합니다. 위험 동작은 확인 이후 실행합니다.\n- Flutter의 ThemeExtension 및 공통 버튼 위젯으로 토큰과 상태를 재사용하고 px 수치를 logical pixels 기준으로 대응합니다. 글자 배율·SafeArea를 존중합니다.\n- 키보드 포커스 외곽선은 즉시 표시하고 모션 감소 설정에서는 이동을 생략합니다.\n- 그림자나 그라데이션을 임의로 추가하지 않습니다. 실제 동작은 호출자가 콜백으로 전달하며 예시 데이터/API를 새로 만들지 않습니다.\n\n원본 파일\ndesign-system/components/button/render.mjs\ndesign-system/components/button/button.css\ndesign-system/foundations/app-tokens.css\ndesign-system/canvas/buttons.js\n\n참고 사진과 CSS가 다르면 위 토큰을 우선하고 차이를 알려 주세요.`;
  status.textContent='';dialog.showModal();
 });
 dialog.querySelector('#button-prompt-close').onclick=()=>dialog.close();
 dialog.addEventListener('close',()=>opener?.focus({preventScroll:true}));
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 dialog.querySelector('#button-prompt-copy').onclick=async()=>{try{await navigator.clipboard.writeText(text.value);status.textContent='복사했습니다.';}catch{status.textContent='자동 복사가 차단되었습니다. 내용을 선택했으니 직접 복사해 주세요.';text.focus();text.select();}};
}
