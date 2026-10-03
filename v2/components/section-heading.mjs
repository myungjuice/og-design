import {sectionHeading} from '../../design-system/components/section-heading/render.mjs';
import {surface} from '../../design-system/components/surfaces/render.mjs';
import {escapeHTML as e,uid} from '../../design-system/components/core.mjs';
import {stateComparison} from './catalog.mjs';
const infoIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 10v7M12 7v1"/></svg>';
const actionIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>';
const states=['default','active','disabled','loading','error','success'];
const labels={loading:'확인 중…',error:'다시 시도',success:'확인 완료'};
const messages={disabled:'지금은 내역을 확인할 수 없습니다.',loading:'내역을 확인하는 중입니다.',error:'내역을 불러오지 못했습니다. 다시 시도해 주세요.',success:'내역을 확인했습니다.'};
export function renderSectionHeading({title='',description='',action='',infoButton=false,helpText='',state='default'}={}){
 if(!states.includes(state))throw new RangeError('Unsupported heading action state: '+state);
 if(infoButton&&!helpText.trim())throw new TypeError('An information button requires helpText');
 const helpId=infoButton?uid('v2-heading-help'):undefined;
 const actionLabel=labels[state]||action;
 return `<div class="v2-heading-block">${sectionHeading({title,description,action:action?actionLabel:'',className:'v2-section-heading',
  infoButton,helpId,infoIconHTML:infoIcon,actionIconHTML:actionIcon,actionDisabled:['disabled','loading'].includes(state),
  actionAttributes:{'data-state':state,'data-heading-action':action,'aria-label':title+' '+actionLabel,'aria-busy':state==='loading'?'true':undefined}})}
 ${infoButton?`<p class="v2-heading-help" id="${helpId}" hidden>${e(helpText)}</p>`:''}
 ${action&&messages[state]?`<p class="v2-heading-result" data-state="${state}">${e(messages[state])}</p>`:''}</div>`;
}
const sample=(id,label,description,options)=>`<figure class="v2-component-sample" id="${id}"><figcaption><strong>${e(label)}</strong><span>${e(description)}</span></figcaption>${surface({className:'v2-heading-stage',contentHTML:renderSectionHeading(options)})}</figure>`;
export function renderSectionHeadingSamples(){
 return `<section class="v2-component-section" id="section-heading" aria-labelledby="section-heading-title" hidden><h2 id="section-heading-title">섹션 제목·우측 액션</h2><p>제목과 설명은 평면으로, 전체보기는 텍스트와 화살표로 가볍게 표시합니다. 정보 버튼과 우측 동작은 별도의 터치 영역입니다.</p>
 <div class="v2-heading-grid">
 ${sample('heading-basic','기본형','제목만 있는 정보 묶음',{title:'최근 방문'})}
 ${sample('heading-description','설명형','제목 아래에 간단한 안내를 표시합니다.',{title:'마일리지 내역',description:'적립하고 사용한 마일리지를 확인하세요.'})}
 ${sample('heading-action','우측 액션형','전체보기는 후기를 작성하는 주요 동작보다 낮은 위계입니다.',{title:'최근 방문',action:'전체보기'})}
 ${sample('heading-information','정보 안내형','제목 옆 아이콘을 누르면 안내를 펼칩니다.',{title:'OG 마일리지',action:'내역보기',infoButton:true,helpText:'사용 가능한 마일리지는 총 보유 마일리지에 포함됩니다.'})}
 ${sample('heading-long','긴 제목','제목은 생략하지 않고 줄바꿈합니다. 폭이 부족하면 우측 버튼을 다음 줄로 배치합니다.',{title:'최근 방문한 회원점과 이용 내역',description:'매장별 방문 내역을 확인하세요.',action:'전체보기'})}
 </div>
 ${stateComparison(`<p class="v2-heading-note">우측 내역 확인 버튼의 상태 예시입니다. 섹션 제목은 유지하고 상태는 동작과 안내에서 구분합니다.</p><div class="v2-heading-grid">${states.map((state,index)=>sample('heading-state-'+state,['기본','누르는 중','비활성','처리 중','오류','성공'][index],'',{title:'이용내역',action:'전체보기',state})).join('')}</div>`)}
 <p class="v2-heading-feedback" role="status" aria-live="polite">버튼과 안내의 동작을 확인할 수 있습니다. 실제 내역은 열지 않습니다.</p></section>`;
}
export function setupSectionHeadingSamples(root){
 root.addEventListener('click',event=>{
  const info=event.target.closest('.v2-section-heading .og-heading-info');
  if(info){
   const help=info.closest('.v2-heading-block').querySelector('.v2-heading-help');
   const expanded=info.getAttribute('aria-expanded')!=='true';
   info.setAttribute('aria-expanded',String(expanded));help.hidden=!expanded;return;
  }
  const action=event.target.closest('.v2-section-heading [data-heading-action]');
  if(action&&!action.disabled)root.querySelector('.v2-heading-feedback').textContent=action.dataset.headingAction+' 동작 위치입니다. 실제 내역은 열지 않습니다.';
 });
}
