import {textField,textarea} from '../components/input/render.mjs';
import {specimenAttributes} from './specimen-utils.mjs';
/* Local preview only. Example validation is not a service policy. */
{
 const board=document.createElement('section');board.id='inputs';board.className='board';board.dataset.component='input';
 const field=(id,label,{value='',hint='사용할 닉네임을 입력해 주세요.',attr='',state='',cls='',slot=''}={})=>textField({id,labelHTML:label,value,hint,attributes:specimenAttributes(attr),state,className:cls,slot,placeholder:'예: 맑은 땅콩'});
 board.innerHTML='<div class="board-heading"><span>COMPONENTS / INPUT</span><h1>입력</h1><p>값을 쓰는 동안에도 레이블과 안내가 남아 있습니다.</p></div>'+
 '<section id="input-specimen"><div class="input-section-header"><h2>한 줄 입력</h2><button data-field-prompt="input-specimen">AI 프롬프트</button></div><div class="input-demo">'+field('field-live','닉네임 <small>(필수)</small>',{value:'맑은 땅콩',hint:'사용할 닉네임을 입력해 주세요.',attr:'required aria-invalid="false" autocomplete="off"'})+'<p class="input-demo-note">입력창을 벗어나면 오류를 안내하고, 내용을 수정하면 안내도 함께 바뀝니다.</p></div>'+
 '<div class="input-states">'+[
 ['기본',field('field-default','닉네임')],
 ['마우스 오버',field('field-hover','닉네임',{cls:'is-hover',hint:'마우스 사용 시에만 면을 살짝 강조합니다.'})],
 ['포커스 · 입력 중',field('field-focus','닉네임',{cls:'is-focus',value:'맑은',hint:'테두리 두께를 바꾸지 않고 외곽선으로 표시합니다.'})],
 ['입력 완료',field('field-filled','닉네임',{value:'맑은 땅콩',hint:'입력값 자체로 채워진 상태를 구분합니다.'})],
 ['오류',field('field-error','닉네임 <small>(필수)</small>',{hint:'닉네임이 비어 있습니다. 사용할 이름을 입력해 주세요.',attr:'aria-invalid="true" required',slot:'!'})],
 ['확인 중',field('field-loading','닉네임',{value:'맑은 땅콩',attr:'aria-busy="true"',hint:'입력값 확인 중…',slot:'…',state:'loading'})],
 ['확인 완료',field('field-success','닉네임',{value:'맑은 땅콩',hint:'✓ 입력값 확인 완료',state:'success',slot:'✓'})],
 ['비활성',field('field-disabled','닉네임',{value:'맑은 땅콩',attr:'disabled',hint:'이전 단계 완료 후 입력할 수 있습니다.'})],
 ['읽기 전용',field('field-readonly','회원 구분',{value:'일반 회원',attr:'readonly',hint:'조회·복사는 가능하고 수정은 할 수 없습니다.'})]
 ].map(([title,html])=>'<div><p class="input-state-title">'+title+'</p>'+html+'</div>').join('')+'</div></section>'+
 '<section id="textarea-specimen"><div class="input-section-header"><h2>여러 줄 입력</h2><button data-field-prompt="textarea-specimen">AI 프롬프트</button></div>'+textarea({id:'field-message',labelHTML:'문의 내용 <small>(선택)</small>',placeholder:'예: 마일리지 내역을 확인하고 싶습니다.',helpId:'message-help',countId:'message-count'})+'<p class="input-demo-note">긴 내용은 줄바꿈하고, 입력창 아래에 글자 수를 표시합니다.</p></section>'+
 '<h2>공통 규격</h2><ul class="rules-list"><li>기본 최소 높이 48 · 모서리 12 · 테두리 1. 모든 상태에서 같은 두께를 유지합니다.</li><li>입력 글자 16 / 행간 24 · 좌우 여백 16 · 오른쪽 지우기 터치 영역 48.</li><li>레이블과 필드 간격 8 · 도움말 간격 4 · 필드 묶음 간격 20.</li><li>도움말 한 줄 높이를 확보하고, 긴 오류는 잘리지 않도록 높이를 늘립니다.</li><li>오류는 도움말을 대체하며 원인과 수정 방법을 함께 보여줍니다.</li><li>내용을 수정하면 확인 중·확인 완료 표시를 해제합니다.</li><li>한 줄 입력과 여러 줄 입력은 오류·포커스·비활성을 같은 스타일로 표시합니다.</li></ul>';
 document.querySelector('#world').append(board);
 const nav=document.createElement('button');nav.dataset.board='inputs';nav.textContent='입력';document.querySelector('aside nav').append(nav);document.querySelector('#board-picker').append(new Option('입력','inputs'));
}
