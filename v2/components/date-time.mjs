import {calendar,timePicker} from '../../design-system/components/date-time/render.mjs';
import {button} from '../../design-system/components/button/render.mjs';
import {escapeHTML as e,attributes as attrs,uid} from '../../design-system/components/core.mjs';
const iso=(year,month,day)=>String(year).padStart(4,'0')+'-'+String(month).padStart(2,'0')+'-'+String(day).padStart(2,'0');
export function isDate(value){
 if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;
 const date=new Date(value+'T00:00:00Z');return !Number.isNaN(date.getTime())&&date.toISOString().slice(0,10)===value;
}
function monthValid(year,month){if(!Number.isInteger(year)||year<100||year>9999||!Number.isInteger(month)||month<1||month>12)throw new RangeError('Invalid calendar month');}
export function shiftMonth(year,month,delta){
 monthValid(year,month);if(![-1,1].includes(delta))throw new RangeError('Shift one month');
 const date=new Date(Date.UTC(year,month-1+delta,1)),next={year:date.getUTCFullYear(),month:date.getUTCMonth()+1};monthValid(next.year,next.month);return next;
}
const validDates=dates=>{if(!Array.isArray(dates)||dates.some(date=>!isDate(date)))throw new RangeError('Invalid disabled dates');};
function rangeValid(range,disabled){
 if(!range||range.start!==null&&!isDate(range.start)||range.end!==null&&(!isDate(range.end)||!range.start||range.end<range.start))throw new RangeError('Invalid range');
 if(disabled.some(date=>date===range.start||range.end&&date>=range.start&&date<=range.end))throw new RangeError('Range contains an unavailable date');
}
export function selectRange(range,date,disabled=[]){
 validDates(disabled);rangeValid(range,disabled);if(!isDate(date)||disabled.includes(date))throw new RangeError('Unavailable date');
 const next=!range.start||range.end?{start:date,end:null}:{start:date<range.start?date:range.start,end:date<range.start?range.start:date};rangeValid(next,disabled);return next;
}
const summary=(selected,range)=>range?(range.end?range.start+' – '+range.end:range.start?range.start+' · 종료일을 선택해 주세요.':'시작일을 선택해 주세요.'):(selected?'선택한 날짜 · '+selected:'날짜를 선택해 주세요.');
const footer=ready=>'<div class="og-picker-footer">'+button({label:'취소',variant:'secondary',className:'v2-button',attributes:{'data-picker-cancel':true}})+button({label:'선택 적용',className:'v2-button',disabled:!ready,attributes:{'data-picker-apply':true}})+'</div>';
export function renderDatePicker({id=uid('v2-date'),year=2026,month=9,selected=null,today=null,disabled=[],range=null}={}){
 monthValid(year,month);validDates(disabled);
 if(selected!==null&&(!isDate(selected)||disabled.includes(selected))||today!==null&&!isDate(today))throw new RangeError('Invalid selected or reference date');
 if(range){rangeValid(range,disabled);if(selected!==null)throw new RangeError('Choose date or range');}
 let day=0;
 const html=calendar({year,month,showSummary:false,showActions:false,range})
  .replace('class="og-calendar"',()=> 'class="og-calendar v2-calendar"'+attrs({id,'data-date-picker':true,'data-picker-year':year,'data-picker-month':month,'data-picker-selected':selected||'','data-picker-today':today||'','data-picker-disabled':JSON.stringify(disabled),'data-picker-range':range?JSON.stringify(range):undefined}))
  .replace(/<button[^>]*class="og-calendar-day"[^>]*>/g,()=>{
   const date=iso(year,month,++day),endpoint=range&&(date===range.start||date===range.end);
   return '<button type="button" class="og-calendar-day"'+attrs({'data-date':date,'aria-pressed':String(range?!!endpoint:date===selected),'aria-current':date===today?'date':undefined,disabled:disabled.includes(date),'aria-label':year+'년 '+month+'월 '+day+'일','data-in-range':range?.end&&date>=range.start&&date<=range.end?'true':undefined})+'>';
  }).replace(/<button class="og-calendar-nav" type="button" aria-label="([^"]+)"[^>]*>/g,(_,label)=>'<button class="og-calendar-nav" type="button"'+attrs({'aria-label':label,'data-month-step':label==='이전 달'?-1:1,disabled:year===100&&month===1&&label==='이전 달'||year===9999&&month===12&&label==='다음 달'})+'>');
 const daysWrapped=html.replace(/(<div class="og-calendar-week">[\s\S]*<\/div>)(<\/div>)$/,(_,days,end)=>'<div class="v2-calendar-days" role="region" aria-label="달력 날짜" tabindex="0">'+days+'</div>'+end);
 return daysWrapped.replace(/<\/div>$/,()=>'<p class="og-picker-summary" data-picker-summary role="status">'+e(summary(selected,range))+'</p><p class="v2-picker-error" data-picker-error role="status"></p>'+footer(range?!!range.end:!!selected)+'<p class="v2-picker-applied" data-picker-applied role="status"></p></div>');
}
export function renderTimePicker({id=uid('v2-time'),selected=false,period='오전',hour='09',minute='30'}={}){
 if(!['오전','오후'].includes(period)||!/^\d{2}$/.test(hour)||Number(hour)<1||Number(hour)>12||!/^\d{2}$/.test(minute)||Number(minute)>59)throw new RangeError('Invalid clock value');
 if(typeof selected!=='boolean')throw new TypeError('Selected must be boolean');
 const controls=[['period','오전·오후',['오전','오후'],period],['hour','시',Array.from({length:12},(_,i)=>String(i+1).padStart(2,'0')),hour],['minute','분',Array.from({length:60},(_,i)=>String(i).padStart(2,'0')),minute]].map(([key,label,values,current])=>'<label>'+label+'<span class="v2-select-control"><select'+attrs({['data-time-'+key]:true,'aria-label':label})+'><option value=""'+(!selected?' selected':'')+'>선택</option>'+values.map(value=>'<option value="'+value+'"'+(selected&&value===current?' selected':'')+'>'+value+'</option>').join('')+'</select></span></label>').join('');
 return timePicker({selected,period,hour,minute}).replace('class="og-time-picker"',()=> 'class="og-time-picker v2-time-picker"'+attrs({id,'data-time-picker':true})).replace(/<div class="og-time-columns">[\s\S]*?<p class="og-picker-summary">/,()=>'<div class="og-time-columns">'+controls+'</div><p class="og-picker-summary" data-time-summary role="status">').replace(/<div class="og-picker-footer">[\s\S]*$/,()=>footer(selected)+'<p data-time-applied role="status"></p></div>');
}
const stage=html=>'<div class="v2-picker-stage"><div class="v2-picker-viewport">'+html+'</div></div>';
export function renderDateTimeSamples(){
 return '<section class="v2-component-section" id="date-picker" aria-labelledby="date-picker-title" hidden><h2 id="date-picker-title">날짜 선택</h2><p>달력은 평면으로 유지하고 선택한 날짜와 월 이동 버튼에만 얕은 재질을 줍니다.</p>'+stage(renderDatePicker({id:'v2-date-live',selected:'2026-09-18',today:'2026-09-16',disabled:['2026-09-22','2026-09-23']}))+'<p>예시 기준일 2026.09.16 · 22·23일은 선택 불가 예시입니다. 실제 예약 정책은 아닙니다.</p></section><section class="v2-component-section" id="range-picker" aria-labelledby="range-picker-title" hidden><h2 id="range-picker-title">기간 선택</h2><p>시작일과 종료일을 고릅니다. 월을 바꿔도 선택은 유지하며 역순 선택은 날짜 순으로 정리합니다.</p>'+stage(renderDatePicker({id:'v2-range-live',range:{start:'2026-09-25',end:'2026-10-06'},disabled:['2026-09-22','2026-09-23']}))+'<p>시작일·종료일은 둥근 선택으로, 중간 날짜는 연한 면으로 구분합니다. 선택 불가 날짜를 포함하면 적용하지 않습니다.</p></section><section class="v2-component-section" id="time-picker" aria-labelledby="time-picker-title" hidden><h2 id="time-picker-title">시간 선택</h2><p>오전·오후, 시, 분을 각각 선택합니다. 밝은 입력판 재질을 공유하고 기기의 기본 선택 조작을 유지합니다.</p>'+stage(renderTimePicker({id:'v2-time-live',selected:true}))+'<p>분 단위 선택은 검토용 예시입니다. 실제 예약·조회·저장은 하지 않습니다.</p></section>';
}
export function setupDateTimeSamples(root){
 for(const node of root.querySelectorAll('[data-date-picker]')){
  if(node.dataset.pickerReady||node.closest('[inert]'))continue;node.dataset.pickerReady='true';
  let year=Number(node.dataset.pickerYear),month=Number(node.dataset.pickerMonth),selected=node.dataset.pickerSelected||null,range=node.dataset.pickerRange?JSON.parse(node.dataset.pickerRange):null;
  const disabled=JSON.parse(node.dataset.pickerDisabled),today=node.dataset.pickerToday||null;
  let applied={selected,range:range?{...range}:null};
  const paint=(focusDate)=>{
   const holder=node.ownerDocument.createElement('div');holder.innerHTML=renderDatePicker({id:node.id,year,month,selected,today,disabled,range});node.innerHTML=holder.firstElementChild.innerHTML;
   if(focusDate)node.querySelector('[data-date="'+focusDate+'"]')?.focus({preventScroll:true});
  };
  node.addEventListener('click',event=>{
   const target=event.target.closest('button');if(!target||target.disabled)return;
   if(target.dataset.monthStep){({year,month}=shiftMonth(year,month,Number(target.dataset.monthStep)));paint();node.querySelector('[data-month-step="'+target.dataset.monthStep+'"]').focus({preventScroll:true});}
   else if(target.dataset.date){try{if(range)range=selectRange(range,target.dataset.date,disabled);else selected=target.dataset.date;paint(target.dataset.date);}catch{node.querySelector('[data-picker-error]').textContent='선택 불가 날짜가 포함되어 있어요. 다른 기간을 선택해 주세요.';}}
   else if(target.hasAttribute('data-picker-cancel')){selected=applied.selected;range=applied.range?{...applied.range}:null;paint();node.querySelector('[data-picker-cancel]').focus();node.querySelector('[data-picker-applied]').textContent='변경을 취소했습니다.';}
   else if(target.hasAttribute('data-picker-apply')){applied={selected,range:range?{...range}:null};node.querySelector('[data-picker-applied]').textContent='적용 예시 · '+summary(selected,range)+' · 실제 조회하지 않습니다.';}
  });
  node.addEventListener('keydown',event=>{
   const target=event.target.closest('[data-date]');if(!target)return;
   const delta={ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7}[event.key];if(!delta)return;event.preventDefault();
   let date=new Date(target.dataset.date+'T00:00:00Z');date.setUTCDate(date.getUTCDate()+delta);
   let next=date.toISOString().slice(0,10);while(disabled.includes(next)){date.setUTCDate(date.getUTCDate()+Math.sign(delta));next=date.toISOString().slice(0,10);}
   if(date.getUTCFullYear()<100||date.getUTCFullYear()>9999)return;year=date.getUTCFullYear();month=date.getUTCMonth()+1;paint(next);
  });
 }
 for(const node of root.querySelectorAll('[data-time-picker]')){
  if(node.dataset.timeReady)continue;node.dataset.timeReady='true';const controls=[...node.querySelectorAll('select')];let applied=controls.map(c=>c.value);
  const sync=()=>{const ready=controls.every(c=>c.value);node.querySelector('[data-picker-apply]').disabled=!ready;node.querySelector('[data-time-summary]').textContent=ready?'선택한 시간 · '+controls[0].value+' '+controls[1].value+':'+controls[2].value:'시간을 선택해 주세요.';};
  node.addEventListener('change',()=>{sync();node.querySelector('[data-time-applied]').textContent='';});
  node.addEventListener('click',event=>{if(event.target.closest('[data-picker-cancel]')){controls.forEach((c,i)=>c.value=applied[i]);sync();node.querySelector('[data-time-applied]').textContent='변경을 취소했습니다.';}else if(event.target.closest('[data-picker-apply]')){applied=controls.map(c=>c.value);node.querySelector('[data-time-applied]').textContent='적용 예시 · 실제 예약하지 않습니다.';}});
 }
}
