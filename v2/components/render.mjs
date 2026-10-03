import {button} from '../../design-system/components/button/render.mjs';
import {surface,menuTile} from '../../design-system/components/surfaces/render.mjs';
import {escapeHTML as e} from '../../design-system/components/core.mjs';
export const componentStates=[
 ['default','기본','동작하기 전'],['hover','마우스 올림','포인터가 올라온 상태'],
 ['focus','키보드 포커스','Tab으로 이동한 상태'],['active','누르는 중','터치·클릭 중 얕게 눌림'],
 ['disabled','비활성','사용 가능한 마일리지가 없을 때'],['loading','처리 중','중복 실행을 막는 상태'],
 ['error','오류','실패 안내와 다시 시도'],['success','성공','완료를 텍스트로도 표시']
];
const stateLabel=(label,state)=>state==='loading'?'처리 중…':state==='error'?'다시 시도':state==='success'?'완료':label;
export function renderButton({label='마일리지 사용',variant='primary',state='default',attributes={}}={}){
 return button({label:stateLabel(label,state),variant,state,size:variant==='review'?'small':'regular',
  className:'v2-button',disabled:['disabled','loading'].includes(state),busy:state==='loading',attributes:{...attributes,disabled:['disabled','loading'].includes(state),'aria-busy':state==='loading'?'true':undefined}});
}
export function renderCard({title='최근 방문',description='방문 내역을 확인하세요.'}={}){
 return surface({className:'v2-card',depth:'raised',contentHTML:`<h3>${e(title)}</h3><p>${e(description)}</p>`});
}
export function renderMenuTile({label='이용내역',state='default',selected=false,attributes={}}={}){
 return menuTile({label:stateLabel(label,state),className:'v2-menu-tile',attributes:{...attributes,
  'data-state':state,disabled:['disabled','loading'].includes(state),'aria-busy':state==='loading'?'true':undefined,
  'aria-pressed':String(selected)}});
}
const figure=(name,description,control)=>`<figure class="v2-component-sample"><figcaption><strong>${name}</strong><span>${description}</span></figcaption>${control}</figure>`;
export function renderComponents(){
 const variants=[['primary','주요 버튼','마일리지 사용','보라색 표면 · 가장 중요한 동작'],['secondary','보조 버튼','영수증 적립','흰 표면 · 주요 버튼 옆의 보조 동작'],['review','작은 후기 버튼','후기 작성','작은 시각 크기 · 터치 영역은 44px 이상']];
 return `<p class="v2-intro">기본 스타일을 공통 버튼·카드에 적용한 검토 시안입니다. 기존 공통 렌더러를 재사용하고 v2 스타일만 분리했습니다.</p>
 <nav class="v2-component-nav" aria-label="공통 컴포넌트 항목">${variants.map(([id,title])=>`<a href="#${id}">${title}</a>`).join('')}<a href="#cards">카드·메뉴 타일</a><a href="#try">직접 눌러보기</a></nav>
 ${variants.map(([id,title,label,description])=>`<section class="v2-component-section" id="${id}" aria-labelledby="${id}-title"><h2 id="${id}-title">${title}</h2><p>${description}</p><div class="v2-component-grid">${componentStates.map(([state,name,desc])=>figure(name,state==='disabled'&&id!=='primary'?(id==='review'?'후기 작성을 진행할 수 없는 상태':'적립을 진행할 수 없는 상태'):desc,renderButton({variant:id,label,state,attributes:{'data-component':'button','aria-label':`${stateLabel(label,state)} · ${title} · ${name}`}}))).join('')}</div></section>`).join('')}
 <section class="v2-component-section" id="cards" aria-labelledby="cards-title"><h2 id="cards-title">카드·메뉴 타일</h2><p>정보 카드에는 눌림·포커스를 적용하지 않습니다. 동작이 있는 메뉴 타일만 상태를 갖습니다.</p>
 <div class="v2-info-card-sample">${renderCard({title:'최근 방문',description:'정보를 담는 흰 카드입니다. 클릭 대상이 아닙니다.'})}</div>
 <div class="v2-component-grid">${componentStates.map(([state,name,desc])=>figure(name,state==='disabled'?'이용내역을 열 수 없는 상태':desc,renderMenuTile({state,attributes:{'aria-label':`${stateLabel('이용내역',state)} · 메뉴 타일 · ${name}`}}))).join('')}${figure('선택됨','선택 여부는 눌림 상태와 구분',renderMenuTile({selected:true,attributes:{'aria-label':'이용내역 · 메뉴 타일 · 선택됨'}}))}</div></section>
 <section class="v2-component-section" id="try" aria-labelledby="try-title"><h2 id="try-title">직접 눌러보기</h2><p>마우스·터치·Tab으로 상태를 확인합니다. 실제 마일리지를 사용하지 않습니다.</p><div class="v2-try-row">${renderButton({attributes:{'data-preview-action':'button'}})}${renderMenuTile({attributes:{'data-preview-action':'tile'}})}</div><p class="v2-preview-status" role="status" aria-live="polite">메뉴 타일을 누르면 선택 여부가 바뀝니다.</p></section>`;
}
