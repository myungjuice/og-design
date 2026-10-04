import {button} from '../../design-system/components/button/render.mjs';
import {surface,menuTile} from '../../design-system/components/surfaces/render.mjs';
import {escapeHTML as e} from '../../design-system/components/core.mjs';
import {renderMileageSamples} from './mileage.mjs';
import {renderHomeControlSamples} from './home-controls.mjs';
import {renderListRowSamples} from './list-row.mjs';
import {renderSectionHeadingSamples} from './section-heading.mjs';
import {renderSelectionSamples} from './selection.mjs';
import {renderInputSamples} from './input.mjs';
import {renderDialogSamples} from './dialog.mjs';
import {renderNoticeSamples} from './notice.mjs';
import {renderFeedbackSamples} from './feedback.mjs';
import {renderLoadingSamples} from './loading.mjs';
import {renderSnackbarSamples} from './snackbar.mjs';
import {stateComparison} from './catalog.mjs';
import {menuArt} from '../../screens/my-info-3d-test/render.mjs';
export {renderListRow} from './list-row.mjs';
export {renderSectionHeading} from './section-heading.mjs';
export {renderSelection} from './selection.mjs';
export {renderInput,renderMultiline,renderPhoneInput,renderNumericInput} from './input.mjs';
export {renderDialog} from './dialog.mjs';
export {renderNotice} from './notice.mjs';
export {renderFeedback} from './feedback.mjs';
export {renderLoading,renderLoadingFrame,renderLoadingRow,renderLoadingMileage} from './loading.mjs';
export {renderSnackbar} from './snackbar.mjs';
export const componentStates=[
 ['default','기본','동작하기 전'],['active','누르는 중','손가락으로 누르는 동안 얕게 눌림'],
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
export function renderMenuTile({label='이용내역',state='default',selected=false,layout='icon',art='receipt',attributes={}}={}){
 if(!['icon','text'].includes(layout))throw new RangeError('Unsupported menu layout: '+layout);
 if(!componentStates.some(([name])=>name===state))throw new RangeError('Unsupported menu state: '+state);
 if(layout==='icon'&&!['receipt','bell','membership','support','settings','account'].includes(art))throw new RangeError('Unsupported menu art: '+art);
 return menuTile({label:stateLabel(label,state),className:'v2-menu-tile',iconHTML:layout==='icon'?menuArt(art,'/screens/my-info-3d-test/media/figma/'):'',attributes:{...attributes,
  'data-layout':layout,'data-state':state,disabled:['disabled','loading'].includes(state),'aria-busy':state==='loading'?'true':undefined,
  'aria-pressed':String(selected)}});
}
const tileStage=options=>`<div class="v2-menu-tile-stage">${renderMenuTile(options)}</div>`;
const figure=(name,description,control)=>`<figure class="v2-component-sample"><figcaption><strong>${name}</strong><span>${description}</span></figcaption>${control}</figure>`;
export function renderComponents(){
 const variants=[['primary','주요 버튼','마일리지 사용','보라색 표면 · 가장 중요한 동작'],['secondary','보조 버튼','영수증 적립','흰 표면 · 주요 버튼 옆의 보조 동작'],['review','작은 후기 버튼','후기 작성','작은 시각 크기 · 터치 영역은 44px 이상']];
 return `<p class="v2-intro">그룹별로 컴포넌트의 기본 형태와 동작 상태를 확인합니다.</p>
 ${variants.map(([id,title,label,description])=>{
  const sample=([state,name,desc])=>figure(name,state==='disabled'&&id!=='primary'?(id==='review'?'후기 작성을 진행할 수 없는 상태':'적립을 진행할 수 없는 상태'):desc,renderButton({variant:id,label,state,attributes:{'data-component':'button','aria-label':`${stateLabel(label,state)} · ${title} · ${name}`}}));
  return `<section class="v2-component-section" id="${id}" aria-labelledby="${id}-title"${id!=='primary'?' hidden':''}><h2 id="${id}-title">${title}</h2><p>${description}</p>
  <div class="v2-component-grid">${sample(componentStates[0])}</div>${stateComparison(`<div class="v2-component-grid">${componentStates.slice(1).map(sample).join('')}</div>`)}</section>`;
 }).join('')}
 <section class="v2-component-section" id="cards" aria-labelledby="cards-title" hidden><h2 id="cards-title">카드·메뉴 타일</h2><p>정보 카드에는 눌림 상태를 적용하지 않습니다. 동작이 있는 메뉴 타일만 상태를 갖습니다.</p>
 <div class="v2-info-card-sample">${renderCard({title:'최근 방문',description:'정보를 담는 흰 카드입니다. 클릭 대상이 아닙니다.'})}</div>
 <div class="v2-component-grid">${figure('아이콘형 · 기본','내정보와 같은 3D 아이콘 판 아래에 이름을 표시합니다.',tileStage({attributes:{'aria-label':'이용내역 · 메뉴 타일 · 기본'}}))}${figure('텍스트형','아이콘 없이 짧은 메뉴명을 판 안에 표시하는 별도 형태입니다.',tileStage({layout:'text',attributes:{'aria-label':'이용내역 · 텍스트형 메뉴 타일'}}))}</div>
 ${stateComparison(`<div class="v2-component-grid">${componentStates.slice(1).map(([state,name,desc])=>figure(name,state==='disabled'?'이용내역을 열 수 없는 상태':desc,tileStage({state,attributes:{'aria-label':`${stateLabel('이용내역',state)} · 메뉴 타일 · ${name}`}}))).join('')}${figure('선택됨','선택 여부는 눌림 상태와 구분',tileStage({selected:true,attributes:{'aria-label':'이용내역 · 메뉴 타일 · 선택됨'}}))}</div>`)}</section>
 ${renderMileageSamples()}
 ${renderListRowSamples()}
 ${renderSectionHeadingSamples()}
 ${renderSelectionSamples()}
 ${renderHomeControlSamples()}
 ${renderInputSamples()}
 ${renderDialogSamples()}
 ${renderNoticeSamples()}
 ${renderFeedbackSamples()}
 ${renderSnackbarSamples()}
 ${renderLoadingSamples()}
 <section class="v2-component-section" id="try" aria-labelledby="try-title" hidden><h2 id="try-title">직접 눌러보기</h2><p>터치해서 눌림과 선택 상태를 확인합니다. 실제 마일리지를 사용하지 않습니다.</p><div class="v2-try-row">${renderButton({attributes:{'data-preview-action':'button'}})}${tileStage({attributes:{'data-preview-action':'tile'}})}</div><p class="v2-preview-status" role="status" aria-live="polite">메뉴 타일을 누르면 선택 여부가 바뀝니다.</p>
 <details class="v2-accessibility-check"><summary>접근성 점검</summary><p>웹 검토 페이지에서는 Tab으로 버튼에 이동하고 Enter·Space로 누를 수 있습니다. 실제 포커스 표시와 키보드 조작은 유지하며, 앱 기본 시안의 상태 비교에서는 제외했습니다.</p></details></section>`;
}
