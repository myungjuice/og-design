import {badge,countBadge,unreadDot} from '../../design-system/components/badges/render.mjs';
import {escapeHTML as e} from '../../design-system/components/core.mjs';
import {stateComparison} from './catalog.mjs';
const tones=['neutral','brand','info','success','warning','error'];
const counts=[0,1,9,99,100,128];
export function renderBadge({label='회원점',tone='neutral',size='small',variant='soft'}={}){
 if(typeof label!=='string'||!label.trim())throw new TypeError('Badge requires visible meaning');
 if(!tones.includes(tone))throw new RangeError('Unsupported badge tone: '+tone);
 if(!['compact','small','medium'].includes(size))throw new RangeError('Unsupported badge size: '+size);
 if(!['soft','solid'].includes(variant)||variant==='solid'&&tone!=='brand')throw new RangeError('Solid badge is reserved for the brand tone');
 return badge({label,tone,size}).replace('class="og-badge"','class="og-badge v2-badge" data-variant="'+variant+'"');
}
export function renderCountBadge({count,id}={}){
 if(!Number.isSafeInteger(count)||count<0)throw new RangeError('Notification count must be a non-negative safe integer');
 return countBadge({count,id}).replace('class="og-count-badge"','class="og-count-badge v2-count-badge"');
}
export function renderUnreadDot({visible=true,id,label='읽지 않은 공지 있음'}={}){
 if(typeof visible!=='boolean')throw new TypeError('Unread visibility must be boolean');
 if(typeof label!=='string'||!label.trim())throw new TypeError('Unread indicator requires an accessible meaning');
 return unreadDot({visible,id,label}).replace('class="og-unread-dot"','class="og-unread-dot v2-unread-dot"');
}
const row=content=>'<div class="v2-badge-row">'+content+'</div>';
const stage=content=>'<div class="v2-badge-stage">'+content+'</div>';
const sample=(title,content,description='')=>'<figure class="v2-component-sample"><figcaption><strong>'+e(title)+'</strong>'+(description?'<span>'+e(description)+'</span>':'')+'</figcaption>'+stage(content)+'</figure>';
const mark=(label,tone='neutral',size='small')=>renderBadge({label,tone,size});
export function renderBadgeSamples(){
 return `<section class="v2-component-section" id="badges" aria-labelledby="badges-title" hidden><h2 id="badges-title">배지·상태 라벨</h2><p>상태와 구분을 짧게 알려줍니다. 가장자리에만 얕은 입체감을 주고, 선택하는 칩과 달리 눌림·선택 효과는 넣지 않습니다.</p>
 <div class="v2-badge-grid">
 ${sample('신규',row(renderBadge({label:'신규',tone:'brand',size:'compact',variant:'solid'})+'<span class="v2-badge-context-name">오시 망원본점</span>'),'10px · 굵기 400. 실제 화면의 표시 위치는 별도 검토합니다.')}
 ${sample('진행·처리 상태',row(mark('진행 중','info')+mark('완료','success')+mark('확인 필요','warning')+mark('종료')+mark('실패','error')),'색뿐 아니라 문구로도 의미를 전달합니다.')}
 ${sample('공모전 진행 상태',row(mark('진행 중','info')+mark('심사 중','warning')+mark('종료')))}
 ${sample('매장 구분',row(mark('회원점','brand')+mark('일반 매장')))}
 ${sample('출품 형식',row(['사진','영상','그림'].map(label=>mark(label)).join('')),'형식은 같은 중립색으로 표시합니다.')}
 </div>
 ${stateComparison('<div class="v2-badge-grid">'+sample('기본 · 24px / 큰 크기 · 28px',row(mark('심사 중','warning')+mark('심사 중','warning','medium')))+sample('긴 제목과 함께',row('<span class="v2-badge-context-name">긴 이름의 공모전 출품작을 함께 표시하는 배치 예시</span>'+mark('심사 중','warning')+mark('사진')))+sample('긴 상태 문구',row(mark('추가 정보를 확인한 뒤 다시 신청해 주세요','warning')),'긴 설명은 본문을 권장하며, 예상보다 긴 라벨도 잘라 숨기지 않습니다.')+'</div>','크기·긴 내용 비교')}
 <p>라벨 자체는 버튼이 아닙니다. 원인·다음 행동은 관련 본문에서 안내하며 기존 화면의 배지 위치와 색상은 변경하지 않습니다.</p></section>
 <section class="v2-component-section" id="notification-badges" aria-labelledby="notification-badges-title" hidden><h2 id="notification-badges-title">숫자 알림·읽지 않음</h2><p>알림 개수 또는 읽지 않음 여부를 표시합니다. 아래 조작은 예시 표시만 바꾸며 실제 알림은 조회하지 않습니다.</p>
 ${stage(`<div data-badge-preview><label class="v2-badge-preview-controls" for="v2-badge-count-select">예시 알림 개수<select id="v2-badge-count-select" data-badge-count>${counts.map(count=>'<option value="'+count+'"'+(count===9?' selected':'')+'>'+count+'개</option>').join('')}</select></label>
 <div class="v2-badge-context-row"><span>알림 · 개수 표시</span><span data-badge-count-slot>${renderCountBadge({count:9,id:'v2-badge-live-count'})}</span></div>
 <div class="v2-badge-context-row"><span>공지 · 읽지 않음 여부</span><span data-badge-dot-slot>${renderUnreadDot({id:'v2-badge-live-dot'})}</span></div>
 <p class="v2-badge-preview-message" data-badge-message role="status" aria-live="polite" aria-atomic="true"></p></div>`)}
 ${stateComparison('<div class="v2-badge-grid">'+sample('0개 · 숨김',row('<span>읽지 않은 알림 없음</span>'+renderCountBadge({count:0})+renderUnreadDot({visible:false})))+sample('100개 이상 · 99+',row('<span>표시 예시</span>'+renderCountBadge({count:128})))+sample('개수를 모르는 상태',row(mark('확인 중')),'불러오는 중·조회 실패를 알림 0개로 취급하지 않습니다.')+'</div>','경계값 비교')}
 <ul class="v2-badge-rules"><li>0개는 숨기고 100개 이상은 99+로 표시합니다. 읽기 도구에는 실제 개수를 전달합니다.</li><li>같은 항목에 점과 숫자를 중복 표시하지 않습니다. 위 두 행은 표현 방식 비교입니다.</li><li>메뉴 버튼 안에서 사용할 때는 배지를 별도 포커스 대상으로 만들지 않고 버튼 이름에 읽지 않은 개수를 함께 안내합니다.</li></ul></section>`;
}
export function setupBadgeSamples(root){
 for(const widget of root.querySelectorAll('[data-badge-preview]')){
  if(widget.dataset.badgeReady==='true')continue;
  widget.dataset.badgeReady='true';
  const select=widget.querySelector('[data-badge-count]'),number=widget.querySelector('[data-badge-count-slot]'),dot=widget.querySelector('[data-badge-dot-slot]'),message=widget.querySelector('[data-badge-message]');
  select.addEventListener('change',()=>{
   const count=Number(select.value);if(!counts.includes(count))return;
   number.innerHTML=renderCountBadge({count,id:'v2-badge-live-count'});
   dot.innerHTML=renderUnreadDot({visible:count>0,id:'v2-badge-live-dot'});
   message.textContent=count===0?'0개 · 숫자 배지와 읽지 않음 점을 숨깁니다.':count+'개 · '+(count>99?'숫자는 99+로 표시합니다.':'숫자 배지와 읽지 않음 점을 표시합니다.');
  });
 }
}
