import {iconButton,favorite} from '../../design-system/components/button/render.mjs';
import {escapeHTML as e} from '../../design-system/components/core.mjs';
import {stateComparison} from './catalog.mjs';
const art={
 info:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7v1"/></svg>',
 close:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>'
};
export const iconButtonArt=kind=>{if(!Object.hasOwn(art,kind))throw new RangeError('Unsupported icon artwork');return art[kind];};
const labels={info:'안내',close:'닫기',favorite:'즐겨찾기'};
const states=['default','active','disabled','loading','error','success'];
export function renderIconButton({kind='close',face=kind==='close'?'raised':'plain',label=labels[kind],state='default',selected=false,className='',attributes={}}={}){
 if(!Object.hasOwn(labels,kind))throw new RangeError('Unsupported icon button kind');
 if(!['plain','raised'].includes(face))throw new RangeError('Unsupported icon button face');
 if(!states.includes(state))throw new RangeError('Unsupported icon button state');
 if(typeof label!=='string'||!label.trim())throw new TypeError('Icon button requires an accessible name');
 const cls='v2-icon-button'+(className?' '+className:'');
 const values={...attributes,'aria-label':label,'data-face':face,'data-state':state,disabled:['disabled','loading'].includes(state),'aria-busy':state==='loading'?'true':undefined};
 if(kind==='favorite')return favorite({label,selected,attributes:{...values,'aria-pressed':String(selected)}}).replace('class="og-button og-favorite"','class="og-button og-favorite '+e(cls)+'"');
 return iconButton({label,iconHTML:iconButtonArt(kind),className:cls,attributes:values});
}
const sample=(title,note,props)=>'<figure class="v2-component-sample"><figcaption><strong>'+e(title)+'</strong><span>'+e(note)+'</span></figcaption><div class="v2-icon-stage" inert>'+renderIconButton(props)+'</div></figure>';
export function renderIconButtonSamples(){
 return '<section class="v2-component-section" id="icon-buttons" aria-labelledby="icon-buttons-title" hidden><h2 id="icon-buttons-title">아이콘 버튼·즐겨찾기</h2><p>아이콘은 20px, 터치 영역은 48px입니다. 독립형 동작은 평면 Line으로 표시하고 정보·닫기·즐겨찾기의 의미는 과한 장식 없이 구분합니다.</p><div class="v2-icon-grid">'+
 sample('독립형 아이콘 버튼','흰 40px 평면에 연한 경계선을 적용합니다.',{kind:'close'})+
 sample('내용 옆 정보 버튼','제목·금액 옆에서는 배경 없이 표현합니다.',{kind:'info'})+
 sample('내용 옆 닫기 버튼','도움말처럼 표면 위에서는 받침을 반복하지 않습니다.',{kind:'close',face:'plain'})+
 sample('즐겨찾기 · 선택 전','회색 윤곽선 하트입니다.',{kind:'favorite'})+
 sample('즐겨찾기 · 선택 후','보라색 채움과 선택 상태를 함께 제공합니다.',{kind:'favorite',selected:true})+'</div>'+
 stateComparison('<div class="v2-icon-grid">'+[
 ['active','누르는 중','선택 여부와 누르는 피드백은 구분합니다.'],
 ['disabled','비활성','변경할 수 없는 상태이며 선택 여부는 남깁니다.'],
 ['loading','처리 중','선택 영역 크기를 유지하며 중복 실행을 막습니다.'],
 ['error','변경 실패','이전 선택 상태를 유지하고 원인·다시 시도 안내는 본문에 표시합니다.'],
 ['success','변경 완료','선택 결과로 구분하고 안내가 필요할 때 본문에 표시합니다.']
 ].map(([state,title,note])=>sample(title,note,{kind:'favorite',state,selected:['disabled','success'].includes(state)})).join('')+sample('독립형 · 누르는 중','평면 배경만 바뀌고 아이콘 위치는 유지합니다.',{kind:'close',state:'active'})+'</div>')+
 '<div class="v2-icon-demo"><h3>즐겨찾기 눌러보기</h3><p>이 검토 화면에서만 선택 표시가 바뀝니다. 실제 매장 즐겨찾기는 저장하지 않습니다.</p><div class="v2-icon-live"><div class="v2-icon-demo-row"><span>오시 망원본점</span>'+renderIconButton({kind:'favorite',label:'오시 망원본점 즐겨찾기',attributes:{'data-icon-favorite':true}})+'</div><div class="v2-icon-demo-row"><span>변경할 수 없는 예시</span>'+renderIconButton({kind:'favorite',label:'변경할 수 없는 즐겨찾기',selected:true,state:'disabled',attributes:{'data-icon-favorite':true}})+'</div></div><p data-icon-feedback role="status" aria-live="polite" aria-atomic="true"></p></div><ul class="v2-icon-rules"><li>아이콘만 있는 버튼에도 기능 이름을 제공합니다. 즐겨찾기의 이름은 선택 전후에도 유지합니다.</li><li>선택 여부는 하트 채움과 aria-pressed로, 실행 상태는 별도 안내로 구분합니다.</li><li>정보·닫기 버튼에 의미 없는 처리·성공 상태를 붙이지 않습니다. 웹 검토에서 포커스·키보드 조작은 유지합니다.</li></ul></section>';
}
export function setupIconButtonSamples(root){
 const section=root.querySelector('#icon-buttons');if(!section||section.dataset.iconReady)return;
 section.dataset.iconReady='true';
 section.addEventListener('click',event=>{
  const button=event.target.closest('[data-icon-favorite]');if(!button||button.disabled)return;
  const selected=button.getAttribute('aria-pressed')!=='true';button.setAttribute('aria-pressed',String(selected));
  section.querySelector('[data-icon-feedback]').textContent=selected?'즐겨찾기 선택 예시입니다. 실제로 저장하지 않습니다.':'즐겨찾기 해제 예시입니다. 실제로 저장하지 않습니다.';
 });
}
