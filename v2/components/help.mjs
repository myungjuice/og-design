import {tooltip,popover} from '../../design-system/components/help/render.mjs';
import {iconButton,button} from '../../design-system/components/button/render.mjs';
import {renderIconButton} from './icon-button.mjs';
import {attributes as attrs,uid} from '../../design-system/components/core.mjs';
export function renderHelp({kind='popover',id=uid('v2-help'),title='마일리지 안내',body='',live=false}={}){
 if(!['tooltip','popover'].includes(kind))throw new RangeError('Unsupported help kind');
 if(!body.trim())throw new TypeError('Help requires visible explanation');
 if(kind==='popover'&&!title.trim())throw new TypeError('Popover requires a visible title');
 const liveAttrs=live?attrs({popover:'auto','data-help-panel':kind}):'';
 if(kind==='tooltip')return tooltip({id,message:body}).replace('class="og-tooltip"','class="og-tooltip v2-help-panel v2-help-tooltip"'+liveAttrs);
 return popover({id,title,body,attributes:live?{popover:'auto','data-help-panel':kind}:{}})
  .replace('class="og-popover"','class="og-popover v2-help-panel"')
  .replace(iconButton({label:'안내 닫기',name:'close',className:'og-help-close',attributes:{'data-help-close':true}}),renderIconButton({kind:'close',face:'plain',label:'안내 닫기',className:'og-help-close',attributes:{'data-help-close':true}}));
}
// The menu supplies one raised container; its actions remain quiet text rows.
export function renderActionMenu({label='리뷰 관리 메뉴',items=[{label:'수정'},{label:'삭제',danger:true}]}={}){
 return '<div class="v2-action-menu" role="group"'+attrs({'aria-label':label})+'>'+items.map(item=>button({label:item.label,variant:'text',className:'v2-button v2-action-menu-item',disabled:!!item.disabled,attributes:{'data-tone':item.danger?'danger':undefined}})).join('')+'</div>';
}
const trigger=(kind,id,label)=>renderIconButton({kind:'info',face:'plain',label,className:'v2-help-trigger',attributes:{'data-help-trigger':kind,...(kind==='popover'?{'aria-haspopup':'dialog','aria-expanded':'false','aria-controls':id}:{'aria-describedby':id})}});
const body='사용 가능 마일리지는 지금 사용할 수 있는 금액입니다. 총 보유 마일리지에는 사용 가능 금액이 포함됩니다.';
const brief='사용 가능한 금액을 포함한 전체 마일리지입니다.';
export function renderHelpSamples(){
 return '<section class="v2-component-section" id="help" aria-labelledby="help-title" hidden><h2 id="help-title">도움말·툴팁</h2><p>낯선 용어는 짧게 설명합니다. 앱에서는 정보 버튼을 탭해 안내를 열고, 중요한 내용은 화면 본문에도 남깁니다.</p><div class="v2-help-grid">'+
 '<figure class="v2-component-sample"><figcaption><strong>탭으로 여는 도움말</strong><span>짧은 제목과 설명, 닫기 버튼을 둡니다. 배경을 어둡게 가리지 않습니다.</span></figcaption><div class="v2-help-stage" inert>'+renderHelp({body})+'</div></figure>'+
 '<figure class="v2-component-sample"><figcaption><strong>짧은 툴팁</strong><span>한 용어의 뜻만 설명하며 버튼이나 링크를 넣지 않습니다.</span></figcaption><div class="v2-help-stage" inert>'+renderHelp({kind:'tooltip',body:brief})+'</div></figure></div>'+
 '<div class="v2-help-demo"><h3>열어보기</h3><p>정보 버튼을 눌러 위치와 닫기 동작을 확인합니다. 실제 조회나 저장은 하지 않습니다.</p><div class="v2-help-live-stage"><div class="v2-help-term"><span>마일리지</span>'+trigger('popover','v2-mileage-help','마일리지 안내')+'</div><div class="v2-help-term"><span>총 보유</span>'+trigger('tooltip','v2-total-help','총 보유 설명')+'</div><button type="button" class="v2-help-outside">설명 밖 터치 영역</button></div>'+renderHelp({id:'v2-mileage-help',body,live:true})+renderHelp({kind:'tooltip',id:'v2-total-help',body:brief,live:true})+'</div>'+
 '<ul class="v2-help-rules"><li>아이콘과 설명 사이를 8px 띄우고 화면 가장자리에서 12px 이상 확보합니다. 아래 공간이 부족하면 위쪽으로 옮깁니다.</li><li>도움말은 바깥 영역·닫기 버튼·Escape로 닫습니다. 긴 설명이나 추가 동작은 바텀시트 또는 별도 화면으로 보냅니다.</li><li>툴팁은 탭하거나 웹 검토 화면에서 포커스하면 열립니다. 필수 정보나 오류를 툴팁에만 넣지 않습니다.</li></ul></section>';
}
export function setupHelpSamples(root){
 const section=root.querySelector('#help');if(!section||section.dataset.helpReady)return;
 section.dataset.helpReady='true';
 const controls=[];
 for(const button of section.querySelectorAll('[data-help-trigger]')){
  const id=button.getAttribute('aria-controls')||button.getAttribute('aria-describedby'),panel=section.querySelector('#'+id);
  controls.push(window.ogAttachHelp(button,panel,{tooltip:button.dataset.helpTrigger==='tooltip',anchorElement:button.querySelector('svg')}));
  // A hidden native popover has no scroll box. Reset after the shared click
  // handler has shown it, so the title and focused close remain visible.
  const resetScroll=()=>{if(panel.matches(':popover-open'))panel.scrollTop=0;};
  button.addEventListener('click',resetScroll);
  button.addEventListener('focus',resetScroll);
 }
 // A top-layer panel must not remain over another gallery group.
 new MutationObserver(()=>{if(section.hidden)controls.forEach(control=>control.hide());}).observe(section,{attributes:true,attributeFilter:['hidden']});
}
