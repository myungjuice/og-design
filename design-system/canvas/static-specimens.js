/* Presentation-only state sheets. No application interaction is attached here. */
{
 let sequence=0;
 const $=s=>document.querySelector(s);
 const remove=s=>document.querySelectorAll(s).forEach(e=>e.remove());
 const copy=node=>{
  const clone=node.cloneNode(true),suffix='-example-'+(++sequence),ids=new Map();
  [clone,...clone.querySelectorAll('[id]')].forEach(e=>{if(e.id){ids.set(e.id,e.id+suffix);e.id+=suffix;}});
  [clone,...clone.querySelectorAll('*')].forEach(e=>{
   for(const attr of ['for','aria-labelledby','aria-describedby','aria-controls'])if(e.hasAttribute(attr))e.setAttribute(attr,e.getAttribute(attr).split(' ').map(v=>ids.get(v)||v).join(' '));
   if(e.hasAttribute('name'))e.setAttribute('name',e.getAttribute('name')+suffix);
  });return clone;
 };
 const grid=()=>{const e=document.createElement('div');e.className='specimen-grid';return e;};
 const state=(label,node)=>{const e=document.createElement('figure');e.className='specimen-state';e.dataset.staticState=label;const caption=document.createElement('figcaption');caption.textContent=label;e.append(caption,node);return e;};
 const replaceStates=(target,entries)=>{const g=grid();entries.forEach(([label,node])=>g.append(state(label,node)));target.replaceWith(g);return g;};

 // Help: the trigger and the open explanation are always separate examples.
 for(const kind of ['tooltip','popover']){
  const section=$('#help-'+kind+'-specimen'),stage=section.querySelector('.help-stage'),base=stage.querySelector('.og-surface');
  const closed=copy(base);closed.querySelector('.help-preview').remove();closed.querySelector('.og-'+kind).remove();
  const opened=copy(base);opened.querySelector('.help-preview').remove();const overlay=opened.querySelector('.og-'+kind);overlay.removeAttribute('popover');overlay.classList.add('specimen-overlay');overlay.removeAttribute('role');
  opened.querySelector('.og-help-trigger').setAttribute('aria-expanded','true');
  replaceStates(stage,[['기본 · 정보 아이콘',closed],[kind==='tooltip'?'마우스를 올렸을 때':'안내가 열린 상태',opened]]);
 }

 // Sheets are already drawn in the board. Expand each tab instead of opening a dialog.
 remove('#sheet .sheet-actions');
 const sortStage=$('#sheet-choice-specimen .sheet-stage');
 replaceStates(sortStage,['최신순','인기순'].map((label,i)=>{const e=copy(sortStage);e.querySelectorAll('input').forEach((r,j)=>{r.checked=j===i;});return [label+' 선택',e];}));
 const historyStage=$('#sheet-scroll-specimen .sheet-stage');
 replaceStates(historyStage,['예약','웨이팅','Q오더','리뷰'].map((label,i)=>{
  const e=copy(historyStage);e.querySelectorAll('[role="tab"]').forEach((t,j)=>t.setAttribute('aria-selected',String(i===j)));
  e.querySelectorAll('[role="tabpanel"]').forEach((p,j)=>{p.hidden=j!==i;});return [label+' · 내역 없음',e];
 }));

 // Amounts are hand-picked design examples, not a live calculator.
 remove('#progress .progress-controls');
 const mileage=$('#progress-mileage-specimen .progress-stage');
 replaceStates(mileage,[['일반 보유','15,000 M','16,000 M','20,000 M',75,5],['단위 도달','15,000 M','15,000 M','15,000 M',100,0],['사용 전','0 M','1,000 M','5,000 M',0,20],['보유 없음','0 M','0 M','5,000 M',0,0],['불러오는 중','—','—','—',0,0]].map(([label,available,total,end,fill,held])=>{
  const e=copy(mileage),amounts=e.querySelectorAll('dd');amounts[0].textContent=available;amounts[1].textContent=total;
  e.querySelector('.og-progress-caption strong').textContent=end;e.querySelector('.og-progress-fill').style.setProperty('--progress-value',fill+'%');e.querySelector('.og-progress-held').style.setProperty('--progress-held',held+'%');
  const bar=e.querySelector('.og-progress-track');bar.setAttribute('aria-label',label+': 사용 가능 '+available+', 총 보유 '+total);bar.setAttribute('aria-busy',String(label==='불러오는 중'));return [label,e];
 }));
 const generic=$('#progress-basic-specimen .progress-stage');const pending=copy(generic);pending.querySelector('.og-progress-track').setAttribute('aria-busy','true');pending.querySelector('.og-progress-caption strong').textContent='불러오는 중';generic.after(state('불러오는 중',pending));

 remove('#loading .loading-controls,#loading-status');
 const skeletonStage=$('#loading-skeleton-specimen .loading-stage'),loadingGrid=grid();
 [...skeletonStage.children].forEach(example=>{for(const busy of [true,false]){const e=copy(example);e.querySelectorAll('.og-loading-frame').forEach(f=>{f.setAttribute('aria-busy',String(busy));f.querySelector('[data-content]').setAttribute('aria-hidden',String(busy));f.querySelector('[data-skeleton]').hidden=!busy;});loadingGrid.append(state(example.querySelector('h3').textContent+' · '+(busy?'불러오는 중':'내용 표시'),e));}});skeletonStage.replaceWith(loadingGrid);

 remove('#feedback .feedback-controls,#feedback-status');
 const errorStage=$('#feedback-error-specimen .feedback-stage');
 replaceStates(errorStage,[['불러오기 실패','cloud_off','불러오지 못했어요','잠시 후 다시 시도해 주세요.','다시 시도'],['재시도 중','sync','불러오는 중이에요','잠시만 기다려 주세요.','확인 중'],['재시도 실패','cloud_off','다시 불러오지 못했어요','잠시 후 다시 시도해 주세요.','다시 시도'],['내용 표시','storefront','회원점명','최근 방문 매장','']].map(([label,icon,title,description,button])=>{
  const e=copy(errorStage);e.querySelector('.material-icons').textContent=icon;e.querySelector('h3').textContent=title;e.querySelector('.og-feedback>p').textContent=description;const b=e.querySelector('button');b.textContent=button;b.hidden=!button;b.disabled=label==='재시도 중';return [label,e];
 }));

 const search=$('#search .search-demo');remove('#search .search-demo-controls');
 replaceStates(search,[['검색 전','','매장명이나 업종으로 검색하세요.'],['입력 후','카페','검색어를 입력한 상태입니다.'],['검색 중','카페','검색 중…'],['결과 없음','카페','검색 결과가 없습니다. 다른 검색어를 입력해 주세요.'],['검색 실패','카페','검색하지 못했습니다. 다시 시도해 주세요.']].map(([label,value,message])=>{
  const e=copy(search);e.querySelector('input').value=value;e.querySelector('.og-field-clear').hidden=!value;e.querySelector('[role="status"]').textContent=message;e.querySelector('.og-field-help').textContent='매장명 또는 업종';e.querySelector('.search-preview-results button').hidden=label!=='검색 실패';e.querySelector('[type="submit"]').disabled=label==='검색 중';return [label,e];
 }));

 remove('#avatar .media-controls,#media-status');const media=$('#media-live');
 replaceStates(media,[['정상','ready'],['불러오는 중','loading'],['이미지 없음','empty'],['불러오기 실패','error']].map(([label,value])=>{const e=copy(media);e.dataset.state=value;e.querySelector('.og-media-fallback span').textContent=label;return [label,e];}));
 remove('#badges .badge-count-controls,#badge-count-status');const badges=$('#notification-badge-specimen .badge-example-box');
 replaceStates(badges,[0,1,9,99,100].map(n=>{const e=copy(badges);e.querySelector('.og-count-badge').hidden=n===0;e.querySelector('.og-count-value').textContent=n>99?'99+':n;e.querySelector('.og-unread-dot').hidden=n===0;e.querySelector('.og-count-badge').setAttribute('aria-label','읽지 않은 알림 '+n+'개');return [n+'개',e];}));

 // Existing control grids stay; add only the states that previously required interaction.
 const checks=$('#checkbox-specimen .selection-demo');replaceStates(checks,[0,1,3].map(n=>{const e=copy(checks);const inputs=e.querySelectorAll('input');inputs[0].checked=n===3;inputs[0].indeterminate=n===1;[1,2,3].forEach((i,j)=>inputs[i].checked=j<n);e.querySelector('.og-choice-help').textContent=n+' / 3개 선택';return [n===0?'선택 전':n===1?'부분 선택':'전체 선택',e];}));
 remove('#selection .selection-simulation');const switchDemo=$('#switch-specimen .selection-demo');
 replaceStates(switchDemo,[['꺼짐',false,'현재 꺼짐'],['켜짐',true,'현재 켜짐'],['저장 중',true,'저장 중…'],['저장 실패',false,'저장하지 못했습니다. 이전 상태를 유지합니다.']].map(([label,on,description])=>{const e=copy(switchDemo);e.querySelector('input').checked=on;e.querySelector('input').disabled=label==='저장 중';e.querySelector('small').textContent=on?'현재 켜짐':'현재 꺼짐';e.querySelector('.og-choice-help').textContent=description;return [label,e];}));
 const tabs=$('#tabs-specimen .tc-demo');replaceStates(tabs,['전체','적립','사용'].map((label,i)=>{const e=copy(tabs);e.querySelectorAll('[role="tab"]').forEach((t,j)=>t.setAttribute('aria-selected',String(i===j)));e.querySelectorAll('[role="tabpanel"]').forEach((p,j)=>p.hidden=i!==j);return [label+' 선택',e];}));
 const segment=$('#segment-specimen .tc-demo');replaceStates(segment,['목록','지도'].map((label,i)=>{const e=copy(segment);e.querySelectorAll('input').forEach((r,j)=>r.checked=i===j);e.querySelector('.tc-status').textContent=label+' 선택';return [label,e];}));
 const multi=$('#multi-chips').parentElement;replaceStates(multi,[0,2,3].map(count=>{const e=copy(multi);e.querySelectorAll('[data-filter]').forEach((b,i)=>b.setAttribute('aria-pressed',String(i<count)));e.querySelector('.tc-status').textContent=count===3?'3 / 3개 선택 · 최대 3개까지 선택할 수 있습니다.':count+' / 3개 선택';return [count===3?'선택 한도':count+'개 선택',e];}));
 $('#removable-chips').innerHTML='<span class="og-filter-token">카페<button type="button" aria-label="카페 필터 삭제">×</button></span><span class="og-filter-token">식당<button type="button" aria-label="식당 필터 삭제">×</button></span>';remove('#chip-reset');

 const password=$('#password-specimen .input-demo');replaceStates(password,['숨김','표시'].map((label,i)=>{const e=copy(password);const input=e.querySelector('input');input.type=i?'text':'password';input.value='Example123';e.querySelector('button').textContent=i?'숨기기':'표시';e.querySelector('.og-field-help').textContent='비밀번호 '+label+' 상태';return [label,e];}));
 $('#input-specimen .input-demo-note').textContent='오류는 입력창 아래에서 안내합니다.';
 for(const name of ['phone','number']){const e=$('#'+name+'-specimen .og-field'),failed=copy(e);failed.querySelector('input').value=name==='phone'?'010-12':'12가';failed.querySelector('input').setAttribute('aria-invalid','true');failed.querySelector('.og-field-help').textContent=name==='phone'?'휴대전화 번호를 확인해 주세요.':'숫자만 입력해 주세요.';e.after(state('입력 오류',failed));}
 const textarea=$('#textarea-specimen .og-field'),filled=copy(textarea);filled.querySelector('textarea').value='마일리지 내역을 확인하고 싶습니다.';filled.querySelector('.og-field-count').textContent=filled.querySelector('textarea').value.length+' / 200';textarea.after(state('입력 후',filled));
 document.querySelectorAll('#quantity .og-quantity').forEach(e=>{const n=Number(e.dataset.value);e.querySelector('[data-quantity-minus]').disabled=n===Number(e.dataset.min)||e.getAttribute('aria-disabled')==='true';e.querySelector('[data-quantity-plus]').disabled=n===Number(e.dataset.max)||e.getAttribute('aria-disabled')==='true';});
 $('#quantity-basic-specimen .quantity-stage .quantity-note').textContent='최소 수량 · 줄이기 버튼 비활성';
 const heading=$('#heading-with-action').closest('.heading-stage');replaceStates(heading,[false,true].map(open=>{const e=copy(heading);e.querySelector('.og-heading-help').hidden=!open;e.querySelector('.og-heading-info').setAttribute('aria-expanded',String(open));e.querySelector('.heading-content-sample').remove();return [open?'설명 표시':'기본',e];}));remove('#heading-status,#row-status,#tile-status');
 remove('#motion-toggle');const motion=$('#motion-sample');motion?.classList.add('is-open');motion?.setAttribute('aria-hidden','false');

 // Only canvas tools and handoff controls are actionable. Keep native styling intact.
 document.querySelectorAll('.board button,.board input,.board textarea,.board select,.board a,.board summary,.board [tabindex]').forEach(e=>{
  if(e.matches('[data-field-prompt],[data-board-prompt],[data-prompt],[data-text-scale]'))return;
  e.inert=true;if(e.tagName==='BUTTON')e.type='button';
 });
 document.querySelectorAll('.board [aria-live]').forEach(e=>e.removeAttribute('aria-live'));
}
